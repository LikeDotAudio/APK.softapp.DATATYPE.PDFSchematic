// Part of the APK.audio project — http://APK.audio — made by Anthony Kuzub
// MIT Licence. Free, for everyone, for ever. Full text in LICENSE at the root.
// The title-block round trip over cad.like.audio/host@1 (ROAD-3491), with the
// app's vendored APKSoftapp client in a stub window.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { connectPdfHost, defaultTitle, fromBlock, toBlock, EDITOR, BLOCK_TYPE } from '../js/pdfHost.js';
import { generateTitleBlockSvg } from '../js/pdfExport.js';

const require = createRequire(import.meta.url);
const { world, hostContract } = require('./host-world.cjs');

test('load → edit → request: the CAD gets the edited title block back, at our origin, on host@1', async () => {
  const w = world();
  const state = defaultTitle();
  const loaded = [];
  const host = connectPdfHost(w.S, state, { onLoaded: (s, meta) => loaded.push(meta), notice: false });
  assert.ok(host.embedded);
  assert.deepEqual(w.toParent[0], { m: { protocol: 'cad.like.audio/host@1', type: 'editorReady', editor: EDITOR, blockType: BLOCK_TYPE }, o: w.ORIGIN });

  w.fire({ protocol: w.S.PROTOCOL, type: 'load', block: { type: BLOCK_TYPE, project: 'HALL C', sheet: 2, totalSheets: 9 }, meta: { blockName: 'TB_1' } });
  assert.deepEqual(loaded, [{ blockName: 'TB_1' }]);
  assert.equal(state.project, 'HALL C');
  assert.equal(state.sheet, '2');
  state.rev = '2.1';
  w.fire({ protocol: w.S.PROTOCOL, type: 'request' });
  const save = w.toParent.at(-1);
  assert.equal(save.o, w.ORIGIN, 'never "*"');
  assert.equal(save.m.type, 'blockSave');
  assert.equal(save.m.meta.blockName, 'TB_1');
  assert.equal(save.m.block.rev, '2.1');
  assert.deepEqual(toBlock({ ...defaultTitle(), ...fromBlock(save.m.block) }), save.m.block, 'the block survives a reload');

  const c = await hostContract();
  if (c) for (const { m } of w.toParent) assert.deepEqual(c.validateMessage(c.schema, 'toCad', m), [], m.type);
});

test('the title block escapes every field it draws', () => {
  const svg = generateTitleBlockSvg('<script>x</script>', '01', '02', { engineer: 'A & B' });
  assert.ok(!svg.includes('<script>'));
  assert.match(svg, /ENGINEER: A &amp; B/);
});
