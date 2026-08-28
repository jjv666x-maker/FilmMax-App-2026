import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Sparkles,
  Check,
  Crown,
  Zap,
  Gem,
  ArrowLeft,
  ShieldCheck,
  Tv,
  Volume2,
  Cpu,
  Flame
} from 'lucide-react';

export interface TierItem {
  id: 'weekly' | 'monthly' | 'yearly';
  name: string;
  price: string;
  period: string;
  badge: string;
  featured?: boolean;
  savings?: string;
  aiPowerScore: number; // 0 to 100
  features: string[];
}

interface D3LiquidRingSubscriptionProps {
  selectedTier: 'weekly' | 'monthly' | 'yearly';
  setSelectedTier: (tier: 'weekly' | 'monthly' | 'yearly') => void;
  evolutionTiers: TierItem[];
  onProceedToCheckout: () => void;
}

export const D3LiquidRingSubscription: React.FC<D3LiquidRingSubscriptionProps> = ({
  selectedTier,
  setSelectedTier,
  evolutionTiers,
  onProceedToCheckout
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState<number>(0.5); // 0 (weekly) to 1 (yearly)

  const activeIndex = evolutionTiers.findIndex(t => t.id === selectedTier);
  const currentTier = evolutionTiers[activeIndex] || evolutionTiers[1];

  // Synchronize initial drag position with activeIndex
  useEffect(() => {
    if (!isDragging) {
      setDragProgress(activeIndex / (evolutionTiers.length - 1));
    }
  }, [activeIndex, isDragging, evolutionTiers.length]);

  // Handle Touch / Mouse Dragging for the Liquid Ring
  const updateProgressFromEvent = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    let ratio = relativeX / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    
    // Reverse ratio for RTL if needed, but horizontal slider handles left-to-right 0..1 easily
    setDragProgress(ratio);

    // Determine nearest tier index
    const count = evolutionTiers.length;
    const nearestIndex = Math.round(ratio * (count - 1));
    const targetTier = evolutionTiers[nearestIndex];
    if (targetTier && targetTier.id !== selectedTier) {
      setSelectedTier(targetTier.id);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    updateProgressFromEvent(e.clientX);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      updateProgressFromEvent(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      // Snap to exact index position
      const count = evolutionTiers.length;
      const nearestIndex = Math.round(dragProgress * (count - 1));
      setDragProgress(nearestIndex / (count - 1));
      if (evolutionTiers[nearestIndex]) {
        setSelectedTier(evolutionTiers[nearestIndex].id);
      }
    }
  };

  // Render D3 AI Performance Wave & Metrics Visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear canvas

    const width = 600;
    const height = 140;
    const margin = { top: 20, right: 30, bottom: 30, left: 30 };

    // Set SVG attributes
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // D3 Scale based on current AI power score
    const targetScore = currentTier.aiPowerScore; // 60, 85, 100

    // Generate dynamic wave data points
    const pointsCount = 40;
    const data = d3.range(pointsCount).map(i => {
      const x = (i / (pointsCount - 1)) * innerWidth;
      const freq = 0.15 + (targetScore / 100) * 0.1;
      const amplitude = (targetScore / 100) * 28 + 10;
      const y =
        innerHeight / 2 +
        Math.sin(i * freq + dragProgress * Math.PI * 4) * amplitude +
        Math.cos(i * 0.3) * 6;
      return { x, y };
    });

    // D3 Area Generator for Liquid Glow Area
    const area = d3
      .area<{ x: number; y: number }>()
      .x(d => d.x)
      .y0(innerHeight)
      .y1(d => d.y)
      .curve(d3.curveBasis);

    // D3 Line Generator for Wave
    const line = d3
      .line<{ x: number; y: number }>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveBasis);

    // D3 Gradient Definition
    const defs = svg.append('defs');

    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'd3-liquid-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#a855f7')
      .attr('stop-opacity', '0.6');

    areaGradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', '0.3');

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#06b6d4')
      .attr('stop-opacity', '0.05');

    // Draw Liquid Gradient Area
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#d3-liquid-gradient)')
      .attr('d', area);

    // Draw Dynamic Wave Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#c084fc')
      .attr('stroke-width', 3.5)
      .attr('stroke-linejoin', 'round')
      .attr('d', line)
      .attr('filter', 'drop-shadow(0px 0px 8px rgba(168,85,247,0.8))');

    // D3 Animated Nodes & Particles along the wave
    const sampleIndices = [8, 18, 28, 36];
    sampleIndices.forEach((idx, i) => {
      const pt = data[idx];
      if (!pt) return;

      const nodeGroup = g
        .append('g')
        .attr('transform', `translate(${pt.x}, ${pt.y})`);

      // Outer pulsing ring
      nodeGroup
        .append('circle')
        .attr('r', 8)
        .attr('fill', 'none')
        .attr('stroke', i % 2 === 0 ? '#fbbf24' : '#38bdf8')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8);

      // Inner glowing core
      nodeGroup
        .append('circle')
        .attr('r', 4)
        .attr('fill', '#ffffff');

      // Floating D3 Value Badges
      const labels = ['60 FPS', '8K AI', 'Dolby 3D', 'Zero-Lag'];
      nodeGroup
        .append('text')
        .attr('y', -14)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e9d5ff')
        .attr('font-size', '9px')
        .attr('font-weight', 'bold')
        .attr('font-family', 'Cairo, sans-serif')
        .text(labels[i] || 'AI');
    });
  }, [currentTier, dragProgress]);

  return (
    <div className="space-y-6 select-none dir-rtl">
      {/* 1. D3 AI POWER WAVE VISUALIZER */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#171228] via-[#0f121d] to-[#0a101b] p-4 border border-purple-500/30 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-purple-300 font-bold block">مخطط تسريع الدقة بـ D3</span>
              <h4 className="text-xs font-black text-white">مؤشر أداء الذكاء الاصطناعي (D3 Live Engine)</h4>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left font-mono">
              <span className="text-[10px] text-gray-400 block">طاقة المعالجة:</span>
              <b className="text-sm font-black text-amber-300">{currentTier.aiPowerScore}% ⚡</b>
            </div>
          </div>
        </div>

        {/* D3 Canvas */}
        <div className="w-full h-28 relative">
          <svg ref={svgRef} className="w-full h-full overflow-visible" />
        </div>
      </div>

      {/* 2. LIQUID INTERACTIVE SLIDING RING CONTROL (حلقة سائلة متحركة باللمس السلس) */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-purple-500/30 bg-[#121422] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <h3 className="text-sm font-black text-white">اسحب الحلقة السائلة لتبديل الباقة 💫</h3>
          </div>
          <span className="text-[10px] text-cyan-300 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 font-mono font-bold">
            أفقي + تحكم سائل
          </span>
        </div>

        <p className="text-xs text-gray-300">
          حرك الدائرة السائلة يميناً ويساراً باللمس أو الماوس للتنقل السلس بين باقات الاشتراكات وملاحظة التأثير المباشر:
        </p>

        {/* Liquid SVG Gooey Filter */}
        <svg className="hidden">
          <defs>
            <filter id="liquid-goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        {/* Interactive Track Area */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-16 bg-[#0b0e18] rounded-full border border-purple-500/30 p-2 cursor-grab active:cursor-grabbing flex items-center touch-none select-none shadow-inner"
        >
          {/* Track Fill Progress Layer */}
          <div
            className="absolute top-2 bottom-2 right-2 rounded-full bg-gradient-to-l from-purple-600 via-indigo-500 to-amber-500 transition-all duration-75 opacity-30 pointer-events-none"
            style={{ width: `${dragProgress * 100}%` }}
          />

          {/* Node Snap Markers for Horizontal Plans */}
          <div className="absolute inset-x-6 flex justify-between items-center pointer-events-none z-10">
            {evolutionTiers.map((t, idx) => {
              const isCurrent = t.id === selectedTier;
              return (
                <div key={t.id} className="flex flex-col items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      isCurrent
                        ? 'bg-amber-400 border-white scale-125 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                        : 'bg-gray-700 border-gray-500'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold mt-1.5 transition-colors ${
                      isCurrent ? 'text-amber-300 font-black' : 'text-gray-400'
                    }`}
                  >
                    {t.period}
                  </span>
                </div>
              );
            })}
          </div>

          {/* FLUID LIQUID RING HANDLE (الدائرة السائلة المتحركة) */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-transform duration-75 pointer-events-none z-20"
            style={{
              left: `calc(${dragProgress * 88}% + 12px)`
            }}
          >
            {/* Liquid Ring Outer Glow */}
            <div className="relative w-12 h-12 rounded-full flex items-center justify-center">
              {/* Liquid Fluid Ripple Layers */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-amber-400 to-indigo-500 animate-spin-slow blur-xs opacity-90 shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
              <div className="absolute -inset-1 rounded-full bg-amber-400/40 animate-ping opacity-40" />

              {/* Central Metallic Orb */}
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-b from-white via-amber-100 to-purple-200 shadow-xl border-2 border-amber-300 flex items-center justify-center text-purple-900 font-black text-xs">
                <Crown className="w-4 h-4 text-amber-600 fill-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. HORIZONTAL SUBSCRIPTION CARDS ROW (حسن ترتيبه أفقي) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-white">اختر الباقات بترتيب أفقي متناسق:</h4>
          <span className="text-[10px] text-gray-400">اسحب أو انقر على أي بطاقة</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {evolutionTiers.map((t, idx) => {
            const isSelected = selectedTier === t.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTier(t.id)}
                className={`p-4 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#2a1c44] via-[#1a172c] to-[#0f121e] border-purple-500 ring-2 ring-purple-500/50 shadow-2xl scale-[1.02]'
                    : 'bg-[#121522] border-white/10 hover:border-white/20 hover:bg-[#161a29]'
                }`}
              >
                {t.featured && (
                  <span className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-500 text-black text-[9px] font-black px-3 py-1 rounded-bl-xl shadow-md">
                    {t.badge}
                  </span>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-amber-400 text-black shadow-md'
                          : 'bg-white/10 text-gray-300'
                      }`}
                    >
                      {idx === 0 ? '⚡' : idx === 1 ? '💎' : '👑'}
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-white">{t.name}</h5>
                      <span className="text-[10px] text-purple-300 font-mono block">
                        طاقة AI: {t.aiPowerScore}%
                      </span>
                    </div>
                  </div>

                  <div className="py-2 border-y border-white/10">
                    <span className="text-xl font-black text-amber-300 block">{t.price}</span>
                    <span className="text-[10px] text-gray-400">{t.period}</span>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-gray-300">
                    {t.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-tight">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(t.id);
                    onProceedToCheckout();
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition-all shadow-lg flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isSelected ? 'تأكيد واختيار الدفع ←' : 'اختيار هذه الباقة'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Action Button */}
      <div className="pt-2">
        <button
          onClick={onProceedToCheckout}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black text-sm shadow-xl shadow-purple-600/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Crown className="w-4 h-4 text-amber-300" />
          <span>المتابعة لإتمام الدفع السلس لباقة ({currentTier.name} — {currentTier.price}) ←</span>
        </button>
      </div>
    </div>
  );
};
