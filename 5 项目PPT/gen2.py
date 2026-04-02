path = '/Users/dengxinyang/Desktop/AI\u00b7Project/D2C/Qwen/5 \u9879\u76eePPT/\u5bf9\u8bdd\u6d41\u5546\u52a1\u8231\u63a8\u8350-PRD.html'

CSS = """
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --gold:#C9A84C;--gold-light:#E8C97A;--gold-dim:rgba(201,168,76,0.15);
  --dark:#0A0C14;--dark2:#111420;--dark3:#181C2A;
  --text:#F0EDE6;--text-dim:rgba(240,237,230,0.6);--text-muted:rgba(240,237,230,0.35);
  --blue:#4A90D9;--green:#52C97A;--red:#E05C5C;
}
html,body{margin:0;padding:0;overflow:hidden;width:100%;height:100%}
body{background:var(--dark);font-family:"PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif;color:var(--text)}
.gold{color:var(--gold)}.blue{color:var(--blue)}.green{color:var(--green)}.red{color:var(--red)}
.sidenav{position:fixed;right:28px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:10px;z-index:100}
.sn-item{display:flex;align-items:center;gap:10px;cursor:pointer;text-decoration:none;justify-content:flex-end}
.sn-label{font-size:12px;color:var(--text-muted);opacity:0;transform:translateX(8px);transition:all .2s;white-space:nowrap;font-weight:600}
.sn-item:hover .sn-label,.sn-item.active .sn-label{opacity:1;transform:translateX(0);color:var(--gold)}
.sn-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.2);transition:all .3s;flex-shrink:0}
.sn-item.active .sn-dot{background:var(--gold);width:20px;border-radius:3px;box-shadow:0 0 6px var(--gold)}
.slides{width:100%;height:100vh;overflow:hidden;position:relative}
.slide{position:absolute;top:0;left:0;width:100%;height:100vh;display:flex;flex-direction:column;justify-content:center;padding:56px 100px 56px 80px;transition:transform 0.6s cubic-bezier(0.4,0,0.2,1);overflow:hidden}
.slide.prev{transform:translateY(-100%)}
.slide.current{transform:translateY(0)}
.slide.next{transform:translateY(100%)}
.bg-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px);background-size:80px 80px;pointer-events:none;z-index:0}
.bg-glow{position:absolute;border-radius:50%;filter:blur(140px);pointer-events:none;z-index:0}
.inner{position:relative;z-index:1;width:100%;height:100%;display:flex;flex-direction:column;justify-content:center}
.sec-tag{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
.sec-tag::before{content:"";width:24px;height:2px;background:var(--gold)}
.sec-title{font-size:44px;font-weight:800;line-height:1.15;margin-bottom:8px}
.sec-sub{font-size:15px;color:var(--text-dim);line-height:1.6;margin-bottom:22px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:start}
.card{background:var(--dark3);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:18px}
.card-gold{background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04));border:1px solid rgba(201,168,76,0.25);border-radius:14px;padding:18px}
.wt{display:inline-block;background:rgba(255,255,255,0.06);border-radius:6px;padding:2px 7px;margin:2px 2px;font-size:12px;color:var(--text-dim)}
.chip{font-size:12px;font-weight:700;padding:3px 9px;border-radius:6px}
.stop-tag{display:inline-block;margin-top:7px;background:rgba(224,92,92,0.12);border:1px solid rgba(224,92,92,0.25);color:var(--red);font-size:11px;font-weight:700;padding:2px 9px;border-radius:5px}
.sr{display:flex;align-items:center;gap:11px;border-radius:11px;padding:12px 14px;position:relative;overflow:hidden;margin-bottom:9px}
.sr .stripe{position:absolute;left:0;top:0;bottom:0;width:4px;border-radius:4px 0 0 4px}
.sr .cat{font-size:13px;font-weight:700;width:64px;flex-shrink:0}
.sr .words{flex:1;font-size:12px;color:var(--text-dim)}
.sr .note{font-size:10px;color:var(--text-muted);margin-top:3px}
.sr .bw{width:72px;height:5px;background:rgba(255,255,255,0.08);border-radius:3px;flex-shrink:0}
.sr .bar{height:100%;border-radius:3px}
.sr .val{font-size:19px;font-weight:900;width:42px;text-align:right}
.tb{display:flex;align-items:stretch;min-height:88px;position:relative}
.tb .tl{width:136px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 10px;border-right:1px solid rgba(255,255,255,0.06)}
.tb .ts{font-size:17px;font-weight:900;font-family:monospace}
.tb .tlb{font-size:10px;color:var(--text-muted);margin-top:3px;font-weight:600}
.tb .tr{flex:1;padding:14px 18px;display:flex;flex-direction:column;justify-content:center;gap:5px}
.tb .ta{font-size:15px;font-weight:700}
.tb .td{font-size:12px;color:var(--text-dim);line-height:1.4}
.tb .ti{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:22px}
.sc{background:var(--dark3);border:1px solid rgba(224,92,92,0.12);border-radius:13px;padding:16px;display:flex;gap:13px;position:relative;overflow:hidden;margin-bottom:12px}
.sc .stripe{position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--red)}
.sc:last-child{margin-bottom:0}
.ci{background:var(--dark3);border:1px solid rgba(255,255,255,0.06);border-radius:11px;padding:16px 18px;display:flex;gap:12px}
@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(5px)}}
"""

