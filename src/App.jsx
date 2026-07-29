import React from 'react';
import PinyinTable from './components/PinyinTable';

function App() {
  return (
    <div className="container">
      <header className="animate-fade-in">
        <h1>Bảng Pinyin Tiếng Trung</h1>
        <p className="subtitle">
          Bảng tổng hợp 405 âm tiết tiếng Trung giúp bạn luyện phát âm chuẩn. <br />
          Bấm vào từng âm tiết để nghe phát âm thanh điệu (chuẩn giọng đọc bản xứ qua TTS).
        </p>
      </header>
      
      <main>
        <PinyinTable />
      </main>

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p>© 2026 Bảng Pinyin Tiếng Trung. Dự án mã nguồn mở.</p>
      </footer>
    </div>
  );
}

export default App;
