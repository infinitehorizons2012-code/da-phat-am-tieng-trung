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
      
      {isActive && (
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 w-max z-50 overflow-hidden cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-100">
            <div className="text-[10px] font-black tracking-wider text-slate-400 flex items-center gap-1.5 uppercase">
              {initial && final ? `${initial} + ${final}` : syllable}
              {audioSource && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-emerald-500 lowercase">Nguồn: {audioSource}</span>
                </>
              )}
            </div>
            <button 
              className="text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-200 p-1 -mr-2"
              onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose(); 
              }}
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>

          {/* Tone Buttons */}
          <div className="flex gap-2 p-3 sm:p-4 bg-white">
            {tones.map(t => {
              const level = getLevel('syllables', syllable + t.num);
              return (
                <button 
                  key={t.num} 
                  className="relative flex flex-col items-center justify-center min-w-[3.5rem] h-16 sm:w-16 sm:h-20 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors border border-slate-100 hover:border-rose-200 hover:text-rose-600 group" 
                  onClick={(e) => handleToneClick(e, t.num)}
                  title={`Thanh ${t.num}`}
                >
                  <TreeIcon level={level} className="absolute top-1 right-1 scale-75" />
                  <span className="text-lg sm:text-xl font-black text-slate-700 group-hover:text-rose-600 leading-none mb-1 mt-2">{t.label}</span>
                  <Volume2 size={14} className="text-slate-300 group-hover:text-rose-400" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </td>
  );
}
