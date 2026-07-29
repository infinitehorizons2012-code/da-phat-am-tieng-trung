import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { parsePinyinString, applyToneSandhi, playContinuousSequence, applyTone } from '../utils/pinyinUtils';

export default function TonePairPractice() {
  const [inputText, setInputText] = useState('ni3 hao3 yi1 ge4 bu4 hao3');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [tokens, setTokens] = useState([]);

  // Hàm xử lý và phát
  const handlePlay = () => {
    if (!inputText.trim()) return;
    
    // Parse và áp dụng biến điệu
    const parsedTokens = parsePinyinString(inputText);
    const finalTokens = applyToneSandhi(parsedTokens);
    setTokens(finalTokens);
    
    setIsPlaying(true);
    setPlayingIndex(0);
    
    playContinuousSequence(
      finalTokens,
      (index) => {
        setPlayingIndex(index);
      },
      () => {
        setIsPlaying(false);
        setPlayingIndex(-1);
      }
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-2 mx-4 sm:mx-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Play size={16} className="ml-0.5" />
        </div>
        <div>
          <h2 className="font-black text-slate-800 text-lg">Luyện Kết Hợp Thanh Điệu</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Tự động phát hiện và áp dụng quy tắc biến điệu</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Nhập pinyin kèm số, ví dụ: ni3 hao3 yi1 ding4"
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handlePlay();
          }}
        />
        <button
          onClick={handlePlay}
          disabled={isPlaying || !inputText.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors shadow-sm"
        >
          {isPlaying ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Đang Đọc...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play size={18} fill="currentColor" className="opacity-90" />
              Nghe Thử
            </span>
          )}
        </button>
      </div>

      {tokens.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2 sm:gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
          {tokens.map((token, idx) => {
            const isSandhi = token.tone !== token.displayTone;
            const isPlayingThis = playingIndex === idx;
            
            return (
              <div 
                key={idx} 
                className={`flex flex-col items-center justify-center p-3 min-w-[5rem] rounded-xl transition-all duration-300 ${
                  isPlayingThis 
                    ? 'bg-rose-500 text-white shadow-md scale-105 transform -translate-y-1' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">
                  {token.raw}
                </div>
                <div className={`text-xl font-black ${isPlayingThis ? 'text-white' : 'text-slate-800'}`}>
                  {applyTone(token.base, token.displayTone === 5 ? 1 : token.displayTone)}
                </div>
                {isSandhi && (
                  <div className={`mt-1.5 text-[9px] font-bold flex items-center gap-1 px-1.5 py-0.5 rounded ${
                    isPlayingThis ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                  }`} title={`Biến điệu từ thanh ${token.tone} thành thanh ${token.displayTone}`}>
                    <RotateCcw size={10} />
                    Biến điệu
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
