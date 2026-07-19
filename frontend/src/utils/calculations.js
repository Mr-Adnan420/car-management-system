/**
 * Formulas (Car Dealer Ledger style):
 * Total Expenses = Fuel + Expense entries
 * Total Cost     = Purchase Price + Total Expenses
 * Net Profit     = Sale Price - Total Cost
 * ROI %          = (Net Profit / Total Cost) × 100
 * Partner Share% = Partner Investment / Total Partner Investment × 100
 * Partner Amount = Partner Share% × Net Profit
 *
 * Partner investments fund the deal — they are NOT added again into Total Cost.
 */

export function sumAmounts(list = [], key = 'amount') {
  return (list || []).reduce((sum, row) => sum + (Number(row?.[key]) || 0), 0);
}

export function hasSaleData(saleDetails) {
  const price = Number(saleDetails?.salePrice);
  return Number.isFinite(price) && price > 0;
}

export function buildDealSummary({
  partnerInvestments = [],
  fuelEntries = [],
  expenseEntries = [],
  purchasePrice = 0,
  salePrice = 0,
}) {
  const purchase = Number(purchasePrice) || 0;
  const sale = Number(salePrice) || 0;

  const fuelTotal = sumAmounts(fuelEntries);
  const expenseTotal = sumAmounts(expenseEntries);
  const totalExpenses = fuelTotal + expenseTotal;
  const totalPartnerInvestment = sumAmounts(partnerInvestments);
  const totalCost = purchase + totalExpenses;
  const hasSale = sale > 0;
  const netProfit = hasSale ? sale - totalCost : null;
  const roi =
    hasSale && totalCost > 0 ? (netProfit / totalCost) * 100 : hasSale && totalCost === 0 ? null : null;

  // Aggregate by partner name (investments can be multiple rows)
  const partnerMap = new Map();

  const ensure = (name) => {
    const key = (name || '').trim() || 'Unknown';
    if (!partnerMap.has(key)) {
      partnerMap.set(key, {
        partnerName: key,
        investment: 0,
        fuel: 0,
        expense: 0,
      });
    }
    return partnerMap.get(key);
  };

  (partnerInvestments || []).forEach((inv) => {
    if (!inv?.partnerName && !(Number(inv?.amount) > 0)) return;
    ensure(inv.partnerName).investment += Number(inv.amount) || 0;
  });

  (fuelEntries || []).forEach((fuel) => {
    if (!fuel?.partnerName && !(Number(fuel?.amount) > 0)) return;
    ensure(fuel.partnerName).fuel += Number(fuel.amount) || 0;
  });

  (expenseEntries || []).forEach((exp) => {
    if (!exp?.partnerName && !(Number(exp?.amount) > 0)) return;
    ensure(exp.partnerName).expense += Number(exp.amount) || 0;
  });

  const rows = Array.from(partnerMap.values()).map((p) => {
    const sharePercent =
      totalPartnerInvestment > 0 ? (p.investment / totalPartnerInvestment) * 100 : 0;
    const partnerAmount =
      netProfit !== null ? (sharePercent / 100) * netProfit : null;
    const partnerExpenses = p.fuel + p.expense;

    return {
      ...p,
      partnerExpenses,
      sharePercent,
      /** Profit/loss share only (Partner Share × Net Profit) */
      partnerAmount,
    };
  });

  return {
    rows,
    totals: {
      purchase,
      sale,
      fuel: fuelTotal,
      expense: expenseTotal,
      totalExpenses,
      totalPartnerInvestment,
      totalCost,
      netProfit,
      roi,
    },
    hasPartners: rows.length > 0,
    hasSale,
  };
}

/** Live share % / amount for a single partner row while typing */
export function getPartnerLiveStats(partnerInvestments = [], salePrice = 0, purchasePrice = 0, fuelEntries = [], expenseEntries = []) {
  const summary = buildDealSummary({
    partnerInvestments,
    fuelEntries,
    expenseEntries,
    purchasePrice,
    salePrice,
  });

  const byName = {};
  summary.rows.forEach((r) => {
    byName[r.partnerName] = r;
  });

  return {
    byName,
    totalPartnerInvestment: summary.totals.totalPartnerInvestment,
    netProfit: summary.totals.netProfit,
    hasSale: summary.hasSale,
  };
}

export const formatRs = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `Rs ${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

export const formatRsSigned = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  const sign = n > 0 ? '+' : '';
  return `${sign}Rs ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

export const formatPercent = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(1)}%`;
};
