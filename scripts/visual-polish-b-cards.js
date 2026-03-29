// Phase B: Module cards MD3 shadows, TopBar, CTA, Stepper, CompareTable
const root = await figma.getNodeByIdAsync('204:2856');
if (!root) return 'NO_ROOT';
const pg = root.parent && root.parent.type === 'PAGE' ? root.parent : figma.currentPage;
await figma.setCurrentPageAsync(pg);

const TB = [[0, 1, 0], [-1, 0, 1]];
const LR = [[1, 0, 0], [0, 1, 0]];

const MD3 = [
  { type: 'DROP_SHADOW', visible: true,
    color: { r: 0.04, g: 0.1, b: 0.25, a: 0.04 },
    offset: { x: 0, y: 1 }, radius: 3, spread: 0,
    blendMode: 'NORMAL', showShadowBehindNode: true },
  { type: 'DROP_SHADOW', visible: true,
    color: { r: 0.04, g: 0.1, b: 0.25, a: 0.07 },
    offset: { x: 0, y: 4 }, radius: 16, spread: 0,
    blendMode: 'NORMAL', showShadowBehindNode: true }
];

// 1. All Module cards: blue-tinted white + MD3 shadow
const names = ['Module_Stepper','Module_TopSummary','Module_ValueCard',
  'Module_OrderPreview','Module_CompareTable','Module_FormFill','Module_PaySummary'];
for (const nm of names) {
  const c = root.children.find(x => x.name === nm);
  if (!c) continue;
  c.fills = [{ type: 'SOLID', color: { r: 0.992, g: 0.996, b: 1 }, opacity: 1 }];
  c.effects = MD3;
  c.cornerRadius = 20;
}

// 2. TopBar: subtle gradient, drop stroke, add shadow
const bar = root.children.find(c => c.name === 'Module_TopBar');
if (bar) {
  bar.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: LR,
    gradientStops: [
      { position: 0, color: { r: 0.93, g: 0.96, b: 1, a: 0.96 } },
      { position: 1, color: { r: 0.97, g: 0.97, b: 0.98, a: 0.96 } }
    ] }];
  bar.strokes = [];
  bar.cornerRadius = 16;
  bar.effects = [{ type: 'DROP_SHADOW', visible: true,
    color: { r: 0.04, g: 0.12, b: 0.3, a: 0.05 },
    offset: { x: 0, y: 2 }, radius: 8, spread: 0,
    blendMode: 'NORMAL', showShadowBehindNode: true }];
}

// 3. CTA: filled rounded buttons
const cta = root.children.find(c => c.name === 'Module_BottomCTA');
if (cta && cta.children) {
  const sec = cta.children[0];
  if (sec && sec.type === 'FRAME') {
    sec.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.98, b: 1 }, opacity: 1 }];
    sec.cornerRadius = 28;
    sec.strokes = [{ type: 'SOLID', color: { r: 0.08, g: 0.57, b: 0.98 }, opacity: 0.25, visible: true }];
    sec.strokeWeight = 1.5;
    sec.effects = [];
  }
  const pri = cta.children[1];
  if (pri && pri.type === 'FRAME') {
    pri.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: LR,
      gradientStops: [
        { position: 0, color: { r: 0.05, g: 0.50, b: 0.93, a: 1 } },
        { position: 1, color: { r: 0.14, g: 0.60, b: 1, a: 1 } }
      ] }];
    pri.cornerRadius = 28;
    pri.effects = [{ type: 'DROP_SHADOW', visible: true,
      color: { r: 0.06, g: 0.40, b: 0.80, a: 0.3 },
      offset: { x: 0, y: 4 }, radius: 14, spread: 0,
      blendMode: 'NORMAL', showShadowBehindNode: true }];
  }
}

// 4. Stepper first step (推荐): highlight circle
const stepper = root.children.find(c => c.name === 'Module_Stepper');
if (stepper && stepper.children && stepper.children.length >= 1) {
  const first = stepper.children[0]; // Frame { circle_frame, text }
  if (first.children) {
    const circle = first.children.find(c => c.type === 'FRAME' && c.layoutMode === 'NONE');
    if (circle) {
      circle.fills = [{ type: 'GRADIENT_LINEAR', gradientTransform: TB,
        gradientStops: [
          { position: 0, color: { r: 0.05, g: 0.50, b: 0.93, a: 1 } },
          { position: 1, color: { r: 0.14, g: 0.60, b: 1, a: 1 } }
        ] }];
    }
  }
}

// 5. CX_Image_Placeholder: cleaner styling
const imgP = await figma.getNodeByIdAsync('233:2879');
if (imgP) {
  imgP.fills = [{ type: 'SOLID', color: { r: 0.965, g: 0.977, b: 1 }, opacity: 1 }];
  imgP.cornerRadius = 16;
  imgP.strokes = [];
}

// 6. FormFill alert box: tighter radius + no stroke
const formFill = root.children.find(c => c.name === 'Module_FormFill');
if (formFill) {
  const alertBox = formFill.children && formFill.children.find(c =>
    c.type === 'FRAME' && c.fills && c.fills.length > 0 &&
    c.fills[0].color && Math.round(c.fills[0].color.r * 255) === 255 &&
    Math.round(c.fills[0].color.g * 255) === 246);
  if (alertBox) {
    alertBox.cornerRadius = 12;
    alertBox.strokes = [];
  }
}

// 7. PaySummary success box: tighter
const paySummary = root.children.find(c => c.name === 'Module_PaySummary');
if (paySummary) {
  const successBox = paySummary.children && paySummary.children.find(c =>
    c.type === 'FRAME' && c.fills && c.fills.length > 0 &&
    c.fills[0].color && Math.round(c.fills[0].color.g * 255) === 247);
  if (successBox) {
    successBox.cornerRadius = 12;
    successBox.strokes = [];
  }
}

return 'cards_done';
