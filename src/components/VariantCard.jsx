import React from 'react';
import { Shuffle, Heart, Sparkles, FileText, RefreshCw, Image as ImageIcon, ImagePlus, Download, Copy, Check } from 'lucide-react';
import { downloadImage } from '../utils/helpers';

export default function VariantCard({
  copy, idx, currentAB, setActiveVariant, activeVariant,
  generated, aiScores,
  isFavorite, toggleFavorite,
  setPreviewMode,
  regenerating, onRegenerate,
  useAPI, apiKey, enableImageGen,
  imageLoading, onGenerateImage,
  editingVariant, editBuffer, setEditBuffer,
  onStartEdit, onSaveEdit, onCancelEdit,
  copyToClipboard, copiedItem
}) {
  const variant = copy.variants[currentAB];
  const imgKey = `${idx}-${currentAB}`;
  const isEditing = editingVariant && editingVariant.copyIdx === idx && editingVariant.variantIdx === currentAB;

  const fullCopyText = `【${variant.label} · ${copy.style}】\n\n主標題:${variant.headline}\n\n主要文字:\n${variant.primary}\n\n描述:${variant.description}\nCTA:${variant.cta}\n\n圖片 Prompt:\n${variant.imagePrompt}\n\n圖片方向:\n${variant.imageDirection}`;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      {/* 頂部:切角編號 + 工具 */}
      <div className="bg-zinc-950 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-display text-amber-400 text-2xl">#{idx + 1}</span>
          <span className="font-mono text-xs text-zinc-400">{copy.style}</span>
          {variant.edited && <span className="font-mono text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/30">已編輯</span>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
            {copy.variants.map((v, vIdx) => (
              <button key={vIdx} onClick={() => setActiveVariant({ ...activeVariant, [idx]: vIdx })}
                className={`px-3 py-1.5 text-xs font-mono transition ${currentAB === vIdx ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'}`}>
                <Shuffle className="w-3 h-3 inline mr-1" />{v.label}
              </button>
            ))}
          </div>
          <button onClick={() => toggleFavorite(idx, currentAB)}
            className={`text-xs px-2 py-1.5 rounded transition ${isFavorite(idx, currentAB) ? 'bg-pink-500/20 text-pink-400' : 'text-zinc-400 hover:text-pink-400'}`}
            title="加入最愛">❤️</button>
          <button onClick={() => setPreviewMode({ copyIdx: idx, variantIdx: currentAB })}
            className="text-xs px-2 py-1.5 rounded text-zinc-400 hover:text-amber-400 transition" title="FB 廣告預覽">📱</button>
          <button onClick={() => onRegenerate(idx)} disabled={regenerating[`angle-${idx}`] || !useAPI || !apiKey}
            className="text-xs px-2 py-1.5 rounded text-zinc-400 hover:text-amber-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="重新生成這個切角">
            {regenerating[`angle-${idx}`] ? <RefreshCw className="w-3.5 h-3.5 animate-spin inline" /> : '🔄'}
          </button>
          <button onClick={() => copyToClipboard(fullCopyText, `copy-${idx}-${currentAB}`)}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-amber-400 transition px-2 py-1.5">
            {copiedItem === `copy-${idx}-${currentAB}` ? <><Check className="w-3.5 h-3.5" />已複製</> : <><Copy className="w-3.5 h-3.5" />複製</>}
          </button>
        </div>
      </div>

      {/* AI 評分 */}
      {aiScores[generated.id] && (() => {
        const score = aiScores[generated.id].scores?.find(s => s.id === `${idx}-${currentAB}`);
        if (!score) return null;
        const overall = parseFloat(score.overall);
        const colorClass = overall >= 8 ? 'text-green-400 bg-green-400' : overall >= 6 ? 'text-amber-400 bg-amber-400' : 'text-red-400 bg-red-400';
        const textColor = colorClass.split(' ')[0];
        const bgColor = colorClass.split(' ')[1];
        return (
          <div className="px-6 py-3 bg-zinc-950 border-b border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 ${textColor}`} />
                <span className="font-mono text-xs text-zinc-400">AI 評分</span>
              </div>
              <div className={`font-display text-2xl ${textColor}`}>{overall.toFixed(1)}/10</div>
            </div>
            <div className="grid grid-cols-5 gap-2 text-xs mb-2">
              {[
                { name: '鉤子', val: score.hookStrength },
                { name: '情感', val: score.emotion },
                { name: '清晰', val: score.clarity },
                { name: 'CTA', val: score.cta },
                { name: '差異', val: score.uniqueness }
              ].map(s => (
                <div key={s.name} className="text-center">
                  <div className="text-zinc-500 font-mono mb-1">{s.name}</div>
                  <div className="bg-zinc-800 rounded h-1.5 overflow-hidden">
                    <div className={`h-full ${bgColor}`} style={{ width: `${s.val * 10}%` }}></div>
                  </div>
                  <div className="text-zinc-400 font-mono mt-0.5">{s.val}</div>
                </div>
              ))}
            </div>
            {score.suggestion && (
              <div className="text-xs text-zinc-400 mt-2 bg-zinc-900 p-2 rounded">
                💡 <span className="text-zinc-300">{score.suggestion}</span>
              </div>
            )}
          </div>
        );
      })()}

      {/* Part A: 文案 */}
      <div className="p-6 space-y-5 border-b border-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-zinc-500" />
            <span className="font-mono text-xs text-zinc-500">PART A · 故事文案 ({variant.label})</span>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <button onClick={onSaveEdit} className="text-xs bg-amber-400 text-zinc-950 font-bold px-3 py-1 rounded">儲存</button>
              <button onClick={onCancelEdit} className="text-xs px-3 py-1 border border-zinc-700 rounded text-zinc-400 hover:text-white">取消</button>
            </div>
          ) : (
            <button onClick={() => onStartEdit(idx, currentAB)} className="text-xs text-zinc-400 hover:text-amber-400 font-mono">✏️ 編輯</button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <div className="font-mono text-xs text-zinc-500 mb-1.5">主標題</div>
              <input value={editBuffer.headline} onChange={(e) => setEditBuffer({ ...editBuffer, headline: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <div className="font-mono text-xs text-zinc-500 mb-1.5">主要文字</div>
              <textarea value={editBuffer.primary} onChange={(e) => setEditBuffer({ ...editBuffer, primary: e.target.value })} rows="10"
                className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm leading-loose" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-1.5">描述</div>
                <input value={editBuffer.description} onChange={(e) => setEditBuffer({ ...editBuffer, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm" />
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-1.5">CTA</div>
                <input value={editBuffer.cta} onChange={(e) => setEditBuffer({ ...editBuffer, cta: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="font-mono text-xs text-zinc-500 mb-2">HEADLINE / 主標題</div>
              <div className="font-display text-xl leading-tight text-amber-100">{variant.headline}</div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-xs text-zinc-500">PRIMARY TEXT / 主要文字</div>
                <button onClick={() => copyToClipboard(variant.primary, `pt-${idx}-${currentAB}`)}
                  className="text-xs font-mono text-zinc-500 hover:text-amber-400 flex items-center gap-1">
                  {copiedItem === `pt-${idx}-${currentAB}` ? <><Check className="w-3 h-3" />已複製</> : <><Copy className="w-3 h-3" />複製</>}
                </button>
              </div>
              <div className="text-[15px] text-zinc-200 whitespace-pre-line bg-zinc-950 p-5 rounded-lg border border-zinc-800 leading-loose">{variant.primary}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-1.5">DESCRIPTION</div>
                <div className="text-sm text-zinc-300">{variant.description}</div>
              </div>
              <div>
                <div className="font-mono text-xs text-zinc-500 mb-1.5">CTA BUTTON</div>
                <div className="inline-block bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 px-4 py-1.5 rounded font-bold text-sm">{variant.cta}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Part B: 圖片 */}
      <div className="p-6 space-y-4 bg-gradient-to-br from-zinc-900 to-amber-950/10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs text-amber-400">PART B · 電影感圖片</span>
          </div>
          {enableImageGen && (
            <button onClick={() => onGenerateImage(idx, currentAB)} disabled={imageLoading[imgKey] || !apiKey}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
              {imageLoading[imgKey]
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />DALL-E 出圖中...</>
                : <><ImagePlus className="w-3.5 h-3.5" />{variant.generatedImage ? '重新生成' : 'DALL-E 出圖'}</>}
            </button>
          )}
        </div>

        {variant.generatedImage && (
          <div className="rounded-lg overflow-hidden border border-amber-400/30 bg-zinc-950">
            <img src={variant.generatedImage} alt="DALL-E 生成" className="w-full h-auto" />
            <div className="p-3 flex items-center justify-between bg-zinc-950">
              <span className="font-mono text-xs text-zinc-500">⚠️ 連結 1 小時後失效</span>
              <button onClick={() => downloadImage(variant.generatedImage, `adbot-${idx + 1}-${variant.label}.png`)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
                <Download className="w-3.5 h-3.5" />下載
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="font-mono text-xs text-zinc-500">IMAGE PROMPT (英文)</div>
            <button onClick={() => copyToClipboard(variant.imagePrompt, `img-${idx}-${currentAB}`)}
              className="text-xs font-mono text-zinc-500 hover:text-amber-400 flex items-center gap-1">
              {copiedItem === `img-${idx}-${currentAB}` ? <><Check className="w-3 h-3" />已複製</> : <><Copy className="w-3 h-3" />複製</>}
            </button>
          </div>
          <div className="text-sm text-zinc-200 bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono leading-relaxed">{variant.imagePrompt}</div>
        </div>
        <div>
          <div className="font-mono text-xs text-zinc-500 mb-1.5">這張圖在拍什麼 · 為什麼這樣搭</div>
          <div className="text-sm text-zinc-300 whitespace-pre-line bg-amber-400/5 border border-amber-400/20 p-4 rounded-lg leading-relaxed">{variant.imageDirection}</div>
        </div>
      </div>
    </div>
  );
}
