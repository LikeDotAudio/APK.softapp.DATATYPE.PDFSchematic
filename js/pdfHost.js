// Part of the APK.audio project — http://APK.audio — made by Anthony Kuzub
// MIT Licence. Free, for everyone, for ever. Full text in LICENSE at the root.
/* pdfHost.js — the title-block block in and out of the CAD over
   cad.like.audio/host@1, through the vendored APKSoftapp client (ROAD-3491).
   Block: { type: 'schematic_titleblock', project, drawing, rev, engineer, sheet, totalSheets }. */

export const EDITOR = 'Vector Schematic PDF Exporter';
export const BLOCK_TYPE = 'schematic_titleblock';
export const FIELDS = ['project', 'drawing', 'rev', 'engineer', 'sheet', 'totalSheets'];

export function defaultTitle() {
  return { project: 'STUDIO COMPLEX A', drawing: 'SYSTEM SCHEMATIC', rev: '1.0', engineer: 'Anthony Kuzub', sheet: '01', totalSheets: '04' };
}

export function fromBlock(block) {
  const b = block && typeof block === 'object' ? block : {};
  const out = {};
  for (const k of FIELDS) if (b[k] !== undefined && b[k] !== null) out[k] = String(b[k]);
  return out;
}

export function toBlock(state) {
  const out = { type: BLOCK_TYPE };
  for (const k of FIELDS) out[k] = state[k];
  return out;
}

/** state is the title (mutated in place on load); onLoaded(state, meta) redraws. */
export function connectPdfHost(S, state, { onLoaded, notice } = {}) {
  return S.connectHost({
    editor: EDITOR,
    blockType: BLOCK_TYPE,
    block: toBlock(state),
    notice,
    onLoad: (block, meta) => {
      Object.assign(state, fromBlock(block));
      if (onLoaded) onLoaded(state, meta);
    },
    onRequest: () => ({ block: toBlock(state), meta: { filename: 'titleblock', title: `${state.project} sheet ${state.sheet}` } }),
  });
}
