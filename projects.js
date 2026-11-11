/* ============================================================
   كل المشاريع — مصدر واحد للحقيقة
   كل وصف مكتوب من README / وصف الريبو الحقيقي، مش مخترع.
   live: null يعني مفيش لينك مباشر شغّال (خاص أو مش منشور)
   ============================================================ */

const PROJECTS = [
  {
    id: 'saffron-house',
    highlights: [
      'متجر كامل: منيو بفلاتر، صفحة منتج بالمقاسات والإضافات، سلة، ودفع بثلاث طرق',
      'لوحة أدمن بـ ١٣ صفحة + شاشات مطبخ وكاشير ودليفري',
      'كل الأسعار والخصومات والولاء محسوبة على السيرفر، والطلب والمخزون في transaction واحد'
    ],
    title: 'SAFFRON HOUSE',
    kind: 'منصة مطعم',
    cat: 'platform',
    desc: 'منصة مطعم كاملة على قاعدة PostgreSQL واحدة: متجر للعميل، لوحة أدمن بـ ١٣ صفحة، وشاشات مطبخ وكاشير ودليفري. أسعار وخصومات وولاء كلها محسوبة على السيرفر، والطلب والمخزون والكوبون في transaction واحد.',
    tech: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Drizzle', 'Tailwind'],
    img: 'assets/saffron-house-live.webp',
    ar: 1.778,
    live: 'https://saffron-house-beige.vercel.app',
    repo: null,
    year: '2026',
    featured: true
  },
  {
    id: 'sanad',
    highlights: [
      'الهيكل الأكاديمي والمكتبة الرقمية والمجتمع الطلابي في منصة واحدة',
      'مركز مشاريع ومساعد بالذكاء الاصطناعي',
      'نظام صلاحيات واحد ولوحة إدارة موحّدة فوق Supabase RLS'
    ],
    title: 'سَنَد',
    kind: 'منصة أكاديمية',
    cat: 'platform',
    desc: 'منصة أكاديمية full-stack تجمع الهيكل الأكاديمي والمكتبة الرقمية والمجتمع الطلابي ومركز المشاريع ومساعد بالذكاء الاصطناعي — خلف نظام صلاحيات واحد ولوحة إدارة واحدة.',
    tech: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'RLS'],
    img: 'assets/sanad-live.webp',
    ar: 1.778,
    live: 'https://sanad-academic.vercel.app',
    repo: null,
    year: '2026',
    featured: true
  },
  {
    id: 'madar',
    highlights: [
      'مهام يومية بمؤقّت عمل محسوب على السيرفر',
      'أقسام وخمسة أدوار مع سير مراجعة واعتماد',
      'تقارير شهرية، وكود Expo واحد لموقع وتطبيق موبايل'
    ],
    title: 'مدار',
    kind: 'إدارة فرق',
    cat: 'admin',
    desc: 'منصة تشغيل متعددة الشركات: مهام يومية بمؤقّت عمل على السيرفر، أقسام وخمسة أدوار، سير مراجعة واعتماد، وتقارير شهرية — بواجهة عربية RTL كاملة، من كود Expo واحد لموقع وتطبيق موبايل.',
    tech: ['Expo', 'React Native', 'TypeScript', 'Supabase', 'PostgreSQL RLS'],
    img: 'assets/madar-live.webp',
    ar: 1.778,
    live: 'https://madar-m.vercel.app',
    repo: 'https://github.com/moatazsmohamed/madar',
    year: '2026',
    featured: true
  },
  {
    id: 'tasheela',
    highlights: [
      'أوردرات يومية وتصنيفات تسليم وتحصيلات مالية',
      'عهدة نقدية ومصروفات ومعاملات موظفين وتسوية يومية',
      'كل حركة مالية مربوطة بعمليتها الأصلية'
    ],
    title: 'تسهيلة',
    kind: 'محاسبة وتشغيل',
    cat: 'admin',
    desc: 'منصة محاسبة وتشغيل لفريق محاسبة: أوردرات يومية، تصنيفات تسليم، تحصيلات مالية، عهدة نقدية، مصروفات، ومعاملات موظفين وتسوية يومية مع صاحب العمل — كل حركة مالية مربوطة بعمليتها الأصلية.',
    tech: ['React', 'TypeScript', 'PostgreSQL', 'tRPC'],
    img: 'assets/tasheela-live.webp',
    ar: 1.778,
    live: 'https://tasheela.vercel.app',
    repo: null,
    year: '2026',
    featured: true
  },
  {
    id: 'sportswear',
    highlights: [
      'سجل حركات ذرّي هو مصدر الحقيقة للمخزون',
      'جرد فعلي باعتماد المدير وباركود',
      '٢٣ جدول و٢٢ مسار و١٤٧ اختبار، وتقارير عربية لحظية'
    ],
    title: 'Sportswear Warehouse',
    kind: 'نظام مخزون ERP',
    cat: 'admin',
    desc: 'نظام مخزون وجرد للتيشيرتات والملابس الرياضية: سجل حركات ذرّي هو مصدر الحقيقة، جرد فعلي باعتماد المدير، باركود، وتقارير عربية لحظية — ٢٣ جدول و٢٢ مسار و١٤٧ اختبار.',
    tech: ['React 19', 'TypeScript', 'tRPC', 'PostgreSQL', 'Drizzle'],
    img: 'assets/sportswear-live.webp',
    ar: 1.778,
    live: 'https://sportswear-warehouse-manager.vercel.app',
    repo: null,
    year: '2026',
    featured: true
  },
  {
    id: 'webvault',
    highlights: [
      'خزنة مواقع مشفّرة بكل مواقعك في مكان واحد',
      'تشفير على مستوى الحقول مع تحكم في الوصول',
      'واجهة عربية RTL بالكامل'
    ],
    title: 'WebVault',
    kind: 'خزنة مواقع',
    cat: 'admin',
    desc: 'لوحة لمالك واحد يدير كل مواقعه: غرف ومشاريع، خمس خانات لينكات لكل موقع، وخزنة بيانات مشفّرة AES-256-GCM. استرجاع كلمة المرور بكود لمرة واحدة، وRLS deny-all على كل جدول.',
    tech: ['Next.js 15', 'TypeScript', 'Supabase', 'AES-256-GCM'],
    img: 'assets/webvault-live.webp',
    ar: 1.778,
    live: 'https://webvault-app.vercel.app',
    repo: 'https://github.com/moatazsmohamed/webvault',
    year: '2026',
    featured: true
  },
  {
    id: 'social-intelligence',
    highlights: [
      'رصد وتحليل الحسابات من مكان واحد',
      'مقاييس تفاعل ومقارنة بين الحسابات',
      'لوحة تحكم بفلاتر زمنية'
    ],
    title: 'Social Intelligence',
    kind: 'رصد وتحليل',
    cat: 'ai',
    desc: 'منصة ذكاء اجتماعي على React 19 وSupabase: مركز تحكم للمطوّر، edge functions، و٤٤ migration — تفهم كل حساب من مكان واحد.',
    tech: ['React 19', 'TypeScript', 'Supabase', 'Edge Functions'],
    img: 'assets/social-intelligence-live.webp',
    ar: 1.778,
    live: 'https://social-intelligence-gilt.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'moataz-ai',
    highlights: [
      'مساحة عمل هادئة للتفكير والكتابة',
      'واجهة إنجليزية بتركيز على الوضوح',
      'تصميم طباعي بمساحات واسعة'
    ],
    title: 'MOATAZ AI',
    kind: 'مساحة ذكاء اصطناعي',
    cat: 'ai',
    desc: 'مساحة عمل شخصية ثنائية اللغة: مصادقة Supabase، محادثات محفوظة، ردود AI متدفقة عبر SSE، وذاكرة خاصة. مفتاح المزوّد موجود في Edge Function فقط، والمتصفح مايشوفش غير المفتاح العام.',
    tech: ['React 19', 'Vite', 'TypeScript', 'Supabase', 'SSE'],
    img: 'assets/moataz-ai-live.webp',
    ar: 1.28,
    live: 'https://mtzz-ai-pi.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'pcverse',
    highlights: [
      'مختبر 3D تفاعلي لاستكشاف مكوّنات الحاسب',
      'عرض ثلاثي الأبعاد في المتصفح',
      'تفاعل مباشر مع الأجزاء'
    ],
    title: 'PCVERSE',
    kind: 'مختبر 3D',
    cat: '3d',
    desc: 'مختبر حاسب تفاعلي ثلاثي الأبعاد: تفكّك المكوّنات، تفهم وظايفها، وتتعلّم بالعربي والإنجليزي — مع مقارنة أسعار لبناء جهاز.',
    tech: ['React', 'TypeScript', 'Three.js', 'Vite'],
    img: 'assets/pcverse-live.webp',
    ar: 0.781,
    live: 'https://pcverse-lac.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'computer-explorer',
    highlights: [
      'مستكشف حاسب ثلاثي الأبعاد بالعربية',
      'شرح تفاعلي لكل مكوّن',
      'أداء محسّن على الموبايل'
    ],
    title: 'مستكشف الحاسب',
    kind: '3D تفاعلي',
    cat: '3d',
    desc: 'تفكيك الحاسب قطعة قطعة في مشهد ثلاثي الأبعاد: تدوير، تكبير، وشرح لكل مكوّن بالعربي.',
    tech: ['Three.js', 'JavaScript', 'WebGL'],
    img: 'assets/computer-explorer-live.webp',
    ar: 1.28,
    live: 'https://computer-explorer-three.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'motryx',
    highlights: [
      'استوديو رقمي بهوية بصرية قوية',
      'صفحات خدمات وأعمال',
      'حركة وانتقالات سلسة'
    ],
    title: 'MOTRYX',
    kind: 'استوديو',
    cat: 'site',
    desc: 'الموقع الرسمي لاستوديو برمجيات وذكاء اصطناعي في الإسكندرية: عربي أولاً بـ RTL، إنجليزي LTR، مسارات /ar و/en، ميتاداتا ديناميكية، وتواصل شغّال — بدون أي مكتبة UI جاهزة.',
    tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind', 'React Router 7'],
    img: 'assets/motryx-live.webp',
    ar: 1.28,
    live: 'https://motryx-delta.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'ms-wood-works',
    highlights: [
      'موقع تعريفي لورشة نجارة وأعمال خشب',
      'معرض أعمال بصور كبيرة',
      'نموذج تواصل'
    ],
    title: 'MS Woodworks',
    kind: 'موقع تعريفي',
    cat: 'site',
    desc: 'هوية رقمية لورشة خشب فاخرة (محمد إسماعيل وأولاده) بخبرة ٢٥+ سنة في الأثاث المكتبي التنفيذي: أعمال، معرض صور، ولوحة إدارة للطلبات والتعليقات والعاملين.',
    tech: ['HTML', 'CSS', 'JavaScript', 'PostgreSQL', 'Docker'],
    img: 'assets/ms-wood-works-live.webp',
    ar: 1.778,
    live: 'https://ms-wood-works.vercel.app',
    repo: 'https://github.com/moatazsmohamed/ms-wood-works',
    year: '2026'
  },
  {
    id: 'tafra',
    highlights: [
      'متجر أزياء بواجهة عربية',
      'عرض منتجات وتصنيفات',
      'تجربة تصفح بصرية'
    ],
    title: 'TAFRA',
    kind: 'متجر أزياء',
    cat: 'shop',
    desc: 'متجر أزياء بهوية بصرية فاخرة: كتالوج، مجموعات، الأكثر طلباً، سلة، بحث وفلترة وترتيب، وأوردر واتساب — صفحة واحدة بدون build، وكل البيانات في catalog.js.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    img: 'assets/tafra-live.webp',
    ar: 1.778,
    live: 'https://tafrawear.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'taqasim',
    highlights: [
      'آلة صوت تفاعلية في المتصفح',
      'توليد نغمات ومقامات',
      'واجهة عربية موسيقية'
    ],
    title: 'تَقاسيم',
    kind: 'آلة صوت',
    cat: '3d',
    desc: 'وتر بيتولّد قدامك بمعادلة Karplus–Strong: سبعة مقامات بدرجاتها بالسنت، ستة أدوار إيقاع، ومؤلف تقاسيم ببذرة عشوائية — بصفر عيّنة صوتية.',
    tech: ['Web Audio', 'JavaScript', 'Karplus–Strong'],
    img: 'assets/taqasim-live.webp',
    ar: 1.778,
    live: 'https://taqasim.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'zakhraf',
    highlights: [
      'زخرفة توليدية بأنماط إسلامية',
      'توليد أشكال لا نهائية',
      'تصدير الأشكال'
    ],
    title: 'زَخْرَف',
    kind: 'زخرفة توليدية',
    cat: '3d',
    desc: 'محرّك يرسم نجوم girih ويضفر خطوطها على الشاشة لحظياً: أربع رتب تناظر، ١٢ لوحة ألوان تاريخية، وتصدير بدقة 2048.',
    tech: ['Canvas', 'JavaScript', 'Generative Art'],
    img: 'assets/zakhraf-live.webp',
    ar: 1.778,
    live: 'https://zakhraf.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'marab',
    highlights: [
      'معرض سيارات تفاعلي',
      'عرض ثلاثي الأبعاد للسيارة',
      'تنقل سلس بين الموديلات'
    ],
    title: 'مِرَآب',
    kind: 'معرض تفاعلي',
    cat: '3d',
    desc: 'معرض سيارات فخم بالعربي: عدّاد افتتاح، شرح الاسم بالحركة، مخصّص ألوان، وحلبة تُسجّل فيها لفة حقيقية.',
    tech: ['JavaScript', 'Canvas', 'CSS 3D'],
    img: 'assets/marab-live.webp',
    ar: 1.778,
    live: 'https://car-showcase-weld.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'maryam-dream',
    highlights: [
      'عالم مريم — موقع تفاعلي للأطفال',
      'رسوم وألوان مبهجة',
      'حركة وانتقالات لطيفة'
    ],
    title: 'عالم مريم',
    kind: 'موقع شخصي',
    cat: 'personal',
    desc: 'مساحة أنيقة وهادية للعناية والأمنيات والمشاعر: ١٦ قسماً للعناية والملاحظات والتودو، حركات غنية، وحفظ محلي في المتصفح.',
    tech: ['HTML', 'CSS', 'JavaScript', 'LocalStorage'],
    img: 'assets/maryam-dream-live.webp',
    ar: 1.778,
    live: 'https://maryam-dream-world.vercel.app',
    repo: null,
    year: '2026'
  },
  {
    id: 'bayt-maryam',
    highlights: [
      'موقع خاص محمي بكلمة سر',
      'غير مرتبط علنًا للحفاظ على الخصوصية',
      'غلاف بديل واضح'
    ],
    title: 'بيت مريم',
    kind: 'موقع خاص',
    cat: 'personal',
    desc: 'رسالة حب ثنائية اللغة مبنية بـ React وFramer Motion: ظرف افتتاح، خط زمني، معرض ذكريات، أغنية، اختبار، ورسالة أخيرة — مع أدمن عربي لتحرير كل كلمة وصورة، وشات خاص بين شخصين.',
    tech: ['React 18', 'TypeScript', 'Vite', 'Framer Motion', 'Vercel Blob'],
    img: 'assets/bayt-maryam-preview.webp',
    ar: 1.778,
    live: null,
    repo: null,
    year: '2026',
    private: true
  },
  {
    id: 'portfolio-v3',
    highlights: [
      'هذا المعرض نفسه — ٢١ مشروع بفلاتر وبحث',
      'لقطات حية من كل موقع منشور',
      'تصميم متجاوب بالكامل'
    ],
    title: 'هذا المعرض',
    kind: 'بورتفوليو',
    cat: 'personal',
    desc: 'النسخة الثالثة: مساحة مستوحاة من الريل، معرض coverflow ثلاثي الأبعاد، فلاتر وبحث، ونموذج طلب مشروع بيوصل لصندوق رسائل حقيقي في Supabase.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Supabase'],
    img: 'assets/portfolio-v3-live.webp',
    ar: 1.778,
    live: 'https://moataz-portfolio-v3.vercel.app',
    repo: 'https://github.com/moatazsmohamed/moataz-portfolio-v3',
    year: '2026'
  },
  {
    id: 'portfolio-v1',
    highlights: [
      'البورتفوليو الأول: السيرة والمشاريع في مكان واحد',
      'تصميم بسيط وسريع',
      'منشور على Vercel'
    ],
    title: 'البورتفوليو الأول',
    kind: 'موقع شخصي',
    cat: 'personal',
    desc: 'النسخة اللي بدأت منها: عربي وإنجليزي، صندوق رسائل حقيقي في Supabase، ومساعد ذكاء اصطناعي محلي يجاوب عني وعن مشاريعي — بتقييم SonarQube نظيف.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Supabase'],
    img: 'assets/portfolio-v1-live.webp',
    ar: 1.778,
    live: 'https://portfolio-moataz.vercel.app',
    repo: 'https://github.com/moatazsmohamed/portfolio',
    year: '2025'
  },
  {
    id: 'personal-site',
    highlights: [
      'موقعي الشخصي على GitHub Pages',
      'نبذة وسيرة ومشاريع',
      'صفحات ثابتة خفيفة'
    ],
    title: 'الموقع الشخصي',
    kind: 'موقع شخصي',
    cat: 'personal',
    desc: 'موقعي الشخصي بالإنجليزي على GitHub Pages: نبذة، السيرة الذاتية، ومشاريعي البرمجية في مكان واحد.',
    tech: ['HTML', 'CSS', 'GitHub Pages'],
    img: 'assets/personal-site-live.webp',
    ar: 1.778,
    live: 'https://moatazsmohamed.github.io',
    repo: 'https://github.com/moatazsmohamed/moatazsmohamed.github.io',
    year: '2025'
  }
]

const CATS = [
  { id: 'all', label: 'الكل' },
  { id: 'platform', label: 'منصات متكاملة' },
  { id: 'admin', label: 'أنظمة إدارة' },
  { id: 'ai', label: 'ذكاء اصطناعي' },
  { id: 'shop', label: 'متاجر' },
  { id: '3d', label: '3D وتفاعل' },
  { id: 'site', label: 'مواقع تعريفية' },
  { id: 'personal', label: 'شخصي' }
]
