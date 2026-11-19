# صفحة المؤسس والرئيس التنفيذي

`site/founder.html` صفحة عبد الرحمن بدوي، باسم وصفة «المؤسس والرئيس التنفيذي» كما طلب صاحب المشروع. لها رابط «المؤسس» في تنقل الوكالة، وتدعم العربية الافتراضية والإنجليزية والوضعين الداكن والفاتح.

## النسخة النهائية: جزآن فقط

```text
   [ تنقل الوكالة · المؤسس ]
   [ الصورة في بوابة مضاءة ] [ الاسم · تعريف مباشر · تواصل ]
   [ من شغل متفرق لنظام واحد: مشهد 3D واحد كبير ]
   [ التقنيات ] [ الدراسة وشعارات التدريب ] [ تواصل ]
```

المقدمة: «نفهم شغلك. ونبني اللي يسهّله.» يليها تعريف بصيغة المتكلم، دون فقرات عن الرؤية والعمق والتميز. الجزء الثاني يربط القيمة بمثال الفلاح: الحضور والتعاميم ومتابعة ولي الأمر في مكان واحد. أُزيلت أقسام الرؤية والمبادئ وقيادة الفرق والتطوير المهني وكروت المهارات ومشاريع البورتفوليو المكررة. الدراسة والتدريب والتقنيات معلومات موجزة داخل الجزء الثاني، وليست أقسامًا منفصلة.

## التصميم والمشهد

احتُفظ بهوية إيوان: `#081418` و`#060E11` و`#0D6D58` و`#A3DECE` و`#4FE0B0` و`#EFF7F5`. خطوط ثمانية للعربي، وInter وDM Serif Display للإنجليزي، وفق إعدادات الموقع الحالية.

البورتريه داخل بوابة ذات طبقات وقاعدة معدنية مضاءة؛ اسم المؤسس بوجه مضيء وعمق ظل، وإضاءة الصورة وميلها يستجيبان للمؤشر. الصورة معالجة بألوان الهوية مع بقاء لون البشرة طبيعيًا.

`assets/founder-scene.js` يبني مشهد WebGL باستخدام Three.js r170 المحلي: أوراق مجسّمة، قلب يحمل شعار إيوان الأصلي ببثق وحواف مشطوفة، شاشة عليها صورة موقع الفلاح الحقيقي، ولوح زجاجي صغير ووصلات مضيئة بين الأجزاء. للمعادن انعكاسات استوديو وإضاءة وظلال، ويتغير اتجاه الضوء والمنظور بشكل محدود مع الماوس. تتغير مواضع المشهد عند تغيير اللغة، وتحافظ صورة الموقع والشعار على اتجاههما الصحيح.

يُحمّل محرك المشهد عند الاقتراب منه. الرسم يتوقف خارج الشاشة وفي الخلفية، ويعرض وضع تقليل الحركة مشهدًا ثابتًا. عند غياب WebGL يبقى بديل مرئي للصورة والشعار وجميع النصوص والروابط. تُرفق [رخصة Three.js](https://github.com/mrdoob/three.js/blob/r170/LICENSE) في مجلد vendor؛ لا يحتاج الموقع اتصال CDN عند التشغيل.

## دقة المحتوى

- الاسم والدور التنفيذي وخلفية Full Stack مع Angular: طلب صاحب المشروع المباشر. Angular وTypeScript مدعومان أيضًا بفحص مشروع الفلاح السابق.
- كلية الهندسة بجامعة المنصورة وتخصص الإلكترونيات والاتصالات، و.NET وC# وEF Core وSQL Server وDocker وJWT وSOLID وCQRS: السيرة الذاتية المقدمة.
- التدريب لدى Huawei وCisco: تصريح صاحب المشروع. تظهر الشعارات تحت عنوان التدريب دون ادعاء وظيفة أو شراكة تجارية أو شهادة أو مسار لم يُقدَّم.

لا تعرض الصفحة سنة التخرج أو مستوى Junior أو نسب مهارات أو عدد سنوات خبرة غير موثق. لم تُنسخ السيرة الأصلية أو بيانات الاتصال الشخصية إلى الموقع أو المستودع. التواصل رابط إلى نموذج الوكالة الحالي.

## الصورة والأصول

استُخدمت أداة ImageGen المدمجة لمعالجة الصورة التي قدّمها صاحب المشروع: إزالة الخلفية وتدرّج ظلال زمردي وضوء نعناعي خفيف على الأطراف، مع الحفاظ على الشخص وملابسه ووضعه.

- الصورة الرئيسية الشفافة: `site/assets/founder/abdelrahman-badawy.webp`.
- نسخة الموبايل: `site/assets/founder/abdelrahman-badawy-small.webp`.

شعارات Huawei وCisco وDocker من Simple Icons v15.15.0، وترخيصها مرفق في مجلد founder. تُلوَّن العلامات بواسطة CSS mask بلون الهوية، دون خلفيات بيضاء. أيقونات Angular و.NET وTypeScript وSQL Server من أصول Devicon الموجودة بالمشروع.

### نص طلب معالجة الصورة

> EDIT TARGET: the supplied real portrait of the company founder. Create a faithful high quality photo cutout for the Ewan Software executive profile website. Preserve this exact person's identity, facial geometry, smile, hair, beard, pose, original navy blazer and white open-collar shirt, and exact camera perspective. This is ONLY a photographic color-grade, light polish and clean background removal, not a reimagining or replacement of the person. Remove the plain slate-blue background completely, including clean fine hair edges. Preserve the full existing visible jacket/torso and silhouette; do not crop the head or shoulders any further. Ewan brand palette: obsidian ink teal #081418, deep emerald #0d6d58, pale mint #a3dece. Apply elegant restrained emerald/teal shadow toning to the blazer and subtle icy mint edge light on the clothing and outer shoulders, with believable studio lighting. Keep skin natural, warm-neutral and realistic, without a green cast, and keep the white shirt neutral with only very faint reflected mint shadows. Preserve natural pores, eyes, beard detail and texture; no plastic retouch, no beauty transformation, no new wardrobe, no objects, no text, no frame, no logo. Transparent alpha background. Premium understated executive portrait suitable over both dark teal and pale mint website backgrounds.

## التشغيل والتحقق

المحتوى العربي في `founder.html`، والإنجليزي في `assets/founder.js`، والتصميم في `assets/founder.css`. `navigation.js` يحمل اللغة والثيم بين صفحتي الوكالة والمؤسس، و`navigation.css` يضبط القائمة بعد إضافة الرابط الجديد. نقطة الرجوع السابقة للإضافة `checkpoint-before-founder`.

فُحصت 24 حالة تجمع اللغتين والوضعين وعروض 320 و390 و768 و1024 و1101 و1440 بكسل، مع فحص روابط الانتقال وحفظ اللغة والثيم والقائمة الصغيرة وEscape. لا تجاوز أفقي ولا موارد مفقودة أو أخطاء JavaScript في هذه الحالات. فُحص مشهد WebGL في الحركة ومع المؤشر، والتوقف خارج الشاشة وتقليل الحركة والبديل عند تعطيل WebGL. مراجعة التباين الآلية للنصوص الصلبة لم تجد انخفاضًا في الحالات الأربع؛ ليست تدقيق وصول شاملًا. روجعت لقطات الديسكتوب والموبايل والصفحة كاملة بصريًا.

حزمة Hostinger تحتوي الصفحة والصورة والمحرك والتراخيص وكل الأصول محليًا. لا توجد خطوة نشر أو حاجة لبناء Node على الخادم.
