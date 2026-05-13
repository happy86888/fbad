import React from 'react';
import { Zap, X, RefreshCw } from 'lucide-react';

export default function BatchModal({
  show, onClose,
  batchProducts, setBatchProducts,
  batchRunning, batchProgress,
  apiKey, useAPI, onRun
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => !batchRunning && onClose()}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="font-sans-bold text-lg">批次生成</h3>
          </div>
          {!batchRunning && <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>}
        </div>

        {!batchRunning ? (
          <>
            <p className="text-sm text-zinc-400 mb-3">一次輸入多個產品名稱(每行一個),系統會自動跑完所有產品的廣告生成。產業類別與其他設定會共用。</p>
            <textarea value={batchProducts} onChange={(e) => setBatchProducts(e.target.value)} rows="8"
              placeholder={'產品 A\n產品 B\n產品 C\n...'}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:border-amber-400 focus:outline-none text-sm font-mono mb-3" />
            <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3 mb-4 text-xs">
              <p className="text-amber-400 font-bold mb-1">⚠️ 注意</p>
              <p className="text-zinc-300">每組約消耗 $0.01-0.05 token,5 個產品 ≈ $0.05-0.25。完成後請至「歷史紀錄」查看。</p>
            </div>
            <button onClick={onRun} disabled={!apiKey || !useAPI}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 font-bold py-3 rounded-lg disabled:opacity-50">
              開始批次生成 ({batchProducts.split('\n').filter(p => p.trim()).length} 個產品)
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <RefreshCw className="w-12 h-12 text-amber-400 mx-auto mb-4 animate-spin" />
            <p className="font-bold text-lg mb-2">批次生成中...</p>
            <p className="font-mono text-sm text-zinc-400 mb-4">{batchProgress.current} / {batchProgress.total}</p>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
