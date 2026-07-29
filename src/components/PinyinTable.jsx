import React, { useState, useEffect } from 'react';
import { initials, finals, pinyinMatrix } from '../data/pinyinData';
import PinyinCell from './PinyinCell';
import FilterBar from './FilterBar';
import { playAudioSequence, stopAudio, applyTone } from '../utils/pinyinUtils';

export default function PinyinTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterInitial, setFilterInitial] = useState('all');
  const [activeCell, setActiveCell] = useState(null);
  const [listenCounts, setListenCounts] = useState({});
  const [playingCell, setPlayingCell] = useState(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveCell(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleTonePlayed = (cellId) => {
    setListenCounts(prev => ({
      ...prev,
      [cellId]: (prev[cellId] || 0) + 1
    }));
  };

  const playSequence = (syllablesData) => {
    // syllablesData = [{ cellId, text }, ...]
    stopAudio();
    setActiveCell(null);
    
    if (syllablesData.length === 0) return;
    
    const texts = syllablesData.map(s => applyTone(s.text, 1));
    
    playAudioSequence(
      texts,
      (index) => {
        const cellId = syllablesData[index].cellId;
        setPlayingCell(cellId);
        handleTonePlayed(cellId);
      },
      () => {
        setPlayingCell(null);
      }
    );
  };

  const playInitialColumn = (initId) => {
    const sequence = [];
    finals.forEach(final => {
      const syllable = pinyinMatrix[initId]?.[final];
      if (syllable && isCellMatched(syllable)) {
        sequence.push({ cellId: `${initId}-${final}`, text: syllable });
      }
    });
    playSequence(sequence);
  };

  const playFinalRow = (final) => {
    const sequence = [];
    displayedInitials.forEach(init => {
      const syllable = pinyinMatrix[init.id]?.[final];
      if (syllable && isCellMatched(syllable)) {
        sequence.push({ cellId: `${init.id}-${final}`, text: syllable });
      }
    });
    playSequence(sequence);
  };

  const displayedInitials = filterInitial === 'all' 
    ? initials 
    : initials.filter(i => i.id === filterInitial);

  const isCellMatched = (syllable) => {
    if (!syllable) return false;
    if (!searchQuery) return true;
    return syllable.toLowerCase().includes(searchQuery.toLowerCase().trim());
  };

  return (
    <div className="flex flex-col flex-1 h-full max-w-full">
      <FilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterInitial={filterInitial}
        onFilterInitialChange={setFilterInitial}
      />
      
      <div className="overflow-auto flex-1 bg-white border-t border-slate-200">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-30 bg-slate-100 border-b-2 border-r-2 border-slate-200 p-2 shadow-sm">
                <span className="text-xs text-slate-500 font-bold block">Vận mẫu \ Thanh mẫu</span>
              </th>
              {displayedInitials.map(init => (
                <th 
                  key={init.id}
                  className="sticky top-0 z-20 bg-slate-50 border-b-2 border-slate-200 border-l border-slate-100 p-2 text-rose-600 font-black cursor-pointer hover:bg-rose-50 shadow-sm"
                  onClick={() => playInitialColumn(init.id)}
                  title="Click để Auto Play cột này"
                >
                  {init.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {finals.map(final => (
              <tr key={final} className="hover:bg-slate-50/50">
                <td 
                  className="sticky left-0 z-10 bg-slate-50 border-r-2 border-slate-200 border-t border-slate-100 p-2 text-emerald-600 font-black cursor-pointer hover:bg-emerald-50 shadow-sm"
                  onClick={() => playFinalRow(final)}
                  title="Click để Auto Play hàng này"
                >
                  {final}
                </td>
                {displayedInitials.map(init => {
                  const syllable = pinyinMatrix[init.id]?.[final];
                  const cellId = `${init.id}-${final}`;
                  const isMatch = isCellMatched(syllable);
                  const displaySyllable = (searchQuery && !isMatch) ? '' : syllable;

                  return (
                    <PinyinCell 
                      key={init.id}
                      initial={init.id}
                      final={final}
                      syllable={displaySyllable}
                      isActive={activeCell === cellId}
                      isPlaying={playingCell === cellId}
                      listenCount={listenCounts[cellId] || 0}
                      onActivate={() => {
                        stopAudio();
                        setPlayingCell(null);
                        setActiveCell(cellId);
                      }}
                      onTonePlayed={() => handleTonePlayed(cellId)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
