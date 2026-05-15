import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Send, LogIn, Users, Smile } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Picker from 'emoji-picker-react';

export default function ChatRoom() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(auth.currentUser);
  const [showPicker, setShowPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'global_chat'),
      where('channelId', '==', 'global'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs.reverse());
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, (error) => {
      console.error("Chat error", error);
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    const msg = newMessage;
    setNewMessage('');
    setShowPicker(false);
    try {
      await addDoc(collection(db, 'global_chat'), {
        text: msg,
        userId: user.uid,
        userName: user.displayName || 'حرفي',
        userPhoto: user.photoURL || '',
        channelId: 'global',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
  };

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] min-h-[500px] bg-gradient-to-br from-[#FFB6C1]/20 via-[#87CEEB]/20 to-[#98FB98]/30 rounded-[2rem] shadow-xl border-4 border-white overflow-hidden m-4 sm:m-0 backdrop-blur-sm relative">
      
      {/* MSN Header style */}
      <div className="bg-gradient-to-r from-[#FF69B4] via-[#00BFFF] to-[#32CD32] p-4 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-white/80 bg-white/20 flex items-center justify-center overflow-hidden relative">
             {user?.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
             ) : (
                <Users className="text-white" size={20} />
             )}
             <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#39FF14] rounded-full border-2 border-white shadow-[0_0_8px_#39FF14]"></div>
          </div>
          <div>
            <h2 className="font-black text-lg drop-shadow-md">دردشة الحرفيين</h2>
            <p className="text-[10px] font-bold opacity-90">متصل الآن ({messages.reduce((acc, m) => acc.add(m.userId), new Set()).size} أشخاص)</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-spin-slow">
           <div className="w-3 h-3 bg-[#39FF14] rounded-full shadow-[0_0_10px_#39FF14]"></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/40">
        {messages.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <Users size={48} className="text-[#00BFFF] mb-4" />
              <p className="font-bold">كن أول من يرسل رسالة!</p>
           </div>
        )}
        
        {messages.map((msg, idx) => {
          const isMe = user?.uid === msg.userId;
          // show different avatar if previous message was same user
          const showAvatar = idx === 0 || messages[idx - 1].userId !== msg.userId;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={msg.id} 
              className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              {showAvatar ? (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden border-2 border-white shadow-sm mt-1">
                    {msg.userPhoto ? (
                        <img src={msg.userPhoto} alt={msg.userName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#87CEEB] to-[#FFB6C1] flex items-center justify-center text-white font-bold text-xs">
                          {msg.userName?.[0]}
                        </div>
                    )}
                  </div>
              ) : (
                  <div className="w-8 h-8 flex-shrink-0"></div>
              )}
              
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                {showAvatar && (
                   <span className="text-[10px] text-gray-500 font-bold mb-1 mx-1">{msg.userName}</span>
                )}
                <div className={`px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    isMe 
                    ? 'bg-gradient-to-r from-[#00BFFF] to-[#87CEEB] text-white rounded-tr-sm' 
                    : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white/80 backdrop-blur-md border-t border-white shadow-[0_-5px_15px_rgba(0,0,0,0.05)] relative">
        <AnimatePresence>
          {showPicker && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="absolute bottom-full left-0 mb-4 z-50 origin-bottom-left"
            >
              <div className="shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
                <Picker 
                  onEmojiClick={onEmojiClick} 
                  autoFocusSearch={false}
                  width={300}
                  height={400}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {user ? (
          <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <button
               type="button"
               onClick={() => setShowPicker(!showPicker)}
               className={`p-3 rounded-full transition-colors ${showPicker ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} shadow-sm`}
            >
               <Smile size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="اكتب رسالة..."
              className="w-full bg-white border-2 border-gray-100 rounded-full py-3 px-5 pr-12 outline-none focus:border-[#87CEEB] transition-colors shadow-inner flex-1"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute left-1 top-1 w-10 h-10 bg-gradient-to-r from-[#39FF14] to-[#32CD32] rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              <Send size={18} className="mr-1" />
            </button>
          </form>
        ) : (
          <button 
            onClick={signIn}
            className="w-full py-3 bg-gradient-to-r from-[#FF69B4] to-[#00BFFF] text-white font-black rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <LogIn size={20} />
            سجل الدخول للمشاركة في الدردشة
          </button>
        )}
      </div>
    </div>
  );
}
