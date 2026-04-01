#!/usr/bin/env python3
"""
Read OTA FE & PEY xlsx → HTML poster + optional full-page PNG/WebP (Playwright).

Usage:
  python3 ota-fe-pey-xlsx-to-poster.py [--no-screenshot]
"""

from __future__ import annotations

import argparse
import html
import shutil
import sys
import xml.etree.ElementTree as ET
import zipfile
from collections import defaultdict
from pathlib import Path

from openpyxl.cell.cell import MergedCell
from openpyxl.utils import get_column_letter
from openpyxl import load_workbook


REPO_QWEN = Path(__file__).resolve().parents[1]
DEFAULT_XLSX = REPO_QWEN / "Prd" / "OTA FE & PEY全流程触达点优化及Upselling-20260307-Fliggy-1.xlsx"
EXPORT_DIR = REPO_QWEN / "Prd" / "exports"
ASSETS_DIR = EXPORT_DIR / "poster-assets"
HTML_OUT = EXPORT_DIR / "ota-fe-pey-touchpoints-poster.html"
PNG_OUT = EXPORT_DIR / "ota-fe-pey-touchpoints-poster@2x.png"
WEBP_OUT = EXPORT_DIR / "ota-fe-pey-touchpoints-poster@2x.webp"

def _localname(tag: str) -> str:
    if "}" in tag:
        return tag.split("}", 1)[1]
    return tag


def parse_drawing_images(xlsx: Path) -> tuple[list[dict], dict[str, str]]:
    """
    Returns:
      anchors: list of { excel_row, excel_col, rId, media_basename }
      rId_to_target: e.g. rId1 -> ../media/image1.png
    """
    with zipfile.ZipFile(xlsx, "r") as z:
        rel_xml = z.read("xl/drawings/_rels/drawing1.xml.rels").decode("utf-8")
        dr_xml = z.read("xl/drawings/drawing1.xml")

    root_rel = ET.fromstring(rel_xml)
    r_id_to_target: dict[str, str] = {}
    for rel in root_rel:
        if _localname(rel.tag) != "Relationship":
            continue
        rid = rel.attrib.get("Id")
        target = rel.attrib.get("Target", "")
        if rid:
            r_id_to_target[rid] = target

    tree = ET.fromstring(dr_xml)
    anchors: list[dict] = []
    for el in tree.iter():
        if _localname(el.tag) != "twoCellAnchor":
            continue
        from_el = None
        r_embed = None
        for child in el:
            ln = _localname(child.tag)
            if ln == "from":
                from_el = child
            elif ln == "pic":
                for blip in child.iter():
                    if _localname(blip.tag) == "blip":
                        r_embed = blip.attrib.get(
                            "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed"
                        )
                        break
        if from_el is None or not r_embed:
            continue
        row = col = 0
        for fe in from_el:
            l = _localname(fe.tag)
            if l == "col":
                col = int(fe.text or 0)
            elif l == "row":
                row = int(fe.text or 0)
        # OOXML drawing uses 0-based row/col; Excel row = row + 1, col letter index = col + 1
        anchors.append(
            {
                "excel_row": row + 1,
                "excel_col": col + 1,
                "rId": r_embed,
            }
        )

    # resolve media basename
    resolved: list[dict] = []
    for a in anchors:
        target = r_id_to_target.get(a["rId"], "")
        # "../media/image1.png" -> image1.png
        base = Path(target).name
        resolved.append({**a, "media_basename": base})

    return resolved, r_id_to_target


def list_zip_media_basenames(xlsx: Path) -> set[str]:
    with zipfile.ZipFile(xlsx, "r") as z:
        return {Path(n).name for n in z.namelist() if n.startswith("xl/media/")}


def extract_media(xlsx: Path, dest: Path, only: set[str] | None = None) -> set[str]:
    """Extract xl/media/* to dest. If only is set, copy only matching basenames."""
    dest.mkdir(parents=True, exist_ok=True)
    found: set[str] = set()
    with zipfile.ZipFile(xlsx, "r") as z:
        for name in z.namelist():
            if not name.startswith("xl/media/"):
                continue
            base = Path(name).name
            if only is not None and base not in only:
                continue
            target = dest / base
            with z.open(name) as src, open(target, "wb") as out:
                shutil.copyfileobj(src, out)
            found.add(base)
    return found


