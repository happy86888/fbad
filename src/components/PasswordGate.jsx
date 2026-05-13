import React, { useState, useEffect } from 'react';
import { Flame, Lock, Eye, EyeOff, AlertCircle, ChevronRight, MessageCircle } from 'lucide-react';
import { ACCESS_CODE } from '../data/constants';
import { safeLocalStorage } from '../utils/helpers';

const LINE_URL = 'https://lin.ee/6PuIdSx';
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 天

export default function PasswordGate({ onUnlock }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(null);
  const [remainingTime, setRemainingTime] = useState('');

  // 載入封鎖狀態
  useEffect(() => {
    const blockTime = safeLocalStorage.get('adbot_blocked_until');
    const savedAttempts = parseInt(safeLocalStorage.get('adbot_attempts') || '0');
    setAttempts(savedAttempts);
    if (blockTime) {
      const unblockTime = parseInt(blockTime);
      if (Date.now() < unblockTime) {
        setBlockedUntil(unblockTime);
      } else {
        // 封鎖時間過了,清除狀態
        safeLocalStorage.remove('adbot_blocked_until');
        safeLocalStorage.remove('adbot_attempts');
        setAttempts(0);
      }
    }
  }, []);

  // 倒數計時器
  useEffect(() => {
    if (!blockedUntil) return;
    const updateTime = () => {
      const ms = blockedUntil - Date.now();
      if (ms <= 0) {
        setBlockedUntil(null);
        safeLocalStorage.remove('adbot_blocked_until');
        safeLocalStorage.remove('adbot_attempts');
        setAttempts(0);
        return;
      }
      const days = Math.floor(ms / (24 * 60 * 60 * 1000));
      const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
      setRemainingTime(`${days} 天 ${hours} 小時 ${minutes} 分鐘`);
    };
    updateTime();
    const timer = setInterval(updateTime, 60 * 1000); // 每分鐘更新
    return () => clearInterval(timer);
  }, [blockedUntil]);

  const checkPassword = (e) => {
    if (e) e.preventDefault();
    if (blockedUntil) return;

    if (passwordInput.trim().toLowerCase() === ACCESS_CODE.toLowerCase()) {
      // 通過,清除計數
      setPasswordError('');
      safeLocalStorage.set('adbot_unlocked', 'true');
      safeLocalStorage.remove('adbot_attempts');
      safeLocalStorage.remove('adbot_blocked_until');
      onUnlock();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      safeLocalStorage.set('adbot_attempts', String(newAttempts));
      setPasswordInput('');

      if (newAttempts >= MAX_ATTEMPTS) {
        // 第 3 次:封鎖 5 天
        const blockTime = Date.now() + BLOCK_DURATION_MS;
        safeLocalStorage.set('adbot_blocked_until', String(blockTime));
        setBlockedUntil(blockTime);
      } else if (newAttempts === 2) {
        // 第 2 次:提示加 LINE
        setPasswordError('LINE2');
      } else {
        // 第 1 次:單純錯誤提示
        setPasswordError(`通行碼錯誤 (還剩 ${MAX_ATTEMPTS - newAttempts} 次機會)`);
      }
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
          {blockedUntil ? (
            // 封鎖畫面
            <>
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full border border-red-500/30">
                <Lock className="w-7 h-7 text-red-400" />
              </div>
              <h2 className="font-display text-2xl text-center mb-2 text-red-400">此裝置已被封鎖</h2>
              <p className="text-zinc-300 text-sm text-center mb-6">
                您因連續輸入錯誤通行碼 3 次,此裝置已被封鎖。
              </p>

              <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4 mb-6">
                <div className="font-mono text-xs text-zinc-500 mb-1">剩餘解鎖時間</div>
                <div className="font-display text-xl text-red-300">{remainingTime}</div>
              </div>

              <p className="text-sm text-zinc-400 text-center mb-4">
                如需立即取得通行碼,請私訊 LINE 客服:
              </p>
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
                className="w-full bg-[#06C755] hover:bg-[#05a647] text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                加 LINE 取得通行碼
              </a>
            </>
          ) : (
            // 正常輸入畫面
            <>
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

                {passwordError && passwordError === 'LINE2' && (
                  <div className="bg-amber-950/40 border border-amber-800 rounded-lg px-4 py-3">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-200">
                        通行碼錯誤,還剩 <span className="font-bold">1 次</span>機會。
                        <br />再錯一次將封鎖此裝置 5 天。
                      </p>
                    </div>
                    <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
                      className="block mt-2 bg-[#06C755] hover:bg-[#05a647] text-white font-bold py-2 rounded text-sm text-center transition">
                      <MessageCircle className="w-4 h-4 inline mr-1" />
                      私訊 LINE 取得正確密碼
                    </a>
                  </div>
                )}

                {passwordError && passwordError !== 'LINE2' && (
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

              <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="font-mono text-xs text-zinc-600 text-center mb-3">
                  🔒 此裝置通過後將永久記住
                </p>
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
                  className="block text-center text-xs text-zinc-500 hover:text-[#06C755] transition">
                  <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
                  忘記通行碼? 私訊 LINE 取得
                </a>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-700 font-mono mt-6">
          © 老闆接案學院 · 未經授權禁止使用
        </p>
      </div>
    </div>
  );
}
