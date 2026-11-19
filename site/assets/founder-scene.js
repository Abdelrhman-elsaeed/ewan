// Local, progressively loaded WebGL installation. All meaningful copy remains in HTML.
const host = document.querySelector('.workbench-scene');
let started = false;
const loader = new IntersectionObserver(entries => {
  if (!started && entries.some(e => e.isIntersecting)) {
    started = true; loader.disconnect(); build().catch(() => { host.dataset.sceneState = 'fallback'; });
  }
}, {rootMargin:'350px'});
loader.observe(host);

async function build() {
  const THREE = await import('./vendor/three.module.min.js');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const fine = matchMedia('(hover:hover) and (pointer:fine)');
  const renderer = new THREE.WebGLRenderer({canvas:host.querySelector('canvas'),alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-6,6,3,-3,.1,60);
  camera.position.set(0,5.8,13); camera.lookAt(0,1.25,0);
  const rig = new THREE.Group(); scene.add(rig);

  // Broad studio reflection panels give the bevels a physical highlight.
  const envCanvas = document.createElement('canvas'); envCanvas.width=1024; envCanvas.height=512;
  const e=envCanvas.getContext('2d');
  const grad=e.createLinearGradient(0,0,0,512);grad.addColorStop(0,'#e9fff2');grad.addColorStop(.38,'#5f8275');grad.addColorStop(.55,'#112820');grad.addColorStop(1,'#1a342a');e.fillStyle=grad;e.fillRect(0,0,1024,512);
  e.fillStyle='#f5fff9';e.fillRect(90,40,100,240);e.fillRect(650,50,210,110);e.fillStyle='#9cd6bb';e.fillRect(350,70,25,300);
  const env=new THREE.CanvasTexture(envCanvas);env.mapping=THREE.EquirectangularReflectionMapping;
  const pmrem=new THREE.PMREMGenerator(renderer);scene.environment=pmrem.fromEquirectangular(env).texture;env.dispose();pmrem.dispose();

  const metal=new THREE.MeshPhysicalMaterial({color:0x335d4a,metalness:.82,roughness:.25,clearcoat:.8,clearcoatRoughness:.2,envMapIntensity:1.1});
  const dark=new THREE.MeshPhysicalMaterial({color:0x0c251d,metalness:.62,roughness:.34,clearcoat:.65});
  const paper=new THREE.MeshPhysicalMaterial({color:0xd6eee2,metalness:.12,roughness:.48,clearcoat:.3});
  const silver=new THREE.MeshPhysicalMaterial({color:0xd9f7e7,metalness:.72,roughness:.2,clearcoat:1});
  const accent=new THREE.MeshStandardMaterial({color:0x8ee8bd,emissive:0x38ad76,emissiveIntensity:.8,metalness:.3,roughness:.22});
  const ink=new THREE.MeshStandardMaterial({color:0x40765c,roughness:.7});
  function rounded(w,h,d,r,mat) {
    const x=-w/2,y=-h/2,shape=new THREE.Shape();
    shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
    const g=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:3,steps:1,curveSegments:8});g.translate(0,0,-d/2);
    const mesh=new THREE.Mesh(g,mat);mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
  }
  function at(mesh,x,y,z,parent=rig){mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(35,30),new THREE.ShadowMaterial({opacity:.25}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=-.05;rig.add(floor);
  const hemi=new THREE.HemisphereLight(0xd7ffeb,0x132b20,2.5);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xf1fff6,3);key.position.set(-4,8,6);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=6;key.shadow.camera.bottom=-6;key.shadow.normalBias=.025;scene.add(key);
  const rim=new THREE.DirectionalLight(0x70e9b6,2);rim.position.set(5,4,-3);scene.add(rim);
  const pointerLight=new THREE.PointLight(0xd6ffe9,18,15,2);pointerLight.position.set(0,4,5);scene.add(pointerLight);

  const files=new THREE.Group(),core=new THREE.Group(),screen=new THREE.Group();rig.add(files,core,screen);
  const sheets=[];
  for(let n=0;n<3;n++){
    const sheet=new THREE.Group();
    at(rounded(1.2,1.6,.035,.06,paper),0,0,0,sheet);
    for(let k=0;k<5;k++)at(rounded(k===0?.55:.72-(k%2)*.16,.028,.008,.007,ink),-.03,.45-k*.18,.04,sheet);
    at(rounded(.18,.16,.015,.025,accent),.33,.5,.047,sheet);
    sheet.position.set((n-1)*.24,1.6+n*.15,(n-1)*.18);sheet.rotation.set(0,(n-1)*.12,(n-1)*-.13);sheet.userData.baseY=sheet.position.y;files.add(sheet);sheets.push(sheet);
  }
  at(rounded(1.9,.2,1.2,.08,metal),0,.18,0,files);
  const fileTab=at(rounded(.5,.08,.17,.03,accent),0,.31,.45,files);
  at(rounded(1.87,2.05,.42,.18,dark),0,1.65,0,core);
  at(rounded(1.7,1.9,.035,.13,metal),0,1.65,.245,core);
  // Ewan's actual nested portal mark, extruded with beveled edges.
  const polygons=[[2,122,2,17,87,17,87,23,8,23,8,119],[15,116,15,30,87,30,87,36,21,36,21,113],[28,111,28,42,87,42,87,109,81,107,81,48,34,48,34,108],[41,105,41,55,74,55,74,105,68,103,68,61,47,61,47,103],[94,41,100,41,100,116,94,113],[107,41,113,41,113,122,107,119],[94,15,113,15,113,34,94,34],[115,1,128,1,128,14,115,14]];
  const mark=new THREE.Group();
  polygons.forEach((p,n)=>{const shape=new THREE.Shape();shape.moveTo((p[0]-65)/88,(63-p[1])/88);for(let k=2;k<p.length;k+=2)shape.lineTo((p[k]-65)/88,(63-p[k+1])/88);shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth:.09,bevelEnabled:true,bevelThickness:.012,bevelSize:.008,bevelSegments:3,steps:1});mark.add(new THREE.Mesh(g,n>5?accent:silver));});mark.position.set(0,1.68,.3);core.add(mark);
  const coreBase=new THREE.Mesh(new THREE.CylinderGeometry(1.18,1.25,.2,80),metal);coreBase.castShadow=true;coreBase.receiveShadow=true;at(coreBase,0,.2,0,core);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.19,.018,8,80),accent);ring.rotation.x=Math.PI/2;at(ring,0,.29,0,core);
  for(const x of [-.7,.7])for(const y of [.86,2.42]){const screw=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,.017,12),silver);screw.rotation.x=Math.PI/2;at(screw,x,y,.29,core);}
  for(let i=0;i<3;i++)at(new THREE.Mesh(new THREE.SphereGeometry(.025,12,8),accent),-.12+i*.12,.83,.29,core);

  at(rounded(3.35,2.3,.2,.13,dark),0,1.55,0,screen);
  at(rounded(3.25,2.2,.035,.1,metal),0,1.55,.12,screen);
  const loader=new THREE.TextureLoader();
  const texture=await loader.loadAsync(new URL('./alfalah-home.webp',import.meta.url).href);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const display=new THREE.Mesh(new THREE.PlaneGeometry(3.08,1.78),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));at(display,0,1.54,.19,screen);
  for(let i=0;i<3;i++)at(new THREE.Mesh(new THREE.SphereGeometry(.022,10,8),accent),-1.39+i*.1,2.55,.16,screen);
  at(rounded(.75,.04,.02,.015,ink),.03,2.55,.16,screen);
  at(rounded(.15,.4,.15,.04,metal),0,.27,0,screen);at(rounded(1.45,.11,.8,.055,metal),0,.07,0,screen);
  const glass=new THREE.MeshPhysicalMaterial({color:0x7bb89a,transparent:true,opacity:.72,metalness:.12,roughness:.17,clearcoat:1,depthWrite:false});
  const summary=new THREE.Group();summary.rotation.y=-.25;
  at(rounded(.92,.88,.045,.07,glass),0,0,0,summary);
  for(let i=0;i<3;i++){
    at(rounded(.4-i*.06,.035,.009,.01,silver),.08,.23-i*.21,.055,summary);
    at(new THREE.Mesh(new THREE.SphereGeometry(.035,12,8),accent),-.28,.23-i*.21,.06,summary);
  }
  summary.position.set(-1.38,.85,.58);screen.add(summary);

  let wires=[],paths=[],packets=[];
  const wireMat=new THREE.MeshStandardMaterial({color:0x367d5b,metalness:.6,roughness:.35});
  function connect(a,b) {
    const control1=a.clone().lerp(b,.33);control1.z+=.27;
    const control2=a.clone().lerp(b,.66);control2.z+=.27;
    const path=new THREE.CubicBezierCurve3(a,control1,control2,b);paths.push(path);
    const wire=new THREE.Mesh(new THREE.TubeGeometry(path,40,.025,8,false),wireMat);rig.add(wire);wires.push(wire);
    for(let n=0;n<2;n++){const dot=new THREE.Mesh(new THREE.SphereGeometry(.055,12,8),accent);dot.userData={path,offset:n*.5};rig.add(dot);packets.push(dot);}
  }
  let narrow=false,visible=false,raf=0,last=0,px=0,py=0,currentX=0,currentY=0;
  function layout() {
    const width=host.clientWidth,height=host.clientHeight;narrow=width<650;
    renderer.setSize(width,height,false);
    const world=narrow?8.2:11.7;
    camera.left=-world/2;camera.right=world/2;camera.top=world/(width/height)/2;camera.bottom=-camera.top;camera.updateProjectionMatrix();
    const sign=document.documentElement.lang==='ar'?1:-1;
    files.position.set(sign*(narrow?2.35:3.65),narrow?.3:0,narrow?-.4:0);files.scale.setScalar(narrow?.76:.95);files.rotation.y=sign*-.3;
    core.position.set(0,narrow?.7:0,-.25);core.scale.setScalar(narrow?.86:1);core.rotation.y=sign*-.16;
    screen.position.set(-sign*(narrow?1.9:3.55),narrow?-.15:0,narrow?.6:0);screen.scale.setScalar(narrow?.8:1);screen.rotation.y=sign*.23;
    wires.forEach(w=>{rig.remove(w);w.geometry.dispose();});packets.forEach(p=>{rig.remove(p);p.geometry.dispose();});wires=[];packets=[];paths=[];
    const socket=narrow?1:1.15;
    connect(new THREE.Vector3(files.position.x,.35,0),new THREE.Vector3(sign*socket,.25,.15));connect(new THREE.Vector3(-sign*socket,.25,.15),new THREE.Vector3(screen.position.x,.15,.1));
    renderAt(0);
  }
  function renderAt(t) {
    const motion=reduced.matches?0:1;
    currentX+=(px-currentX)*.09;currentY+=(py-currentY)*.09;
    rig.rotation.y=currentX*.065*motion;rig.rotation.x=currentY*.025*motion;
    pointerLight.position.x=currentX*4;pointerLight.position.y=4-currentY*2;
    sheets.forEach((s,i)=>{s.position.y=s.userData.baseY+Math.sin(t*.8+i*1.4)*.055*motion;s.rotation.z=(i-1)*-.13+Math.sin(t*.6+i)*.018*motion;});
    mark.rotation.y=Math.sin(t*.45)*.035*motion;
    packets.forEach(dot=>{dot.position.copy(dot.userData.path.getPointAt((t*.2+dot.userData.offset)%1));});
    renderer.render(scene,camera);
  }
  function tick(now) {raf=0;if(!visible||document.hidden||reduced.matches)return;if(now-last>32){renderAt(now*.001);last=now;}raf=requestAnimationFrame(tick);}
  function resume(){cancelAnimationFrame(raf);raf=0;if(visible&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(tick);else renderAt(0);}
  function theme(){const light=document.documentElement.dataset.theme==='light';hemi.intensity=light?3.2:2.5;metal.color.set(light?0x52765b:0x335d4a);dark.color.set(light?0x183c2c:0x0c251d);floor.material.opacity=light?.16:.25;renderer.toneMappingExposure=light?1.2:1.25;renderAt(0);}
  const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);resume();});observer.observe(host);
  new ResizeObserver(layout).observe(host);
  host.addEventListener('pointermove',event=>{if(reduced.matches||!fine.matches)return;const box=host.getBoundingClientRect();px=(event.clientX-box.left)/box.width*2-1;py=(event.clientY-box.top)/box.height*2-1;},{passive:true});
  host.addEventListener('pointerleave',()=>{px=py=0;});
  document.addEventListener('ewan:theme',theme);document.addEventListener('ewan:language',layout);document.addEventListener('visibilitychange',resume);reduced.addEventListener('change',resume);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();cancelAnimationFrame(raf);host.dataset.sceneState='fallback';});
  layout();theme();host.dataset.sceneState='ready';resume();
  window.EwanFounderScene={renderAt,get visible(){return visible;},get animating(){return Boolean(raf);},get meshes(){let n=0;scene.traverse(o=>{if(o.isMesh)n++;});return n;}};
}
