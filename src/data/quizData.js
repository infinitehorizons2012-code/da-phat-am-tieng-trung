// Danh sách các cặp âm dễ nhầm lẫn đối với người Việt khi học tiếng Trung
export const confusingSets = [
  // Lỗi l/n
  ['na', 'la'],
  ['nang', 'lang'],
  ['nu', 'lu'],
  ['ne', 'le'],
  ['ni', 'li'],
  ['nan', 'lan'],
  
  // Lỗi âm đầu: z, c, s vs zh, ch, sh
  ['zi', 'zhi'],
  ['ci', 'chi'],
  ['si', 'shi'],
  ['za', 'zha'],
  ['ca', 'cha'],
  ['sa', 'sha'],
  ['ze', 'zhe'],
  ['ce', 'che'],
  ['se', 'she'],

  // Lỗi vần an/ang, en/eng, in/ing (Âm mũi)
  ['ban', 'bang'],
  ['pan', 'pang'],
  ['man', 'mang'],
  ['fan', 'fang'],
  ['lan', 'lang'],
  ['gan', 'gang'],
  ['kan', 'kang'],
  ['han', 'hang'],
  ['ben', 'beng'],
  ['pen', 'peng'],
  ['men', 'meng'],
  ['fen', 'feng'],
  ['gen', 'geng'],
  ['ken', 'keng'],
  ['hen', 'heng'],
  ['bin', 'bing'],
  ['pin', 'ping'],
  ['min', 'ming'],
  ['lin', 'ling'],
  ['xin', 'xing'],
  ['yin', 'ying'],

  // Lỗi u vs ü
  ['lu', 'lü'],
  ['nu', 'nü'],

  // Lỗi âm bật hơi vs không bật hơi
  ['ba', 'pa'],
  ['bu', 'pu'],
  ['da', 'ta'],
  ['du', 'tu'],
  ['ge', 'ke'],
  ['gu', 'ku'],
  ['ji', 'qi'],
  ['ju', 'qu']
];

import { pinyinMatrix } from './pinyinData';

const allValidSyllables = [];
const reverseMap = {};
for (const initial in pinyinMatrix) {
  for (const final in pinyinMatrix[initial]) {
    const syllable = pinyinMatrix[initial][final];
    allValidSyllables.push(syllable);
    reverseMap[syllable] = { initial, final };
  }
}
// Loại bỏ trùng lặp nếu có
const uniqueSyllables = [...new Set(allValidSyllables)];

// Trọng số chung cho SRS
const getWeight = (level) => {
  switch (level) {
    case 0: return 10;
    case 1: return 7;
    case 2: return 4;
    case 3: return 1;
    case 4: return 1;
    default: return 10;
  }
};

// Hàm tạo 10 câu hỏi ngẫu nhiên cho một vòng (Âm dễ nhầm)
export const generateQuizRound = (numQuestions = 10, progress = null) => {
  const questions = [];
  
  // Sắp xếp các cặp dễ nhầm theo trọng số (Weighted Random Shuffle)
  const shuffledPairs = [...confusingSets].sort((a, b) => {
    const getPairLevel = (pair) => {
      let minLevel = 4;
      for (const syl of pair) {
        const parts = reverseMap[syl];
        if (parts) {
          if (parts.initial && parts.initial !== 'none') {
            minLevel = Math.min(minLevel, progress?.initials?.[parts.initial] ?? 0);
          }
          if (parts.final) {
            minLevel = Math.min(minLevel, progress?.finals?.[parts.final] ?? 0);
          }
        }
      }
      return minLevel;
    };
    
    const levelA = getPairLevel(a);
    const levelB = getPairLevel(b);
    
    return (Math.random() * getWeight(levelB)) - (Math.random() * getWeight(levelA));
  });

  const selectedPairs = shuffledPairs.slice(0, numQuestions);
  
  for (let i = 0; i < selectedPairs.length; i++) {
    const pair = selectedPairs[i];
    
    // 2. Chọn ngẫu nhiên đáp án đúng từ cặp đó (0 hoặc 1)
    const correctSyllable = pair[Math.floor(Math.random() * 2)];
    const confusingSyllable = pair.find(s => s !== correctSyllable);
    
    // 3. Chọn ngẫu nhiên thanh điệu (1, 2, 3, 4)
    const correctTone = Math.floor(Math.random() * 4) + 1;
    let wrongTone = correctTone;
    while (wrongTone === correctTone) {
      wrongTone = Math.floor(Math.random() * 4) + 1;
    }
    
    // 4. Tạo 4 đáp án (Options)
    const options = [
      { base: correctSyllable, tone: correctTone, isCorrect: true },
      { base: confusingSyllable, tone: correctTone, isCorrect: false },
      { base: correctSyllable, tone: wrongTone, isCorrect: false },
      { base: confusingSyllable, tone: wrongTone, isCorrect: false }
    ];
    
    // 5. Xáo trộn đáp án
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      id: questions.length + 1,
      correctBase: correctSyllable,
      correctTone: correctTone,
      options: shuffledOptions
    });
  }
  
  return questions;
};
// Loại bỏ trùng lặp nếu có (đã khai báo ở trên)

