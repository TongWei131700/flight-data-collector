// Part A：称谓、Stepper、SVG 换行、价值卡占位（无新建气泡）
const ROOT_ID = '204:2856';
const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root || root.type !== 'FRAME') return { error: 'ROOT_NOT_FRAME' };
const page = root.parent && root.parent.type === 'PAGE' ? root.parent : figma.currentPage;
await figma.setCurrentPageAsync(page);

const mutated = [];

function mark(n) {
  if (n && n.id) mutated.push(n.id);
}

async function loadForText(n) {
  if (n.type !== 'TEXT') return;
  const len = n.characters.length;
  if (len === 0) return;
  if (n.fontName !== figma.mixed) {
    await figma.loadFontAsync(n.fontName);
    return;
  }
  for (let i = 0; i < len; i++) {
    const f = n.getRangeFontName(i, i + 1);
    if (f !== figma.mixed) await figma.loadFontAsync(f);
  }
}

for (const n of root.findAll((x) => x.type === 'TEXT')) {
  if (n.characters !== 'AI 助手 · 刚刚') continue;
  await loadForText(n);
  n.characters = '飞猪顾问 · 刚刚';
  mark(n);
}

const stepper = await figma.getNodeByIdAsync('204:2876');
if (stepper && stepper.type === 'FRAME') {
  stepper.layoutMode = 'HORIZONTAL';
  stepper.primaryAxisSizingMode = 'FIXED';
  stepper.counterAxisSizingMode = 'AUTO';
  stepper.layoutSizingHorizontal = 'FILL';
  stepper.itemSpacing = 12;
  stepper.paddingTop = stepper.paddingBottom = 16;
  stepper.paddingLeft = stepper.paddingRight = 16;
  stepper.primaryAxisAlignItems = 'CENTER';
  stepper.counterAxisAlignItems = 'CENTER';
  mark(stepper);
  for (const ch of stepper.children) {
    if (ch.type !== 'FRAME') continue;
    ch.layoutMode = 'VERTICAL';
    ch.primaryAxisSizingMode = 'AUTO';
    ch.counterAxisSizingMode = 'AUTO';
    ch.layoutSizingHorizontal = 'HUG';
    ch.layoutGrow = 1;
    ch.itemSpacing = 6;
    ch.primaryAxisAlignItems = 'CENTER';
    ch.counterAxisAlignItems = 'CENTER';
    mark(ch);
  }
}

const svgRow = await figma.getNodeByIdAsync('328:2856');
if (svgRow && svgRow.type === 'FRAME' && svgRow.layoutMode === 'HORIZONTAL') {
  svgRow.layoutWrap = 'WRAP';
  svgRow.counterAxisSpacing = 12;
  svgRow.counterAxisAlignItems = 'MIN';
  mark(svgRow);
}

const heroPh = await figma.getNodeByIdAsync('205:2863');
if (heroPh && heroPh.type === 'FRAME') {
  heroPh.fills = [
    {
      type: 'SOLID',
      color: { r: 0.96, g: 0.97, b: 0.98 },
    },
  ];
  heroPh.strokes = [{ type: 'SOLID', color: { r: 0.86, g: 0.89, b: 0.92 } }];
  heroPh.strokeWeight = 1;
  heroPh.cornerRadius = 12;
  mark(heroPh);
}

return { ok: true, part: 'A', mutatedNodeIds: mutated };