JS = """
const TOTAL = 6;
let current = 0;
let animating = false;
const slides = document.querySelectorAll('.slide');
const navItems = document.querySelectorAll('.sn-item');
function goTo(idx) {
  if (animating || idx === current || idx < 0 || idx >= TOTAL) return;
  animating = true;
  const dir = idx > current ? 1 : -1;
  slides[current].classList.remove('current');
  slides[current].classList.add(dir > 0 ? 'prev' : 'next');
  slides[idx].classList.remove(dir > 0 ? 'next' : 'prev');
  slides[idx].classList.add('current');
  navItems[current].classList.remove('active');
  navItems[idx].classList.add('active');
  current = idx;
  setTimeout(() => { animating = false; }, 650);
}
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goTo(current + 1); }
  else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
});
navItems.forEach(item => {
  item.addEventListener('click', e => { e.preventDefault(); goTo(parseInt(item.dataset.idx)); });
});
let touchY = 0;
document.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, {passive:true});
document.addEventListener('touchend', e => {
  const dy = touchY - e.changedTouches[0].clientY;
  if (Math.abs(dy) > 40) dy > 0 ? goTo(current + 1) : goTo(current - 1);
}, {passive:true});
let wheelLock = false;
document.addEventListener('wheel', e => {
  e.preventDefault();
  if (wheelLock) return;
  wheelLock = true;
  e.deltaY > 0 ? goTo(current + 1) : goTo(current - 1);
  setTimeout(() => { wheelLock = false; }, 800);
}, {passive:false});
"""

SLIDE0 = """
<div class="slide current" style="background:var(--dark)">
  <div class="bg-grid"></div>
  <div class="bg-glow" style="width:900px;height:900px;background:rgba(201,168,76,0.07);top:-300px;right:-200px"></div>
  <div class="inner">
    <div class="g2" style="align-items:center">
      <div>
        <div style="display:inline-flex;align-items:center;gap:10px;background:var(--gold-dim);border:1px solid rgba(201,168,76,0.3);border-radius:30px;padding:7px 18px;font-size:13px;font-weight:600;color:var(--gold);margin-bottom:22px">&#9992; PRD &middot; 已定稿</div>
        <div style="font-size:64px;font-weight:900;line-height:1.05;margin-bottom:16px">对话流<br><span class="gold">商务舱推荐</span><br>判定规则</div>
        <div style="font-size:17px;color:var(--text-dim);line-height:1.7;max-width:540px">商务舱何时出现、如何排序、何时禁推——<br>全部由<strong style="color:var(--text)">编排策略 + 库存 + 倾向分</strong>决定，<br>不依赖大模型即兴发挥。</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div style="background:var(--dark3);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 22px;display:flex;align-items:center;gap:14px">
          <span style="font-size:26px">&#129302;</span><div><div style="font-size:15px;font-weight:700;margin-bottom:3px">LLM 只写短文案</div><div style="font-size:13px;color:var(--text-dim)">不编造机型参数与图片 URL</div></div>
        </div>
        <div style="background:var(--dark3);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 22px;display:flex;align-items:center;gap:14px">
          <span style="font-size:26px">&#128202;</span><div><div style="font-size:15px;font-weight:700;margin-bottom:3px">倾向分 B 驱动排序</div><div style="font-size:13px;color:var(--text-dim)">关键词规则，不调用大模型</div></div>
        </div>
        <div style="background:var(--dark3);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 22px;display:flex;align-items:center;gap:14px">
          <span style="font-size:26px">&#128274;</span><div><div style="font-size:15px;font-weight:700;margin-bottom:3px">事实来自 CabinKB</div><div style="font-size:13px;color:var(--text-dim)">缺失时显式占位，禁止补写</div></div>
        </div>
        <div style="background:var(--dark3);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 22px;display:flex;align-items:center;gap:14px">
          <span style="font-size:26px">&#127919;</span><div><div style="font-size:15px;font-weight:700;margin-bottom:3px">固定槽位模板</div><div style="font-size:13px;color:var(--text-dim)">方案一/二经济舱，方案三商务舱</div></div>
        </div>
      </div>
    </div>
    <div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--text-muted);font-size:11px;animation:bounce 2s infinite"><span>&#8595; 按方向键翻页</span></div>
  </div>
</div>
"""

