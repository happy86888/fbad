import React from 'react';
import { Copy, Check } from 'lucide-react';

export default function VideoScripts({ scripts, copyToClipboard, copiedItem }) {
  return (
    <div className="space-y-4">
      {scripts.map((script, sIdx) => (
        <div key={sIdx} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-950/40 to-zinc-950 px-6 py-3 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="font-display text-pink-400 text-2xl">▶ #{sIdx + 1}</span>
              <span className="font-mono text-xs text-zinc-400">{script.angle}</span>
            </div>
            <button onClick={() => copyToClipboard(
              `【影片腳本 #${sIdx + 1}】\n切角:${script.angle}\n\nHOOK (0-3秒):\n${script.hook}\n\n分鏡:\n${script.scenes.map(s => `[${s.timeRange}] ${s.visual}\n旁白:${s.voiceover}\nB-Roll:${s.bRoll || '無'}`).join('\n\n')}\n\nCTA:${script.cta}\n配樂:${script.musicMood}\n\n發布貼文:\n${script.caption}`,
              `video-${sIdx}`
            )} className="text-xs font-mono text-zinc-400 hover:text-pink-400 flex items-center gap-1">
              {copiedItem === `video-${sIdx}` ? <><Check className="w-3.5 h-3.5" />已複製</> : <><Copy className="w-3.5 h-3.5" />複製腳本</>}
            </button>
          </div>
          <div className="p-6 space-y-5">
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
              <div className="font-mono text-xs text-pink-400 mb-1">HOOK · 開場 0-3 秒</div>
              <div className="text-lg font-bold text-zinc-100">{script.hook}</div>
            </div>

            <div>
              <div className="font-mono text-xs text-zinc-500 mb-3">分鏡 SCENES</div>
              <div className="space-y-3">
                {script.scenes.map((scene, scIdx) => (
                  <div key={scIdx} className="flex gap-4">
                    <div className="flex-shrink-0 w-20 text-right">
                      <div className="font-mono text-xs text-amber-400 font-bold">{scene.timeRange}</div>
                    </div>
                    <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 space-y-1.5">
                      <div className="text-sm text-zinc-200"><span className="font-mono text-xs text-zinc-500">🎬 畫面:</span> {scene.visual}</div>
                      <div className="text-sm text-zinc-300"><span className="font-mono text-xs text-zinc-500">🎙️ 旁白:</span> {scene.voiceover}</div>
                      {scene.bRoll && <div className="text-xs text-zinc-400"><span className="font-mono text-zinc-500">📹 B-Roll:</span> {scene.bRoll}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-4">
              <div className="font-mono text-xs text-amber-400 mb-1">CTA · 結尾</div>
              <div className="text-base font-bold text-zinc-100">{script.cta}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-zinc-950 rounded-lg p-3">
                <div className="font-mono text-xs text-zinc-500 mb-1">🎵 配樂氛圍</div>
                <div className="text-sm text-zinc-300">{script.musicMood}</div>
              </div>
              <div className="bg-zinc-950 rounded-lg p-3">
                <div className="font-mono text-xs text-zinc-500 mb-1">📝 發布貼文</div>
                <div className="text-sm text-zinc-300 whitespace-pre-line">{script.caption}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
