// Phase C: Typography hierarchy — titles, meta, prices
const root = await figma.getNodeByIdAsync('204:2856');
if (!root) return 'NO_ROOT';
const pg = root.parent && root.parent.type === 'PAGE' ? root.parent : figma.currentPage;
await figma.setCurrentPageAsync(pg);

await figma.loadFontAsync({ family: 'PingFang SC', style: 'Semibold' });
await figma.loadFontAsync({ family: 'PingFang SC', style: 'Medium' });
await figma.loadFontAsync({ family: 'PingFang SC', style: 'Regular' });

function findAll(p, pred) {
  const r = [];
  if (!p.children) return r;
  for (const c of p.children) {
    if (pred(c)) r.push(c);
    r.push(...findAll(c, pred));
  }
  return r;
}

// 1. Feed section titles (28px Semi Bold → 30px, add brand-dark color)
const BRAND_DARK = { r: 0.067, g: 0.22, b: 0.44 }; // #114070 deep blue
const titles = findAll(root, n =>
  n.type === 'TEXT' && n.fontSize === 28 &&
  typeof n.fontName === 'object' && n.fontName.style === 'Semibold'
);
for (const t of titles) {
  t.fontSize = 30;
  t.fills = [{ type: 'SOLID', color: BRAND_DARK, opacity: 1 }];
  t.lineHeight = { value: 44, unit: 'PIXELS' };
}

// 2. Feed meta text "飞猪顾问 · 刚刚" → add colored dot prefix
const metas = findAll(root, n =>
  n.type === 'TEXT' && n.characters && n.characters.startsWith('飞猪顾问')
);
for (const m of metas) {
  const old = m.characters;
  if (!old.startsWith('● ')) {
    m.characters = '● ' + old;
    m.setRangeFills(0, 1, [{ type: 'SOLID', color: { r: 0.08, g: 0.57, b: 0.98 }, opacity: 1 }]);
    m.setRangeFills(2, m.characters.length,
      [{ type: 'SOLID', color: { r: 0.57, g: 0.59, b: 0.6 }, opacity: 1 }]);
  }
}

// 3. User meta "我 · 刚刚" → tinted dot
const userMetas = findAll(root, n =>
  n.type === 'TEXT' && n.characters && n.characters.startsWith('我 ·')
);
for (const m of userMetas) {
  const old = m.characters;
  if (!old.startsWith('● ')) {
    m.characters = '● ' + old;
    m.setRangeFills(0, 1, [{ type: 'SOLID', color: { r: 0.4, g: 0.65, b: 0.95 }, opacity: 1 }]);
    m.setRangeFills(2, m.characters.length,
      [{ type: 'SOLID', color: { r: 0.57, g: 0.59, b: 0.6 }, opacity: 1 }]);
  }
}

// 4. Body text: set proper line height
const bodyTexts = findAll(root, n =>
  n.type === 'TEXT' && n.fontSize === 26
);
for (const t of bodyTexts) {
  t.lineHeight = { value: 42, unit: 'PIXELS' };
}

// 5. Price "示例参考价 ¥2480 起" → larger + bolder
const priceNode = await figma.getNodeByIdAsync('205:2859');
if (priceNode && priceNode.type === 'TEXT') {
  priceNode.fontSize = 32;
  priceNode.fontName = { family: 'PingFang SC', style: 'Semibold' };
  priceNode.lineHeight = { value: 48, unit: 'PIXELS' };
}

// 6. "合计 ¥3,860" → bigger
const totalPrice = await figma.getNodeByIdAsync('206:2919');
if (totalPrice && totalPrice.type === 'TEXT') {
  totalPrice.fontSize = 30;
  totalPrice.fontName = { family: 'PingFang SC', style: 'Semibold' };
}

// 7. TopBar title "飞猪顾问" → medium weight, slightly larger
const barTitle = await figma.getNodeByIdAsync('204:2859');
if (barTitle && barTitle.type === 'TEXT') {
  barTitle.fontSize = 30;
}

// 8. Module section titles (inside cards) – 28px Semi Bold → bump to 30
const cardTitleIds = ['205:2875','206:2886','206:2904','205:2857'];
for (const id of cardTitleIds) {
  const n = await figma.getNodeByIdAsync(id);
  if (n && n.type === 'TEXT') {
    n.fontSize = 30;
    n.fills = [{ type: 'SOLID', color: BRAND_DARK, opacity: 1 }];
    n.lineHeight = { value: 44, unit: 'PIXELS' };
  }
}

// 9. "对比经济舱 · 看差在哪" text → brand color
const secText = await figma.getNodeByIdAsync('205:2890');
if (secText && secText.type === 'TEXT') {
  secText.fills = [{ type: 'SOLID', color: { r: 0.06, g: 0.50, b: 0.93 }, opacity: 1 }];
}

return { titles: titles.length, metas: metas.length, bodies: bodyTexts.length };
