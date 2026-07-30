import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => {
  return useContext(ProgressContext);
};

export const ProgressProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  // Progress structure:
  // {
  //   initials: { 'b': 2, 'p': 0, ... },
  //   finals: { 'a': 3, 'o': 1, ... },
  //   tones: { '1': 4, '2': 3, ... },
  //   syllables: { 'ma3': 2, 'ba1': 1, ... },
  //   tonePairs: { '1-1': 3, '2-4': 0, ... },
  //   sandhiRules: { 'rule1': 1, ... },
  //   spellingRules: { 'rule1': 2, ... }
  // }
  // Levels: 0 (Hạt giống), 1 (Mầm non), 2 (Cây nhỏ), 3 (Cây nở hoa), 4 (Cây có quả)
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khởi tạo progress mặc định
  const getEmptyProgress = () => ({
    initials: {},
    finals: {},
    tones: {},
    syllables: {},
    tonePairs: {},
    sandhiRules: {},
    spellingRules: {}
  });

  // Tải dữ liệu khi có user đăng nhập
  useEffect(() => {
    if (!currentUser) {
      setProgress(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const userDocRef = doc(db, 'users', currentUser.uid);

    // Lắng nghe realtime từ Firestore
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProgress(docSnap.data().progress || getEmptyProgress());
      } else {
        // Tạo document mới nếu user lần đầu đăng nhập
        const newProgress = getEmptyProgress();
        setDoc(userDocRef, { progress: newProgress }, { merge: true });
        setProgress(newProgress);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading progress: ", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  // Hàm cập nhật điểm số
  // category: 'initials' | 'finals' | 'tones' | 'syllables' | 'tonePairs' | 'sandhiRules' | 'spellingRules'
  // itemId: 'b', 'a', 'ma3', '1-1', ...
  // isCorrect: boolean
  const updateScore = async (category, itemId, isCorrect) => {
    if (!currentUser) return;

    setProgress(prevProgress => {
      const currentProg = prevProgress || getEmptyProgress();
      const currentLevel = currentProg[category]?.[itemId] || 0;
      
      if (currentLevel >= 4) return prevProgress;

      let newLevel = currentLevel;
      if (isCorrect) {
        newLevel = Math.min(3, currentLevel + 1);
      } else {
        newLevel = Math.max(0, currentLevel - 1);
      }

      if (newLevel === currentLevel) return prevProgress;

      const newProgress = {
        ...currentProg,
        [category]: {
          ...currentProg[category],
          [itemId]: newLevel
        }
      };

      // Lưu lên Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { progress: newProgress }, { merge: true }).catch(err => {
        console.error("Lỗi cập nhật tiến độ lên server:", err);
      });

      return newProgress;
    });
  };

  // Hàm nâng lên level 4 (dành riêng cho lúc thi cuối kỳ)
  const promoteToLevel4 = async (category, itemId) => {
    if (!currentUser || !progress) return;
    
    const updatedCategory = {
      ...progress[category],
      [itemId]: 4
    };
    
    const newProgress = {
      ...progress,
      [category]: updatedCategory
    };

    setProgress(newProgress);

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, { progress: newProgress }, { merge: true });
    } catch (error) {
      console.error("Lỗi cập nhật tiến độ thi:", error);
    }
  };

  const getLevel = (category, itemId) => {
    if (!progress || !progress[category] || progress[category][itemId] === undefined) return undefined;
    return progress[category][itemId];
  };

  const getGlobalProgressPercentage = () => {
    if (!progress) return 0;
    const totalItems = 21 + 36 + 4 + 1600 + 20 + 4 + 3; // 1688
    let currentScore = 0;
    ['initials', 'finals', 'tones', 'syllables', 'tonePairs', 'spellingRules', 'sandhiRules'].forEach(cat => {
      if (progress[cat]) {
        Object.values(progress[cat]).forEach(val => {
          currentScore += Math.min(3, val); // Capped at Level 3 for 100% logic
        });
      }
    });
    const maxScore = totalItems * 3;
    if (maxScore === 0) return 0;
    let pct = (currentScore / maxScore) * 100;
    if (pct > 0 && pct < 1) pct = Number(pct.toFixed(2));
    else pct = Math.floor(pct); // Always floor so 99.9% doesn't round up to 100%
    return pct;
  };

  const processExamResults = async (results, passed) => {
    if (!currentUser || !progress) return;
    
    let newProgress = { ...progress };
    let hasChanges = false;
    
    results.forEach(result => {
      const { category, itemId, correctCount, totalCount } = result;
      const currentLevel = newProgress[category]?.[itemId] || 0;
      
      if (correctCount < totalCount) {
        // Sai 1 câu trở lên -> Phạt tụt về level 2
        if (currentLevel > 2) {
          if (!newProgress[category]) newProgress[category] = {};
          newProgress[category] = { ...newProgress[category], [itemId]: 2 };
          hasChanges = true;
        }
      } else if (correctCount === totalCount && passed) {
        // Đúng toàn bộ 3/3 và thi đậu -> Lên Level 4 (Ra quả)
        if (!newProgress[category]) newProgress[category] = {};
        newProgress[category] = { ...newProgress[category], [itemId]: 4 };
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setProgress(newProgress);
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, { progress: newProgress }, { merge: true });
      } catch (error) {
        console.error("Lỗi cập nhật kết quả bài thi:", error);
      }
    }
  };

  const value = {
    progress,
    loading,
    updateScore,
    promoteToLevel4,
    getLevel,
    getGlobalProgressPercentage,
    processExamResults
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
