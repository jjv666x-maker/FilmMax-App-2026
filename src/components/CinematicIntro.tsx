import React, { useEffect, useState, useRef } from 'react';
import { AppLogo } from './AppLogo';
import { Sparkles, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'ignite' | 'beam' | 'reveal' | 'finale'>('ignite');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play synthesized cinematic sound
  const playCinematicSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const now = ctx.currentTime;

      // 1. Deep Sub-bass Rumble (Cinematic Boom)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(45, now);
      subOsc.frequency.exponentialRampToValueAtTime(25, now + 3.2);

      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.linearRampToValueAtTime(0.5, now + 0.8);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 4.0);

      // 2. Harmonious Orchestral Synth Swell
      const chordNotes = [110, 164.81, 220, 277.18, 329.63, 440]; // A Major cinematic chord
      chordNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.4);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 2.2);

        gain.gain.setValueAtTime(0.001, now + 0.4);
        gain.gain.linearRampToValueAtTime(0.08, now + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + 0.4);
        osc.stop(now + 4.0);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  useEffect(() => {
    // Attempt sound on first user interaction or mount
    playCinematicSound();

    const t1 = setTimeout(() => setPhase('beam'), 800);
    const t2 = setTimeout(() => setPhase('reveal'), 1800);
    const t3 = setTimeout(() => setPhase('finale'), 3600);
    const t4 = setTimeout(() => onComplete(), 4600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050508] overflow-hidden flex flex-col items-center justify-center select-none text-white">
      {/* Top Controls: Sound Toggle & Skip */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
        <button
          onClick={() => {
            const nextState = !soundEnabled;
            setSoundEnabled(nextState);
            if (nextState) playCinematicSound();
          }}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-gray-300 hover:text-white transition-all"
          title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-red-400" />}
        </button>

        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-xs font-bold text-gray-200 hover:text-white transition-all active:scale-95 group"
        >
          <span>تخطي المقدمة</span>
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Atmospheric Cinema Lighting & Laser Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Pulsing Central Red Nebula Glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#e50914]/40 via-[#ff2e3b]/20 to-amber-500/10 blur-[130px] transition-all duration-1000 ${
            phase === 'reveal' || phase === 'finale' ? 'scale-125 opacity-90' : 'scale-50 opacity-30'
          }`}
        />

        {/* Anamorphic Blue-Red Horizon Light Streak */}
        <div
          className={`absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ff3b49] to-transparent transform -translate-y-1/2 transition-all duration-1000 shadow-[0_0_40px_#e50914] ${
            phase === 'beam' || phase === 'reveal'
              ? 'opacity-100 scale-x-100'
              : 'opacity-0 scale-x-0'
          }`}
        />

        {/* Rotating Cinema Lens Rings */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] rounded-full border border-red-500/20 border-dashed transition-all duration-1000 ${
            phase === 'reveal' ? 'scale-100 rotate-180 opacity-60' : 'scale-75 rotate-0 opacity-0'
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full border border-amber-400/20 transition-all duration-1000 ${
            phase === 'reveal' ? 'scale-100 -rotate-90 opacity-40' : 'scale-50 rotate-0 opacity-0'
          }`}
        />
      </div>

      {/* Main Center Stage: 3D Emblem Reveal */}
      <div className="relative z-20 flex flex-col items-center text-center px-4">
        {/* Dynamic Glowing Logo with Light Beam Scan */}
        <div
          className={`transform transition-all duration-1000 ease-out flex flex-col items-center ${
            phase === 'ignite'
              ? 'scale-50 opacity-0 blur-xl translate-y-10'
              : phase === 'beam'
              ? 'scale-90 opacity-80 blur-sm translate-y-4'
              : phase === 'reveal'
              ? 'scale-110 opacity-100 blur-0 translate-y-0'
              : 'scale-105 opacity-100 blur-0 translate-y-0'
          }`}
        >
          {/* Main Hero Logo */}
          <AppLogo size="hero" showSubtitle={true} subtitleText="STUDIO CINEMA" animated={true} />

          {/* Light Sweep Refraction Across Logo */}
          <div className="relative overflow-hidden w-64 h-1 bg-gradient-to-r from-transparent via-[#ff2e3b] to-transparent mt-6 rounded-full shadow-[0_0_20px_#e50914]">
            <div className="absolute inset-0 bg-white/90 animate-[marquee_1.5s_linear_infinite]" />
          </div>
        </div>

        {/* Dramatic Cinematic Tagline */}
        <div
          className={`mt-6 space-y-2 transition-all duration-700 delay-300 ${
            phase === 'reveal' || phase === 'finale'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-xs sm:text-sm tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>العالم بين يديك • تجربة السينما الفائقة</span>
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <p className="text-[11px] sm:text-xs text-gray-400 font-mono tracking-wider">
            DOLBY ATMOS 7.1 • 4K ULTRA HD HDR • REAL-TIME AI
          </p>
        </div>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#e50914] to-amber-400 rounded-full transition-all duration-[4200ms] ease-out"
            style={{ width: phase === 'finale' ? '100%' : '85%' }}
          />
        </div>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest">INITIALIZING FILMMAX CINEMA...</span>
      </div>
    </div>
  );
};
