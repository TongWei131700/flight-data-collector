// Runs in Figma via use_figma — HC_Immersive_Root 204:2856
const ROOT_ID = '204:2856';
const CONTENT_W = 670;
const PAGE_PAD_X = 40;
const BODY_INNER_PAD = 16;
// 670 内容区；带 24 边距的模块内正文约 622，统一用 622 避免撑出父级
const TEXT_MAX = CONTENT_W - 48;

const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root || root.type !== 'FRAME') {
  return { error: 'ROOT_NOT_FRAME', id: ROOT_ID };
}

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
  const cap = TEXT_MAX;
  if (n.width > cap) {
    n.resize(cap, n.height);
    mark(n);
  }
}

async function fixTextsInSubtree(node) {
  const texts = node.findAll((x) => x.type === 'TEXT');
  for (const t of texts) {
    await fixTextNode(t);
    mark(t);
  }
}

function isAccentLayer(node) {
  return (
    node.name === 'Feed_Accent' ||
    (node.type === 'RECTANGLE' && node.name === 'Rectangle')
  );
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
    if (isAccentLayer(c)) {
      if (c.type === 'RECTANGLE' || c.name === 'Feed_Accent') {
        c.layoutSizingHorizontal = 'FIXED';
        c.layoutSizingVertical = 'FILL';
        if (c.width !== 4) {
          c.resize(4, Math.max(c.height, 40));
        }
        mark(c);
      }
    }
    if (
      c.type === 'FRAME' &&
      (c.name === 'Feed_Body' || c.name === 'Frame')
    ) {
      c.layoutMode = 'VERTICAL';
      c.primaryAxisSizingMode = 'AUTO';
      c.counterAxisSizingMode = 'FIXED';
      c.layoutSizingHorizontal = 'FILL';
      c.layoutGrow = 1;
      c.paddingLeft = BODY_INNER_PAD;
      c.paddingRight = BODY_INNER_PAD;
      c.paddingTop = 0;
      c.paddingBottom = 12;
      c.itemSpacing = 8;
      c.counterAxisAlignItems = 'MIN';
      mark(c);
      await fixTextsInSubtree(c);
    }
  }
}

// Root: 750 宽，左右 40 → 内容 670（对齐学习文件.MD）
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
          sub.fills = [
            {
              type: 'SOLID',
              color: { r: 0.96, g: 0.98, b: 0.99 },
            },
          ];
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

// Module blocks：统一纵向排布 + 内边距，避免子层把宽度撑爆
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
  m.paddingLeft = m.paddingRight = name === 'Module_TopBar' ? 0 : 0;
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

// 文案修正：本机 B777 整页 PNG 实为坏文件（约 38B），改为 SVG 图证说明
const textUpdates = [
  {
    id: '233:2876',
    text: '图证（FlightData · SVG）',
  },
  {
    id: '233:2877',
    text:
      '本机国泰 B777「00-完整页面.png」当前为无效占位（体积极小）。已在下方嵌入 A350-1000 目录下 seatmaps 风格 SVG（星级条 + 媒体图标）作为图证示例。',
  },
  {
    id: '233:2878',
    text: '若需真实机舱照片，请替换为有效 PNG/JPG 或使用 seatmaps 导出后再拖入。',
  },
  {
    id: '233:2880',
    text: 'SVG 图证已内嵌 · 内容宽 670',
  },
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

// 在 CX_Image_Placeholder 内嵌 SVG（避免插件读本地盘）
const ph = await figma.getNodeByIdAsync('233:2879');
const createdSvgIds = [];
if (ph && ph.type === 'FRAME') {
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
  mark(row);

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
    mark(node);
  }

  addSvg('CX_Svg_CabinStrip', cabinSvg);
  addSvg('CX_Svg_Stars', starSvg);
  addSvg('CX_Svg_Media', mediaSvg);
  mark(ph);
}

return {
  ok: true,
  mutatedNodeIds: Array.from(mutated),
  createdSvgIds,
  note: 'Root padding 40 → content 670; texts max ~622px; SVG proof embedded.',
};
