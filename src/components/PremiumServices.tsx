import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowUpRight, TrendingUp, Gem, Sparkles, X, CheckCircle, Smartphone } from 'lucide-react';

export default function PremiumServices() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = [
    {
      id: 'boost',
      title: 'تثبيت الإعلان (Boost)',
      description: 'ثبت إعلانك في أعلى الصفحة لمدة أسبوع لتحقيق مبيعات أكثر.',
      price: '10 دراهم',
      icon: <TrendingUp size={28} className="text-emerald-500" />,
      features: ['ظهور في أعلى نتائج البحث', 'زيادة مشاهدات الإعلان x5', 'شريط مميز على إعلانك'],
      color: 'from-emerald-400 to-green-600',
    },
    {
      id: 'pro-badge',
      title: 'علامة المحترف (Pro)',
      description: 'احصل على علامة التوثيق (Pro) لزيادة ثقة الزبناء.',
      price: '50 درهم / شهر',
      icon: <ShieldCheck size={28} className="text-blue-500" />,
      features: ['علامة زرقاء أو ذهبية بجانب اسمك', 'أولوية في الدعم الفني', 'إشعارات حصرية بالطلبات الجديدة'],
      color: 'from-blue-400 to-indigo-600',
    },
    {
      id: 'leads',
      title: 'باقة الحرفي الشاملة',
      description: 'كل الميزات مع فتح أرقام الزبائن للطلبات الخاصة مباشرة.',
      price: '100 درهم / شهر',
      icon: <Gem size={28} className="text-purple-500" />,
      features: ['تثبيت إعلانين مجاناً كل شهر', 'علامة المحترف', 'رؤية أرقام زبائن الطلبات الخاصة فوراً'],
      color: 'from-purple-400 to-pink-600',
    }
  ];

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6 pb-20">
      <div className="bg-gradient-to-br from-[#FF6B00] to-[#ff9800] rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
        <Sparkles className="absolute top-2 left-2 text-white/30 w-16 h-16" />
        <div className="relative z-10">
          <h1 className="text-2xl font-black mb-2 flex items-center gap-2">
             <Gem size={24} /> خدمات مميزة للربح
          </h1>
          <p className="text-sm font-bold opacity-90 leading-relaxed">
             ارتقِ بعملاتك ومبيعاتك عبر ترقية حسابك إلى باقاتنا المميزة. وفرنا لك أدوات لزيادة المداخيل ومضاعفة الزبائن.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {plans.map((plan) => (
           <motion.div 
             key={plan.id}
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="bg-white rounded-[2rem] shadow-md border-2 border-gray-100 p-5 relative overflow-hidden cursor-pointer"
             onClick={() => handleSelectPlan(plan)}
           >
             <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${plan.color} opacity-10 rounded-bl-[100px]`}></div>
             
             <div className="flex gap-4">
               <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                 {plan.icon}
               </div>
               
               <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                   <h2 className="font-black text-lg text-gray-900">{plan.title}</h2>
                   <div className={`bg-gradient-to-r ${plan.color} text-white px-3 py-1 rounded-full text-xs font-black shadow-sm`}>
                     {plan.price}
                   </div>
                 </div>
                 <p className="text-xs font-bold text-gray-500 mb-3">{plan.description}</p>
                 
                 <div className="space-y-1.5">
                   {plan.features.map((feature, idx) => (
                     <div key={idx} className="flex items-center gap-1.5 text-gray-600">
                        <CheckCircle size={14} className="text-green-500" />
                        <span className="text-[11px] font-bold">{feature}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
           </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showPaymentModal && selectedPlan && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4"
            onClick={() => setShowPaymentModal(false)}
          >
            <div className="w-full max-w-sm flex justify-end mb-3">
               <button onClick={() => setShowPaymentModal(false)} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm shadow-sm transition-colors">
                  <X size={24} />
               </button>
            </div>
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="bg-white p-6 pb-4 text-center mt-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-md">
                   {selectedPlan.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">
                   الاشتراك في: {selectedPlan.title}
                </h3>
                <div className="text-lg font-black text-[#FF6B00] mb-2">{selectedPlan.price}</div>
                <p className="text-[13px] font-bold text-gray-400">للتفعيل، حوّل المبلغ إلى الحساب البنكي التالي وأرسل وصل الدفع عبر واتساب.</p>
              </div>
              
              <div className="px-5 pb-6 space-y-4">
               {/* CIH Bank Card */}
               <div className="bg-gradient-to-br from-[#2b58ef] to-[#403cd5] rounded-[1.5rem] p-5 text-white shadow-xl shadow-blue-900/20">
                    <div className="flex items-start justify-between mb-6">
                       <div className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold border border-white/10 tracking-widest bg-opacity-30 backdrop-blur-sm">المغرب</div>
                       <div className="flex flex-col items-end text-right">
                         <div className="text-white/80 text-[10px] tracking-wider mb-0.5 uppercase" style={{ direction: 'ltr' }}>CIH BANK</div>
                         <div className="font-black text-lg tracking-wide leading-none uppercase" style={{ direction: 'ltr' }}>CIH Bank</div>
                       </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-xs font-bold text-white/90">الاسم الكامل</div>
                      <div className="font-mono font-bold tracking-widest text-xs uppercase" style={{ direction: 'ltr' }}>
                        M AIT BELLA SOUFIANE
                      </div>
                    </div>

                    <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                      <div className="text-[10px] font-bold text-white/70 mb-1 text-center tracking-widest">رقم الحساب (RIB)</div>
                      <div className="font-mono font-black text-sm text-center tracking-[0.2em] shadow-sm text-white" style={{ direction: 'ltr' }}>
                        230 081 2297800 211019001 02
                      </div>
                    </div>
                 </div>

                 {/* Phone info */}
                 <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-green-600 mb-0.5">رقم الواتساب لإرسال الوصل:</div>
                      <div className="font-black text-gray-800" style={{ direction: 'ltr' }}>0663 31 43 08</div>
                    </div>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md">
                       <Smartphone size={20} />
                    </div>
                 </div>

                 <button
                    onClick={() => {
                        window.open(`https://wa.me/212663314308?text=مرحباً، أود تفعيل باقة ${selectedPlan.title} وهذا هو توصيل الأداء.`,'_blank');
                    }}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    أرسل الوصل عبر واتساب
                  </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
