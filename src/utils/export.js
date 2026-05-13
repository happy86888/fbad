// 匯出功能

export const exportPDF = (generated, languages) => {
  if (!generated) return;
  const printWindow = window.open('', '_blank');
  const lang = languages.find(l => l.id === (generated.language || 'zh-TW'));

  const html = `<!DOCTYPE html>
<html lang="${generated.language || 'zh-TW'}">
<head>
<meta charset="UTF-8">
<title>老闆接案學院 AD/BOT 廣告報告 - ${generated.industry}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&family=Noto+Sans+TC:wght@400;700&display=swap');
* { box-sizing: border-box; }
body { font-family: 'Noto Sans TC', sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1f2937; line-height: 1.7; }
h1 { font-family: 'Noto Serif TC', serif; font-size: 32px; margin: 0 0 8px; }
h2 { font-family: 'Noto Serif TC', serif; font-size: 24px; margin: 40px 0 12px; padding-top: 24px; border-top: 2px solid #fbbf24; }
h3 { font-size: 18px; margin: 24px 0 8px; color: #c2410c; }
.meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
.meta span { margin-right: 16px; }
.copy-block { background: #fafaf9; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 16px 0; page-break-inside: avoid; }
.copy-block.variant-b { background: #fef3c7; }
.label { display: inline-block; padding: 4px 10px; background: #fbbf24; color: #1f2937; border-radius: 6px; font-weight: 700; font-size: 12px; margin-bottom: 12px; }
.field { margin: 12px 0; }
.field-name { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; font-weight: 700; }
.headline { font-family: 'Noto Serif TC', serif; font-size: 20px; font-weight: 700; }
.primary { white-space: pre-wrap; background: white; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; }
.cta { display: inline-block; background: linear-gradient(135deg, #fbbf24, #f97316); color: white; padding: 6px 16px; border-radius: 6px; font-weight: 700; }
.img-prompt { background: #18181b; color: #e5e7eb; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; white-space: pre-wrap; }
.img-dir { background: #fffbeb; border: 1px solid #fde68a; padding: 12px; border-radius: 8px; white-space: pre-wrap; font-size: 14px; }
.generated-img { max-width: 300px; border-radius: 8px; margin: 12px 0; }
.competitor { background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 12px; margin: 16px 0; }
.competitor ul { margin: 4px 0; padding-left: 20px; }
@media print { body { margin: 0; padding: 20px; } .no-print { display: none; } h2 { page-break-before: auto; } .copy-block { page-break-inside: avoid; } }
.print-btn { background: #fbbf24; color: #1f2937; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 16px; margin: 20px 0; }
</style>
</head>
<body>
<button class="print-btn no-print" onclick="window.print()">列印 / 存成 PDF</button>

<h1>🔥 老闆接案學院 AD/BOT 廣告報告</h1>
<div class="meta">
  <span><strong>產業:</strong>${generated.industry}</span>
  <span><strong>產品:</strong>${generated.productName}</span>
  <span><strong>受眾:</strong>${generated.targetAudience}</span><br/>
  <span><strong>語氣:</strong>${generated.tone}</span>
  <span><strong>目標:</strong>${generated.goal}</span>
  <span><strong>語言:</strong>${lang?.flag} ${lang?.name}</span>
  <span><strong>生成時間:</strong>${new Date(generated.timestamp).toLocaleString('zh-TW')}</span>
</div>

${generated.competitorAnalysis ? `
<h2>📊 競品策略分析</h2>
<div class="competitor">
  <h3>策略總結</h3>
  <p>${generated.competitorAnalysis.summary}</p>
  <h3>他們戳的痛點</h3>
  <ul>${generated.competitorAnalysis.painPoints.map(p => `<li>${p}</li>`).join('')}</ul>
  <h3>他們的弱點(我們的機會)</h3>
  <ul>${generated.competitorAnalysis.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
  <h3>我們的差異化建議</h3>
  <ul>${generated.competitorAnalysis.ourAdvantages.map(a => `<li>${a}</li>`).join('')}</ul>
</div>
` : ''}

${generated.copies.map((copy, idx) => `
<h2>切角 #${idx + 1}:${copy.style}</h2>
${copy.variants.map(v => `
<div class="copy-block ${v.label.includes('B') ? 'variant-b' : ''}">
  <span class="label">${v.label}</span>
  <div class="field"><div class="field-name">主標題 Headline</div><div class="headline">${v.headline}</div></div>
  <div class="field"><div class="field-name">主要文字 Primary Text</div><div class="primary">${v.primary.replace(/\n/g, '<br/>')}</div></div>
  <div class="field"><div class="field-name">描述 / CTA</div><p>${v.description} → <span class="cta">${v.cta}</span></p></div>
  ${v.generatedImage ? `<div class="field"><div class="field-name">生成的圖片</div><img src="${v.generatedImage}" class="generated-img" /></div>` : ''}
  <div class="field"><div class="field-name">圖片 Prompt (English)</div><div class="img-prompt">${v.imagePrompt}</div></div>
  <div class="field"><div class="field-name">圖片方向說明</div><div class="img-dir">${v.imageDirection.replace(/\n/g, '<br/>')}</div></div>
</div>
`).join('')}
`).join('')}

<p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 40px;">
  Generated by 老闆接案學院 AD/BOT v5.0 · ${new Date().toLocaleDateString('zh-TW')}
</p>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
};

export const exportExcel = (generated) => {
  if (!generated) return;

  const rows = [
    ['切角編號', '切角類型', '版本', '主標題', '主要文字', '描述', 'CTA', '圖片Prompt', '圖片方向', '已生成圖片URL']
  ];

  generated.copies.forEach((copy, idx) => {
    copy.variants.forEach(v => {
      rows.push([
        `#${idx + 1}`,
        copy.style,
        v.label,
        v.headline,
        v.primary.replace(/\n/g, ' \\n '),
        v.description,
        v.cta,
        v.imagePrompt,
        v.imageDirection.replace(/\n/g, ' \\n '),
        v.generatedImage || ''
      ]);
    });
  });

  const csv = '\ufeff' + rows.map(row =>
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `adbot_${generated.industry}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
