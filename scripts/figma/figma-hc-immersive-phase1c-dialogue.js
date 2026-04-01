// Phase 1c：与 H5/high-cabin-fullchain.html streamFeedData 对齐的「我 ↔ 飞猪顾问」对话，写入各 Feed 首段正文
// 前置：Figma 已打开文件 YJivJiM80jHttJvfV3ejpG；用 MCP use_figma 执行（skillNames: figma-use）
// 逻辑：按画布自上而下收集 Feed_Message / Feed_CX_*（跳过 Feed_CX_ImageSlot）及 Module_Feed_Compare 内 Feed 的 Feed_Body 第一个 TEXT，与 5 段 step 一一对应

const ROOT_ID = '204:2856';
const TEXT_MAX = 670 - 48;

const root = await figma.getNodeByIdAsync(ROOT_ID);
if (!root || root.type !== 'FRAME') return { error: 'ROOT_NOT_FRAME' };
const page = root.parent && root.parent.type === 'PAGE' ? root.parent : figma.currentPage;
await figma.setCurrentPageAsync(page);

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

function flattenChunks(chunks) {
  return chunks
    .map((m) => {
      const who = m.role === 'user' ? '我' : '飞猪顾问';
      let t = m.text;
      t = t.replace(/^### /gm, '');
      t = t.replace(/^> /gm, '');
      t = t.replace(/\*\*(.+?)\*\*/g, '$1');
      t = t.replace(/^- /gm, '• ');
      return `【${who}】${t}`;
    })
    .join('\n\n');
}

/** 与 H5 streamFeedData 同步（键 1–5 = 各步面板 Feed） */
const STEP_CHUNKS = {
  1: [
    { role: 'user', text: '我下周要从上海飞北京，有一程红眼+中转，怕落地废掉。商务舱这次值不值啊？' },
    { role: 'assistant', text: '### Thinking-行程规划\n- 已完成航班筛选\n- 已完成舱位价值匹配\n- 已识别中转风险点' },
    { role: 'user', text: '国泰那班 A350 我听朋友提过，我主要想睡得好一点，餐食倒其次。' },
    { role: 'assistant', text: '### 推荐结论\n我已根据你的偏好（重视休息和餐食）筛选高舱方案。\n\n> 先看核心差异，再决定是否升级。' },
  ],
  2: [
    { role: 'user', text: '表格太长我看不完，你直接说：商务和经济对我这种行程，差在哪？' },
    { role: 'assistant', text: '### 舱位对比说明\n以下对比聚焦决策字段：休息质量、空间、服务与抵达状态。' },
    { role: 'user', text: '那我更看重落地别蔫掉，中转还能缓一口气。' },
    { role: 'assistant', text: '### 决策建议\n若你优先考虑 **到达状态稳定** 与 **中转体力恢复**，建议选择商务舱。' },
  ],
  3: [
    { role: 'user', text: '我不想从头填一遍，电话和座位偏好能改吗？' },
    { role: 'assistant', text: '### 填单策略\n这是“核对 + 局部修改”阶段，不需要重填全部信息。' },
    { role: 'user', text: '行，协议勾一下就行对吧？' },
    { role: 'assistant', text: '### 前置条件\n完成协议勾选，并确保修改字段校验通过后才能继续。' },
  ],
  4: [
    { role: 'user', text: '总价 3860 里税费都含了吗？我再对一眼明细。' },
    { role: 'assistant', text: '### 核对进度\n- 行程信息：已核对\n- 填写信息：可修改\n- 异常提醒：已提示\n- 协议状态：待确认' },
    { role: 'user', text: '嗯，我看没问题了，可以付。' },
    { role: 'assistant', text: '### 下一步\n请确认支付明细，确认后即可完成支付并锁定高舱权益。' },
  ],
  5: [
    { role: 'user', text: '付完了～后面还要我干啥不？' },
    { role: 'assistant', text: '### 结果反馈\n已完成支付并锁定高舱权益。' },
    { role: 'user', text: '好嘞，值机一般提前多久？' },
    { role: 'assistant', text: '### 出行提示\n建议出发前关注中转动态，提前完成值机与座位确认。' },
  ],
};

const stepTexts = [1, 2, 3, 4, 5].map((k) => flattenChunks(STEP_CHUNKS[k]));

const SKIP_FRAME = new Set(['Feed_CX_ImageSlot']);

function pushFirstBodyText(frame, arr) {
  if (frame.type !== 'FRAME') return;
  const nm = frame.name;
  if (SKIP_FRAME.has(nm)) return;
  if (nm === 'Feed_Message' || (nm.startsWith('Feed_CX_') && !SKIP_FRAME.has(nm))) {
    const body = frame.findOne((x) => x.type === 'FRAME' && x.name === 'Feed_Body');
    if (!body) return;
    const texts = body.findAll((t) => t.type === 'TEXT');
    if (texts[0]) arr.push(texts[0]);
  }
}

const targets = [];
for (const c of root.children) {
  if (c.type !== 'FRAME') continue;
  if (c.name === 'Module_Feed_Compare') {
    for (const sub of c.children) pushFirstBodyText(sub, targets);
  } else {
    pushFirstBodyText(c, targets);
  }
}

const mutated = [];
const n = Math.min(targets.length, stepTexts.length);
for (let i = 0; i < n; i++) {
  const tn = targets[i];
  await loadForText(tn);
  tn.textAutoResize = 'HEIGHT';
  tn.characters = stepTexts[i];
  if (tn.width > TEXT_MAX) tn.resize(TEXT_MAX, tn.height);
  mutated.push(tn.id);
}

return {
  ok: true,
  phase: '1c-dialogue',
  feedTextTargetsFound: targets.length,
  appliedPairs: n,
  mutatedNodeIds: mutated,
  note:
    targets.length < stepTexts.length
      ? '画布上 Feed 正文块少于 5，仅前 n 条写入对话；可增删 Frame 后重跑。'
    : targets.length > stepTexts.length
      ? '画布 Feed 多于 5，仅前 5 条写入；其余保持原文。'
    : '5 段对话已对齐 5 个 Feed 正文。',
};
