(() => {
  const mark = document.querySelector('.hero-symbol');
  const canvas = mark.querySelector('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  const size = canvas.width;
  const inset = size / 8;
  const logoScale = (size - 2 * inset) / 136;
  const shapes = [
    ['#eff7f5', [2,122, 2,17, 87,17, 87,23, 8,23, 8,119]],
    ['#eff7f5', [15,116, 15,30, 87,30, 87,36, 21,36, 21,113]],
    ['#eff7f5', [28,111, 28,42, 87,42, 87,109, 81,107, 81,48, 34,48, 34,108]],
    ['#eff7f5', [41,105, 41,55, 74,55, 74,105, 68,103, 68,61, 47,61, 47,103]],
    ['#a3dece', [94,41, 100,41, 100,116, 94,113]],
    ['#a3dece', [107,41, 113,41, 113,122, 107,119]],
    ['#4fe0b0', [94,15, 113,15, 113,34, 94,34]],
    ['#4fe0b0', [115,1, 128,1, 128,14, 115,14]]
  ];

  context.setTransform(logoScale, 0, 0, logoScale, inset + 3 * logoScale, inset + 6 * logoScale);
  for (const [color, polygon] of shapes) {
    context.beginPath();
    context.moveTo(polygon[0], polygon[1]);
    for (let n = 2; n < polygon.length; n += 2) context.lineTo(polygon[n], polygon[n + 1]);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }
  context.setTransform(1, 0, 0, 1, 0, 0);
  const source = context.getImageData(0, 0, size, size).data;
  const lightSource = new Uint8ClampedArray(source);
  for (let k = 0; k < source.length; k += 4) {
    const color = source[k] > 220 ? [32,92,65] : source[k] > 100 ? [38,109,79] : [20,130,85];
    lightSource[k] = color[0]; lightSource[k + 1] = color[1]; lightSource[k + 2] = color[2];
  }
  let lightTheme = document.documentElement.dataset.theme === 'light';
  const output = context.createImageData(size, size);

  // Measure from each pixel to the opposite side of the silhouette.
  function distanceField(walkInside) {
    const distance = new Float32Array(size * size);
    const diagonal = Math.SQRT2;
    for (let i = 0; i < distance.length; i++) {
      distance[i] = (source[i * 4 + 3] >= 128) === walkInside ? size : 0;
    }
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        const i = y * size + x;
        distance[i] = Math.min(distance[i], distance[i - 1] + 1, distance[i - size] + 1,
          distance[i - size - 1] + diagonal, distance[i - size + 1] + diagonal);
      }
    }
    for (let y = size - 2; y > 0; y--) {
      for (let x = size - 2; x > 0; x--) {
        const i = y * size + x;
        distance[i] = Math.min(distance[i], distance[i + 1] + 1, distance[i + size] + 1,
          distance[i + size - 1] + diagonal, distance[i + size + 1] + diagonal);
      }
    }
    return distance;
  }

  const inside = distanceField(true);
  const outside = distanceField(false);
  const bevelWidth = 3.9;
  const relief = inside.map(distance => {
    const t = Math.min(1, Math.max(0, distance - .55) / bevelWidth);
    return 3.45 * Math.sqrt(t * (2 - t));
  });
  const material = [];
  const spill = [];
  for (let i = 0; i < inside.length; i++) {
    const x = i % size;
    const y = Math.floor(i / size);
    if (source[i * 4 + 3] > 0) {
      const nx = (relief[i - 1] - relief[i + 1]) * .5;
      const ny = (relief[i - size] - relief[i + size]) * .5;
      const length = Math.sqrt(nx * nx + ny * ny + 1);
      material.push({ i, x, y, nx: nx / length, ny: ny / length, nz: 1 / length });
    } else if (outside[i] <= 22) {
      const falloff = outside[i] / 8.8;
      spill.push({ i, x, y, softEdge: Math.exp(-falloff * falloff) });
    }
  }

  function shade(lightX, lightY) {
    const rgba = output.data;
    const face = lightTheme ? lightSource : source;
    const depth = 72;
    const radiusSquared = 125 * 125;
    const castX = Math.round((size * .5 - lightX) * .048);
    const castY = Math.round((size * .5 - lightY) * .048);
    const offset = castX + castY * size;

    for (const pixel of spill) {
      const { i, x, y, softEdge } = pixel;
      const dx = lightX - x;
      const dy = lightY - y;
      const proximity = 1 / (1 + (dx * dx + dy * dy) / radiusSquared);
      const inShadow = Math.max(0, 1 - outside[i - offset] / 5);
      const reflected = softEdge * proximity * proximity * 125;
      const coverage = reflected + inShadow * 49;
      const color = coverage > 0 ? reflected / coverage : 0;
      const k = i * 4;
      rgba[k] = (lightTheme ? 34 : 103) * color;
      rgba[k + 1] = (lightTheme ? 117 : 220) * color;
      rgba[k + 2] = (lightTheme ? 76 : 186) * color;
      rgba[k + 3] = coverage;
    }

    for (const pixel of material) {
      const { i, x, y, nx, ny, nz } = pixel;
      const dx = lightX - x;
      const dy = lightY - y;
      const planar = dx * dx + dy * dy;
      const length = Math.sqrt(planar + depth * depth);
      const lz = depth / length;
      const facing = (nx * dx + ny * dy) / length + nz * lz;
      const distance = 1 / (1 + planar / radiusSquared);
      const diffuse = Math.max(0, facing) * distance;
      const halfway = Math.max(0, (facing + nz) / Math.sqrt(2 + 2 * lz));
      const specular = Math.pow(halfway, 21) * distance;
      const luminance = .57 + .56 * diffuse;
      // Curved bevels catch the moving source more strongly than the flat face.
      const rim = Math.sqrt(nx * nx + ny * ny);
      const edgeShine = Math.pow(Math.max(0, facing), 5) * rim * distance * 120;
      const gloss = lightTheme ? 40 * specular + edgeShine * .45 : 105 * specular + edgeShine;
      const k = i * 4;
      rgba[k] = face[k] * luminance + gloss * .76;
      rgba[k + 1] = face[k + 1] * luminance + gloss;
      rgba[k + 2] = face[k + 2] * luminance + gloss * .89;
      rgba[k + 3] = source[k + 3];
    }
    context.putImageData(output, 0, 0);
  }

  const hero = mark.closest('.hero');
  const desktop = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const restingX = size * .38;
  const restingY = size * .29;
  let aimX = restingX;
  let aimY = restingY;
  let lightX = aimX;
  let lightY = aimY;
  let frame = 0;
  let previous = 0;
  const isScrolling = () => document.documentElement.classList.contains('lenis-scrolling');

  function tick(time) {
    frame = 0;
    if (isScrolling()) return;
    const blend = 1 - Math.exp(-Math.min(45, time - previous) / 58);
    previous = time;
    const settled = Math.hypot(aimX - lightX, aimY - lightY) < .7;
    lightX = settled ? aimX : lightX + (aimX - lightX) * blend;
    lightY = settled ? aimY : lightY + (aimY - lightY) * blend;
    shade(lightX, lightY);
    if (!settled) frame = requestAnimationFrame(tick);
  }

  function moveTo(x, y) {
    aimX = x;
    aimY = y;
    if (frame) return;
    previous = performance.now();
    frame = requestAnimationFrame(tick);
  }

  shade(lightX, lightY);
  mark.classList.add('has-relief');
  hero.addEventListener('pointermove', event => {
    if (!desktop.matches || reduced.matches || event.pointerType !== 'mouse' || isScrolling()) return;
    const box = mark.getBoundingClientRect();
    const dx = (event.clientX - box.left - box.width / 2) / Math.max(box.width, 190);
    const dy = (event.clientY - box.top - box.height / 2) / Math.max(box.height, 190);
    const clamp = value => Math.max(-1.12, Math.min(1.12, value));
    moveTo(size * (.5 + .37 * clamp(dx)), size * (.5 + .37 * clamp(dy)));
  }, { passive: true });
  hero.addEventListener('pointerleave', () => moveTo(restingX, restingY));
  document.addEventListener('ewan:theme', () => {
    lightTheme = document.documentElement.dataset.theme === 'light';
    shade(lightX, lightY);
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    cancelAnimationFrame(frame);
    frame = 0;
    lightX = aimX = restingX;
    lightY = aimY = restingY;
    shade(lightX, lightY);
  });
})();
