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
    if (!progress || !progress[category]) return 0;
    return progress[category][itemId] || 0;
  };

  const value = {
    progress,
    loading,
    updateScore,
    promoteToLevel4,
    getLevel
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
