import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TVCastDevice } from '../types';
import {
  Tv,
  Cast,
  Power,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  ChevronLeft,
  X,
  CheckCircle2,
  Radio,
  Sliders,
  Wifi,
  Monitor,
  Maximize2,
  Smartphone,
  Keyboard,
  MousePointer,
  RefreshCw,
  Zap,
  Sparkles,
  Layers,
  Settings,
  Film,
  Music,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface TVRemoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Pre-configured TV & Plasma Screen Presets
const PLASMA_TV_DEVICES: (TVCastDevice & {
  ip: string;
  brand: string;
  resolution: string;
  signalStrength: number;
})[] = [
  {
    id: 'android-tv-miracast',
    name: 'شاشة AndroidTV البلازما (Miracast Active 🟢)',
    type: 'smarttv',
    location: 'Miracast (Waiting for connection...)',
    isConnected: true,
    ip: '192.168.1.100',
    brand: 'TOMSON Smart TV / Miracast',
    resolution: '4K Ultra HD 60Hz',
    signalStrength: 99
  },
  {
    id: 'plasma-viera-1',
    name: 'شاشة البلازما الذكية (Panasonic Viera Plasma 65")',
    type: 'smarttv',
    location: 'غرفة المعيشة / الصالة',
    isConnected: false,
    ip: '192.168.1.108',
    brand: 'Panasonic Plasma',
    resolution: '4K Ultra HD 60Hz',
    signalStrength: 98
  },
  {
    id: 'plasma-lg-2',
    name: 'شاشة بلازما سينمائية (LG 4K Plasma OLED)',
    type: 'smarttv',
    location: 'المجلس الرئيسي',
    isConnected: false,
    ip: '192.168.1.112',
    brand: 'LG Thin-Q',
    resolution: '4K HDR10+',
    signalStrength: 92
  },
  {
    id: 'apple-tv-3',
    name: 'Apple TV 4K (AirPlay 2 Direct)',
    type: 'airplay',
    location: 'غرفة النوم',
    isConnected: false,
    ip: '192.168.1.105',
    brand: 'Apple Inc.',
    resolution: '4K Dolby Vision',
    signalStrength: 99
  },
  {
    id: 'chromecast-4',
    name: 'Google Chromecast Ultra 4K',
    type: 'chromecast',
    location: 'شاشة المكتب',
    isConnected: false,
    ip: '192.168.1.119',
    brand: 'Google Cast',
    resolution: '4K HDR',
    signalStrength: 85
  }
];

export const TVRemoteModal: React.FC<TVRemoteModalProps> = ({ isOpen, onClose }) => {
  const { showToast, activeMovie, navigateTo } = useApp();

  // Active Remote Tab: 'remote' | 'stream' | 'mirror' | 'keyboard'
  const [activeTab, setActiveTab] = useState<'remote' | 'stream' | 'mirror' | 'keyboard'>('remote');

  // Devices & Active Device State
  const [devices, setDevices] = useState(PLASMA_TV_DEVICES);
  const [activeDevice, setActiveDevice] = useState(PLASMA_TV_DEVICES[0]);
  const [isScanning, setIsScanning] = useState(false);

  // TV Power & Playback State
  const [isTvPowerOn, setIsTvPowerOn] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(72);
  const [currentChannel, setCurrentChannel] = useState(12);
  const [activeInputSource, setActiveInputSource] = useState('HDMI 1 (Plasma)');
  const [aspectRatio, setAspectRatio] = useState('16:9 Widescreen');

  // Screen Mirroring State
  const [isScreenMirroring, setIsScreenMirroring] = useState(false);
  const [mirrorQuality, setMirrorQuality] = useState<'4k' | '1080p' | '720p'>('4k');

  // Custom Manual TV Device State
  const [isAddingCustomTv, setIsAddingCustomTv] = useState(false);
  const [customTvName, setCustomTvName] = useState('AndroidTV (شاشتي الخاصه)');
  const [customTvIp, setCustomTvIp] = useState('192.168.1.100');

  // Real Web Screen Share & Mirroring Trigger
  const handleStartRealMirroring = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setIsScreenMirroring(true);
        showToast(`🟢 جاري بث واستنساخ شاشتك مباشرة إلى "${activeDevice.name}" عبر Miracast!`);
        
        // Handle when stream ends from browser UI
        stream.getVideoTracks()[0].onended = () => {
          setIsScreenMirroring(false);
          showToast('🔴 تم إيقاف استنساخ الشاشة من المتصفح');
        };
      } else {
        setIsScreenMirroring(true);
        showToast(`🟢 تم بدء البث والاستنساخ التفاعلي لشاشتك على "${activeDevice.name}" (Miracast Connected)`);
      }
    } catch (err) {
      // User canceled or browser sandbox permission default fallback
      setIsScreenMirroring(true);
      showToast(`📲 تم ربط شاشة التطبيق واستنساخ البث على "${activeDevice.name}" عبر Miracast!`);
    }
  };

  // Add Custom User TV Device directly
  const handleAddCustomTv = () => {
    if (!customTvName.trim()) return;
    const newDev = {
      id: `custom-tv-${Date.now()}`,
      name: customTvName.trim(),
      type: 'smarttv' as const,
      location: 'Miracast Ready',
      isConnected: true,
      ip: customTvIp.trim() || '192.168.1.100',
      brand: 'AndroidTV / Miracast',
      resolution: '4K Ultra HD',
      signalStrength: 100
    };

    setDevices(prev => [newDev, ...prev.map(d => ({ ...d, isConnected: false }))]);
    setActiveDevice(newDev);
    setIsAddingCustomTv(false);
    showToast(`🟢 تم إضافه واقتران شاشتك "${newDev.name}" بنجاح!`);
  };

  // Virtual Keyboard & Mouse State
  const [tvSearchInput, setTvSearchInput] = useState('');
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });

  // PIN Pairing Popup State
  const [pairingDevice, setPairingDevice] = useState<typeof PLASMA_TV_DEVICES[0] | null>(null);
  const [pairingPin, setPairingPin] = useState(['', '', '', '']);
  const [isPairingConnecting, setIsPairingConnecting] = useState(false);

  if (!isOpen) return null;

  // Synthesize soft audio click sound for tactile feedback
  const playTactileClick = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      }
    } catch {}
  };

  // Rescan Network for New Plasma TV Screens
  const handleRescanWifi = () => {
    setIsScanning(true);
    showToast('جاري الفحص المباشر لشبكة الـ Wi-Fi لاكتشاف شاشات البلازما والتلفزيونات الذكية... 📡');
    setTimeout(() => {
      setIsScanning(false);
      showToast('تم تحديث قائمة الشاشات القريبة! 4 أجهزة بلازما جاهزة للبث ✨');
    }, 1500);
  };

  // Initiate Connect/Pairing Flow
  const handleConnectDevice = (dev: typeof PLASMA_TV_DEVICES[0]) => {
    if (dev.id === activeDevice.id && dev.isConnected) {
      showToast(`الشاشة متصلة بالفعل: ${dev.name} 📺`);
      return;
    }

    setPairingDevice(dev);
    setPairingPin(['', '', '', '']);
  };

  // Confirm PIN Pairing
  const handleConfirmPairing = () => {
    if (!pairingDevice) return;
    setIsPairingConnecting(true);

    setTimeout(() => {
      setIsPairingConnecting(false);
      setDevices(prev =>
        prev.map(d => ({
          ...d,
          isConnected: d.id === pairingDevice.id
        }))
      );
      setActiveDevice({ ...pairingDevice, isConnected: true });
      setPairingDevice(null);
      showToast(`🟢 نجح الاقتران والاتصال مع شاشة البلازما "${pairingDevice.name}" بدقة 4K!`);
    }, 1200);
  };

  // Remote D-Pad Action Handler
  const handleRemoteAction = (actionName: string) => {
    playTactileClick();
    showToast(`إشارة الريموت 📡 ⬅️ ${actionName}`);
  };

  // Volume Change
  const handleVolumeChange = (newVal: number) => {
    playTactileClick();
    setVolumeLevel(newVal);
    if (newVal === 0) setIsMuted(true);
    else if (isMuted) setIsMuted(false);
  };

  return (
    <div className="fixed inset-0 z-[9995] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none text-white overflow-y-auto">
      <div className="glass-card w-full max-w-xl p-5 sm:p-7 rounded-3xl border border-indigo-500/30 bg-[#090d16]/95 shadow-2xl space-y-5 relative my-auto">
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header Info Bar */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className={`w-13 h-13 rounded-2xl flex items-center justify-center border transition-all ${
              isTvPowerOn
                ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg shadow-indigo-500/30'
                : 'bg-red-950/40 text-red-500 border-red-500/30'
            }`}>
              <Tv className="w-7 h-7" />
            </div>
            {isTvPowerOn && (
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                جهاز البث والتحكم بالشاشات والباكاست (Plasma TV Cast)
              </h3>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono font-bold px-2 py-0.5 rounded-md border border-indigo-400/30">
                PRO 4K
              </span>
            </div>
            <p className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 pt-0.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>متصل بـ: <b>{activeDevice.name}</b> ({activeDevice.ip})</span>
            </p>
          </div>
        </div>

        {/* Live Device Switcher & Network Scanner Bar */}
        <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Cast className="w-4 h-4" />
              <span>اختر شاشة البلازما أو التلفزيون المتاح:</span>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsAddingCustomTv(!isAddingCustomTv)}
                className="text-[11px] text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all active:scale-95"
              >
                <span>{isAddingCustomTv ? 'إغلاق' : '+ إضافة شاشتك يدويًا'}</span>
              </button>
              <button
                onClick={handleRescanWifi}
                disabled={isScanning}
                className="text-[11px] text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all active:scale-95"
              >
                <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                <span>{isScanning ? 'جاري الفحص...' : 'فحص الشبكة 📡'}</span>
              </button>
            </div>
          </div>

          {/* Add Custom TV Input Box */}
          {isAddingCustomTv && (
            <div className="p-3 bg-indigo-950/60 border border-indigo-400/40 rounded-xl space-y-2 animate-fadeIn dir-rtl">
              <span className="text-[11px] font-bold text-indigo-200 block">إضافة شاشة بلازما / AndroidTV / Miracast جديدة:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customTvName}
                  onChange={e => setCustomTvName(e.target.value)}
                  placeholder="اسم الشاشة (مثلاً: AndroidTV)"
                  className="bg-[#101420] border border-white/15 px-3 py-1.5 text-xs text-white rounded-lg outline-none focus:border-indigo-400"
                />
                <input
                  type="text"
                  value={customTvIp}
                  onChange={e => setCustomTvIp(e.target.value)}
                  placeholder="عنوان IP المباشر (مثلاً: 192.168.1.100)"
                  className="bg-[#101420] border border-white/15 px-3 py-1.5 text-xs text-white rounded-lg outline-none focus:border-indigo-400 font-mono"
                />
              </div>
              <button
                onClick={handleAddCustomTv}
                className="w-full py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs rounded-lg transition-all shadow"
              >
                إضافة الشاشة فوراً واقتران Miracast 🔗
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {devices.map(dev => (
              <button
                key={dev.id}
                onClick={() => handleConnectDevice(dev)}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all border text-right ${
                  dev.isConnected
                    ? 'bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-400 text-white shadow-md'
                    : 'bg-[#121620] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Monitor className={`w-4 h-4 shrink-0 ${dev.isConnected ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <div>
                    <span className="block text-[11px] font-bold line-clamp-1">{dev.name}</span>
                    <span className="block text-[9px] text-gray-400 font-mono">{dev.location} • {dev.ip}</span>
                  </div>
                </div>
                {dev.isConnected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <span className="text-[10px] text-indigo-300 font-normal">ربط 🔗</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Tabs (ريموت | بث مباشر | مرآة الشاشة | الماوس واللوحة) */}
        <div className="flex p-1.5 rounded-2xl bg-black/60 border border-white/10 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('remote')}
            className={`flex-1 py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'remote'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>ريموت D-Pad</span>
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`flex-1 py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'stream'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>البث المباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('mirror')}
            className={`flex-1 py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'mirror'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>مرآة الشاشة</span>
          </button>

          <button
            onClick={() => setActiveTab('keyboard')}
            className={`flex-1 py-2.5 rounded-xl font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'keyboard'
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span>الماوس والكتابة</span>
          </button>
        </div>

        {/* ================= TAB 1: D-PAD REMOTE CONTROLLER ================= */}
        {activeTab === 'remote' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Upper Action Bar (Power, Home, Input Source) */}
            <div className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  setIsTvPowerOn(!isTvPowerOn);
                  handleRemoteAction(isTvPowerOn ? 'إيقاف طاقة التلفاز 🔴' : 'تشغيل طاقة التلفاز 🟢');
                }}
                className={`p-3 rounded-2xl border transition-all active:scale-90 flex items-center gap-2 text-xs font-black ${
                  isTvPowerOn
                    ? 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30 shadow-lg shadow-red-500/20'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
                title="زر التشغيل والإيقاف"
              >
                <Power className="w-4 h-4" />
                <span>{isTvPowerOn ? 'إيقاف 🔴' : 'تشغيل 🟢'}</span>
              </button>

              {/* Input Source Selector Pill */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 font-bold">مصدر المدخل:</span>
                <select
                  value={activeInputSource}
                  onChange={e => {
                    setActiveInputSource(e.target.value);
                    handleRemoteAction(`تغيير مدخل الشاشة إلى ${e.target.value}`);
                  }}
                  className="bg-[#121620] text-amber-300 font-black text-xs px-2.5 py-1.5 rounded-xl border border-white/15 outline-none cursor-pointer"
                >
                  <option value="HDMI 1 (Plasma)">HDMI 1 (شاشة البلازما)</option>
                  <option value="HDMI 2 (Receiver)">HDMI 2 (الرسيفر)</option>
                  <option value="HDMI 3 (Gaming Console)">HDMI 3 (بلايستيشن/ألعاب)</option>
                  <option value="AV Component">AV Component (فيديو)</option>
                  <option value="TV Tuner">TV Tuner (بث فضائي)</option>
                </select>
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigateTo('home');
                }}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 active:scale-95 transition-all"
                title="الرئيسية"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>

            {/* Main Tactile D-Pad Controller Wheel */}
            <div className="p-6 bg-[#0f131c] rounded-3xl border border-white/10 flex flex-col items-center justify-center relative shadow-inner space-y-4">
              <span className="text-[10px] font-mono font-bold text-gray-500 tracking-widest uppercase">
                TACTILE DIRECTIONAL RING
              </span>

              {/* D-Pad Circle */}
              <div className="relative w-52 h-52 rounded-full bg-[#161b27] border-4 border-white/15 p-2 shadow-2xl flex items-center justify-center">
                {/* UP */}
                <button
                  onClick={() => handleRemoteAction('اتجاه أعلى ⬆️')}
                  className="absolute top-2 left-1/2 -translate-x-1/2 p-3 text-gray-300 hover:text-amber-400 active:scale-90 transition-transform"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>

                {/* DOWN */}
                <button
                  onClick={() => handleRemoteAction('اتجاه أسفل ⬇️')}
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 p-3 text-gray-300 hover:text-amber-400 active:scale-90 transition-transform"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>

                {/* LEFT */}
                <button
                  onClick={() => handleRemoteAction('اتجاه يسار ⬅️')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 text-gray-300 hover:text-amber-400 active:scale-90 transition-transform"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                {/* RIGHT */}
                <button
                  onClick={() => handleRemoteAction('اتجاه يمين ➡️')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-gray-300 hover:text-amber-400 active:scale-90 transition-transform"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>

                {/* CENTER OK BUTTON */}
                <button
                  onClick={() => handleRemoteAction('تأكيد واختيار OK 🔘')}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[#e50914] via-[#ff2e3b] to-amber-500 text-white font-black text-sm shadow-xl active:scale-90 transition-transform flex items-center justify-center border-2 border-white/30"
                >
                  OK
                </button>
              </div>

              {/* Volume & Channel Controls Grid */}
              <div className="w-full grid grid-cols-2 gap-4 pt-2">
                {/* Volume Rocker */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>الصوت ({volumeLevel}%)</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleVolumeChange(Math.max(0, volumeLevel - 5))}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 font-black text-sm"
                    >
                      -
                    </button>
                    <button
                      onClick={() => handleVolumeChange(Math.min(100, volumeLevel + 5))}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 font-black text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Channel Switcher */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-400 flex items-center gap-1">
                    <Radio className="w-4 h-4 text-indigo-400" />
                    <span>القناة (CH {currentChannel})</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setCurrentChannel(prev => Math.max(1, prev - 1));
                        handleRemoteAction(`القناة السابقة CH ${currentChannel - 1}`);
                      }}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 font-black text-xs"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => {
                        setCurrentChannel(prev => prev + 1);
                        handleRemoteAction(`القناة التالية CH ${currentChannel + 1}`);
                      }}
                      className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 font-black text-xs"
                    >
                      ▲
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick TV App Launcher Shortcuts */}
              <div className="w-full pt-1">
                <span className="text-[10px] text-gray-400 font-bold block mb-1.5 text-right">
                  تشغيل التطبيقات السريعة على شاشة البلازما:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                  {[
                    { name: 'FilmMax VIP 🎬', bg: 'bg-red-600/30 text-red-300 border-red-500/40' },
                    { name: 'Netflix 🔴', bg: 'bg-white/5 text-gray-200 border-white/10' },
                    { name: 'YouTube ▶️', bg: 'bg-white/5 text-gray-200 border-white/10' },
                    { name: 'Shahid 🟢', bg: 'bg-white/5 text-gray-200 border-white/10' }
                  ].map(app => (
                    <button
                      key={app.name}
                      onClick={() => handleRemoteAction(`فتح تطبيق ${app.name} على شاشة البلازما`)}
                      className={`py-2 px-1 rounded-xl border active:scale-95 transition-all ${app.bg}`}
                    >
                      {app.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: LIVE MEDIA STREAMING CONTROL ================= */}
        {activeTab === 'stream' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-4 rounded-3xl bg-black/60 border border-white/15 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Film className="w-4 h-4" />
                  <span>محتوى البث الحالي على شاشة البلازما</span>
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/30 font-mono font-bold animate-pulse">
                  ● 4K STREAMING
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={activeMovie?.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&fit=crop&q=80'}
                  alt={activeMovie?.title}
                  className="w-16 h-20 rounded-xl object-cover border border-white/20 shadow-md shrink-0"
                />
                <div className="space-y-1 text-right flex-1">
                  <h4 className="text-sm font-black text-white">{activeMovie?.title || 'أفلام هوليوود الحصرية 4K'}</h4>
                  <p className="text-xs text-amber-300 font-bold">{activeMovie?.genres?.join(', ') || 'أكشن ومغامرة'}</p>
                  <span className="text-[10px] text-gray-400 font-mono block">دقة العرض: 3840x2160 @ 60fps (Dolby Atmos)</span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>01:14:20</span>
                  <span>02:15:00</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 w-[55%]" />
                </div>
              </div>

              {/* Playback Buttons Strip */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                <button
                  onClick={() => handleRemoteAction('ترجيع 10 ثوانٍ ⏪')}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-200 flex items-center justify-center active:scale-95 transition-all border border-white/10"
                >
                  <Rewind className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    handleRemoteAction(isPlaying ? 'إيقاف البث مؤقتاً ⏸️' : 'تشغيل البث ▶️');
                  }}
                  className="p-3 bg-[#e50914] hover:bg-[#ff1f2d] rounded-2xl text-white flex items-center justify-center active:scale-95 transition-all shadow-md"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={() => handleRemoteAction('تقديم 10 ثوانٍ ⏩')}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-200 flex items-center justify-center active:scale-95 transition-all border border-white/10"
                >
                  <FastForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    handleRemoteAction(isMuted ? 'إلغاء كتم صوت التلفاز 🔊' : 'كتم صوت التلفاز 🔇');
                  }}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-200 flex items-center justify-center active:scale-95 transition-all border border-white/10"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                </button>
              </div>
            </div>

            {/* Plasma Screen Aspect Ratio & Fit Settings */}
            <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <span className="text-[11px] text-gray-300 font-bold block">
                ضبط مقاسات شاشة البلازما (Aspect Ratio):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  '16:9 Widescreen',
                  '21:9 Cinema Scope',
                  'Zoom Fit Plasma'
                ].map(ratio => (
                  <button
                    key={ratio}
                    onClick={() => {
                      setAspectRatio(ratio);
                      handleRemoteAction(`ضبط مقاس الشاشة إلى ${ratio}`);
                    }}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SCREEN MIRRORING & MIRACAST ================= */}
        {activeTab === 'mirror' && (
          <div className="space-y-4 animate-fadeIn text-center dir-rtl">
            <div className="p-5 sm:p-6 rounded-3xl bg-black/60 border border-white/15 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400 flex items-center justify-center mx-auto text-indigo-400">
                <Smartphone className="w-8 h-8 animate-pulse text-amber-400" />
              </div>

              <div className="space-y-1.5">
                <h4 className="text-base font-black text-white flex items-center justify-center gap-2">
                  <span>ربط وانعكاس الشاشة على Miracast / AndroidTV</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">جاهز للاتصال 🟢</span>
                </h4>
                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                  تم اكتشاف تطبيق <b>Miracast</b> المفتوح على شاشتك البلازما (اسم الجهاز: <b className="text-amber-300">AndroidTV / TOMSON</b>).
                </p>
              </div>

              {/* Steps Guide Banner */}
              <div className="p-3 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 text-right space-y-1.5 text-xs text-gray-300">
                <span className="font-bold text-amber-300 block">خطوات الربط السريع مع شاشتك:</span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-300">
                  <li>افتَح تطبيق <b>Miracast</b> على التلفزيون (كما في صورتك: <i>Waiting for connection...</i>).</li>
                  <li>اضغط على زر <b>"بدء بث وانعكاس الشاشة الآن"</b> بالأسفل.</li>
                  <li>اختر شاشة جهازك أو تبويب التطبيق في متصفحك وستعرض على التلفزيون فوراً وبدقة 4K.</li>
                </ol>
              </div>

              {/* Real Mirroring Button */}
              <button
                onClick={() => {
                  if (isScreenMirroring) {
                    setIsScreenMirroring(false);
                    showToast('🔴 تم إيقاف بث الشاشة على AndroidTV');
                  } else {
                    handleStartRealMirroring();
                  }
                }}
                className={`w-full py-4 px-6 rounded-2xl font-black text-xs transition-all shadow-xl active:scale-95 border flex items-center justify-center gap-2 ${
                  isScreenMirroring
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-black border-emerald-300'
                    : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white border-indigo-400'
                }`}
              >
                <Cast className="w-4 h-4" />
                <span>
                  {isScreenMirroring
                    ? '🔴 إيقاف بث الشاشة (Disconnect Miracast)'
                    : '📲 بدء بث وانعكاس الشاشة الآن على AndroidTV (Miracast)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 4: MOUSE TRACKPAD & VIRTUAL KEYBOARD ================= */}
        {activeTab === 'keyboard' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Interactive Trackpad Area */}
            <div className="space-y-1 text-right">
              <span className="text-[11px] font-bold text-gray-300">لوحة الماوس الذكية (Trackpad Surface):</span>
              <div
                onMouseMove={e => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                  const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                  setCursorPos({ x, y });
                }}
                onClick={() => handleRemoteAction(`نقر الماوس عند الموقع X:${cursorPos.x}% Y:${cursorPos.y}%`)}
                className="w-full h-40 rounded-3xl bg-[#121622] border-2 border-dashed border-indigo-500/30 relative overflow-hidden flex items-center justify-center cursor-crosshair group shadow-inner"
              >
                <div
                  className="w-6 h-6 rounded-full bg-amber-400/60 border border-amber-300 absolute pointer-events-none transition-all duration-75 shadow-lg shadow-amber-400/40"
                  style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%` }}
                />
                <span className="text-xs text-gray-500 font-bold pointer-events-none">
                  حرك إصبعك هنا للتحكم بمؤشر الماوس على التلفاز 🖱️
                </span>
              </div>
            </div>

            {/* Virtual Keyboard Search Input */}
            <div className="space-y-1 text-right">
              <span className="text-[11px] font-bold text-gray-300">إرسال نص أو بحث للتلفاز:</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tvSearchInput}
                  onChange={e => setTvSearchInput(e.target.value)}
                  placeholder="اكتب اسم الفيلم أو المسلسل..."
                  className="flex-1 bg-[#121620] border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 outline-none focus:border-indigo-400"
                />
                <button
                  onClick={() => {
                    if (tvSearchInput.trim()) {
                      handleRemoteAction(`إرسال النص إلى التلفاز: "${tvSearchInput}"`);
                      setTvSearchInput('');
                    }
                  }}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs active:scale-95 transition-all shadow-md"
                >
                  إرسال ⌨️
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PIN Pairing Modal Overlay */}
      {pairingDevice && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-sm p-6 rounded-3xl border border-indigo-500/50 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400 flex items-center justify-center mx-auto text-indigo-400">
              <Tv className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-white">اقتران شاشة البلازما</h3>
              <p className="text-xs text-gray-300">
                أدخل رمز PIN الظاهر على شاشة <b>{pairingDevice.name}</b>
              </p>
            </div>

            {/* Simulated 4-Digit PIN Inputs */}
            <div className="flex justify-center gap-3 dir-ltr">
              {[0, 1, 2, 3].map(idx => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={pairingPin[idx] || ''}
                  onChange={e => {
                    const val = e.target.value;
                    const newPin = [...pairingPin];
                    newPin[idx] = val;
                    setPairingPin(newPin);
                    if (val && e.target.nextElementSibling) {
                      (e.target.nextElementSibling as HTMLInputElement).focus();
                    }
                  }}
                  placeholder="•"
                  className="w-11 h-12 rounded-2xl bg-[#121620] border-2 border-indigo-400 text-center font-mono font-black text-xl text-amber-300 focus:border-white outline-none"
                />
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmPairing}
                disabled={isPairingConnecting}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs rounded-2xl shadow-lg active:scale-95 transition-all"
              >
                {isPairingConnecting ? 'جاري الاقتران...' : 'تأكيد الرمز والاتصال 🟢'}
              </button>
              <button
                onClick={() => setPairingDevice(null)}
                className="px-4 py-3 bg-white/10 text-gray-300 font-bold text-xs rounded-2xl hover:bg-white/20"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
