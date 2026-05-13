// 通用工具函式

export const formatTime = (iso) => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const safeLocalStorage = {
  get: (key) => {
    try {
      const v = localStorage.getItem(key);
      return v;
    } catch (e) {
      return null;
    }
  },
  getJSON: (key) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  },
  setJSON: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },
};

// 下載圖片 (處理 CORS)
export const downloadImage = async (imageUrl, filename) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    window.open(imageUrl, '_blank');
  }
};

// 注入 SEO 屏蔽 meta
export const injectNoIndex = () => {
  const tags = [
    { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
    { name: 'googlebot', content: 'noindex, nofollow' },
    { name: 'bingbot', content: 'noindex, nofollow' },
  ];
  const created = tags.map(t => {
    const m = document.createElement('meta');
    m.name = t.name;
    m.content = t.content;
    document.head.appendChild(m);
    return m;
  });
  return () => created.forEach(m => document.head.removeChild(m));
};