// Tạo sẵn mảng 1632 tổ hợp âm tiết + thanh điệu
const allSyllableTones = [];
for (const syllable of uniqueSyllables) {
  for (let tone = 1; tone <= 4; tone++) {
    allSyllableTones.push({ base: syllable, tone: tone });
  }
}

// Hàm tạo 10 câu hỏi ngẫu nhiên từ toàn bộ các âm Pinyin (Có áp dụng SRS)
export const generateRandomQuizRound = (numQuestions = 10, progress = null) => {
  const questions = [];
  
  const shuffledPool = [...allSyllableTones].sort((a, b) => {
    const keyA = `${a.base}${a.tone}`;
    const keyB = `${b.base}${b.tone}`;
    const levelA = progress?.syllables?.[keyA] || 0;
    const levelB = progress?.syllables?.[keyB] || 0;
    
    return (Math.random() * getWeight(levelB)) - (Math.random() * getWeight(levelA));
  });

  const selected = shuffledPool.slice(0, numQuestions);
  
  for (let i = 0; i < selected.length; i++) {
    const correctSyllable = selected[i].base;
    const correctTone = selected[i].tone;
    
    // 2. Chọn ngẫu nhiên 3 đáp án sai (đảm bảo không trùng với đáp án đúng và không trùng nhau)
    const options = [
      { base: correctSyllable, tone: correctTone, isCorrect: true }
    ];
    
    while (options.length < 4) {
      const wrongIdx = Math.floor(Math.random() * uniqueSyllables.length);
      const wrongSyllable = uniqueSyllables[wrongIdx];
      const wrongTone = Math.floor(Math.random() * 4) + 1;
      
      // Kiểm tra trùng lặp
      const isDuplicate = options.some(opt => opt.base === wrongSyllable && opt.tone === wrongTone);
      if (!isDuplicate) {
        options.push({ base: wrongSyllable, tone: wrongTone, isCorrect: false });
      }
    }
    
    // 3. Xáo trộn đáp án
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      id: questions.length + 1,
      correctBase: correctSyllable,
      correctTone: correctTone,
      options: shuffledOptions
    });
  }
  
  return questions;
};

// Hàm tạo 10 câu hỏi để nghe phân biệt thanh điệu (Có áp dụng SRS)
export const generateToneQuizRound = (numQuestions = 10, progress = null) => {
  const questions = [];
  const usedSyllables = new Set();
  
  while (questions.length < numQuestions) {
    // Lựa chọn tone ưu tiên theo tiến độ SRS
    const sortedTones = [1, 2, 3, 4].sort((a, b) => {
      const levelA = progress?.tones?.[a.toString()] || 0;
      const levelB = progress?.tones?.[b.toString()] || 0;
      return (Math.random() * getWeight(levelB)) - (Math.random() * getWeight(levelA));
    });
    
    const correctTone = sortedTones[0];
    
    let correctSyllable;
    while(true) {
      correctSyllable = uniqueSyllables[Math.floor(Math.random() * uniqueSyllables.length)];
      if (!usedSyllables.has(correctSyllable)) {
        usedSyllables.add(correctSyllable);
        break;
      }
    }
    
    // Đáp án luôn cố định là 4 thanh
    const options = [
      { base: correctSyllable, tone: 1, label: '1st', icon: '→', isCorrect: correctTone === 1 },
      { base: correctSyllable, tone: 2, label: '2nd', icon: '↗', isCorrect: correctTone === 2 },
      { base: correctSyllable, tone: 3, label: '3rd', icon: '↘↗', isCorrect: correctTone === 3 },
      { base: correctSyllable, tone: 4, label: '4th', icon: '↘', isCorrect: correctTone === 4 }
    ];
    
    questions.push({
      id: questions.length + 1,
      correctBase: correctSyllable,
      correctTone: correctTone,
      options: options,
      isToneMode: true // flag để render UI đặc biệt
    });
  }
  return questions;
};

