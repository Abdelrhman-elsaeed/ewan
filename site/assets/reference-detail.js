(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const desktop = matchMedia('(hover:hover) and (pointer:fine)');
  const band = document.querySelector('.capability-band');
  const tracks = [...band.querySelectorAll('.capability-track')];
  let beltTimer;

  async function buildBelts() {
    await (window.EWAN_FONTS_READY || document.fonts.ready).catch(() => {});
    for (const track of tracks) {
      track.querySelectorAll(':scope > [aria-hidden="true"]').forEach(node => node.remove());
      const group = track.firstElementChild;
      group.querySelectorAll('[data-belt-repeat]').forEach(node => node.remove());
      const originals = [...group.children];
      let rounds = 0;
      while (group.getBoundingClientRect().width < innerWidth + 100 && rounds++ < 5) {
        for (const original of originals) {
          const repeat = original.cloneNode(true);
          repeat.dataset.beltRepeat = '';
          repeat.setAttribute('aria-hidden', 'true');
          group.append(repeat);
        }
      }
      const copy = group.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true'); copy.inert = true;
      track.append(copy);
    }
  }
  document.addEventListener('ewan:language', buildBelts);
  addEventListener('resize', () => { clearTimeout(beltTimer); beltTimer = setTimeout(buildBelts,150); });
  new IntersectionObserver(entries => { band.dataset.inview = String(entries[0].isIntersecting); }).observe(band);
  buildBelts();

  const surfaces = [...document.querySelectorAll('.work-card,.video-story,.process-stage,.contact-form')];
  surfaces.forEach(node => node.classList.add('ewan-edge'));
  const edges = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('edge-visible',entry.isIntersecting)));
  surfaces.forEach(node => edges.observe(node));
  document.addEventListener('visibilitychange', () => root.classList.toggle('reference-page-hidden',document.hidden));

  // A field of broken portal outlines, distinct from the reference's capsule particles.
  const canvas = document.querySelector('.portal-texture');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const exclusions = '.hero-symbol,#hero-title,.hero-tagline,.hero-description,.hero-actions,.nav-shell,.work-card,.project-lamp,.process-stage,.cinema-frame,.contact-form,.proof-section,.capability-band,.featured-client,.video-story,.section-intro,.about-inner,.site-footer';
  let boxes = [], width = 0, height = 0, frame = 0, layoutFrame = 0;
  let target = {x:-1000,y:-1000}, pointer = {x:-1000,y:-1000};
  let energy = 0, lastMove = 0, lastTick = 0;
  const allowed = () => desktop.matches && !reduced.matches && !document.hidden;
  function layout() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1,1.5);
    const pixelWidth = Math.round(width*dpr), pixelHeight = Math.round(height*dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) { canvas.width = pixelWidth; canvas.height = pixelHeight; }
    ctx.setTransform(dpr,0,0,dpr,0,0);
    boxes = [...document.querySelectorAll(exclusions)].map(node => node.getBoundingClientRect()).filter(b => b.bottom>0 && b.top<height);
    draw();
  }
  function draw() {
    ctx.clearRect(0,0,width,height);
    if (!allowed()) return;
    const light = root.dataset.theme === 'light';
    const rgb = light ? '25,95,71' : '163,222,206';
    ctx.lineWidth = .85;
    for (let row=0,y=18;y<height+30;row++,y+=43) {
      for (let col=0,x=20+(row%2)*21;x<width+30;col++,x+=43) {
        if (boxes.some(b => x>b.left-9 && x<b.right+9 && y>b.top-9 && y<b.bottom+9)) continue;
        const dx=x-pointer.x, dy=y-pointer.y, distance=Math.hypot(dx,dy);
        const influence=Math.max(0,1-distance/265)*energy;
        const hash=(col*13+row*7)%9;
        const length=4+hash*.5;
        const push=influence*influence*18;
        const px=x+(distance?dx/distance:0)*push, py=y+(distance?dy/distance:0)*push;
        ctx.save(); ctx.translate(px,py); ctx.rotate((hash%4)*Math.PI/2 + influence*.38);
        ctx.strokeStyle=`rgba(${rgb},${(light?.055:.065)+influence*.35})`;
        ctx.beginPath();ctx.moveTo(-length*.5,length*.5);ctx.lineTo(-length*.5,-length*.5);ctx.lineTo(length*.5,-length*.5);ctx.stroke();
        if(influence>.24) {ctx.globalAlpha=influence*.7;ctx.beginPath();ctx.moveTo(-length*.5+3,length*.5);ctx.lineTo(-length*.5+3,-length*.5+3);ctx.lineTo(length*.5,-length*.5+3);ctx.stroke();}
        ctx.restore();
      }
    }
  }
  function tick(time) {
    frame=0;
    if(!allowed()) {ctx.clearRect(0,0,width,height);return;}
    if(time-lastTick<28) {frame=requestAnimationFrame(tick);return;}
    lastTick=time;
    pointer.x+=(target.x-pointer.x)*.2; pointer.y+=(target.y-pointer.y)*.2;
    if(time-lastMove>100) energy*=.92;
    draw();
    if(energy>.015)frame=requestAnimationFrame(tick);
    else {energy=0;draw();}
  }
  document.addEventListener('pointermove', event => {
    if(!allowed()||event.pointerType!=='mouse')return;
    target={x:event.clientX,y:event.clientY};
    if(pointer.x<-500)pointer={...target};
    energy=1;lastMove=performance.now();
    if(!frame)frame=requestAnimationFrame(tick);
  },{passive:true});
  function refreshLayout() {if(layoutFrame)return;layoutFrame=requestAnimationFrame(()=>{layoutFrame=0;layout();});}
  addEventListener('resize',refreshLayout);
  addEventListener('scroll',refreshLayout,{passive:true});
  document.addEventListener('ewan:theme',draw);
  document.addEventListener('ewan:language',()=>document.fonts.ready.then(refreshLayout));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else refreshLayout();});
  reduced.addEventListener('change',()=>{energy=0;cancelAnimationFrame(frame);frame=0;refreshLayout();});
  desktop.addEventListener('change',refreshLayout);
  (window.EWAN_FONTS_READY||document.fonts.ready).finally(refreshLayout);
})();
