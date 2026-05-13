import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, RefreshCw, AlertCircle } from 'lucide-react';

export default function IndustryReview({
  show, onClose, profile, onConfirm, onSkip
}) {
  const [editedProfile, setEditedProfile] = useState(null);

  useEffect(() => {
    if (profile) {
      setEditedProfile({
        ...profile,
        painPoints: [...profile.painPoints]
      });
    }
  }, [profile]);

  if (!show || !editedProfile) return null;

  const updateField = (field, value) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  const updatePainPoint = (idx, value) => {
    const newPoints = [...editedProfile.painPoints];
    newPoints[idx] = value;
    setEditedProfile({ ...editedProfile, painPoints: newPoints });
  };

  const addPainPoint = () => {
    setEditedProfile({ ...editedProfile, painPoints: [...editedProfile.painPoints, ''] });
  };

  const removePainPoint = (idx) => {
    setEditedProfile({
      ...editedProfile,
      painPoints: editedProfile.painPoints.filter((_, i) => i !== idx)
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-zinc-900 border border-amber-400/50 rounded-2xl w-full max-w-2xl my-8 slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-sans-bold text-lg">AI 產業分析結果</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-300 leading-relaxed">
              AI 已分析這個產業的廣告調性。你可以直接確認套用,或調整下方內容讓 AI 寫得更準。
            </p>
          </div>

          {/* 產業分類 */}
          <div>
            <label className="font-mono text-xs text-zinc-500 mb-1.5 block">產業類型</label>
            <input
              type="text"
              value={editedProfile.industryCategory}
              onChange={(e) => updateField('industryCategory', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm"
            />
          </div>

          {/* 鉤子方向 */}
          <div>
            <label className="font-mono text-xs text-zinc-500 mb-1.5 block">
              鉤子方向 (Hook Direction)
            </label>
            <textarea
              value={editedProfile.hookDirection}
              onChange={(e) => updateField('hookDirection', e.target.value)}
              rows="2"
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm"
            />
          </div>

          {/* 痛點清單 */}
          <div>
            <label className="font-mono text-xs text-zinc-500 mb-1.5 block">客戶痛點 (Pain Points)</label>
            <div className="space-y-2">
              {editedProfile.painPoints.map((pp, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={pp}
                    onChange={(e) => updatePainPoint(idx, e.target.value)}
                    className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm"
                  />
                  <button onClick={() => removePainPoint(idx)}
                    className="px-2 text-zinc-500 hover:text-red-400">
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addPainPoint}
                className="w-full py-2 border border-dashed border-zinc-700 hover:border-amber-400 rounded text-sm text-zinc-500 hover:text-amber-400 transition">
                + 新增痛點
              </button>
            </div>
          </div>

          {/* 解法切角 */}
          <div>
            <label className="font-mono text-xs text-zinc-500 mb-1.5 block">
              解法切角 (Solution Angle)
            </label>
            <textarea
              value={editedProfile.solutionAngle}
              onChange={(e) => updateField('solutionAngle', e.target.value)}
              rows="2"
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm"
            />
          </div>

          {/* CTA 方向 */}
          <div>
            <label className="font-mono text-xs text-zinc-500 mb-1.5 block">CTA 方向</label>
            <input
              type="text"
              value={editedProfile.ctaDirection}
              onChange={(e) => updateField('ctaDirection', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm"
            />
          </div>

          {/* 寫作風格 */}
          <div>
            <label className="font-mono text-xs text-zinc-500 mb-1.5 block">文案調性</label>
            <input
              type="text"
              value={editedProfile.writingStyle}
              onChange={(e) => updateField('writingStyle', e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-400 rounded px-3 py-2 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button onClick={onClose}
            className="px-4 py-2.5 border border-zinc-700 hover:border-zinc-500 rounded-lg text-sm text-zinc-400">
            取消
          </button>
          <button onClick={() => onConfirm(editedProfile)}
            className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            確認套用,開始寫文案
          </button>
        </div>
      </div>
    </div>
  );
}
