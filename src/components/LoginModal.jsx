import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, User, Lock, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Vui lòng nhập tên của bé.');
      return;
    }

    setLoading(true);

    // Chuyển đổi tên thành định dạng email giả cho Firebase
    const fakeEmail = `${username.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@pinyin.app`;
    // Padding password để qua được rào cản 6 ký tự tối thiểu của Firebase
    const paddedPassword = `${password}App123!`;

    try {
      if (isLogin) {
        await login(fakeEmail, paddedPassword);
      } else {
        await signup(fakeEmail, paddedPassword, username.trim());
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Tên này đã có bạn khác chọn, bé hãy thử thêm số vào sau tên nhé (VD: Bún 123).');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError('Tên hoặc mật khẩu không đúng.');
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-800 mb-2">
              {isLogin ? 'Vào Lớp Học' : 'Tạo Tài Khoản Mới'}
            </h2>
            <p className="text-sm text-slate-500">
              {isLogin 
                ? 'Nhập tên của bé để xem tiến độ trồng cây Pinyin' 
                : 'Đăng ký tài khoản cực nhanh chỉ cần tên và mật khẩu'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg flex items-start gap-2 border border-red-100">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tên của bé (Viết liền không dấu)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-medium"
                  placeholder="VD: bebun"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Mật khẩu (có thể dùng 1234...)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-medium"
                  placeholder="••••"
                  required
                  minLength={4}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-rose-200 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                isLogin ? 'Vào Lớp Ngay' : 'Tạo Tài Khoản'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-medium text-slate-500">
            {isLogin ? 'Bé chưa có tài khoản? ' : 'Bé đã có tài khoản? '}
            <button 
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-rose-600 hover:text-rose-700 font-bold hover:underline"
            >
              {isLogin ? 'Đăng ký nhanh' : 'Đăng nhập ngay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