SLIDE1 = """
<div class="slide next" style="background:var(--dark2)">
  <div class="bg-grid"></div>
  <div class="bg-glow" style="width:700px;height:700px;background:rgba(74,144,217,0.05);top:-200px;right:-100px"></div>
  <div class="inner">
    <div class="sec-tag">系统架构</div>
    <div class="sec-title">数据从哪来，<span class="gold">谁负责什么</span></div>
    <div class="g2">
      <div style="background:var(--dark3);border:1px solid rgba(255,255,255,0.07);border-radius:16px;overflow:hidden">
        <div style="display:flex;align-items:center;gap:13px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span style="font-size:20px">&#128100;</span>
          <div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--gold)">用户</div><div style="font-size:11px;color:var(--text-muted)">模糊出行需求</div></div>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace">&#8594; 会话上下文</div>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span style="font-size:20px">&#128241;</span>
          <div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--blue)">ChatClient</div><div style="font-size:11px;color:var(--text-muted)">渲染卡片 / 手风琴 / 图片</div></div>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace">&#8592; SSE Block</div>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05);background:rgba(82,201,122,0.04)">
          <span style="font-size:20px">&#9881;&#65039;</span>
          <div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--green)">Orchestrator</div><div style="font-size:11px;color:var(--text-muted)">编排 &middot; 槽位 &middot; B 分策略</div></div>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace">&#8594; 并行检索</div>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span style="font-size:20px">&#128747;</span>
          <div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--gold)">FlightAPI</div><div style="font-size:11px;color:var(--text-muted)">Y/J/C 报价 &middot; 库存</div></div>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace">&#8592; 报价数据</div>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,0.05)">
          <span style="font-size:20px">&#128452;&#65039;</span>
          <div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--blue)">CabinKB</div><div style="font-size:11px;color:var(--text-muted)">机型事实 &middot; 座椅 &middot; 图片 URL</div></div>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace">&#8592; 事实数据</div>
        </div>
        <div style="display:flex;align-items:center;gap:13px;padding:14px 18px;background:rgba(224,92,92,0.04)">
          <span style="font-size:20px">&#129302;</span>
          <div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--red)">LLM</div><div style="font-size:11px;color:var(--text-muted)">短导购文案 &middot; 不编造参数</div></div>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace">&#8592; 摘要+Schema</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card" style="display:flex;gap:13px"><span style="font-size:20px">&#9889;</span><div><div style="font-size:14px;font-weight:700;margin-bottom:5px">并行检索</div><div style="font-size:13px;color:var(--text-dim);line-height:1.6">Orchestrator 同时拉取经济舱 TopN 与商务舱可售报价，降低整体响应延迟</div></div></div>
        <div class="card" style="display:flex;gap:13px"><span style="font-size:20px">&#128274;</span><div><div style="font-size:14px;font-weight:700;margin-bottom:5px">图片安全</div><div style="font-size:13px;color:var(--text-dim);line-height:1.6">仅下发己方 CDN/OSS HTTPS；Schema 校验；禁止模型直出 HTML；图片域名白名单</div></div></div>
        <div class="card" style="display:flex;gap:13px"><span style="font-size:20px">&#128230;</span><div><div style="font-size:14px;font-weight:700;margin-bottom:5px">Block 协议</div><div style="font-size:13px;color:var(--text-dim);line-height:1.6">FlightCard + CabinUpsell JSON block，payload 完整后才渲染，避免半块闪烁与错位</div></div></div>
        <div class="card" style="display:flex;gap:13px"><span style="font-size:20px">&#127919;</span><div><div style="font-size:14px;font-weight:700;margin-bottom:5px">固定槽位</div><div style="font-size:13px;color:var(--text-dim);line-height:1.6">方案一/二为经济舱，方案三为商务舱 upsell，结构不与模型「即兴」绑定</div></div></div>
      </div>
    </div>
  </div>
</div>
"""

