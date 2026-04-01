const ROOT_ID = '204:2856';
const PAGE_PAD_X = 40;
const BODY_INNER_PAD = 16;
const TEXT_MAX = 670 - 48;
const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root || root.type !== 'FRAME') return { error: 'ROOT_NOT_FRAME' };
const page = root.parent && root.parent.type === 'PAGE' ? root.parent : figma.currentPage;
await figma.setCurrentPageAsync(page);
const mutated = new Set();
function mark(n) {
  if (n && n.id) mutated.add(n.id);
}
const fontsLoaded = new Set();
async function loadForText(n) {
  if (n.type !== 'TEXT') return;
  const len = n.characters.length;
  if (len === 0) return;
  async function loadOne(f) {
    if (f === figma.mixed) return;
    const key = f.family + '\0' + f.style;
    if (!fontsLoaded.has(key)) {
      await figma.loadFontAsync(f);
      fontsLoaded.add(key);
    }
  }
  if (n.fontName !== figma.mixed) {
    await loadOne(n.fontName);
    return;
  }
  for (let i = 0; i < len; i++) {
    await loadOne(n.getRangeFontName(i, i + 1));
  }
}
async function fixTextNode(n) {
  if (n.type !== 'TEXT') return;
  await loadForText(n);
  n.textAutoResize = 'HEIGHT';
  if (n.width > TEXT_MAX) {
    n.resize(TEXT_MAX, n.height);
    mark(n);
  }
}
async function fixTextsInSubtree(node) {
  for (const t of node.findAll((x) => x.type === 'TEXT')) {
    await fixTextNode(t);
    mark(t);
  }
}
function isAccentLayer(node) {
  return node.name === 'Feed_Accent' || (node.type === 'RECTANGLE' && node.name === 'Rectangle');
}
async function fixFeedRow(row) {
  if (row.type !== 'FRAME') return;
  row.layoutMode = 'HORIZONTAL';
  row.primaryAxisSizingMode = 'AUTO';
  row.counterAxisSizingMode = 'FIXED';
  row.layoutSizingHorizontal = 'FILL';
  row.itemSpacing = 0;
  row.paddingLeft = row.paddingRight = row.paddingTop = row.paddingBottom = 0;
  mark(row);
  for (const c of row.children) {
    if (isAccentLayer(c) && (c.type === 'RECTANGLE' || c.name === 'Feed_Accent')) {
      c.layoutSizingHorizontal = 'FIXED';
      c.layoutSizingVertical = 'FILL';
      if (c.width !== 4) c.resize(4, Math.max(c.height, 40));
      mark(c);
    }
    if (c.type === 'FRAME' && (c.name === 'Feed_Body' || c.name === 'Frame')) {
      c.layoutMode = 'VERTICAL';
      c.primaryAxisSizingMode = 'AUTO';
      c.counterAxisSizingMode = 'FIXED';
      c.layoutSizingHorizontal = 'FILL';
      c.layoutGrow = 1;
      c.paddingLeft = c.paddingRight = BODY_INNER_PAD;
      c.paddingTop = 0;
      c.paddingBottom = 12;
      c.itemSpacing = 8;
      c.counterAxisAlignItems = 'MIN';
      mark(c);
      await fixTextsInSubtree(c);
    }
  }
}
root.layoutMode = 'VERTICAL';
root.primaryAxisSizingMode = 'AUTO';
root.counterAxisSizingMode = 'FIXED';
root.paddingLeft = PAGE_PAD_X;
root.paddingRight = PAGE_PAD_X;
root.paddingTop = 0;
root.paddingBottom = 32;
root.itemSpacing = 24;
root.counterAxisAlignItems = 'MIN';
root.resizeWithoutConstraints(750, root.height);
mark(root);
for (const child of root.children) {
  if (child.type === 'FRAME' || child.type === 'COMPONENT' || child.type === 'INSTANCE') {
    child.layoutSizingHorizontal = 'FILL';
    child.layoutAlign = 'STRETCH';
    mark(child);
  }
  if (child.name === 'Feed_Message' || child.name.startsWith('Feed_CX_')) {
    if (child.name === 'Feed_CX_ImageSlot') {
      child.layoutMode = 'VERTICAL';
      child.primaryAxisSizingMode = 'AUTO';
      child.counterAxisSizingMode = 'FIXED';
      child.layoutSizingHorizontal = 'FILL';
      child.itemSpacing = 12;
      mark(child);
      for (const sub of child.children) {
        if (sub.name === 'Feed_CX_ImageIntro') await fixFeedRow(sub);
        if (sub.name === 'CX_Image_Placeholder') {
          sub.layoutMode = 'VERTICAL';
          sub.primaryAxisSizingMode = 'AUTO';
          sub.counterAxisSizingMode = 'FIXED';
          sub.layoutSizingHorizontal = 'FILL';
          sub.paddingLeft = sub.paddingRight = 16;
          sub.paddingTop = sub.paddingBottom = 16;
          sub.itemSpacing = 12;
          sub.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.98, b: 0.99 } }];
          sub.strokes = [{ type: 'SOLID', color: { r: 0.85, g: 0.9, b: 0.92 } }];
          sub.strokeWeight = 1;
          sub.cornerRadius = 12;
          mark(sub);
          await fixTextsInSubtree(sub);
        }
      }
    } else {
      await fixFeedRow(child);
    }
  }
  if (child.name === 'Module_Feed_Compare') {
    child.layoutMode = 'VERTICAL';
    child.primaryAxisSizingMode = 'AUTO';
    child.layoutSizingHorizontal = 'FILL';
    mark(child);
    for (const sub of child.children) {
      if (sub.name === 'Feed_Message') await fixFeedRow(sub);
    }
  }
}
const fa = root.children.find((c) => c.name === 'Feed_CX_FinalAdvice');
if (fa && fa.type === 'FRAME') {
  await fixFeedRow(fa);
  mark(fa);
}
return { ok: true, phase: '1a', mutatedCount: mutated.size, mutatedNodeIds: Array.from(mutated) };
