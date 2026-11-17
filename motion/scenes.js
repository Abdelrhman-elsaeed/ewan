(() => {
  const root = document.getElementById('ewan-school-film');
  const language = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ar';
  document.documentElement.lang = language;
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  const c = EWAN_FILM_COPY[language];
  const u = c.ui;
  const beat = 11;
  const pill = (label, style = '') => `<span class="pill ${style}">${label}</span>`;
  const sheetHead = (title, subtitle = u.school) => `<div class="sheet-head"><div class="sheet-identity"><i></i><span>${title}</span></div><small>${subtitle}</small><span class="sheet-dots"><b></b><b></b><b></b></span></div>`;
  const table = (heads, rows) => `<table class="data-table"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>`<${i===0?'th':'td'}>${cell}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</tbody></table>`;
  const route = (id, d) => `<svg class="route-diagram" viewBox="0 0 600 440" fill="none" aria-hidden="true"><defs><marker id="arrow-${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L8 5L1 9" fill="none" stroke="currentColor" stroke-width="1.5"/></marker></defs><path class="route-track" d="${d}"/><path class="route-draw" pathLength="1" d="${d}" marker-end="url(#arrow-${id})"/></svg>`;

  function attendance() {
    return `<div class="attendance-sheet sheet">
      ${sheetHead(u.attendance)}
      <div class="sheet-context"><span>${u.school}</span><b>08:05</b></div>
      ${table([u.student,u.status,u.follow], u.studentNames.slice(0,3).map((name,i)=>[name,pill([u.present,u.absent,u.late][i],['','warm','warm'][i]),i>0?`<span class="follow-status">${u.needsFollow}</span>`:u.logged]))}
      <div class="sheet-summary"><span>${pill('1','mint')} ${u.present}</span><span>${pill('1','warm')} ${u.absent}</span><span>${pill('1','warm')} ${u.late}</span></div>
    </div>
    ${route('attendance','M430 170C560 170 510 350 300 350L200 350')}
    <div class="phone-card"><div class="phone-speaker"></div><div class="phone-head"><i>ف</i><span>${u.guardian}</span><b>08:05</b></div>
      <div class="phone-notice"><span class="notification-dot"></span><b>${u.notification}</b><p>${u.message}</p><span class="phone-notice-time">08:05</span></div>
    </div>
    <div class="departure-note"><span class="check-sign">✓</span><div><b>${u.exit}</b><span>${u.exitDetail}</span></div></div>`;
  }

  function support() {
    return `<div class="profile-card sheet">
      ${sheetHead(u.profile)}
      <div class="student-profile"><div class="student-avatar"><i></i><b></b></div><div><strong>${u.studentNames[1]}</strong><p>${u.skill}</p></div></div>
      <div class="merit-pills">${pill(u.merit,'mint')}${pill(u.deduction,'warm')}</div>
      <div class="skill-gauge"><span>${u.progress}</span><div><i></i></div><b>32% <span>→</span> 76%</b></div>
    </div>
    ${route('support','M425 155C425 245 250 200 250 300')}
    <div class="plan-sheet sheet">
      ${sheetHead(u.plan,u.review)}
      ${table(u.planHeads,u.planRows)}
      <div class="plan-result"><span>✓</span>${u.planNote}</div>
    </div>
    <div class="target-label">${u.goal}<strong>${u.skill}</strong></div>`;
  }

  function timetable() {
    const body = u.days.map((day,i)=>[day,...u.periods.map((_,j)=>{
      const subject = u.subjects[(i+j)%u.subjects.length];
      if(i===1&&j===2) return `<div class="period conflict-period"><span class="conflict-old">${u.clash}</span><b class="conflict-new">${u.subjects[4]}</b><small class="conflict-new">${u.teacher} 04</small></div>`;
      return `<div class="period"><b>${subject}</b><small>${u.teacher} 0${(i+j)%4+1}</small></div>`;
    })]);
    return `<div class="schedule-sheet sheet">${sheetHead(u.timetable)}
      ${table(['',...u.periods],body)}
    </div>
    <div class="conflict-callout"><span>!</span><div><b class="conflict-old">${u.clash}</b><b class="conflict-new">${u.resolved}</b><small>${u.days[1]} · ${u.periods[2]}</small></div></div>
    ${route('schedule','M390 195L530 195Q560 195 560 225L560 380L430 380')}
    <div class="schedule-complete">${pill('✓','mint')} ${u.resolved}</div>`;
  }

  function files() {
    return `<div class="loose-files">${u.fileNames.map((name,i)=>`<div class="loose-file file-${i}"><span>${u.fileTypes[i]}</span><div class="paper-lines"><i></i><i></i><i></i></div><b>${name}</b></div>`).join('')}</div>
      <div class="file-index sheet">${sheetHead(u.index)}
      <div class="index-search"><span class="search-icon"></span><span>${u.fileNames[0]}</span><b>↵</b></div>
      ${table(u.fileHead,u.fileNames.map((name,i)=>[name,pill(u.categories[i]),pill(u.organized,'mint')]))}
      </div>
      <div class="files-note"><span class="check-sign">✓</span>${u.searchable}</div>`;
  }

  function documents() {
    return `<div class="paper-stack paper-back"></div><div class="paper-stack paper-middle"></div>
      <div class="notice-paper">
        <div class="paper-letterhead"><span class="paper-seal">ف</span><div><b>${u.notice}</b><span>${u.school}</span></div><span class="document-id">DOC / 024</span></div>
        <h3>${u.noticeTitle}</h3><p>${u.noticeBody}</p>
        <div class="paper-lines"><i></i><i></i><i></i><i></i></div>
        <div class="signature-area"><span>${u.approval}</span><svg class="signature-stroke" viewBox="0 0 180 60" aria-hidden="true"><path pathLength="1" d="M12 46Q50 5 35 40T84 29Q48 49 104 38L145 15Q114 39 164 33M36 51L152 45" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/></svg><small>${u.signature}</small></div>
      </div>
      <div class="print-ticket"><span class="printer-icon"><i></i></span><div><b>${u.print}</b><span>${u.copies}</span></div><span class="check-sign">✓</span></div>`;
  }

  function insights() {
    return `<div class="insight-sheet sheet">${sheetHead(u.dashboard)}
      <div class="insight-stats">${u.indicators.map((label,i)=>`<div><span>${label}</span><b>${u.values[i]}</b><i class="tiny-trend">↗</i></div>`).join('')}</div>
      <div class="performance-chart"><span>${u.chart}</span><div class="chart-rules"><i></i><i></i><i></i></div><div class="film-bars">${[36,51,45,65,60,80,96].map((height,i)=>`<div><b style="height:${height}%"></b><span>0${i+1}</span></div>`).join('')}</div></div>
    </div>
    ${route('insights','M440 280L525 280L525 360L365 360')}
    <div class="priority-card"><span class="check-sign">✓</span><div><b>${u.priority}</b><p>${u.priorityBody}</p></div></div>
    <div class="report-ready">${u.report}<span>↗</span></div>`;
  }

  const drawings = [attendance,support,timetable,files,documents,insights];
  root.innerHTML = c.scenes.map((scene,i)=>`
    <section id="benefit-${i}" class="clip film-scene" data-start="${i*beat}" data-duration="${beat}" data-track-index="0" aria-label="${c.chapters[i]}">
      <div class="scene-layout">
        <div class="scene-copy"><p class="scene-tag"><i></i>${scene.tag}</p><h2>${scene.title.replace('<br>','<br> ')}</h2><p class="scene-description">${scene.body}</p>
          <div class="scene-proof"><div class="proof-before"><span>${c.before}</span><strong>${scene.before}</strong></div><span class="proof-arrow">←</span><div class="proof-after"><span>${c.after}</span><strong>${scene.after}</strong></div></div>
          <p class="metric-description">${scene.metric}</p>
        </div>
        <div class="scene-art art-${i}"><div class="art-coordinate-grid"></div>${drawings[i]()}</div>
      </div>
      <div class="scene-payoff"><span class="payoff-check">✓</span><p>${scene.payoff}</p><span class="film-sample">${c.sample}</span></div>
    </section>`).join('');

  const timeline = gsap.timeline({paused:true});
  root.querySelectorAll('.film-scene').forEach((scene,i)=>{
    const start = i*beat;
    const within = selector => scene.querySelectorAll(selector);
    const animate = (selector,from,to,at) => {
      const targets=within(selector);
      if(targets.length) timeline.fromTo(targets,from,to,at);
    };
    timeline.set(scene,{opacity:1},start);
    timeline.fromTo(within('.scene-copy'),{y:10,opacity:.9},{y:0,opacity:1,duration:.7,ease:'power3.out'},start);
    timeline.fromTo(within('.scene-proof'),{opacity:.18,y:8},{opacity:1,y:0,duration:.65,ease:'power2.out'},start+1.9);
    animate('.sheet:not(.file-index), .notice-paper',{y:30,opacity:0},{y:0,opacity:1,duration:.95,stagger:.14,ease:'power3.out'},start+.25);
    animate('.data-table tbody tr',{x:12,opacity:.08},{x:0,opacity:1,duration:.6,stagger:.09,ease:'power3.out'},start+.65);
    animate('.route-draw',{strokeDashoffset:1},{strokeDashoffset:0,duration:1.15,ease:'power2.inOut'},start+2.2);
    timeline.fromTo(within('.scene-payoff'),{opacity:0,y:8},{opacity:1,y:0,duration:.65,ease:'power2.out'},start+4.5);

    if(i===0) {
      timeline.fromTo(within('.follow-status'),{opacity:.3},{opacity:1,color:'#f0cc9b',duration:.55,stagger:.2},start+1.9);
      timeline.fromTo(within('.phone-card'),{y:27,opacity:0},{y:0,opacity:1,duration:.8,ease:'power3.out'},start+2.8);
      timeline.fromTo(within('.phone-notice'),{y:12,opacity:0},{y:0,opacity:1,duration:.65,ease:'power3.out'},start+3.3);
      timeline.fromTo(within('.departure-note'),{x:12,opacity:0},{x:0,opacity:1,duration:.65,ease:'power3.out'},start+4.3);
    } else if(i===1) {
      timeline.fromTo(within('.merit-pills > span'),{scale:.88,opacity:0},{scale:1,opacity:1,duration:.45,stagger:.14,ease:'power3.out'},start+1.2);
      timeline.fromTo(within('.skill-gauge i'),{scaleX:.32},{scaleX:.76,duration:2.0,ease:'power2.inOut'},start+2.0);
      timeline.fromTo(within('.target-label'),{opacity:0,y:-12},{opacity:1,y:0,duration:.7,ease:'power3.out'},start+1.65);
      timeline.fromTo(within('.plan-result'),{opacity:0},{opacity:1,duration:.6},start+3.2);
    } else if(i===2) {
      timeline.fromTo(within('.conflict-callout'),{y:15,opacity:0},{y:0,opacity:1,duration:.55,ease:'power3.out'},start+1.4);
      timeline.fromTo(within('.conflict-period'),{backgroundColor:'#4b2e28',borderColor:'#bf8268'},{backgroundColor:'#173d35',borderColor:'#5fae8e',duration:.65},start+3.5);
      timeline.fromTo(within('.conflict-old'),{opacity:1},{opacity:0,duration:.2},start+3.5);
      timeline.fromTo(within('.conflict-new'),{opacity:0},{opacity:1,duration:.35},start+3.75);
      timeline.fromTo(within('.schedule-complete'),{y:10,opacity:0},{y:0,opacity:1,duration:.65,ease:'power3.out'},start+4.3);
    } else if(i===3) {
      const values=[[-65,-31,-10],[55,-25,9],[-45,45,-8],[70,38,12]];
      within('.loose-file').forEach((file,j)=>{
        const [x,y,rotation]=values[j];
        timeline.fromTo(file,{x,y,rotation,opacity:0},{x,y,rotation,opacity:1,duration:.5,ease:'power3.out'},start+j*.14);
        timeline.fromTo(file,{x,y,rotation,opacity:1},{x:0,y:20,rotation:0,opacity:0,duration:.9,ease:'power3.inOut',immediateRender:false},start+1.4+j*.12);
      });
      timeline.fromTo(within('.file-index'),{scale:.91,opacity:0},{scale:1,opacity:1,duration:1.0,ease:'power3.out',immediateRender:false},start+2.1);
      timeline.fromTo(within('.files-note'),{opacity:0,y:10},{opacity:1,y:0,duration:.6},start+3.4);
    } else if(i===4) {
      timeline.fromTo(within('.paper-stack'),{y:24,rotation:0,opacity:0},{y:0,rotation:(j)=>j===0?-7:5,opacity:1,duration:.95,stagger:.1,ease:'power3.out'},start+.3);
      timeline.fromTo(within('.signature-stroke path'),{strokeDashoffset:1},{strokeDashoffset:0,duration:1.6,ease:'power2.inOut'},start+2.1);
      timeline.fromTo(within('.signature-area small'),{opacity:0},{opacity:1,duration:.5},start+3.4);
      timeline.fromTo(within('.print-ticket'),{y:20,opacity:0},{y:0,opacity:1,duration:.75,ease:'power3.out'},start+3.8);
    } else if(i===5) {
      timeline.fromTo(within('.film-bars b'),{scaleY:.03},{scaleY:1,duration:1.4,stagger:.1,ease:'power3.out'},start+1.0);
      timeline.fromTo(within('.insight-stats > div'),{opacity:.15,y:8},{opacity:1,y:0,duration:.6,stagger:.14,ease:'power3.out'},start+1.6);
      timeline.fromTo(within('.priority-card'),{y:17,opacity:0},{y:0,opacity:1,duration:.8,ease:'power3.out'},start+3.1);
      timeline.fromTo(within('.report-ready'),{y:10,opacity:0},{y:0,opacity:1,duration:.6},start+4.2);
    }
    timeline.fromTo(within('.scene-layout, .scene-payoff'),{opacity:1},{opacity:0,duration:.35,ease:'power1.in',immediateRender:false},start+beat-.4);
    timeline.set(scene,{opacity:0},start+beat);
  });
  timeline.set({}, {}, beat*c.scenes.length);
  window.__timelines ??= {};
  window.__timelines['ewan-school-film'] = timeline;
  window.EwanSchoolFilm = { timeline, beat, total:beat*c.scenes.length, language };
  window.dispatchEvent(new Event('ewan:film-ready'));
})();
