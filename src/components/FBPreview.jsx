import React from 'react';
import { X, Image as ImageIcon } from 'lucide-react';

export default function FBPreview({ previewMode, generated, onClose }) {
  if (!previewMode || !generated) return null;

  const v = generated.copies[previewMode.copyIdx].variants[previewMode.variantIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md slide-up overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-zinc-100 px-4 py-3 flex items-center justify-between border-b border-zinc-200">
          <div className="text-zinc-900 font-bold text-sm">📱 FB 廣告預覽</div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-900"><X className="w-5 h-5" /></button>
        </div>
        <div className="bg-white">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold">{generated.industry.slice(0, 1)}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-zinc-900 truncate">{generated.industry}</div>
              <div className="text-xs text-zinc-500">贊助 · <span className="text-zinc-400">🌐</span></div>
            </div>
            <div className="text-zinc-400">⋯</div>
          </div>
          <div className="px-4 pb-3 text-sm text-zinc-900 whitespace-pre-line leading-relaxed">{v.primary}</div>
          {v.generatedImage ? (
            <img src={v.generatedImage} alt="廣告圖" className="w-full" />
          ) : (
            <div className="aspect-square bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center text-zinc-400">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-xs">(尚未生成圖片)</p>
              </div>
            </div>
          )}
          <div className="bg-zinc-50 px-4 py-2.5 border-t border-zinc-200 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="text-xs text-zinc-500 uppercase">{generated.industry}.com</div>
              <div className="text-sm font-bold text-zinc-900 line-clamp-1">{v.headline}</div>
              <div className="text-xs text-zinc-500 line-clamp-1">{v.description}</div>
            </div>
            <button className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900 px-3 py-1.5 rounded text-sm font-bold whitespace-nowrap ml-3">{v.cta}</button>
          </div>
          <div className="px-4 py-2 flex items-center gap-6 text-zinc-500 text-sm border-t border-zinc-200">
            <span>👍 讚</span><span>💬 留言</span><span>↗ 分享</span>
          </div>
        </div>
      </div>
    </div>
  );
}
