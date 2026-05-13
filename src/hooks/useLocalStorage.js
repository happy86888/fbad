import { useState, useEffect } from 'react';
import { safeLocalStorage } from '../utils/helpers';

// 自訂 Hook:綁定 state 到 localStorage
export const useLocalStorage = (key, initialValue, isJSON = false) => {
  const [value, setValue] = useState(() => {
    const stored = isJSON ? safeLocalStorage.getJSON(key) : safeLocalStorage.get(key);
    return stored !== null ? stored : initialValue;
  });

  useEffect(() => {
    if (value === undefined || value === null || value === '') {
      safeLocalStorage.remove(key);
    } else if (isJSON) {
      safeLocalStorage.setJSON(key, value);
    } else {
      safeLocalStorage.set(key, value);
    }
  }, [key, value, isJSON]);

  return [value, setValue];
};
