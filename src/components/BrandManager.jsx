import React, { useState } from 'react';
import { Globe, X, Trash2 } from 'lucide-react';

export default function BrandManager({
  show, onClose,
  brands, currentBrand, history,
  switchBrand, onAddBrand, onDeleteBrand
}) {
  const [newBrandName, setNewBrandName] = useState('');

  const handleAdd = () => {
    if (!newBrandName.trim()) return;
    onAddBrand(newBrandName.trim());
    setNewBrandName('');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            <h3 className="font-sans-bold text-lg">品牌資料夾</h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-zinc-400 mb-4">把不同品牌/客戶的廣告分開管理。切換品牌後,歷史紀錄只會顯示該品牌的內容。</p>

        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto scrollbar-thin">
          <button onClick={() => { switchBrand('default'); onClose(); }}
            className={`w-full text-left px-4 py-3 rounded-lg border transition ${currentBrand === 'default' ? 'bg-amber-400/10 border-amber-400 text-amber-400' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600'}`}>
            <div className="font-bold text-sm">全部 (預設)</div>
            <div className="font-mono text-xs text-zinc-500 mt-0.5">所有歷史紀錄都會出現</div>
          </button>
          {brands.map(b => (
            <div key={b.id} className={`flex items-stretch rounded-lg border overflow-hidden ${currentBrand === b.id ? 'bg-amber-400/10 border-amber-400' : 'bg-zinc-950 border-zinc-800'}`}>
              <button onClick={() => { switchBrand(b.id); onClose(); }}
                className={`flex-1 text-left px-4 py-3 ${currentBrand === b.id ? 'text-amber-400' : ''}`}>
                <div className="font-bold text-sm">{b.name}</div>
                <div className="font-mono text-xs text-zinc-500 mt-0.5">{history.filter(h => h.brand === b.id).length} 筆紀錄</div>
              </button>
              <button onClick={() => onDeleteBrand(b.id)}
                className="px-3 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 pt-4">
          <div className="flex gap-2">
            <input type="text" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
              placeholder="新增品牌名稱..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
            <button onClick={handleAdd} className="bg-amber-400 text-zinc-950 font-bold rounded px-4 text-sm">新增</button>
          </div>
        </div>
      </div>
    </div>
  );
}
