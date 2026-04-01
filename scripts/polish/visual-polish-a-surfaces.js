// Phase A: Surfaces — root gradient, Feed_Body cards, accent bars, user bubbles
const root = await figma.getNodeByIdAsync('204:2856');
if (!root) return 'NO_ROOT';
const pg = root.parent && root.parent.type === 'PAGE' ? root.parent : figma.currentPage;
await figma.setCurrentPageAsync(pg);

const TB = [[0, 1, 0], [-1, 0, 1]]; // top-to-bottom
const LR = [[1, 0, 0], [0, 1, 0]];  // left-to-right

// 1. Root background: cool gradient
root.fills = [{
  type: 'GRADIENT_LINEAR', gradientTransform: TB,
  gradientStops: [
    { position: 0,    color: { r: 0.914, g: 0.949, b: 1, a: 1 } },
    { position: 0.25, color: { r: 0.953, g: 0.965, b: 0.984, a: 1 } },
    { position: 1,    color: { r: 0.961, g: 0.961, b: 0.969, a: 1 } }
  ]
}];

function findAll(p, name) {
  const r = [];
  if (!p.children) return r;
  for (const c of p.children) {
    if (c.name === name) r.push(c);
    r.push(...findAll(c, name));
  }
  return r;
}

// 2. Feed_Body → white card with corner + shadow
const bodies = findAll(root, 'Feed_Body');
for (const fb of bodies) {
  if (fb.type !== 'FRAME') continue;
  fb.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 1 }];
  fb.cornerRadius = 16;
  if (fb.paddingLeft < 20) fb.paddingLeft = 24;
  if (fb.paddingRight < 20) fb.paddingRight = 24;
  if (fb.paddingTop < 16)  fb.paddingTop = 20;
  if (fb.paddingBottom < 16) fb.paddingBottom = 20;
  fb.effects = [{ type: 'DROP_SHADOW', visible: true,
    color: { r: 0.04, g: 0.12, b: 0.3, a: 0.06 },
    offset: { x: 0, y: 2 }, radius: 10, spread: 0,
    blendMode: 'NORMAL', showShadowBehindNode: true }];
}

// 3. Accent bars → gradient + rounded
const accentNames = ['Feed_Accent', 'Rectangle'];
for (const n of accentNames) {
  const bars = findAll(root, n);
  for (const a of bars) {
    if (a.type !== 'RECTANGLE') continue;
    const pn = a.parent ? a.parent.name : '';
    if (n === 'Rectangle' && !pn.startsWith('Feed_') && !pn.startsWith('Module_Feed')) continue;
    a.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: TB,
      gradientStops: [
        { position: 0, color: { r: 0.05, g: 0.44, b: 0.82, a: 1 } },
        { position: 1, color: { r: 0.33, g: 0.68, b: 0.98, a: 1 } }
      ] }];
    a.cornerRadius = 4;
  }
}

// 4. User bubbles → blue tint, no stroke, more rounded
const turns = root.children.filter(c => c.name === 'Feed_User_Turn');
for (const ut of turns) {
  const b = ut.children && ut.children.find(c => c.name === 'User_Bubble');
  if (!b || b.type !== 'FRAME') continue;
  b.fills = [{ type: 'SOLID', color: { r: 0.906, g: 0.945, b: 1 }, opacity: 1 }];
  b.cornerRadius = 20;
  b.strokes = [];
  b.effects = [{ type: 'DROP_SHADOW', visible: true,
    color: { r: 0.04, g: 0.2, b: 0.5, a: 0.08 },
    offset: { x: 0, y: 2 }, radius: 8, spread: 0,
    blendMode: 'NORMAL', showShadowBehindNode: true }];
  if (b.paddingLeft < 20) b.paddingLeft = 24;
  if (b.paddingRight < 20) b.paddingRight = 24;
  if (b.paddingTop < 12) b.paddingTop = 16;
  if (b.paddingBottom < 12) b.paddingBottom = 16;
}

return { bodies: bodies.length, turns: turns.length, done: true };
