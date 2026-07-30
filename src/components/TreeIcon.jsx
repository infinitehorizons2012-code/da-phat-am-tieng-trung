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
        return { Icon: null, color: "", title: "Cây nhỏ (Level 2)", isTree: true };
      case 3:
        return { Icon: Flower2, color: "text-pink-500", title: "Cây nở hoa (Level 3)", isFlower: true };
      case 4:
        return { Icon: Apple, color: "text-rose-500", title: "Cây có quả (Level 4 - Đã thi)" };
      case 0:
      default:
        return { Icon: null, color: "", title: "Hạt giống (Mới học)" };
    }
  };

  const { Icon, color, title, isFlower, isTree } = getIconAndColor();

  if (Icon === 'none') {
    return null;
  }

  if (isTree) {
    // Custom SVG cho cây nhỏ: Thân nâu, tán lá xanh
    return (
      <div title={title} className={`flex items-center justify-center ${className}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Thân cây (Nâu) */}
          <path d="M12 22V11" stroke="#8B4513" strokeWidth="3.5" strokeLinecap="round"/>
          {/* Tán cây (Xanh) */}
          <circle cx="12" cy="7" r="5" fill="#10b981"/>
          <circle cx="8" cy="11" r="4.5" fill="#10b981"/>
          <circle cx="16" cy="11" r="4.5" fill="#10b981"/>
        </svg>
      </div>
    );
  }

  if (!Icon) {
    // Level 0: Seed (Vàng cam)
    return (
      <div 
        className={`w-3 h-3 rounded-[40%_60%_60%_40%/50%_50%_50%_50%] bg-amber-500 border border-amber-600 shadow-sm rotate-45 ${className}`} 
        title={title}
      />
    );
  }

  if (isFlower) {
    // Custom SVG cho cây nở hoa: Cành và lá màu xanh, cánh hoa màu hồng
    return (
      <div title={title} className={`flex items-center justify-center ${className}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Cành cây */}
          <path d="M12 22V10" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
          {/* Lá trái */}
          <path d="M12 16C9.5 16 7.5 14 7.5 11.5C10 11.5 12 13.5 12 16Z" fill="#10b981"/>
          {/* Lá phải */}
          <path d="M12 18C14.5 18 16.5 16 16.5 13.5C14 13.5 12 15.5 12 18Z" fill="#10b981"/>
          {/* Cánh hoa */}
          <circle cx="12" cy="4.5" r="3.5" fill="#f472b6"/>
          <circle cx="16.5" cy="7.5" r="3.5" fill="#f472b6"/>
          <circle cx="14.5" cy="12" r="3.5" fill="#f472b6"/>
          <circle cx="9.5" cy="12" r="3.5" fill="#f472b6"/>
          <circle cx="7.5" cy="7.5" r="3.5" fill="#f472b6"/>
          {/* Nhụy hoa */}
          <circle cx="12" cy="8.5" r="3" fill="#fbbf24"/>
        </svg>
      </div>
    );
  }

  return (
    <div title={title} className={`${color} ${className}`}>
      <Icon size={16} strokeWidth={2.5} />
    </div>
  );
}
