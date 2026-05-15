import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { ChevronLeft, Camera, Phone, Type, MessageSquare, AlertCircle } from 'lucide-react';
import AdSensePlaceholder from './AdSensePlaceholder';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function AddListing({ type }: { type: 'product' | 'service' | 'course' | 'inquiry' }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    phone: '',
    city: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    if (!formData.title || !formData.description || !formData.phone || !formData.city) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError(null);

    const pathForWrite = 'listings';
    try {
      const docRef = await addDoc(collection(db, pathForWrite), {
        ...formData,
        type,
        ownerId: auth.currentUser.uid,
        ownerName: auth.currentUser.displayName,
        ownerPhoto: auth.currentUser.photoURL,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active'
      });
      navigate(`/listing/${docRef.id}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, pathForWrite);
      setError('حدث خطأ أثناء حفظ المعلومات. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const titleMap = {
    product: 'إضافة منتج للبيع',
    service: 'إضافة خدمة',
    course: 'إضافة دورة تكوينية',
    inquiry: 'طرح استشكال أو سؤال'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white min-h-[calc(100vh-140px)]"
    >
      <div className="flex items-center justify-between mb-8 mt-2">
        <h2 className="text-2xl font-black text-[#5C4033]">
          {type === 'product' ? 'أضف منتج' : type === 'service' ? 'أضف خدمة' : type === 'course' ? 'أضف دورة' : 'طرح استشكال'}
        </h2>
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
          <span className="font-bold text-xl leading-none -mt-0.5">×</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <input 
              type="text" 
              placeholder={type === 'inquiry' ? "عنوان الاستشكال (مثال: سؤال حول النجارة) *" : "اسم الخدمة أو المنتج *"}
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-400 font-bold"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <input 
                type="text" 
                placeholder="السعر"
                className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400 font-bold"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <input 
                type="text" 
                placeholder="المدينة *"
                className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400 font-bold"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
              />
            </div>
          </div>

          <div className="relative border-2 border-[#FFD700] rounded-2xl p-4 bg-[#FFFAEB] mt-6">
             <div className="absolute -top-3 right-4 bg-red-400 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                إجباري!
             </div>
             <label className="text-md font-black text-[#5C4033] flex items-center justify-between gap-2 mb-3">
               رقم الهاتف
               <Phone size={18} fill="currentColor" />
             </label>
             <input 
                type="tel" 
                placeholder="06 xx xx xx xx"
                className="w-full p-3.5 bg-[#FFF2C2] text-center text-gray-700 tracking-widest font-black text-lg border border-[#FFE885] rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
             />
          </div>

          <div className="space-y-1 mt-6">
            <textarea 
              rows={4}
              placeholder={type === 'inquiry' ? "اشرح استشكالك أو سؤالك بالتفصيل..." : "تفاصيل الخدمة..."}
              className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none placeholder:text-gray-400 font-bold"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="text-left mt-2 flex flex-col items-start gap-2">
            <label className="text-sm font-bold text-gray-900">
               صورة (اختياري)
            </label>
            <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100" />
          </div>

        </div>

        <button 
          disabled={loading}
          className="w-full py-4 mt-6 bg-[#0E8A42] text-white font-black rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 text-lg"
        >
          {loading ? 'جاري النشر...' : 'نشر الخدمة'}
        </button>
      </form>
      
      {/* Bottom AdSense in Form */}
      <div className="mt-8">
         <AdSensePlaceholder format="rectangle" className="h-[250px] bg-gray-50 border border-gray-100 shadow-sm" />
      </div>
    </motion.div>
  );
}
