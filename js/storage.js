import { KEY } from './config.js';

export function load() {
  const saved = localStorage.getItem(KEY);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function save(trips) {
  localStorage.setItem(KEY, JSON.stringify(trips));
}
