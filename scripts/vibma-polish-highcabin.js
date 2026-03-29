#!/usr/bin/env node
/**
 * 可选：通过 Vibma WebSocket 批量改 HighCabin 画布（遗留自动化）。
 * 本项目日常改稿请优先用 Figma 官方 MCP 的 use_figma（见 Qwen/.cursor/skills/figma-link-workflow/SKILL.md）。
 * Run: node Qwen/scripts/vibma-polish-highcabin.js
 */
const WebSocket = require("ws");

const CHANNEL = "vibma";
const WS_URL = "ws://localhost:3055";

const rgb = (hex) => {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
};

const SHADOW_CARD = {
  effects: [
    {
      type: "DROP_SHADOW",
      visible: true,
      blendMode: "NORMAL",
      color: { r: 0, g: 0, b: 0, a: 0.08 },
      offset: { x: 0, y: 4 },
      radius: 16,
      spread: 0,
    },
  ],
};

function createClient() {
  let seq = 0;
  const pending = new Map();
  const ws = new WebSocket(WS_URL);

  function send(msg) {
    ws.send(JSON.stringify(msg));
  }

  function cmd(command, params = {}, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
      const id = `cmd_${Date.now()}_${seq++}`;
      const t = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`timeout: ${command}`));
      }, timeoutMs);

      pending.set(id, (m) => {
        clearTimeout(t);
        if (m.error) reject(new Error(m.error));
        else resolve(m.result);
      });

      send({
        id,
        type: "message",
        channel: CHANNEL,
        message: { id, command, params },
      });
    });
  }

  ws.on("message", (raw) => {
    const m = JSON.parse(raw.toString());
    if (m.type === "error") {
      console.error(JSON.stringify(m));
      process.exit(1);
    }
    if (m.message && m.message.id && pending.has(m.message.id)) {
      const resolve = pending.get(m.message.id);
      pending.delete(m.message.id);
      resolve(m.message);
    }
  });

  return new Promise((resolve, reject) => {
    ws.on("open", () => {
      send({
        type: "join",
        channel: CHANNEL,
        role: "mcp",
        version: "0.3.2",
        name: "cursor-highcabin-polish",
      });
    });

    ws.on("error", reject);

    ws.on("message", function onJoin(raw) {
      const m = JSON.parse(raw.toString());
      if (m.type === "system") {
        const ok =
          m.message === `Joined channel: ${CHANNEL}` ||
          (m.message && m.message.result === `Connected to channel: ${CHANNEL}`);
        if (ok) {
          ws.off("message", onJoin);
          resolve({ ws, cmd, send, close: () => ws.close() });
        }
      }
    });
  });
}

