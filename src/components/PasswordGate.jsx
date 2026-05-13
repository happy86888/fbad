import React, { useState } from 'react';
import { Flame, Lock, Eye, EyeOff, AlertCircle, ChevronRight } from 'lucide-react';
import { ACCESS_CODE } from '../data/constants';
import { safeLocalStorage } from '../utils/helpers';

export default function PasswordGate({ onUnlock }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const checkPassword = (e) => {
    if (e) e.preventDefault();
    if (passwordInput.trim().toLowerCase() === ACCESS_CODE.toLowerCase()) {
      setPasswordError('');
      safeLocalStorage.set('adbot_unlocked', 'true');
      onUnlock();
    } else {
      setPasswordError('通行碼錯誤,請再試一次');
      setPasswordInput('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl float-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl float-2"></div>

      <div className="relative z-10 w-full max-w-md fade-in">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center glow-lock">
            <Flame className="w-8 h-8 text-zinc-950" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-2xl leading-tight">
              <span className="text-zinc-300">老闆接案學院</span><br />
              <span className="gradient-text">AD/BOT</span>
            </h1>
          </div>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-amber-400/10 rounded-full border border-amber-400/30">
            <Lock className="w-7 h-7 text-amber-400" />
          </div>

          <h2 className="font-display text-2xl text-center mb-2">內部專用工具</h2>
          <p className="text-zinc-400 text-sm text-center mb-6">請輸入通行碼以進入</p>

          <form onSubmit={checkPassword} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(''); }}
                placeholder="通行碼"
                autoFocus
                className={`w-full bg-zinc-950 border rounded-lg px-4 py-3.5 pr-12 focus:border-amber-400 focus:outline-none text-center font-mono text-lg tracking-widest ${passwordError ? 'border-red-500 shake' : 'border-zinc-800'}`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {passwordError && (
              <div className="bg-red-950/40 border border-red-800 rounded-lg px-4 py-2.5 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-300">{passwordError}</p>
              </div>
            )}

            <button type="submit"
              className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:opacity-90 text-zinc-950 font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2">
              進入 AD/BOT
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>

          <p className="font-mono text-xs text-zinc-600 text-center mt-6">
            🔒 此裝置通過後將永久記住,不再要求輸入
          </p>
        </div>

        <p className="text-center text-xs text-zinc-700 font-mono mt-6">
          © 老闆接案學院 · 未經授權禁止使用
        </p>
      </div>
    </div>
  );
}
