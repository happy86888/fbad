import React from 'react';
import { Target, AlertCircle, RefreshCw, Wand2, ChevronRight, Zap } from 'lucide-react';
import { TONES, GOALS } from '../data/constants';

export default function ConditionForm({
  industry, setIndustry,
  product, setProduct,
  audience, setAudience,
  tone, setTone,
  goal, setGoal,
  loading, useAPI, error, hasCompetitor,
  onGenerate, onShowBatch
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-amber-400" />
        <h3 className="font-sans-bold text-xl">設定條件</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="font-mono text-xs text-zinc-500 mb-2 block">產業類別 *</label>
          <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)}
            placeholder="例如:健身房、咖啡店、英文補習班..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:border-amber-400 focus:outline-none" />
        </div>
        <div>
          <label className="font-mono text-xs text-zinc-500 mb-2 block">產品/服務名稱 (選填)</label>
          <input type="text" value={product} onChange={(e) => setProduct(e.target.value)}
            placeholder="例如:私人教練課程"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:border-amber-400 focus:outline-none" />
        </div>
        <div>
          <label className="font-mono text-xs text-zinc-500 mb-2 block">目標受眾 (選填)</label>
          <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)}
            placeholder="例如:25-40 歲上班族女性"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:border-amber-400 focus:outline-none" />
        </div>
        <div>
          <label className="font-mono text-xs text-zinc-500 mb-2 block">廣告語氣</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map(t => (
              <button key={t} onClick={() => setTone(t)}
                className={`px-3 py-2 rounded-lg text-sm transition border ${tone === t ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="font-mono text-xs text-zinc-500 mb-2 block">行銷目標</label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => (
              <button key={g} onClick={() => setGoal(g)}
                className={`px-3 py-2 rounded-lg text-sm transition border ${goal === g ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}>{g}</button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-950/40 border border-red-800 rounded-lg px-4 py-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button onClick={onGenerate} disabled={loading}
          className="flex-1 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:opacity-90 text-zinc-950 font-bold py-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 glow">
          {loading
            ? <><RefreshCw className="w-5 h-5 animate-spin" />{useAPI ? 'GPT 寫故事中...' : '醞釀中...'}</>
            : <><Wand2 className="w-5 h-5" />開始生成 (3 切角 × 2 變體){hasCompetitor && ' · 含競品分析'}<ChevronRight className="w-5 h-5" /></>}
        </button>
        <button onClick={onShowBatch} disabled={!useAPI}
          className="px-5 bg-zinc-900 border border-zinc-700 hover:border-amber-400 rounded-lg font-bold transition disabled:opacity-50 flex items-center gap-2"
          title="批次生成多個產品">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="hidden sm:inline">批次</span>
        </button>
      </div>
    </div>
  );
}