async function main() {
  const { cmd, close } = await createClient();

  try {
    try {
      await cmd("set_current_page", { pageName: "AI-高舱购买页-Mock" });
    } catch (e) {
      // 当前文件可能只有默认页，找不到目标页时在当前页继续执行
    }

    const searchRoot = await cmd("search_nodes", {
      query: "HighCabin_Page_01",
      types: ["FRAME"],
      limit: 5,
    });
    let rootId = searchRoot.results && searchRoot.results.length ? searchRoot.results[0].id : null;
    if (!rootId) {
      const root = await cmd("create_frame", {
        name: "HighCabin_Page_01",
        x: 120,
        y: 120,
        width: 375,
        height: 1500,
        fillColor: rgb("#F8F8F8"),
        layoutMode: "VERTICAL",
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 32,
        paddingLeft: 0,
        itemSpacing: 16,
      });
      rootId = root.id;
    }

    const hasStatus = await cmd("search_nodes", {
      query: "Module_StatusBar",
      types: ["FRAME"],
      limit: 5,
    });
    if (!hasStatus.results.length) {
      const st = await cmd("create_frame", {
        name: "Module_StatusBar",
        width: 375,
        height: 48,
        fillColor: rgb("#F8F8F8"),
        layoutMode: "HORIZONTAL",
        paddingLeft: 24,
        paddingRight: 24,
        primaryAxisAlignItems: "SPACE_BETWEEN",
        counterAxisAlignItems: "CENTER",
        itemSpacing: 8,
        layoutSizingHorizontal: "FIXED",
      });
      await cmd("create_text", {
        parentId: st.id,
        name: "txt_status_time",
        text: "9:41",
        fontFamily: "PingFang SC",
        fontStyle: "Medium",
        fontSize: 14,
        fontColor: rgb("#0F131A"),
      });
      await cmd("create_text", {
        parentId: st.id,
        name: "txt_status_icons",
        text: "●●●●  📶  🔋",
        fontFamily: "PingFang SC",
        fontStyle: "Regular",
        fontSize: 12,
        fontColor: rgb("#5C5F66"),
      });
      await cmd("insert_child", { parentId: rootId, childId: st.id, index: 0 });
    }

    const hasNav = await cmd("search_nodes", {
      query: "Module_NavBar",
      types: ["FRAME"],
      limit: 5,
    });
    if (!hasNav.results.length) {
      const nav = await cmd("create_frame", {
        name: "Module_NavBar",
        width: 375,
        height: 52,
        fillColor: rgb("#FFFFFF"),
        layoutMode: "HORIZONTAL",
        paddingLeft: 16,
        paddingRight: 16,
        primaryAxisAlignItems: "SPACE_BETWEEN",
        counterAxisAlignItems: "CENTER",
        itemSpacing: 12,
        layoutSizingHorizontal: "FIXED",
      });
      await cmd("create_text", {
        parentId: nav.id,
        name: "txt_nav_back",
        text: "‹",
        fontFamily: "PingFang SC",
        fontStyle: "Medium",
        fontSize: 22,
        fontColor: rgb("#0F131A"),
      });
      await cmd("create_text", {
        parentId: nav.id,
        name: "txt_nav_title",
        text: "飞猪顾问",
        fontFamily: "PingFang SC",
        fontStyle: "Medium",
        fontSize: 17,
        fontColor: rgb("#0F131A"),
      });
      await cmd("create_text", {
        parentId: nav.id,
        name: "txt_nav_more",
        text: "···",
        fontFamily: "PingFang SC",
        fontStyle: "Medium",
        fontSize: 18,
        fontColor: rgb("#0F131A"),
      });
      await cmd("insert_child", { parentId: rootId, childId: nav.id, index: 1 });
    }

    const hasBubble = await cmd("search_nodes", {
      query: "Module_UserQueryBubble",
      types: ["FRAME"],
      limit: 5,
    });
    if (!hasBubble.results.length) {
      const bubble = await cmd("create_frame", {
        name: "Module_UserQueryBubble",
        width: 343,
        height: 72,
        fillColor: rgb("#EBF0FF"),
        cornerRadius: 16,
        layoutMode: "VERTICAL",
        paddingTop: 12,
        paddingRight: 14,
        paddingBottom: 12,
        paddingLeft: 14,
        itemSpacing: 4,
        layoutSizingHorizontal: "FILL",
      });
      await cmd("create_text", {
        parentId: bubble.id,
        name: "txt_user_query",
        text: "帮我看下这班有没有必要升商务舱？更在意休息和餐食。",
        fontFamily: "PingFang SC",
        fontStyle: "Regular",
        fontSize: 14,
        fontColor: rgb("#0F131A"),
        layoutSizingHorizontal: "FILL",
      });
      const topIdxRes = await cmd("search_nodes", {
        query: "Module_TopSummary",
        types: ["FRAME"],
        limit: 3,
      });
      const topId = topIdxRes.results[0]?.id;
      if (topId) {
        const info = await cmd("get_node_info", { nodeId: rootId, depth: 1 });
        const children = info.results[0].children || [];
        const ix = children.findIndex((c) => c.id === topId);
        if (ix >= 0) {
          await cmd("insert_child", {
            parentId: rootId,
            childId: bubble.id,
            index: ix,
          });
        }
      }
    }

    const hasHero = await cmd("search_nodes", {
      query: "Module_HeroImage",
      types: ["FRAME"],
      limit: 5,
    });
    /** 主图区域：仅纯色块占位，后续你自行贴图（Image fill 或蒙版） */
    const PLACEHOLDER_IMAGE = rgb("#D8DCE3");

    if (!hasHero.results.length) {
      const hero = await cmd("create_frame", {
        name: "Module_HeroImage",
        width: 343,
        height: 196,
        fillColor: PLACEHOLDER_IMAGE,
        cornerRadius: 12,
        layoutMode: "NONE",
        layoutSizingHorizontal: "FILL",
      });

      const topIdxRes = await cmd("search_nodes", {
        query: "Module_TopSummary",
        types: ["FRAME"],
        limit: 3,
      });
      const topId = topIdxRes.results[0]?.id;
      if (topId) {
        const info = await cmd("get_node_info", { nodeId: rootId, depth: 1 });
        const children = info.results[0].children || [];
        const ix = children.findIndex((c) => c.id === topId);
        if (ix >= 0) {
          await cmd("insert_child", {
            parentId: rootId,
            childId: hero.id,
            index: ix + 1,
          });
        }
      }
    }

    const hasFeatures = await cmd("search_nodes", {
      query: "Module_FeatureHighlights",
      types: ["FRAME"],
      limit: 5,
    });
    if (!hasFeatures.results.length) {
      const row = await cmd("create_frame", {
        name: "Module_FeatureHighlights",
        width: 343,
        height: 72,
        fillColor: rgb("#FFFFFF"),
        cornerRadius: 12,
        layoutMode: "HORIZONTAL",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 8,
        paddingRight: 8,
        primaryAxisAlignItems: "SPACE_BETWEEN",
        counterAxisAlignItems: "CENTER",
        itemSpacing: 4,
        layoutSizingHorizontal: "FILL",
      });
      const mk = async (icon, label) => {
        const cell = await cmd("create_frame", {
          parentId: row.id,
          name: `Feat_${label}`,
          width: 100,
          height: 56,
          layoutMode: "VERTICAL",
          itemSpacing: 4,
          primaryAxisAlignItems: "CENTER",
          counterAxisAlignItems: "CENTER",
          layoutSizingHorizontal: "FILL",
        });
        await cmd("create_text", {
          parentId: cell.id,
          text: icon,
          fontFamily: "PingFang SC",
          fontStyle: "Regular",
          fontSize: 18,
          fontColor: rgb("#0F131A"),
        });
        await cmd("create_text", {
          parentId: cell.id,
          text: label,
          fontFamily: "PingFang SC",
          fontStyle: "Regular",
          fontSize: 11,
          fontColor: rgb("#5C5F66"),
        });
      };
      await mk("平躺", "全平躺休息");
      await mk("餐食", "精致餐饮");
      await mk("互联", "娱乐与联网");

      const vc = await cmd("search_nodes", {
        query: "Module_ValueCard",
        types: ["FRAME"],
        limit: 3,
      });
      const vcId = vc.results[0]?.id;
      if (vcId) {
        const info = await cmd("get_node_info", { nodeId: rootId, depth: 1 });
        const children = info.results[0].children || [];
        const ix = children.findIndex((c) => c.id === vcId);
        if (ix >= 0) {
          await cmd("insert_child", {
            parentId: rootId,
            childId: row.id,
            index: ix + 1,
          });
        }
      }
    }

    const hasTrust = await cmd("search_nodes", {
      query: "Module_TrustStrip",
      types: ["FRAME"],
      limit: 5,
    });
    if (!hasTrust.results.length) {
      const trust = await cmd("create_frame", {
        name: "Module_TrustStrip",
        width: 343,
        height: 64,
        fillColor: rgb("#F7F8FA"),
        cornerRadius: 10,
        layoutMode: "VERTICAL",
        paddingTop: 10,
        paddingRight: 12,
        paddingBottom: 10,
        paddingLeft: 12,
        itemSpacing: 4,
        layoutSizingHorizontal: "FILL",
      });
      await cmd("create_text", {
        parentId: trust.id,
        name: "txt_trust_title",
        text: "机上体验参考（国泰 A350-1000 商务舱）",
        fontFamily: "PingFang SC",
        fontStyle: "Medium",
        fontSize: 13,
        fontColor: rgb("#0F131A"),
      });
      await cmd("create_text", {
        parentId: trust.id,
        name: "txt_trust_body",
        text:
          '综合评分 4.62/5（480 条评论）。可全平躺睡眠；座椅宽度约 20"（约 51cm），间距约 45–75"。',
        fontFamily: "PingFang SC",
        fontStyle: "Regular",
        fontSize: 11,
        fontColor: rgb("#5C5F66"),
        layoutSizingHorizontal: "FILL",
      });

      const cta = await cmd("search_nodes", {
        query: "Module_CTA",
        types: ["FRAME"],
        limit: 3,
      });
      const ctaId = cta.results[0]?.id;
      if (ctaId) {
        const info = await cmd("get_node_info", { nodeId: rootId, depth: 1 });
        const children = info.results[0].children || [];
        const ix = children.findIndex((c) => c.id === ctaId);
        if (ix >= 0) {
          await cmd("insert_child", {
            parentId: rootId,
            childId: trust.id,
            index: ix,
          });
        }
      }
    }

    const hasSecondary = await cmd("search_nodes", {
      query: "Comp_HighCabin_CTA_Secondary",
      types: ["FRAME"],
      limit: 3,
    });
    if (!hasSecondary.results.length) {
      const ctaWrap = await cmd("search_nodes", {
        query: "Module_CTA",
        types: ["FRAME"],
        limit: 2,
      });
      const wrapId = ctaWrap.results[0]?.id;
      if (wrapId) {
        const sec = await cmd("create_frame", {
          name: "Comp_HighCabin_CTA_Secondary",
          width: 319,
          height: 44,
          fillColor: rgb("#FFFFFF"),
          cornerRadius: 10,
          strokeColor: rgb("#1592FB"),
          strokeWeight: 1,
          layoutMode: "HORIZONTAL",
          primaryAxisAlignItems: "CENTER",
          counterAxisAlignItems: "CENTER",
          layoutSizingHorizontal: "FILL",
        });
        await cmd("create_text", {
          parentId: sec.id,
          text: "对比经济舱 · 看差在哪",
          fontFamily: "PingFang SC",
          fontStyle: "Medium",
          fontSize: 15,
          fontColor: rgb("#1592FB"),
        });
        const info = await cmd("get_node_info", { nodeId: wrapId, depth: 1 });
        const ch = info.results[0].children || [];
        const primIdx = ch.findIndex((c) => c.name === "Comp_HighCabin_CTA_Primary");
        const insertAt = primIdx >= 0 ? primIdx + 1 : ch.length;
        await cmd("insert_child", {
          parentId: wrapId,
          childId: sec.id,
          index: insertAt,
        });
      }
    }

    const cardNames = [
      "Module_TopSummary",
      "Module_UserQueryBubble",
      "Module_HeroImage",
      "Module_ValueCard",
      "Module_FeatureHighlights",
      "Module_Compare",
      "Module_TrustStrip",
      "Module_CTA",
    ];
    const patchItems = [];
    for (const q of cardNames) {
      const r = await cmd("search_nodes", { query: q, types: ["FRAME"], limit: 2 });
      const id = r.results[0]?.id;
      if (id) patchItems.push({ nodeId: id, effects: SHADOW_CARD });
    }
    await cmd("patch_nodes", { items: patchItems });

    const ctaWrapForSpacing = await cmd("search_nodes", {
      query: "Module_CTA",
      types: ["FRAME"],
      limit: 1,
    });
    if (ctaWrapForSpacing.results[0]) {
      await cmd("update_frame", {
        nodeId: ctaWrapForSpacing.results[0].id,
        itemSpacing: 12,
      });
    }

    await cmd("update_frame", {
      nodeId: rootId,
      itemSpacing: 16,
      paddingTop: 0,
      paddingBottom: 32,
      paddingLeft: 0,
      paddingRight: 0,
    });

    const titleRes = await cmd("search_nodes", {
      query: "txt_hero_title",
      types: ["TEXT"],
      limit: 2,
    });
    const tId = titleRes.results[0]?.id;
    if (tId) {
      await cmd("set_text_properties", {
        items: [
          {
            nodeId: tId,
            fontSize: 20,
            fontWeight: 500,
            fontColor: rgb("#0F131A"),
          },
        ],
      });
    }

    console.log(
      JSON.stringify(
        { ok: true, rootId, message: "高保真模块已插入；请在 Figma 中拖入机舱图替换 Module_HeroImage 灰色占位区" },
        null,
        2
      )
    );
  } finally {
    close();
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
