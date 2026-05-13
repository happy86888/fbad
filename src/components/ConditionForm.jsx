import React from 'react';
import { Target, AlertCircle, RefreshCw, Wand2, ChevronRight, Zap, MessageSquare, Sparkles } from 'lucide-react';
import { TONES, GOALS } from '../data/constants';

const LENGTH_OPTIONS = [
  { id: 'short', label: '短 (100-150 字)', hint: '促銷、簡訊、活動公告' },
  { id: 'medium', label: '中 (250-400 字)', hint: '一般電商、實體商品 (推薦)' },
  { id: 'long', label: '長 (400-600 字)', hint: '服務業、B2B、複雜產品' },
];

const GEN_MODES = [
  {
    id: 'fast',
    label: '快速模式',
    sub: '1 次 API',
    hint: '直接產出,適合熟悉的產業',
    color: 'zinc'
  },
  {
    id: 'smart',
    label: '智能模式',
    sub: '2 次 API · 推薦',
    hint: 'AI 先分析產業再寫,文案更精準',
    color: 'amber'
  },
  {
    id: 'precise',
    label: '精準模式',
    sub: '2 次 API + 校正',
    hint: 'AI 分析後讓你檢視,可調整再產出',
    color: 'pink'
  },
];

const INDUSTRY_REF_EXAMPLE = `室內設計/裝潢
| 你的家,真的住得舒服嗎?
| 預算疑慮、設計師不懂自己
| 客製化、量身打造、十年保固
| 預約丈量、免費諮詢`;

