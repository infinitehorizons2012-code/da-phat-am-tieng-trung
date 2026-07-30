import React from 'react';
import { applyTone, playPinyinAudio } from '../utils/pinyinUtils';
import { Volume2, X } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import TreeIcon from './TreeIcon';

export default function PinyinCell({ initial, final, syllable, onActivate, onClose, isActive, isPlaying, listenCount, onTonePlayed }) {
  const [audioSource, setAudioSource] = React.useState('');
  const { getLevel } = useProgress();

  if (!syllable) {
    return <td className="pinyin-cell empty" />;
  }

  const handleToneClick = (e, tone) => {
    e.stopPropagation();
    const textToRead = applyTone(syllable, tone);
    playPinyinAudio(textToRead, null, setAudioSource);
    onTonePlayed();
  };

  const tones = [
    { num: 1, label: applyTone(syllable, 1) },
    { num: 2, label: applyTone(syllable, 2) },
    { num: 3, label: applyTone(syllable, 3) },
    { num: 4, label: applyTone(syllable, 4) }
  ];

  let bgClass = '';
  if (isPlaying) {
    bgClass = 'bg-orange-100 font-bold shadow-md text-orange-700 z-10 relative';
  } else if (isActive) {
    bgClass = 'bg-rose-50 font-bold shadow-sm text-rose-700 z-40 relative';
  } else if (listenCount > 0) {
    if (listenCount === 1) bgClass = 'bg-emerald-50/70 text-emerald-700';
    else if (listenCount === 2) bgClass = 'bg-emerald-100/80 text-emerald-800';
    else if (listenCount === 3) bgClass = 'bg-emerald-200/90 text-emerald-900';
    else bgClass = 'bg-emerald-300 text-emerald-950 font-bold';
  } else {
    bgClass = 'hover:bg-slate-50 text-slate-700';
  }

  // Tính trung bình level của 4 thanh điệu
  let avgLevel = undefined;
  if (syllable) {
    let totalScore = 0;
    let hasStudied = false;
    for (let i = 1; i <= 4; i++) {
      const tLevel = getLevel('syllables', syllable + i);
      if (tLevel !== undefined) {
        hasStudied = true;
        totalScore += tLevel;
      }
    }
    if (hasStudied) {
      avgLevel = Math.round(totalScore / 4);
    }
  }

  return (
    <td 
      className={`pinyin-cell ${bgClass} transition-colors duration-200 cursor-pointer p-2 sm:p-3 relative text-sm sm:text-base border border-transparent hover:border-slate-200`}
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
        playPinyinAudio(applyTone(syllable, 1), null, setAudioSource);
        onTonePlayed();
      }}
    >
      <span className={isActive ? 'font-black' : ''}>{syllable}</span>
      
      {/* Icon trung bình của âm tiết */}
      {avgLevel !== undefined && (
        <TreeIcon level={avgLevel} className="absolute bottom-0 right-0 sm:bottom-0.5 sm:right-0.5 scale-50 opacity-80" />
      )}
      
      {isActive && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40"
          onClick={(e) => {
            e.stopPropagation();
            if (onClose) onClose();
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden cursor-default w-full max-w-sm animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-100">
              <div className="text-[10px] sm:text-xs font-black tracking-wider text-slate-400 flex items-center gap-2 uppercase">
                {initial && final ? `${initial} + ${final}` : syllable}
                {audioSource && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="text-emerald-500 lowercase">Nguồn: {audioSource}</span>
                  </>
                )}
              </div>
              <button 
                className="text-slate-400 hover:text-rose-500 transition-colors rounded-full hover:bg-slate-200 p-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onClose) onClose(); 
                }}
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            {/* Tone Buttons */}
            <div className="flex justify-between gap-2 p-5 bg-white">
              {tones.map(t => {
                const level = getLevel('syllables', syllable + t.num);
                return (
                  <button 
                    key={t.num} 
                    className="relative flex flex-col items-center justify-center w-[4.5rem] h-20 sm:w-20 sm:h-24 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-all border border-slate-100 hover:border-rose-200 hover:shadow-sm group" 
                    onClick={(e) => handleToneClick(e, t.num)}
                    title={`Thanh ${t.num}`}
                  >
                    <TreeIcon level={level} className="absolute top-1.5 right-1.5 scale-75" />
                    <span className="text-2xl sm:text-3xl font-black text-slate-700 group-hover:text-rose-600 leading-none mb-1 mt-2">{t.label}</span>
                    <Volume2 size={16} className="text-slate-300 group-hover:text-rose-400 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </td>
  );
}
