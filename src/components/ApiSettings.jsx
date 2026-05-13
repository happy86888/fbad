import React, { useState } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { GPT_MODELS, IMAGE_MODELS } from '../data/constants';

export default function ApiSettings({
  apiKey, setApiKey,
  model, setModel,
  imageModel, setImageModel,
  useAPI, setUseAPI,
  enableImageGen, setEnableImageGen
}) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-amber-400" />
          <h3 className="font-sans-bold text-lg">OpenAI API 設定</h3>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="font-mono text-xs text-zinc-400">GPT 寫文案</span>
            <div onClick={() => setUseAPI(!useAPI)}
              className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${useAPI ? 'bg-amber-400' : 'bg-zinc-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition ${useAPI ? 'translate-x-5' : ''}`}></div>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="font-mono text-xs text-zinc-400">DALL-E 出圖</span>
            <div onClick={() => setEnableImageGen(!enableImageGen)}
              className={`w-11 h-6 rounded-full p-0.5 transition cursor-pointer ${enableImageGen ? 'bg-amber-400' : 'bg-zinc-700'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition ${enableImageGen ? 'translate-x-5' : ''}`}></div>
            </div>
          </label>
        </div>
      </div>

      {(useAPI || enableImageGen) && (
        <div className="space-y-3 slide-up">
          <div className="relative">
            <input type={showApiKey ? 'text' : 'password'} value={apiKey}
              onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 pr-10 focus:border-amber-400 focus:outline-none font-mono text-sm" />
            <button onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {useAPI && (
              <div>
                <label className="font-mono text-xs text-zinc-500 mb-1.5 block">文案模型</label>
                <select value={model} onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 focus:border-amber-400 focus:outline-none text-sm">
                  {GPT_MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            )}
            {enableImageGen && (
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
            🔒 Key 儲存在 localStorage。💰 GPT-4o ≈ $0.01/組、DALL-E 3 ≈ $0.04/張。
          </p>
        </div>
      )}
    </div>
  );
}
