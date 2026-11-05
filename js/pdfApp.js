// Part of the APK.audio project — http://APK.audio — made by Anthony Kuzub
// MIT Licence. Free, for everyone, for ever. Full text in LICENSE at the root.
/* pdfApp.js — the page: title-block fields, the SVG preview (escaped), print,
   and the block in and out of the CAD (pdfHost.js). */

import { generateTitleBlockSvg } from './pdfExport.js';
import { connectPdfHost, defaultTitle, toBlock, FIELDS } from './pdfHost.js';

const S = window.APKSoftapp;
const state = defaultTitle();
const $ = (id) => document.getElementById(id);

function render() {
  for (const k of FIELDS) { const el = $(`f-${k}`); if (el && el.value !== state[k]) el.value = state[k]; }
  // generateTitleBlockSvg escapes every field it draws.
  $('sheet-preview').innerHTML = generateTitleBlockSvg(state.project, state.sheet, state.totalSheets, state);
}

if (S) S.describe({
  name: 'Vector Schematic PDF Exporter',
  does: 'Fills in a schematic title block and prints the sheet as a vector PDF.',
  inputs: [
    { name: 'Title block', from: 'the CAD (schematic_titleblock block: project, drawing, rev, engineer, sheet, totalSheets)', kind: 'block' },
    { name: 'Fields', from: 'the Project / Drawing / Rev / Engineer / Sheet / Of boxes', kind: 'text' },
  ],
  outputs: [
    { name: 'Vector PDF', to: "the browser's print dialog (choose Save as PDF)", kind: 'file' },
    { name: 'Title block', to: 'the CAD drawing (Save & Return), or titleblock.json download when standalone', kind: 'block' },
  ],
  controls: [
    { name: 'Fields', how: 'Type in a box; the preview redraws as you type' },
    { name: 'Export / Print Vector PDF', how: 'Opens the print dialog for the preview sheet' },
    { name: 'Save & Return', how: 'Sends the title block back to the CAD (or downloads it as .json)' },
  ],
  problems: ['bad_input', 'save_failed'],
});

/* A block with none of the title fields loads as the default title — say so. */
function checkBlock(block, meta) {
  const b = block && typeof block === 'object' ? block : null;
  if (!S || (b && FIELDS.some((k) => b[k] !== undefined && b[k] !== null))) return;
  S.showProblem('bad_input', {
    subject: (meta && (meta.blockName || meta.title)) || 'CAD block',
    detail: `The block has none of the title fields (${FIELDS.join(', ')}), so the default title is shown.`,
    fix: ['Open this from a schematic_titleblock block in the CAD, or type the fields in and Save & Return.'],
  });
}

const host = S ? connectPdfHost(S, state, {
  onLoaded: (st, meta, block) => { $('block-tag').textContent = meta.blockName || meta.title || 'FROM THE CAD'; render(); checkBlock(block, meta); },
}) : null;

for (const k of FIELDS) {
  $(`f-${k}`)?.addEventListener('input', (e) => {
    state[k] = e.target.value;
    render();
    if (host) host.changed(toBlock(state));
  });
}

$('btn-print').addEventListener('click', () => window.print());
$('btn-save').addEventListener('click', () => {
  let how = '';
  try { how = host ? host.save(toBlock(state), { filename: 'titleblock' }) : ''; }
  catch (e) { S.showProblem('save_failed', { subject: 'titleblock', detail: e && e.message ? e.message : String(e), onRetry: () => $('btn-save').click() }); return; }
  if (!host) $('block-tag').textContent = 'NOT SAVED: SHARED CODE MISSING';
  if (how) $('block-tag').textContent = how === 'host' ? 'SAVED TO THE CAD' : 'DOWNLOADED .JSON';
});

render();
