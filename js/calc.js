import { n } from './utils.js';

export function toJPY(row) {
  if (row.jpyAmount !== '' && row.jpyAmount != null) {
    return Math.round(n(row.jpyAmount));
  }

  if (row.amount === '' || row.amount == null) return '';
  const rate = row.currency === 'JPY' ? 1 : n(row.rate);
  return Math.round(n(row.amount) * rate);
}

export function summary(trip) {
  const ps = trip?.people || [];
  const res = {};

  ps.forEach((p) => {
    res[p] = {
      paid: 0,
      commonPaid: 0,
      personal: 0,
      actual: 0,
      diff: 0
    };
  });

  let commonAll = 0;
  let unsettled = 0;

  (trip?.expenses || []).forEach((row) => {
    const jpy = toJPY(row);
    if (jpy === '') return;

    if (res[row.payer]) res[row.payer].paid += jpy;

    if (row.type === '共通') {
      commonAll += jpy;
      if (res[row.payer]) res[row.payer].commonPaid += jpy;

      if (row.status === '未精算') {
        unsettled += jpy;
        if (res[row.payer]) res[row.payer].diff += jpy;
      }
      return;
    }

    const who = row.type.replace(/のみ$/, '');
    if (res[who]) res[who].personal += jpy;
  });

  const share = ps.length ? commonAll / ps.length : 0;
  const unShare = ps.length ? unsettled / ps.length : 0;

  ps.forEach((p) => {
    res[p].actual = res[p].personal + share;
    res[p].diff -= unShare;
  });

  return { ps, res, commonAll, unsettled, unShare };
}

export function settlements(s) {
  if (s.ps.length <= 1) return [];

  const creditors = [];
  const debtors = [];

  s.ps.forEach((p) => {
    const diff = Math.round(s.res[p].diff);
    if (diff > 0) creditors.push([p, diff]);
    if (diff < 0) debtors.push([p, -diff]);
  });

  const out = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i][1], creditors[j][1]);
    if (amount > 0) {
      out.push({
        from: debtors[i][0],
        to: creditors[j][0],
        amount
      });
    }

    debtors[i][1] -= amount;
    creditors[j][1] -= amount;

    if (!debtors[i][1]) i += 1;
    if (!creditors[j][1]) j += 1;
  }

  return out;
}
