// Phase 2: embed SVG row in CX_Image_Placeholder 233:2879
const ROOT_ID = '204:2856';
const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root || root.type !== 'FRAME') return { error: 'ROOT_NOT_FOUND' };
const page = root.parent && root.parent.type === 'PAGE' ? root.parent : figma.currentPage;
await figma.setCurrentPageAsync(page);

const ph = await figma.getNodeByIdAsync('233:2879');
const createdSvgIds = [];
const mutated = [];

if (!ph || ph.type !== 'FRAME') {
  return { error: 'PLACEHOLDER_NOT_FRAME', ph: ph ? ph.type : null };
}

for (const ch of [...ph.children]) {
  if (ch.name && (ch.name.startsWith('CX_Svg') || ch.name === 'CX_Svg_Row')) {
    ch.remove();
  }
}

const row = figma.createFrame();
row.name = 'CX_Svg_Row';
row.layoutMode = 'HORIZONTAL';
row.primaryAxisSizingMode = 'AUTO';
row.counterAxisSizingMode = 'AUTO';
row.itemSpacing = 24;
row.fills = [];
ph.appendChild(row);
row.layoutSizingHorizontal = 'FILL';
mutated.push(row.id);

const cabinSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160" viewBox="0 0 400 160">' +
  '<rect fill="#E8F4F8" width="400" height="160" rx="12"/>' +
  '<rect fill="#008CA5" opacity="0.12" x="24" y="48" width="352" height="64" rx="8"/>' +
  '<circle fill="#008CA5" opacity="0.35" cx="80" cy="80" r="18"/>' +
  '<circle fill="#008CA5" opacity="0.35" cx="200" cy="80" r="18"/>' +
  '<circle fill="#008CA5" opacity="0.35" cx="320" cy="80" r="18"/>' +
  '</svg>';

const starSvg =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 146.79 25.39" width="220" height="40">' +
  '<defs><linearGradient id="g" x1="43.44" y1=".39" x2="43.44" y2="26.14" gradientUnits="userSpaceOnUse">' +
  '<stop offset="0" stop-color="#f9d296"/><stop offset=".99" stop-color="#f2993b"/></linearGradient></defs>' +
  '<path fill="url(#g)" stroke="#b27230" stroke-width="0.5" d="m14.58,1.13l2.95,5.98c.19.39.57.66,1,.73l6.6.96c1.09.16,1.52,1.49.73,2.26l-4.78,4.65c-.31.3-.46.74-.38,1.17l1.13,6.57c.19,1.08-.95,1.91-1.92,1.4l-5.9-3.1c-.39-.2-.85-.2-1.23,0l-5.9,3.1c-.97.51-2.11-.31-1.92-1.4l1.13-6.57c.07-.43-.07-.87-.38-1.17L.92,11.05c-.79-.77-.35-2.1.73-2.26l6.6-.96c.43-.06.81-.33,1-.73l2.95-5.98c.49-.99,1.89-.99,2.38,0Z"/>' +
  '</svg>';

const mediaSvg =
  '<?xml version="1.0" encoding="utf-8"?>' +
  '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 22 22">' +
  '<path fill="#008CA5" d="M2.2,18.4c-0.1,0-0.3,0-0.4-0.1c-0.1-0.1-0.2-0.2-0.2-0.4L0,5.3C0,5.2,0,5,0.1,4.9s0.2-0.2,0.4-0.2l15.5-2c0.3,0,0.6,0.2,0.7,0.5L17.1,6l-1.2,0.1l-0.3-2.2L1.3,5.8l1.4,11.3l2.5-0.3L5.4,18L2.2,18.4z"/>' +
  '<path fill="#008CA5" d="M21.4,19.3H5.7c-0.3,0-0.6-0.3-0.6V6.1c0-0.3,0.3-0.6,0.6-0.6h15.7c0.3,0,0.6,0.3,0.6,0.6v12.6C22,19.1,21.7,19.3,21.4,19.3z M6.3,18.1h14.5V6.7H6.3V18.1z"/>' +
  '</svg>';

function addSvg(name, s) {
  const node = figma.createNodeFromSvg(s);
  node.name = name;
  row.appendChild(node);
  createdSvgIds.push(node.id);
  mutated.push(node.id);
}

addSvg('CX_Svg_CabinStrip', cabinSvg);
addSvg('CX_Svg_Stars', starSvg);
addSvg('CX_Svg_Media', mediaSvg);
mutated.push(ph.id);

async function loadTextFonts(t) {
  const len = t.characters.length;
  if (len === 0) return;
  if (t.fontName !== figma.mixed) {
    await figma.loadFontAsync(t.fontName);
    return;
  }
  for (let i = 0; i < len; i++) {
    const f = t.getRangeFontName(i, i + 1);
    if (f !== figma.mixed) await figma.loadFontAsync(f);
  }
}

const t2877 = await figma.getNodeByIdAsync('233:2877');
if (t2877 && t2877.type === 'TEXT') {
  await loadTextFonts(t2877);
  t2877.textAutoResize = 'HEIGHT';
  t2877.characters =
    '本机国泰 B777「00-完整页面.png」当前为无效占位（体积极小）。已在下方嵌入 A350-1000 目录下 seatmaps 风格 SVG（星级条 + 媒体图标）作为图证示例。';
  if (t2877.width > 622) t2877.resize(622, t2877.height);
  mutated.push(t2877.id);
}

const t2880 = await figma.getNodeByIdAsync('233:2880');
if (t2880 && t2880.type === 'TEXT') {
  await loadTextFonts(t2880);
  t2880.textAutoResize = 'HEIGHT';
  t2880.characters = 'SVG 图证已内嵌 · 内容宽 670';
  if (t2880.width > 622) t2880.resize(622, t2880.height);
  mutated.push(t2880.id);
}

return {
  ok: true,
  phase: 2,
  createdSvgIds,
  mutatedNodeIds: mutated,
};
