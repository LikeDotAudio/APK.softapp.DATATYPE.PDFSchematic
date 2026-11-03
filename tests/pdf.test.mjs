import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTitleBlockSvg } from '../js/pdfExport.js';

test('PDF exporter generates valid SVG title block with sheet and project metadata', () => {
  const svg = generateTitleBlockSvg('CONCERT HALL', '02', '10');
  assert.match(svg, /<svg/);
  assert.match(svg, /PROJECT: CONCERT HALL/);
  assert.match(svg, /SHEET 02 OF 10/);
});
