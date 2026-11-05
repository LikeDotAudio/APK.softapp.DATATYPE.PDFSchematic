// Part of APK.audio - Vector Schematic PDF Exporter
// Ported from OneThing gui-shell/export/exportSchematicPdf.ts

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function generateTitleBlockSvg(project = 'AUDIO FACILITY', sheet = '01', totalSheets = '05', opts = {}) {
  const drawing = opts.drawing || 'SYSTEM SCHEMATIC';
  const rev = opts.rev || '1.0';
  const engineer = opts.engineer || 'Anthony Kuzub';
  return `
    <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" style="background:#fff; font-family:sans-serif;">
      <!-- Border -->
      <rect x="20" y="20" width="760" height="460" fill="none" stroke="#000" stroke-width="2" />
      <rect x="25" y="25" width="750" height="450" fill="none" stroke="#000" stroke-width="1" />

      <!-- Title Block at Bottom Right -->
      <g transform="translate(480, 400)">
        <rect x="0" y="0" width="295" height="75" fill="#f8fafc" stroke="#000" stroke-width="1.5" />
        <line x1="0" y1="25" x2="295" y2="25" stroke="#000" stroke-width="1" />
        <line x1="0" y1="50" x2="295" y2="50" stroke="#000" stroke-width="1" />
        <line x1="180" y1="0" x2="180" y2="75" stroke="#000" stroke-width="1" />

        <text x="10" y="17" font-size="12" font-weight="bold" fill="#0f172a">PROJECT: ${esc(project)}</text>
        <text x="190" y="17" font-size="11" fill="#475569">DATE: ${new Date().toISOString().slice(0, 10)}</text>
        <text x="10" y="42" font-size="11" fill="#0f172a">DRAWING: ${esc(drawing)}</text>
        <text x="190" y="42" font-size="11" font-weight="bold" fill="#0284c7">REV: ${esc(rev)}</text>
        <text x="10" y="67" font-size="10" fill="#64748b">ENGINEER: ${esc(engineer)}</text>
        <text x="190" y="67" font-size="11" font-weight="bold" fill="#0f172a">SHEET ${esc(sheet)} OF ${esc(totalSheets)}</text>
      </g>
    </svg>
  `;
}
