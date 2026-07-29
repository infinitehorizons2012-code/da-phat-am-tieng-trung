import React from 'react';
import { applyTone, playPinyinAudio } from '../utils/pinyinUtils';

export default function PinyinCell({ syllable, onActivate, isActive, isPlaying, listenCount, onTonePlayed }) {
  if (!syllable) {
    return <td className="pinyin-cell empty" />;
  }

  const handleToneClick = (e, tone) => {
    e.stopPropagation();
    const textToRead = applyTone(syllable, tone);
    playPinyinAudio(textToRead);
    onTonePlayed();
  };

  const tones = [
    { num: 1, label: applyTone(syllable, 1) },
    { num: 2, label: applyTone(syllable, 2) },
    { num: 3, label: applyTone(syllable, 3) },
    { num: 4, label: applyTone(syllable, 4) }
  ];

  // Calculate background color based on listenCount
  // 0: default, >0: varying shades of emerald
  let bgClass = '';
  if (isPlaying) {
    bgClass = 'bg-orange-100 font-bold transform scale-110 shadow-md text-orange-700 z-10 relative';
  } else if (isActive) {
    bgClass = 'bg-rose-100 font-bold transform scale-105 shadow-sm text-rose-700 z-10 relative';
  } else if (listenCount > 0) {
    if (listenCount === 1) bgClass = 'bg-emerald-50/50 text-emerald-700';
    else if (listenCount === 2) bgClass = 'bg-emerald-100 text-emerald-800';
    else if (listenCount === 3) bgClass = 'bg-emerald-200 text-emerald-900';
    else bgClass = 'bg-emerald-300 text-emerald-950 font-bold';
  } else {
    bgClass = 'hover:bg-slate-50 text-slate-700';
  }

  return (
    <td 
      className={`pinyin-cell ${bgClass} transition-all duration-300 cursor-pointer p-2 relative text-sm sm:text-base`}
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
        playPinyinAudio(applyTone(syllable, 1));
        onTonePlayed();
      }}
    >
      <span>{syllable}</span>
      
      {isActive && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-slate-200 flex p-1 gap-1 z-50">
          <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45"></div>
          {tones.map(t => (
            <button 
              key={t.num} 
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 hover:text-rose-600 font-bold text-slate-700 transition-colors text-sm" 
              onClick={(e) => handleToneClick(e, t.num)}
              title={`Thanh ${t.num}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </td>
  );
}
