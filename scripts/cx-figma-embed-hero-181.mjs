/**
 * Figma use_figma：向 181:52347 嵌入国泰 A350-1000 座椅 Hero（JPEG base64）。
 * 现成 MCP 参数（含内联 tiny JPEG）：同目录 `mcp-use-figma-cx-hero-args.json` → 作为 `use_figma` 的 arguments。
 * 纯插件正文（无 base64）：`figma-plugin-cx-hero-181-plain.txt`；生成 HERO_B64：sips 压缩 seat-09 后 `base64 -i file | tr -d '\n'`。
 */
const HERO_B64 = ""; // 运行时由外部替换

const root = await figma.getNodeByIdAsync("181:52246");
if (!root) return { err: "no root" };
let p = root;
while (p.parent && p.parent.type !== "PAGE") p = p.parent;
await figma.setCurrentPageAsync(p.parent);
const host = await figma.getNodeByIdAsync("181:52347");
if (!host || host.type !== "FRAME") return { err: "no host", t: host?.type };
if (!HERO_B64 || HERO_B64.length < 100) return { err: "set HERO_B64" };
while (host.children.length) host.children[0].remove();
const bytes = figma.base64Decode(HERO_B64);
const img = figma.createImage(bytes);
const r = figma.createRectangle();
r.name = "CX_A3501000_Hero";
r.resize(Math.max(1, host.width), Math.max(1, host.height));
r.fills = [{ type: "IMAGE", imageHash: img.hash, scaleMode: "FILL" }];
r.cornerRadius = 8;
host.appendChild(r);
if ("layoutMode" in host && host.layoutMode !== "NONE") {
  r.layoutSizingHorizontal = "FILL";
  r.layoutSizingVertical = "FILL";
} else {
  r.x = 0;
  r.y = 0;
}
return { ok: true, heroHash: img.hash, mutated: ["181:52347"] };
