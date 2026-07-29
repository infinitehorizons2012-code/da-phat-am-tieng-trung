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

export const playPinyinAudio = (text, onEnd) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-Speech không được hỗ trợ trên trình duyệt này.');
    if (onEnd) onEnd();
  }
};

export const playAudioSequence = (texts, onProgress, onComplete) => {
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();
  
  let currentIndex = 0;
  
  const playNext = () => {
    if (currentIndex >= texts.length) {
      if (onComplete) onComplete();
      return;
    }
    
    const text = texts[currentIndex];
    if (onProgress) onProgress(currentIndex, text);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.8;
    
    utterance.onend = () => {
      currentIndex++;
      // Thêm độ trễ nhỏ giữa các âm để người dùng dễ nghe
      setTimeout(playNext, 400); 
    };
    
    window.speechSynthesis.speak(utterance);
  };
  
  playNext();
};

export const stopAudio = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
