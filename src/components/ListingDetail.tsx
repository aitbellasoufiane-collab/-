import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Share2, 
  Phone, 
  ShoppingBag, 
  Wrench, 
  BookOpen, 
  Calendar, 
  User,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import AdSensePlaceholder from './AdSensePlaceholder';

import { mockData } from '../data/mockData';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      if (!id) return;
      try {
        // First check mockData
        const mockItem = mockData.find(item => item.id === id);
        if (mockItem) {
          setListing(mockItem);
          setLoading(false);
          return;
        }

        const docRef = doc(db, 'listings', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: listing.title,
      text: listing.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">جاري التحميل...</div>;
  if (!listing) return <div className="p-10 text-center text-red-500 font-bold underline cursor-pointer" onClick={() => navigate('/')}>الإعلان غير موجود. العودة للرئيسية</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-10"
    >
      {/* Header Actions */}
      <div className="p-4 flex items-center justify-between sticky top-[61px] bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleShare}
            className="p-2.5 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition-colors flex items-center gap-2"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
            <span className="text-xs font-bold px-1">{copied ? 'تم النسخ' : 'مشاركة'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Visual Header */}
        <div className={`aspect-video rounded-3xl flex flex-col items-center justify-center gap-4 ${
          listing.type === 'product' ? 'bg-orange-50 text-orange-500' :
          listing.type === 'service' ? 'bg-blue-50 text-blue-500' : 'bg-green-50 text-green-500'
        }`}>
          {listing.type === 'product' ? <ShoppingBag size={64} strokeWidth={1} /> :
           listing.type === 'service' ? <Wrench size={64} strokeWidth={1} /> : <BookOpen size={64} strokeWidth={1} />}
          <div className="px-4 py-1.5 bg-white/80 backdrop-blur rounded-full text-xs font-bold shadow-sm">
            {listing.type === 'product' ? 'منتج للبيع' : listing.type === 'service' ? 'خدمة معروضة' : 'دورة تكوينية'}
          </div>
        </div>

        {/* AdSense Top Inside Detail */}
        <AdSensePlaceholder format="horizontal" className="h-20 bg-gray-50/50 my-2 shadow-inner border-gray-100/60" />

        {/* Content */}
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl font-bold leading-tight">{listing.title}</h1>
            {listing.price && (
              <div className="text-2xl font-black text-orange-600 shrink-0">
                {listing.price} <span className="text-xs">درهم</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-gray-500 text-sm border-y border-gray-50 py-3">
             <div className="flex items-center gap-2">
                <Calendar size={16} className="text-orange-300" />
                {listing.createdAt?.toDate().toLocaleDateString('ar-MA')}
             </div>
             {listing.city && (
               <div className="flex items-center gap-2">
                  <span className="text-orange-300 text-[16px]">📍</span>
                  {listing.city}
               </div>
             )}
             <div className="flex items-center gap-2">
                <User size={16} className="text-orange-300" />
                {listing.ownerName || 'معلم'}
             </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-bold text-gray-900 border-r-4 border-orange-500 pr-3">الوصف</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>
        </div>
        
        {/* AdSense Bottom Inside Detail */}
        <AdSensePlaceholder format="rectangle" className="h-40 bg-gray-50/50 mt-6 shadow-inner border-gray-100/60" />

        {/* Contact Actions */}
        {listing.phone && (
          <div className="grid grid-cols-2 gap-4 pt-6">
            <a 
              href={`tel:${listing.phone}`}
              className="flex items-center justify-center gap-2 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-transform active:scale-95"
            >
              <Phone size={20} />
              اتصل الآن
            </a>
            <a 
              href={`https://wa.me/${listing.phone.startsWith('0') ? '212' + listing.phone.substring(1) : listing.phone}?text=${encodeURIComponent('السلام عليكم، مهتم بإعلانك في سوق المعلم: ' + listing.title + '\nالرابط: ' + window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-bold rounded-2xl hover:bg-[#20ba59] transition-transform active:scale-95"
            >
              <MessageCircle size={20} />
              واتساب
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}
