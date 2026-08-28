import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { InteractiveCreditCard } from './InteractiveCreditCard';
import { SmartEvolutionModal } from './SmartEvolutionModal';
import {
  Crown,
  Gem,
  X,
  Check,
  CreditCard,
  QrCode,
  Copy,
  Send,
  Sparkles,
  Bot,
  Bell,
  Trash2,
  Phone,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Loader2,
  Receipt,
  Tag,
  Star,
  Lock,
  Wallet,
  Smartphone,
  Download,
  UserPlus,
  Users,
  Flame,
  ShieldAlert
} from 'lucide-react';

/* ================= 1. PREMIUM VIP MODAL ================= */
export const PremiumModal: React.FC = () => {
  const {
    isPremiumModalOpen,
    setIsPremiumModalOpen,
    selectedPlan,
    setSelectedPlan,
    showToast,
    updateUserProfile,
    userProfile
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'visa' | 'zaincash' | 'phone' | 'applepay'>('visa');
  const [cardNumber, setCardNumber] = useState('4532 8812 9021 7734');
  const [cardName, setCardName] = useState('علي الحامد');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('773');
  const [phoneNumber, setPhoneNumber] = useState('07701234567');
  const [carrier, setCarrier] = useState<'zain' | 'asiacell' | 'korek'>('zain');
  const [couponCode, setCouponCode] = useState('');
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'receipt'>('select');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStepText, setProcessingStepText] = useState('جاري التشفير البنكي وحماية البيانات...');
  const [invoiceId, setInvoiceId] = useState('');

  if (!isPremiumModalOpen) return null;

  const plans = [
    {
      id: 'weekly' as const,
      name: 'الباقة الفضية السريعة',
      rawPrice: 4500,
      price: '4,500 د.ع',
      period: '7 أيام تجربة سينمائية',
      badge: 'الأنسب للتجربة ⚡',
      badgeBg: 'from-cyan-500/20 via-slate-800 to-cyan-950/40 text-cyan-300 border-cyan-500/40',
      accentColor: 'from-cyan-500 via-blue-500 to-cyan-600',
      priceColor: 'text-cyan-400',
      features: [
        'مشاهدة بدقة Full HD 1080p',
        'بدون أي إعلانات مزعجة إطلاقاً',
        'تنزيل موازي لـ 10 أفلام للأوفلاين',
        'صوت ستيريو عالي النقاوة 5.1'
      ]
    },
    {
      id: 'monthly' as const,
      name: 'الباقة الذهبية الملكية VIP',
      rawPrice: 12000,
      price: '12,000 د.ع',
      period: '30 يوماً من المتعة القصوى',
      badge: 'الأكثر طلباً شعبية 🔥',
      featured: true,
      badgeBg: 'from-[#e50914] via-red-600 to-amber-500 text-white font-black shadow-lg shadow-red-500/30 border-red-500/50',
      accentColor: 'from-[#e50914] via-red-500 to-amber-500',
      priceColor: 'text-red-400',
      features: [
        'مشاهدة بدقة 4K Ultra HD & HDR10+',
        'خالية تماماً من الإعلانات التجارية',
        'تنزيل موازي غير محدود للمشاهدة بدون إنترنت',
        'صوت سينمائي خارق Dolby Atmos & DTS:X',
        'تشغيل متزامن على جهازين معاً',
        'دعم فني أولوية VIP مخصص 24/7'
      ]
    },
    {
      id: 'yearly' as const,
      name: 'الباقة الماسية الحصرية',
      rawPrice: 100000,
      price: '100,000 د.ع',
      period: '365 يوماً (توفير 40% شامل)',
      badge: 'القيمة العظمى 👑',
      badgeBg: 'from-purple-600 via-indigo-600 to-emerald-500 text-white font-black shadow-lg shadow-purple-500/40 border-purple-500/50',
      accentColor: 'from-purple-500 via-indigo-500 to-emerald-400',
      priceColor: 'text-purple-400',
      features: [
        'كل ميزات الباقة الذهبية الملكية',
        'تشغيل متزامن على 4 أجهزة لمشاركة العائلة',
        'سيرفرات حصرية فائقة السرعة بدون تقطيع',
        'دعوات حصرية للعروض السينمائية الأولى',
        'اشتراك الذكاء الاصطناعي التطور مجاناً'
      ]
    }
  ];

  const currentPlanObj = plans.find(p => p.id === selectedPlan) || plans[1];
  const discountAmount = isCouponApplied ? Math.round(currentPlanObj.rawPrice * 0.2) : 0;
  const finalPriceRaw = currentPlanObj.rawPrice - discountAmount;
  const finalPriceFormatted = `${finalPriceRaw.toLocaleString('ar-IQ')} د.ع`;

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponCode.trim()) {
      showToast('يرجى كتابة رمز الكوبون أولاً');
      return;
    }
    const clean = couponCode.trim().toUpperCase();
    if (clean === 'FILMMAX' || clean === 'GOLD20' || clean === 'VIP2026' || clean === 'FILMMAX2026') {
      setIsCouponApplied(true);
      showToast('🎉 تم تطبيق كوبون الخصم بنجاح! خصم 20% على إجمالي الاشتراك.');
    } else {
      showToast('كوبون غير صالح، جرب الكوبون التجريبي: FILMMAX2026');
    }
  };

  const handleStartCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('processing');
    setProcessingProgress(15);
    setProcessingStepText('جاري الاتصال بفرع التشفير البنكي SSL 256-Bit...');

    const newInvoice = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
    setInvoiceId(newInvoice);

    setTimeout(() => {
      setProcessingProgress(50);
      setProcessingStepText('جاري التحقق من بيانات الدفع والرصيد المتاح...');
    }, 900);

    setTimeout(() => {
      setProcessingProgress(85);
      setProcessingStepText('جاري تفعيل العضوية الملكية VIP وإصدار الفاتورة الرقمية...');
    }, 1800);

    setTimeout(() => {
      setProcessingProgress(100);
      updateUserProfile({
        isPremium: true,
        premiumExpiry: '31/12/2026'
      });
      setPaymentStep('receipt');
      showToast('🎉 تهانينا! تم تفعيل اشتراكك الملكي VIP بنجاح وإصدار الفاتورة.');
    }, 2600);
  };

  const handleClose = () => {
    setIsPremiumModalOpen(false);
    setPaymentStep('select');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Golden Particle Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-yellow-600/5 to-transparent" />

      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#161a24] via-[#0f121b] to-[#080a10] border border-amber-500/30 rounded-3xl p-5 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.15)] space-y-6 text-right max-h-[92vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-200">

        {/* 1. Header Banner */}
        <div className="flex items-start justify-between border-b border-amber-500/20 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 text-amber-300 border border-amber-500/40 text-xs font-black shadow-lg shadow-amber-500/10">
              <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>ترقية العضوية الملكية VIP FilmMax</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              استمتع بالسينما بلا حدود وبأعلى دقة 4K HDR
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              بث مباشر فوري، بدون أي إعلانات، صوت Dolby Atmos، وتنزيل موازي غير محدود
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {paymentStep === 'select' && (
          <div className="space-y-6">
            {/* 2. Luxury Horizontal Plans Scroll Carousel */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-300 px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#e50914] animate-pulse" />
                  اختر باقة الاشتراكات الملكية (اسحب أفقياً لاستعراض الباقات):
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                  عرض أفقي سلس ↔️
                </span>
              </div>

              <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 py-3 px-1 custom-scrollbar scroll-smooth w-full">
                {plans.map(p => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id)}
                      className={`snap-center shrink-0 w-[270px] sm:w-[310px] relative rounded-3xl p-0.5 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                        isSelected
                          ? `bg-gradient-to-b ${p.accentColor} shadow-2xl shadow-red-500/20 ring-2 ring-red-500/60 scale-[1.02]`
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className={`w-full h-full p-5 rounded-[22px] flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#1a1322] via-[#11131c] to-[#08090f]'
                          : 'bg-[#0f121a] hover:bg-[#131824]'
                      }`}>
                        {/* Top Badge & Selected Check mark */}
                        {p.badge && (
                          <div className="flex justify-between items-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border bg-gradient-to-r ${p.badgeBg}`}>
                              {p.badge}
                            </span>
                            {isSelected && (
                              <span className="w-6 h-6 rounded-full bg-[#e50914] text-white flex items-center justify-center shadow-lg shadow-red-500/40">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        )}

                        <div className="space-y-2">
                          <h3 className="text-base font-black text-white">{p.name}</h3>
                          <div className="flex items-baseline gap-1">
                            <span className={`text-2xl sm:text-3xl font-black ${p.priceColor} tracking-tight`}>{p.price}</span>
                          </div>
                          <span className="text-[11px] text-gray-300 block font-bold">{p.period}</span>

                          <ul className="space-y-2 pt-3 border-t border-white/10 text-xs text-gray-200">
                            {p.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Check className={`w-3.5 h-3.5 ${p.priceColor} shrink-0 mt-0.5 stroke-[3]`} />
                                <span className="leading-tight">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2">
                          <button
                            type="button"
                            className={`w-full py-2.5 rounded-2xl text-xs font-black transition-all ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#e50914] to-red-600 text-white shadow-lg shadow-red-600/40'
                                : 'bg-white/10 text-gray-200 hover:bg-white/20'
                            }`}
                          >
                            {isSelected ? 'الباقة المحددة حالياً ✓' : 'اختيار هذه الباقة'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Horizontal Pagination Dots Indicator */}
              <div className="flex items-center justify-center gap-2 pt-1">
                {plans.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      selectedPlan === p.id ? 'w-8 bg-[#e50914]' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 3. Promo Code Coupon Box */}
            <div className="bg-[#0f121a] p-4 rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">هل لديك كوبون خصم ذهبي؟</h4>
                  <p className="text-[10px] text-gray-400">جرب الكوبون الحصري: <code className="text-amber-400 font-mono font-bold">FILMMAX2026</code> للخصم 20%</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="أدخل الكوبون هنا..."
                  disabled={isCouponApplied}
                  className="bg-[#161a26] border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400 uppercase tracking-wider w-full sm:w-36"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  disabled={isCouponApplied}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isCouponApplied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500 hover:bg-amber-400 text-black font-black active:scale-95'
                  }`}
                >
                  {isCouponApplied ? 'مُطبق (20% خصم) ✓' : 'تطبيق'}
                </button>
              </div>
            </div>

            {/* 4. Interactive Payment Method Selector */}
            <form onSubmit={handleStartCheckout} className="space-y-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-200 block">اختر وسيلة الدفع التجريبية الآمنة:</span>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  تشفير بنكي آمن 256-Bit SSL
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'visa' as const, label: 'بطاقة فيزا / ماستر', icon: CreditCard },
                  { id: 'zaincash' as const, label: 'زين كاش / آسيا', icon: Wallet },
                  { id: 'phone' as const, label: 'خصم من رصيد الهاتف', icon: Smartphone },
                  { id: 'applepay' as const, label: 'Apple / Google Pay', icon: Zap }
                ].map(pm => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-3 px-3 rounded-2xl border text-xs font-black transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-amber-600/20 border-amber-400 text-amber-300 ring-1 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                          : 'bg-[#0f121a] border-white/10 text-gray-400 hover:text-white hover:bg-[#131824]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-gray-400'}`} />
                      <span className="truncate">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Fields according to method */}
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
                  onSubmit={handleStartCheckout}
                  totalPrice={finalPriceFormatted}
                  planName={currentPlanObj.name}
                />
              )}

              {paymentMethod === 'zaincash' && (
                <div className="space-y-4 bg-[#0d1017] p-4 sm:p-5 rounded-2xl border border-amber-500/20 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-2xl p-2 border-2 border-amber-400 shadow-xl flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-black" />
                    </div>
                    <div className="text-right">
                      <h4 className="text-sm font-black text-white">الدفع عبر محفظة زين كاش / آسيا حوالة</h4>
                      <p className="text-xs text-gray-400">امسح رمز الـ QR أعلاه أو أدخل رقم المحفظة لتحويل المبلغ مباشرة</p>
                      <span className="inline-block mt-1 text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                        رقم محفظة الشركة: 07701234567
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-right pt-2 border-t border-white/10">
                    <label className="text-[11px] font-bold text-gray-300 block">رقم محفظتك الإلكترونية للتأكيد:</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="07701234567"
                      className="w-full bg-[#161a26] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'phone' && (
                <div className="space-y-3 bg-[#0d1017] p-4 sm:p-5 rounded-2xl border border-amber-500/20">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-300 block">اختر شبكة الهاتف المحمول:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'zain' as const, name: 'زين العراق Zain' },
                        { id: 'asiacell' as const, name: 'آسيا سيل Asiacell' },
                        { id: 'korek' as const, name: 'كورك Korek' }
                      ].map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setCarrier(c.id)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                            carrier === c.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                              : 'bg-[#161a26] border-white/10 text-gray-400'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-300 block">رقم الموبايل لخصم الرصيد تلقائياً:</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="07701234567"
                      className="w-full bg-[#161a26] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-amber-400"
                      required
                    />
                    <span className="text-[10px] text-gray-400 block pt-0.5">
                      سيتم خصم قيمة الاشتراك مباشرة من رصيد الكارت المتاح في خطك.
                    </span>
                  </div>
                </div>
              )}

              {paymentMethod === 'applepay' && (
                <div className="bg-[#0d1017] p-5 rounded-2xl border border-amber-500/20 text-center space-y-2">
                  <Zap className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                  <h4 className="text-sm font-black text-white">الدفع السريع بضغطة واحدة عبر Apple Pay / Google Pay</h4>
                  <p className="text-xs text-gray-400">تتم عملية الخصم بالبصمة أو Face ID من محفظتك الإلكترونية المعتمدة</p>
                </div>
              )}

              {/* 5. Live Price Breakdown */}
              <div className="bg-[#0a0d14] p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-300">
                  <span>سعر {currentPlanObj.name}:</span>
                  <span className="font-bold">{currentPlanObj.price}</span>
                </div>
                {isCouponApplied && (
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span>خصم الكوبون الذهبي (20%):</span>
                    <span>- {discountAmount.toLocaleString('ar-IQ')} د.ع</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-gray-400 text-[11px]">
                  <span>رسوم التفعيل الخدمية:</span>
                  <span className="text-emerald-400 font-bold">مجاناً (0 د.ع)</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm sm:text-base font-black text-white">
                  <span>المجموع النهائي المستحق:</span>
                  <span className="text-amber-400 text-lg sm:text-xl">{finalPriceFormatted}</span>
                </div>
              </div>

              {/* 6. Checkout CTA Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-sm shadow-2xl shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>إتمام الدفع وتفعيل الاشتـراك VIP فوراً ({finalPriceFormatted})</span>
              </button>
            </form>
          </div>
        )}

        {/* Payment Processing Modal Step */}
        {paymentStep === 'processing' && (
          <div className="py-12 px-4 text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-xl font-black text-white">جاري معالجة الدفع والتشفير...</h3>
              <p className="text-xs text-amber-300 font-bold">{processingStepText}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-gray-400">{processingProgress}% مكتمل</span>
          </div>
        )}

        {/* Digital VIP Receipt Modal Step */}
        {paymentStep === 'receipt' && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-300 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black inline-block">
                عضوية FilmMax VIP مفعّلة الآن 👑
              </span>
              <h3 className="text-2xl font-black text-white">تمت عملية الاشتراك بنجاح!</h3>
              <p className="text-xs text-gray-300">أهلاً بك في العضوية الملكية، تم تحديث حسابك للاستمتاع بلا حدود</p>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#0f121a] border border-amber-500/30 rounded-2xl p-5 text-right space-y-3 font-sans relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-white">فاتورة الاشتراك الإلكترونية</span>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400">{invoiceId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 block text-[10px]">الاسم:</span>
                  <span className="font-bold text-white">{userProfile.name || 'عضو VIP'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">نوع الباقة:</span>
                  <span className="font-bold text-amber-400">{currentPlanObj.name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">تاريخ الانتهاء:</span>
                  <span className="font-bold text-emerald-400">31/12/2026</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">المبلغ المدفوع:</span>
                  <span className="font-bold text-white">{finalPriceFormatted}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-xs rounded-2xl shadow-xl active:scale-95 transition-all"
              >
                بدء مشاهدة الأفلام بأعلى دقة الآن 🎬
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('تم تحميل الفاتورة الرقمية بصيغة PDF 📄');
                }}
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الفاتورة</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= 2. AI EVOLUTION STORE MODAL ================= */
export const EvolutionStoreModal = SmartEvolutionModal;

/* ================= 3. SHARE MODAL WITH QR ================= */
export const ShareModal: React.FC = () => {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    shareTargetMovie,
    showToast
  } = useApp();

  if (!isShareModalOpen) return null;

  const targetTitle = shareTargetMovie?.title || 'تطبيق FilmMax Cinema';
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}#film=${shareTargetMovie?.id || 'app'}` : 'https://filmmax.vip';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(shareUrl).then(() => {
      showToast('تم نسخ رابط المشاركة إلى الحافظة 📋');
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0f131a] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 text-right">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white">مشاركة العمل</h3>
            <p className="text-xs text-gray-400 truncate max-w-xs">{targetTitle}</p>
          </div>

          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="bg-white p-4 rounded-2xl w-44 h-44 mx-auto flex items-center justify-center shadow-xl">
          <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 bg-[#171c26] border border-white/10 rounded-xl p-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs text-gray-300 outline-none px-2"
          />
          <button
            onClick={copyToClipboard}
            className="px-3 py-1.5 bg-[#e50914] text-white text-xs font-bold rounded-lg flex items-center gap-1 hover:bg-[#ff1f2d] active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>نسخ</span>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          {[
            { name: 'WhatsApp', color: '#25D366' },
            { name: 'Telegram', color: '#0088cc' },
            { name: 'X / Twitter', color: '#ffffff' },
            { name: 'Facebook', color: '#1877F2' }
          ].map(s => (
            <button
              key={s.name}
              onClick={() => {
                copyToClipboard();
                showToast(`تم فتح المشاركة عبر ${s.name}`);
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-center text-xs font-bold text-gray-200 transition-all active:scale-90"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ================= 4. AI CHAT SUPPORT / CINEBOT MODAL ================= */
export const AIChatSupportModal: React.FC = () => {
  const { isChatSupportOpen, setIsChatSupportOpen, movies, navigateTo } = useApp();
  const [messages, setMessages] = useState<Array<{
    sender: 'user' | 'bot';
    text: string;
    suggestedMovie?: any;
  }>>([
    {
      sender: 'bot',
      text: 'أهلاً بك في مساعد السينما الذكي (FilmMax AI CineBot)! 🤖🎬 كيف تشعر اليوم؟ يمكنني ترشيح أفلام حسب مزاجك، شرح نهايات الأفلام المعقدة بدون حرق، أو تلخيص السلاسل السينمائية.'
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  if (!isChatSupportOpen) return null;

  const MOOD_PRESETS = [
    { label: '🔥 أدرينالين وأكشن', query: 'أريد فيلم أكشن حماسي جداً يرفع الأدرينالين' },
    { label: '🧠 غموض ونهايات معقدة', query: 'أريد فيلم غموض وحبكة صادمة لم أتوقعها' },
    { label: '😂 كوميديا وفرفشة', query: 'أريد فيلم كوميدي لطيف لتغيير المزاج' },
    { label: '🚀 خيال علمي وفضاء', query: 'أريد رحلة خيال علمي عميقة بالفضاء' },
    { label: '❓ اشرح نهاية Inception', query: 'اشرح لي نهاية فيلم بداية Inception وتوتيم الأحلام' }
  ];

  const handleSend = (textToSend?: string) => {
    const userText = (textToSend || inputMsg).trim();
    if (!userText) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    if (!textToSend) setInputMsg('');

    setTimeout(() => {
      let botReply = '';
      let suggested: any = null;

      if (userText.includes('Inception') || userText.includes('بداية')) {
        botReply = 'في نهاية Inception، ترك نولان "التوتيم" يدور ويهتز قليلاً قبل أن تنقطع الشاشة؛ الهدف الحقيقي هو أن "كوب" لم يعد يكترث إن كان في حلم أو واقع، لأنه حقق هدفه بالعودة لأطفاله والسعادة الحقيقية.';
        suggested = movies.find(m => String(m.id) === '103');
      } else if (userText.includes('أكشن') || userText.includes('أدرينالين')) {
        botReply = 'أنصحك فوراً بمشاهدة "The Dark Knight" أو "Dune: Part Two" – مطاردات متقنة، إخراج عبقري، وموسيقى ملحمية تأخذك لعالم آخر.';
        suggested = movies.find(m => String(m.id) === '101');
      } else if (userText.includes('غموض') || userText.includes('معقدة')) {
        botReply = 'عليك بمشاهدة "Oppenheimer" أو "Interstellar" – سيناريو محبوك باقتدار وأسئلة فلسفية عميقة ستبقى في ذهنك طويلاً.';
        suggested = movies.find(m => String(m.id) === '102');
      } else if (userText.includes('كوميدي') || userText.includes('فرفشة') || userText.includes('عائلي')) {
        botReply = 'أنصحك بمشاهدة "Inside Out 2" أو "Kung Fu Panda 4" – ضحك ومشاعر جميلة تناسب قضاء أمسية دافئة.';
        suggested = movies.find(m => String(m.id) === '111');
      } else {
        botReply = `بناءً على طلبك، العمل الأنسب لك هو "${movies[0].title}" – بتقييم ${movies[0].rating} ⭐ وجودة 4K فائقة.`;
        suggested = movies[0];
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply, suggestedMovie: suggested }]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative w-full sm:max-w-lg bg-[#0f131a] border-t sm:border border-white/15 sm:rounded-3xl p-5 shadow-2xl space-y-4 text-right flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">المساعد السينمائي الذكي (FilmMax AI CineBot)</h3>
              <span className="text-[10px] text-emerald-400 font-bold">ذكاء سينمائي متصل ومستعد 🤖✨</span>
            </div>
          </div>

          <button
            onClick={() => setIsChatSupportOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mood Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {MOOD_PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-gray-200 font-bold whitespace-nowrap active:scale-95 transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Message feed */}
        <div className="flex-1 overflow-y-auto space-y-3 py-2 custom-scrollbar max-h-80">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.sender === 'user' ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#e50914] text-white rounded-br-none shadow-md'
                    : 'bg-[#181e2a] text-gray-200 border border-white/10 rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>

                {/* Suggested Movie Action Card */}
                {m.suggestedMovie && (
                  <div className="mt-3 p-2.5 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={m.suggestedMovie.poster}
                        alt=""
                        className="w-8 h-11 rounded-lg object-cover"
                      />
                      <div className="min-w-0 text-right">
                        <span className="text-[11px] font-black text-white block truncate">{m.suggestedMovie.title}</span>
                        <span className="text-[10px] text-amber-400 font-bold">{m.suggestedMovie.rating} ⭐</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsChatSupportOpen(false);
                        navigateTo('player', m.suggestedMovie);
                      }}
                      className="px-3 py-1.5 bg-[#e50914] hover:bg-[#ff1f2d] text-white text-[10px] font-black rounded-lg shrink-0 shadow active:scale-95 transition-all"
                    >
                      مشاهدة الآن ▶️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-2 border-t border-white/10 flex gap-2"
        >
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder="اطلب اقتراحاً حسب مزاجك أو اسأل عن قصة فيلم..."
            className="flex-1 bg-[#141822] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#e50914]"
          />
          <button
            type="submit"
            className="bg-[#e50914] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#ff1f2d] active:scale-95 transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

/* ================= 5. NOTIFICATIONS DRAWER ================= */
export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    navigateTo,
    movies
  } = useApp();

  if (!isNotificationOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-start">
      <div className="w-full max-w-sm bg-[#0d1017] border-l border-white/10 h-full p-5 shadow-2xl flex flex-col text-right animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#e50914]" />
            <h3 className="text-base font-black text-white">مركز الإشعارات</h3>
          </div>

          <button
            onClick={() => setIsNotificationOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear all */}
        {notifications.length > 0 && (
          <div className="py-2 flex justify-end">
            <button
              onClick={clearAllNotifications}
              className="text-[11px] text-gray-400 hover:text-red-400 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>مسح الكل</span>
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 py-2 custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markNotificationAsRead(n.id);
                  if (n.movieId) {
                    const found = movies.find(m => m.id === n.movieId);
                    if (found) {
                      navigateTo('details', found);
                      setIsNotificationOpen(false);
                    }
                  }
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  n.isRead
                    ? 'bg-white/5 border-white/5 text-gray-400'
                    : 'bg-[#181d28] border-red-500/30 text-white shadow-md'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-white truncate">{n.title}</span>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#e50914] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">{n.body}</p>
                <span className="text-[10px] text-gray-500 block mt-1.5">{n.time}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500 text-xs">
              لا توجد إشعارات جديدة لديك حالياً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= 7. ACCOUNT SWITCHER MODAL ================= */
export const AccountSwitcherModal: React.FC = () => {
  const {
    isAccountSwitcherOpen,
    setIsAccountSwitcherOpen,
    userAccounts,
    activeAccountId,
    switchAccount,
    addNewAccount,
    deleteAccount,
    showToast
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccRole, setNewAccRole] = useState<'owner' | 'family' | 'kids'>('family');

  if (!isAccountSwitcherOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) {
      showToast('يرجى كتابة اسم الحساب الجديد');
      return;
    }
    addNewAccount({
      name: newAccName.trim(),
      role: newAccRole,
      avatar:
        newAccRole === 'kids'
          ? 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });
    setNewAccName('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#151922] to-[#0c0f16] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-6 text-right animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#e50914]" />
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">تبديل الحسابات والملفات</h3>
              <p className="text-xs text-gray-400">اختر حسابك للانتقال إلى التفضيلات والقوائم الخاصة بك</p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAccountSwitcherOpen(false);
              setIsAddingNew(false);
            }}
            className="p-1.5 text-gray-400 hover:text-white rounded-full bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account List */}
        {!isAddingNew ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5 max-h-[50vh] overflow-y-auto custom-scrollbar pr-1">
              {userAccounts.map(acc => {
                const isActive = acc.id === activeAccountId;
                return (
                  <div
                    key={acc.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-[#1e1726] border-[#e50914] shadow-lg shadow-[#e50914]/20 ring-1 ring-[#e50914]/50'
                        : 'bg-[#11151e] border-white/10 hover:border-white/20 hover:bg-[#161b26]'
                    }`}
                  >
                    <div
                      onClick={() => switchAccount(acc.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white/20 shadow-md"
                        />
                        {isActive && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#e50914] rounded-full border-2 border-[#0c0f16] flex items-center justify-center">
                            <Check className="w-3 h-3 text-white stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 text-right">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-white truncate">{acc.name}</span>
                          {acc.badge && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                              {acc.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 truncate block mt-0.5">
                          {acc.role === 'kids' ? 'حساب أطفال آمن 🎈' : acc.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isActive && (
                        <button
                          onClick={() => switchAccount(acc.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#e50914] text-white text-xs font-bold hover:bg-[#ff1f2d] shadow active:scale-95 transition-all"
                        >
                          تبديل
                        </button>
                      )}
                      {userAccounts.length > 1 && (
                        <button
                          onClick={() => deleteAccount(acc.id)}
                          title="حذف الحساب"
                          className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Account Button */}
            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <UserPlus className="w-4 h-4 text-[#e50914]" />
              <span>إضافة حساب أو بروفايل عائلي جديد</span>
            </button>
          </div>
        ) : (
          /* Add Account Form */
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">اسم الحساب أو الملف الشخصي:</label>
              <input
                type="text"
                value={newAccName}
                onChange={e => setNewAccName(e.target.value)}
                placeholder="مثال: أحمد، العائلة، سينما الأصدقاء..."
                className="w-full bg-[#11151e] border border-white/15 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#e50914]"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">نوع الحساب:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'owner' as const, label: 'رئيسي VIP 👑' },
                  { id: 'family' as const, label: 'عائلي ✨' },
                  { id: 'kids' as const, label: 'أطفال Safe 🎈' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setNewAccRole(r.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      newAccRole === r.id
                        ? 'bg-[#e50914]/20 border-[#e50914] text-white'
                        : 'bg-[#11151e] border-white/10 text-gray-400'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#e50914] text-white font-black text-xs rounded-2xl hover:bg-[#ff1f2d] shadow-lg active:scale-95 transition-all"
              >
                إنشاء وتأكيد الحساب
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-4 py-3 bg-white/5 text-gray-300 font-bold text-xs rounded-2xl hover:bg-white/10 transition-all"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

/* ================= 8. FLOATING TOAST ================= */
export const GlobalToast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#151a24]/95 backdrop-blur-xl border border-white/20 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-black flex items-center gap-2.5 animate-bounce">
      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
      <span>{toastMessage}</span>
    </div>
  );
};

