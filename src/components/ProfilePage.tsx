import { motion } from 'motion/react';
import { Settings, MessageSquare, Star, ArrowRight, ChevronLeft } from 'lucide-react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import AdSensePlaceholder from './AdSensePlaceholder';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-xl mx-auto px-4 pb-24 space-y-6 pt-4"
    >
      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-orange-50">
         <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0 border-4 border-orange-100">
           {user?.photoURL ? (
             <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
           ) : (
             <span className="text-3xl">👤</span>
           )}
         </div>
         <div className="flex-1">
           <h2 className="text-xl font-black text-gray-900 border-b-2 border-[#FFD700] w-max mb-1">
             مرحباً بك
           </h2>
           <p className="text-sm font-bold text-gray-500">عضو في سوق المعلم</p>
         </div>
         {!user && (
           <button onClick={() => signInWithGoogle()} className="px-4 py-2 bg-orange-100 text-orange-600 font-bold rounded-xl text-sm">
             سجل الدخول
           </button>
         )}
      </div>

      <div className="bg-[#FF6B00] rounded-3xl p-4 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-4 bg-black/40 text-[10px] font-bold px-2 py-0.5 rounded-b-md">مميز</div>
        <button 
          onClick={() => window.dispatchEvent(new Event('open-cih-modal'))}
          className="bg-white text-[#FF6B00] font-black px-5 py-2.5 rounded-xl text-sm shadow-sm active:scale-95 transition-transform mt-4"
        >
          احجز
        </button>
        <div className="text-right mt-2 w-full flex flex-col items-end">
          <div className="font-black text-2xl">أعلن هنا</div>
          <div className="text-sm font-bold bg-white/20 inline-block px-2 py-1 rounded-full mt-1">10 دراهم / اليوم</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
        <button 
          onClick={() => window.dispatchEvent(new Event('open-rate-modal'))}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50 transition-colors"
        >
          <ChevronLeft className="text-gray-400 rotate-180" size={20} />
          <span className="font-black text-gray-700">قيّم التطبيق ⭐</span>
        </button>
        <button 
          onClick={() => alert("سيتم إضافة الإعدادات قريباً!")}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 border-b border-gray-50 transition-colors"
        >
          <ChevronLeft className="text-gray-400 rotate-180" size={20} />
          <span className="font-black text-gray-700">الإعدادات ⚙️</span>
        </button>
        <a 
          href="https://wa.me/212673550987?text=السلام، لدي استفسار بخصوص تطبيق سوق المعلم."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="text-gray-400 rotate-180" size={20} />
          <span className="font-black text-gray-700">تواصل معنا 💬</span>
        </a>
      </div>

      <AdSensePlaceholder format="rectangle" className="mt-6 bg-white border border-gray-100 shadow-sm" />
    </motion.div>
  );
}
