import React, { useState } from 'react';
import { initialsData, finalsData, tonesData } from '../data/summaryData';

export default function PinyinSummary() {
  const [activeTab, setActiveTab] = useState('initials'); // 'initials', 'finals', 'tones'

  const getColorClasses = (colorName) => {
    switch (colorName) {
      case 'rose': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'emerald': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'amber': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Sub-tabs Header */}
      <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
        <button
          onClick={() => setActiveTab('initials')}
          className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-black transition-colors ${activeTab === 'initials' ? 'text-rose-600 bg-white border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          Thanh Mẫu (Phụ Âm)
        </button>
        <button
          onClick={() => setActiveTab('finals')}
          className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-black transition-colors ${activeTab === 'finals' ? 'text-rose-600 bg-white border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          Vận Mẫu (Vần)
        </button>
        <button
          onClick={() => setActiveTab('tones')}
          className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-black transition-colors ${activeTab === 'tones' ? 'text-rose-600 bg-white border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          Thanh Điệu
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8 hide-scrollbar">
        
        {/* THANH MẪU */}
        {activeTab === 'initials' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-rose-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-rose-800 rounded-full"></div>
                声母 — Thanh Mẫu (Phụ Âm Đầu)
              </h2>
              <p className="text-slate-500 mt-2 text-base font-medium ml-4">
                23 phụ âm đầu, phân nhóm theo vị trí cấu âm trong miệng
              </p>
            </div>

            <div className="space-y-8 ml-4">
              {initialsData.map((group, idx) => (
                <div key={idx}>
                  <div className="text-sm font-bold text-rose-900 uppercase mb-3 flex items-center gap-2 tracking-wide">
                    {group.title} <span className="text-xs font-normal">({group.chinese})</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {group.items.map((item, i) => (
                      <div 
                        key={i} 
                        className={`w-14 h-12 flex items-center justify-center text-xl font-medium rounded-lg border ${getColorClasses(group.color)}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VẬN MẪU */}
        {activeTab === 'finals' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-rose-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-rose-800 rounded-full"></div>
                韵母 — Vận Mẫu (Phần Vần)
              </h2>
              <p className="text-slate-500 mt-2 text-base font-medium ml-4">
                Phân nhóm theo cấu trúc âm vị: đơn giản, kép, mũi
              </p>
            </div>

            <div className="space-y-8 ml-4">
              {finalsData.map((group, idx) => (
                <div key={idx}>
                  <div className="text-sm font-bold text-rose-900 uppercase mb-3 flex items-center gap-2 tracking-wide">
                    {group.title} {group.chinese && <span className="text-xs font-normal">({group.chinese})</span>} 
                    {group.desc && <span className="text-xs font-normal">— {group.desc}</span>}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {group.items.map((item, i) => (
                      <div 
                        key={i} 
                        className={`h-12 px-5 flex items-center justify-center text-xl font-medium rounded-lg border ${getColorClasses(group.color)}`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THANH ĐIỆU */}
        {activeTab === 'tones' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-rose-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-rose-800 rounded-full"></div>
                声调 — Thanh Điệu (Tones)
              </h2>
              <p className="text-slate-500 mt-2 text-base font-medium ml-4">
                4 thanh điệu chính + 1 thanh nhẹ (khinh thanh 轻声)
              </p>
            </div>

            <div className="flex flex-col gap-6 ml-4">
              {/* Row 1: Tones Info */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {tonesData.map((tone) => (
                  <div key={tone.number} className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-rose-800 text-white flex items-center justify-center font-bold mb-3 text-sm">
                      {tone.number}
                    </div>
                    <div className="text-4xl font-serif text-rose-800 mb-2">{tone.pinyin}</div>
                    <div className="text-xs font-bold text-rose-800 mb-4">Dấu: {tone.mark}</div>
                    <div className="text-sm font-bold text-slate-700 text-center mb-1">{tone.name}</div>
                    <div className="text-xs text-slate-500 text-center">{tone.desc}</div>
                  </div>
                ))}
              </div>

              {/* Row 2: Examples */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {tonesData.map((tone) => (
                  <div key={`ex-${tone.number}`} className="flex flex-col items-center justify-center p-4 border border-rose-100 rounded-xl bg-rose-50/50">
                    <div className="text-2xl font-black text-rose-800 mb-1">{tone.examplePinyin}</div>
                    <div className="text-xl text-slate-700 mb-1">{tone.exampleHanzi}</div>
                    <div className="text-xs text-slate-500">{tone.exampleMean}</div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}

      </div>
    </div>
  );
}