SLIDE2 = """
<div class="slide next" style="background:var(--dark)">
  <div class="bg-grid"></div>
  <div class="bg-glow" style="width:800px;height:800px;background:rgba(201,168,76,0.07);top:-200px;right:-200px"></div>
  <div class="inner">
    <div class="sec-tag">核心判定规则 &middot; 倾向分</div>
    <div class="sec-title">倾向分 <span class="gold">B</span> 算法</div>
    <div class="g2">
      <div>
        <div class="sr" style="background:var(--dark3);border:1px solid rgba(255,255,255,0.06)">
          <div class="stripe" style="background:var(--gold)"></div>
          <div class="cat gold">舒适意图</div>
          <div class="words"><span class="wt">舒服</span><span class="wt">舒适</span><span class="wt">躺平</span><span class="wt">宽敞</span><span class="wt">睡得好</span><div class="note">命中任意一词，仅计一次</div></div>
          <div class="bw"><div class="bar" style="width:80%;background:var(--gold)"></div></div>
          <div class="val gold">+25</div>
        </div>
        <div class="sr" style="background:var(--dark3);border:1px solid rgba(255,255,255,0.06)">
          <div class="stripe" style="background:var(--gold)"></div>
          <div class="cat gold">特殊人群</div>
          <div class="words"><span class="wt">老人</span><span class="wt">父母</span><span class="wt">长辈</span><span class="wt">带娃</span><span class="wt">孕妇</span><div class="note">命中任意一词，仅计一次</div></div>
          <div class="bw"><div class="bar" style="width:80%;background:var(--gold)"></div></div>
          <div class="val gold">+25</div>
        </div>
        <div class="sr" style="background:var(--dark3);border:1px solid rgba(255,255,255,0.06)">
          <div class="stripe" style="background:var(--blue)"></div>
          <div class="cat blue">红眼疲劳</div>
          <div class="words"><span class="wt">红眼</span><span class="wt">夜班</span><span class="wt">凌晨</span><span class="wt">长途</span><span class="wt">国际</span><div class="note">命中任意一词，仅计一次</div></div>
          <div class="bw"><div class="bar" style="width:64%;background:var(--blue)"></div></div>
          <div class="val blue">+20</div>
        </div>
        <div class="sr" style="background:var(--dark3);border:1px solid rgba(255,255,255,0.06)">
          <div class="stripe" style="background:var(--green)"></div>
          <div class="cat green">商务场景</div>
          <div class="words"><span class="wt">出差</span><span class="wt">报销</span><span class="wt">见客户</span><span class="wt">会议</span><div class="note">「出差+报销」同属一类，合计仅 +15</div></div>
          <div class="bw"><div class="bar" style="width:48%;background:var(--green)"></div></div>
          <div class="val green">+15</div>
        </div>
        <div class="sr" style="background:rgba(224,92,92,0.06);border:1px solid rgba(224,92,92,0.2)">
          <div class="stripe" style="background:var(--red)"></div>
          <div class="cat red">价格敏感</div>
          <div class="words"><span class="wt">最便宜</span><span class="wt">低价</span><span class="wt">学生</span><span class="wt">预算</span><span class="wt">省钱</span><span class="wt">穷游</span><div class="note">整轮仅计一次，不重复惩罚</div></div>
          <div class="bw"><div class="bar" style="width:100%;background:var(--red)"></div></div>
          <div class="val red">&#8722;35</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card-gold">
          <div style="font-size:12px;font-weight:700;color:var(--gold);letter-spacing:.1em;margin-bottom:11px">&#128208; 排序公式</div>
          <div style="font-size:17px;font-weight:800;color:var(--gold);font-family:monospace;line-height:2">B = clamp(B, &#8722;40, 80)<br>R = R&#8320; + w &times; B</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:9px;line-height:1.7">R&#8320; = 业务基础分（价格/时长/直飞/库存）<br>w &isin; [0.3, 0.6]，与 R&#8320; 量级同比缩放</div>
        </div>
        <div class="card">
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:11px">&#9888;&#65039; 计分注意事项</div>
          <div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span style="color:var(--gold);font-weight:800;flex-shrink:0">&#9312;</span><span style="font-size:12px;color:var(--text-dim)">同类多词命中，<strong style="color:var(--text)">不重复加分</strong>，每类最多 +1 次</span></div>
          <div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span style="color:var(--gold);font-weight:800;flex-shrink:0">&#9313;</span><span style="font-size:12px;color:var(--text-dim)">「出差」+「报销」同属商务场景，合计仅 <strong style="color:var(--green)">+15</strong>，不是 +30</span></div>
          <div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span style="color:var(--gold);font-weight:800;flex-shrink:0">&#9314;</span><span style="font-size:12px;color:var(--text-dim)">减分整轮计一次，多轮对话不重复惩罚</span></div>
          <div style="display:flex;gap:8px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span style="color:var(--gold);font-weight:800;flex-shrink:0">&#9315;</span><span style="font-size:12px;color:var(--text-dim)">可选叠加上一轮一句，增强上下文感知</span></div>
          <div style="display:flex;gap:8px;padding:7px 0"><span style="color:var(--gold);font-weight:800;flex-shrink:0">&#9316;</span><span style="font-size:12px;color:var(--text-dim)">B 值截断在 [&#8722;40, 80]，防止极端值影响排序</span></div>
        </div>
      </div>
    </div>
  </div>
</div>
"""

