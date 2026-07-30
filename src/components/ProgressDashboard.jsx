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

  // Calculate totals exactly as specified
  const totalInitials = 21;
  const totalFinals = 36;
  const totalTones = 4;
  const totalSyllables = 1600;
  const totalTonePairs = 20;
  const totalSpellingRules = 4;
  const totalSandhiRules = 3;

  const totalItems = totalInitials + totalFinals + totalTones + totalSyllables + totalTonePairs + totalSpellingRules + totalSandhiRules;

  // Calculate current progress based on max level 3 (Level 4 is bonus/exam)
  const calculateCategoryProgress = (category, totalItemsCount) => {
    if (!progress || !progress[category]) return 0;
    let currentScore = 0;
    Object.keys(progress[category]).forEach(key => {
      currentScore += Math.min(3, progress[category][key]);
    });
    const maxScore = totalItemsCount * 3;
    if (maxScore === 0) return 0;
    
    const pct = (currentScore / maxScore) * 100;
    if (pct > 0 && pct < 1) return pct.toFixed(2);
    return Math.round(pct);
  };

  const calculateOverallProgress = () => {
    if (!progress) return 0;
    let currentScore = 0;
    
    ['initials', 'finals', 'tones', 'syllables', 'tonePairs', 'spellingRules', 'sandhiRules'].forEach(cat => {
      if (progress[cat]) {
        Object.keys(progress[cat]).forEach(key => {
          currentScore += Math.min(3, progress[cat][key]);
        });
      }
    });
    
    const maxScore = totalItems * 3;
    if (maxScore === 0) return 0;
    
    const pct = (currentScore / maxScore) * 100;
    if (pct > 0 && pct < 1) return pct.toFixed(2);
    return Math.round(pct);
  };

  const initialProgress = calculateCategoryProgress('initials', totalInitials);
  const finalProgress = calculateCategoryProgress('finals', totalFinals);
  const toneProgress = calculateCategoryProgress('tones', totalTones);
  const syllableProgress = calculateCategoryProgress('syllables', totalSyllables);
  const tonePairProgress = calculateCategoryProgress('tonePairs', totalTonePairs);
  const spellingProgress = calculateCategoryProgress('spellingRules', totalSpellingRules);
  const sandhiProgress = calculateCategoryProgress('sandhiRules', totalSandhiRules);
  const overallProgress = calculateOverallProgress();

  // --- LOGIC CHO MODAL VÒNG TRÒN DƯỚI CÙNG (NHÓM THEO LEVEL) ---
  const getItemsForLevel = (level) => {
    const items = [];
    if (!progress) return items;
    
    ['initials', 'finals', 'tones', 'syllables', 'tonePairs', 'spellingRules', 'sandhiRules'].forEach(cat => {
      if (progress[cat]) {
        Object.entries(progress[cat]).forEach(([key, val]) => {
          if (val === level) {
            items.push({ category: cat, item: key });
          }
        });
      }
    });
    return items;
  };

  // --- LOGIC CHO MODAL CARD PROGRESS (NHÓM THEO THỂ LOẠI) ---
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getItemsForCategory = (catKey) => {
    const items = [];
    if (!progress || !progress[catKey]) return items;
    
    Object.entries(progress[catKey]).forEach(([key, val]) => {
      items.push({ item: key, level: val });
    });
    // Sắp xếp theo level giảm dần
    return items.sort((a, b) => b.level - a.level);
  };

  const ProgressCard = ({ title, percentage, color, icon, catKey }) => (
    <div 
      onClick={() => setSelectedCategory({ title, key: catKey })}
      className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer active:scale-95"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-lg">
            {icon}
          </div>
          <span className="font-bold text-slate-700">{title}</span>
        </div>
        <div className="text-lg font-black text-slate-800">{percentage}%</div>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );

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
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full bg-slate-100 rounded-2xl shadow-sm border border-slate-200 overflow-hidden my-4">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <ProgressCard title="Thanh mẫu" percentage={initialProgress} color="bg-rose-500" icon="🔤" catKey="initials" />
          <ProgressCard title="Vận mẫu" percentage={finalProgress} color="bg-blue-500" icon="🅰️" catKey="finals" />
          <ProgressCard title="Thanh điệu" percentage={toneProgress} color="bg-amber-500" icon="🎵" catKey="tones" />
          <ProgressCard title="Ghép vần (Syllables)" percentage={syllableProgress} color="bg-purple-500" icon="🧩" catKey="syllables" />
          <ProgressCard title="Quy tắc chính tả" percentage={spellingProgress} color="bg-teal-500" icon="📝" catKey="spellingRules" />
          <ProgressCard title="Quy tắc biến điệu" percentage={sandhiProgress} color="bg-orange-500" icon="⚡" catKey="sandhiRules" />
          <ProgressCard title="Ma trận âm điệu" percentage={tonePairProgress} color="bg-indigo-500" icon="📊" catKey="tonePairs" />
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

      {/* MODAL CHI TIẾT THEO LEVEL (Vòng tròn) */}
      {selectedLevel !== null && (() => {
        const items = getItemsForLevel(selectedLevel);
        
        const itemsByCategory = items.reduce((acc, curr) => {
          if (!acc[curr.category]) acc[curr.category] = [];
          acc[curr.category].push(curr.item);
          return acc;
        }, {});
        
        return (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setSelectedLevel(null)}>
            <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TreeIcon level={selectedLevel} />
                  <div>
                    <h3 className="text-xl font-black text-slate-800">
                      Cây cấp độ {selectedLevel}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">{items.length} mục đã đạt cấp độ này</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLevel(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  {['initials', 'finals', 'tones', 'syllables', 'tonePairs', 'spellingRules', 'sandhiRules'].map(cat => (
                    <div key={cat}>
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-3">
                        {cat === 'initials' ? 'Thanh mẫu' : 
                         cat === 'finals' ? 'Vận mẫu' : 
                         cat === 'tones' ? 'Thanh điệu' : 
                         cat === 'tonePairs' ? 'Ma trận âm điệu' : 
                         cat === 'spellingRules' ? 'Quy tắc chính tả' : 
                         cat === 'sandhiRules' ? 'Quy tắc biến điệu' : 'Ghép vần (Syllables)'} ({(itemsByCategory[cat] || []).length})
                      </h4>
                      {(itemsByCategory[cat] || []).length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {itemsByCategory[cat].map(item => (
                            <span key={item} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg border border-blue-100">
                              {item === 'general' ? 'Quy tắc tổng quát' : item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-300 italic">Chưa có mục nào đạt cấp độ này.</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* MODAL CHI TIẾT THEO THỂ LOẠI (Click vào Card) */}
      {selectedCategory !== null && (() => {
        const items = getItemsForCategory(selectedCategory.key);
        
        return (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setSelectedCategory(null)}>
            <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    Chi tiết: {selectedCategory.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    Đã học {items.length} mục
                  </p>
                </div>
                <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {items.length === 0 ? (
                  <div className="text-center text-slate-400 font-medium py-8">
                    Chưa học mục nào trong phần này.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {items.map(i => (
                      <div key={i.item} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-700">
                          {i.item === 'general' ? 'Tổng quát' : i.item}
                        </span>
                        <div className="scale-75 origin-left">
                          <TreeIcon level={i.level} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
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
