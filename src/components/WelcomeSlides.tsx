import React, { useState, useEffect } from 'react';
import { AppLogo } from './AppLogo';
import {
  Film,
  Users,
  Bot,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Pause,
  ArrowLeft,
  Trophy,
  Cast,
  Volume2,
  VolumeX,
  Tv,
  MessageSquare,
  Heart,
  Flame,
  Star,
  CheckCircle2,
  Sliders,
  Smartphone,
  Eye,
  Radio,
  Clock,
  Zap,
  Globe
} from 'lucide-react';

interface WelcomeSlidesProps {
  onFinish: () => void;
  onSkipToAuth: () => void;
}

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  highlights: string[];
  category: string;
}

export const WelcomeSlides: React.FC<WelcomeSlidesProps> = ({ onFinish, onSkipToAuth }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Interactive Slide Demos State
  // Slide 1: Quality Toggle
  const [previewQuality, setPreviewQuality] = useState<'SD' | 'FHD' | '4K'>('4K');
  const [isTestingSound, setIsTestingSound] = useState(false);

  // Slide 2: Watch Party Reactions
  const [flyingEmojis, setFlyingEmojis] = useState<Array<{ id: number; emoji: string; x: number }>>([]);
  const [partyChatMsg, setPartyChatMsg] = useState('أفضل تجربة مشاهدة مع الأصدقاء! 🔥🍿');

  // Slide 3: AI CineBot Simulator
  const [aiSelectedPrompt, setAiSelectedPrompt] = useState<string | null>(null);

  // Slide 4: TV Cast Device Scan
  const [isScanningTv, setIsScanningTv] = useState(false);
  const [connectedTv, setConnectedTv] = useState<string | null>(null);

  const slides: SlideData[] = [
    {
      id: 1,
      category: 'سينما منزلي فائقة',
      title: 'سينما هوليوود في منزلك بجودة 4K HDR',
      subtitle: 'أضخم مكتبة أفلام ومسلسلات عالمية وعربية حصرياً',
      description: 'استمتع بدقة فائقة 4K Ultra HD مع تقنية Dolby Atmos الصوتية المحيطية 7.1 ودعم كامل للترجمات الذكية والدبلجة متعددة اللغات.',
      badge: '4K ULTRA HD • DOLBY ATMOS',
      badgeColor: 'from-red-600 via-rose-500 to-amber-500',
      icon: Film,
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=80',
      highlights: ['أفلام حصرية فور نزولها بدور العرض', 'صوت محيطي 7.1 دولبي أتموس سينمائي', 'تزامن الترجمات والتنقل الذكي']
    },
    {
      id: 2,
      category: 'البث المباشر المتزامن',
      title: 'المشاهدة الجماعية التفاعلية (Watch Party)',
      subtitle: 'شارك الفرحة مع أصدقائك في بث مباشر متزامن',
      description: 'أنشئ غرفتك الخاصة لمشاهدة الأفلام معاً في نفس اللحظة، مع شات صوتي مباشر وتفاعلات وإيموجيات طائرة ممتعة.',
      badge: 'WATCH PARTY SYNC',
      badgeColor: 'from-amber-500 via-orange-500 to-yellow-400',
      icon: Users,
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
      highlights: ['تزامن فوري للمشاهدة بدون تأخير', 'ميكروفون وتحدث صوتي مباشر', 'تفاعلات حية ورموز تعبيرية طائرة']
    },
    {
      id: 3,
      category: 'ذكاء سينمائي أسطوري',
      title: 'المساعد السينمائي AI وتحديات التريفيا',
      subtitle: 'ترشيحات فائقة الذكاء ومسابقات أوسكار يومية',
      description: 'مساعد AI يرشح لك أعمال تناسب مزاجك، ويشرح لك نهايات الأفلام الغامضة، مع مسابقات سينمائية لربح جوائز VIP.',
      badge: 'AI CINEBOT & TRIVIA',
      badgeColor: 'from-purple-600 via-indigo-500 to-cyan-400',
      icon: Bot,
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
      highlights: ['ترشيح حسب المزاج والشعور المباشر', 'شرح نهايات الأفلام وتفاصيل الحبكة', 'مسابقات وجوائز أوسكار يومية للمتصدرين']
    },
    {
      id: 4,
      category: 'حماية وتوصيل الشاشات',
      title: 'عالم الأطفال الآمن والتحكم بالشاشات الذكية',
      subtitle: 'بيئة عائلية محمية وريموت تحكم للتلفاز الذكي',
      description: 'وضع مخصص للأطفال بأفلام كرتونية مناسبة مع قفل أبوي ذكي، بالإضافة لبث الفيديو والتحكم في شاشة التلفاز الذكية.',
      badge: 'KIDS SAFE & TV CAST',
      badgeColor: 'from-emerald-500 via-teal-500 to-cyan-500',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
      highlights: ['محتوى عائلي محمي برمز PIN أبوي', 'مؤقت نوم ذكي وسجل مشاهدة أطفال', 'ريموت ذكي وبث للتلفاز (AirPlay/Cast)']
    },
    {
      id: 5,
      category: 'عضوية VIP بلا حدود',
      title: 'عضوية VIP الذهببة الممتازة',
      subtitle: 'شاهد بلا إعلانات وعلى 5 شاشات في وقت واحد',
      description: 'انضم لأكثر من مليون مشترك VIP واحصل على جميع الميزات السينمائية مع إمكانية التحميل والتنزيل للمشاهدة بدون إنترنت.',
      badge: 'ULTRA VIP PASS',
      badgeColor: 'from-amber-400 via-yellow-500 to-orange-500',
      icon: Trophy,
      image: 'https://images.unsplash.com/photo-1518676599625-5829623e12c6?w=1200&auto=format&fit=crop&q=80',
      highlights: ['بدون أي إعلانات مزعجة نهائياً', 'مشاهدة على 5 أجهزة وشاشات متزامنة', 'تحميل أوفلاين غير محدود بجودة 4K']
    }
  ];

  // Auto-advance timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  // Emoji Explosion Handler for Slide 2
  const triggerEmojiReaction = (emoji: string) => {
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.random() * 80 + 10
    };
    setFlyingEmojis(prev => [...prev, newEmoji]);
    setTimeout(() => {
      setFlyingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 1500);
  };

  // Sound test simulation handler
  const triggerSoundTest = () => {
    setIsTestingSound(true);
    setTimeout(() => {
      setIsTestingSound(false);
    }, 2000);
  };

  // TV Scanning Simulation
  const handleScanTv = () => {
    setIsScanningTv(true);
    setConnectedTv(null);
    setTimeout(() => {
      setIsScanningTv(false);
      setConnectedTv('Samsung OLED 8K TV (غرفة المعيشة)');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-[9990] bg-[#07090e] overflow-y-auto custom-scrollbar flex flex-col justify-between select-none text-white">
      {/* Background Poster Artwork with Cinematic Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.22] transition-all duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-transparent to-[#07090e]" />
        
        {/* Animated Glow Orbs */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Floating Header Bar */}
      <div className="relative z-20 px-4 sm:px-8 pt-6 flex items-center justify-between">
        <AppLogo size="sm" showSubtitle={true} subtitleText="ONBOARDING VIP" />

        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-gray-200 transition-all active:scale-95"
            title={soundEnabled ? 'كتم المؤثرات' : 'تشغيل المؤثرات'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>

          {/* Auto Play Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-gray-200 transition-all active:scale-95 hidden sm:flex items-center gap-1.5 text-xs font-bold"
            title="التشغيل التلقائي للشرائح"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-amber-400" />}
            <span className="text-[11px]">{isAutoPlaying ? 'توقف' : 'تشغيل'}</span>
          </button>

          {/* Fast Skip Button */}
          <button
            onClick={onSkipToAuth}
            className="text-xs font-black text-amber-300 hover:text-white bg-gradient-to-r from-amber-500/20 to-red-500/20 hover:from-amber-500/30 hover:to-red-500/30 border border-amber-400/40 px-4 py-2 rounded-2xl backdrop-blur-md transition-all active:scale-95 shadow-lg shadow-amber-500/10 flex items-center gap-1.5"
          >
            <span>تخطي للتسجيل</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Center Content Container */}
      <div className="relative z-20 px-4 sm:px-6 max-w-3xl mx-auto w-full my-auto py-6 space-y-6 text-center">
        {/* Slide Category & Animated Badge */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase font-black bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/30">
            {slide.category}
          </span>

          <div className="flex items-center gap-2.5 pt-1">
            <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${slide.badgeColor} text-white shadow-2xl shadow-red-500/20 border border-white/20 animate-pulse`}>
              <IconComponent className="w-7 h-7" />
            </div>
            <span className="text-xs font-black px-3.5 py-1.5 rounded-2xl bg-black/60 border border-white/20 text-white tracking-wider font-mono shadow-inner">
              {slide.badge}
            </span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-xl">
            {slide.title}
          </h1>
          <p className="text-sm sm:text-base font-bold text-amber-300">
            {slide.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl mx-auto">
          {slide.description}
        </p>

        {/* ================= INTERACTIVE DEMO WIDGET PER SLIDE ================= */}
        <div className="pt-2">
          {/* SLIDE 1 DEMO: 4K vs SD Quality & Sound Test */}
          {slide.id === 1 && (
            <div className="glass-card p-4 sm:p-5 rounded-3xl border border-white/15 bg-black/50 max-w-md mx-auto space-y-3.5 shadow-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                <span className="flex items-center gap-1.5 text-amber-300">
                  <Sliders className="w-4 h-4" />
                  <span>تلمس دقة العرض الفائقة:</span>
                </span>
                <span className="text-emerald-400 font-mono font-black">{previewQuality} ACTIVE</span>
              </div>

              {/* Quality Switcher Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'SD', label: 'دقة عادي SD (720p)' },
                  { id: 'FHD', label: 'دقة عالية FHD (1080p)' },
                  { id: '4K', label: 'دقة 4K HDR10+ ✨' }
                ].map(q => (
                  <button
                    key={q.id}
                    onClick={() => setPreviewQuality(q.id as any)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-black transition-all border ${
                      previewQuality === q.id
                        ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-amber-400 shadow-md scale-105'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Sound Test Button */}
              <button
                onClick={triggerSoundTest}
                disabled={isTestingSound}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Volume2 className={`w-4 h-4 ${isTestingSound ? 'text-amber-400 animate-bounce' : 'text-gray-300'}`} />
                <span>{isTestingSound ? '🔊 جاري اختبار صوت Dolby Atmos 7.1 السينمائي...' : 'اختبر جودة الصوت السينمائي (Dolby Test)'}</span>
              </button>
            </div>
          )}

          {/* SLIDE 2 DEMO: Watch Party Emoji Reactions */}
          {slide.id === 2 && (
            <div className="glass-card p-4 sm:p-5 rounded-3xl border border-amber-400/30 bg-black/50 max-w-md mx-auto space-y-3 relative overflow-hidden shadow-2xl">
              {/* Floating Emojis Animation */}
              {flyingEmojis.map(item => (
                <span
                  key={item.id}
                  className="absolute bottom-2 text-2xl pointer-events-none animate-bounce transition-all duration-1000"
                  style={{ left: `${item.x}%` }}
                >
                  {item.emoji}
                </span>
              ))}

              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>غرفة المشاهدة الجماعية الحية (4 متواجدين)</span>
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 font-mono font-bold animate-pulse">
                  ● LIVE SYNC
                </span>
              </div>

              {/* Chat Bubble Simulation */}
              <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-right text-xs text-amber-200 font-medium">
                💬 {partyChatMsg}
              </div>

              {/* Interactive Emoji Reaction Bar */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <span className="text-[11px] text-gray-400 font-bold">ارسل تفاعل مباشر:</span>
                {['🔥', '😍', '🍿', '🎉', '😱'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => triggerEmojiReaction(emoji)}
                    className="p-2 text-lg rounded-xl bg-white/5 hover:bg-white/20 border border-white/10 active:scale-125 transition-all"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 3 DEMO: AI CineBot Prompt Preview */}
          {slide.id === 3 && (
            <div className="glass-card p-4 sm:p-5 rounded-3xl border border-purple-500/30 bg-black/50 max-w-md mx-auto space-y-3 text-right shadow-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Bot className="w-4 h-4" />
                  <span>تجربة المساعد السينمائي AI:</span>
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-400/30">
                  Gemini 2.5 Flash
                </span>
              </div>

              {/* Sample AI Prompts */}
              <div className="space-y-1.5 text-xs">
                {[
                  'اقترح لي فيلم غموض بنهاية غير متوقعة 🧠',
                  'اشرح لي نهاية فيلم Interstellar والدقائق الأخيرة 🌌'
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAiSelectedPrompt(prompt)}
                    className={`w-full p-2.5 rounded-xl border text-right transition-all font-medium ${
                      aiSelectedPrompt === prompt
                        ? 'border-purple-400 bg-purple-500/20 text-white font-bold'
                        : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {aiSelectedPrompt && (
                <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 leading-relaxed animate-fadeIn">
                  ✨ <b>إجابة الذكاء الاصطناعي:</b> أرشح لك فيلم "Shutter Island" (2010) من إخراج مارتن سكورسيزي وبطولة ليوناردو دي كابريو، ملئ بالألغاز السايكولوجية وحبكة لن تنساها! 🎬
                </div>
              )}
            </div>
          )}

          {/* SLIDE 4 DEMO: TV Cast Scanner Simulator */}
          {slide.id === 4 && (
            <div className="glass-card p-4 sm:p-5 rounded-3xl border border-emerald-500/30 bg-black/50 max-w-md mx-auto space-y-3 text-right shadow-2xl">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Tv className="w-4 h-4" />
                  <span>اتصال التلفاز الذكي (AirPlay / Cast)</span>
                </span>
                <button
                  onClick={handleScanTv}
                  disabled={isScanningTv}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[10px] active:scale-95 transition-all"
                >
                  {isScanningTv ? 'جاري البحث... 📡' : 'بحث عن الشاشات'}
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-1">
                {connectedTv ? (
                  <div className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>متصل الآن بـ: {connectedTv}</span>
                  </div>
                ) : (
                  <p className="text-gray-400 text-[11px]">
                    اضغط بحث لاكتشاف الشاشات القريبة (Apple TV, Samsung QLED, LG WebOS, Chromecast)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SLIDE 5 DEMO: VIP Membership Preview */}
          {slide.id === 5 && (
            <div className="glass-card p-4 sm:p-5 rounded-3xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-transparent max-w-md mx-auto space-y-2 text-right shadow-2xl">
              <div className="flex items-center justify-between text-xs font-black text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>بطاقة عضوية ULTRA VIP</span>
                </span>
                <span className="text-[10px] font-mono bg-amber-400 text-black font-black px-2 py-0.5 rounded-md">
                  #VIP-PASS-2026
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-200 font-bold pt-1">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">✨ مشاهدة بدون إعلانات</div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">📱 5 شاشات بنفس الوقت</div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">📥 تحميل أوفلاين غير محدود</div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">🎧 صوت Dolby Atmos 7.1</div>
              </div>
            </div>
          )}
        </div>

        {/* Highlights Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full pt-1">
          {slide.highlights.map((highlight, index) => (
            <div
              key={index}
              className="p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center gap-2 text-[11px] font-bold text-gray-200 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls & Step Slider Bar */}
      <div className="relative z-20 p-6 max-w-2xl mx-auto w-full space-y-5">
        {/* Progress Step Indicators */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                idx === currentSlide
                  ? 'w-10 bg-gradient-to-r from-red-600 via-amber-400 to-yellow-400 shadow-lg shadow-red-500/50'
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-3">
          {currentSlide > 0 && (
            <button
              onClick={prevSlide}
              className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold transition-all active:scale-95"
              title="السابق"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={nextSlide}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#e50914] via-[#ff2e3b] to-amber-500 hover:from-[#ff1f2d] hover:to-amber-400 text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-red-500/30 transition-all active:scale-98"
          >
            <span>{currentSlide === slides.length - 1 ? 'انطلق للانضمام لعضوية VIP 🎬✨' : 'التالي (المتابعة)'}</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
