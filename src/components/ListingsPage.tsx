import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Wrench, BookOpen, Star, Plus, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdSensePlaceholder from './AdSensePlaceholder';
import { mockData } from '../data/mockData';

export default function ListingsPage({ forceFilter }: { forceFilter?: 'all' | 'product' | 'service' | 'course' | 'inquiry' }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'product' | 'service' | 'course' | 'inquiry' | 'favorites'>(forceFilter || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (forceFilter) {
      setFilter(forceFilter);
    }
  }, [forceFilter]);

  useEffect(() => {
    const q = query(
      collection(db, 'listings'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setListings([...items, ...mockData] as any[]);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching listings:", error);
      setListings(mockData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const filteredListings = listings.filter(item => {
    const matchesFilter = filter === 'all' || filter === 'favorites' || item.type === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.city && item.city.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pb-4 min-h-screen">
      {/* Header with Search */}
      <div className="bg-[#FF6B00] px-4 pb-16 -mt-4 -mx-4 rounded-b-[3rem] shadow-lg relative z-10">
        <div className="relative max-w-xl mx-auto pt-8">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="ابحث عن منتج، خدمة، مدينة..."
            className="w-full pr-12 pl-4 py-4 bg-white rounded-2xl shadow-xl focus:ring-2 focus:ring-[#FFD700] border-none outline-none transition-all placeholder:text-gray-400 text-sm font-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
        
        {/* AdSense Top */}
        <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-100 overflow-hidden">
           <div className="text-[10px] font-bold text-gray-400 mb-1 px-2 border-b border-gray-50 pb-1 flex items-center justify-between">
             <span>إعلان</span>
             <span className="text-[8px] opacity-70">Google AdSense</span>
           </div>
           <AdSensePlaceholder format="horizontal" className="h-20 bg-gray-50/50" />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-4 px-4">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'product', label: 'المنتجات' },
            { id: 'service', label: 'الخدمات' },
            { id: 'course', label: 'الدورات' },
            { id: 'favorites', label: 'المفضلة ❤️' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-8 py-3 rounded-2xl text-sm font-black whitespace-nowrap transition-all border-2 border-orange-100 shadow-sm ${
                filter === cat.id 
                  ? 'bg-[#FF6B00] border-[#FF6B00] text-white shadow-xl shadow-orange-200'
                  : 'bg-white text-orange-600 border-white hover:border-orange-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="h-96 bg-white rounded-3xl animate-pulse shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="space-y-6 pb-24">
            <AnimatePresence mode="popLayout">
              {filteredListings.flatMap((item) => {
                const nodes = [];
                nodes.push(
                  <motion.div
                    key={item.id}
                    layout={true}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative"
                  >
                    <div 
                      onClick={() => navigate(`/listing/${item.id}`)}
                      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer border border-gray-100"
                    >
                      {/* Full Width Image Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
                        <div className={`w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110 ${
                          item.type === 'product' ? 'bg-orange-50 text-orange-200' :
                          item.type === 'service' ? 'bg-blue-50 text-blue-200' : 
                          item.type === 'course' ? 'bg-green-50 text-green-200' : 'bg-purple-50 text-purple-200'
                        }`}>
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            item.type === 'product' ? <ShoppingBag size={100} strokeWidth={0.5} /> :
                            item.type === 'service' ? <Wrench size={100} strokeWidth={0.5} /> : 
                            item.type === 'course' ? <BookOpen size={100} strokeWidth={0.5} /> : <MessageSquare size={100} strokeWidth={0.5} />
                          )}
                        </div>
                        
                        {/* Favorite Button */}
                        <div className="absolute top-4 left-4">
                           <button className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 shadow-xl active:scale-90 transition-transform">
                             <Star size={24} fill={item.isFavorite ? 'currentColor' : 'none'} fillOpacity={0.2} strokeWidth={2.5} />
                           </button>
                        </div>

                        {/* Category Tag */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-lg text-[10px] font-black text-white shadow-sm backdrop-blur-sm ${
                           item.type === 'product' ? 'bg-orange-500/80' :
                           item.type === 'service' ? 'bg-blue-500/80' : 
                           item.type === 'course' ? 'bg-green-500/80' : 'bg-purple-500/80'
                        }`}>
                           {item.type === 'product' ? 'منتج' : item.type === 'service' ? 'خدمة' : item.type === 'course' ? 'دورة' : 'استشكال'}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                         <div className="flex flex-col gap-1 mb-4 text-right">
                           <h3 className="text-2xl font-black text-gray-900 group-hover:text-[#FF6B00] transition-colors leading-tight">{item.title}</h3>
                           {item.price && (
                             <div className="text-3xl font-black text-green-600 mt-1">
                               {item.price} <span className="text-xs font-bold text-gray-400">درهم</span>
                             </div>
                           )}
                         </div>

                         <div className="flex items-center justify-end gap-3 text-gray-400 text-xs font-bold mb-6">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">👤 {item.ownerName || 'معلم سفيان'}</span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">📍 {item.city || 'الكل'}</span>
                         </div>

                         {/* Premium Sticky Bar Mockup Inside Card */}
                         <div className="bg-gradient-to-r from-[#108A44] via-[#0D6D36] to-[#0A5A2C] p-5 rounded-[2rem] flex items-center justify-between text-white shadow-xl shadow-green-900/10 overflow-hidden relative group/premium">
                            <div className="relative z-10 text-right">
                               <p className="text-[10px] font-bold opacity-80 leading-tight">تثبيت الإعلان في الأعلى</p>
                               <p className="text-lg font-black leading-tight mt-0.5">ابتداءً من 10 دراهم فقط</p>
                               <div className="flex items-center gap-1.5 text-[9px] mt-1.5 opacity-80 bg-black/10 px-2 py-0.5 rounded-lg inline-flex">
                                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_5px_rgba(250,204,21,1)]"></div>
                                  <span>إعلان: احجز مساحتك k50/اليوم</span>
                               </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.dispatchEvent(new CustomEvent('open-cih-modal'));
                              }}
                              className="relative z-10 bg-white text-[#108A44] px-6 py-3 rounded-2xl text-sm font-black hover:bg-green-50 active:scale-95 transition-all shadow-md group-hover/premium:scale-105"
                            >
                               ادفع الآن
                            </button>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                );
                return nodes;
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
