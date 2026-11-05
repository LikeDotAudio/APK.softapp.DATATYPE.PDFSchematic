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

const host = S ? connectPdfHost(S, state, {
  onLoaded: (st, meta) => { $('block-tag').textContent = meta.blockName || meta.title || 'FROM THE CAD'; render(); },
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
  const how = host ? host.save(toBlock(state), { filename: 'titleblock' }) : '';
  if (how) $('block-tag').textContent = how === 'host' ? 'SAVED TO THE CAD' : 'DOWNLOADED .JSON';
});

render();