def format_cell_value(val) -> str:
    if val is None:
        return ""
    if isinstance(val, float):
        if val == int(val):
            return str(int(val))
    s = str(val).strip()
    return html.escape(s).replace("\n", "<br/>")


def merged_span(ws, row: int, col: int) -> tuple[int, int]:
    coord = f"{get_column_letter(col)}{row}"
    for mr in ws.merged_cells.ranges:
        if coord in mr:
            rs = mr.max_row - mr.min_row + 1
            cs = mr.max_col - mr.min_col + 1
            return rs, cs
    return 1, 1


def sheet_to_html_table_with_figures(
    ws,
    min_row: int,
    max_row: int,
    min_col: int,
    max_col: int,
    images_by_row: dict[int, list[str]],
) -> str:
    """Build one table; after each data row, insert optional figure row (full colspan)."""
    col_count = max_col - min_col + 1
    rows_html: list[str] = []
    for r in range(min_row, max_row + 1):
        cells: list[str] = []
        for c in range(min_col, max_col + 1):
            cell = ws.cell(row=r, column=c)
            if isinstance(cell, MergedCell):
                continue
            rs, cs = merged_span(ws, r, c)
            val = format_cell_value(cell.value)
            attr = ""
            if rs > 1:
                attr += f' rowspan="{rs}"'
            if cs > 1:
                attr += f' colspan="{cs}"'
            cls = ' class="muted"' if c == min_col and val else ""
            cells.append(f"<td{attr}{cls}>{val}</td>")
        if cells:
            rows_html.append("<tr>" + "".join(cells) + "</tr>")
        if r in images_by_row:
            figs = "".join(
                f'<figure class="fig"><img src="{html.escape(src)}" alt="" loading="lazy"/></figure>'
                for src in images_by_row[r]
            )
            rows_html.append(
                f'<tr class="fig-row"><td colspan="{col_count}" class="fig-cell">{figs}</td></tr>'
            )
    return '<table class="sheet">\n' + "\n".join(rows_html) + "\n</table>"


def sheet_to_html_table(ws, min_row: int, max_row: int, min_col: int, max_col: int) -> str:
    return sheet_to_html_table_with_figures(ws, min_row, max_row, min_col, max_col, {})


def build_html(
    title_s1: str,
    title_s2: str,
    table1: str,
    table2: str,
    orphan_media: list[str],
    source_name: str,
) -> str:
    orphan_section = ""
    if orphan_media:
        names = ", ".join(html.escape(n) for n in orphan_media[:12])
        more = f" 等共 {len(orphan_media)} 个" if len(orphan_media) > 12 else ""
        orphan_section = f"""<section class="orphans">
      <h2>未关联到 Sheet1 示意图的嵌入资源</h2>
      <p class="meta">以下文件存在于工作簿 xl/media 中，但未出现在 Sheet1 的 drawing 锚点里（海报未展开缩略图以免版面过长）：{names}{more}。</p>
    </section>"""

    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>{html.escape(title_s1)} — 海报导出</title>
  <style>
    :root {{
      --text: #1d1d1f;
      --muted: #6e6e73;
      --line: #d2d2d7;
      --bg: #f5f5f7;
      --card: #fff;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.45;
      font-size: 14px;
    }}
    .wrap {{
      max-width: 1200px;
      margin: 0 auto;
      padding: 48px 32px 80px;
      background: var(--card);
      box-shadow: 0 8px 40px rgba(0,0,0,.06);
    }}
    header {{
      border-bottom: 1px solid var(--line);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }}
    header h1 {{ margin: 0 0 8px; font-size: 26px; font-weight: 600; }}
    header .meta {{ color: var(--muted); font-size: 13px; }}
    section h2 {{
      margin: 40px 0 16px;
      font-size: 18px;
      font-weight: 600;
      color: var(--text);
    }}
    table.sheet {{
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 13px;
    }}
    table.sheet td {{
      border: 1px solid var(--line);
      padding: 8px 10px;
      vertical-align: top;
      word-wrap: break-word;
    }}
    table.sheet td.muted {{ color: var(--muted); width: 12%; }}
    .after-row {{
      margin: 20px 0 8px;
    }}
    .fig {{
      margin: 0 0 24px;
    }}
    .fig img {{
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto;
      border-radius: 8px;
      border: 1px solid var(--line);
    }}
    tr.fig-row td.fig-cell {{
      border: 1px solid var(--line);
      background: #fafafa;
      padding: 16px 12px;
    }}
    .orphans {{ margin-top: 48px; padding-top: 24px; border-top: 1px dashed var(--line); }}
    .orphan-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }}
    .orphan figcaption {{ font-size: 12px; color: var(--muted); margin-top: 6px; }}
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>{html.escape(title_s1)}</h1>
      <p class="meta">来源文件：{html.escape(source_name)} · 由脚本自动拼版（含内嵌示意图）</p>
    </header>

    <section>
      <h2>{html.escape(title_s1)}</h2>
      {table1}
    </section>

    <section>
      <h2>{html.escape(title_s2)}</h2>
      {table2}
    </section>

    {orphan_section}
  </div>