// Dữ liệu các từ ghép (đặc biệt chú trọng biến điệu)
export const tonePairWords = [
  // 1-1
  { word: ['ka', 'fei'], tones: [1, 1], sandhiTones: [1, 1] },
  { word: ['fei', 'ji'], tones: [1, 1], sandhiTones: [1, 1] },
  { word: ['xing', 'qi'], tones: [1, 1], sandhiTones: [1, 1] },
  { word: ['jin', 'tian'], tones: [1, 1], sandhiTones: [1, 1] },
  { word: ['chu', 'zu'], tones: [1, 1], sandhiTones: [1, 1] },

  // 1-2
  { word: ['zhong', 'guo'], tones: [1, 2], sandhiTones: [1, 2] },
  { word: ['xin', 'nian'], tones: [1, 2], sandhiTones: [1, 2] },
  { word: ['gong', 'yuan'], tones: [1, 2], sandhiTones: [1, 2] },
  { word: ['hua', 'ping'], tones: [1, 2], sandhiTones: [1, 2] },
  { word: ['jia', 'ren'], tones: [1, 2], sandhiTones: [1, 2] },

  // 1-3
  { word: ['hei', 'ban'], tones: [1, 3], sandhiTones: [1, 3] },
  { word: ['jing', 'li'], tones: [1, 3], sandhiTones: [1, 3] },
  { word: ['chu', 'kou'], tones: [1, 3], sandhiTones: [1, 3] },
  { word: ['ying', 'yu'], tones: [1, 3], sandhiTones: [1, 3] },
  
  // 1-4
  { word: ['sheng', 'ri'], tones: [1, 4], sandhiTones: [1, 4] },
  { word: ['zhi', 'shi'], tones: [1, 4], sandhiTones: [1, 4] },
  { word: ['che', 'zhan'], tones: [1, 4], sandhiTones: [1, 4] },
  { word: ['yin', 'yue'], tones: [1, 4], sandhiTones: [1, 4] },
  
  // 1-5
  { word: ['yi', 'fu'], tones: [1, 5], sandhiTones: [1, 5] },
  { word: ['zhuo', 'zi'], tones: [1, 5], sandhiTones: [1, 5] },
  { word: ['ge', 'ge'], tones: [1, 5], sandhiTones: [1, 5] },
  { word: ['ta', 'men'], tones: [1, 5], sandhiTones: [1, 5] },

  // 2-1
  { word: ['ming', 'tian'], tones: [2, 1], sandhiTones: [2, 1] },
  { word: ['zuo', 'tian'], tones: [2, 1], sandhiTones: [2, 1] },
  { word: ['tong', 'zhi'], tones: [2, 1], sandhiTones: [2, 1] },
  { word: ['guo', 'jia'], tones: [2, 1], sandhiTones: [2, 1] },

  // 2-2
  { word: ['yin', 'hang'], tones: [2, 2], sandhiTones: [2, 2] },
  { word: ['tong', 'xue'], tones: [2, 2], sandhiTones: [2, 2] },
  { word: ['shi', 'tang'], tones: [2, 2], sandhiTones: [2, 2] },
  { word: ['lan', 'qiu'], tones: [2, 2], sandhiTones: [2, 2] },

  // 2-3
  { word: ['niu', 'nai'], tones: [2, 3], sandhiTones: [2, 3] },
  { word: ['ci', 'dian'], tones: [2, 3], sandhiTones: [2, 3] },
  { word: ['nan', 'nu'], tones: [2, 3], sandhiTones: [2, 3] },
  { word: ['ping', 'guo'], tones: [2, 3], sandhiTones: [2, 3] },

  // 2-4
  { word: ['xue', 'xiao'], tones: [2, 4], sandhiTones: [2, 4] },
  { word: ['huang', 'se'], tones: [2, 4], sandhiTones: [2, 4] },
  { word: ['wang', 'luo'], tones: [2, 4], sandhiTones: [2, 4] },
  { word: ['nan', 'guo'], tones: [2, 4], sandhiTones: [2, 4] },
  
  // 2-5
  { word: ['ming', 'zi'], tones: [2, 5], sandhiTones: [2, 5] },
  { word: ['hai', 'zi'], tones: [2, 5], sandhiTones: [2, 5] },
  { word: ['xue', 'sheng'], tones: [2, 5], sandhiTones: [2, 5] },
  { word: ['peng', 'you'], tones: [2, 5], sandhiTones: [2, 5] },

  // 3-1
  { word: ['lao', 'shi'], tones: [3, 1], sandhiTones: [3, 1] },
  { word: ['shou', 'ji'], tones: [3, 1], sandhiTones: [3, 1] },
  { word: ['bei', 'jing'], tones: [3, 1], sandhiTones: [3, 1] },
  { word: ['hen', 'duo'], tones: [3, 1], sandhiTones: [3, 1] },

  // 3-2
  { word: ['mei', 'guo'], tones: [3, 2], sandhiTones: [3, 2] },
  { word: ['lv', 'you'], tones: [3, 2], sandhiTones: [3, 2] },
  { word: ['yu', 'yan'], tones: [3, 2], sandhiTones: [3, 2] },
  { word: ['ji', 'chu'], tones: [3, 2], sandhiTones: [3, 2] },

  // 3-3 -> 2-3 (Rule)
  { word: ['ni', 'hao'], tones: [3, 3], sandhiTones: [2, 3], ruleId: '3+3' },
  { word: ['ke', 'yi'], tones: [3, 3], sandhiTones: [2, 3], ruleId: '3+3' },
  { word: ['lao', 'ban'], tones: [3, 3], sandhiTones: [2, 3], ruleId: '3+3' },
  { word: ['shou', 'biao'], tones: [3, 3], sandhiTones: [2, 3], ruleId: '3+3' },
  { word: ['yu', 'san'], tones: [3, 3], sandhiTones: [2, 3], ruleId: '3+3' },
  { word: ['shui', 'guo'], tones: [3, 3], sandhiTones: [2, 3], ruleId: '3+3' },
  { word: ['zhan', 'lan'], tones: [3, 3], sandhiTones: [2, 3], ruleId: '3+3' },
  { word: ['hen', 'hao'], tones: [3, 3], sandhiTones: [2, 3], ruleId: '3+3' },

  // 3-4
  { word: ['kao', 'shi'], tones: [3, 4], sandhiTones: [3, 4] },
  { word: ['hao', 'kan'], tones: [3, 4], sandhiTones: [3, 4] },
  { word: ['nu', 'li'], tones: [3, 4], sandhiTones: [3, 4] },
  { word: ['zhun', 'bei'], tones: [3, 4], sandhiTones: [3, 4] },

  // 3-5
  { word: ['jie', 'jie'], tones: [3, 5], sandhiTones: [3, 5] },
  { word: ['nai', 'nai'], tones: [3, 5], sandhiTones: [3, 5] },
  { word: ['li', 'mian'], tones: [3, 5], sandhiTones: [3, 5] },
  { word: ['yan', 'jing'], tones: [3, 5], sandhiTones: [3, 5] },
  
  // 4-1
  { word: ['dian', 'che'], tones: [4, 1], sandhiTones: [4, 1] },
  { word: ['qi', 'che'], tones: [4, 1], sandhiTones: [4, 1] },
  { word: ['dian', 'xin'], tones: [4, 1], sandhiTones: [4, 1] },
  { word: ['kan', 'shu'], tones: [4, 1], sandhiTones: [4, 1] },

  // 4-2
  { word: ['dian', 'tai'], tones: [4, 2], sandhiTones: [4, 2] },
  { word: ['wen', 'ti'], tones: [4, 2], sandhiTones: [4, 2] },
  { word: ['shang', 'xue'], tones: [4, 2], sandhiTones: [4, 2] },
  { word: ['dian', 'chi'], tones: [4, 2], sandhiTones: [4, 2] },

  // 4-3
  { word: ['han', 'yu'], tones: [4, 3], sandhiTones: [4, 3] },
  { word: ['zi', 'ji'], tones: [4, 3], sandhiTones: [4, 3] },
  { word: ['dian', 'ying'], tones: [4, 3], sandhiTones: [4, 3] },
  
  // 4-4
  { word: ['dian', 'shi'], tones: [4, 4], sandhiTones: [4, 4] },
  { word: ['xian', 'zai'], tones: [4, 4], sandhiTones: [4, 4] },
  { word: ['zai', 'jian'], tones: [4, 4], sandhiTones: [4, 4] },
  { word: ['kuai', 'le'], tones: [4, 4], sandhiTones: [4, 4] },
  
  // 4-5
  { word: ['ba', 'ba'], tones: [4, 5], sandhiTones: [4, 5] },
  { word: ['mei', 'mei'], tones: [4, 5], sandhiTones: [4, 5] },
  { word: ['piao', 'liang'], tones: [4, 5], sandhiTones: [4, 5] },

  // Biến điệu của "yi" (tone 1)
  { word: ['yi', 'ge'], tones: [1, 4], sandhiTones: [2, 4], ruleId: 'yi' },
  { word: ['yi', 'tian'], tones: [1, 1], sandhiTones: [4, 1], ruleId: 'yi' },
  { word: ['yi', 'nian'], tones: [1, 2], sandhiTones: [4, 2], ruleId: 'yi' },
  { word: ['yi', 'qi'], tones: [1, 3], sandhiTones: [4, 3], ruleId: 'yi' },
  { word: ['yi', 'kuai'], tones: [1, 4], sandhiTones: [2, 4], ruleId: 'yi' },
  { word: ['yi', 'ding'], tones: [1, 4], sandhiTones: [2, 4], ruleId: 'yi' },
  { word: ['yi', 'ci'], tones: [1, 4], sandhiTones: [2, 4], ruleId: 'yi' },
  { word: ['yi', 'ban'], tones: [1, 1], sandhiTones: [4, 1], ruleId: 'yi' },
  { word: ['yi', 'dian'], tones: [1, 3], sandhiTones: [4, 3], ruleId: 'yi' },
  { word: ['yi', 'xie'], tones: [1, 1], sandhiTones: [4, 1], ruleId: 'yi' },
  
  // Biến điệu của "bu" (tone 4)
  { word: ['bu', 'shi'], tones: [4, 4], sandhiTones: [2, 4], ruleId: 'bu' },
  { word: ['bu', 'dui'], tones: [4, 4], sandhiTones: [2, 4], ruleId: 'bu' },
  { word: ['bu', 'hao'], tones: [4, 3], sandhiTones: [4, 3], ruleId: 'bu' },
  { word: ['bu', 'mang'], tones: [4, 2], sandhiTones: [4, 2], ruleId: 'bu' },
  { word: ['bu', 'cuo'], tones: [4, 4], sandhiTones: [2, 4], ruleId: 'bu' },
  { word: ['bu', 'yao'], tones: [4, 4], sandhiTones: [2, 4], ruleId: 'bu' },
  { word: ['bu', 'neng'], tones: [4, 2], sandhiTones: [4, 2], ruleId: 'bu' },
  { word: ['bu', 'yong'], tones: [4, 4], sandhiTones: [2, 4], ruleId: 'bu' },
  { word: ['bu', 'hui'], tones: [4, 4], sandhiTones: [2, 4], ruleId: 'bu' },
  { word: ['bu', 'pa'], tones: [4, 4], sandhiTones: [2, 4], ruleId: 'bu' },
  { word: ['bu', 'tong'], tones: [4, 2], sandhiTones: [4, 2], ruleId: 'bu' },
  { word: ['bu', 'qu'], tones: [4, 4], sandhiTones: [2, 4], ruleId: 'bu' }
];

