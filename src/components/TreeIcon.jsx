import React from 'react';
import { Leaf, Sprout, Flower2, Apple } from 'lucide-react';

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
        return { Icon: Flower2, color: "text-pink-500", title: "Cây nở hoa (Level 3)", isFlower: true };
      case 4:
        return { Icon: Apple, color: "text-rose-500", title: "Cây có quả (Level 4 - Đã thi)" };
      case 0:
      default:
        return { Icon: null, color: "", title: "Hạt giống (Mới học)" };
    }
  };

  const { Icon, color, title, isFlower } = getIconAndColor();

  if (Icon === 'none') {
    return null;
  }

  if (!Icon) {
    // Level 0: Seed
    return (
      <div 
        className={`w-3 h-3 rounded-[40%_60%_60%_40%/50%_50%_50%_50%] bg-[#8B5A2B] border border-[#6B4226] shadow-sm rotate-45 ${className}`} 
        title={title}
      />
    );
  }

  if (isFlower) {
    // Render a stacked icon: green leaves underneath, pink flower on top
    return (
      <div title={title} className={`relative flex items-center justify-center ${className}`} style={{ width: 16, height: 16 }}>
        <Leaf size={14} className="text-emerald-500 absolute -bottom-1 -left-1" strokeWidth={2.5} />
        <Icon size={16} className="text-pink-500 absolute top-0 right-0 z-10" strokeWidth={2.5} />
      </div>
    );
  }

  return (
    <div title={title} className={`${color} ${className}`}>
      <Icon size={16} strokeWidth={2.5} />
    </div>
  );
}
