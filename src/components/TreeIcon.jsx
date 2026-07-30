import React from 'react';
import { Leaf, Sprout, TreePine, Flower2, Apple } from 'lucide-react';

export default function TreeIcon({ level, className = "" }) {
  // Level 0: Hạt giống (Mới học)
  // Level 1: Mầm non (Đã ôn 1 lần)
  // Level 2: Cây nhỏ (Đã ôn vài lần)
  // Level 3: Cây nở hoa (Đã ghi nhớ)
  // Level 4: Cây có quả (Đã thi qua)
  
  const getIconAndColor = () => {
    switch(level) {
      case 1:
        return { Icon: Leaf, color: "text-emerald-400", title: "Mầm non (Level 1)" };
      case 2:
        return { Icon: Sprout, color: "text-emerald-500", title: "Cây nhỏ (Level 2)" };
      case 3:
        return { Icon: Flower2, color: "text-pink-500", title: "Cây nở hoa (Level 3)" };
      case 4:
        return { Icon: Apple, color: "text-rose-500", title: "Cây có quả (Level 4 - Đã thi)" };
      case 0:
      default:
        return { Icon: null, color: "text-slate-300", title: "Hạt giống (Mới học)" };
    }
  };

  const { Icon, color, title } = getIconAndColor();

  if (!Icon) {
    return (
      <div 
        className={`w-3 h-3 rounded-full bg-slate-200 border border-slate-300 ${className}`} 
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
