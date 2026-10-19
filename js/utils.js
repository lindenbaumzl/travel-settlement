export const id = (prefix = 'id') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));

export const n = (value) => (value === '' || value == null ? 0 : Number(value) || 0);

export const yen = (value) => `${Math.round(Number(value) || 0).toLocaleString('ja-JP')}円`;

export const fmt = (value) =>
  value === '' || value == null ? '' : (Number(value) || 0).toLocaleString('ja-JP');

export const radio = (name) =>
  document.querySelector(`input[name="${name}"]:checked`)?.value || '';

export const setRadio = (name, value) => {
  const element = document.querySelector(`input[name="${name}"][value="${value}"]`);
  if (element) element.checked = true;
};

export const opt = (arr, selected) =>
  arr
    .map((item) => {
      if (Array.isArray(item)) {
        return `<option value="${esc(item[0])}" ${item[0] === selected ? 'selected' : ''}>${esc(item[1])}</option>`;
      }
      return `<option ${item === selected ? 'selected' : ''}>${esc(item)}</option>`;
    })
    .join('');

export const csv = (value) => {
  const s = String(value ?? '');
  return /[,"\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
};
