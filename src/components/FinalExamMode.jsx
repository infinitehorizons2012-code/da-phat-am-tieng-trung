import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { generateFinalExamRound } from '../data/quizData';
import { pinyinMatrix } from '../data/pinyinData';
import { applyToneSandhi, playContinuousSequence, applyTone, playPinyinAudio } from '../utils/pinyinUtils';
import { Headphones, Volume2, CheckCircle2, XCircle, ArrowRight, Play, AlertCircle, Timer } from 'lucide-react';

export default function FinalExamMode({ onExit }) {
  const { progress, getGlobalProgressPercentage, processExamResults } = useProgress();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Thời gian đếm ngược (20 phút = 1200 giây)
  const [timeLeft, setTimeLeft] = useState(1200);
  
  const [tracker, setTracker] = useState({});
  const [examPassed, setExamPassed] = useState(false);

  useEffect(() => {
    if (getGlobalProgressPercentage() < 100) {
      alert("Bạn chưa đạt 100% tiến độ để tham gia kỳ thi cuối kỳ!");
      onExit();
      return;
    }

    const { questions: examQuestions, targets } = generateFinalExamRound(progress);
    setQuestions(examQuestions);
    
    const newTracker = {};
    targets.forEach(t => {
      const key = `${t.category}-${t.itemId}`;
      newTracker[key] = {
        category: t.category,
        itemId: t.itemId,
        correctCount: 0,
        totalCount: 3
      };
    });
    setTracker(newTracker);
  }, []);

  useEffect(() => {
    if (isFinished || questions.length === 0) return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleFinishExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isFinished, questions.length]);

  const handleFinishExam = (isTimeOut = false) => {
    setIsFinished(true);
    let totalCorrect = 0;
    Object.values(tracker).forEach(t => {
      totalCorrect += t.correctCount;
    });
    const passed = totalCorrect >= 17;
    setExamPassed(passed);
    const resultsArray = Object.values(tracker);
    processExamResults(resultsArray, passed);
  };

  const currentQuestion = questions[currentIdx];

  const playAudio = () => {
    if (!currentQuestion || currentQuestion.isSpellingMode) return;
    setIsPlaying(true);
    
    if (currentQuestion.isTonePairMode) {
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
    
    if (isCorrect && currentQuestion) {
      const t = currentQuestion.target;
      const key = `${t.category}-${t.itemId}`;
      setTracker(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          correctCount: prev[key].correctCount + 1
        }
      }));
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      handleFinishExam();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (questions.length === 0) return null;

  if (isFinished) {
    let totalCorrect = 0;
    Object.values(tracker).forEach(t => {
      totalCorrect += t.correctCount;
    });

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 mt-4 mx-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          {examPassed ? (
            <span className="text-5xl">🏆</span>
          ) : (
            <span className="text-5xl">🌱</span>
          )}
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">
          {examPassed ? "Chúc mừng! Bạn đã đậu!" : "Chưa đạt kỳ thi"}
        </h2>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          {examPassed 
            ? "Tuyệt vời! Những phần bạn trả lời đúng cả 3 lần đã kết trái (Level 4)." 
            : "Đừng buồn nhé! Hãy quay lại Khu Vườn để chăm sóc lại những nụ hoa bị héo và thử lại sau."}
        </p>
        
        <div className="flex gap-8 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 w-full max-w-sm justify-center">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-black text-emerald-500">{totalCorrect}</span>
            <span className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Câu Đúng</span>
          </div>
          <div className="w-px bg-slate-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-5xl font-black text-rose-500">{24 - totalCorrect}</span>
            <span className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Câu Sai</span>
          </div>
        </div>

        <button 
          onClick={onExit}
          className="px-8 py-4 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors shadow-sm"
        >
          Quay lại Bảng Điều Khiển
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      <div className="flex-1 overflow-y-auto pb-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto w-full pt-6">
          
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-rose-600 font-bold bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
              <Timer size={18} />
              <span className="tracking-widest">{timeString}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-400">Câu</span>
              <span className="bg-slate-100 px-3 py-1 rounded-md font-black text-slate-700">{currentIdx + 1}/24</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 flex flex-col items-center text-center relative mb-6">
            {!currentQuestion.isSpellingMode && (
              <button 
                onClick={playAudio}
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-8 transition-all ${isPlaying ? 'bg-rose-100 text-rose-500 scale-110 shadow-md' : 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg hover:shadow-xl hover:-translate-y-1'}`}
              >
                {isPlaying ? <Volume2 size={40} className="animate-pulse" /> : <Play size={40} className="ml-2" />}
              </button>
            )}

            {currentQuestion.isSpellingMode && (
              <div className="text-4xl sm:text-6xl font-black text-slate-800 mb-8 tracking-wider">
                {currentQuestion.formula}
              </div>
            )}
            
            <p className="text-lg font-bold text-slate-500 mb-2">
              {currentQuestion.isSpellingMode 
                ? "Cách viết nào đúng?"
                : "Chọn Pinyin bạn nghe được"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50";
              
              if (isSelected) {
                btnClass = "bg-sky-50 border-sky-500 text-sky-700 shadow-sm scale-[0.98]";
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx, opt.isCorrect)}
                  disabled={selectedOption !== null}
                  className={`relative p-5 sm:p-6 rounded-2xl border-2 font-black text-xl sm:text-2xl transition-all ${btnClass}`}
                >
                  {currentQuestion.isTonePairMode 
                    ? opt.base.map((b, i) => applyTone(b, opt.tone[i])).join(' ')
                    : currentQuestion.isSpellingMode ? opt : applyTone(opt.base, opt.tone)}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      <div className={`fixed bottom-0 left-0 right-0 p-4 border-t transition-transform duration-300 bg-white border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] ${selectedOption !== null ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-sky-600 font-bold">
            <span>Đã ghi nhận đáp án</span>
          </div>
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 sm:py-4 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl transition-colors shadow-sm text-lg"
          >
            {currentIdx < questions.length - 1 ? 'Câu tiếp theo' : 'Nộp bài'}
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
