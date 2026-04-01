// Part B：在 TopBar 后、首条与第二条 Feed_Message 之间插入用户气泡
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

for (const ch of [...root.children]) {
  if (ch.name === 'Feed_User_Turn') {
    ch.remove();
    mark(ch);
  }
}

function makeUserTurn(copy) {
  const wrap = figma.createFrame();
  wrap.name = 'Feed_User_Turn';
  wrap.layoutMode = 'HORIZONTAL';
  wrap.primaryAxisSizingMode = 'AUTO';
  wrap.counterAxisSizingMode = 'AUTO';
  wrap.primaryAxisAlignItems = 'MAX';
  wrap.counterAxisAlignItems = 'MIN';
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

return { ok: true, part: 'B', mutatedNodeIds: mutated, createdNodeIds: created };
