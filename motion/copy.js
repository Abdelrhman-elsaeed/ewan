window.EWAN_FILM_COPY = {
  ar: {
    label: 'أنظمة المدارس',
    heading: 'وقت أكتر للمدرسة.<br>ومتابعة أقرب لكل طالب.',
    description: 'شوف إزاي إيوان بيحوّل تفاصيل اليوم الدراسي لمتابعة واضحة وشغل يخلص أسرع.',
    pause: 'إيقاف مؤقت', play: 'تشغيل العرض', replay: 'من البداية',
    note: 'الأزمنة تقديرية لتوضيح الأثر، وتتغيّر حسب حجم العمل. البيانات والإمضاءات المعروضة توضيحية.',
    contact: 'ابنِ نظام يوفر وقت فريقك', sceneLabel: 'مشاهد فوائد النظام',
    before: 'قبل', after: 'مع إيوان', sample: 'بيانات توضيحية', result: 'النتيجة',
    scenePrefix: 'من يوم المدرسة',
    chapters: ['الطالب وولي الأمر', 'خطط الدعم', 'الجدول الذكي', 'الملفات', 'المستندات', 'رؤية الإدارة'],
    scenes: [
      {tag:'الحضور والمتابعة', title:'مين حضر؟<br>ومين محتاج متابعة؟', body:'الحضور والاستئذان والتواصل مع ولي الأمر في سجل واحد.', before:'٤٥ دقيقة', after:'١٠ ثوانٍ', metric:'لتجهيز كشف الحضور والمتابعة', payoff:'حالة واضحة للإدارة. وتواصل أوضح مع البيت.'},
      {tag:'سجل الطالب وخطط الدعم', title:'ملاحظة النهارده.<br>خطة تتتابع بكرة.', body:'السلوك والمهارات والهدف العلاجي يفضلوا مرتبطين بالطالب.', before:'ساعتين', after:'دقيقة', metric:'لترتيب خطة الدعم ومواعيد مراجعتها', payoff:'الطالب ليه هدف. والفريق يعرف الخطوة الجاية.'},
      {tag:'الجدول الذكي', title:'الحصص تترتّب.<br>والتعارض يتكشف.', body:'المواد وإسنادات المعلمين والحصص تتراجع في صورة واحدة.', before:'يوم عمل', after:'دقيقة', metric:'لمراجعة الجدول وتجهيز النسخة', payoff:'وقت المعلم محفوظ. واليوم الدراسي أوضح.'},
      {tag:'الملفات والشواهد', title:'كل ملف في مكانه.<br>وكل شاهد سهل توصله.', body:'جمع وتصنيف وفهرسة الملفات، والبحث يوصلّك للنسخة المطلوبة.', before:'أسبوعين', after:'٣ ثوانٍ', metric:'لتنظيم الملفات والوصول للفهرس', payoff:'وقت التجميع يرجع لفريقك. والملفات جاهزة للمراجعة.'},
      {tag:'التعاميم والطباعة', title:'المستند يجهز.<br>ببياناته وإمضائه.', body:'التعميم والقالب والإمضاء المعتمد يجتمعوا في نسخة جاهزة للطباعة.', before:'يومين', after:'٣٠ ثانية', metric:'لتجهيز التعاميم والنسخ المطلوبة', payoff:'نسخة موحّدة وواضحة. ومجهود أقل في كل تعميم.'},
      {tag:'المؤشرات ورؤية الإدارة', title:'الأرقام تتجمع.<br>والصورة تكمل.', body:'الحضور والتقدّم وخطط الدعم في ملخص يوجّه المتابعة.', before:'٣ ساعات', after:'١٥ ثانية', metric:'لتجهيز ملخص مؤشرات الإدارة', payoff:'إدارة تشوف أسرع. وفريق عنده وقت يتابع.'}
    ],
    ui:{
      school:'الفلاح · عرض توضيحي', attendance:'حضور الطلاب', student:'الطالب', status:'الحالة', follow:'المتابعة',
      present:'حاضر', absent:'غائب', late:'متأخر', logged:'مسجّل', needsFollow:'يحتاج متابعة',
      studentNames:['طالب ١٠١','طالب ١٠٢','طالب ١٠٣','طالب ١٠٤'],
      guardian:'ولي الأمر', notification:'تنبيه غياب الطالب', message:'تم رصد غياب الطالب في كشف اليوم. نرجو متابعة الحالة مع المدرسة.',
      exit:'استئذان خروج', exitDetail:'المرافق محدد · الحالة معتمدة', exitCaption:'سجل واضح لاستئذانات الخروج',
      profile:'ملف الطالب', goal:'المهارة المستهدفة', skill:'فهم المقروء', activity:'قراءة موجّهة', review:'مراجعة أسبوعية', plan:'خطة الدعم',
      planHeads:['الهدف','النشاط','المراجعة'], planRows:[['فهم الفكرة','نص قصير','الأسبوع ١'],['ربط المعنى','تدريب موجّه','الأسبوع ٢'],['قياس التقدّم','مهمة تطبيقية','الأسبوع ٣']],
      merit:'منح +٥', deduction:'خصم −٢', progress:'تقدّم في المهارة', planNote:'هدف واضح + نشاط + موعد متابعة',
      timetable:'الجدول الدراسي', days:['الأحد','الاثنين','الثلاثاء','الأربعاء'], periods:['الحصة ١','الحصة ٢','الحصة ٣','الحصة ٤'],
      subjects:['رياضيات','علوم','عربي','إنجليزي','إسلامية'], clash:'تعارض إسناد', resolved:'تمت المراجعة', teacher:'معلم',
      fileNames:['كشف الحضور','شاهد النشاط','تعميم المدرسة','تقرير المتابعة'],
      fileTypes:['PDF','JPG','DOC','XLS'], index:'فهرس الملفات', fileHead:['الملف','التصنيف','الحالة'],
      categories:['الحضور','الشواهد','التعاميم','المتابعة'], organized:'مفهرس', searchable:'بحث واحد. والملف قدامك.',
      notice:'تعميم مدرسي', noticeTitle:'تنظيم لقاء أولياء الأمور', noticeBody:'تُجهّز بيانات التعميم والجهة المعنية في قالب المدرسة، ثم تُدرج الإمضاءات المعتمدة.',
      approval:'اعتماد الإدارة', signature:'إمضاء توضيحي', print:'جاهز للطباعة', copies:'نسخة موحّدة للفريق',
      dashboard:'ملخص الإدارة', chart:'اتجاه الحضور والمتابعة', indicators:['الحضور','إنجاز الخطط','متابعة الواجبات'],
      values:['٩٦٪','٧٥٪','٨٤٪'], report:'ملخص جاهز للاجتماع', priority:'أولوية المتابعة', priorityBody:'الخطط اللي محتاجة مراجعة ظاهرة للفريق.'
    }
  },
  en: {
    label:'School systems', heading:'More time for your school.<br>A closer view of every student.',
    description:'See how Ewan turns a busy school day into clear follow-up and faster administration.',
    pause:'Pause', play:'Play', replay:'Start over',
    note:'Timings are illustrative estimates and vary by workload. Displayed records and signatures are illustrative.',
    contact:'Build a system that gives time back', sceneLabel:'System benefits',
    before:'Before', after:'With Ewan', sample:'Illustrative data', result:'The outcome', scenePrefix:'A school day, connected',
    chapters:['Students & families','Support plans','Smart timetable','Files','Documents','Leadership view'],
    scenes:[
      {tag:'Attendance and follow-up',title:'Who’s here?<br>Who needs a follow-up?',body:'Attendance, departure permissions, and family communication in one record.',before:'45 min',after:'10 sec',metric:'to prepare attendance and follow-up',payoff:'A clear record for staff. A closer connection to home.'},
      {tag:'Student records and support',title:'Today’s observation.<br>Tomorrow’s next step.',body:'Behavior, target skills, and support goals stay linked to the student.',before:'2 hours',after:'1 min',metric:'to arrange a support plan and reviews',payoff:'A goal for the student. A clear next step for the team.'},
      {tag:'Smart timetable',title:'Periods aligned.<br>Conflicts in view.',body:'Subjects, teaching assignments, and periods reviewed together.',before:'1 workday',after:'1 min',metric:'to review the timetable and prepare a copy',payoff:'Teacher time protected. A clearer school day.'},
      {tag:'Files and evidence',title:'Every file in place.<br>Every record in reach.',body:'Collect, categorize, and index files. One search leads to the right version.',before:'2 weeks',after:'3 sec',metric:'to organize files and reach the index',payoff:'Time back for your team. Records ready for review.'},
      {tag:'Notices and printing',title:'The document is ready.<br>Signature included.',body:'The notice, school template, and approved signature become one print-ready copy.',before:'2 days',after:'30 sec',metric:'to prepare notices and required copies',payoff:'A consistent copy. Less effort with every notice.'},
      {tag:'Insights for leadership',title:'Numbers connected.<br>The full picture.',body:'Attendance, progress, and support plans come together to guide the next action.',before:'3 hours',after:'15 sec',metric:'to prepare the leadership overview',payoff:'See sooner. Give your team time to follow through.'}
    ],
    ui:{
      school:'Al Falah · illustrative view', attendance:'Student attendance', student:'Student', status:'Status', follow:'Follow-up',
      present:'Present',absent:'Absent',late:'Late',logged:'Recorded',needsFollow:'Needs follow-up',
      studentNames:['Student 101','Student 102','Student 103','Student 104'],guardian:'Parent portal',notification:'Student absence notice',
      message:'An absence was recorded today. Please follow up with the school office.',
      exit:'Departure permission',exitDetail:'Named guardian · approved',exitCaption:'A clear departure permission record',
      profile:'Student record',goal:'Target skill',skill:'Reading comprehension',activity:'Guided reading',review:'Weekly review',plan:'Support plan',
      planHeads:['Goal','Activity','Review'],planRows:[['Main idea','Short passage','Week 1'],['Connect meaning','Guided practice','Week 2'],['Measure progress','Applied task','Week 3']],
      merit:'Award +5',deduction:'Deduction −2',progress:'Skill progress',planNote:'A goal, activity, and review date',
      timetable:'School timetable',days:['Sunday','Monday','Tuesday','Wednesday'],periods:['Period 1','Period 2','Period 3','Period 4'],
      subjects:['Math','Science','Arabic','English','Islamic studies'],clash:'Assignment clash',resolved:'Review complete',teacher:'Teacher',
      fileNames:['Attendance sheet','Activity evidence','School notice','Follow-up report'],fileTypes:['PDF','JPG','DOC','XLS'],
      index:'File index',fileHead:['File','Category','Status'],categories:['Attendance','Evidence','Notices','Follow-up'],organized:'Indexed',
      searchable:'One search. The file is in reach.',notice:'School notice',noticeTitle:'Parent meeting arrangements',
      noticeBody:'Notice details and the intended audience fill the school template. Approved signatures are included.',
      approval:'School approval',signature:'Illustrative signature',print:'Ready to print',copies:'A consistent copy for the team',
      dashboard:'Leadership overview',chart:'Attendance and follow-up',indicators:['Attendance','Plan completion','Assignment follow-up'],
      values:['96%','75%','84%'],report:'Meeting summary ready',priority:'Follow-up priority',priorityBody:'Plans due for review are visible to the team.'
    }
  }
};
