import { motion } from 'motion/react';
import { Gamepad2, Gift, TrendingUp, ChevronLeft, MonitorPlay } from 'lucide-react';
import AdSensePlaceholder from './AdSensePlaceholder';

export default function EntertainmentPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto px-4 pb-24 space-y-6 pt-4"
    >
      <div className="bg-gradient-to-br from-[#FFD700] to-[#FF8C00] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
           <div>
             <h2 className="text-2xl font-black mb-1">ألعاب وربح</h2>
             <p className="text-sm font-bold opacity-90">استمتع بوقتك واربح المال من الإنترنت</p>
           </div>
           <Gamepad2 size={48} className="opacity-80" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-10 -mt-10" />
      </div>

      <AdSensePlaceholder format="horizontal" className="h-24 bg-white/50" />

      <div className="space-y-4">
        {[
          {
            title: 'مشاهدة الفيديوهات والإعلانات',
            desc: 'اربح المال مقابل كل فيديو أو إعلان تشاهده (YSense)',
            icon: MonitorPlay,
            color: 'text-blue-500',
            bg: 'bg-blue-100',
            link: 'https://www.ysense.com/'
          },
          {
            title: 'استطلاعات الرأي المدفوعة',
            desc: 'أجب على الأسئلة السهلة واجمع الرصيد',
            icon: Gift,
            color: 'text-green-500',
            bg: 'bg-green-100',
            link: 'https://ma.toluna.com/'
          },
          {
            title: 'ألعاب الجوال المصغرة',
            desc: 'تشغيل الألعاب الممتعة لتحقيق أرباح يومية',
            icon: Gamepad2,
            color: 'text-purple-500',
            bg: 'bg-purple-100',
            link: 'https://poki.com/'
          },
          {
            title: 'تداول واستثمار',
            desc: 'تعلم كيف تتداول العملات واستثمر أرباحك عبر Binance',
            icon: TrendingUp,
            color: 'text-orange-500',
            bg: 'bg-orange-100',
            link: 'https://www.binance.com/'
          }
        ].map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow group text-right block"
          >
            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
               <item.icon size={28} />
            </div>
            <div className="flex-1">
               <h3 className="font-black text-gray-900 text-lg">{item.title}</h3>
               <p className="font-bold text-gray-500 text-[13px]">{item.desc}</p>
               <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                 ابدأ الآن
                 <ChevronLeft size={12} />
               </div>
            </div>
          </a>
        ))}
      </div>

      <AdSensePlaceholder format="rectangle" className="mt-6 bg-white border border-gray-100 shadow-sm min-h-[250px]" />
    </motion.div>
  );
}
