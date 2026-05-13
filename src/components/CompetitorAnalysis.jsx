import React from 'react';
import { TrendingUp, ChevronRight, RefreshCw, Search } from 'lucide-react';

export default function CompetitorAnalysis({
  show, setShow,
  competitorUrls, setCompetitorUrls,
  competitorText, setCompetitorText,
  competitorAnalyzing,
  competitorAnalysis, setCompetitorAnalysis,
  apiKey, onAnalyze
}) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 to-red-950/10 border border-zinc-800 rounded-2xl mb-6 overflow-hidden">
      <button onClick={() => setShow(!show)} className="w-full p-6 flex items-center justify-between hover:bg-zinc-900/50 transition">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-pink-400" />
          <h3 className="font-sans-bold text-lg">競品分析 (選用)</h3>
          {competitorAnalysis && <span className="font-mono text-xs text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded">已分析</span>}
        </div>
        <ChevronRight className={`w-5 h-5 transition ${show ? 'rotate-90' : ''}`} />
      </button>

      {show && (
        <div className="px-6 pb-6 space-y-3 slide-up">
          <p className="text-sm text-zinc-400">輸入競品的 FB 廣告連結或直接貼上他們的文案,讓 GPT 反推策略並建議差異化切角。</p>
          <div>
            <label className="font-mono text-xs text-zinc-500 mb-1.5 block">競品連結 (一行一個)</label>
            <textarea value={competitorUrls} onChange={(e) => setCompetitorUrls(e.target.value)} rows="2"
              placeholder="https://www.facebook.com/example/posts/123..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:border-pink-400 focus:outline-none text-sm font-mono" />
          </div>
          <div>
            <label className="font-mono text-xs text-zinc-500 mb-1.5 block">或直接貼上競品文案內容</label>
            <textarea value={competitorText} onChange={(e) => setCompetitorText(e.target.value)} rows="4"
              placeholder="把競品的廣告文字內容貼進來..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 focus:border-pink-400 focus:outline-none text-sm" />
          </div>
          <button onClick={onAnalyze} disabled={competitorAnalyzing || !apiKey}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50">
            {competitorAnalyzing ? <><RefreshCw className="w-4 h-4 animate-spin" />分析中...</> : <><Search className="w-4 h-4" />開始分析競品</>}
          </button>
          {!apiKey && <p className="font-mono text-xs text-amber-400">⚠️ 需要 OpenAI API Key 才能使用競品分析</p>}

          {competitorAnalysis && (
            <div className="space-y-3 mt-4 bg-zinc-950 p-5 rounded-lg border border-pink-400/30 slide-up">
              <div>
                <h4 className="font-bold text-pink-400 text-sm mb-1">📋 策略總結</h4>
                <p className="text-sm text-zinc-300">{competitorAnalysis.summary}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className="font-bold text-pink-400 mb-1">🎯 他們戳的痛點</h4>
                  <ul className="text-zinc-300 space-y-1">{competitorAnalysis.painPoints.map((p, i) => <li key={i}>• {p}</li>)}</ul>
                </div>
                <div>
                  <h4 className="font-bold text-pink-400 mb-1">💎 主打價值</h4>
                  <ul className="text-zinc-300 space-y-1">{competitorAnalysis.valueProps.map((p, i) => <li key={i}>• {p}</li>)}</ul>
                </div>
                <div>
                  <h4 className="font-bold text-amber-400 mb-1">⚠️ 他們的弱點</h4>
                  <ul className="text-zinc-300 space-y-1">{competitorAnalysis.weaknesses.map((p, i) => <li key={i}>• {p}</li>)}</ul>
                </div>
                <div>
                  <h4 className="font-bold text-amber-400 mb-1">🚀 我們的差異化</h4>
                  <ul className="text-zinc-300 space-y-1">{competitorAnalysis.ourAdvantages.map((p, i) => <li key={i}>• {p}</li>)}</ul>
                </div>
              </div>
              <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3">
                <h4 className="font-bold text-amber-400 mb-1 text-sm">✨ 建議切角 (會自動套用到下次生成)</h4>
                <ul className="text-zinc-300 space-y-1 text-sm">{competitorAnalysis.recommendedAngles.map((p, i) => <li key={i}>{i + 1}. {p}</li>)}</ul>
              </div>
              <button onClick={() => setCompetitorAnalysis(null)} className="text-xs text-zinc-500 hover:text-red-400 font-mono">清除分析結果</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