// Hàm tạo 10 câu hỏi để nghe cặp thanh điệu (Có áp dụng Spaced Repetition)
export const generateTonePairQuizRound = (numQuestions = 10, progress = null) => {
  const questions = [];
  
  // Shuffle tonePairWords theo trọng số (Weighted Random Shuffle)
  const shuffledWords = [...tonePairWords].sort((a, b) => {
    const pairKeyA = `${a.tones[0]}-${a.tones[1]}`;
    const pairKeyB = `${b.tones[0]}-${b.tones[1]}`;
    
    const levelA = progress?.tonePairs?.[pairKeyA] || 0;
    const levelB = progress?.tonePairs?.[pairKeyB] || 0;
    
    const scoreA = Math.random() * getWeight(levelA);
    const scoreB = Math.random() * getWeight(levelB);
    
    return scoreB - scoreA; // Giảm dần theo điểm ưu tiên
  });
  
  const selectedWords = shuffledWords.slice(0, numQuestions);
  
  for (let i = 0; i < selectedWords.length; i++) {
    const correctWord = selectedWords[i];
    
    // Yêu cầu mới: Đáp án đúng phải là thanh ĐÃ BIẾN ĐIỆU (những gì người dùng nghe được)
    const originalTones = correctWord.tones;
    const pronouncedTones = correctWord.sandhiTones || correctWord.tones;
    
    const formatLabel = (t) => {
      if (t === 1) return '1st';
      if (t === 2) return '2nd';
      if (t === 3) return '3rd';
      if (t === 4) return '4th';
      if (t === 5) return '5th';
      return t;
    };
    
    const options = [
      { tones: pronouncedTones, label: `${formatLabel(pronouncedTones[0])} + ${formatLabel(pronouncedTones[1])}`, isCorrect: true }
    ];
    
    // Sinh ra 3 đáp án sai
    while (options.length < 4) {
      const wrongTones = [Math.floor(Math.random() * 4) + 1, Math.floor(Math.random() * 4) + 1];
      const isDuplicate = options.some(opt => opt.tones[0] === wrongTones[0] && opt.tones[1] === wrongTones[1]);
      if (!isDuplicate) {
        options.push({ tones: wrongTones, label: `${formatLabel(wrongTones[0])} + ${formatLabel(wrongTones[1])}`, isCorrect: false });
      }
    }
    
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      id: i + 1,
      correctWord: correctWord.word, // mảng 2 chữ pinyin base
      originalTones: originalTones,  // mảng 2 số (gốc) dùng cho giải thích
      correctTones: pronouncedTones, // mảng 2 số (biến điệu) dùng làm đáp án đúng
      ruleId: correctWord.ruleId,
      options: shuffledOptions,
      isTonePairMode: true
    });
  }
  
  return questions;
};

