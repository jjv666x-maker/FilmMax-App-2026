import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveCreditCard } from './InteractiveCreditCard';
import { D3LiquidRingSubscription, TierItem } from './D3LiquidRingSubscription';
import {
  Gem,
  Zap,
  Check,
  ShieldCheck,
  Cpu,
  Search,
  Play,
  RotateCcw,
  Lock,
  CreditCard,
  X,
  Smartphone,
  Sparkles,
  Sliders,
  Volume2,
  Film,
  Download,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Tv,
  Radio
} from 'lucide-react';

export const SmartEvolutionModal: React.FC = () => {
  const {
    isEvolutionModalOpen,
    setIsEvolutionModalOpen,
    showToast,
    updateUserProfile,
    userProfile,
    movies,
    navigateTo
  } = useApp();

  // Active Tab: 'tools' (أدوات الذكاء التفاعلية) vs 'tiers' (باقات وتفعيل التطور الذكي) vs 'checkout' (شاشة الدفع المنظمة)
  const [activeTab, setActiveTab] = useState<'tools' | 'tiers' | 'checkout'>('tools');
  const [selectedTier, setSelectedTier] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'visa' | 'zaincash' | 'fastpay' | 'applepay'>('visa');

  // Active AI Features Toggles
  const [aiUpscalingEnabled, setAiUpscalingEnabled] = useState(true);
  const [aiAntiSpoilerEnabled, setAiAntiSpoilerEnabled] = useState(true);
  const [aiAudioEnhancerEnabled, setAiAudioEnhancerEnabled] = useState(true);
  const [aiZeroBufferingEnabled, setAiZeroBufferingEnabled] = useState(true);

  // Scene Finder State
  const [sceneQuery, setSceneQuery] = useState('');
  const [foundScene, setFoundScene] = useState<{
    movie: any;
    timestamp: string;
    description: string;
  } | null>(null);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardName, setCardName] = useState(userProfile.name || 'A. HASIB');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  // ZainCash / Phone state
  const [zainPhone, setZainPhone] = useState('07701234567');
  const [zainPin, setZainPin] = useState('1234');

  // Success Confirmation screen
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isEvolutionModalOpen) return null;

  const evolutionTiers: TierItem[] = [
    {
      id: 'weekly',
      name: 'باقة التطور الذكي الأسبوعية ⚡',
      price: '6,000 د.ع',
      period: 'أسبوعياً',
      badge: 'مرونة عالية',
      aiPowerScore: 60,
      features: [
        'معالجة الفيديو وتنعيم الحركة 60FPS',
        'منظف الذاكرة وتسريع التخزين المؤقت',
        'مساعد البحث عن المشاهد بالعبارات',
        'درع منع الحرق التلقائي للأحداث',
        'دعم فني وتجاوب سريع'
      ]
    },
    {
      id: 'monthly',
      name: 'باقة التطور الذكي الاحترافية 💎',
      price: '18,000 د.ع',
      period: 'شهرياً',
      featured: true,
      badge: 'الأكثر شعبية 🏆',
      aiPowerScore: 85,
      features: [
        'كل ميزات الباقة الأسبوعية',
        'ترقية دقة الفيديوهات الذكية 8K AI Upscaling',
        'محرك الصوت المحيطي Dolby Atmos 3D',
        'دبلجة صوتية متعددة اللهجات بالذكاء الاصطناعي',
        'تحميل سريع مضاعف 3x ومساحة غير محدودة',
        'أولوية الدعم الفني VIP على مدار الساعة'
      ]
    },
    {
      id: 'yearly',
      name: 'العضوية السنوية الملكية الشاملة 👑',
      price: '150,000 د.ع',
      period: 'سنوياً (وفر 30%)',
      badge: 'قيمة فائقة 🌟',
      savings: 'توفير 30%',
      aiPowerScore: 100,
      features: [
        'كل الميزات المتقدمة دون أي قيود',
        'وصول غير محدود لكافة أدوات AI المستحدثة مستقبلاً',
        'سيرفرات بث مخصصة فائقة السرعة Zero-Lag',
        'حسابات عائلية متعددة ومشاركة ذكية (4 أجهزة)',
        'بطاقة VIP رقمية مخصصة ومكافآت حصرية'
      ]
    }
  ];

  const currentTierObj = evolutionTiers.find(t => t.id === selectedTier) || evolutionTiers[1];

  // Handle Scene Search simulation
  const handleSearchScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sceneQuery.trim()) return;

    const q = sceneQuery.toLowerCase();
    let matchedMovie = movies[0];
    let time = '01:24:15';
    let desc = 'مشهد المواجهة الحماسية وإحكام القبضة مع الموسيقى الملحمية.';

    if (q.includes('جوكر') || q.includes('مستشفى') || q.includes('تارث') || q.includes('dark knight')) {
      matchedMovie = movies.find(m => String(m.id) === '102') || movies[0];
      time = '01:42:10';
      desc = 'لحظة تفجير المستشفى الأيقونية والارتجال التاريخي من هيث ليدجر.';
    } else if (q.includes('انفجار') || q.includes('أوبنهايمر') || q.includes('ترينيتي')) {
      matchedMovie = movies.find(m => String(m.id) === '105') || movies[0];
      time = '02:15:40';
      desc = 'مشهد اختبار ترينيتي والصمت المطبق الساحر قبل الانفجار الكوني.';
    } else if (q.includes('دودة') || q.includes('رمال') || q.includes('dune')) {
      matchedMovie = movies.find(m => String(m.id) === '101') || movies[0];
      time = '01:10:05';
      desc = 'مشهد ركوب دودة الرمال العملاقة والتتويج الملحمي في كوكب أراكيس.';
    } else if (q.includes('فضاء') || q.includes('ثقب') || q.includes('interstellar')) {
      matchedMovie = movies.find(m => String(m.id) === '103') || movies[0];
      time = '02:05:30';
      desc = 'مشهد العبور المذهل عبر الثقب الدودي وبُعد الزمكان.';
    }

    setFoundScene({
      movie: matchedMovie,
      timestamp: time,
      description: desc
    });
    showToast('✨ تم تحديد المشهد الدقيق بالذكاء الاصطناعي بنجاح!');
  };

  // Handle Payment Checkout
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    updateUserProfile({
      isPremium: true,
      evolutionPlan: selectedTier
    });
    showToast('🎉 تم الدفع وتفعيل نظام التطور الذكي VIP بنجاح!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#181226] via-[#0f111a] to-[#0a0c13] border border-purple-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl text-right max-h-[92vh] overflow-y-auto custom-scrollbar space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-black shadow-md shadow-purple-500/30">
                <Gem className="w-3.5 h-3.5 text-amber-300" />
                AI EVOLUTION PRO 3.0
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                مفعّل ومتصل بالفائقة 🤖
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">مركز التطور الذكي وحزم المشاهدة الفائقة</h2>
            <p className="text-xs text-gray-300">أدوات ذكية فعالة وميزات تشغيل متقدمة تمنحك تجربة سينمائية لا مثيل لها</p>
          </div>

          <button
            onClick={() => {
              setIsEvolutionModalOpen(false);
              setIsSuccess(false);
            }}
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Navigation Tabs */}
        {!isSuccess && (
          <div className="flex items-center bg-[#131622] p-1.5 rounded-2xl border border-white/10 gap-1">
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'tools'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-4 h-4 text-amber-300" />
              <span>أدوات الذكاء التفاعلية (أدوات حقيقية)</span>
            </button>

            <button
              onClick={() => setActiveTab('tiers')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                activeTab === 'tiers' || activeTab === 'checkout'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>الباقات والدفع المباشر (الاشتراكات المنظمة)</span>
            </button>
          </div>
        )}

        {/* TAB 1: INTERACTIVE AI TOOLS (أدوات مفيدة حقيقية للمستخدم) */}
        {!isSuccess && activeTab === 'tools' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Quick Toggle Suite */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. AI 8K Upscaler */}
              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 bg-[#131724]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <b className="text-xs text-white block">معالجة وتنعيم الحركة 8K AI</b>
                      <span className="text-[10px] text-gray-400">رفع دقة الإطارات فورياً إلى 60FPS</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAiUpscalingEnabled(!aiUpscalingEnabled);
                      showToast(
                        !aiUpscalingEnabled
                          ? '✨ تم تفعيل معالجة الصورة والتنعيم الذكي 60FPS'
                          : 'إيقاف معالجة الصورة الذكية'
                      );
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      aiUpscalingEnabled ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        aiUpscalingEnabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  يقوم المحرك الذكي بتحليل المشاهد السريعة والأكشن وإعادة معالجة الإضاءة والألوان والتفاصيل بدقة 8K فائقة.
                </p>
              </div>

              {/* 2. AI Audio Enhancer */}
              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 bg-[#131724]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <b className="text-xs text-white block">الصوت المحيطي Dolby Atmos 3D</b>
                      <span className="text-[10px] text-gray-400">توزيع الترددات وعزل الصوت المالي</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAiAudioEnhancerEnabled(!aiAudioEnhancerEnabled);
                      showToast(
                        !aiAudioEnhancerEnabled
                          ? '🔊 تم تفعيل محرك الصوت المحيطي ثلاثي الأبعاد'
                          : 'إيقاف الصوت المحيطي'
                      );
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      aiAudioEnhancerEnabled ? 'bg-emerald-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        aiAudioEnhancerEnabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  تضخيم المحادثات الهادئة وخفض أصوات الانفجارات المفاجئة لتوفير تجربة استماع مريحة ونقية بالذكاء الاصطناعي.
                </p>
              </div>

              {/* 3. AI Anti-Spoiler Shield */}
              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 bg-[#131724]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <b className="text-xs text-white block">درع حظر الحرق الذكي</b>
                      <span className="text-[10px] text-gray-400">إخفاء النهايات المفاجئة في المراجعات</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAiAntiSpoilerEnabled(!aiAntiSpoilerEnabled);
                      showToast(
                        !aiAntiSpoilerEnabled
                          ? '🛡️ تم تفعيل درع حظر حرق نهايات الأفلام'
                          : 'إيقاف درع الحرق'
                      );
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      aiAntiSpoilerEnabled ? 'bg-rose-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        aiAntiSpoilerEnabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  يقوم الذكاء الاصطناعي بقراءة التعليقات والقصص وإعادة تشفير أجزاء الحرق كـ "مخفي" لحمايتك أثناء التصفح.
                </p>
              </div>

              {/* 4. AI Zero-Buffering Accelerator */}
              <div className="glass-card p-4 rounded-2xl border border-white/10 space-y-3 bg-[#131724]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <b className="text-xs text-white block">مسرّع البث المباشر (Multi-CDN)</b>
                      <span className="text-[10px] text-gray-400">منع التقطيع مع توجيه ذكي للمسار</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setAiZeroBufferingEnabled(!aiZeroBufferingEnabled);
                      showToast(
                        !aiZeroBufferingEnabled
                          ? '⚡ تم تفعيل مسرّع البث التلقائي وبدون تقطيع'
                          : 'إيقاف مسرّع البث'
                      );
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      aiZeroBufferingEnabled ? 'bg-cyan-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        aiZeroBufferingEnabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  ربط وتدفق البث عبر 4 خوادم عالمية سريعة في الوقت نفسه لضمان عدم حدوث أي توقف مؤقت أثناء المشاهدة.
                </p>
              </div>
            </div>

            {/* AI Scene & Quote Finder Feature (ميزة مستكشف المشاهد والدقائق بالعبارات) */}
            <div className="glass-card p-5 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-[#171329] via-[#121626] to-[#0f121d] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-black text-white">مستكشف المشاهد والدقائق الذكي (AI Scene Locator)</h3>
                </div>
                <span className="text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                  بحث بالنص والوصف
                </span>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                اكتب أي عبارة مشهورة أو وصف لمشهد سينمائي (مثال: "مشهد تفجير المستشفى في الجوكر" أو "قفزة سبايدرمان في الأكوان المتعددة"):
              </p>

              <form onSubmit={handleSearchScene} className="flex gap-2">
                <input
                  type="text"
                  value={sceneQuery}
                  onChange={e => setSceneQuery(e.target.value)}
                  placeholder="مثال: مشهد اختبار ترينيتي والصمت المطبق..."
                  className="flex-1 bg-[#0b0e17] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>تحديد المشهد</span>
                </button>
              </form>

              {foundScene && (
                <div className="p-3.5 bg-black/50 rounded-2xl border border-purple-500/40 flex items-center justify-between gap-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={foundScene.movie.poster}
                      alt={foundScene.movie.title}
                      className="w-12 h-16 rounded-xl object-cover shrink-0 shadow-md"
                    />
                    <div className="min-w-0 text-right">
                      <b className="text-xs text-white block truncate">{foundScene.movie.title}</b>
                      <span className="text-[11px] text-purple-300 font-bold block mt-0.5">
                        الدقيقة الزمنية: <code className="bg-purple-900/60 px-1.5 py-0.5 rounded text-amber-300">{foundScene.timestamp}</code>
                      </span>
                      <p className="text-[10px] text-gray-300 truncate mt-0.5">{foundScene.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsEvolutionModalOpen(false);
                      navigateTo('player', foundScene.movie);
                    }}
                    className="px-3 py-2 bg-[#e50914] hover:bg-[#ff1f2d] text-white text-xs font-black rounded-xl shrink-0 shadow-lg active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>انتقال وتطبيق</span>
                  </button>
                </div>
              )}
            </div>

            {/* Action to Proceed to Subscription */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setActiveTab('tiers')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-purple-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>الترقية إلى باقات التطور الذكي والاشتراك المباشر VIP ←</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TIERS SELECTION WITH D3 & LIQUID RING (باقات التطور الذكي بالتحكم السائل وD3) */}
        {!isSuccess && activeTab === 'tiers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white">الباقات والاشتراكات المنظمة بـ D3 والحلقة السائلة</h3>
              <p className="text-xs text-gray-300">تحكم سلس باللمس مع معالجة رسومية مباشرة عبر محرك D3</p>
            </div>

            <D3LiquidRingSubscription
              selectedTier={selectedTier}
              setSelectedTier={setSelectedTier}
              evolutionTiers={evolutionTiers}
              onProceedToCheckout={() => setActiveTab('checkout')}
            />
          </div>
        )}

        {/* TAB 3: STRUCTURED CHECKOUT & 3D PAYMENT CARD (عرض الدفع المباشر والمنظم) */}
        {!isSuccess && activeTab === 'checkout' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-black border border-purple-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('tiers')}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[10px] text-purple-300 font-bold block">ملخص الباقة المختارة:</span>
                  <b className="text-sm text-white block">{currentTierObj.name}</b>
                </div>
              </div>

              <div className="text-left">
                <span className="text-lg font-black text-amber-300 block">{currentTierObj.price}</span>
                <span className="text-[10px] text-emerald-400">تفعيل فوري تلقائي ⚡</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">اختر وسيلة الدفع المناسبة:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'visa', label: 'بطاقة ائتلاف 3D', icon: CreditCard, color: 'text-amber-400' },
                  { id: 'zaincash', label: 'محفظة زين كاش', icon: Smartphone, color: 'text-rose-400' },
                  { id: 'fastpay', label: 'FastPay / سوبرسيل', icon: Radio, color: 'text-cyan-400' },
                  { id: 'applepay', label: 'Apple Pay', icon: Tv, color: 'text-white' }
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2 ${
                      paymentMethod === m.id
                        ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/30 text-white'
                        : 'bg-[#131622] border-white/10 text-gray-400 hover:bg-white/5'
                    }`}
                  >
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                    <span className="text-xs font-bold truncate">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Views according to Payment Method */}
            {paymentMethod === 'visa' && (
              <InteractiveCreditCard
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardName={cardName}
                setCardName={setCardName}
                cardExpiry={cardExpiry}
                setCardExpiry={setCardExpiry}
                cardCvc={cardCvc}
                setCardCvc={setCardCvc}
                onSubmit={handlePaymentSubmit}
                totalPrice={currentTierObj.price}
                planName={currentTierObj.name}
              />
            )}

            {paymentMethod === 'zaincash' && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 bg-[#0e121e] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
                  <Smartphone className="w-6 h-6 text-rose-400 shrink-0" />
                  <div>
                    <b className="text-xs text-white block">محفظة زين كاش الرقمية (ZainCash)</b>
                    <span className="text-[10px] text-gray-300">أدخل رقم المحفظة العراقي لتسديد قيمة {currentTierObj.price}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 block">رقم هاتف المحفظة:</label>
                  <input
                    type="tel"
                    value={zainPhone}
                    onChange={e => setZainPhone(e.target.value)}
                    placeholder="0770 123 4567"
                    className="w-full bg-[#161a28] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-rose-400 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-300 block">رمز PIN السري للمحفظة:</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={zainPin}
                    onChange={e => setZainPin(e.target.value)}
                    placeholder="••••"
                    className="w-full bg-[#161a28] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-rose-400 font-mono tracking-widest text-center"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-rose-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>تأكيد الدفع عبر زين كاش ({currentTierObj.price})</span>
                </button>
              </form>
            )}

            {(paymentMethod === 'fastpay' || paymentMethod === 'applepay') && (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 bg-[#0e121e] p-6 rounded-3xl border border-white/10 text-center">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/40">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">الدفع السريع اللحظي ({paymentMethod === 'applepay' ? 'Apple Pay' : 'FastPay'})</h4>
                  <p className="text-xs text-gray-400">انقر أدناه لإكمال العملية وتفعيل اشتراك التطور الذكي مباشرة</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-gray-200 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-black" />
                  <span>دفع {currentTierObj.price} بنقرة واحدة</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* SUCCESS CONFIRMATION MODAL STATE */}
        {isSuccess && (
          <div className="space-y-6 text-center py-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-black flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-black stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                VIP ACTIVATION SUCCESSFUL
              </span>
              <h2 className="text-2xl font-black text-white">تم تفعيل اشتراك التطور الذكي بنجاح! 🎉</h2>
              <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                مبارك عليك! تم تفعيل ميزات الذكاء الاصطناعي ومعالجة الفيديوهات 8K والصوت المحيطي وتخصيص البث على حسابك ({userProfile.name}).
              </p>
            </div>

            {/* Electronic Receipt */}
            <div className="bg-[#111420] border border-white/10 p-5 rounded-3xl max-w-sm mx-auto text-right space-y-2 font-mono text-xs">
              <div className="flex justify-between text-gray-400">
                <span>رقم الفاتورة:</span>
                <span className="text-white font-bold">#EVO-2026-8821</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>الباقة المفعلة:</span>
                <span className="text-purple-300 font-bold">{currentTierObj.name}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>المبلغ المدفوع:</span>
                <span className="text-amber-300 font-bold">{currentTierObj.price}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>الحالة:</span>
                <span className="text-emerald-400 font-bold">مكتمل ومفعّل ⚡</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setIsEvolutionModalOpen(false);
                  setIsSuccess(false);
                  showToast('🎬 نتمنى لك مشاهدة ممتعة ومبهرة!');
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-black text-xs shadow-xl active:scale-95 transition-all"
              >
                العودة واستخدام ميزات الذكاء الاصطناعي 🎬
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
