const ROOT_ID = '204:2856';
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
const moduleConfigs = [
  'Module_TopBar',
  'Module_Stepper',
  'Module_TopSummary',
  'Module_ValueCard',
  'Module_OrderPreview',
  'Module_CompareTable',
  'Module_FormFill',
  'Module_PaySummary',
  'Module_BottomCTA',
];
for (const name of moduleConfigs) {
  const m = root.children.find((c) => c.name === name);
  if (!m || m.type !== 'FRAME') continue;
  m.layoutMode = 'VERTICAL';
  m.primaryAxisSizingMode = 'AUTO';
  m.counterAxisSizingMode = 'FIXED';
  m.layoutSizingHorizontal = 'FILL';
  m.itemSpacing = name === 'Module_TopBar' ? 0 : 12;
  m.paddingLeft = m.paddingRight = 0;
  m.paddingTop = m.paddingBottom = 0;
  mark(m);
  if (name === 'Module_TopBar') {
    m.layoutMode = 'HORIZONTAL';
    m.paddingLeft = m.paddingRight = 16;
    m.paddingTop = m.paddingBottom = 12;
    m.primaryAxisAlignItems = 'CENTER';
    m.counterAxisAlignItems = 'CENTER';
    m.itemSpacing = 12;
    await fixTextsInSubtree(m);
  } else {
    m.paddingLeft = m.paddingRight = 24;
    m.paddingTop = m.paddingBottom = 24;
    await fixTextsInSubtree(m);
  }
  for (const ch of m.children) {
    if (ch.type === 'FRAME') {
      ch.layoutSizingHorizontal = 'FILL';
      mark(ch);
    }
  }
}
await fixTextsInSubtree(root);
const textUpdates = [
  { id: '233:2876', text: '图证（FlightData · SVG）' },
  {
    id: '233:2877',
    text:
      '本机国泰 B777「00-完整页面.png」当前为无效占位（体积极小）。Phase2 将嵌入 A350-1000 目录风格 SVG（星级条 + 媒体图标）作为图证示例。',
  },
  { id: '233:2878', text: '若需真实机舱照片，请替换为有效 PNG/JPG 或使用 seatmaps 导出后再拖入。' },
  { id: '233:2880', text: 'SVG 图证将内嵌 · 内容宽 670' },
  {
    id: '205:2862',
    text:
      '可选第二落点：再放一张机舱/座椅图。请使用有效图片文件；当前 FlightData 内部分 PNG 可能为空占位。',
  },
];
for (const u of textUpdates) {
  const tn = await figma.getNodeByIdAsync(u.id);
  if (tn && tn.type === 'TEXT') {
    await loadForText(tn);
    tn.textAutoResize = 'HEIGHT';
    tn.characters = u.text;
    if (tn.width > TEXT_MAX) tn.resize(TEXT_MAX, tn.height);
    mark(tn);
  }
}
return { ok: true, phase: '1b', mutatedCount: mutated.size, mutatedNodeIds: Array.from(mutated) };
