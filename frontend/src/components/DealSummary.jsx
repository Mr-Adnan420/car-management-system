import { FaChartPie } from 'react-icons/fa';
import {
  buildDealSummary,
  formatRs,
  formatRsSigned,
  formatPercent,
} from '../utils/calculations';
import { Panel, SectionTitle } from './ui';

/**
 * Deal Summary matching Car Dealer Ledger:
 * Total Cost | Net Profit/Loss | ROI
 * + per-partner Share % and Amount
 */
const DealSummary = ({
  partnerInvestments = [],
  fuelEntries = [],
  expenseEntries = [],
  purchasePrice = 0,
  salePrice = 0,
}) => {
  const summary = buildDealSummary({
    partnerInvestments,
    fuelEntries,
    expenseEntries,
    purchasePrice,
    salePrice,
  });

  const { totals, rows, hasSale, hasPartners } = summary;

  if (!totals.purchase && !totals.totalExpenses && !hasPartners && !hasSale) {
    return null;
  }

  return (
    <Panel className="animate-fade-up">
      <SectionTitle icon={FaChartPie} className="mb-5">
        Deal Summary
      </SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DealStat
          label="Total Cost"
          value={formatRs(totals.totalCost)}
          hint="Purchase + Expenses"
        />
        <DealStat
          label="Net Profit / Loss"
          value={hasSale ? formatRsSigned(totals.netProfit) : 'Enter sale price'}
          hint={hasSale ? 'Sale − Total Cost' : 'Fill sale to calculate'}
          tone={
            !hasSale ? 'muted' : totals.netProfit >= 0 ? 'success' : 'danger'
          }
        />
        <DealStat
          label="Return on Investment"
          value={hasSale ? formatPercent(totals.roi) : '—'}
          hint="(Profit ÷ Cost) × 100"
          tone={!hasSale ? 'muted' : totals.netProfit >= 0 ? 'success' : 'danger'}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <MiniStat label="Purchase Price" value={formatRs(totals.purchase)} />
        <MiniStat label="Total Expenses" value={formatRs(totals.totalExpenses)} />
        <MiniStat
          label="Partner Investment"
          value={formatRs(totals.totalPartnerInvestment)}
        />
        <MiniStat
          label="Sale Price"
          value={hasSale ? formatRs(totals.sale) : 'Not set'}
        />
      </div>

      {hasPartners && (
        <div className="overflow-x-auto mb-5">
          <table className="data-table">
            <thead>
              <tr>
                <th>Partner</th>
                <th>Investment</th>
                <th>Share %</th>
                <th>Expenses paid</th>
                <th>Amount (Profit Share)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.partnerName}>
                  <td className="font-semibold whitespace-nowrap">{row.partnerName}</td>
                  <td className="whitespace-nowrap">{formatRs(row.investment)}</td>
                  <td>
                    <span className="badge badge-accent">
                      {row.sharePercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-[var(--text-muted)]">
                    {formatRs(row.partnerExpenses)}
                  </td>
                  <td
                    className={`whitespace-nowrap font-bold ${
                      row.partnerAmount == null
                        ? 'text-[var(--text-soft)]'
                        : row.partnerAmount >= 0
                          ? 'text-[var(--success)]'
                          : 'text-[var(--danger)]'
                    }`}
                  >
                    {hasSale ? formatRsSigned(row.partnerAmount) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[var(--border)]">
                <td className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Totals
                </td>
                <td className="px-5 py-3 font-bold whitespace-nowrap">
                  {formatRs(totals.totalPartnerInvestment)}
                </td>
                <td className="px-5 py-3">
                  <span className="badge badge-accent">100%</span>
                </td>
                <td className="px-5 py-3 font-semibold whitespace-nowrap">
                  {formatRs(totals.totalExpenses)}
                </td>
                <td
                  className={`px-5 py-3 font-bold whitespace-nowrap ${
                    !hasSale
                      ? 'text-[var(--text-soft)]'
                      : totals.netProfit >= 0
                        ? 'text-[var(--success)]'
                        : 'text-[var(--danger)]'
                  }`}
                >
                  {hasSale ? formatRsSigned(totals.netProfit) : '—'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <p className="text-[11px] leading-relaxed text-[var(--text-muted)] border-t border-[var(--border)] pt-4">
        <strong className="text-[var(--text)]">Formula:</strong> Total Cost =
        Purchase Price + Total Expenses &nbsp;|&nbsp; Net Profit = Sale Price −
        Total Cost &nbsp;|&nbsp; ROI = (Net Profit ÷ Total Cost) × 100 &nbsp;|&nbsp;
        Partner Amount = Partner Share × Net Profit
      </p>
    </Panel>
  );
};

function DealStat({ label, value, hint, tone = 'default' }) {
  const valueClass =
    tone === 'success'
      ? 'text-[var(--success)]'
      : tone === 'danger'
        ? 'text-[var(--danger)]'
        : tone === 'muted'
          ? 'text-[var(--text-muted)]'
          : 'text-[var(--text)]';

  return (
    <div className="rounded-2xl border border-[var(--border)] p-5 bg-[var(--accent-soft)]/40">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2">
        {label}
      </p>
      <p className={`font-display text-2xl font-bold tracking-tight ${valueClass}`}>
        {value}
      </p>
      {hint && <p className="text-[11px] text-[var(--text-soft)] mt-1.5">{hint}</p>}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
        {label}
      </p>
      <p className="font-display text-sm font-bold">{value}</p>
    </div>
  );
}

export default DealSummary;