// Dữ liệu cho bài kiểm tra Quy tắc chính tả (Spelling Rules)
const spellingRulesData = [
  // Luật U (ü)
  { ruleId: 'Luật j,q,x + ü', formula: 'j + ü', correct: 'ju', wrong: ['jü', 'jyu', 'jou'], explanation: 'j, q, x đi với ü phải bỏ hai chấm.' },
  { ruleId: 'Luật j,q,x + ü', formula: 'q + üe', correct: 'que', wrong: ['qüe', 'qyue', 'qie'], explanation: 'j, q, x đi với ü phải bỏ hai chấm.' },
  { ruleId: 'Luật j,q,x + ü', formula: 'x + üan', correct: 'xuan', wrong: ['xüan', 'xyuan', 'xian'], explanation: 'j, q, x đi với ü phải bỏ hai chấm.' },
  { ruleId: 'Luật j,q,x + ü', formula: 'j + ün', correct: 'jun', wrong: ['jün', 'jyun', 'jin'], explanation: 'j, q, x đi với ü phải bỏ hai chấm.' },
  
  // Bẫy Luật U (n, l)
  { ruleId: 'Luật n,l + ü', formula: 'n + ü', correct: 'nü', wrong: ['nu', 'nyu', 'nv'], explanation: 'n và l đi với ü VẪN PHẢI GIỮ nguyên hai chấm để phân biệt với nu, lu.' },
  { ruleId: 'Luật n,l + ü', formula: 'l + üe', correct: 'lüe', wrong: ['lue', 'lyue', 'lve'], explanation: 'n và l đi với ü VẪN PHẢI GIỮ nguyên hai chấm.' },

  // Luật Y (i)
  { ruleId: 'Luật i đứng đầu', formula: '∅ + i', correct: 'yi', wrong: ['i', 'y', 'yii'], explanation: 'Âm tiết bắt đầu bằng i phải thêm y phía trước (thành yi).' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + ia', correct: 'ya', wrong: ['ia', 'yia', 'iya'], explanation: 'Âm tiết bắt đầu bằng i (có nguyên âm khác theo sau) thì i biến thành y.' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + ie', correct: 'ye', wrong: ['ie', 'yie', 'iye'], explanation: 'Âm tiết bắt đầu bằng i (có nguyên âm khác theo sau) thì i biến thành y.' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + iao', correct: 'yao', wrong: ['iao', 'yiao', 'iyao'], explanation: 'Âm tiết bắt đầu bằng i (có nguyên âm khác theo sau) thì i biến thành y.' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + iou', correct: 'you', wrong: ['iou', 'yiou', 'iyou'], explanation: 'Âm tiết iou khi đứng một mình viết thành you.' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + ian', correct: 'yan', wrong: ['ian', 'yian', 'iyan'], explanation: 'Âm tiết bắt đầu bằng i (có nguyên âm khác theo sau) thì i biến thành y.' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + in', correct: 'yin', wrong: ['in', 'yn', 'yiin'], explanation: 'Âm tiết bắt đầu bằng in phải thêm y phía trước (thành yin).' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + iang', correct: 'yang', wrong: ['iang', 'yiang', 'iyang'], explanation: 'Âm tiết bắt đầu bằng i (có nguyên âm khác theo sau) thì i biến thành y.' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + ing', correct: 'ying', wrong: ['ing', 'yng', 'yiing'], explanation: 'Âm tiết bắt đầu bằng ing phải thêm y phía trước (thành ying).' },
  { ruleId: 'Luật i đứng đầu', formula: '∅ + iong', correct: 'yong', wrong: ['iong', 'yiong', 'iyong'], explanation: 'Âm tiết bắt đầu bằng i (có nguyên âm khác theo sau) thì i biến thành y.' },

  // Luật W (u)
  { ruleId: 'Luật u đứng đầu', formula: '∅ + u', correct: 'wu', wrong: ['u', 'w', 'uu'], explanation: 'Âm tiết bắt đầu bằng u phải thêm w phía trước (thành wu).' },
  { ruleId: 'Luật u đứng đầu', formula: '∅ + ua', correct: 'wa', wrong: ['ua', 'wua', 'uwa'], explanation: 'Âm tiết bắt đầu bằng u (có nguyên âm khác theo sau) thì u biến thành w.' },
  { ruleId: 'Luật u đứng đầu', formula: '∅ + uo', correct: 'wo', wrong: ['uo', 'wuo', 'uwo'], explanation: 'Âm tiết bắt đầu bằng u (có nguyên âm khác theo sau) thì u biến thành w.' },
  { ruleId: 'Luật u đứng đầu', formula: '∅ + uai', correct: 'wai', wrong: ['uai', 'wuai', 'uwai'], explanation: 'Âm tiết bắt đầu bằng u (có nguyên âm khác theo sau) thì u biến thành w.' },
  { ruleId: 'Luật u đứng đầu', formula: '∅ + uei', correct: 'wei', wrong: ['uei', 'wuei', 'uwei'], explanation: 'Âm tiết uei khi đứng một mình viết thành wei.' },
  { ruleId: 'Luật u đứng đầu', formula: '∅ + uan', correct: 'wan', wrong: ['uan', 'wuan', 'uwan'], explanation: 'Âm tiết bắt đầu bằng u (có nguyên âm khác theo sau) thì u biến thành w.' },
  { ruleId: 'Luật u đứng đầu', formula: '∅ + uen', correct: 'wen', wrong: ['uen', 'wuen', 'uwen'], explanation: 'Âm tiết uen khi đứng một mình viết thành wen.' },
  { ruleId: 'Luật u đứng đầu', formula: '∅ + uang', correct: 'wang', wrong: ['uang', 'wuang', 'uwang'], explanation: 'Âm tiết bắt đầu bằng u (có nguyên âm khác theo sau) thì u biến thành w.' }
];

