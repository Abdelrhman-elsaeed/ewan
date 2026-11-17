(() => {
  const frame = document.getElementById('school-cinema');
  const player = frame.querySelector('iframe');
  const chapters = [...frame.querySelectorAll('[data-chapter]')];
  const toggle = frame.querySelector('.cinema-toggle');
  const restart = frame.querySelector('.cinema-restart');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let current=0;
  let visible=false;
  let paused=false;
  let motionAllowed=!reduced.matches;
  let ready=false;
  const copy=()=>window.EWAN_FILM_COPY[document.documentElement.lang];

  function command(action,details={}) {
    if (!ready) return;
    player.contentWindow.postMessage({type:'ewan-film-command',action,...details},location.origin==='null'?'*':location.origin);
  }
  function isPlaying() { return visible&&!paused&&motionAllowed&&!document.hidden; }
  function playback() {
    const playing=isPlaying();
    command(playing?'play':'pause');
    toggle.dataset.playing=String(playing);
    toggle.setAttribute('aria-label',playing?copy().pause:copy().play);
    toggle.title=playing?copy().pause:copy().play;
  }
  function updateChapter(index,progress=0) {
    current=index;
    frame.dataset.chapter=String(index);
    chapters.forEach((button,i)=>{
      button.setAttribute('aria-selected',String(i===index));
      button.tabIndex=i===index?0:-1;
      button.style.setProperty('--chapter-progress',String(i===index?progress:0));
    });
    frame.querySelector('.cinema-caption').textContent=copy().scenes[index].title.replace('<br>',' ')+' '+copy().scenes[index].body;
  }
  function seek(index) {
    updateChapter(index);
    command('seek',{chapter:index,still:!isPlaying()});
    playback();
  }
  function language() {
    const c=copy();
    document.querySelectorAll('[data-film-text]').forEach(node=>{node.innerHTML=c[node.dataset.filmText];});
    chapters.forEach((button,i)=>{button.querySelector('span').textContent=c.chapters[i];});
    frame.querySelector('[role="tablist"]').setAttribute('aria-label',c.sceneLabel);
    restart.setAttribute('aria-label',c.replay);
    restart.title=c.replay;
    player.title=c.sceneLabel;
    ready=false;
    player.src='assets/school-film/index.html?embed=1&lang='+document.documentElement.lang+'&theme='+document.documentElement.dataset.theme;
    playback();
  }
  addEventListener('message',event=>{
    if(event.source!==player.contentWindow) return;
    if(event.data?.type==='ewan-film-ready') {
      ready=true;
      command('theme',{theme:document.documentElement.dataset.theme});
      seek(current);
    } else if(event.data?.type==='ewan-film-state'&&Number.isInteger(event.data.chapter)&&event.data.chapter>=0&&event.data.chapter<6) {
      updateChapter(event.data.chapter,Math.max(0,Math.min(1,Number(event.data.progress)||0)));
    }
  });
  chapters.forEach((button,index)=>{
    button.addEventListener('click',()=>seek(index));
    button.addEventListener('keydown',event=>{
      const direction=document.documentElement.dir==='rtl'?-1:1;
      const selected={Home:0,End:5,ArrowRight:current+direction,ArrowLeft:current-direction}[event.key];
      if(selected===undefined)return;
      event.preventDefault();
      const next=(selected+6)%6;
      seek(next);
      chapters[next].focus({preventScroll:true});
    });
  });
  toggle.addEventListener('click',()=>{
    if(!motionAllowed) {
      motionAllowed=true;
      paused=false;
    } else paused=!paused;
    playback();
  });
  restart.addEventListener('click',()=>seek(0));
  new IntersectionObserver(entries=>{
    visible=entries.some(entry=>entry.isIntersecting);
    playback();
  },{threshold:.15}).observe(frame);
  document.addEventListener('visibilitychange',playback);
  reduced.addEventListener('change',()=>{
    motionAllowed=!reduced.matches;
    if(!motionAllowed)command('seek',{chapter:current,still:true});
    playback();
  });
  document.addEventListener('ewan:language',language);
  document.addEventListener('ewan:theme',()=>command('theme',{theme:document.documentElement.dataset.theme}));
  document.querySelectorAll('[data-school-jump]').forEach(link=>link.addEventListener('click',()=>{
    seek(link.dataset.schoolJump==='files'?3:0);
  }));
  document.querySelectorAll('[data-project-type]').forEach(link=>link.addEventListener('click',()=>{
    document.getElementById('project-type').value=link.dataset.projectType;
  }));
  language();
})();
