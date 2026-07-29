const toneMarks = {
  a: ['a', 'ā', 'á', 'ǎ', 'à'],
  e: ['e', 'ē', 'é', 'ě', 'è'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ']
};

export const applyTone = (syllable, tone) => {
  if (tone === 0) return syllable;
  
  let targetVowel = '';
  
  if (syllable.includes('a')) targetVowel = 'a';
  else if (syllable.includes('e')) targetVowel = 'e';
  else if (syllable.includes('ou')) targetVowel = 'o';
  else {
    const vowels = ['a', 'e', 'i', 'o', 'u', 'ü'];
    for (let i = syllable.length - 1; i >= 0; i--) {
      if (vowels.includes(syllable[i])) {
        targetVowel = syllable[i];
        break;
      }
    }
  }

  if (targetVowel && toneMarks[targetVowel] && toneMarks[targetVowel][tone]) {
    return syllable.replace(targetVowel, toneMarks[targetVowel][tone]);
  }
  
  return syllable;
};

// Global audio object để có thể dừng khi đang phát dở
let currentAudio = null;

const toneMarksReverse = {
  'ā': { char: 'a', tone: 1 }, 'á': { char: 'a', tone: 2 }, 'ǎ': { char: 'a', tone: 3 }, 'à': { char: 'a', tone: 4 },
  'ē': { char: 'e', tone: 1 }, 'é': { char: 'e', tone: 2 }, 'ě': { char: 'e', tone: 3 }, 'è': { char: 'e', tone: 4 },
  'ī': { char: 'i', tone: 1 }, 'í': { char: 'i', tone: 2 }, 'ǐ': { char: 'i', tone: 3 }, 'ì': { char: 'i', tone: 4 },
  'ō': { char: 'o', tone: 1 }, 'ó': { char: 'o', tone: 2 }, 'ǒ': { char: 'o', tone: 3 }, 'ò': { char: 'o', tone: 4 },
  'ū': { char: 'u', tone: 1 }, 'ú': { char: 'u', tone: 2 }, 'ǔ': { char: 'u', tone: 3 }, 'ù': { char: 'u', tone: 4 },
  'ǖ': { char: 'v', tone: 1 }, 'ǘ': { char: 'v', tone: 2 }, 'ǚ': { char: 'v', tone: 3 }, 'ǜ': { char: 'v', tone: 4 },
  'ü': { char: 'v', tone: 1 } // neutral/default cho ü
};

export const pinyinToNumber = (pinyin) => {
  let tone = 1; // Mặc định là thanh 1 nếu là thanh nhẹ (hoặc không có dấu)
  let basePinyin = '';
  for (let i = 0; i < pinyin.length; i++) {
    const char = pinyin[i];
    if (toneMarksReverse[char]) {
      basePinyin += toneMarksReverse[char].char;
      tone = toneMarksReverse[char].tone;
    } else {
      basePinyin += char;
    }
  }
  return basePinyin + tone;
};

export const playPinyinAudio = (text, onEnd) => {
  stopAudio();
  
  const fileName = pinyinToNumber(text);
  
  // Danh sách các máy chủ dự phòng trong trường hợp mạng bị chặn (thường gặp ở VN)
  const cdnList = [
    `https://cdn.jsdelivr.net/gh/shikangkai/Chinese-Pinyin-Audio@master/Pinyin-Female/${fileName}.mp3`,
    `https://fastly.jsdelivr.net/gh/shikangkai/Chinese-Pinyin-Audio@master/Pinyin-Female/${fileName}.mp3`,
    `https://gcore.jsdelivr.net/gh/shikangkai/Chinese-Pinyin-Audio@master/Pinyin-Female/${fileName}.mp3`,
    `https://raw.githubusercontent.com/shikangkai/Chinese-Pinyin-Audio/master/Pinyin-Female/${fileName}.mp3`
  ];
  
  let currentTry = 0;
  
  const tryNext = () => {
    if (currentTry >= cdnList.length) {
      console.warn("Tất cả máy chủ MP3 đều lỗi hoặc thiếu file. Dùng TTS dự phòng.");
      // Dùng lại Google TTS làm phương án chống cháy cuối cùng (ít nhất vẫn ra tiếng)
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`;
      const fallbackAudio = new Audio(fallbackUrl);
      currentAudio = fallbackAudio;
      
      fallbackAudio.addEventListener('ended', () => { if (onEnd) onEnd(); });
      fallbackAudio.addEventListener('error', () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'zh-CN';
          if (onEnd) utterance.onend = onEnd;
          window.speechSynthesis.speak(utterance);
        } else {
          if (onEnd) onEnd();
        }
      });
      fallbackAudio.play().catch(() => { if (onEnd) onEnd(); });
      return;
    }
    
    const url = cdnList[currentTry];
    const audio = new Audio(url);
    
    // Gán ngay để hàm stopAudio() có thể dừng nếu user bấm nhanh ô khác
    currentAudio = audio;
    
    audio.addEventListener('ended', () => {
      if (onEnd) onEnd();
    });
    
    audio.addEventListener('error', () => {
      currentTry++;
      tryNext(); // Nếu file lỗi (404) hoặc mạng chặn, thử link tiếp theo
    });
    
    audio.play().catch(error => {
      // Nếu bị chặn autoplay hoặc đứt mạng
      currentTry++;
      tryNext();
    });
  };
  
  tryNext();
};

export const playAudioSequence = (syllablesData, onProgress, onComplete) => {
  stopAudio();
  
  let currentIndex = 0;
  
  const playNext = () => {
    if (currentIndex >= syllablesData.length) {
      if (onComplete) onComplete();
      return;
    }
    
    const data = syllablesData[currentIndex];
    // data có dạng { cellId, text: 'ma' }
    
    if (onProgress) onProgress(currentIndex, data);
    
    // Mặc định Auto Play đọc thanh 1
    playPinyinAudio(data.text, () => {
      currentIndex++;
      setTimeout(playNext, 400); 
    });
  };
  
  playNext();
};

export const stopAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

// --- TONE SANDHI & SANDBOX LOGIC ---

// Phân tách chuỗi nhập thành các token (ví dụ "ni3 hao3" -> [{base: 'ni', tone: 3}, {base: 'hao', tone: 3}])
export const parsePinyinString = (inputStr) => {
  const tokens = inputStr.trim().split(/\s+/);
  return tokens.map(token => {
    const match = token.match(/^([a-zA-ZüÜ]+)(\d)?$/);
    if (match) {
      return {
        raw: token,
        base: match[1].toLowerCase(),
        tone: match[2] ? parseInt(match[2]) : 5, // Thanh 5 (khinh thanh) nếu không có số
        displayTone: match[2] ? parseInt(match[2]) : 5
      };
    }
    return null;
  }).filter(t => t !== null);
};

// Áp dụng biến điệu (Tone Sandhi)
export const applyToneSandhi = (tokens) => {
  const result = JSON.parse(JSON.stringify(tokens)); // Deep copy
  for (let i = 0; i < result.length; i++) {
    const current = result[i];
    const next = i < result.length - 1 ? result[i+1] : null;
    
    // Quy tắc 1: Hai thanh 3
    if (current.tone === 3 && next && next.tone === 3) {
      current.displayTone = 2;
    }
    
    // Quy tắc 2: Chữ "yi" (một)
    if (current.base === 'yi' && current.tone === 1) {
      if (next) {
        if (next.tone === 4) current.displayTone = 2;
        else if (next.tone >= 1 && next.tone <= 3) current.displayTone = 4;
      }
    }
    
    // Quy tắc 3: Chữ "bu" (không)
    if (current.base === 'bu' && current.tone === 4) {
      if (next && next.tone === 4) {
        current.displayTone = 2;
      }
    }
  }
  return result;
};

// Hàm phát âm liên tục (không có độ trễ)
export const playContinuousSequence = (tokens, onProgress, onComplete) => {
  stopAudio();
  
  let currentIndex = 0;
  
  const playNext = () => {
    if (currentIndex >= tokens.length) {
      if (onComplete) onComplete();
      return;
    }
    
    const token = tokens[currentIndex];
    if (onProgress) onProgress(currentIndex, token);
    
    // Chuyển base + tone thành chữ có dấu (ví dụ ni + 2 -> ní)
    // Nếu là khinh thanh (thanh 5) thì playPinyinAudio sẽ tự map thành file thanh 1 hoặc mặc định
    const textToRead = applyTone(token.base, token.displayTone === 5 ? 1 : token.displayTone);
    
    playPinyinAudio(textToRead, () => {
      currentIndex++;
      playNext(); // Phát ngay lập tức khi file trước kết thúc
    });
  };
  
  playNext();
};