SLIDE3 = """
<div class="slide next" style="background:var(--dark2)">
  <div class="bg-grid"></div>
  <div class="bg-glow" style="width:700px;height:700px;background:rgba(82,201,122,0.05);bottom:-200px;left:-100px"></div>
  <div class="inner">
    <div class="sec-tag">核心判定规则 &middot; 第三槽</div>
    <div class="sec-title">第三槽 <span class="gold">曝光策略</span></div>
    <div class="g2">
      <div style="border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08)">
        <div class="tb" style="background:linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))">
          <div class="tl"><div class="ts gold">B &ge; 20</div><div class="tlb">高意向</div></div>
          <div class="tr"><div class="ta gold">优先展示商务舱</div><div class="td">可放宽价差阈值，主动推荐第三槽；排序分 R 显著提升</div></div>
          <div class="ti">&#127937;</div>
        </div>
        <div class="tb" style="background:linear-gradient(135deg,rgba(74,144,217,0.08),rgba(74,144,217,0.02));border-top:1px solid rgba(255,255,255,0.06)">
          <div class="tl"><div class="ts blue" style="font-size:13px">&#8722;20 &lt; B &lt; 20</div><div class="tlb">中性</div></div>
          <div class="tr"><div class="ta blue">走默认价差策略</div><div class="td">按正常价差规则决定是否展示，不主动放宽也不降级</div></div>
          <div class="ti">&#128309;</div>
        </div>
        <div class="tb" style="background:linear-gradient(135deg,rgba(224,92,92,0.1),rgba(224,92,92,0.03));border-top:1px solid rgba(255,255,255,0.06)">
          <div class="tl"><div class="ts red">B &le; &#8722;20</div><div class="tlb">价格敏感</div></div>
          <div class="tr"><div class="ta red">隐藏或强降级</div><div class="td">第三槽不展示或降至最低权重，避免强推引发反感</div></div>
          <div class="ti">&#128308;</div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card">
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:12px">&#128161; 计算示例</div>
          <div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
            <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">「<strong style="color:var(--text)">红眼航班，带老人出行</strong>」</div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <span class="chip" style="background:rgba(74,144,217,0.15);color:var(--blue)">红眼 +20</span>
              <span style="font-size:11px;color:var(--text-muted)">+</span>
              <span class="chip" style="background:rgba(201,168,76,0.15);color:var(--gold)">老人 +25</span>
              <span style="font-size:11px;color:var(--text-muted)">=</span>
              <span style="font-size:15px;font-weight:900;color:var(--gold)">B = 45</span>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:4px">&#8594; 第三槽<strong style="color:var(--gold)">优先展示</strong>，价差阈值放宽</div>
          </div>
          <div style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
            <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">「<strong style="color:var(--text)">出差，帮我找最便宜的</strong>」</div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <span class="chip" style="background:rgba(82,201,122,0.15);color:var(--green)">出差 +15</span>
              <span style="font-size:11px;color:var(--text-muted)">+</span>
              <span class="chip" style="background:rgba(224,92,92,0.15);color:var(--red)">最便宜 &#8722;35</span>
              <span style="font-size:11px;color:var(--text-muted)">=</span>
              <span style="font-size:15px;font-weight:900;color:var(--red)">B = &#8722;20</span>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:4px">&#8594; 恰好触发阈值，第三槽<strong style="color:var(--red)">隐藏或强降级</strong></div>
          </div>
          <div style="padding:10px 0">
            <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px">「<strong style="color:var(--text)">帮我订去北京的票</strong>」</div>
            <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
              <span class="chip" style="background:rgba(255,255,255,0.06);color:var(--text-muted)">无关键词</span>
              <span style="font-size:11px;color:var(--text-muted)">=</span>
              <span style="font-size:15px;font-weight:900;color:var(--text-dim)">B = 0</span>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:4px">&#8594; 走<strong style="color:var(--blue)">默认价差策略</strong>，正常判断</div>
          </div>
        </div>
        <div class="card">
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);letter-spacing:.1em;margin-bottom:9px">&#128204; 前提条件</div>
          <div style="font-size:13px;color:var(--text-dim);line-height:1.8">以上策略均在<strong style="color:var(--text)">商务舱有库存</strong>时生效。<br>无库存时，无论 B 值多高，第三槽均不展示。<br>价差阈值由产品策略配置，非硬编码。</div>
        </div>
      </div>
    </div>
  </div>
</div>
"""

