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

export const playPinyinAudio = (syllable, tone, onEnd) => {
  stopAudio();
  
  // Trích xuất file MP3 trực tiếp từ CDN của Bye HSK
  // Ví dụ: syllable = 'po', tone = 1 => 'https://img.khonggian.org/pychart/po1.mp3'
  // Chú ý: Một số âm như 'ü' trên URL có thể được viết là 'v'. Ta cần replace 'ü' thành 'v'.
  const normalizedSyllable = syllable.replace(/ü/g, 'v');
  const url = `https://img.khonggian.org/pychart/${normalizedSyllable}${tone}.mp3`;
  
  currentAudio = new Audio(url);
  
  if (onEnd) {
    currentAudio.addEventListener('ended', onEnd);
    currentAudio.addEventListener('error', onEnd); // Nếu lỗi cũng gọi onEnd để đi tiếp
  }
  
  currentAudio.play().catch(error => {
    console.error("Lỗi phát audio từ Bye HSK CDN:", error);
    if (onEnd) onEnd();
  });
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
    playPinyinAudio(data.text, 1, () => {
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