// Hàm tạo 10 câu hỏi Trắc nghiệm Chính tả (Có áp dụng SRS)
export const generateSpellingQuizRound = (numQuestions = 10, progress = null) => {
  const questions = [];
  
  // Trộn ngẫu nhiên mảng spellingRulesData theo trọng số SRS
  const shuffledRules = [...spellingRulesData].sort((a, b) => {
    const levelA = progress?.spellingRules?.[a.ruleId] || 0;
    const levelB = progress?.spellingRules?.[b.ruleId] || 0;
    return (Math.random() * getWeight(levelB)) - (Math.random() * getWeight(levelA));
  });
  
  // Lấy ra số lượng câu hỏi mong muốn
  const selectedRules = shuffledRules.slice(0, numQuestions);
  
  selectedRules.forEach((rule, index) => {
    const options = [
      { text: rule.correct, isCorrect: true }
    ];
    
    // Thêm các đáp án sai
    rule.wrong.forEach(w => {
      options.push({ text: w, isCorrect: false });
    });
    
    // Trộn ngẫu nhiên các đáp án
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      id: index + 1,
      isSpellingMode: true,
      ruleId: rule.ruleId,
      formula: rule.formula,
      correctAnswer: rule.correct,
      explanation: rule.explanation,
      options: shuffledOptions
    });
  });
  
  return questions;
};