SLIDE4 = """
<div class="slide next" style="background:var(--dark)">
  <div class="bg-grid"></div>
  <div class="bg-glow" style="width:700px;height:700px;background:rgba(224,92,92,0.05);top:-200px;right:-100px"></div>
  <div class="inner">
    <div class="sec-tag">核心判定规则 &middot; 禁推</div>
    <div class="sec-title">禁推规则 <span class="red">Hard Stop</span></div>
    <div class="sec-sub">满足任意一条，整个商务舱推荐模块不展示，优先级高于 B 分策略。</div>
    <div class="g2">
      <div>
        <div class="sc"><div class="stripe"></div><span style="font-size:26px;flex-shrink:0">&#9201;&#65039;</span><div><div style="font-size:15px;font-weight:700;margin-bottom:5px">短航程无明显收益</div><div style="font-size:12px;color:var(--text-dim);line-height:1.5">航段时长 &lt; 2 小时，且商务舱相比经济舱无明显体验提升时，模块整体不展示。</div><span class="stop-tag">模块不展示</span></div></div>
        <div class="sc"><div class="stripe"></div><span style="font-size:26px;flex-shrink:0">&#128176;</span><div><div style="font-size:15px;font-weight:700;margin-bottom:5px">用户明确价格敏感</div><div style="font-size:12px;color:var(--text-dim);line-height:1.5">B &le; &#8722;20，用户明确表达预算限制（「最便宜」「学生票」「穷游」等），模块隐藏或强降级。</div><span class="stop-tag">隐藏或强降级</span></div></div>
        <div class="sc"><div class="stripe"></div><span style="font-size:26px;flex-shrink:0">&#127915;</span><div><div style="font-size:15px;font-weight:700;margin-bottom:5px">商务舱无库存</div><div style="font-size:12px;color:var(--text-dim);line-height:1.5">FlightAPI 返回该航班商务舱无可售报价，模块整体不展示。无论 B 分多高，无票就不推。</div><span class="stop-tag">模块不展示</span></div></div>
        <div class="sc"><div class="stripe"></div><span style="font-size:26px;flex-shrink:0">&#128581;</span><div><div style="font-size:15px;font-weight:700;margin-bottom:5px">用户明确拒绝</div><div style="font-size:12px;color:var(--text-dim);line-height:1.5">当轮明确表示「不要商务舱」，当轮隐藏模块。下一轮重新判断，不永久屏蔽。</div><span class="stop-tag">当轮隐藏</span></div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="card-gold">
          <div style="font-size:12px;font-weight:700;color:var(--gold);letter-spacing:.1em;margin-bottom:11px">&#128172; 价差文案策略</div>
          <div style="display:flex;gap:11px;padding:9px 0;border-bottom:1px solid rgba(201,168,76,0.08)"><div style="font-size:11px;font-weight:700;color:var(--gold);width:80px;flex-shrink:0">&lt; &yen;800</div><div style="font-size:12px;color:var(--text-dim)">多花 &yen;X，换来全平躺 + 45&quot; 腿距 + 优先服务</div></div>
          <div style="display:flex;gap:11px;padding:9px 0;border-bottom:1px solid rgba(201,168,76,0.08)"><div style="font-size:11px;font-weight:700;color:var(--gold);width:80px;flex-shrink:0">&yen;800&ndash;3000</div><div style="font-size:12px;color:var(--text-dim)">多花 &yen;X，换来 Y 小时舒适平躺 + 贵宾服务</div></div>
          <div style="display:flex;gap:11px;padding:9px 0;border-bottom:1px solid rgba(201,168,76,0.08)"><div style="font-size:11px;font-weight:700;color:var(--gold);width:80px;flex-shrink:0">&gt; &yen;3000</div><div style="font-size:12px;color:var(--text-dim)">升级商务舱需多花 &yen;X，换来以下体验提升</div></div>
          <div style="display:flex;gap:11px;padding:9px 0"><div style="font-size:11px;font-weight:700;color:var(--gold);width:80px;flex-shrink:0">无价格数据</div><div style="font-size:12px;color:var(--text-dim)">商务舱体验升级，具体价差以搜索结果为准</div></div>
        </div>
        <div class="card">
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);letter-spacing:.1em;text-transform:uppercase;margin-bottom:11px">&#128202; 数据缺失处理</div>
          <div style="display:flex;gap:11px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span>&#9989;</span><span style="font-size:12px;font-weight:700;color:var(--green);width:70px;flex-shrink:0">Full Data</span><span style="font-size:12px;color:var(--text-dim)">完整展示所有区域</span></div>
          <div style="display:flex;gap:11px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span>&#9888;&#65039;</span><span style="font-size:12px;font-weight:700;color:var(--gold);width:70px;flex-shrink:0">No Price</span><span style="font-size:12px;color:var(--text-dim)">价差泛化，价格显示 --，CTA 改为「搜索商务舱」</span></div>
          <div style="display:flex;gap:11px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04)"><span>&#128310;</span><span style="font-size:12px;font-weight:700;color:var(--blue);width:70px;flex-shrink:0">Partial</span><span style="font-size:12px;color:var(--text-dim)">隐藏缺失区域，只显示有值的事实卡片</span></div>
          <div style="display:flex;gap:11px;align-items:center;padding:8px 0"><span>&#128683;</span><span style="font-size:12px;font-weight:700;color:var(--red);width:70px;flex-shrink:0">Hard Stop</span><span style="font-size:12px;color:var(--text-dim)">整个模块不展示</span></div>
        </div>
      </div>
    </div>
  </div>
</div>
"""

