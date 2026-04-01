/**
 * Figma MCP use_figma：在文件 YJivJiM80jHttJvfV3ejpG 中创建
 * 页「模块_AircraftCabinFacts」、组件集 Cmp_AccordionRow / Mod_AircraftCabinFacts 及示例帧。
 *
 * 用法：将下方 USE_FIGMA_CODE 字符串作为 MCP tool use_figma 的 code 参数，
 * fileKey: YJivJiM80jHttJvfV3ejpG，description 自定。
 */
module.exports.USE_FIGMA_CODE = String.raw`async function run() {
  try {
    for (const f of [
      { family: "Inter", style: "Regular" },
      { family: "Inter", style: "Semi Bold" },
    ]) {
      await figma.loadFontAsync(f);
    }
  } catch (e) {
    figma.notify("Font load: " + e);
  }

  const PAGE_NAME = "模块_AircraftCabinFacts";
  let page = figma.root.children.find(function (p) {
    return p.name === PAGE_NAME;
  });
  if (!page) {
    page = figma.createPage();
    page.name = PAGE_NAME;
  }
  figma.currentPage = page;

  const COL_INK = { r: 0.06, g: 0.075, b: 0.102 };
  const COL_SEC = { r: 0.36, g: 0.37, b: 0.4 };
  const COL_TER = { r: 0.57, g: 0.58, b: 0.6 };
  const COL_BORDER = { r: 0.933, g: 0.933, b: 0.933 };
  const COL_CARD = { r: 1, g: 1, b: 1 };
  const COL_PAGE = { r: 0.969, g: 0.969, b: 0.973 };
  const W = 390;

  function rmNamed(nms) {
    var set = {};
    for (var i = 0; i < nms.length; i++) set[nms[i]] = true;
    page.findAll(function (n) {
      if (set[n.name]) {
        try {
          n.remove();
        } catch (e) {}
      }
    });
  }
  rmNamed([
    "Cmp_AccordionRow",
    "Mod_AircraftCabinFacts",
    "Example_A321neo_Full",
    "Example_DataHealth_Empty",
  ]);

  function mkFrame(name, opts) {
    var f = figma.createFrame();
    f.name = name;
    f.fills = [{ type: "SOLID", color: opts.bg || COL_CARD }];
    f.layoutMode = opts.layout || "VERTICAL";
    f.primaryAxisSizingMode = opts.primary || "AUTO";
    f.counterAxisSizingMode = opts.counter || "FIXED";
    f.layoutSizingHorizontal = "FIXED";
    f.layoutSizingVertical = opts.vsz || "HUG";
    f.resize(opts.w || W, opts.h || 80);
    f.itemSpacing = opts.gap || 8;
    f.paddingLeft = opts.pl != null ? opts.pl : 16;
    f.paddingRight = opts.pr != null ? opts.pr : 16;
    f.paddingTop = opts.pt != null ? opts.pt : 16;
    f.paddingBottom = opts.pb != null ? opts.pb : 16;
    if (opts.radius) f.cornerRadius = opts.radius;
    if (opts.stroke) {
      f.strokes = [{ type: "SOLID", color: COL_BORDER }];
      f.strokeWeight = 1;
    }
    return f;
  }

  function txt(content, opts) {
    var t = figma.createText();
    t.fontName = opts && opts.bold
      ? { family: "Inter", style: "Semi Bold" }
      : { family: "Inter", style: "Regular" };
    t.characters = content;
    t.fontSize = (opts && opts.size) || 14;
    t.lineHeight = {
      unit: "PIXELS",
      value: (opts && opts.lh) || Math.round(((opts && opts.size) || 14) * 1.45),
    };
    t.fills = [{ type: "SOLID", color: (opts && opts.color) || COL_INK }];
    if (opts && opts.width) {
      t.resize(opts.width, 400);
      t.textAutoResize = "HEIGHT";
    }
    return t;
  }

  function accordionRow(rowType, state) {
    var root = mkFrame("Row", {
      w: W - 40,
      bg: COL_CARD,
      gap: 0,
      pl: 0,
      pr: 0,
      pt: 0,
      pb: 0,
      radius: 12,
      stroke: true,
    });
    var header = mkFrame("Header", {
      w: W - 40,
      layout: "HORIZONTAL",
      primary: "SPACE_BETWEEN",
      gap: 8,
      pl: 14,
      pr: 14,
      pt: 12,
      pb: 12,
      bg: COL_CARD,
    });
    header.layoutAlign = "STRETCH";
    var titles = {
      Facts: "商务舱座椅（反鱼骨）",
      Rating: "口碑与评分",
      Compare: "与宽体机对比",
      Tips: "选座与出行提示",
      Routes: "典型航线与推荐",
    };
    header.appendChild(txt(titles[rowType], { bold: true, size: 15, width: 240 }));
    header.appendChild(
      txt(state === "Collapsed" ? "展开" : "收起", { size: 13, color: COL_TER })
    );
    root.appendChild(header);
    if (state === "Expanded") {
      var body = mkFrame("Body", {
        w: W - 40,
        gap: 8,
        pl: 14,
        pr: 14,
        pt: 0,
        pb: 14,
        bg: COL_CARD,
      });
      body.layoutAlign = "STRETCH";
      if (rowType === "Facts") {
        var ph = figma.createRectangle();
        ph.resize(320, 120);
        ph.fills = [{ type: "SOLID", color: { r: 0.94, g: 0.95, b: 0.97 } }];
        ph.cornerRadius = 8;
        body.appendChild(ph);
        body.appendChild(
          txt("Media=Image 占位：公务舱实景（HTTPS CDN / CabinKB）", {
            size: 11,
            color: COL_SEC,
            width: 300,
          })
        );
      }
      var bodies = {
        Facts:
          "180° 全平躺 · 38英寸腿距 · 21英寸宽（53cm）· 反向鱼骨 · IFE · USB",
        Rating:
          "综合 4.41/5 · 127 条评论 · 约 75% 五星（rating_breakdown）。",
        Compare:
          "A321neo 174 座 vs A350 系列 — 区域线 vs 长途（comparison[]）。",
        Tips:
          "商务：1–2 排靠窗优先。经济：出口/前排；避免最后排与盥洗室旁（seat_tips）。",
        Routes:
          "香港往返台北/北上/日韩/东南亚等区域线（routes_sample）。",
      };
      body.appendChild(txt(bodies[rowType], { size: 13, color: COL_SEC, width: 330 }));
      root.appendChild(body);
    }
    return root;
  }

  var types = ["Facts", "Rating", "Compare", "Tips", "Routes"];
  var comps = [];
  for (var i = 0; i < types.length; i++) {
    var rt = types[i];
    for (var si = 0; si < 2; si++) {
      var st = si === 0 ? "Collapsed" : "Expanded";
      var c = figma.createComponent();
      c.name = "RowType=" + rt + ", State=" + st;
      c.layoutMode = "VERTICAL";
      c.primaryAxisSizingMode = "AUTO";
      c.counterAxisSizingMode = "FIXED";
      c.layoutSizingHorizontal = "FIXED";
      c.layoutSizingVertical = "HUG";
      c.itemSpacing = 0;
      c.fills = [];
      var inner = accordionRow(rt, st);
      while (inner.children.length) c.appendChild(inner.children[0]);
      inner.remove();
      c.resize(W - 24, c.height);
      page.appendChild(c);
      comps.push(c);
    }
  }

  var accSet = figma.combineAsVariants(comps, page);
  accSet.name = "Cmp_AccordionRow";
  accSet.x = 40;
  accSet.y = 40;
  accSet.description =
    "手风琴行组件集。属性：RowType (Facts/Rating/Compare/Tips/Routes)、State (Collapsed/Expanded)。Facts+Expanded 内含 Media 占位矩形；实例可隐藏该矩形表示 Media=None。DataHealth 由正文覆盖，不单独设 Figma 变体。\nJSON：cabins、rating_breakdown、comparison、seat_tips、routes_sample、warnings。";

  function buildModule(focus) {
    var M = mkFrame("ModInner", {
      w: W,
      bg: COL_PAGE,
      gap: 12,
      pl: 12,
      pr: 12,
      pt: 16,
      pb: 20,
      stroke: false,
    });
    M.fills = [{ type: "SOLID", color: COL_PAGE }];
    var sum = mkFrame("Slot_Summary", {
      w: W - 24,
      stroke: true,
      radius: 12,
      gap: 6,
    });
    sum.appendChild(txt("Airbus A321neo · 国泰航空", { bold: true, size: 17, width: 340 }));
    sum.appendChild(
      txt(
        "综合评分 4.41/5 · 127 条评价 · 数据源 seatmaps.com（2026-03-24）",
        { size: 12, color: COL_SEC, width: 340 }
      )
    );
    sum.appendChild(
      txt("FocusCabin=" + focus + " · 对齐 Mod_AircraftCabinFacts 变体", {
        size: 11,
        color: COL_TER,
        width: 340,
      })
    );
    M.appendChild(sum);
    var tbl = mkFrame("Slot_CabinTable", { w: W - 24, stroke: true, radius: 12, gap: 6 });
    tbl.appendChild(txt("舱位配置", { bold: true, size: 14, width: 340 }));
    tbl.appendChild(
      txt(
        "商务舱 12 · 38英寸 / 21英寸 / 180° 平躺\n经济舱 162 · 30英寸 / 18英寸 · 标准\n总计 174（cabins[]）",
        { size: 12, color: COL_SEC, width: 340 }
      )
    );
    M.appendChild(tbl);
    var grp = mkFrame("Group_Accordions", {
      w: W - 24,
      gap: 10,
      pl: 0,
      pr: 0,
      pt: 0,
      pb: 0,
    });
    grp.fills = [];
    var order = ["Facts", "Rating", "Compare", "Tips", "Routes"];
    var ch = accSet.children;
    for (var k = 0; k < order.length; k++) {
      var target = null;
      for (var c = 0; c < ch.length; c++) {
        if (
          ch[c].name.indexOf("RowType=" + order[k]) !== -1 &&
          ch[c].name.indexOf("Expanded") !== -1
        )
          target = ch[c];
      }
      if (target) grp.appendChild(target.createInstance());
    }
    M.appendChild(grp);
    return M;
  }

  var modComps = [];
  var focuses = ["Business", "Economy", "Both"];
  for (var fi = 0; fi < focuses.length; fi++) {
    var fc = focuses[fi];
    var fcomp = figma.createComponent();
    fcomp.name = "FocusCabin=" + fc;
    fcomp.layoutMode = "VERTICAL";
    fcomp.primaryAxisSizingMode = "AUTO";
    fcomp.counterAxisSizingMode = "FIXED";
    fcomp.layoutSizingHorizontal = "FIXED";
    fcomp.layoutSizingVertical = "HUG";
    fcomp.itemSpacing = 0;
    fcomp.fills = [];
    var m = buildModule(fc);
    while (m.children.length) fcomp.appendChild(m.children[0]);
    m.remove();
    fcomp.resize(W, fcomp.height);
    page.appendChild(fcomp);
    modComps.push(fcomp);
  }
  var modSet = figma.combineAsVariants(modComps, page);
  modSet.name = "Mod_AircraftCabinFacts";
  modSet.x = 480;
  modSet.y = 40;
  modSet.description =
    "机型舱位事实模块（对话流方案三下方）。Slot_Summary: aircraft.family, operator, overall_score, review_count。Slot_CabinTable: cabins[]。Group_Accordions: Cmp_AccordionRow x5。变体 FocusCabin: Business | Economy | Both。数据仅 CabinKB/结构化 JSON。";

  var ex = mkFrame("Example_A321neo_Full", {
    w: W + 48,
    bg: { r: 0.93, g: 0.93, b: 0.95 },
    gap: 16,
    pl: 12,
    pr: 12,
    pt: 20,
    pb: 24,
  });
  ex.x = 40;
  ex.y = 1100;
  ex.appendChild(txt("示例：国泰 A321neo（Full 数据）", { bold: true, size: 16, width: 360 }));
  var firstMod = modSet.children.length ? modSet.children[0] : modComps[0];
  ex.appendChild(firstMod.createInstance());
  page.appendChild(ex);

  var exE = mkFrame("Example_DataHealth_Empty", {
    w: W + 48,
    bg: { r: 0.93, g: 0.93, b: 0.95 },
    gap: 12,
    pl: 12,
    pr: 12,
    pt: 20,
    pb: 24,
  });
  exE.x = 520;
  exE.y = 1100;
  exE.appendChild(
    txt("示例：DataHealth=Empty（CabinKB 缺失）", { bold: true, size: 16, width: 360 })
  );
  var emptyCard = mkFrame("Slot_CabinTable", { w: W - 24, stroke: true, radius: 12, gap: 8 });
  emptyCard.appendChild(txt("舱位配置", { bold: true, size: 14, width: 340 }));
  emptyCard.appendChild(
    txt("暂无可靠数据 — 占位 UI（与 PRD CabinKB 缺字段一致）", {
      size: 12,
      color: COL_SEC,
      width: 340,
    })
  );
  exE.appendChild(emptyCard);
  page.appendChild(exE);

  figma.viewport.scrollAndZoomIntoView([accSet, modSet]);
  figma.notify("模块_AircraftCabinFacts：已生成 Cmp_AccordionRow + Mod + 示例。");
}
run();`;
