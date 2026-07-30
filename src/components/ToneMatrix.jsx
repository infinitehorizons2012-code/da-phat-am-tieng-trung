import React, { useState } from 'react';
import { toneMatrixData, matrixRowHeaders, matrixColHeaders } from '../data/toneMatrixData';
import { playContinuousSequence, stopAudio } from '../utils/pinyinUtils';
import { Volume2, Info } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import TreeIcon from './TreeIcon';

export default function ToneMatrix() {
  const [activeCell, setActiveCell] = useState(null); // { row, col }
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioSource, setAudioSource] = useState('');
  
  const { getLevel } = useProgress();

  const handleCellClick = (cellData) => {
    // Nếu đang phát cùng ô đó thì dừng
    if (activeCell && activeCell.row === cellData.row && activeCell.col === cellData.col && isPlaying) {
      stopAudio();
      setIsPlaying(false);
      setActiveCell(null);
      setAudioSource('');
      return;
    }

    setActiveCell({ row: cellData.row, col: cellData.col });
    setIsPlaying(true);
    setAudioSource('Đang kết nối...');

    playContinuousSequence(
      cellData.tokens,
      null, // onProgress
      () => { // onComplete
        setIsPlaying(false);
        setActiveCell(null);
        setAudioSource('');
      },
      (source) => {
        setAudioSource(source);
      }
    );
  };

  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full relative">
      
      {/* Header section */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-6 bg-rose-600 rounded-full"></div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Giao diện ma trận âm điệu</h2>
          </div>
          <p className="text-slate-500 text-sm">Chọn từng ô thanh điệu bất kỳ để xem phân tích và luyện nghe giọng bản địa.</p>
          {audioSource && (
            <div className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1.5 bg-blue-50 w-fit px-2 py-1 rounded-md border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Nguồn âm thanh: {audioSource}
            </div>
          )}
        </div>
        
        <div className="flex gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-100 border border-rose-200"></span>
            Thanh 1-4
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-200"></span>
            Thanh 5 (Thanh nhẹ)
          </div>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="p-4 sm:p-6 overflow-auto bg-slate-50 flex-1 hide-scrollbar">
        <div className="min-w-[800px]">
          
          {/* Cột Header (Top) */}
          <div className="grid grid-cols-[140px_repeat(5,1fr)] gap-3 mb-3">
            {/* Ô trống góc trái trên cùng */}
            <div className="flex flex-col items-start justify-center pl-4 pb-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Thanh 1</div>
              <div className="text-xs font-black text-rose-500 uppercase tracking-widest flex items-center gap-1">
                <span className="text-[10px]">✦</span> THANH 2
              </div>
            </div>
            
            {/* Các cột Thanh 1->5 */}
            {matrixColHeaders.map((col, idx) => (
              <div key={col.id} className={`flex flex-col items-center justify-center p-3 rounded-xl border ${idx === 4 ? 'bg-yellow-50/50 border-yellow-100/50' : 'bg-rose-50/30 border-rose-100/30'} shadow-sm`}>
                <div className={`text-sm font-black ${idx === 4 ? 'text-yellow-700' : 'text-slate-700'}`}>{col.label}</div>
                <div className={`text-xs mt-1 ${idx === 4 ? 'text-yellow-600/70' : 'text-slate-400'}`}>{col.description}</div>
              </div>
            ))}
          </div>

          {/* Các hàng dữ liệu */}
          <div className="flex flex-col gap-3">
            {toneMatrixData.map((row, rIndex) => (
              <div key={rIndex} className="grid grid-cols-[140px_repeat(5,1fr)] gap-3">
                
                {/* Tiêu đề hàng */}
                <div className="flex flex-col items-start justify-center pl-4 pr-2">
                  <div className="text-sm font-black text-rose-600">{matrixRowHeaders[rIndex].label}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-tight">{matrixRowHeaders[rIndex].description}</div>
                </div>

                {/* Các ô dữ liệu */}
                {row.map((cell, cIndex) => {
                  const isActive = activeCell && activeCell.row === cell.row && activeCell.col === cell.col;
                  const isNeutral = cIndex === 4;
                  const level = getLevel('tonePairs', `${cell.row}-${cell.col}`);
                  
                  // Style logic based on state
                  let containerClass = "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer overflow-hidden group min-h-[100px]";
                  
                  if (isActive) {
                    containerClass += " bg-rose-600 border-rose-600 text-white shadow-md scale-[1.02]";
                  } else {
                    containerClass += " bg-white hover:border-rose-300 hover:shadow-md";
                    containerClass += isNeutral ? " border-slate-100" : " border-slate-100";
                  }

                  return (
                    <div 
                      key={`${cell.row}-${cell.col}`} 
                      className={containerClass}
                      onClick={() => handleCellClick(cell)}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                      )}
                      
                      <TreeIcon level={level} className="absolute top-2 left-2" />
                      
                      {/* Biểu tượng phát âm thanh (chỉ hiện khi hover hoặc active) */}
                      {!isActive && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Volume2 size={14} className="text-slate-300" />
                        </div>
                      )}
                      
                      <div className={`text-2xl font-black mb-1 ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {cell.hanzi}
                      </div>
                      <div className={`text-sm font-bold mb-1 ${isActive ? 'text-white' : 'text-rose-600'}`}>
                        {cell.pinyin}
                      </div>
                      <div className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                        Thanh {cell.row}-{cell.col}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
        </div>
      </div>
      
    </div>
  );
}
