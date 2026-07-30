import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { initialsData, finalsData, tonesData } from '../data/summaryData';
import { pinyinMatrix } from '../data/pinyinData';
import TreeIcon from './TreeIcon';
import { X } from 'lucide-react';

export default function ProgressDashboard() {
  const { progress, getLevel, loading } = useProgress();
  const [selectedLevel, setSelectedLevel] = useState(null);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-bold">Đang tải tiến độ...</div>;
  }

  // Calculate totals
  const totalInitials = initialsData.reduce((acc, curr) => acc + curr.items.length, 0);
  const totalFinals = finalsData.reduce((acc, curr) => acc + curr.items.length, 0);
  const totalTones = tonesData.length;
  
  // Calculate how many syllables exist in Pinyin matrix
  let totalSyllables = 0;
  Object.keys(pinyinMatrix).forEach(initial => {
    Object.keys(pinyinMatrix[initial]).forEach(final => {
      if (pinyinMatrix[initial][final]) {
        totalSyllables += 4; // 4 tones per syllable
      }
    });
  });

  const totalItems = totalInitials + totalFinals + totalTones + totalSyllables;

  // Calculate current progress based on max level 3 (Level 4 is bonus/exam)
  const calculateCategoryProgress = (category, totalItemsCount) => {
    if (!progress || !progress[category]) return 0;
    
    let currentScore = 0;
    // We iterate through all keys in the category that the user has interacted with
    Object.keys(progress[category]).forEach(key => {
      currentScore += Math.min(3, progress[category][key]); // Max 3 points per item for completion
    });
    
    const maxScore = totalItemsCount * 3;
    if (maxScore === 0) return 0;
    
    return Math.round((currentScore / maxScore) * 100);
  };

  const calculateOverallProgress = () => {
    if (!progress) return 0;
    let currentScore = 0;
    
    ['initials', 'finals', 'tones', 'syllables'].forEach(cat => {
      if (progress[cat]) {
        Object.keys(progress[cat]).forEach(key => {
          currentScore += Math.min(3, progress[cat][key]);
        });
      }
    });
    
    const maxScore = totalItems * 3;
    if (maxScore === 0) return 0;
    return Math.round((currentScore / maxScore) * 100);
  };

  const initialProgress = calculateCategoryProgress('initials', totalInitials);
  const finalProgress = calculateCategoryProgress('finals', totalFinals);
  const toneProgress = calculateCategoryProgress('tones', totalTones);
  const syllableProgress = calculateCategoryProgress('syllables', totalSyllables);
  const overallProgress = calculateOverallProgress();

  const getTreeCountByLevel = (level) => {
    if (!progress) return 0;
    let count = 0;
    ['initials', 'finals', 'tones', 'syllables', 'tonePairs', 'spellingRules', 'sandhiRules'].forEach(cat => {
      if (progress[cat]) {
        Object.values(progress[cat]).forEach(val => {
          if (val === level) count++;
        });
      }
    });
    return count;
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden my-4">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            🌳 Khu Vườn Pinyin Của Bé
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Mỗi lần học bài, bé sẽ gieo một hạt giống. Trả lời đúng nhiều lần, hạt giống sẽ nảy mầm và nở hoa!
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-emerald-500">{overallProgress}%</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Hoàn thành</div>
        </div>
      </div>

      <div className="p-6 overflow-y-auto hide-scrollbar flex-1 bg-slate-50/50">
        
        {/* Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProgressCard title="Thanh mẫu" percentage={initialProgress} color="bg-rose-500" icon="🔤" />
          <ProgressCard title="Vận mẫu" percentage={finalProgress} color="bg-blue-500" icon="🅰️" />
          <ProgressCard title="Thanh điệu" percentage={toneProgress} color="bg-amber-500" icon="🎵" />
          <ProgressCard title="Ghép vần (Syllables)" percentage={syllableProgress} color="bg-purple-500" icon="🧩" />
        </div>

        {/* Garden Stats */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 uppercase tracking-wider text-center">Thống Kê Vườn Cây</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatBox level={0} count={getTreeCountByLevel(0)} onClick={() => setSelectedLevel(0)} />
            <StatBox level={1} count={getTreeCountByLevel(1)} onClick={() => setSelectedLevel(1)} />
            <StatBox level={2} count={getTreeCountByLevel(2)} onClick={() => setSelectedLevel(2)} />
            <StatBox level={3} count={getTreeCountByLevel(3)} onClick={() => setSelectedLevel(3)} />
            <StatBox level={4} count={getTreeCountByLevel(4)} onClick={() => setSelectedLevel(4)} />
          </div>
        </div>
      </div>

      {selectedLevel !== null && (
        <DetailsModal 
          level={selectedLevel} 
          progress={progress} 
          onClose={() => setSelectedLevel(null)} 
        />
      )}
    </div>
  );
}

function ProgressCard({ title, percentage, color, icon }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
      <div className="flex justify-between items-center mb-3">
        <div className="font-bold text-slate-700 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </div>
        <div className="font-black text-slate-800">{percentage}%</div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div className={`${color} h-3 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function StatBox({ level, count, onClick }) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 hover:border-emerald-200"
      onClick={onClick}
    >
      <TreeIcon level={level} className="scale-150 mb-3" />
      <div className="text-2xl font-black text-slate-700">{count}</div>
      <div className="text-xs text-slate-400 font-bold uppercase mt-1">Cây</div>
      <div className="text-[10px] text-blue-400 mt-2 hover:underline">Xem chi tiết</div>
    </div>
  );
}

function DetailsModal({ level, progress, onClose }) {
  const getLevelName = (lvl) => {
    switch(lvl) {
      case 0: return "Hạt giống (Chưa học)";
      case 1: return "Mầm non (Level 1)";
      case 2: return "Cây nhỏ (Level 2)";
      case 3: return "Cây nở hoa (Level 3)";
      case 4: return "Cây có quả (Level 4 - Đã thi)";
      default: return "";
    }
  };

  const getCategoryName = (cat) => {
    switch(cat) {
      case 'initials': return "Thanh mẫu";
      case 'finals': return "Vận mẫu";
      case 'tones': return "Thanh điệu";
      case 'syllables': return "Ghép vần (Syllables)";
      case 'tonePairs': return "Cặp thanh điệu (Biến điệu)";
      case 'spellingRules': return "Quy tắc chính tả";
      case 'sandhiRules': return "Quy tắc biến điệu";
      default: return cat;
    }
  };

  const itemsByCategory = {};
  if (progress) {
    Object.keys(progress).forEach(cat => {
      const items = [];
      Object.entries(progress[cat]).forEach(([key, val]) => {
        if (val === level) items.push(key);
      });
      if (items.length > 0) {
        itemsByCategory[cat] = items;
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <TreeIcon level={level} className="scale-125" />
            <h3 className="text-xl font-black text-slate-800">
              {getLevelName(level)}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto hide-scrollbar flex-1 bg-slate-50/50">
          {Object.keys(itemsByCategory).length === 0 ? (
            <div className="text-center text-slate-400 font-medium py-8">
              Chưa có mục nào ở cấp độ này.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.keys(itemsByCategory).map(cat => (
                <div key={cat} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                    {getCategoryName(cat)} ({itemsByCategory[cat].length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {itemsByCategory[cat].map(item => (
                      <span key={item} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg border border-blue-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
