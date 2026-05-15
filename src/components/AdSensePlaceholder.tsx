import { motion } from 'motion/react';

interface AdSenseProps {
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdSensePlaceholder({ format = 'auto', className = '' }: AdSenseProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center p-4 min-h-[100px] ${className}`}>
      {/* Decorative Shimmer Effect to make it look active/loading */}
      <motion.div 
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 z-0"
      />
      
      <div className="absolute top-0 left-4 bg-[#FFB900] text-white text-[9px] font-black px-2 py-0.5 rounded-b-md shadow-sm z-10 tracking-widest uppercase pb-1">
        إعلان
      </div>
      <div className="absolute top-0 right-4 bg-gray-300 text-gray-50 text-[8px] font-bold px-1.5 py-0.5 rounded-b z-10 font-mono tracking-widest pb-1 opacity-50">
        AdSense
      </div>
      
      <div className="text-center z-10 relative relative pointer-events-none">
        <div className="w-8 h-8 rounded-full border-2 border-gray-300 mx-auto mb-2 opacity-50 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-400">Ad</span>
        </div>
        <p className="text-sm font-bold text-gray-400">مساحة إعلانية Google AdSense</p>
        <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">{format} format</p>
      </div>
    </div>
  );
}
