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

export const playPinyinAudio = (text, onEnd) => {
  stopAudio();
  
  // Sử dụng Google Translate TTS API (miễn phí, không cần key, giọng chuẩn)
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=zh-CN&client=tw-ob`;
  
  currentAudio = new Audio(url);
  
  if (onEnd) {
    currentAudio.addEventListener('ended', onEnd);
    currentAudio.addEventListener('error', onEnd); // Nếu lỗi cũng gọi onEnd để đi tiếp
  }
  
  currentAudio.play().catch(error => {
    console.error("Lỗi phát audio từ API:", error);
    // Fallback: Nếu không tải được audio mạng, dùng Web Speech API
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
};

export const playAudioSequence = (texts, onProgress, onComplete) => {
  stopAudio();
  
  let currentIndex = 0;
  
  const playNext = () => {
    if (currentIndex >= texts.length) {
      if (onComplete) onComplete();
      return;
    }
    
    const text = texts[currentIndex];
    if (onProgress) onProgress(currentIndex, text);
    
    playPinyinAudio(text, () => {
      currentIndex++;
      // Thêm độ trễ nhỏ giữa các âm để người dùng dễ nghe
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
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
