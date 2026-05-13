import React from 'react';
import { Flame, History, FileText, Globe, LogOut } from 'lucide-react';
import { LANGUAGES } from '../data/constants';

export default function Header({
  language, setLanguage, useAPI,
  historyCount, templatesCount,
  currentBrand, brands,
  onShowHistory, onShowTemplates, onShowBrandManager, onLogout
}) {
  return (
    <header className="border-b border-zinc-800/60 sticky top-0 bg-zinc-950/90 backdrop-blur z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center glow flex-shrink-0">
            <Flame className="w-6 h-6 text-zinc-950" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-xl sm:text-2xl leading-tight">
              <span className="text-zinc-300">老闆接案學院</span>
              <span className="gradient-text ml-1.5">AD/BOT</span>
            </h1>
            <p className="font-mono text-xs text-zinc-500 truncate">v5.0 · 終極版</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm focus:border-amber-400 focus:outline-none">
            {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.flag} {l.name}</option>)}
          </select>
          <button onClick={onShowBrandManager}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 rounded-lg hover:border-amber-400 transition text-sm"
            title="品牌資料夾">
            <Globe className="w-4 h-4" />
            <span className="font-mono text-xs text-amber-400 max-w-[80px] truncate">
              {currentBrand === 'default' ? '全部' : (brands.find(b => b.id === currentBrand)?.name || '全部')}
            </span>
          </button>
          <button onClick={onShowTemplates}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 rounded-lg hover:border-amber-400 transition text-sm"
            title="範本">
            <FileText className="w-4 h-4" />
            <span className="font-mono text-xs text-amber-400">{templatesCount}</span>
          </button>
          <button onClick={onShowHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 rounded-lg hover:border-amber-400 transition text-sm">
            <History className="w-4 h-4" />
            <span className="font-mono text-xs text-amber-400">{historyCount}</span>
          </button>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-700 rounded-lg hover:border-red-400 transition text-sm text-zinc-400 hover:text-red-400"
            title="登出">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