</body>
</html>
"""


def map_images_to_rows(anchors: list[dict]) -> dict[int, list[str]]:
    """Attach image path (relative) to Excel row (1-based) they anchor to."""
    by_row: dict[int, list[str]] = defaultdict(list)
    for a in sorted(anchors, key=lambda x: (x["excel_row"], x["excel_col"])):
        rel = f'./poster-assets/{a["media_basename"]}'
        by_row[a["excel_row"]].append(rel)
    return dict(by_row)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--xlsx",
        type=Path,
        default=DEFAULT_XLSX,
        help="Path to source xlsx",
    )
    parser.add_argument("--no-screenshot", action="store_true")
    parser.add_argument(
        "--html",
        type=Path,
        default=HTML_OUT,
    )
    parser.add_argument("--png", type=Path, default=PNG_OUT)
    args = parser.parse_args()

    xlsx: Path = args.xlsx
    if not xlsx.is_file():
        print(f"Missing xlsx: {xlsx}", file=sys.stderr)
        return 1

    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    if ASSETS_DIR.exists():
        shutil.rmtree(ASSETS_DIR)
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    anchors, _ = parse_drawing_images(xlsx)
    referenced = {a["media_basename"] for a in anchors}
    zip_media = list_zip_media_basenames(xlsx)
    orphan_media = sorted(zip_media - referenced)
    extract_media(xlsx, ASSETS_DIR, only=referenced)

    # merged_cells required for table layout (not available in read_only)
    wb = load_workbook(xlsx, data_only=True, read_only=False)
    try:
        names = wb.sheetnames
        if len(names) < 2:
            print("Expected at least 2 sheets", file=sys.stderr)
            return 1
        ws1 = wb[names[0]]
        ws2 = wb[names[1]]
        title_s1 = names[0]
        title_s2 = names[1]
        images_by_row = map_images_to_rows(anchors)
        table1 = sheet_to_html_table_with_figures(ws1, 2, 56, 2, 14, images_by_row)
        table2 = sheet_to_html_table(ws2, 1, 8, 1, 12)
    finally:
        wb.close()

    html_doc = build_html(
        title_s1,
        title_s2,
        table1,
        table2,
        orphan_media,
        xlsx.name,
    )

    args.html.parent.mkdir(parents=True, exist_ok=True)
    args.html.write_text(html_doc, encoding="utf-8")
    print(f"Wrote {args.html}")

    if not args.no_screenshot:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            print("Playwright not installed; skip screenshot", file=sys.stderr)
        else:
            url = args.html.resolve().as_uri()
            args.png.parent.mkdir(parents=True, exist_ok=True)
            with sync_playwright() as p:
                browser = p.chromium.launch()
                # 1.5x：可读性与文件体积平衡；过长页面 WebP 单边上限 16383
                page = browser.new_page(device_scale_factor=1.5, viewport={"width": 1280, "height": 800})
                page.goto(url, wait_until="networkidle")
                page.screenshot(path=str(args.png), full_page=True)
                browser.close()
            print(f"Wrote {args.png}")
            try:
                from PIL import Image

                Image.MAX_IMAGE_PIXELS = max(Image.MAX_IMAGE_PIXELS, 200_000_000)
                im = Image.open(args.png).convert("RGB")
                max_side = 16383
                w, h = im.size
                if max(w, h) > max_side:
                    scale = max_side / max(w, h)
                    im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
                im.save(WEBP_OUT, "WEBP", quality=88, method=6)
                print(f"Wrote {WEBP_OUT}")
            except Exception as e:
                print(f"WebP skip: {e}", file=sys.stderr)

    print("Anchors:", len(anchors), "orphan media:", len(orphan_media))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