export default function ConditionForm({
  industry, setIndustry,
  product, setProduct,
  audience, setAudience,
  tone, setTone,
  customTone, setCustomTone,
  goal, setGoal,
  customGoal, setCustomGoal,
  customBrief, setCustomBrief,
  userIndustryRef, setUserIndustryRef,
  length, setLength,
  genMode, setGenMode,
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

        {/* 廣告語氣 */}
        <div>
          <label className="font-mono text-xs text-zinc-500 mb-2 block">廣告語氣</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {TONES.map(t => (
              <button key={t} onClick={() => setTone(t)}
                className={`px-3 py-2 rounded-lg text-sm transition border ${tone === t ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}>{t}</button>
            ))}
            <button onClick={() => setTone('自訂')}
              className={`px-3 py-2 rounded-lg text-sm transition border ${tone === '自訂' ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}>+ 自訂</button>
          </div>
          {tone === '自訂' && (
            <input type="text" value={customTone} onChange={(e) => setCustomTone(e.target.value)}
              placeholder="自訂語氣,例如:文青、冷酷、嘲諷、知識型..."
              className="w-full bg-zinc-950 border border-amber-400/50 rounded-lg px-4 py-2.5 focus:border-amber-400 focus:outline-none text-sm" />
          )}
        </div>

        {/* 行銷目標 */}
        <div>
          <label className="font-mono text-xs text-zinc-500 mb-2 block">行銷目標</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {GOALS.map(g => (
              <button key={g} onClick={() => setGoal(g)}
                className={`px-3 py-2 rounded-lg text-sm transition border ${goal === g ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}>{g}</button>
            ))}
            <button onClick={() => setGoal('自訂')}
              className={`px-3 py-2 rounded-lg text-sm transition border ${goal === '自訂' ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold' : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-600'}`}>+ 自訂</button>
          </div>
          {goal === '自訂' && (
            <input type="text" value={customGoal} onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="自訂目標,例如:導 LINE@、邀請試吃、招募加盟主..."
              className="w-full bg-zinc-950 border border-amber-400/50 rounded-lg px-4 py-2.5 focus:border-amber-400 focus:outline-none text-sm" />
          )}
        </div>

        {/* 文案長度 */}
        <div className="md:col-span-2">
          <label className="font-mono text-xs text-zinc-500 mb-2 block">文案長度</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {LENGTH_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => setLength(opt.id)}
                className={`text-left p-3 rounded-lg border-2 transition ${
                  length === opt.id ? 'border-amber-400 bg-amber-400/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                }`}>
                <div className={`font-bold text-sm ${length === opt.id ? 'text-amber-400' : 'text-zinc-200'}`}>
                  {opt.label}
                </div>
                <div className="font-mono text-xs text-zinc-500 mt-0.5">{opt.hint}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 🆕 產業參考(讓使用者自己提供格式化的產業資訊) */}
        <div className="md:col-span-2">
          <label className="font-mono text-xs text-zinc-500 mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            產業參考 (選填,若填寫會優先採用,跳過 AI 自動分析)
          </label>
          <textarea value={userIndustryRef} onChange={(e) => setUserIndustryRef(e.target.value)} rows="5"
            placeholder={`格式範例(請依此格式填寫):\n\n${INDUSTRY_REF_EXAMPLE}\n\n(產業 | 鉤子方向 | 痛點 | 解法 | CTA)`}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:border-amber-400 focus:outline-none text-sm font-mono leading-relaxed" />
          <p className="font-mono text-xs text-zinc-600 mt-1.5">
            💡 你最了解自己的產業,如果你能提供格式化資訊,文案會比 AI 自動分析更精準
          </p>
        </div>

        {/* 自訂訴求 */}
        <div className="md:col-span-2">
          <label className="font-mono text-xs text-zinc-500 mb-2 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            廣告訴求 / 想要的感覺 (選填,但強烈推薦填寫)
          </label>
          <textarea value={customBrief} onChange={(e) => setCustomBrief(e.target.value)} rows="4"
            placeholder="例如:&#10;・想強調我們是在地 30 年老品牌、用真材實料、做工細膩&#10;・希望文案像在跟朋友聊天,不要太商業&#10;・客戶最常問的是價格,所以希望文案能化解價格疑慮&#10;・避免提到「最便宜」這種字眼,我們走的是品質路線&#10;・希望結尾引導加 LINE 諮詢"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 focus:border-amber-400 focus:outline-none text-sm leading-relaxed" />
          <p className="font-mono text-xs text-zinc-600 mt-1.5">
            💡 越具體越精準 — 寫出你的品牌特色、想強調的點、想避免的話、客戶常見疑慮等
          </p>
        </div>

        {/* 🆕 生成模式選擇器 */}
        <div className="md:col-span-2">
          <label className="font-mono text-xs text-zinc-500 mb-2 flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            生成模式
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {GEN_MODES.map(m => (
              <button key={m.id} onClick={() => setGenMode(m.id)}
                className={`text-left p-3 rounded-lg border-2 transition ${
                  genMode === m.id
                    ? m.color === 'amber'
                      ? 'border-amber-400 bg-amber-400/5'
                      : m.color === 'pink'
                        ? 'border-pink-400 bg-pink-400/5'
                        : 'border-zinc-500 bg-zinc-800/30'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                }`}>
                <div className="flex items-start justify-between mb-1">
                  <div className={`font-bold text-sm ${
                    genMode === m.id
                      ? m.color === 'amber'
                        ? 'text-amber-400'
                        : m.color === 'pink'
                          ? 'text-pink-400'
                          : 'text-zinc-200'
                      : 'text-zinc-300'
                  }`}>
                    {m.label}
                  </div>
                  <span className="font-mono text-xs text-zinc-500">{m.sub}</span>
                </div>
                <div className="font-mono text-xs text-zinc-500 leading-tight">{m.hint}</div>
              </button>
            ))}
          </div>
          {userIndustryRef && userIndustryRef.trim() && (
            <p className="font-mono text-xs text-amber-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              偵測到「產業參考」已填寫,將優先使用您的設定(智能/精準模式會跳過 AI 分析)
            </p>
          )}
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
            ? <><RefreshCw className="w-5 h-5 animate-spin" />處理中...</>
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
