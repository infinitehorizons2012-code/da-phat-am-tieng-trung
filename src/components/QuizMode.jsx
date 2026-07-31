import React, { useState, useEffect } from 'react';
import { generateQuizRound, generateRandomQuizRound, generateToneQuizRound, generateTonePairQuizRound, generateSpellingQuizRound } from '../data/quizData';
import { applyTone, playPinyinAudio, playContinuousSequence, applyToneSandhi } from '../utils/pinyinUtils';
import { pinyinMatrix } from '../data/pinyinData';
import { Headphones, Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, Target, Globe, Pencil, Zap, LifeBuoy } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export default function QuizMode() {
  const [mode, setMode] = useState('confusing'); // 'confusing' or 'all'
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [roundResults, setRoundResults] = useState([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [flyingXp, setFlyingXp] = useState([]);

  const { updateScore, progress, addXp, xp } = useProgress();

  // Khởi tạo vòng mới
  const startNewRound = (newMode = mode, count = questionCount) => {
    if (newMode === 'confusing') {
      setQuestions(generateQuizRound(count, progress));
    } else if (newMode === 'tone') {
      setQuestions(generateToneQuizRound(count, progress));
    } else if (newMode === 'tonepair') {
      setQuestions(generateTonePairQuizRound(count, progress));
    } else if (newMode === 'spelling') {
      setQuestions(generateSpellingQuizRound(count, progress));
    } else {
      setQuestions(generateRandomQuizRound(count, progress));
    }
    setCurrentIdx(0);
    setSelectedOption(null);
    setStats({ correct: 0, wrong: 0 });
    setIsFinished(false);
    setRoundResults([]);
  };

  useEffect(() => {
    startNewRound(mode, questionCount);
  }, []);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    startNewRound(newMode, questionCount);
  };

  const handleQuestionCountChange = (e) => {
    const newCount = parseInt(e.target.value);
    setQuestionCount(newCount);
    startNewRound(mode, newCount);
  };

  const currentQuestion = questions[currentIdx];

  const playAudio = () => {
    if (!currentQuestion || currentQuestion.isSpellingMode) return;
    if (isPlaying) return;
    setIsPlaying(true);
    
    if (currentQuestion.isTonePairMode) {
      // Logic phát 2 âm ghép nối tiếp có biến điệu
      const baseTokens = currentQuestion.correctWord.map((base, idx) => ({
        base,
        tone: currentQuestion.originalTones[idx],
        displayTone: currentQuestion.correctTones[idx]
      }));
      
      const tokensWithSandhi = applyToneSandhi(baseTokens);
      
      playContinuousSequence(tokensWithSandhi, null, () => setIsPlaying(false));
      
    } else {
      const textToRead = applyTone(currentQuestion.correctBase, currentQuestion.correctTone);
      playPinyinAudio(textToRead, () => setIsPlaying(false));
    }
  };

  const handleSelect = (index, isCorrect) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(index);
    
    if (isCorrect) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      addXp(30); // Cấp XP ngay lập tức để trẻ có feedback tức thì
      
      // Kích hoạt hiệu ứng bay XP
      const id = Date.now();
      setFlyingXp(prev => [...prev, id]);
      setTimeout(() => {
        setFlyingXp(prev => prev.filter(x => x !== id));
      }, 1000);
    } else {
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    // Tích lũy kết quả để cộng điểm năng lực cây trồng ở cuối vòng
    setRoundResults(prev => [...prev, {
      question: currentQuestion,
      isCorrect: isCorrect,
      currentMode: mode
    }]);
  };

  const handleRescue = () => {
    if (xp >= 120) {
      if (window.confirm("Bạn có muốn dùng 120 XP để làm lại câu này không?")) {
        addXp(-120);
        setSelectedOption(null);
        setStats(prev => ({ ...prev, wrong: Math.max(0, prev.wrong - 1) }));
        setRoundResults(prev => prev.slice(0, -1)); // Loại bỏ kết quả sai vừa lưu
      }
    } else {
      alert("Bạn không đủ XP để đổi cơ hội. Cần 120 XP!");
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  // Cập nhật điểm một lần duy nhất khi hoàn thành trọn vẹn vòng thi
  useEffect(() => {
    if (isFinished && roundResults.length > 0) {
      roundResults.forEach(res => {
        const { question, isCorrect, currentMode } = res;
        
        if (question.isSpellingMode) {
          updateScore('spellingRules', question.ruleId || 'general', isCorrect);
        } else if (question.isTonePairMode) {
          updateScore('tonePairs', `${question.originalTones[0]}-${question.originalTones[1]}`, isCorrect);
          if (question.ruleId) {
            updateScore('sandhiRules', question.ruleId, isCorrect);
          }
        } else {
          updateScore('syllables', `${question.correctBase}${question.correctTone}`, isCorrect);
          if (currentMode === 'tone') {
            updateScore('tones', question.correctTone.toString(), isCorrect);
          }
          
          let foundInitial = null;
          let foundFinal = null;
          
          for (const initial of Object.keys(pinyinMatrix)) {
            for (const final of Object.keys(pinyinMatrix[initial])) {
              if (pinyinMatrix[initial][final] === question.correctBase) {
                foundInitial = initial;
                foundFinal = final;
                break;
              }
            }
            if (foundInitial) break;
          }
          
          if (foundInitial && foundInitial !== 'none') {
            updateScore('initials', foundInitial, isCorrect);
          }
          if (foundFinal) {
            updateScore('finals', foundFinal, isCorrect);
          }
        }
      });
    }
  }, [isFinished]);

  if (questions.length === 0) return null;

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 mt-4 mx-4">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Hoàn thành vòng tập!</h2>
        <p className="text-slate-500 mb-8">Bạn đã luyện tập rất tốt.</p>
        
        <div className="flex gap-8 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-emerald-500">{stats.correct}</span>
            <span className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Câu Đúng</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-black text-rose-500">{stats.wrong}</span>
            <span className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Câu Sai</span>
          </div>
        </div>

        <button 
          onClick={startNewRound}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors shadow-sm"
        >
          <RotateCcw size={18} />
          Bắt đầu vòng mới
        </button>
      </div>
    );
  }

  const isAnswered = selectedOption !== null;
  const isSelectedCorrect = isAnswered && currentQuestion.options[selectedOption].isCorrect;

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden my-4">
      {/* Top Header / Progress */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-3 border-b border-slate-200 bg-white gap-3">
        
        <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto hide-scrollbar">
          <button 
            onClick={() => handleModeChange('confusing')}
            className={`whitespace-nowrap flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'confusing' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Target size={14} />
            <span className="hidden sm:inline">Âm dễ nhầm lẫn</span>
            <span className="sm:hidden">Dễ nhầm</span>
          </button>
          <button 
            onClick={() => handleModeChange('all')}
            className={`whitespace-nowrap flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'all' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Globe size={14} />
            <span className="hidden sm:inline">Tất cả các thanh</span>
            <span className="sm:hidden">Tất cả</span>
          </button>
          <button 
            onClick={() => handleModeChange('tone')}
            className={`whitespace-nowrap flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'tone' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Volume2 size={14} />
            <span className="hidden sm:inline">Phân biệt thanh điệu</span>
            <span className="sm:hidden">Thanh điệu</span>
          </button>
          <button 
            onClick={() => handleModeChange('tonepair')}
            className={`whitespace-nowrap flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'tonepair' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Headphones size={14} />
            <span className="hidden sm:inline">Cặp từ ghép (Biến điệu)</span>
            <span className="sm:hidden">Từ ghép</span>
          </button>
          <button 
            onClick={() => handleModeChange('spelling')}
            className={`whitespace-nowrap flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${mode === 'spelling' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Quy tắc chính tả</span>
            <span className="sm:hidden">Chính tả</span>
          </button>
          <select 
            value={questionCount} 
            onChange={handleQuestionCountChange}
            className="ml-1 sm:ml-2 bg-white text-slate-600 font-bold text-xs px-2 py-1.5 rounded-md border border-slate-200 outline-none cursor-pointer"
          >
            <option value={5}>5 câu</option>
            <option value={10}>10 câu</option>
            <option value={15}>15 câu</option>
            <option value={20}>20 câu</option>
          </select>
        </div>
      </div>
      <div className="w-full bg-slate-100 h-2">
        <div 
          className={`${mode === 'all' ? 'bg-purple-500' : mode === 'tone' ? 'bg-emerald-500' : mode === 'tonepair' ? 'bg-amber-500' : mode === 'spelling' ? 'bg-rose-500' : 'bg-blue-500'} h-2 transition-all duration-300`} 
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex flex-col md:flex-row p-6 gap-6 md:gap-8 items-stretch">
        {/* Left Panel (Audio Playback / Formula) */}
        <div className={`w-full md:w-1/3 ${mode === 'all' ? 'bg-purple-600' : mode === 'tone' ? 'bg-emerald-600' : mode === 'tonepair' ? 'bg-amber-500' : mode === 'spelling' ? 'bg-rose-500' : 'bg-blue-600'} rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden shadow-inner group ${!currentQuestion.isSpellingMode ? 'cursor-pointer' : ''} transition-colors`} onClick={!currentQuestion.isSpellingMode ? playAudio : undefined}>
          <div className="absolute top-4 bg-white/20 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            {mode === 'tone' ? 'TONE DRILL' : mode === 'tonepair' ? 'SANDHI DRILL' : mode === 'spelling' ? 'SPELLING DRILL' : 'PINYIN DRILL'}
          </div>
          
          {currentQuestion.isSpellingMode ? (
            <div className="flex flex-col items-center justify-center w-full mt-4">
              <div className="text-white/80 text-sm mb-4">Công thức viết:</div>
              <div className="text-4xl md:text-5xl font-mono font-black text-white text-center drop-shadow-md tracking-wider">
                {currentQuestion.formula}
              </div>
              <div className="text-6xl text-white mt-4 font-black">?</div>
            </div>
          ) : (
            <>
              <div className={`w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center mb-6 transition-transform duration-300 ${isPlaying ? 'scale-110 bg-white/10' : ''}`}>
                <Headphones size={40} className="text-white" />
              </div>
              
              <p className="text-white/80 text-sm mb-6 text-center">Nhấp loa hoặc khung này để nghe lại</p>
              
              <button 
                className={`w-16 h-16 rounded-full bg-white flex items-center justify-center ${mode === 'all' ? 'text-purple-600' : mode === 'tone' ? 'text-emerald-600' : mode === 'tonepair' ? 'text-amber-600' : 'text-blue-600'} hover:scale-105 transition-all shadow-lg ${isPlaying ? 'animate-pulse' : ''}`}
                onClick={(e) => { e.stopPropagation(); playAudio(); }}
              >
                <Volume2 size={24} className={isPlaying ? 'animate-bounce' : ''} />
              </button>
            </>
          )}
        </div>

        {/* Right Panel (Options) */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-black text-slate-800 uppercase">
              {mode === 'tone' ? 'Chọn thanh điệu chính xác:' : mode === 'tonepair' ? 'Chọn cặp thanh điệu đúng:' : mode === 'spelling' ? 'Cách viết Pinyin chuẩn là:' : 'Chọn phiên âm Pinyin đúng:'}
            </h3>
            <p className="text-xs text-slate-400 font-medium italic">
              {mode === 'tone' ? 'Mẹo: nghe kỹ ngữ điệu cao/thấp để xác định.' : mode === 'tonepair' ? 'Lưu ý: Chọn thanh điệu THỰC TẾ mà bạn nghe được (sau khi biến điệu).' : mode === 'spelling' ? 'Nhớ lại các quy tắc chính tả vừa học.' : 'Lắng nghe kỹ để phân biệt các âm gần giống nhau.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {currentQuestion.options.map((opt, idx) => {
              const displayLabel = currentQuestion.isToneMode ? (
                <div className="flex items-center gap-3">
                  <span className="text-blue-500 bg-blue-100 rounded text-xl w-8 h-8 flex items-center justify-center shadow-inner font-sans leading-none pb-0.5">{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
              ) : currentQuestion.isTonePairMode ? (
                <div className="flex items-center justify-center w-full">
                  <span className="font-sans text-xl">{opt.label}</span>
                </div>
              ) : currentQuestion.isSpellingMode ? (
                <div className="flex items-center justify-center w-full">
                  <span className="font-sans text-xl font-bold tracking-widest">{opt.text}</span>
                </div>
              ) : applyTone(opt.base, opt.tone);
              
              let btnClass = "border-2 border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-slate-600";
              
              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = "border-2 border-emerald-500 bg-emerald-50 text-emerald-700 font-bold z-10 shadow-sm";
                } else if (selectedOption === idx) {
                  btnClass = "border-2 border-rose-400 bg-rose-50 text-rose-600 font-bold opacity-50";
                } else {
                  btnClass = "border-2 border-slate-200 bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx, opt.isCorrect)}
                  disabled={isAnswered}
                  className={`relative flex items-center justify-center p-4 rounded-2xl transition-all duration-200 ${btnClass} text-2xl font-black min-h-[5rem] group`}
                >
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>{displayLabel}</span>
                  {isAnswered && opt.isCorrect && <CheckCircle2 className="absolute right-4 text-emerald-500" size={20} />}
                  {isAnswered && !opt.isCorrect && selectedOption === idx && <XCircle className="absolute right-4 text-rose-400" size={20} />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button Area */}
          <div className="mt-6 flex flex-col gap-4 min-h-[6rem]">
            {isAnswered && (
              <div className={`p-4 rounded-xl flex flex-col border ${isSelectedCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-3">
                    {isSelectedCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    {isSelectedCorrect ? 'Nghe chuẩn xác! (+30 XP)' : 'Rất tiếc! Lần sau để ý kỹ hơn nhé.'}
                  </div>
                </div>
                
                {/* Hiển thị chú thích thêm nếu là chế độ cặp thanh điệu */}
                {currentQuestion.isTonePairMode && (
                  <div className="mt-3 text-sm flex flex-col gap-1 border-t border-current/20 pt-3">
                    {(() => {
                      const originalStr = currentQuestion.correctWord.map((b, i) => applyTone(b, currentQuestion.originalTones[i])).join(' ');
                      const pronouncedStr = currentQuestion.correctWord.map((b, i) => applyTone(b, currentQuestion.correctTones[i])).join(' ');
                      
                      return (
                        <>
                          <div><span className="font-bold opacity-80">Pinyin gốc (Viết):</span> {originalStr}</div>
                          {originalStr !== pronouncedStr ? (
                            <div><span className="font-bold opacity-80">Phát âm thực tế (Biến điệu):</span> {pronouncedStr}</div>
                          ) : (
                            <div><span className="font-bold opacity-80">Phát âm:</span> (Không có biến điệu)</div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
                
                {/* Hiển thị giải thích cho luật chính tả */}
                {currentQuestion.isSpellingMode && currentQuestion.explanation && (
                  <div className="mt-3 text-sm flex flex-col gap-1 border-t border-current/20 pt-3">
                    <div><span className="font-bold opacity-80">Giải thích:</span> {currentQuestion.explanation}</div>
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all ${
                isAnswered 
                  ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md transform hover:-translate-y-0.5' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              TIẾP TỤC SANG CÂU MỚI <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="bg-slate-100/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
        <div className="flex items-center gap-4 w-full sm:w-1/3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-xs">👩</div>
            <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs">👦</div>
            <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-xs">👱</div>
          </div>
          <div className="font-bold text-slate-500 text-xs uppercase tracking-wider">
            ĐÚNG: {stats.correct} | SAI: {stats.wrong} | ĐÃ LÀM: {currentIdx + (isFinished?0:1)} / {questions.length}
          </div>
        </div>
        
        <div className="w-full sm:w-1/3 flex justify-center">
          {isAnswered && !isSelectedCorrect && (
            <button 
              onClick={handleRescue} 
              className="flex items-center gap-2 px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-xl text-sm font-bold transition-transform hover:scale-105 shadow-sm border border-rose-200"
              title="Cứu (Trừ 120 XP)"
            >
              <LifeBuoy size={16} />
              Cứu câu này (-120 XP)
            </button>
          )}
        </div>
        
        <div className="w-full sm:w-1/3 flex flex-col items-center sm:items-end text-center sm:text-right">
          <div className="font-bold text-slate-500 text-sm">
            Câu hỏi hiện tại: {currentIdx + 1} / {questions.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 italic font-medium">
            * Hoàn thành hết trắc nghiệm mới tính điểm khu vườn
          </div>
        </div>
      </div>

      {/* Render flying XP animations */}
      {flyingXp.map(id => (
        <div 
          key={id} 
          className="fixed z-[100] pointer-events-none animate-fly-xp flex items-center gap-1 text-amber-500 font-black text-2xl drop-shadow-md"
        >
          <Zap className="fill-amber-500" size={24} />
          +30 XP
        </div>
      ))}
    </div>
  );
}
