/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ShoppingBag, 
  UserCircle, 
  BookOpen, 
  Wrench, 
  MessageSquare, 
  Share2, 
  Search,
  ChevronLeft,
  Settings,
  Star,
  Home,
  X,
  Gamepad2,
  MessageCircle,
  Crown
} from 'lucide-react';
import { auth, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

import AddListing from './components/AddListing';
import ListingsPage from './components/ListingsPage';
import ListingDetail from './components/ListingDetail';
import ProfilePage from './components/ProfilePage';
import EntertainmentPage from './components/EntertainmentPage';
import ChatRoom from './components/ChatRoom';
import PremiumServices from './components/PremiumServices';

import { useLocation } from 'react-router-dom';

// Navigation Wrapper to handle active state
function NavigationContent({ user, setShowCihModal }: any) {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-6 sm:pb-3">
      <div className="max-w-xl mx-auto flex items-center justify-between relative">
        <Link to="/" className={`flex flex-col items-center gap-1.5 group ${path === '/' ? 'text-orange-600' : 'text-gray-400'}`}>
          <div className={`p-1 rounded-xl transition-colors ${path === '/' ? 'text-orange-600' : 'group-hover:text-orange-600'}`}>
            <Home size={22} fill={path === '/' ? 'currentColor' : 'none'} fillOpacity={path === '/' ? 0.1 : 0} />
          </div>
          <span className="text-[10px] font-black">الرئيسية</span>
        </Link>
        
        <Link to="/courses" className={`flex flex-col items-center gap-1.5 group ${path === '/courses' ? 'text-orange-600' : 'text-gray-400'}`}>
           <div className={`p-1 rounded-xl transition-colors ${path === '/courses' ? 'text-orange-600' : 'group-hover:text-orange-600'}`}>
             <BookOpen size={22} fill={path === '/courses' ? 'currentColor' : 'none'} fillOpacity={path === '/courses' ? 0.1 : 0} />
           </div>
           <span className="text-[10px] font-black">تكوين</span>
        </Link>

        <Link to="/inquiries" className={`flex flex-col items-center gap-1.5 group ${path === '/inquiries' ? 'text-orange-600' : 'text-gray-400'}`}>
           <div className={`p-1 rounded-xl transition-colors ${path === '/inquiries' ? 'text-orange-600' : 'group-hover:text-orange-600'}`}>
             <MessageSquare size={22} fill={path === '/inquiries' ? 'currentColor' : 'none'} fillOpacity={path === '/inquiries' ? 0.1 : 0} />
           </div>
           <span className="text-[10px] font-black">استشكالات</span>
        </Link>

        <Link to="/entertainment" className={`flex flex-col items-center gap-1.5 group ${path === '/entertainment' ? 'text-orange-600' : 'text-gray-400'}`}>
           <div className={`p-1 rounded-xl transition-colors ${path === '/entertainment' ? 'text-orange-600' : 'group-hover:text-orange-600'}`}>
             <Gamepad2 size={24} fill={path === '/entertainment' ? 'currentColor' : 'none'} fillOpacity={path === '/entertainment' ? 0.1 : 0} />
           </div>
           <span className="text-[10px] font-black">ألعاب وربح</span>
        </Link>

        <Link 
          to="/profile"
          className={`flex flex-col items-center gap-1.5 group ${path === '/profile' ? 'text-orange-600' : 'text-gray-400'}`}
        >
           {user ? (
             <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${path === '/profile' ? 'border-orange-500' : 'border-gray-100 group-hover:border-orange-200'}`}>
                <img src={user.photoURL || ''} alt="User" className="w-full h-full object-cover" />
             </div>
           ) : (
             <div className={`p-1 rounded-xl transition-colors ${path === '/profile' ? 'text-orange-600' : 'group-hover:text-orange-600'}`}>
               <UserCircle size={22} fill={path === '/profile' ? 'currentColor' : 'none'} fillOpacity={path === '/profile' ? 0.1 : 0} />
             </div>
           )}
           <span className="text-[10px] font-black">{user ? (user.displayName?.split(' ')[0] || 'حسابي') : 'حسابي'}</span>
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showCihModal, setShowCihModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(10); // default 10dh

  useEffect(() => {
    const handleOpenRate = () => setShowRateModal(true);
    const handleOpenCih = () => setShowCihModal(true);
    
    window.addEventListener('open-rate-modal', handleOpenRate);
    window.addEventListener('open-cih-modal', handleOpenCih);
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => {
      unsubscribe();
      window.removeEventListener('open-rate-modal', handleOpenRate);
      window.removeEventListener('open-cih-modal', handleOpenCih);
    };
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center font-sans tracking-tight">جاري التحميل...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-[#FDFCFB] text-[#1a1a1a] font-sans relative" dir="rtl">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 bg-[#FF6B00] px-4 py-3">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Link to="/premium" className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center gap-1 text-[10px] font-black text-white shadow-[0_0_15px_rgba(250,204,21,0.5)] cursor-pointer hover:scale-105 transition-transform border border-yellow-300">
                  <Crown size={12} fill="currentColor" />
                  VIP
               </Link>
               <div 
                 onClick={() => setShowRateModal(true)}
                 className="px-3 py-1 bg-[#FFD700] rounded-lg flex items-center gap-1 text-[10px] font-black text-orange-900 shadow-sm cursor-pointer hover:bg-yellow-300"
               >
                  <Star size={12} fill="currentColor" />
                  قيمنا
               </div>
            </div>
            
            <Link to="/" className="text-center">
              <h1 className="text-2xl font-black text-white leading-none tracking-tighter">سوق المعلم</h1>
              <div className="flex items-center justify-center gap-1 text-[8px] font-bold text-orange-100 mt-0.5 opacity-80 uppercase">
                <span>V5 FINAL</span>
                <span className="opacity-50">•</span>
                <span>بيع و شراء</span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/add/product" className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold text-xs transition-colors">
                <Plus size={16} strokeWidth={2.5} />
                أضف إعلان
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="pb-36 pt-2">
          <Routes>
            <Route path="/" element={<ListingsPage />} />
            <Route path="/courses" element={<ListingsPage forceFilter="course" />} />
            <Route path="/inquiries" element={<ListingsPage forceFilter="inquiry" />} />
            <Route path="/add/product" element={<AddListing type="product" />} />
            <Route path="/add/service" element={<AddListing type="service" />} />
            <Route path="/add/course" element={<AddListing type="course" />} />
            <Route path="/add/inquiry" element={<AddListing type="inquiry" />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chat" element={<ChatRoom />} />
            <Route path="/entertainment" element={<EntertainmentPage />} />
            <Route path="/premium" element={<PremiumServices />} />
          </Routes>
        </main>
        
        {/* Floating Chat Button */}
        <Link 
          to="/chat" 
          className="fixed bottom-28 left-4 z-[70] w-14 h-14 bg-gradient-to-br from-[#FF69B4] to-[#00BFFF] text-white rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-white hover:scale-110 active:scale-95 transition-transform"
        >
           <MessageCircle size={22} className="mb-0.5" />
           <span className="text-[8px] font-black leading-tight">دردشة</span>
        </Link>

        {/* Floating Animated Orb for Payment */}
        <motion.button
          onClick={() => setShowCihModal(true)}
          animate={{ 
            y: [0, -20, 0],
            x: [0, -10, 10, 0],
            scale: [1, 1.1, 0.95, 1],
            rotate: [0, 15, -15, 0],
            borderRadius: ["50%", "40% 60% 50% 50%", "60% 40% 50% 50%", "50%"]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="fixed bottom-28 right-4 z-[70] w-16 h-16 bg-gradient-to-br from-green-400 via-green-600 to-emerald-800 text-white flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.6)] border-2 border-white/50"
        >
          <span className="text-[9px] font-bold opacity-90 leading-tight">تثبيت</span>
          <span className="text-[11px] font-black leading-tight">10 دراهم</span>
        </motion.button>

        {/* Bottom Navigation */}
        <NavigationContent user={user} setShowCihModal={setShowCihModal} />

        {/* Modals and Dialogs */}
        <AnimatePresence>
          {showCihModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4"
              onClick={() => setShowCihModal(false)}
            >
              <div className="w-full max-w-sm flex justify-end mb-3">
                 <button onClick={() => setShowCihModal(false)} className="bg-white/20 hover:bg-white/40 text-white rounded-full p-2 backdrop-blur-sm shadow-sm transition-colors">
                    <X size={24} />
                 </button>
              </div>
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-sm max-h-[85vh] overflow-y-auto shadow-2xl relative"
              >
                <div className="bg-white p-6 pb-4 text-center mt-2">
                  <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 sm:mb-6"></div>
                  <h3 className="text-xl font-black text-gray-900 flex items-center justify-center gap-2">
                     💳 الدفع لتثبيت الإعلان
                  </h3>
                  <p className="text-[13px] font-bold text-gray-400 mt-1">حوّل المبلغ وأرسل الوصل على واتساب</p>
                </div>
                
                <div className="px-5 pb-6">
                 
                 <div className="bg-gradient-to-br from-[#2b58ef] to-[#403cd5] rounded-[2rem] p-6 text-white shadow-xl shadow-blue-900/20">
                      <div className="flex items-start justify-between mb-8">
                         <div className="bg-white/20 px-4 py-1.5 rounded-full text-[12px] font-bold border border-white/10 tracking-widest bg-opacity-30 backdrop-blur-sm -mt-2">المغرب</div>
                         <div className="flex flex-col items-end text-right">
                           <div className="text-white/80 text-[10px] tracking-wider mb-0.5 uppercase" style={{ direction: 'ltr' }}>CIH BANK</div>
                           <div className="font-black text-xl tracking-wide leading-none uppercase" style={{ direction: 'ltr' }}>CIH Bank</div>
                         </div>
                      </div>

                      <div className="flex justify-between items-center mb-6">
                        <div className="text-sm font-bold text-white/90">الاسم الكامل</div>
                        <div className="flex items-center gap-2 font-bold tracking-widest text-sm uppercase bg-white/10 px-2 py-1 rounded-md border border-white/10" style={{ direction: 'ltr' }}>
                          <span className="text-lg leading-none pt-1">📋</span>
                          <span className="font-mono pt-1 text-[13px]">M AIT BELLA SOUFIANE</span>
                        </div>
                      </div>

                      <div className="bg-white/10 rounded-2xl p-4 pb-3 mb-3 border border-white/10 relative">
                        <div className="text-[11px] text-white/80 absolute top-4 right-4 text-right">RIB الكامل (24 رقم)</div>
                        <div className="flex justify-between items-end mt-6">
                           <button className="bg-white text-blue-600 px-4 py-1.5 rounded-xl text-xs font-black shadow-sm shrink-0 mb-1 active:scale-95 transition-transform">نسخ</button>
                           <div className="flex flex-col flex-1 items-end pt-1" style={{ direction: 'ltr' }}>
                              <div className="font-bold tracking-[0.25em] text-[18px] font-mono leading-tight pl-2">787 007</div>
                              <div className="font-bold tracking-[0.08em] text-[16px] font-mono leading-tight mt-1">000785930040047576</div>
                           </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mb-4">
                         <div className="bg-white/10 p-3 pb-2 rounded-2xl flex-[0.8] border border-white/10 relative">
                           <div className="text-[9px] text-white/80 absolute top-3 right-3 text-right">SWIFT</div>
                           <div className="font-bold tracking-wide font-mono flex gap-1.5 justify-end items-center mt-5" style={{ direction: 'ltr' }}>
                              <span className="text-sm leading-none opacity-80 pt-1">📋</span>
                              <span className="text-[11px] pt-1 tracking-widest">BCMAMAMC</span>
                           </div>
                         </div>
                         <div className="bg-white/10 p-3 pb-2 rounded-2xl flex-1 border border-white/10 relative">
                           <div className="text-[9px] text-white/80 absolute top-3 right-3 text-right whitespace-nowrap">رقم الحساب</div>
                           <div className="font-bold tracking-widest font-mono flex gap-1.5 justify-end items-center mt-5" style={{ direction: 'ltr' }}>
                              <span className="text-sm leading-none opacity-80 pt-1">📋</span>
                              <span className="text-[11px] pt-1">000785R300400475</span>
                           </div>
                         </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-black text-white/90 px-1 pt-1 opacity-90">
                         <div className="flex gap-1 items-center"><span>المفتاح:</span><span className="font-mono pt-0.5">76</span></div>
                         <div className="flex gap-1 items-center"><span>المدينة:</span><span className="font-mono pt-0.5">787</span></div>
                         <div className="flex gap-1 items-center"><span>البنك:</span><span className="font-mono pt-0.5">007</span></div>
                      </div>
                 </div>

                   <div className="flex gap-3 mt-6 mb-6" dir="ltr">
                     {[
                       { v: 10, d: '10د', l: 'يوم واحد' },
                       { v: 50, d: '50د', l: '7 أيام' },
                       { v: 150, d: '150د', l: '30 يوم' }
                     ].map((p, i) => (
                        <button key={i} onClick={() => setPaymentAmount(p.v)} className={`flex-1 py-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${paymentAmount === p.v ? 'border-[#25D366] text-[#25D366]' : 'border-gray-200 text-gray-800 hover:border-gray-300'} bg-white`}>
                          <div className={`font-black text-2xl ${paymentAmount === p.v ? 'text-[#25D366]' : 'text-gray-900'}`}>{p.d}</div>
                          <div className={`text-[11px] font-bold ${paymentAmount === p.v ? 'text-gray-600' : 'text-gray-400'}`}>{p.l}</div>
                        </button>
                     ))}
                   </div>

                   <a 
                     href="https://wa.me/212673550987?text=السلام، أريد تثبيت إعلاني في سوق المعلم. قمت بالتحويل."
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full py-4 bg-[#25D366] text-white font-black rounded-2xl shadow-lg shadow-green-200 hover:bg-green-600 active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
                   >
                     أرسل وصل الدفع على واتساب
                     <div className="bg-white/20 p-1.5 rounded-full ml-1">
                       <MessageSquare size={16} className="text-white fill-current" />
                     </div>
                   </a>
                   
                   <button onClick={() => setShowCihModal(false)} className="w-full mt-6 text-center text-gray-500 font-bold text-lg active:scale-95 transition-transform">
                     إغلاق
                   </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showRateModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowRateModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl space-y-4"
              >
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star size={32} className="text-yellow-500" fill="currentColor" />
                </div>
                <h3 className="text-xl font-black text-gray-900">قيّم تطبيق سوق المعلم</h3>
                
                <div className="flex justify-center gap-2 py-4 text-gray-300">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={40} className="hover:text-yellow-400 cursor-pointer transition-colors" />
                  ))}
                </div>

                <textarea 
                  rows={2}
                  placeholder="ملاحظاتك (اختياري)..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-sm font-bold"
                />

                <div className="flex gap-2">
                  <button onClick={() => setShowRateModal(false)} className="flex-1 py-3 text-gray-500 font-bold rounded-xl border border-gray-200 hover:bg-gray-50">لاحقاً</button>
                  <button className="flex-1 py-3 bg-[#FF6B00] text-white font-black rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600">إرسال التقييم</button>
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </Router>
  );
}

