import React from 'react';
import { Sparkles, RefreshCw, FileDown, FileSpreadsheet, FileText, Copy, Check } from 'lucide-react';
import { LANGUAGES } from '../data/constants';
import VariantCard from './VariantCard';
import VideoScripts from './VideoScripts';

export default function ResultsSection({
  generated, activeTab, setActiveTab,
  aiScores, scoring, onScoreAds,
  videoScripts, generatingVideo, onGenerateVideo,
  apiKey, exporting, onExportPDF, onExportExcel,
  copiedItem, copyToClipboard,
  // VariantCard props
  cardProps
}) {
  if (!generated) return null;

  return (
    <div className="slide-up">
      {/* 頂部資訊列 + 工具列 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {generated.source === 'api' && generated.usage && (
            <div className="inline-block bg-amber-400/10 border border-amber-400/30 rounded-lg px-3 py-1.5 font-mono text-xs text-amber-400">
              ✓ GPT 成功 · {generated.usage.total_tokens} tokens
            </div>
          )}
          {generated.language && generated.language !== 'zh-TW' && (
            <div className="inline-block bg-pink-400/10 border border-pink-400/30 rounded-lg px-3 py-1.5 font-mono text-xs text-pink-400">
              {LANGUAGES.find(l => l.id === generated.language)?.flag} {LANGUAGES.find(l => l.id === generated.language)?.name}
            </div>
          )}
          {generated.competitorAnalysis && (
            <div className="inline-block bg-pink-400/10 border border-pink-400/30 rounded-lg px-3 py-1.5 font-mono text-xs text-pink-400">
              🎯 含競品分析
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={onScoreAds} disabled={scoring || !apiKey}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-700 hover:border-green-400 rounded-lg text-sm transition disabled:opacity-50">
            {scoring ? <RefreshCw className="w-4 h-4 animate-spin text-green-400" /> : <Sparkles className="w-4 h-4 text-green-400" />}
            AI 評分
          </button>
          <button onClick={onGenerateVideo} disabled={generatingVideo || !apiKey}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-700 hover:border-pink-400 rounded-lg text-sm transition disabled:opacity-50">
            {generatingVideo ? <RefreshCw className="w-4 h-4 animate-spin text-pink-400" /> : <Sparkles className="w-4 h-4 text-pink-400" />}
            影片腳本
          </button>
          <button onClick={onExportPDF} disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-700 hover:border-amber-400 rounded-lg text-sm transition">
            <FileDown className="w-4 h-4 text-amber-400" />匯出 PDF
          </button>
          <button onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-700 hover:border-green-400 rounded-lg text-sm transition">
            <FileSpreadsheet className="w-4 h-4 text-green-400" />匯出 Excel
          </button>
        </div>
      </div>

      {/* AI 評分總結 */}
      {aiScores[generated.id] && (
        <div className="mb-6 bg-gradient-to-br from-green-950/30 to-zinc-900 border border-green-400/30 rounded-2xl p-5 slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-400" />
              <h3 className="font-sans-bold text-lg">AI 評分結果</h3>
            </div>
            {aiScores[generated.id].bestId && (
              <div className="text-xs font-mono text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/30">
                🏆 推薦使用 #{parseInt(aiScores[generated.id].bestId.split('-')[0]) + 1}-{aiScores[generated.id].bestId.split('-')[1] === '0' ? 'A' : 'B'}
              </div>
            )}
          </div>
          <p className="text-sm text-zinc-300 mb-3 leading-relaxed">{aiScores[generated.id].summary}</p>
        </div>
      )}

      {/* Tab 切換 */}
      <div className="flex gap-2 mb-6 border-b border-zinc-800 overflow-x-auto">
        <button onClick={() => setActiveTab('copy')}
          className={`px-4 py-3 font-mono text-sm transition relative whitespace-nowrap ${activeTab === 'copy' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <FileText className="w-4 h-4 inline mr-2" />文案 + 圖片 (A/B 版)
          {activeTab === 'copy' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"></div>}
        </button>
        {videoScripts[generated.id] && (
          <button onClick={() => setActiveTab('video')}
            className={`px-4 py-3 font-mono text-sm transition relative whitespace-nowrap ${activeTab === 'video' ? 'text-pink-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Sparkles className="w-4 h-4 inline mr-2" />影片腳本 (Reels/Shorts)
            {activeTab === 'video' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400"></div>}
          </button>
        )}
        <button onClick={() => setActiveTab('prompt')}
          className={`px-4 py-3 font-mono text-sm transition relative whitespace-nowrap ${activeTab === 'prompt' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
          <Sparkles className="w-4 h-4 inline mr-2" />GPT 指令
          {activeTab === 'prompt' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400"></div>}
        </button>
      </div>

      {/* Tab 內容 */}
      {activeTab === 'copy' && (
        <div className="space-y-6">
          {generated.copies.map((copy, idx) => {
            const currentAB = cardProps.activeVariant[idx] || 0;
            return (
              <VariantCard
                key={idx}
                copy={copy}
                idx={idx}
                currentAB={currentAB}
                generated={generated}
                aiScores={aiScores}
                copyToClipboard={copyToClipboard}
                copiedItem={copiedItem}
                apiKey={apiKey}
                {...cardProps}
              />
            );
          })}
        </div>
      )}

      {activeTab === 'video' && videoScripts[generated.id] && (
        <VideoScripts scripts={videoScripts[generated.id].scripts} copyToClipboard={copyToClipboard} copiedItem={copiedItem} />
      )}

      {activeTab === 'prompt' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="bg-zinc-950 px-6 py-3 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs text-zinc-400">複製 → 貼到 ChatGPT / Claude</span>
            </div>
            <button onClick={() => copyToClipboard(generated.gptPrompt, 'prompt')}
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400 transition">
              {copiedItem === 'prompt' ? <><Check className="w-3.5 h-3.5" />已複製</> : <><Copy className="w-3.5 h-3.5" />複製 Prompt</>}
            </button>
          </div>
          <div className="p-6">
            <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-950 p-5 rounded-lg border border-zinc-800 overflow-x-auto">{generated.gptPrompt}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
