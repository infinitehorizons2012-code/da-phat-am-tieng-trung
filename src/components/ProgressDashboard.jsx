import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { initialsData, finalsData, tonesData } from '../data/summaryData';
import { pinyinMatrix } from '../data/pinyinData';
import TreeIcon from './TreeIcon';

export default function ProgressDashboard() {
  const { progress, getLevel, loading } = useProgress();

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
            <StatBox level={0} count={getTreeCountByLevel(0)} />
            <StatBox level={1} count={getTreeCountByLevel(1)} />
            <StatBox level={2} count={getTreeCountByLevel(2)} />
            <StatBox level={3} count={getTreeCountByLevel(3)} />
            <StatBox level={4} count={getTreeCountByLevel(4)} />
          </div>
        </div>

      </div>
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

function StatBox({ level, count }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
      <TreeIcon level={level} className="scale-150 mb-3" />
      <div className="text-2xl font-black text-slate-700">{count}</div>
      <div className="text-xs text-slate-400 font-bold uppercase mt-1">Cây</div>
    </div>
  );
}
