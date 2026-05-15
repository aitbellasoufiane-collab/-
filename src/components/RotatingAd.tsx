import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ads = [
  { 
    title: 'دورة تكوينية', 
    desc: 'إصلاح الهواتف • سجل الآن', 
    icon: '🎓', 
    bg: 'bg-[#0E8A42]',
    btn: 'التفاصيل',
    link: 'https://wa.me/212673550987?text=السلام، أريد التسجيل في الدورة التكوينية' 
  },
  { 
    title: 'أعلن هنا', 
    desc: 'ابتداءً من 10 دراهم فقط', 
    icon: '📢', 
    bg: 'bg-red-500',
    btn: 'اشترك الآن',
    link: 'https://wa.me/212673550987?text=السلام، أريد الإعلان في التطبيق' 
  },
  { 
    title: 'تخفيضات 50%', 
    desc: 'معدات الميكانيك', 
    icon: '🔧', 
    bg: 'bg-blue-600',
    btn: 'تسوق',
    link: 'https://wa.me/212673550987?text=السلام، أبحث عن معدات الميكانيك' 
  },
  { 
    title: 'خدمات سريعة', 
    desc: 'صيانة بالمنزل 24/7', 
    icon: '🚀', 
    bg: 'bg-[#FF6B00]',
    btn: 'اطلب الخدمة',
    link: 'https://wa.me/212673550987?text=السلام، أبحث عن خدمة صيانة بالمنزل' 
  }
];

export default function RotatingAd() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ads.length);
    }, 4000); // Rotate every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[110px] w-full rounded-3xl overflow-hidden shadow-md">
      <AnimatePresence mode="wait">
        {ads.map((ad, idx) => {
          if (idx !== currentIndex) return null;
          return (
            <motion.div 
               key={idx}
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 1.05, y: -10 }}
               transition={{ duration: 0.4 }}
               className={`absolute inset-0 ${ad.bg} text-white flex items-center justify-between p-4 px-5`}
            >
               <div className="absolute top-0 right-4 bg-black/40 text-[10px] font-bold px-3 py-1 rounded-b-lg tracking-widest uppercase">إعلان مميز</div>
               <a 
                 href={ad.link} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="bg-white text-gray-900 font-black px-5 py-2.5 mt-4 rounded-xl text-sm shadow-sm active:scale-95 transition-transform z-10 relative whitespace-nowrap"
               >
                 {ad.btn}
               </a>
               <div className="text-right mt-4 flex flex-col items-end z-10 relative cursor-pointer group">
                 <div className="font-black text-xl flex items-center gap-1.5 group-hover:scale-105 transition-transform origin-right">
                   {ad.title}
                   <span className="text-2xl">{ad.icon}</span>
                 </div>
                 <div className="text-sm font-bold opacity-90">{ad.desc}</div>
               </div>
               
               {/* Decorative background elements */}
               <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
               <div className="absolute -right-10 -top-10 w-32 h-32 bg-black/10 rounded-full blur-xl" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
