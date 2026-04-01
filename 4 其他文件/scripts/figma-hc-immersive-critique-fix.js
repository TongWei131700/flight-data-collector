// HC_Immersive_Root 体验向修复：称谓统一、Stepper 可读、图证行换行、插入用户气泡
const ROOT_ID = '204:2856';
const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root || root.type !== 'FRAME') return { error: 'ROOT_NOT_FRAME' };
const page = root.parent && root.parent.type === 'PAGE' ? root.parent : figma.currentPage;
await figma.setCurrentPageAsync(page);

const mutated = [];
const created = [];

function mark(n) {
  if (n && n.id) mutated.push(n.id);
}
function track(n) {
  if (n && n.id) created.push(n.id);
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

const refBody = await figma.getNodeByIdAsync('204:2874');
if (!refBody || refBody.type !== 'TEXT') return { error: 'NO_REF_TEXT' };
await loadForText(refBody);
const fn = refBody.fontName;
if (fn === figma.mixed) return { error: 'REF_FONT_MIXED' };
await figma.loadFontAsync(fn);

// --- 1) 称谓与顶栏一致 ---
for (const n of root.findAll((x) => x.type === 'TEXT')) {
  if (n.characters !== 'AI 助手 · 刚刚') continue;
  await loadForText(n);
  n.characters = '飞猪顾问 · 刚刚';
  mark(n);
}

// --- 2) Stepper 横向排布 + 子列自适应高度 ---
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

// --- 3) 图证 SVG 行允许换行，避免超出 638 内容宽 ---
const svgRow = await figma.getNodeByIdAsync('328:2856');
if (svgRow && svgRow.type === 'FRAME' && svgRow.layoutMode === 'HORIZONTAL') {
  svgRow.layoutWrap = 'WRAP';
  svgRow.counterAxisSpacing = 12;
  svgRow.counterAxisAlignItems = 'MIN';
  mark(svgRow);
}

// --- 4) 价值卡大图占位：浅底提示，避免「死灰一块」 ---
const heroPh = await figma.getNodeByIdAsync('205:2863');
if (heroPh && heroPh.type === 'FRAME') {
  const fills = [...(heroPh.fills || [])];
  if (fills.length === 0 || fills[0].type === 'SOLID') {
    heroPh.fills = [
      {
        type: 'SOLID',
        color: { r: 0.96, g: 0.97, b: 0.98 },
      },
    ];
  }
  heroPh.strokes = [{ type: 'SOLID', color: { r: 0.86, g: 0.89, b: 0.92 } }];
  heroPh.strokeWeight = 1;
  heroPh.cornerRadius = 12;
  mark(heroPh);
}

// --- 5) 用户气泡（插在 TopBar 后、首条 Feed 前；插在首条与第二条 Feed 之间）---
function makeUserTurn(copy) {
  const wrap = figma.createFrame();
  wrap.name = 'Feed_User_Turn';
  wrap.layoutMode = 'HORIZONTAL';
  wrap.primaryAxisSizingMode = 'AUTO';
  wrap.counterAxisSizingMode = 'AUTO';
  wrap.primaryAxisAlignItems = 'MAX';
  wrap.counterAxisAlignItems = 'MIN';
  wrap.paddingLeft = 0;
  wrap.paddingRight = 0;
  wrap.fills = [];

  const bubble = figma.createFrame();
  bubble.name = 'User_Bubble';
  bubble.layoutMode = 'VERTICAL';
  bubble.primaryAxisSizingMode = 'AUTO';
  bubble.counterAxisSizingMode = 'AUTO';
  bubble.itemSpacing = 6;
  bubble.paddingLeft = bubble.paddingRight = 12;
  bubble.paddingTop = bubble.paddingBottom = 10;
  bubble.cornerRadius = 14;
  bubble.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.96, b: 0.97 } }];
  bubble.strokes = [{ type: 'SOLID', color: { r: 0.86, g: 0.88, b: 0.91 } }];
  bubble.strokeWeight = 1;

  const meta = figma.createText();
  meta.fontName = fn;
  meta.fontSize = 22;
  meta.lineHeight = { unit: 'PIXELS', value: 32 };
  meta.fills = [{ type: 'SOLID', color: { r: 0.57, g: 0.59, b: 0.6 } }];
  meta.characters = '我 · 刚刚';
  meta.textAutoResize = 'HEIGHT';
  meta.resize(200, meta.height);
  bubble.appendChild(meta);

  const body = figma.createText();
  body.fontName = fn;
  body.fontSize = 26;
  body.lineHeight = { unit: 'PIXELS', value: 38 };
  body.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.07, b: 0.1 } }];
  body.characters = copy;
  body.textAutoResize = 'HEIGHT';
  body.resize(520, body.height);
  bubble.appendChild(body);

  wrap.appendChild(bubble);
  bubble.layoutSizingHorizontal = 'HUG';
  track(wrap);
  track(bubble);
  track(meta);
  track(body);
  mark(wrap);
  return wrap;
}

const u1 = makeUserTurn('我下周上海飞北京，有一程红眼+中转，怕落地废掉。商务舱这次值不值？');
const u2 = makeUserTurn('国泰 A350 那班我想多了解下，我主要想睡得好一点。');

const topBar = root.children.find((c) => c.name === 'Module_TopBar');
const secondFeed = root.children.find((c) => c.name === 'Feed_Message' && c.id === '204:2869');

let insertAt = 1;
if (topBar) insertAt = root.children.indexOf(topBar) + 1;
root.insertChild(insertAt, u1);
u1.layoutSizingHorizontal = 'FILL';

const idxSecond = root.children.indexOf(secondFeed);
if (idxSecond >= 0) {
  root.insertChild(idxSecond, u2);
  u2.layoutSizingHorizontal = 'FILL';
}

return {
  ok: true,
  mutatedNodeIds: mutated,
  createdNodeIds: created,
  note: 'Meta 统一飞猪顾问；Stepper 横向；SVG 行 WRAP；价值卡占位描边；2 条用户气泡',
};
