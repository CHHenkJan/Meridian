/* ══════════════════════════════════════════
   MERIDIAN — Signalstats API integration
   Populates the recent trade log on the
   track-record page with live data from
   https://www.cryptohopper.com/signalstats.php
   ══════════════════════════════════════════ */

(function () {
  const SIGNALLER_ID = 743;
  const API = 'https://www.cryptohopper.com/signalstats.php';

  function formatDate(unix) {
    if (!unix) return '';
    return new Date(unix * 1000).toISOString().slice(0, 10);
  }

  function formatRate(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return '';
    if (n >= 1000) return '$' + Math.round(n).toLocaleString();
    if (n >= 1) return '$' + n.toFixed(2);
    if (n >= 0.01) return '$' + n.toFixed(3);
    return '$' + n.toPrecision(3);
  }

  function formatHold(seconds) {
    if (!seconds || seconds <= 0) return '';
    if (seconds < 3600) return Math.round(seconds / 60) + 'm';
    if (seconds < 86400) return Math.round(seconds / 3600) + 'h';
    return Math.round(seconds / 86400) + 'd';
  }

  function formatPct(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return '';
    const sign = n >= 0 ? '+' : '-';
    return sign + Math.abs(n).toFixed(2) + '%';
  }

  function renderTrades(tbody, trades) {
    if (!tbody || !trades || !trades.length) return;
    tbody.innerHTML = trades
      .slice(0, 10)
      .map((t) => {
        const win = (t.result_pct || 0) >= 0;
        const cls = win ? 'trade-positive' : 'trade-negative';
        return `
          <tr>
            <td>${formatDate(t.exit_time)}</td>
            <td>${t.market}</td>
            <td>${(t.side || 'long').replace(/^./, (c) => c.toUpperCase())}</td>
            <td>${formatRate(t.entry_rate)}</td>
            <td>${formatRate(t.exit_rate)}</td>
            <td>${formatHold(t.hold_seconds)}</td>
            <td class="${cls}">${formatPct(t.result_pct)}</td>
          </tr>`;
      })
      .join('');
  }

  async function load() {
    const tbody = document.querySelector('.trade-table tbody');
    if (!tbody) return;
    try {
      const url = `${API}?signal_id=${SIGNALLER_ID}&exchange=all&trades=1&extended=1`;
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.status !== 1 || !json.data) return;
      if (Array.isArray(json.data.paired_trades)) {
        renderTrades(tbody, json.data.paired_trades);
      }
    } catch (err) {
      // Silent: keep static sample on failure.
      // eslint-disable-next-line no-console
      console.warn('[signalstats]', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
