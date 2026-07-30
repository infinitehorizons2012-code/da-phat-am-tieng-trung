import React, { useState } from 'react';
import PinyinTable from './components/PinyinTable';
import TonePairPractice from './components/TonePairPractice';
import QuizMode from './components/QuizMode';
import ToneMatrix from './components/ToneMatrix';
import { Volume2, Play, Grid, Headphones, LayoutGrid } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('table');

  return (
    <div className="flex bg-slate-50 font-sans text-slate-800 h-screen w-full">
      <div className="flex-1 w-full grid h-dvh min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden pb-0">
        
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-rose-500 text-white flex items-center justify-center font-bold shadow-sm">
              拼
            </div>
            <div>
              <h1 className="font-black text-slate-800 text-lg md:text-xl tracking-tight leading-none">Bảng Pinyin</h1>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Bảng ghép pinyin tiếng Trung</div>
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('table')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-md transition-colors ${activeTab === 'table' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Grid size={16} />
              <span className="hidden sm:inline">Tra cứu</span>
            </button>
            <button 
              onClick={() => setActiveTab('tone-matrix')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-md transition-colors ${activeTab === 'tone-matrix' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutGrid size={16} />
              <span className="hidden sm:inline">Ma trận âm điệu</span>
            </button>
            <button 
              onClick={() => setActiveTab('tone-pair')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-md transition-colors ${activeTab === 'tone-pair' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Volume2 size={16} />
              <span className="hidden sm:inline">Luyện Ghép</span>
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-md transition-colors ${activeTab === 'quiz' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Headphones size={16} />
              <span className="hidden sm:inline">Trắc nghiệm</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="min-h-0 flex flex-col w-full mx-auto max-w-none overflow-hidden animate-in fade-in duration-300">
          <div className="flex min-h-0 flex-1 flex-col">
            
            {activeTab === 'table' ? (
              <>
                {/* Legend (Chú giải) */}
                <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    Thanh mẫu (hàng trên)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Vận mẫu (cột trái)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-orange-500" />
                    Bấm ô để nghe & chọn thanh điệu
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-emerald-500" />
                    Bấm tiêu đề hàng/cột để Auto Play
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-flex h-2.5 w-16 rounded-full overflow-hidden ring-1 ring-slate-200" style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.10), rgba(16,185,129,0.55))' }}></span>
                    Đã nghe (nhạt → đậm)
                  </span>
                </div>

                {/* Table Area */}
                <div className="mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border-y border-slate-200 bg-slate-50 shadow-sm sm:rounded-2xl sm:border mx-4">
                  <PinyinTable />
                </div>
              </>
            ) : activeTab === 'tone-matrix' ? (
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 flex items-start justify-center">
                <div className="w-full max-w-6xl h-full flex">
                  <ToneMatrix />
                </div>
              </div>
            ) : activeTab === 'tone-pair' ? (
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100 flex items-start justify-center">
                <div className="w-full max-w-5xl">
                  <TonePairPractice />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-100">
                <QuizMode />
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}

export default App;
