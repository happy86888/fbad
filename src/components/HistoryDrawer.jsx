import React from 'react';
import { History, X, Trash2, Clock } from 'lucide-react';
import { LANGUAGES } from '../data/constants';
import { formatTime } from '../utils/helpers';

export default function HistoryDrawer({
  show, onClose,
  history, filteredHistory,
  currentBrand, brands, switchBrand,
  favorites, aiScores,
  onLoad, onDelete, onClearAll
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-zinc-900 border-l border-zinc-800 overflow-y-auto scrollbar-thin slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="font-sans-bold text-lg">歷史紀錄</h3>
            <span className="font-mono text-xs text-zinc-500">
              ({filteredHistory.length}{currentBrand !== 'default' ? `/${history.length}` : ''})
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">
          {currentBrand !== 'default' && (
            <div className="mb-3 px-3 py-2 bg-amber-400/10 border border-amber-400/30 rounded-lg text-xs">
              <span className="text-amber-400 font-bold">📁 目前品牌:</span>{' '}
              <span className="text-zinc-300">{brands.find(b => b.id === currentBrand)?.name || '全部'}</span>
              <button onClick={() => switchBrand('default')} className="ml-2 text-zinc-500 hover:text-amber-400">查看全部</button>
            </div>
          )}
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-mono text-sm">// 還沒有紀錄</div>
          ) : (
            <>
              <button onClick={onClearAll}
                className="w-full mb-3 px-3 py-2 border border-red-800/50 text-red-400 hover:bg-red-950/30 rounded-lg text-sm flex items-center justify-center gap-2 transition">
                <Trash2 className="w-4 h-4" />清空全部
              </button>
              <div className="space-y-2">
                {filteredHistory.map(record => (
                  <div key={record.id}
                    className="bg-zinc-950 border border-zinc-800 hover:border-amber-400/50 rounded-lg p-3 transition cursor-pointer group"
                    onClick={() => onLoad(record)}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">
                          {record.industry}{record.productName && record.productName !== `${record.industry}相關產品/服務` ? ` · ${record.productName}` : ''}
                        </div>
                        <div className="font-mono text-xs text-zinc-500 mt-1 flex items-center gap-2 flex-wrap">
                          <Clock className="w-3 h-3" />{formatTime(record.timestamp)}
                          <span className="text-zinc-700">·</span><span>{record.tone}</span>
                          <span className="text-zinc-700">·</span><span>{record.goal}</span>
                          {record.language && (<><span className="text-zinc-700">·</span><span>{LANGUAGES.find(l => l.id === record.language)?.flag}</span></>)}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          {record.source === 'api' && <span className="font-mono text-amber-400">GPT 生成</span>}
                          {favorites[record.id]?.length > 0 && <span className="font-mono text-pink-400">❤️ {favorites[record.id].length}</span>}
                          {aiScores[record.id] && <span className="font-mono text-green-400">⭐ 已評分</span>}
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); onDelete(record.id); }}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