SLIDE5 = """
<div class="slide next" style="background:var(--dark2)">
  <div class="bg-grid"></div>
  <div class="bg-glow" style="width:600px;height:600px;background:rgba(82,201,122,0.05);bottom:-100px;right:-100px"></div>
  <div class="inner">
    <div class="sec-tag">验收清单</div>
    <div class="sec-title">上线前 <span class="gold">核对清单</span></div>
    <div class="g2" style="margin-bottom:18px">
      <div class="ci"><span style="font-size:18px;flex-shrink:0;margin-top:1px">&#9744;</span><div><strong style="display:block;font-size:14px;margin-bottom:3px">无库存不出现可订卡片</strong><span style="font-size:12px;color:var(--text-dim);line-height:1.5">无库存时不展示商务舱卡片，或显示「售罄/无票」态，不出现可点击的订购按钮</span></div></div>
      <div class="ci"><span style="font-size:18px;flex-shrink:0;margin-top:1px">&#9744;</span><div><strong style="display:block;font-size:14px;margin-bottom:3px">图片 URL 来自白名单域名</strong><span style="font-size:12px;color:var(--text-dim);line-height:1.5">响应中所有图片均来自己方 CDN/OSS HTTPS，无模型生成的外链图片字段</span></div></div>
      <div class="ci"><span style="font-size:18px;flex-shrink:0;margin-top:1px">&#9744;</span><div><strong style="display:block;font-size:14px;margin-bottom:3px">CabinKB 缺字段时有占位</strong><span style="font-size:12px;color:var(--text-dim);line-height:1.5">缺失字段显示「暂无可靠数据」，无模型补全的长篇参数描述</span></div></div>
      <div class="ci"><span style="font-size:18px;flex-shrink:0;margin-top:1px">&#9744;</span><div><strong style="display:block;font-size:14px;margin-bottom:3px">「最便宜」类词触发降级</strong><span style="font-size:12px;color:var(--text-dim);line-height:1.5">输入含价格敏感词时，B &le; &#8722;20，第三槽行为符合隐藏/强降级策略</span></div></div>
      <div class="ci"><span style="font-size:18px;flex-shrink:0;margin-top:1px">&#9744;</span><div><strong style="display:block;font-size:14px;margin-bottom:3px">B 分计算符合「每类一次」规则</strong><span style="font-size:12px;color:var(--text-dim);line-height:1.5">「红眼 + 老人」组合 B = 45，「出差 + 报销」合计 +15，排序分 R 可解释</span></div></div>
      <div class="ci"><span style="font-size:18px;flex-shrink:0;margin-top:1px">&#9744;</span><div><strong style="display:block;font-size:14px;margin-bottom:3px">短航程禁推生效</strong><span style="font-size:12px;color:var(--text-dim);line-height:1.5">航段时长 &lt; 2h 时，商务舱推荐模块整体不展示，不受 B 分影响</span></div></div>
    </div>
    <div style="background:linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.04));border:1px solid rgba(201,168,76,0.25);border-radius:14px;padding:20px 26px;display:flex;align-items:center;gap:18px">
      <span style="font-size:36px">&#9992;</span>
      <div style="font-size:15px;color:var(--text-dim);line-height:1.7"><strong style="color:var(--gold);font-size:17px">核心原则</strong>：商务舱推荐的每一次出现，都必须是<strong style="color:var(--text)">有库存 + 策略允许 + 用户有意向</strong>三者同时满足的结果。任何一条不满足，宁可不推，也不强推。</div>
    </div>
  </div>
</div>
"""

NAV = """<nav class="sidenav" id="sidenav">
  <a class="sn-item active" data-idx="0" href="#"><span class="sn-label">封面</span><span class="sn-dot"></span></a>
  <a class="sn-item" data-idx="1" href="#"><span class="sn-label">系统架构</span><span class="sn-dot"></span></a>
  <a class="sn-item" data-idx="2" href="#"><span class="sn-label">倾向分 B</span><span class="sn-dot"></span></a>
  <a class="sn-item" data-idx="3" href="#"><span class="sn-label">第三槽策略</span><span class="sn-dot"></span></a>
  <a class="sn-item" data-idx="4" href="#"><span class="sn-label">禁推规则</span><span class="sn-dot"></span></a>
  <a class="sn-item" data-idx="5" href="#"><span class="sn-label">验收清单</span><span class="sn-dot"></span></a>
</nav>"""

html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>对话流商务舱推荐 · 判定规则</title>
<style>{CSS}</style>
</head>
<body>
{NAV}
<div class="slides" id="slides">
{SLIDE0}
{SLIDE1}
{SLIDE2}
{SLIDE3}
{SLIDE4}
{SLIDE5}
</div>
<script>{JS}</script>
</body>
</html>"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(html)
print('Done! chars:', len(html))
