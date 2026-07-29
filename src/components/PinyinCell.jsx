import React, { useState, useRef, useEffect } from 'react';
import { applyTone, playPinyinAudio } from '../utils/pinyinUtils';

export default function PinyinCell({ syllable, onActivate, isActive }) {
  if (!syllable) {
    return <td className="pinyin-cell empty" />;
  }

  const handleToneClick = (e, tone) => {
    e.stopPropagation();
    const textToRead = applyTone(syllable, tone);
    playPinyinAudio(textToRead);
  };

  const tones = [
    { num: 1, label: applyTone(syllable, 1) },
    { num: 2, label: applyTone(syllable, 2) },
    { num: 3, label: applyTone(syllable, 3) },
    { num: 4, label: applyTone(syllable, 4) }
  ];

  return (
    <td 
      className={`pinyin-cell ${isActive ? 'active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
        playPinyinAudio(applyTone(syllable, 1)); // Default play tone 1
      }}
    >
      {syllable}
      
      {isActive && (
        <div className="tone-popup">
          {tones.map(t => (
            <button 
              key={t.num} 
              className="tone-btn" 
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
