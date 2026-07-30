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
        <button
          onClick={() => setActiveTab('spelling')}
          className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-black transition-colors ${activeTab === 'spelling' ? 'text-rose-600 bg-white border-b-2 border-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          Quy Tắc Chính Tả
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

        {/* QUY TẮC CHÍNH TẢ */}
        {activeTab === 'spelling' && (
          <div className="animate-in fade-in duration-300 pb-8">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-rose-800 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-rose-800 rounded-full"></div>
                拼写规则 — Quy Tắc Chính Tả (Spelling Rules)
              </h2>
              <p className="text-slate-500 mt-2 text-base font-medium ml-4 max-w-4xl">
                Đây là các luật biến đổi chữ viết để tránh nhầm lẫn khi đọc và gõ phím, dù bản chất phát âm trong miệng không hề thay đổi.
              </p>
            </div>

            <div className="flex flex-col gap-6 ml-4 max-w-4xl">
              
              {/* Rule 1 */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="text-xl font-black text-rose-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-sm">1</span>
                  Luật ẩn hai chấm của "ü"
                </h3>
                <div className="text-slate-700 mb-4 font-medium">
                  Khi nhóm <strong className="text-rose-700">j, q, x</strong> kết hợp với <strong className="text-rose-700">ü</strong> (hoặc các vần bắt đầu bằng ü), ta bắt buộc phải bỏ hai dấu chấm trên đầu đi và viết thành <strong>u</strong>.
                </div>
                <div className="bg-white p-4 rounded-xl font-mono font-bold text-rose-600 text-center mb-3 shadow-inner">
                  j / q / x + ü → ju, qu, xu
                </div>
                <div className="text-sm text-slate-500 italic flex gap-2">
                  <span className="text-rose-500 font-bold">Mẹo:</span> 
                  Nhóm j, q, x không bao giờ đi chung với chữ u (u tròn môi), nên cứ thấy u đứng sau j, q, x thì tự động hiểu nó là phát âm ü (chu môi).
                </div>
              </div>

              {/* Rule 2 */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="text-xl font-black text-blue-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">2</span>
                  Luật thêm/biến đổi "y" (Khi bắt đầu bằng i)
                </h3>
                <div className="text-slate-700 mb-4 font-medium">
                  Nếu một âm tiết không có phụ âm đầu mà lại bắt đầu bằng chữ <strong className="text-blue-700">i</strong>, ta không được viết chữ i đứng chơ vơ ở đầu, mà phải thêm <strong>y</strong> hoặc biến <strong>i</strong> thành <strong>y</strong>.
                </div>
                <div className="bg-white p-4 rounded-xl font-mono font-bold text-blue-600 text-center shadow-inner">
                  i → yi, &nbsp;ia → ya, &nbsp;ie → ye, &nbsp;iao → yao, &nbsp;iu → you,<br/>
                  ian → yan, &nbsp;in → yin, &nbsp;iang → yang, &nbsp;ing → ying, &nbsp;iong → yong
                </div>
              </div>

              {/* Rule 3 */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="text-xl font-black text-emerald-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">3</span>
                  Luật thêm/biến đổi "w" (Khi bắt đầu bằng u)
                </h3>
                <div className="text-slate-700 mb-4 font-medium">
                  Tương tự, nếu âm tiết không có phụ âm đầu mà bắt đầu bằng chữ <strong className="text-emerald-700">u</strong>, ta phải thêm <strong>w</strong> hoặc biến <strong>u</strong> thành <strong>w</strong>.
                </div>
                <div className="bg-white p-4 rounded-xl font-mono font-bold text-emerald-600 text-center shadow-inner">
                  u → wu, &nbsp;ua → wa, &nbsp;uo → wo, &nbsp;uai → wai,<br/>
                  ui → wei, &nbsp;uan → wan, &nbsp;un → wen, &nbsp;uang → wang
                </div>
              </div>

              {/* Rule 4 */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 sm:p-6 shadow-sm">
                <h3 className="text-xl font-black text-purple-800 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">4</span>
                  ∅ (Zero Initial - Không có phụ âm đầu)
                </h3>
                <div className="text-slate-700 font-medium">
                  Ký hiệu ∅ dùng để chỉ những âm tiết phát ra thẳng từ nguyên âm mà không cần phụ âm cản lại phía trước (như các chữ bắt đầu bằng <strong className="text-purple-700">a, o, e</strong> ví dụ: ai, ou, en...). Việc sinh ra thêm y và w ở trên chính là để xử lý cho các trường hợp "không có phụ âm đầu" mà lại vướng chữ i, u, ü.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
