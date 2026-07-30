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

// Hàm tạo 10 câu hỏi ngẫu nhiên cho một vòng
export const generateQuizRound = (numQuestions = 10) => {
  const questions = [];
  
  for (let i = 0; i < numQuestions; i++) {
    // 1. Chọn ngẫu nhiên một cặp âm dễ nhầm
    const pairIndex = Math.floor(Math.random() * confusingSets.length);
    const pair = confusingSets[pairIndex];
    
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
    // - Đáp án 1: Âm đúng + Thanh đúng (Correct)
    // - Đáp án 2: Âm sai + Thanh đúng
    // - Đáp án 3: Âm đúng + Thanh sai
    // - Đáp án 4: Âm sai + Thanh sai
    const options = [
      { base: correctSyllable, tone: correctTone, isCorrect: true },
      { base: confusingSyllable, tone: correctTone, isCorrect: false },
      { base: correctSyllable, tone: wrongTone, isCorrect: false },
      { base: confusingSyllable, tone: wrongTone, isCorrect: false }
    ];
    
    // 5. Xáo trộn đáp án
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    questions.push({
      id: i + 1,
      correctBase: correctSyllable,
      correctTone: correctTone,
      options: shuffledOptions
    });
  }
  
  return questions;
};

import { pinyinMatrix } from './pinyinData';

// Trích xuất tất cả các âm tiết hợp lệ từ pinyinMatrix
const allValidSyllables = [];
for (const initial in pinyinMatrix) {
  for (const final in pinyinMatrix[initial]) {
    allValidSyllables.push(pinyinMatrix[initial][final]);
  }
}
// Loại bỏ trùng lặp nếu có
const uniqueSyllables = [...new Set(allValidSyllables)];

// Hàm tạo 10 câu hỏi ngẫu nhiên từ toàn bộ các âm Pinyin
export const generateRandomQuizRound = (numQuestions = 10) => {
  const questions = [];
  
  for (let i = 0; i < numQuestions; i++) {
    // 1. Chọn ngẫu nhiên 1 đáp án đúng
    const correctIdx = Math.floor(Math.random() * uniqueSyllables.length);
    const correctSyllable = uniqueSyllables[correctIdx];
    const correctTone = Math.floor(Math.random() * 4) + 1; // 1-4
    
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
      id: i + 1,
      correctBase: correctSyllable,
      correctTone: correctTone,
      options: shuffledOptions
    });
  }
  
  return questions;
};
