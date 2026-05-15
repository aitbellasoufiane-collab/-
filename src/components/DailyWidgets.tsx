import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pill, Clock, CloudSun, Briefcase, Phone, X, ShieldAlert, HeartPulse, Activity } from 'lucide-react';

const widgets = [
  {
    id: 'prayers',
    title: 'أوقات الصلاة',
    icon: <Clock size={24} className="text-emerald-500" />,
    color: 'bg-emerald-50 border-emerald-100',
  },
  {
    id: 'pharmacy',
    title: 'صيدليات الحراسة',
    icon: <Pill size={24} className="text-red-500" />,
    color: 'bg-red-50 border-red-100',
  },
  {
     id: 'emergency',
     title: 'أرقام الطوارئ',
     icon: <Phone size={24} className="text-orange-500" />,
     color: 'bg-orange-50 border-orange-100',
  },
  {
    id: 'weather',
    title: 'حالة الطقس',
    icon: <CloudSun size={24} className="text-blue-500" />,
    color: 'bg-blue-50 border-blue-100',
  },
  {
    id: 'jobs',
    title: 'عروض العمل',
    icon: <Briefcase size={24} className="text-purple-500" />,
    color: 'bg-purple-50 border-purple-100',
  }
];

export default function DailyWidgets() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case 'emergency':
        return (
          <div className="space-y-3">
             <h3 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> أرقام الطوارئ 
             </h3>
             <a href="tel:19" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors border border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black">19</div>
                 <span className="font-bold text-gray-800">الشرطة</span>
               </div>
               <Phone size={18} className="text-gray-400" />
             </a>
             <a href="tel:15" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors border border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-black">15</div>
                 <span className="font-bold text-gray-800">الوقاية المدنية (الإسعاف)</span>
               </div>
               <Phone size={18} className="text-gray-400" />
             </a>
             <a href="tel:177" className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-red-50 transition-colors border border-gray-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center font-black text-xs">177</div>
                 <span className="font-bold text-gray-800">الدرك الملكي</span>
               </div>
               <Phone size={18} className="text-gray-400" />
             </a>
          </div>
        );
      case 'prayers':
        return (
          <div className="space-y-3 text-center">
             <h3 className="font-black text-xl text-gray-900 mb-4 flex justify-center items-center gap-2">
                <Clock className="text-emerald-500" /> أوقات الصلاة - اليوم
             </h3>
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                 <div className="text-emerald-800 font-black mb-1">الفجر</div>
                 <div className="text-lg font-bold">04:30</div>
               </div>
               <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                 <div className="text-emerald-800 font-black mb-1">الظهر</div>
                 <div className="text-lg font-bold">13:15</div>
               </div>
               <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                 <div className="text-emerald-800 font-black mb-1">العصر</div>
                 <div className="text-lg font-bold">16:45</div>
               </div>
               <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                 <div className="text-emerald-800 font-black mb-1">المغرب</div>
                 <div className="text-lg font-bold">19:30</div>
               </div>
               <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100 col-span-2">
                 <div className="text-emerald-800 font-black mb-1">العشاء</div>
                 <div className="text-lg font-bold">21:00</div>
               </div>
             </div>
          </div>
        );
      case 'pharmacy':
        return (
          <div className="space-y-4">
             <h3 className="font-black text-xl text-gray-900 mb-2 flex items-center gap-2">
                <HeartPulse className="text-red-500" /> صيدليات الحراسة
             </h3>
             <p className="text-gray-500 text-sm font-bold leading-relaxed bg-red-50 p-3 rounded-xl border border-red-100 mb-4">
                قريباً: سيتم إضافة قائمة بصيدليات الحراسة المفتوحة ليلاً ونهاراً حسب كل مدينة لتسهيل البحث على المستخدمين.
             </p>
             <button onClick={() => window.open('https://pharma.ma/', '_blank')} className="w-full bg-red-500 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/30">
               <Pill size={20} /> ابحث في موقع Pharma.ma
             </button>
          </div>
        );
      case 'jobs':
        return (
          <div className="space-y-4">
             <h3 className="font-black text-xl text-gray-900 mb-2 flex items-center gap-2">
                <Briefcase className="text-purple-500" /> عروض العمل
             </h3>
             <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                   <div className="text-sm font-black text-purple-900 mb-1">مطلوب نجار (كازا)</div>
                   <div className="text-xs font-bold text-gray-600">شركة خشب الدير - 400 درهم/يوم</div>
                </div>
                <button className="bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">تفاصيل</button>
             </div>
             <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex items-center justify-between">
                <div>
                   <div className="text-sm font-black text-purple-900 mb-1">صباغ منازل (طنجة)</div>
                   <div className="text-xs font-bold text-gray-600">ورشة الأندلس - راتب شهري</div>
                </div>
                <button className="bg-purple-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl">تفاصيل</button>
             </div>
             <button onClick={() => window.open('https://www.anapec.org/', '_blank')} className="w-full text-purple-600 font-black py-2 rounded-2xl text-sm border-2 border-purple-200 mt-2">
               شاهد المزيد على صفحة ANAPEC
             </button>
          </div>
        );
      case 'weather':
        return (
          <div className="space-y-4">
             <h3 className="font-black text-xl text-gray-900 mb-2 flex items-center gap-2">
                <CloudSun className="text-blue-500" /> حالة الطقس
             </h3>
             <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/30 text-center relative overflow-hidden">
                <CloudSun size={80} className="text-white/20 absolute -right-4 -top-4" />
                <div className="relative z-10">
                   <div className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full mb-3 backdrop-blur-sm">الدار البيضاء</div>
                   <div className="text-5xl font-black mb-1">24°</div>
                   <div className="text-sm font-bold opacity-90">مشمس وغائم جزئياً</div>
                </div>
             </div>
             <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-blue-50 p-2 rounded-2xl">
                   <div className="text-xs font-bold text-blue-900 mb-1">مراكش</div>
                   <div className="text-sm font-black text-gray-800">32°</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-2xl">
                   <div className="text-xs font-bold text-blue-900 mb-1">طنجة</div>
                   <div className="text-sm font-black text-gray-800">22°</div>
                </div>
                <div className="bg-blue-50 p-2 rounded-2xl">
                   <div className="text-xs font-bold text-blue-900 mb-1">أكادير</div>
                   <div className="text-sm font-black text-gray-800">26°</div>
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4 text-center py-6">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
               <Activity className="text-gray-400" size={32} />
             </div>
             <h3 className="font-black text-gray-800 text-lg">قيد التطوير</h3>
             <p className="text-gray-500 font-bold text-sm">هذه الخدمة ستكون متاحة قريباً لتوفير معلومات يومية تهمك.</p>
          </div>
        );
    }
  };

  return (
    <div className="mt-2 mb-4">
      <div className="flex items-center justify-between mb-3 px-1">
         <h2 className="text-sm font-black text-gray-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
            خدمات ومعلومات يدوية
         </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4 pt-1">
        {widgets.map((widget) => (
          <motion.div
             key={widget.id}
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className="min-w-[105px] flex flex-col items-center justify-center p-3 bg-white rounded-3xl shadow-sm border border-gray-100 cursor-pointer"
             onClick={() => setActiveModal(widget.id)}
          >
            <div className={`w-14 h-14 ${widget.color} border rounded-2xl flex items-center justify-center mb-2 shadow-inner`}>
              {widget.icon}
            </div>
            <span className="text-xs font-black text-gray-700 whitespace-nowrap">{widget.title}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <div className="w-full max-w-sm flex justify-end mb-3">
               <button onClick={() => setActiveModal(null)} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm shadow-sm transition-colors">
                  <X size={24} />
               </button>
            </div>
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2rem] w-full max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl p-6 relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-b-full"></div>
              {renderModalContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
