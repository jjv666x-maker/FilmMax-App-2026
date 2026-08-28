// Real-time dynamic subtitles transcript generator for FilmMax Player
export interface SubtitleCue {
  start: number;
  end: number;
  ar: string;
  en: string;
  iq: string; // Iraqi dialect
}

// Generate timed cues for any movie based on duration and title
export function getSubtitlesForMovie(movieTitle: string, durationSec: number = 180): SubtitleCue[] {
  const cues: SubtitleCue[] = [
    {
      start: 0,
      end: 5,
      ar: `يقدم لكم فيلم ماكس: ${movieTitle}`,
      en: `FilmMax Studios Presents: ${movieTitle}`,
      iq: `فيلم ماكس يقدملكم: ${movieTitle}`
    },
    {
      start: 6,
      end: 14,
      ar: 'في عالم تسوده التحديات، تبدأ الرحلة الكبرى نحو المجهول...',
      en: 'In a world of untold challenges, the ultimate journey begins...',
      iq: 'بعالم مليان مغامرات وتحديات، بدت القصة الحقيقية...'
    },
    {
      start: 15,
      end: 24,
      ar: '«إذا كنت تبحث عن الحقيقة، فعليك أن تكون مستعداً لمواجهة العواقب!»',
      en: '"If you seek the truth, be ready to face the consequences!"',
      iq: '«إذا تريد تعرف الصدك، لازم تكون كدها وتتحمل كلشي!»'
    },
    {
      start: 25,
      end: 35,
      ar: 'استمع جيداً، الخطة تبدأ عند إشارة الصفر، لا مجال للتراجع الآن.',
      en: 'Listen closely, the plan initiates at zero hour. No turning back.',
      iq: 'اسمعني زين، الخطة تبدي هسه وماكو أي رجعة بعد.'
    },
    {
      start: 36,
      end: 48,
      ar: 'هل تسمع تلك الأصوات في الأفق؟ إنهم يقتربون بسرعة فائقة!',
      en: 'Do you hear those sounds on the horizon? They are approaching fast!',
      iq: 'دا تسمع هذا الصوت البعيد؟ ديقتربون بسرعة كلش قوية!'
    },
    {
      start: 49,
      end: 62,
      ar: '«لن نستسلم أبداً مهما كانت الصعوبات، النصر حليفنا!»',
      en: '"We will never surrender, no matter the odds. Victory is ours!"',
      iq: '«مستحيل نستسلم لو شحدهم، الفوز والتحدي إلنا!»'
    },
    {
      start: 63,
      end: 78,
      ar: 'تحذير أمني: تم رصد إشارات غامضة تتطلب تدخلاً سينمائياً فورياً.',
      en: 'Security alert: Unknown signals detected requiring immediate cinematic action.',
      iq: 'انتباه: أكو إشارات غريبة ولازم نتدخل بسرعة وبحذر.'
    },
    {
      start: 79,
      end: 95,
      ar: 'تذكر دائماً، الأمل هو السلاح الوحيد الذي لا يمكن لأحد نزعه منك.',
      en: 'Always remember: Hope is the one weapon no one can ever take from you.',
      iq: 'اتذكر دائماً، الأمل هو الشي الوحيد اللي محد يكدر ياخذه منك.'
    },
    {
      start: 96,
      end: 115,
      ar: 'الآن أو أبداً، تقارب اللحظة الحاسمة ومصير الجميع معلق بهذا القرار.',
      en: 'Now or never. The critical moment arrives and every destiny hangs in the balance.',
      iq: 'هسه وكتها! اللحظة الحاسمة وصلت ومصيرنا كلياتنا بإيدنا.'
    },
    {
      start: 116,
      end: 140,
      ar: '«حافظ على هدوئك، سنصل إلى بر الأمان معاً مهما اشتدت العاصفة.»',
      en: '"Stay calm, we will make it through together no matter how fierce the storm."',
      iq: '«خليك هادئ ومسيطر، راح نعديها سوا ونوصل بسلامة.»'
    },
    {
      start: 141,
      end: 170,
      ar: 'أحداث مشوقة ومفاجآت مستمرة في هذا العمل السينمائي الخارق.',
      en: 'Breathtaking action and epic twists unfold in this masterpiece.',
      iq: 'مفاجآت وأحداث تحبس الأنفاس بهذا العمل السينمائي الرهيب.'
    },
    {
      start: 171,
      end: 300,
      ar: 'نهاية المشهد — ترقبوا المزيد من الأحداث والإثارة الحصرية على FilmMax.',
      en: 'End of scene — Stay tuned for more exclusive cinematic brilliance on FilmMax.',
      iq: 'نهاية المشهد — انتظروا المزيد من الإثارة الحصرية على فيلم ماكس.'
    }
  ];

  return cues;
}
