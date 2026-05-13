import React, { useState } from 'react';
import { FileText, X, Trash2 } from 'lucide-react';

export default function TemplatesDrawer({
  show, onClose,
  templates, industry,
  onSaveTemplate, onApplyTemplate, onDeleteTemplate
}) {
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const handleSave = () => {
    if (!templateName.trim()) return;
    onSaveTemplate(templateName);
    setSavingTemplate(false);
    setTemplateName('');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-zinc-900 border-l border-zinc-800 overflow-y-auto scrollbar-thin slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-sans-bold text-lg">範本</h3>
            <span className="font-mono text-xs text-zinc-500">({templates.length})</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">
          <div className="mb-4 bg-zinc-950 border border-amber-400/30 rounded-lg p-3">
            {savingTemplate ? (
              <div className="space-y-2">
                <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="範本名稱..." autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm focus:border-amber-400 focus:outline-none" />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="flex-1 bg-amber-400 text-zinc-950 font-bold rounded py-1.5 text-sm">儲存</button>
                  <button onClick={() => { setSavingTemplate(false); setTemplateName(''); }}
                    className="px-3 border border-zinc-700 rounded text-sm">取消</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setSavingTemplate(true)} disabled={!industry}
                className="w-full text-sm text-amber-400 font-mono py-1 disabled:opacity-50">
                + 把目前設定存為範本
              </button>
            )}
          </div>

          {templates.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-mono text-sm">// 還沒有範本</div>
          ) : (
            <div className="space-y-2">
              {templates.map(tpl => (
                <div key={tpl.id} className="bg-zinc-950 border border-zinc-800 hover:border-amber-400/50 rounded-lg p-3 transition group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onApplyTemplate(tpl)}>
                      <div className="font-bold text-sm truncate">{tpl.name}</div>
                      <div className="font-mono text-xs text-zinc-500 mt-1 truncate">
                        {tpl.industry} · {tpl.tone} · {tpl.goal}
                      </div>
                    </div>
                    <button onClick={() => onDeleteTemplate(tpl.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
