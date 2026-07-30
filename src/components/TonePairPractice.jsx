import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { parsePinyinString, applyToneSandhi, playContinuousSequence, applyTone } from '../utils/pinyinUtils';
import { commonDictionary } from '../data/dictionaryData';

export default function TonePairPractice() {
  const [inputText, setInputText] = useState('ni3 hao3 yi1 ge4 bu4 hao3');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(-1);
  const [groups, setGroups] = useState([]);
  const [globalTokens, setGlobalTokens] = useState([]);

  // Hàm nhóm các token thành cụm từ có nghĩa
  const groupTokens = (tokens) => {
    const result = [];
    let i = 0;
    
    while (i < tokens.length) {
      let matched = false;
      
      // Tìm cụm dài nhất có thể (từ 4 âm xuống 2 âm)
      for (let len = 4; len >= 2; len--) {
        if (i + len <= tokens.length) {
          const slice = tokens.slice(i, i + len);
          const searchKey = slice.map(t => t.raw.toLowerCase()).join(' ');
          
          if (commonDictionary[searchKey]) {
            result.push({
              type: 'meaningful',
              meaning: commonDictionary[searchKey],
              tokens: slice
            });
            i += len;
            matched = true;
            break;
          }
        }
      }
      
      // Nếu không khớp cụm nào, coi là 1 âm đơn lẻ không có nghĩa
      if (!matched) {
        result.push({
          type: 'meaningless',
          meaning: 'Không có nghĩa',
          tokens: [tokens[i]]
        });
        i += 1;
      }
    }
    return result;
  };

  // Hàm xử lý và phát (Toàn bộ)
  const handlePlayAll = () => {
    if (!inputText.trim()) return;
    
    const parsedTokens = parsePinyinString(inputText);
    const finalTokens = applyToneSandhi(parsedTokens);
    
    // Gán index toàn cục để highlight đúng
    const tokensWithIndex = finalTokens.map((t, idx) => ({ ...t, globalIndex: idx }));
    
    setGlobalTokens(tokensWithIndex);
    setGroups(groupTokens(tokensWithIndex));
    
    setIsPlaying(true);
    setPlayingIndex(0);
    
    playContinuousSequence(
      tokensWithIndex,
      (index) => {
        setPlayingIndex(index);
      },
      () => {
        setIsPlaying(false);
        setPlayingIndex(-1);
      }
    );
  };

  // Phát 1 cụm riêng lẻ
  const handlePlayGroup = (groupTokensList) => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Tìm index toàn cục của token đầu tiên trong cụm
    if (groupTokensList.length > 0) {
      setPlayingIndex(groupTokensList[0].globalIndex);
    }
    
    playContinuousSequence(
      groupTokensList,
      (localIndex) => {
        // Ánh xạ local index về global index
        setPlayingIndex(groupTokensList[localIndex].globalIndex);
      },
      () => {
        setIsPlaying(false);
        setPlayingIndex(-1);
      }
    );
  };

  // Nút tách cụm nhưng không phát (cho enter hoặc edit)
  const handleParseOnly = () => {
    if (!inputText.trim()) return;
    const parsedTokens = parsePinyinString(inputText);
    const finalTokens = applyToneSandhi(parsedTokens);
    const tokensWithIndex = finalTokens.map((t, idx) => ({ ...t, globalIndex: idx }));
    setGlobalTokens(tokensWithIndex);
    setGroups(groupTokens(tokensWithIndex));
  };

  // Gọi parse lần đầu khi component mount
  React.useEffect(() => {
    handleParseOnly();
  }, []);

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
          onChange={(e) => {
            setInputText(e.target.value);
          }}
          onBlur={handleParseOnly}
          placeholder="Nhập pinyin kèm số, ví dụ: ni3 hao3 yi1 ding4"
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-mono"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handlePlayAll();
          }}
        />
        <button
          onClick={handlePlayAll}
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
              Nghe Toàn Bộ
            </span>
          )}
        </button>
      </div>

      {groups.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
          {groups.map((group, groupIdx) => {
            const isMeaningful = group.type === 'meaningful';
            return (
              <div key={groupIdx} className={`flex flex-col rounded-xl overflow-hidden shadow-sm border ${isMeaningful ? 'border-emerald-200' : 'border-slate-200'}`}>
                {/* Dải tiêu đề của cụm */}
                <div className={`flex items-center justify-between px-3 py-1.5 ${isMeaningful ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                  <span className={`text-[11px] font-bold ${isMeaningful ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {group.meaning}
                  </span>
                  <button
                    onClick={() => handlePlayGroup(group.tokens)}
                    disabled={isPlaying}
                    className={`p-1 rounded-md transition-colors ${
                      isMeaningful 
                        ? 'text-emerald-600 hover:bg-emerald-100 disabled:opacity-50' 
                        : 'text-slate-500 hover:bg-slate-200 disabled:opacity-50'
                    }`}
                    title="Nghe cụm này"
                  >
                    <Play size={14} className="ml-0.5" />
                  </button>
                </div>
                
                {/* Các âm tiết trong cụm */}
                <div className="flex gap-1.5 p-2 bg-white items-stretch">
                  {group.tokens.map((token) => {
                    const isSandhi = token.tone !== token.displayTone;
                    const isPlayingThis = playingIndex === token.globalIndex;
                    
                    return (
                      <div 
                        key={token.globalIndex} 
                        className={`flex flex-col items-center justify-center p-2 min-w-[4rem] rounded-lg transition-all duration-300 ${
                          isPlayingThis 
                            ? 'bg-rose-500 text-white shadow-md scale-105' 
                            : 'bg-slate-50 text-slate-700 border border-slate-100'
                        }`}
                      >
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">
                          {token.raw}
                        </div>
                        <div className={`text-lg font-black ${isPlayingThis ? 'text-white' : 'text-slate-800'}`}>
                          {applyTone(token.base, token.displayTone === 5 ? 1 : token.displayTone)}
                        </div>
                        {isSandhi && (
                          <div className={`mt-1 text-[8px] font-bold flex items-center gap-0.5 px-1 py-0.5 rounded ${
                            isPlayingThis ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                          }`} title={`Biến điệu từ thanh ${token.tone} thành thanh ${token.displayTone}`}>
                            <RotateCcw size={8} />
                            Biến điệu
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
