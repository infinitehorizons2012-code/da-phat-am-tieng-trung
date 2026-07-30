import React from 'react';
import { Leaf, Sprout, Apple } from 'lucide-react';

const CustomFlower = ({ size = 16, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Cánh hoa màu hồng */}
    <path className="stroke-pink-500" d="M6.1 15.3a8.3 8.3 0 0 1-2.9-2.2c-1.3-1.6-1.5-3.6-.5-5a3.8 3.8 0 0 1 5-.5c1.4-1 3.4-1.2 5 .1a8.3 8.3 0 0 1 2.2 2.9"/>
    <path className="stroke-pink-500" d="M17.9 8.7a8.3 8.3 0 0 1 2.9 2.2c1.3 1.6 1.5 3.6.5 5a3.8 3.8 0 0 1-5 .5c-1.4 1-3.4 1.2-5-.1a8.3 8.3 0 0 1-2.2-2.9"/>
    {/* Thân và lá màu xanh lục */}
    <path className="stroke-emerald-500" d="M12 12V22"/>
    <path className="stroke-emerald-500" d="M12 22c2.2-1 3-3 3-5"/>
    <path className="stroke-emerald-500" d="M12 22c-2.2-1-3-3-3-5"/>
  </svg>
);

export default function TreeIcon({ level, className = "" }) {
  // Level 0: Hạt giống (Mới học)
  // Level 1: Mầm non (Đã ôn 1 lần)
  // Level 2: Cây nhỏ (Đã ôn vài lần)
  // Level 3: Cây nở hoa (Đã ghi nhớ)
  // Level 4: Cây có quả (Đã thi qua)
  
  const getIconAndColor = () => {
    if (level === undefined) return { Icon: 'none', color: "", title: "" };
    
    switch(level) {
      case 1:
        return { Icon: Leaf, color: "text-emerald-400", title: "Mầm non (Level 1)" };
      case 2:
        return { Icon: Sprout, color: "text-emerald-500", title: "Cây nhỏ (Level 2)" };
      case 3:
        return { Icon: CustomFlower, color: "", title: "Cây nở hoa (Level 3)" };
      case 4:
        return { Icon: Apple, color: "text-rose-500", title: "Cây có quả (Level 4 - Đã thi)" };
      case 0:
      default:
        return { Icon: null, color: "", title: "Hạt giống (Mới học)" };
    }
  };

  const { Icon, color, title } = getIconAndColor();

  if (Icon === 'none') {
    return null;
  }

  if (!Icon) {
    return (
      <div 
        className={`w-3 h-3 rounded-[40%_60%_60%_40%/50%_50%_50%_50%] bg-amber-600 border border-amber-700 shadow-sm rotate-45 ${className}`} 
        title={title}
      />
    );
  }

  return (
    <div title={title} className={`${color} ${className}`}>
      <Icon size={16} strokeWidth={2.5} />
    </div>
  );
}
