import React, { useState } from 'react';
import { CreditCard, Lock, Sparkles, Check, ShieldCheck, Crown } from 'lucide-react';

interface InteractiveCreditCardProps {
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardName: string;
  setCardName: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
  cardCvc: string;
  setCardCvc: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  totalPrice?: string;
  planName?: string;
}

export const InteractiveCreditCard: React.FC<InteractiveCreditCardProps> = ({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  onSubmit,
  totalPrice,
  planName
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Format Card Number (4242 4242 4242 4242)
  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return val;
    }
  };

  const handleCardNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCardNumber(formatCardNumber(raw));
  };

  // Format Expiry (MM/YY)
  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    setCardExpiry(val.substring(0, 5));
  };

  // Mouse move for 3D card tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const displayNum = cardNumber || '4242 4242 4242 4242';
  const displayName = cardName || 'A. HASIB';
  const displayExpiry = cardExpiry || '12/28';
  const displayCvc = cardCvc || '123';

  return (
    <div className="space-y-6 w-full max-w-lg mx-auto">
      {/* 3D Interactive Card Preview */}
      <div
        className="perspective-1000 w-full h-52 sm:h-60 relative cursor-pointer select-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setMousePos({ x: 0, y: 0 });
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`w-full h-full duration-700 transition-all transform-style-3d relative rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/20 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          style={{
            transform: isFlipped
              ? 'rotateY(180deg)'
              : isHovered
              ? `rotateY(${mousePos.x * 20}deg) rotateX(${-mousePos.y * 20}deg) scale(1.02)`
              : 'rotateY(0deg) rotateX(0deg)'
          }}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between backface-hidden bg-gradient-to-tr from-[#0a1128] via-[#1c2a4a] to-[#00f5d4]/30 border border-white/20 shadow-2xl overflow-hidden">
            {/* Dynamic Light Reflection Effect */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-3xl bg-gradient-to-tr from-transparent via-white/10 to-transparent"
              style={{
                transform: `translate(${mousePos.x * 100}px, ${mousePos.y * 100}px)`
              }}
            />

            {/* Glowing Accent Orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00f5d4]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Card Header: Brand & Chip */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-lg text-black font-black">
                  <Crown className="w-5 h-5 text-black" />
                </div>
                <div>
                  <span className="text-xs font-black tracking-widest text-white uppercase block">SABLE VIP</span>
                  <span className="text-[9px] text-cyan-300 font-mono block">FILMMAX PREMIUM</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                <span className="text-xs font-black tracking-wider text-white">VISA</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
            </div>

            {/* Gold Metallic Chip & Contactless Icon */}
            <div className="flex items-center justify-between z-10 my-2">
              <div className="w-12 h-9 rounded-lg bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 border border-yellow-200/60 shadow-md flex items-center justify-center relative overflow-hidden">
                <div className="w-8 h-6 border border-amber-800/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                  <div className="border-r border-b border-amber-800/30" />
                  <div className="border-b border-amber-800/30" />
                  <div className="border-r border-amber-800/30" />
                  <div className="border-amber-800/30" />
                </div>
              </div>

              {/* Wifi / Contactless Icon */}
              <svg className="w-6 h-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10 10 0 0114.142 0" />
              </svg>
            </div>

            {/* Card Number */}
            <div className="z-10 font-mono text-lg sm:text-2xl tracking-widest font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {displayNum}
            </div>

            {/* Card Holder & Expiry */}
            <div className="flex items-end justify-between z-10 text-xs font-mono tracking-wider pt-1 border-t border-white/10">
              <div>
                <span className="text-[9px] text-gray-400 block font-sans uppercase">Cardholder Name</span>
                <span className="font-bold text-white uppercase text-sm truncate max-w-[180px] block">{displayName}</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-gray-400 block font-sans uppercase">EXPIRES</span>
                <span className="font-bold text-cyan-300 text-sm block">{displayExpiry}</span>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between backface-hidden rotate-y-180 bg-gradient-to-br from-[#0f111a] via-[#1a1e2e] to-[#080a10] border border-white/20 shadow-2xl overflow-hidden">
            {/* Magnetic Magnetic Strip */}
            <div className="absolute top-6 left-0 w-full h-12 bg-black shadow-inner" />

            <div className="mt-16 space-y-2 z-10">
              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                <span>AUTHORIZED SIGNATURE</span>
                <span>CVC / CVV CODE</span>
              </div>
              <div className="w-full h-10 bg-white/90 rounded-lg flex items-center justify-end px-4 shadow-inner">
                <span className="font-mono text-black font-black text-base tracking-widest italic">{displayCvc}</span>
              </div>
            </div>

            <div className="z-10 flex items-center justify-between text-[10px] text-gray-400 font-sans border-t border-white/10 pt-3">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>256-BIT SSL ENCRYPTED</span>
              </div>
              <span>FILMMAX VIP</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <span className="text-[11px] text-gray-400 font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>انقر على البطاقة أو ركز على حقل (CVC) لقلب البطاقة تفاعلياً 3D</span>
        </span>
      </div>

      {/* Input Form Fields */}
      <form onSubmit={onSubmit} className="space-y-4 bg-[#0e121e] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-300 block">اسم صاحب البطاقة (CARDHOLDER NAME):</label>
          <input
            type="text"
            value={cardName}
            onFocus={() => setIsFlipped(false)}
            onChange={e => setCardName(e.target.value)}
            placeholder="A. HASIB"
            className="w-full bg-[#161a28] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#00f5d4] transition-colors font-mono uppercase"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-300 block">رقم البطاقة (CARD NUMBER):</label>
          <div className="relative">
            <input
              type="text"
              maxLength={19}
              value={cardNumber}
              onFocus={() => setIsFlipped(false)}
              onChange={handleCardNumberInput}
              placeholder="4242 4242 4242 4242"
              className="w-full bg-[#161a28] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#00f5d4] transition-colors font-mono tracking-widest"
              required
            />
            <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 block">تاريخ الانتهاء (EXP DATE):</label>
            <input
              type="text"
              maxLength={5}
              value={cardExpiry}
              onFocus={() => setIsFlipped(false)}
              onChange={handleExpiryInput}
              placeholder="12/28"
              className="w-full bg-[#161a28] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#00f5d4] transition-colors font-mono text-center"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-300 block">رمز الأمان (CVC / CVV):</label>
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                value={cardCvc}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                onChange={e => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="123"
                className="w-full bg-[#161a28] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#00f5d4] transition-colors font-mono text-center tracking-widest"
                required
              />
              <Lock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Submit Pay Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#e50914] via-red-600 to-amber-500 hover:from-red-600 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>ادفع الآن ({totalPrice || '12,000 د.ع'}) — تفعيل فوري VIP</span>
          </button>
        </div>
      </form>
    </div>
  );
};
