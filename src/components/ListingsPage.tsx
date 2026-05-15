import { useState, useEffect, Fragment } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Wrench, BookOpen, Clock, Tag, Plus, MessageSquare, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RotatingAd from './RotatingAd';
import AdSensePlaceholder from './AdSensePlaceholder';
import DailyWidgets from './DailyWidgets';
import { mockData } from '../data/mockData';

export default function ListingsPage({ forceFilter }: { forceFilter?: 'all' | 'product' | 'service' | 'course' | 'inquiry' }) {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'product' | 'service' | 'course' | 'inquiry'>(forceFilter || 'all');
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
      // Fallback to mock data if error
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
    <div className="pb-4 space-y-4">
      {/* Header with Search */}
      <div className="bg-[#FF6B00] px-4 pb-6 -mt-2 -mx-4 rounded-b-[2rem] shadow-sm">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="ابحث عن منتج، خدمة، مدينة..."
            className="w-full pr-12 pl-4 py-3.5 bg-white rounded-2xl shadow-md focus:ring-2 focus:ring-[#FFD700] border border-orange-100 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 space-y-6">
        
        {/* Animated Rotating Ad */}
        <RotatingAd />

        {/* AdSense Top */}
        <AdSensePlaceholder format="horizontal" className="h-24 bg-white/50" />

        <DailyWidgets />

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4 mt-2">
          {[
            { id: 'product', label: 'المنتجات', activeClass: 'bg-[#FF6B00] border-[#FF6B00] text-white', icon: null },
            { id: 'service', label: 'الخدمات', activeClass: 'bg-[#FF6B00] border-[#FF6B00] text-white', icon: null },
            { id: 'course', label: 'الدورات', activeClass: 'bg-[#FF6B00] border-[#FF6B00] text-white', icon: null },
            { id: 'inquiry', label: 'استشكالات', activeClass: 'bg-[#FF6B00] border-[#FF6B00] text-white', icon: null },
            { id: 'favorites', label: 'المفضلة ❤️', activeClass: 'bg-[#FF6B00] border-[#FF6B00] text-white', icon: null },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                filter === cat.id 
                  ? cat.activeClass
                  : 'bg-white text-gray-500 border-gray-200 hover:border-orange-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="space-y-4 pt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-white border border-gray-50 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            
            {/* Category Title dynamic */}
            <div className="flex items-center justify-between mb-4 mt-6">
               <Link to={`/add/${filter !== 'favorites' && filter !== 'all' ? filter : 'product'}`} className="bg-[#108A44] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform">
                 <Plus size={16} />
                 أضف {filter === 'product' ? 'منتجك' : filter === 'service' ? 'خدمتك' : filter === 'course' ? 'دورتك' : filter === 'inquiry' ? 'سؤالك' : 'إعلانك'}
               </Link>
               <h2 className="text-xl font-black text-gray-900">
                 {filter === 'product' ? 'المنتجات المتاحة' : filter === 'service' ? 'الخدمات المتاحة' : filter === 'course' ? 'الدورات التكوينية' : filter === 'inquiry' ? 'الاستشكالات والأسئلة' : 'أحدث الإعلانات'}
               </h2>
            </div>
            <AnimatePresence mode="popLayout">
              {filteredListings.flatMap((item, index) => {
                const nodes = [];
                if (index > 0 && index % 4 === 0) {
                  nodes.push(
                    <motion.div
                      key={`ad-${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="my-4"
                    >
                      <AdSensePlaceholder format="fluid" className="min-h-[120px] bg-blue-50/50" />
                    </motion.div>
                  );
                }
                nodes.push(
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-3"
                  >
                  <div 
                    onClick={() => navigate(`/listing/${item.id}`)}
                    className="group block bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 transition-all cursor-pointer"
                  >
                    <div className="flex p-4 gap-4">
                       {/* Icon/Image Placeholder */}
                      <div className={`w-28 h-28 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                        item.type === 'product' ? 'bg-orange-50 text-orange-500' :
                        item.type === 'service' ? 'bg-blue-50 text-blue-500' : 
                        item.type === 'course' ? 'bg-green-50 text-green-500' : 'bg-purple-50 text-purple-500'
                      }`}>
                        {item.type === 'product' ? <ShoppingBag size={40} strokeWidth={1.5} /> :
                         item.type === 'service' ? <Wrench size={40} strokeWidth={1.5} /> : 
                         item.type === 'course' ? <BookOpen size={40} strokeWidth={1.5} /> : <MessageSquare size={40} strokeWidth={1.5} />}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-1">{item.title}</h3>
                            {item.price && (
                              <div className="text-orange-600 font-black whitespace-nowrap bg-orange-50 px-2 py-0.5 rounded-lg text-sm">
                                {item.price} <span className="text-[10px]">درهم</span>
                              </div>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-2">{item.description}</p>
                          
                          <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold">
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                              <Clock size={12} />
                              {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('ar-MA') : new Date().toLocaleDateString('ar-MA')}
                            </span>
                            {item.city && (
                              <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full text-gray-600">
                                📍 {item.city}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded-full text-[10px] ${
                               item.type === 'product' ? 'bg-orange-50 text-orange-600' :
                               item.type === 'service' ? 'bg-blue-50 text-blue-600' : 
                               item.type === 'course' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                            }`}>
                              {item.type === 'product' ? 'منتج' : item.type === 'service' ? 'خدمة' : item.type === 'course' ? 'دورة' : 'استشكال'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Quick Contact Button */}
                        <div className="mt-2 flex gap-2">
                           {item.phone && (
                             <a 
                               href={`https://wa.me/${item.phone.startsWith('0') ? '212' + item.phone.substring(1) : item.phone}?text=${encodeURIComponent('السلام عليكم، مهتم بإعلانك: ' + item.title + '\nالرابط: ' + window.location.origin + '/listing/' + item.id)}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               onClick={(e) => e.stopPropagation()}
                               className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#25D366] text-white rounded-xl text-[10px] font-black hover:bg-[#20ba59] active:scale-95 transition-transform"
                             >
                                <MessageCircle size={14} fill="white" />
                                تواصل سريع
                             </a>
                           )}
                           <Link 
                             to={`/listing/${item.id}`}
                             onClick={(e) => e.stopPropagation()}
                             className="flex-1 flex items-center justify-center py-2 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black hover:bg-gray-200 active:scale-95 transition-transform"
                           >
                             التفاصيل
                           </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                );
                return nodes;
              })}
            </AnimatePresence>
            
            {filteredListings.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <ShoppingBag size={32} className="text-gray-300" />
                </div>
                 <p className="text-gray-500 font-bold">لا توجد نتائج بحث</p>
                 <button onClick={() => {setFilter('all'); setSearchTerm('');}} className="mt-4 text-orange-600 text-sm font-bold underline">إظهار الكل</button>
              </div>
            )}
          </div>
        )}

        {/* Bottom AdSense */}
        <div className="mt-10">
           <AdSensePlaceholder format="rectangle" className="h-[250px] bg-white border border-gray-100 shadow-sm" />
           <div className="mt-4">
             <RotatingAd />
           </div>
        </div>
      </div>
    </div>
  );

}
