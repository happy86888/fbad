import React, { useState } from 'react';
import { Key, Eye, EyeOff, ExternalLink, Zap } from 'lucide-react';
import { OPENAI_MODELS, GROQ_MODELS, IMAGE_MODELS } from '../data/constants';

export default function ApiSettings({
  provider, // 'openai' 或 'groq' - groq 只有透過 ?groq 才會切到
  apiKey, setApiKey,
  model, setModel,
  imageModel, setImageModel,
  useAPI, setUseAPI,
  enableImageGen, setEnableImageGen,
  groqMode  // 是否為隱藏的 Groq 測試模式
}) {
  const [showApiKey, setShowApiKey] = useState(false);

  const models = provider === 'groq' ? GROQ_MODELS : OPENAI_MODELS;

  // Groq 模式的視覺(粉紅警告色,讓你一眼看出在測試模式)
  const isGroqMode = provider === 'groq';
  const accentColor = isGroqMode ? 'pink' : 'amber';
  const keyHint = isGroqMode ? 'gsk_...' : 'sk-...';
  const keyUrl = isGroqMode
    ? 'https://console.groq.com/keys'
    : 'https://platform.openai.com/api-keys';

  return (
    <div className={`bg-gradient-to-br from-zinc-900 to-zinc-900/50 border rounded-2xl p-6 mb-6 ${isGroqMode ? 'border-pink-500/50' : 'border-zinc-800'}`}>
      {/* Groq 隱藏模式提示(只有你看到) */}
      {isGroqMode && (
        <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg px-3 py-2 mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-pink-400" />
          <span className="text-xs font-mono text-pink-300">🔧 開發者測試模式 (Groq) · 學員看不到此模式</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Key className={`w-5 h-5 ${isGroqMode ? 'text-pink-400' : 'text-amber-400'}`} />
          <h3 className="font-sans-bold text-lg">
            {isGroqMode ? 'Groq API 設定' : 'OpenAI API 設定'}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="font-mono text-xs text-zinc-400">
              {isGroqMode ? '使用 Groq API' : '使用 GPT API'}
            </span>
            <div onClick={() => setUseAPI(!useAPI)}
              className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${
                useAPI
                  ? (isGroqMode ? 'bg-pink-400' : 'bg-amber-400')
                  : 'bg-zinc-700'
              }`}>
              <div className={`w-5 h-5 bg-white rounded-full transition ${useAPI ? 'translate-x-5' : ''}`}></div>
            </div>
          </label>
          {!isGroqMode && (
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="font-mono text-xs text-zinc-400">DALL-E 出圖</span>
              <div onClick={() => setEnableImageGen(!enableImageGen)}
                className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${enableImageGen ? 'bg-amber-400' : 'bg-zinc-700'}`}>
                <div className={`w-5 h-5 bg-white rounded-full transition ${enableImageGen ? 'translate-x-5' : ''}`}></div>
              </div>
            </label>
          )}
        </div>
      </div>

      {(useAPI || enableImageGen) && (
        <div className="space-y-3 slide-up">
          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-mono text-xs text-zinc-500">
                {isGroqMode ? 'Groq API Key' : 'OpenAI API Key'}
              </label>
              <a href={keyUrl} target="_blank" rel="noopener noreferrer"
                className={`flex items-center gap-1 text-xs ${isGroqMode ? 'text-pink-400 hover:text-pink-300' : 'text-amber-400 hover:text-amber-300'}`}>
                取得 Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative">
              <input type={showApiKey ? 'text' : 'password'} value={apiKey}
                onChange={(e) => setApiKey(e.target.value)} placeholder={keyHint}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 pr-10 focus:border-amber-400 focus:outline-none font-mono text-sm" />
              <button onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Model 選擇 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {useAPI && (
              <div>
                <label className="font-mono text-xs text-zinc-500 mb-1.5 block">文案模型</label>
                <select value={model} onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 focus:border-amber-400 focus:outline-none text-sm">
                  {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            )}
            {enableImageGen && !isGroqMode && (
              <div>
                <label className="font-mono text-xs text-zinc-500 mb-1.5 block">圖片模型</label>
                <select value={imageModel} onChange={(e) => setImageModel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 focus:border-amber-400 focus:outline-none text-sm">
                  {IMAGE_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            )}
          </div>

          <p className="font-mono text-xs text-zinc-500">
            🔒 Key 儲存在 localStorage。
            {!isGroqMode && ' 💰 GPT-4o mini ≈ $0.01/組、DALL-E 3 ≈ $0.04/張。'}
            {isGroqMode && ' ⚡ Groq 免費,速度快,測試用。'}
          </p>
        </div>
      )}
    </div>
  );
}
