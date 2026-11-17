# الهيرو والوضع الفاتح

العنوان: **إيوان للبرمجيات**. السلوجان: **برمجيات بإتقان. أعمال بانسياب.**

الاسم عنصر نصي حي مع طبقات عمق ولمعان CSS، ويظل واضحًا في العربية والإنجليزية. التبديل يحفظ اختيار الزائر، ويحترم تقليل الحركة، ولا يعيد تشغيل عرض فوائد المدرسة.

## الأصل البصري

استُخدم **ImageGen المدمج** في وضع تعديل صورة موجودة. المرجع والهدف هو صورة الهيرو الداكنة `site/assets/threshold.webp`. النتيجة تحافظ على المعمار والمنظور وتحوّلهما إلى خامة حجر فاتحة بإضاءة نهارية. لم يُستخدم fallback CLI أو API key.

| الأصل النهائي | الاستخدام |
| --- | --- |
| `site/assets/threshold-light.webp` | نسخة سطح المكتب، 1671 × 941 بكسل |
| `site/assets/threshold-light-small.webp` | نسخة الموبايل، بعرض 840 بكسل |
| `site/assets/ewan-mark-ink.png` | نسخة العلامة الأصلية المناسبة للخلفيات الفاتحة، من ملفات الهوية |

بعد التوليد حُوّلت الصورة إلى WebP وأُنتج المقاس الأصغر للموقع، مع بقاء الأصل الداكن مستقلًا.

## وصف التوليد النهائي

> Use case: lighting-weather / material recolor. Asset type: light-mode website hero architectural background. Edit target: the attached dark architectural portal image. Create a matching HIGH-KEY DAYLIGHT counterpart of precisely this scene for a premium software studio. Preserve its centered one-point camera, symmetrical repeated rectangular recessed portals, floor grid, wide 16:9 framing and vanishing point. Replace almost-black stone with pale cool ivory limestone and satin light silver-green stone, softly reflective pale floor. Architectural edges remain distinctly visible through subtle emerald-grey shadows. The center portal glows softly jade/emerald rather than white, with natural diffuse daylight throughout the room. Sophisticated quiet architectural photography, airy but dimensional, refined material texture, no dark vignette. Palette: warm-neutral white #f5f8f5, pale sage #e1ede7, subdued emerald #397a69 only in recesses. The bottom third must remain pale and calm for DARK typography overlay. Keep enough structural contrast behind the center for dimensional logo overlay, but no bright streak or horizontal beam. NO text, letters, logos, people, screens, interface, added objects or captions. Do not render the website or a logo; only the matching architectural room background.

## الملفات والسلوك

- `site/assets/theme-init.js`: اختيار الوضع قبل أول رسم للصفحة، والداكن افتراضيًا.
- `site/assets/theme.js`: حفظ الاختيار، وتحديث اللوجوهات، والتبديل الدائري أو التلاشي البديل.
- `site/assets/themes.css`: ألوان وتباين عناصر الصفحة في الوضع الفاتح.
- `site/assets/hero-brand.css`: النص المجسّم والسلوجان.
- `site/assets/mark-lighting.js`: مادة العلامة واتجاه إضاءة الحواف في الوضعين.
- `site/assets/school-film/film-theme.css`: ألوان عرض فوائد المدرسة؛ المصدر المستقل في `motion/` يطابقه.

أُجري الفحص على Chrome باستخدام العربية والإنجليزية والمقاسات 320 و390 و768 و1440 بكسل. شمل الفحص عدم التجاوز الأفقي، والسطر الواحد للسلوجان، واستمرار موضع العرض بعد تغيير الوضع، وحفظ التفضيل، والتركيز بلوحة المفاتيح، والنقر المتكرر، والانتقال البديل عند غياب View Transitions. راجعت المعاينات بصريًا، مع فحص التباين للنصوص الأساسية والمشاهد المكتملة.
