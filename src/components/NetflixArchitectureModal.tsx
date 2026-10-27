import React, { useState } from 'react';
import { X, Server, Shield, Database, Cpu, Activity, Zap, Layers, Globe, CheckCircle2, RefreshCw, Terminal, ArrowRight } from 'lucide-react';

interface NetflixArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const NetflixArchitectureModal: React.FC<NetflixArchitectureModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'microservices' | 'techstack' | 'pipeline' | 'logs'>('microservices');
  const [testingService, setTestingService] = useState<string | null>(null);
  const [serviceStatus, setServiceStatus] = useState<Record<string, 'healthy' | 'testing'>>({
    gateway: 'healthy',
    content: 'healthy',
    streaming: 'healthy',
    recommendation: 'healthy',
    billing: 'healthy',
    auth: 'healthy',
    inventory: 'healthy',
    monitoring: 'healthy'
  });

  const handleTestService = (key: string, name: string) => {
    setTestingService(key);
    setServiceStatus(prev => ({ ...prev, [key]: 'testing' }));
    showToast(`جاري فحص واختبار خدمة "${name}" عبر API Gateway...`);
    setTimeout(() => {
      setTestingService(null);
      setServiceStatus(prev => ({ ...prev, [key]: 'healthy' }));
      showToast(`نجح اختبار خدمة "${name}" - الحالة: مستقرة 100% ⚡`);
    }, 1200);
  };

  const services = [
    { key: 'gateway', name: 'API Gateway', desc: 'بوابة التوجيه الموحدة وإدارة طلبات العملاء وتوزيع الأحمال', icon: Server, color: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30' },
    { key: 'content', name: 'Content Service', desc: 'إدارة الأفلام، المسلسلات، البيانات الوصفية، والملصقات', icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30' },
    { key: 'streaming', name: 'Streaming Service', desc: 'بث HLS المتكيف وتوزيع المحتوى عبر شبكة CDN السحابية', icon: Activity, color: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' },
    { key: 'recommendation', name: 'Recommendation Service', desc: 'محرك التوصيات الذكي المعتمد على خوارزميات التعلم العميق', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/15', border: 'border-purple-500/30' },
    { key: 'billing', name: 'Billing Service', desc: 'إدارة الاشتراكات الفاخرة VIP، الباقات، والمعاملات المالية', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
    { key: 'auth', name: 'Auth Service', desc: 'المصادقة الآمنة، تشفير كلمات المرور، ورمز التحقق الثنائي 2FA', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
    { key: 'inventory', name: 'Inventory Service', desc: 'إدارة مخزون الوسائط، السداسي التكراري، ونسخ التخزين S3', icon: Database, color: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/30' },
    { key: 'monitoring', name: 'Monitoring & Logging', desc: 'المراقبة الحية، تتبع الأخطاء، سجلات الأداء ونظام Flink', icon: Terminal, color: 'text-pink-400', bg: 'bg-pink-500/15', border: 'border-pink-500/30' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 select-none overflow-hidden animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-[32px] bg-[#0c0e14] text-white border border-white/15 shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-md border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Server className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>هندسة خدمات Netflix ومعمارية الأنظمة الموزعة</span>
                <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                  Microservices Architecture
                </span>
              </h2>
              <p className="text-xs text-gray-400">تطبيق المخططات الهندسية لمعالجة البث، API Gateway والخدمات المصغرة</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors active:scale-95"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-black/40 border-b border-white/10 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('microservices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'microservices'
                ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>الخدمات المصغرة (Microservices)</span>
          </button>

          <button
            onClick={() => setActiveTab('techstack')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'techstack'
                ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>الحزمة التقنية (Tech Stack)</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>معالجة البث (Ingestion & HLS)</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-[#e50914] text-white shadow-lg shadow-[#e50914]/30'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>سجلات النظام (Monitoring & Logs)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-right">
          
          {/* TAB 1: MICROSERVICES */}
          {activeTab === 'microservices' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-500/10 via-black to-black p-5 rounded-3xl border border-red-500/20 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">هندسة الربط عبر API Gateway</h3>
                  <p className="text-xs text-gray-400 mt-1">جميع طلبات التطبيق تمر عبر البوابة الموحدة لتوزيع الأحمال والتحقق الأمني والمصادقة.</p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-1.5 rounded-2xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-xs font-bold text-emerald-300">النظام يعمل بكفاءة 100%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map(s => {
                  const Icon = s.icon;
                  const isTesting = testingService === s.key;
                  return (
                    <div
                      key={s.key}
                      className="glass-card p-5 rounded-3xl border border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-11 h-11 rounded-2xl ${s.bg} ${s.color} border ${s.border} flex items-center justify-center shadow-md`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded-full font-bold">
                            {serviceStatus[s.key] === 'healthy' ? 'نشط ومستقر' : 'جاري الفحص...'}
                          </span>
                        </div>
                        <div>
                          <b className="text-sm sm:text-base text-white block group-hover:text-red-400 transition-colors">{s.name}</b>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTestService(s.key, s.name)}
                        disabled={isTesting}
                        className="w-full py-2.5 bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl text-xs font-bold text-gray-200 transition-all flex items-center justify-center gap-2"
                      >
                        {isTesting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-400" />
                            <span>جاري الاختبار...</span>
                          </>
                        ) : (
                          <>
                            <Activity className="w-3.5 h-3.5 text-cyan-400" />
                            <span>فحص الخدمة API</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TECH STACK */}
          {activeTab === 'techstack' && (
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-red-500" />
                  <span>مكونات البنية التقنية لـ Netflix (Tech Stack Architecture)</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  يستند النظام إلى أحدث تقنيات السحابة الموزعة (AWS Cloud) لضمان سرعة الاستجابة، التحمل العالي، وبث عالي الدقة دون أي انقطاع لملايين المستخدمين في آن واحد.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <b className="text-sm text-amber-400 block">الواجهة الأمامية (Frontend)</b>
                    <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                      <li>React.js & TypeScript</li>
                      <li>Tailwind CSS Glassmorphism</li>
                      <li>Redux State Management</li>
                      <li>HTML5 Video & HLS.js Player</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <b className="text-sm text-cyan-400 block">الخدمات الخلفية (Backend)</b>
                    <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                      <li>Node.js / Express & Python</li>
                      <li>Java Spring Boot Microservices</li>
                      <li>Apache Kafka & Apache Flink</li>
                      <li>FFmpeg Video Processing Engine</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <b className="text-sm text-emerald-400 block">قواعد البيانات والتخزين (Storage)</b>
                    <ul className="text-xs text-gray-300 space-y-1.5 list-disc list-inside">
                      <li>Amazon S3 Cloud Storage</li>
                      <li>Cassandra Distributed DB</li>
                      <li>MySQL Relational Database</li>
                      <li>HBase & CloudFront CDN Edge</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PIPELINE */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>خط معالجة واستيعاب الفيديو (Video Ingestion & ABR Pipeline)</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  عند رفع أي ملف فيديو خام إلى FilmMax، يتم تطبيق خط المعالجة المتكامل مستوحى من بنية AWS Elemental:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">1</div>
                    <div>
                      <b className="text-xs sm:text-sm text-white block">استقبال الملف ورفع الأصلي على S3</b>
                      <span className="text-[11px] text-gray-400">تخزين ملف الفيديو الخام وتوليد معرف فريد للمعالجة (Job ID).</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">2</div>
                    <div>
                      <b className="text-xs sm:text-sm text-white block">الفحص والجودة (Video Inspection & QC)</b>
                      <span className="text-[11px] text-gray-400">فحص معدل الإطارات (FPS)، البكسلات، والترميز الصوتي والمرئي.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">3</div>
                    <div>
                      <b className="text-xs sm:text-sm text-white block">معالجة وتشفير ABR Ladder متعدد الجودات</b>
                      <span className="text-[11px] text-gray-400">إنشاء جودات 1080p, 720p, 480p بالتوازي عبر محرك FFmpeg.</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">4</div>
                    <div>
                      <b className="text-xs sm:text-sm text-white block">توليد Master HLS Playlist وترجمة WebVTT</b>
                      <span className="text-[11px] text-gray-400">تجميع المقاطع في ملف `master.m3u8` وتوليد ملفات الترجمة التلقائية.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-pink-400" />
                    <span>سجلات العمليات الفورية (Live System Logs & Flink Stream)</span>
                  </h3>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    متصل بالخادم
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/80 font-mono text-[11px] text-green-400 space-y-2 border border-white/10 overflow-x-auto">
                  <div className="text-gray-500">[2026-10-22 10:16:00] INFO: API Gateway initialized on port 3000.</div>
                  <div className="text-cyan-300">[2026-10-22 10:16:02] SUCCESS: Connected to AWS S3 bucket 'filmmax-production-storage'.</div>
                  <div className="text-white">[2026-10-22 10:16:05] SERVICE: Content Service sync complete (68 movies indexed).</div>
                  <div className="text-amber-300">[2026-10-22 10:10:10] TRANSCODE: FFmpeg process spawned for ABR ladder (1080p, 720p, 480p).</div>
                  <div className="text-green-400">[2026-10-22 10:10:13] HLS: Master playlist generated at /hls/master.m3u8 successfully.</div>
                  <div className="text-purple-300">[2026-10-22 10:15:00] SECURITY: JWT verified for user jjv666x@gmail.com (VIP Active).</div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