// Hàm sinh Đề thi Cuối Kỳ (Level 4 - Ra quả)
export const generateFinalExamRound = (progress) => {
  const targets = [];
  const questions = [];
  
  const formatLabel = (t) => t === 5 ? '5th' : t === 1 ? '1st' : t === 2 ? '2nd' : t === 3 ? '3rd' : t === 4 ? '4th' : t;

  // 1. Chọn 2 Spelling Rules
  const rulesById = {};
  spellingRulesData.forEach(r => {
    if(!rulesById[r.ruleId]) rulesById[r.ruleId] = [];
    rulesById[r.ruleId].push(r);
  });
  const allRuleIds = Object.keys(rulesById);
  const selectedRuleIds = allRuleIds.sort(() => Math.random() - 0.5).slice(0, 2);
  
  selectedRuleIds.forEach(ruleId => {
    targets.push({ category: 'spellingRules', itemId: ruleId });
    const ruleQuestions = rulesById[ruleId].sort(() => Math.random() - 0.5);
    for(let i=0; i<3; i++) {
      const rule = ruleQuestions[i % ruleQuestions.length];
      const options = [{ text: rule.correct, isCorrect: true }, ...rule.wrong.map(w => ({ text: w, isCorrect: false }))];
      questions.push({
        isSpellingMode: true,
        ruleId: rule.ruleId,
        formula: rule.formula,
        correctAnswer: rule.correct,
        options: options.sort(() => Math.random() - 0.5),
        target: { category: 'spellingRules', itemId: ruleId }
      });
    }
  });

  // 2. Chọn 2 Tone Pairs
  const selectedTonePairs = [...tonePairWords].sort(() => Math.random() - 0.5).slice(0, 2);
  selectedTonePairs.forEach(pair => {
    const itemId = `${pair.tones[0]}-${pair.tones[1]}`;
    targets.push({ category: 'tonePairs', itemId });
    for(let i=0; i<3; i++) {
      const originalTones = pair.tones;
      const pronouncedTones = pair.sandhiTones || pair.tones;
      const options = [{ tones: pronouncedTones, label: `${formatLabel(pronouncedTones[0])} + ${formatLabel(pronouncedTones[1])}`, isCorrect: true }];
      while(options.length < 4) {
        const wrongTones = [Math.floor(Math.random()*4)+1, Math.floor(Math.random()*4)+1];
        if(!options.some(opt => opt.tones[0]===wrongTones[0] && opt.tones[1]===wrongTones[1])) {
          options.push({ tones: wrongTones, label: `${formatLabel(wrongTones[0])} + ${formatLabel(wrongTones[1])}`, isCorrect: false });
        }
      }
      questions.push({
        correctWord: pair.word,
        originalTones,
        correctTones: pronouncedTones,
        ruleId: pair.ruleId,
        options: options.sort(() => Math.random() - 0.5),
        isTonePairMode: true,
        target: { category: 'tonePairs', itemId }
      });
    }
  });
  
  // 3. Chọn 2 Tones
  const allTones = [1, 2, 3, 4];
  const selectedTones = allTones.sort(() => Math.random() - 0.5).slice(0, 2);
  selectedTones.forEach(tone => {
    targets.push({ category: 'tones', itemId: tone.toString() });
    for(let i=0; i<3; i++) {
      const correctSyllable = uniqueSyllables[Math.floor(Math.random() * uniqueSyllables.length)];
      const options = [{ base: correctSyllable, tone, isCorrect: true }];
      while(options.length < 4) {
        const wrongTone = Math.floor(Math.random()*4)+1;
        if(wrongTone !== tone && !options.some(opt => opt.tone === wrongTone)) {
          options.push({ base: correctSyllable, tone: wrongTone, isCorrect: false });
        }
      }
      questions.push({
        correctBase: correctSyllable,
        correctTone: tone,
        options: options.sort(() => Math.random() - 0.5),
        target: { category: 'tones', itemId: tone.toString() }
      });
    }
  });

  // 4. Chọn 2 Random Syllables
  const selectedSyllables = [...uniqueSyllables].sort(() => Math.random() - 0.5).slice(0, 2);
  selectedSyllables.forEach(syl => {
    const tone = Math.floor(Math.random() * 4) + 1;
    const itemId = `${syl}${tone}`;
    targets.push({ category: 'syllables', itemId });
    for(let i=0; i<3; i++) {
      const options = [{ base: syl, tone, isCorrect: true }];
      while(options.length < 4) {
        const wrongSyllable = uniqueSyllables[Math.floor(Math.random() * uniqueSyllables.length)];
        const wrongTone = Math.floor(Math.random()*4)+1;
        if(!options.some(opt => opt.base === wrongSyllable && opt.tone === wrongTone)) {
          options.push({ base: wrongSyllable, tone: wrongTone, isCorrect: false });
        }
      }
      questions.push({
        correctBase: syl,
        correctTone: tone,
        options: options.sort(() => Math.random() - 0.5),
        target: { category: 'syllables', itemId }
      });
    }
  });

  // Xáo trộn toàn bộ 24 câu hỏi
  const shuffledQuestions = questions.sort(() => Math.random() - 0.5).map((q, idx) => ({ ...q, id: idx + 1 }));
  
  return { questions: shuffledQuestions, targets };
};
