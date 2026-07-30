import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { playContinuousSequence, stopAudio } from '../utils/pinyinUtils';

export default function ToneSandhiRules() {
  const [activeBtn, setActiveBtn] = useState(null);
  
  const handlePlay = (id, tokens) => {
    if (activeBtn === id) {
      stopAudio();
      setActiveBtn(null);
      return;
    }
    setActiveBtn(id);
    playContinuousSequence(
      tokens,
      null,
      () => setActiveBtn(null)
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-full overflow-hidden hide-scrollbar">
      
      {/* Header */}
      <div className="text-center mb-8 shrink-0">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-2">Quy Tắc Biến Điệu Cực Kỳ Quan Trọng</h2>
        <p className="text-slate-500 text-sm md:text-base font-medium max-w-3xl mx-auto px-4">
          Trong tiếng Trung thực tế, một số thanh điệu khi đứng cạnh nhau sẽ tự động biến âm để phát âm tự nhiên và trôi chảy. Dưới đây là 3 trường hợp bắt buộc phải ghi lòng tạc dạ:
        </p>
      </div>

      {/* 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 overflow-y-auto pb-8 hide-scrollbar px-2">
        
        {/* CARD 1: 3 + 3 */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 flex flex-col h-fit">
          <div className="text-rose-600 font-black text-2xl mb-4">3 + 3</div>
          <h3 className="text-slate-800 font-bold text-lg mb-3">Biến điệu của hai Thanh 3</h3>
          <p className="text-slate-600 text-sm mb-5 leading-relaxed">
            Khi hai âm mang <strong>Thanh 3</strong> đi liền nhau, âm tiết thứ nhất sẽ tự động phát âm thành <strong>Thanh 2</strong>. Chú ý là chữ viết Hán tự và ký hiệu pinyin gốc vẫn giữ nguyên dấu Thanh 3.
          </p>
          
          <div className="bg-rose-50 rounded-xl p-4 text-center mb-6">
            <span className="text-rose-600 font-bold tracking-[0.2em]">( ˇ ) + ( ˇ ) → ( ´ ) + ( ˇ )</span>
          </div>

          <div className="space-y-3 mt-auto">
            <ExampleButton 
              id="nihao"
              hanzi="你好"
              pinyinOriginal="nǐ + hǎo"
              pinyinPronounced="ní hǎo"
              tokens={[{base: 'ni', tone: 3, displayTone: 2}, {base: 'hao', tone: 3, displayTone: 3}]}
              isActive={activeBtn === 'nihao'}
              onPlay={handlePlay}
            />
            <ExampleButton 
              id="keyi"
              hanzi="可以"
              pinyinOriginal="kě + yǐ"
              pinyinPronounced="ké yǐ"
              tokens={[{base: 'ke', tone: 3, displayTone: 2}, {base: 'yi', tone: 3, displayTone: 3}]}
              isActive={activeBtn === 'keyi'}
              onPlay={handlePlay}
            />
          </div>
          
          <div className="mt-6 text-xs text-slate-400 italic font-medium">Mẹo: Tai hãy nghe 'ní hǎo' thay vì đọc gượng gạo từng chữ nǐ hǎo..</div>
        </div>

        {/* CARD 2: Yī */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-6 flex flex-col h-fit">
          <div className="flex flex-col mb-4">
            <div className="text-amber-500 font-black text-2xl">一</div>
            <div className="text-amber-600 font-bold">(Yī)</div>
          </div>
          <h3 className="text-slate-800 font-bold text-lg mb-3">Biến điệu linh hoạt của "一" (Yī)</h3>
          <p className="text-slate-600 text-sm mb-5 leading-relaxed">
            Chữ "一" (Một) nguyên bản mang <strong>Thanh 1</strong>. Khi giao tiếp, nó biến đổi khôn lường tùy theo thanh điệu của chữ đi liền sau nó:
          </p>
          
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 text-sm text-slate-700 font-medium space-y-2">
            <div><span className="text-rose-600 font-black mr-2">1.</span>Nếu đứng trước <strong>Thanh 4</strong> — Đọc thành <strong>Thanh 2</strong> (yí).</div>
            <div><span className="text-rose-600 font-black mr-2">2.</span>Nếu đứng trước <strong>Thanh 1, 2, 3</strong> — Đọc thành <strong>Thanh 4</strong> (yì).</div>
          </div>

          <div className="space-y-3 mt-auto">
            <ExampleButton 
              id="yiding"
              hanzi="一定"
              pinyinOriginal="trước thanh 4 (dìng)"
              pinyinPronounced="yí dìng"
              tokens={[{base: 'yi', tone: 1, displayTone: 2}, {base: 'ding', tone: 4, displayTone: 4}]}
              isActive={activeBtn === 'yiding'}
              onPlay={handlePlay}
              color="amber"
            />
            <ExampleButton 
              id="yiqi"
              hanzi="一起"
              pinyinOriginal="trước thanh 3 (qǐ)"
              pinyinPronounced="yì qǐ"
              tokens={[{base: 'yi', tone: 1, displayTone: 4}, {base: 'qi', tone: 3, displayTone: 3}]}
              isActive={activeBtn === 'yiqi'}
              onPlay={handlePlay}
              color="amber"
            />
          </div>
          
          <div className="mt-6 text-xs text-slate-400 italic font-medium">Mẹo: Chỉ giữ nguyên âm giọng ngang Yī khi đứng một mình để đếm số.</div>
        </div>

        {/* CARD 3: Bù */}
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 flex flex-col h-fit">
          <div className="flex flex-col mb-4">
            <div className="text-blue-500 font-black text-2xl">不</div>
            <div className="text-blue-600 font-bold">(Bù)</div>
          </div>
          <h3 className="text-slate-800 font-bold text-lg mb-3">Biến điệu của phó từ "不" (Bù)</h3>
          <p className="text-slate-600 text-sm mb-5 leading-relaxed">
            Phó từ phủ định "不" (Không) nguyên bản mang <strong>Thanh 4</strong>. Khi đứng trước một chữ cũng mang <strong>Thanh 4</strong>, nó sẽ lập tức chuyển giọng thành <strong>Thanh 2 (bú)</strong>.
          </p>
          
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center mb-6">
            <span className="text-blue-700 font-bold">不 (bù) + ( Thanh 4 ) → bú + ( Thanh 4 )</span>
          </div>

          <div className="space-y-3 mt-auto">
            <ExampleButton 
              id="bushi"
              hanzi="不是"
              pinyinOriginal="trước thanh 4 (shì)"
              pinyinPronounced="bú shì"
              tokens={[{base: 'bu', tone: 4, displayTone: 2}, {base: 'shi', tone: 4, displayTone: 4}]}
              isActive={activeBtn === 'bushi'}
              onPlay={handlePlay}
              color="blue"
            />
            <ExampleButton 
              id="buqu"
              hanzi="不去"
              pinyinOriginal="trước thanh 4 (qù)"
              pinyinPronounced="bú qù"
              tokens={[{base: 'bu', tone: 4, displayTone: 2}, {base: 'qu', tone: 4, displayTone: 4}]}
              isActive={activeBtn === 'buqu'}
              onPlay={handlePlay}
              color="blue"
            />
          </div>
          
          <div className="mt-6 text-xs text-slate-400 italic font-medium">Mẹo: Trước thanh 1, 2, 3 "不" vẫn giữ nguyên Thanh 4 trầm bù vốn có.</div>
        </div>

      </div>
    </div>
  );
}

function ExampleButton({ id, hanzi, pinyinOriginal, pinyinPronounced, tokens, isActive, onPlay, color = "slate" }) {
  const getHighlightColor = () => {
    if (color === 'amber') return 'text-amber-600';
    if (color === 'blue') return 'text-blue-600';
    return 'text-slate-800'; // default for 3+3 is usually just bold dark
  };

  return (
    <div 
      onClick={() => onPlay(id, tokens)}
      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
        isActive 
          ? 'bg-slate-50 border-slate-300 shadow-inner' 
          : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="font-black text-slate-800 text-lg">{hanzi}</span>
        <span className="text-xs font-medium text-slate-400">{pinyinOriginal}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`font-black ${getHighlightColor()}`}>{pinyinPronounced}</span>
        <Volume2 size={16} className={isActive ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
      </div>
    </div>
  );
}
