(() => {
  if (new URLSearchParams(location.search).get('embed') !== '1') return;
  const film = window.EwanSchoolFilm;
  const { timeline, beat, total } = film;
  let lastTick = -1;
  let chapter = -1;
  function emit() {
    const time = timeline.time();
    const next = Math.min(5,Math.floor(time/beat));
    const tick = Math.floor(time*8);
    if (next!==chapter) {
      chapter=next;
      document.querySelectorAll('.film-scene').forEach((scene,i)=>scene.setAttribute('aria-hidden',String(i!==chapter)));
    }
    if (tick===lastTick) return;
    lastTick=tick;
    parent.postMessage({type:'ewan-film-state',chapter,progress:(time-chapter*beat)/beat},location.origin==='null'?'*':location.origin);
  }
  timeline.repeat(-1).eventCallback('onUpdate',emit);
  addEventListener('message', event=>{
    if (event.source!==parent || event.data?.type!=='ewan-film-command') return;
    const {action,chapter:requested,still}=event.data;
    if (action==='theme'&&(event.data.theme==='light'||event.data.theme==='dark')) document.documentElement.dataset.theme=event.data.theme;
    if (action==='play') timeline.play();
    if (action==='pause') timeline.pause();
    if (action==='seek'&&Number.isInteger(requested)&&requested>=0&&requested<=5) {
      timeline.time(requested*beat+(still?5.6:.2));
      lastTick=-1;
      emit();
    }
  });
  timeline.time(.2);
  parent.postMessage({type:'ewan-film-ready'},location.origin==='null'?'*':location.origin);
  emit();
})();
