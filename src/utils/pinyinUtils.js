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

// Global audio object để có thể dừng khi đang phát dở và tránh bị chặn Autoplay trên Safari
let globalAudio = null;

export const playPinyinAudio = (text, onEnd, onStatus) => {
  stopAudio();
  
  if (!globalAudio) {
    globalAudio = new Audio();
  }

  let fileName = pinyinToNumber(text);
  
  let isNeutral = false;
  if (fileName.endsWith('5')) {
    isNeutral = true;
    fileName = fileName.slice(0, -1) + '1'; 
  }

  if (fileName.startsWith('nve')) fileName = fileName.replace('nve', 'n%C3%BCe');
  else if (fileName.startsWith('lve')) fileName = fileName.replace('lve', 'l%C3%BCe');
  else if (fileName.startsWith('nv')) fileName = fileName.replace('nv', 'nu');
  else if (fileName.startsWith('lv')) fileName = fileName.replace('lv', 'lu');
  
  const cdnList = [
    { name: 'Cloudinary', url: `https://res.cloudinary.com/zopjocdi/video/upload/da-phat-am-tieng-trung/audio/${fileName}.mp3` }
  ];
  
  let currentTry = 0;
  
  const tryNext = () => {
    if (currentTry >= cdnList.length) {
      console.warn(`Không tìm thấy file MP3 cho ${text}.`);
      if (onStatus) onStatus('Không có dữ liệu âm thanh (404)');
      if (onEnd) onEnd();
      return;
    }
    
    if (onStatus) onStatus(cdnList[currentTry].name);
    const url = cdnList[currentTry].url;
    
    // Tái sử dụng globalAudio
    globalAudio.src = url;
    globalAudio.playbackRate = isNeutral ? 1.3 : 1.0;
    globalAudio.volume = isNeutral ? 0.6 : 1.0;
    
    // Dọn dẹp event cũ
    globalAudio.onended = () => {
      globalAudio.onended = null;
      if (onEnd) onEnd();
    };
    
    globalAudio.onerror = () => {
      currentTry++;
      tryNext();
    };
    
    globalAudio.play().catch(error => {
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
    if (onProgress) onProgress(currentIndex, data);
    
    playPinyinAudio(data.text, () => {
      currentIndex++;
      setTimeout(playNext, 400); 
    });
  };
  
  playNext();
};

export const stopAudio = () => {
  if (globalAudio) {
    globalAudio.pause();
    globalAudio.onended = null;
    globalAudio.onerror = null;
    globalAudio.ontimeupdate = null;
    // Không xoá src hoặc currentTime để tránh lỗi DOMException trên một số trình duyệt
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

// Hàm phát âm liên tục (rút ngắn khoảng cách giữa các âm tiết)
export const playContinuousSequence = (tokens, onProgress, onComplete, onStatus) => {
  stopAudio();
  
  if (!tokens || tokens.length === 0) {
    if (onComplete) onComplete();
    return;
  }
  
  // 1. Tạo và Unlock toàn bộ Audio Elements trong cùng 1 Call Stack (của Click Event)
  // Điều này giúp bypass cơ chế chặn Autoplay của Safari/iOS đối với các âm thanh phát nối tiếp nhau.
  const sequenceAudios = tokens.map(token => {
    const textToRead = applyTone(token.base, token.displayTone);
    let fileName = pinyinToNumber(textToRead);
    
    let isNeutral = false;
    if (fileName.endsWith('5')) {
      isNeutral = true;
      fileName = fileName.slice(0, -1) + '1'; 
    }

    if (fileName.startsWith('nve')) fileName = fileName.replace('nve', 'n%C3%BCe');
    else if (fileName.startsWith('lve')) fileName = fileName.replace('lve', 'l%C3%BCe');
    else if (fileName.startsWith('nv')) fileName = fileName.replace('nv', 'nu');
    else if (fileName.startsWith('lv')) fileName = fileName.replace('lv', 'lu');
    
    const url = `https://res.cloudinary.com/zopjocdi/video/upload/da-phat-am-tieng-trung/audio/${fileName}.mp3`;
    
    const audio = new Audio(url);
    if (isNeutral) {
      audio.playbackRate = 1.3;
      audio.volume = 0.6;
    } else {
      audio.playbackRate = 1.25;
    }
    
    // Unlock iOS Safari
    audio.load();
    
    return { audio, text: textToRead };
  });
  
  let currentIndex = 0;
  
  const playNext = () => {
    if (currentIndex >= tokens.length) {
      if (onComplete) onComplete();
      return;
    }
    
    const token = tokens[currentIndex];
    if (onProgress) onProgress(currentIndex, token);
    if (onStatus) onStatus(`Đang đọc: ${sequenceAudios[currentIndex].text}`);
    
    // Sử dụng audio đã được pre-load và unlock
    globalAudio = sequenceAudios[currentIndex].audio;
    
    const handleEnd = () => {
      if (globalAudio) {
        globalAudio.ontimeupdate = null;
        globalAudio.onended = null;
        globalAudio.onerror = null;
      }
      currentIndex++;
      playNext();
    };
    
    globalAudio.onended = handleEnd;
    
    globalAudio.onerror = () => {
      console.warn(`Lỗi khi phát audio ${sequenceAudios[currentIndex].text}`);
      handleEnd(); // Bỏ qua và phát tiếp
    };
    
    // Hack: Tăng tốc độ phát của audio hiện tại để nghe mượt và liền mạch hơn
    if (currentIndex < tokens.length - 1) {
      globalAudio.ontimeupdate = function() {
        const duration = this.duration || 0.8;
        const cutTime = Math.max(0.1, duration - 0.2);
        if (this.currentTime >= cutTime) {
          this.ontimeupdate = null;
          this.onended = null;
          currentIndex++;
          playNext();
        }
      };
    } else {
      globalAudio.ontimeupdate = null;
    }
    
    globalAudio.play().catch(error => {
      console.warn("Autoplay blocked or network error", error);
      handleEnd();
    });
  };
  
  playNext();
};
