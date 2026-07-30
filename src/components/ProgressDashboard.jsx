import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { initialsData, finalsData, tonesData } from '../data/summaryData';
import { pinyinMatrix } from '../data/pinyinData';
import TreeIcon from './TreeIcon';
import { X } from 'lucide-react';

export default function ProgressDashboard() {
  const { progress, getLevel, getGlobalProgressPercentage, loading } = useProgress();
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
    let currentScore = 0;
    let learnedItems = 0;
    if (progress && progress[category]) {
      Object.keys(progress[category]).forEach(key => {
        const val = progress[category][key];
        currentScore += Math.min(3, val);
        if (val > 0) learnedItems++;
      });
    }
    const maxScore = totalItemsCount * 3;
    let pct = 0;
    if (maxScore > 0) {
      pct = (currentScore / maxScore) * 100;
      if (pct > 0 && pct < 1) pct = Number(pct.toFixed(2));
      else pct = Math.round(pct);
    }
    
    return {
      percentage: pct,
      learned: learnedItems,
      total: totalItemsCount,
      score: currentScore,
      maxScore: maxScore
    };
  };

  const overallProgress = getGlobalProgressPercentage();

  const initStats = calculateCategoryProgress('initials', totalInitials);
  const finStats = calculateCategoryProgress('finals', totalFinals);
  const toneStats = calculateCategoryProgress('tones', totalTones);
  const sylStats = calculateCategoryProgress('syllables', totalSyllables);
  const pairStats = calculateCategoryProgress('tonePairs', totalTonePairs);
  const spellStats = calculateCategoryProgress('spellingRules', totalSpellingRules);
  const sandhiStats = calculateCategoryProgress('sandhiRules', totalSandhiRules);

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

  const ProgressCard = ({ title, stats, color, icon, catKey }) => (
    <div 
      onClick={() => setSelectedCategory({ title, key: catKey })}
      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer active:scale-95"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-lg">
            {icon}
          </div>
          <span className="font-bold text-slate-700">{title}</span>
        </div>
        <div className="text-lg font-black text-slate-800">{stats.percentage}%</div>
      </div>
      
      <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-2">
        <span>Đã học: <span className="font-bold text-slate-700">{stats.learned}/{stats.total}</span></span>
        <span>Điểm: <span className="font-bold text-slate-700">{stats.score}/{stats.maxScore}</span></span>
      </div>

      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${stats.percentage}%` }}></div>
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

  const [activeTab, setActiveTab] = useState('categories'); // 'categories', 'levels'

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col h-full bg-slate-100 rounded-2xl shadow-sm border border-slate-200 overflow-hidden my-4">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            🌳 Khu Vườn Pinyin Của Bé
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Mỗi lần làm trắc nghiệm, bé sẽ gieo một hạt giống. Trả lời đúng nhiều lần, hạt giống sẽ nảy mầm và nở hoa!
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-emerald-500">{overallProgress}%</div>
          <div className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Tổng Tiến Độ</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white">
        <button
          className={`flex-1 py-4 text-center font-bold text-sm sm:text-base transition-colors ${
            activeTab === 'categories' ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          onClick={() => setActiveTab('categories')}
        >
          Theo Danh Mục
        </button>
        <button
          className={`flex-1 py-4 text-center font-bold text-sm sm:text-base transition-colors ${
            activeTab === 'levels' ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          onClick={() => setActiveTab('levels')}
        >
          Phân Loại Hạt / Cây
        </button>
        <button
          className={`flex-1 py-4 text-center font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'exam' ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          onClick={() => setActiveTab('exam')}
        >
          🍎 Thi Cuối Kỳ
        </button>
        <button
          className={`flex-1 py-4 text-center font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'rules' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
          onClick={() => setActiveTab('rules')}
        >
          📖 Luật Chơi
        </button>
      </div>

      <div className="p-6 overflow-y-auto hide-scrollbar flex-1 bg-slate-50/50">
        
        {activeTab === 'categories' && (
          /* Progress Bars */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ProgressCard title="Thanh mẫu" stats={initStats} color="bg-rose-500" icon="🔤" catKey="initials" />
            <ProgressCard title="Vận mẫu" stats={finStats} color="bg-blue-500" icon="🅰️" catKey="finals" />
            <ProgressCard title="Thanh điệu" stats={toneStats} color="bg-amber-500" icon="🎵" catKey="tones" />
            <ProgressCard title="Ghép vần (Syllables)" stats={sylStats} color="bg-purple-500" icon="🧩" catKey="syllables" />
            <ProgressCard title="Quy tắc chính tả" stats={spellStats} color="bg-teal-500" icon="📝" catKey="spellingRules" />
            <ProgressCard title="Quy tắc biến điệu" stats={sandhiStats} color="bg-orange-500" icon="⚡" catKey="sandhiRules" />
            <ProgressCard title="Ma trận âm điệu" stats={pairStats} color="bg-indigo-500" icon="📊" catKey="tonePairs" />
          </div>
        )}
        
        {activeTab === 'levels' && (
          /* Garden Stats */
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
        )}

        {activeTab === 'exam' && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full relative overflow-hidden">
               {/* Decorative background circle */}
               <div className="absolute -top-16 -right-16 w-32 h-32 bg-rose-100 rounded-full opacity-50"></div>
               <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-100 rounded-full opacity-50"></div>
               
               <h3 className="text-2xl font-black text-rose-600 mb-4 flex items-center justify-center gap-2 relative z-10">
                 <TreeIcon level={4} /> Kỳ Thi Cuối Kỳ (Ra Quả)
               </h3>
               <p className="text-slate-600 mb-6 text-sm sm:text-base relative z-10 font-medium">
                 Bé cần đạt <span className="font-bold text-emerald-600">100% tiến độ khu vườn</span> (tất cả các cây đều nở hoa) để mở khóa Kỳ thi Cuối kỳ nhé!
                 <br/><br/>
                 Khi thi đậu (đạt 70%), bé sẽ nhận được <span className="font-bold text-rose-600">quả táo đỏ</span> (level 5). Nhưng nếu sai, những phần đó sẽ <span className="font-bold text-amber-600">tụt điểm xuống mầm non</span> (level 2) đấy nhé!
               </p>
               
               <div className="relative z-10">
                 <button 
                    onClick={() => {
                      if (overallProgress < 100) {
                        alert("Bé cần đạt 100% tiến độ khu vườn (tất cả các cây đều nở hoa) để mở khóa Kỳ thi Cuối kỳ nhé!");
                      } else {
                        window.dispatchEvent(new CustomEvent('start-final-exam'));
                      }
                    }}
                    className={`px-8 py-4 rounded-xl font-black transition-all ${
                      overallProgress >= 100 
                        ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 cursor-pointer animate-pulse w-full text-lg' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed w-full border border-slate-200'
                    }`}
                  >
                    {overallProgress >= 100 ? '🚀 BẮT ĐẦU THI NGAY' : '🔒 CHƯA ĐỦ ĐIỀU KIỆN THI'}
                  </button>
                  {overallProgress < 100 && (
                    <div className="mt-3 text-xs font-bold text-slate-400 uppercase">
                      Tiến độ hiện tại: {overallProgress}% / 100%
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-black text-blue-700 mb-6 flex items-center gap-3">
                <span className="text-3xl">📖</span> Hướng Dẫn Luật Chơi & Trắc Nghiệm
              </h3>
              
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xl font-bold">1</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Gieo Hạt & Chăm Cây</h4>
                    <p>Mỗi một kiến thức bé học (thanh mẫu, vận mẫu, quy tắc...) tương ứng với một hạt giống trong khu vườn. Khi bé trả lời đúng 3 lần liên tiếp trong phần Trắc Nghiệm, hạt giống sẽ được nâng lên 1 cấp (Hạt giống ➞ Mầm non ➞ Cây trưởng thành ➞ Nở hoa).</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl font-bold">2</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Thuật Toán Trắc Nghiệm Thông Minh (Spaced Repetition)</h4>
                    <p>Hệ thống trắc nghiệm không ra câu hỏi ngẫu nhiên mà <strong>ưu tiên hỏi những từ bé chưa thuộc</strong> (cây ở cấp độ thấp) và <strong>rất ít hỏi lại những từ đã nở hoa</strong>. Thuật toán lặp lại ngắt quãng này giúp bé tập trung thời gian vào những kiến thức còn yếu, tối ưu hóa quá trình học.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 shrink-0 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xl font-bold">3</div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Kỳ Thi Cuối Kỳ & Thu Hoạch Quả</h4>
                    <p>Khi <strong>toàn bộ khu vườn đều nở hoa (Tiến độ 100%)</strong>, bé sẽ được mở khóa Kỳ Thi Cuối Kỳ. Bài thi sẽ kiểm tra tổng hợp toàn bộ kiến thức trong vòng 20 phút. Nếu bé đạt từ 70% trở lên, các cây sẽ ra <strong>Quả Táo Đỏ (Cấp 5)</strong>. Tuy nhiên, nếu bé trả lời sai câu nào, cây đó sẽ bị <strong>tụt điểm về Mầm non (Cấp 2)</strong> và bé sẽ phải ôn lại để được thi tiếp!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
        
        let totalItemsInCategory = 0;
        switch (selectedCategory.key) {
          case 'initials': totalItemsInCategory = totalInitials; break;
          case 'finals': totalItemsInCategory = totalFinals; break;
          case 'tones': totalItemsInCategory = totalTones; break;
          case 'syllables': totalItemsInCategory = totalSyllables; break;
          case 'tonePairs': totalItemsInCategory = totalTonePairs; break;
          case 'spellingRules': totalItemsInCategory = totalSpellingRules; break;
          case 'sandhiRules': totalItemsInCategory = totalSandhiRules; break;
          default: totalItemsInCategory = 0;
        }
        
        const maxScore = totalItemsInCategory * 3;
        const currentScore = items.reduce((acc, curr) => acc + Math.min(3, curr.level), 0);
        
        return (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={() => setSelectedCategory(null)}>
            <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    Chi tiết: {selectedCategory.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-3 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      Đã học {items.length}/{totalItemsInCategory} mục
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Đạt {currentScore}/{maxScore} điểm
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {items.length === 0 && selectedCategory.key !== 'initials' && selectedCategory.key !== 'finals' ? (
                  <div className="text-center text-slate-400 font-medium py-8">
                    Chưa học mục nào trong phần này.
                  </div>
                ) : (
                  (selectedCategory.key === 'initials' || selectedCategory.key === 'finals') ? (() => {
                    const groupData = selectedCategory.key === 'initials' ? initialsData : finalsData;
                    return (
                      <div className="space-y-6">
                        {groupData.map(group => {
                          const groupItems = items.filter(i => group.items.includes(i.item));
                          const groupMaxScore = group.items.length * 3;
                          const groupCurrentScore = groupItems.reduce((acc, curr) => acc + Math.min(3, curr.level), 0);
                          return (
                            <div key={group.title}>
                              <div className="flex justify-between items-end mb-2 border-b border-slate-100 pb-1">
                                <h4 className="text-sm font-black text-slate-600 uppercase tracking-wider">{group.title}</h4>
                                <div className="text-xs font-bold text-slate-400">
                                  {groupItems.length}/{group.items.length} mục • {groupCurrentScore}/{groupMaxScore} đ
                                </div>
                              </div>
                              {groupItems.length > 0 ? (
                                <div className="flex flex-wrap gap-3 mt-3">
                                  {groupItems.map(i => (
                                    <div key={i.item} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                                      <span className="font-bold text-slate-700">{i.item}</span>
                                      <div className="scale-75 origin-left"><TreeIcon level={i.level} /></div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-slate-300 italic mt-2">Chưa học mục nào trong nhóm này.</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })() : (
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
                  )
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
