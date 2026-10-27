import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  UploadCloud,
  Layers,
  Cpu,
  FileCode,
  Globe,
  CheckCircle2,
  Clock,
  Play,
  Check,
  AlertCircle,
  FileText,
  Radio,
  Sliders,
  Sparkles,
  Zap
} from 'lucide-react';

interface IngestionRendition {
  quality: string;
  resolution: string;
  bitrate: string;
  manifest: string;
}

interface IngestionResult {
  jobId: string;
  title: string;
  masterManifestUrl: string;
  cdnUrl: string;
  renditions: IngestionRendition[];
  subtitlesUrl: string;
  stagesCompleted: string[];
}

export const VideoIngestionStudioModal: React.FC = () => {
  const { isIngestionStudioOpen, setIsIngestionStudioOpen, showToast, movies, setMovies } = useApp() as any;

  const [videoTitle, setVideoTitle] = useState('ملحمة FilmMax السينمائية 4K');
  const [videoDuration, setVideoDuration] = useState<number>(4);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [ingestionResult, setIngestionResult] = useState<IngestionResult | null>(null);
  const [selectedRendition, setSelectedRendition] = useState<string>('1080p FHD');

  if (!isIngestionStudioOpen) return null;

  const pipelineStages = [
    {
      id: 1,
      title: 'استقبال وتخزين الفيديو الخام (Ingestion & S3 Originals)',
      desc: 'استقبال ملف الفيديو عالي الدقة ورفعه إلى حاوية التخزين الخام للبدء بالمعالجة',
      icon: <UploadCloud className="w-4 h-4 text-blue-400" />
    },
    {
      id: 2,
      title: 'فحص الكوديك والمواصفات (Video Inspection & QC)',
      desc: 'التحقق الآلي من أبعاد الإطارات ومعدل الـ FPS ونقاء الصوت ومطابقة المعايير القياسية',
      icon: <Cpu className="w-4 h-4 text-purple-400" />
    },
    {
      id: 3,
      title: 'تشفير السلم التكيفي متعدد الجودات (ABR Ladder: 1080p, 720p, 480p)',
      desc: 'تشفير متوازي عبر FFmpeg و AWS Elemental لإنتاج 3 جودات مستقلة بمعدلات بت مختلفة',
      icon: <Layers className="w-4 h-4 text-amber-400" />
    },
    {
      id: 4,
      title: 'توليد ملف الفهرس الرئيسي والتقطيع (HLS Master Manifest & Segments)',
      desc: 'تجزئة الفيديو لمقاطع 2-4 ثوانٍ (.ts) وبناء فهرس master.m3u8 الموجه للبث التكيفي',
      icon: <FileCode className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 5,
      title: 'توليد شريط الترجمة والوصف الآلي (Captions & WebVTT Subtitles)',
      desc: 'توليد ملف ترجمة متزامن بدقة أجزاء الثانية subtitles.vtt بمؤشرات زمنية مطابقة',
      icon: <FileText className="w-4 h-4 text-cyan-400" />
    },
    {
      id: 6,
      title: 'النشر السحابي والتوزيع العالمي (CloudFront CDN Edge Delivery)',
      desc: 'مزامنة المقاطع مع خوادم التخزين السحابي وتفعيل التوزيع الجغرافي الفائق السرعة',
      icon: <Globe className="w-4 h-4 text-rose-400" />
    }
  ];

  const handleStartIngestion = async () => {
    setIsProcessing(true);
    setIngestionResult(null);
    setCurrentStep(1);

    // Simulate animated step progression matching the backend pipeline
    const timer1 = setTimeout(() => setCurrentStep(2), 500);
    const timer2 = setTimeout(() => setCurrentStep(3), 1100);

    try {
      const response = await fetch('/api/video/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          duration: videoDuration
        })
      });

      const data = await response.json();

      setTimeout(() => setCurrentStep(4), 1800);
      setTimeout(() => setCurrentStep(5), 2400);

      setTimeout(() => {
        setCurrentStep(6);
        setIsProcessing(false);
        if (data.success) {
          setIngestionResult(data);
          showToast('اكتمل خط معالجة وتقطيع الفيديو بنجاح عبر HLS ABR! 🎬⚡');
        } else {
          showToast('حدث خطأ أثناء المعالجة: ' + (data.error || 'فشل التشفير'));
        }
      }, 3000);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsProcessing(false);
      showToast('تعذر الاتصال بخادم المعالجة: ' + err.message);
    }
  };

  const handleAddToLibrary = () => {
    if (!ingestionResult) return;

    const newMovie = {
      id: `ingest-${Date.now()}`,
      title: ingestionResult.title,
      type: 'فيلم',
      year: '2026',
      rating: 9.7,
      poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600',
      backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200',
      overview: 'عمل سينمائي تمت معالجته وتقطيعه عبر خط أنابيب FilmMax HLS متعدد الجودات (1080p, 720p, 480p).',
      genres: ['أكشن وحركة 4K', 'إنتاجات حصرية'],
      videoUrl: ingestionResult.masterManifestUrl,
      quality: '4K Ultra HD',
      matchScore: 99,
      isTrending: true
    };

    if (setMovies) {
      setMovies((prev: any[]) => [newMovie, ...prev]);
    }
    showToast(`تمت إضافة "${ingestionResult.title}" إلى مكتبة الأفلام بنجاح! 🍿`);
    setIsIngestionStudioOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 select-none animate-in fade-in duration-200"
      onClick={() => setIsIngestionStudioOpen(false)}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-[#0c0f17] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-red-950/30 via-transparent to-blue-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#e50914]/20 border border-[#e50914]/40 flex items-center justify-center text-[#e50914] shadow-lg shadow-red-500/10">
              <Layers className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>خط معالجة واستيعاب الفيديوهات</span>
                <span className="text-[10px] bg-[#e50914] text-white px-2 py-0.5 rounded-full font-bold">
                  HLS ABR Engine
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                استقبال الفيديو الخام، التقطيع والتشفير متعدد الجودات (1080p, 720p, 480p) وتوليد فهرس HLS
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsIngestionStudioOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-right">
          {/* Section 1: Ingestion Input Controls */}
          <div className="bg-[#141824] border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-black text-gray-300 flex items-center justify-between">
              <span className="text-gray-400 text-[11px]">مواصفات إدخال الفيديو الخام للتقطيع</span>
              <span className="flex items-center gap-1.5 text-white">
                <span>إدخال العمل السينمائي</span>
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] text-gray-400 font-bold block">عنوان الفيلم أو المقطع:</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={e => setVideoTitle(e.target.value)}
                  placeholder="أدخل عنوان العمل..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-[#e50914] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 font-bold block">مدة المعالجة السريعة:</label>
                <select
                  value={videoDuration}
                  onChange={e => setVideoDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold focus:outline-none focus:border-[#e50914] transition-colors"
                >
                  <option value={4}>4 ثوانٍ (معاينة فائقة السرعة)</option>
                  <option value={8}>8 ثوانٍ (مقطع قياسي كامل)</option>
                  <option value={12}>12 ثانية (مقطع سينمائي عالي الكثافة)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                تقنية التشفير: <strong className="text-emerald-400 font-mono">H.264 / AVC1 Multi-Rendition HLS</strong>
              </span>

              <button
                disabled={isProcessing}
                onClick={handleStartIngestion}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs shadow-lg shadow-red-900/50 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري المعالجة والتقطيع...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>بدء تشغيل خط المعالجة والتشفير ⚡</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Six-Stage Pipeline Architecture Visualizer */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-white flex items-center justify-end gap-1.5">
              <span>مراحل خط الأنابيب (Pipeline Flow) المستوحى من AWS & Netflix</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pipelineStages.map(stage => {
                const isDone = currentStep > stage.id || (!isProcessing && ingestionResult);
                const isCurrent = isProcessing && currentStep === stage.id;

                return (
                  <div
                    key={stage.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : isCurrent
                        ? 'bg-[#e50914]/15 border-[#e50914] shadow-lg shadow-red-500/10'
                        : 'bg-[#12151f] border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {isDone ? (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <Check className="w-3 h-3 stroke-[3]" />
                            مكتمل
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 animate-pulse">
                            <Clock className="w-3 h-3 animate-spin" />
                            جاري التنفيذ...
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-bold">في الانتظار</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 font-bold text-xs">
                        <span>{stage.title}</span>
                        <div className="p-1 rounded-lg bg-white/5 border border-white/10">
                          {stage.icon}
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-relaxed">{stage.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Ingestion Output & HLS Stream Player */}
          {ingestionResult && (
            <div className="bg-[#101420] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <button
                  onClick={handleAddToLibrary}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>إضافة إلى مكتبة FilmMax 🍿</span>
                </button>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-400 flex items-center justify-end gap-1.5">
                    <span>تم إنتاج البث التكيفي بنجاح (Ready for ABR Streaming)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                    Job ID: {ingestionResult.jobId} • Master: {ingestionResult.masterManifestUrl}
                  </div>
                </div>
              </div>

              {/* Multi-Rendition Ladder Grid */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-300 block">
                  جودات السلّم التكيفي المنتجة (ABR Renditions):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {ingestionResult.renditions.map(rend => (
                    <div
                      key={rend.quality}
                      onClick={() => setSelectedRendition(rend.quality)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedRendition === rend.quality
                          ? 'bg-[#e50914]/20 border-[#e50914] shadow'
                          : 'bg-black/30 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400 font-mono">{rend.bitrate}</span>
                        <span className="text-xs font-black text-white">{rend.quality}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                        <span>{rend.manifest}</span>
                        <span className="text-amber-400">{rend.resolution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtitles & Captions CC Preview */}
              <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-cyan-400 font-mono text-[11px] truncate max-w-xs">
                  {ingestionResult.subtitlesUrl}
                </span>
                <div className="flex items-center gap-1.5 text-gray-300 font-bold">
                  <span>شريط الترجمة التلقائي المتزامن (WebVTT CC):</span>
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#080b12] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="font-mono text-[11px] text-gray-300">
              FFmpeg HLS v4.4 • AWS Elemental Spec
            </span>
          </div>

          <button
            onClick={() => setIsIngestionStudioOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
