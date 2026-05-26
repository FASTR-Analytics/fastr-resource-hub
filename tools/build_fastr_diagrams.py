#!/usr/bin/env python3
"""Generate translatable FASTR diagrams from the official GFF SVGs.

The official GFF SVGs in ``resources/diagrams/fastr_gff/`` have their text
flattened to vector outlines (no editable ``<text>``), so they can't be
translated directly. This tool keeps GFF's *exact* graphics but strips the text
glyph paths (identified by fill class) and re-adds live SVG ``<text>`` per
language. Result: EN/FR/PT diagrams with identical, on-brand graphics and
translatable text. Native ``<text>`` renders everywhere, including when the SVG
is embedded via ``<img>`` (unlike ``<foreignObject>``).

Run:  python3 tools/build_fastr_diagrams.py
"""
from pathlib import Path
import re

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "resources" / "diagrams" / "fastr_gff"
OUT_DIR = {
    "en": REPO / "resources" / "diagrams",
    "fr": REPO / "resources" / "diagrams_fr",
    "pt": REPO / "resources" / "diagrams_pt",
}
FONT = 'Inter, "Helvetica Neue", Arial, sans-serif'
INK = "#20415c"   # title colour
GREY = "#4d4d4d"  # description colour

# --- Diagram recipes -------------------------------------------------------
# Each recipe keeps GFF's graphics and re-types the text. Coordinates are in the
# source SVG's own viewBox units (read from the file once, by hand).

FOUR_APPROACHES = {
    "source": "Technical_approaches_image.svg",
    "strip": ("cls-5", "cls-6"),          # grey column text + white base text
    "cols_x": (110, 350, 590, 830),       # circle centres (cy 94.7)
    "title_y": 182, "title_lh": 19,
    "desc_gap": 10, "desc_lh": 15.5, "desc_size": 11.5, "title_size": 15.5,
    "base_h_y": 572, "base_p_y": 596, "base_p_lh": 16,
    "base_h_size": 16.5, "base_p_size": 11.5,
    "lang": {
        "en": {
            "titles": [["RMNCAH-N service", "use monitoring"],
                       ["Rapid-cycle health", "facility phone surveys"],
                       ["Rapid-cycle household", "and client surveys"],
                       ["Digging deeper with", "follow-on analyses"]],
            "descs": [["Leverage HMIS data to", "routinely monitor changes", "in the coverage of health",
                       "services during reforms,", "shocks, or within vulnerable", "populations, while identifying",
                       "and addressing data quality", "challenges."],
                      ["Assess gaps in primary", "health care service delivery,", "and understand the impact",
                       "of health reforms or shocks", "on PHC performance."],
                      ["Generate snapshots of", "health service utilization,", "foregone care, and community",
                       "perceptions of service quality."],
                      ["Efficiently diagnose", "underlying challenges and", "assess implementation",
                       "contexts."]],
            "base_h": "Build Capacity + Data Use Support",
            "base_p": ["Building in-country capacity for data collection, analysis, and use — including",
                       "data reviews and subnational feedback loops."],
            "base_h_size": 16.5,
        },
        "fr": {
            "titles": [["Suivi de l'utilisation", "des services SRMNIA-N"],
                       ["Enquêtes téléphoniques", "rapides en établissement"],
                       ["Enquêtes rapides auprès", "des ménages et clients"],
                       ["Analyses de suivi", "approfondies"]],
            "descs": [["Exploiter les données SIGS", "pour suivre l'évolution de la", "couverture des services lors",
                       "de réformes, de chocs ou dans", "les populations vulnérables, et", "traiter les problèmes de qualité",
                       "des données."],
                      ["Évaluer les lacunes des soins", "de santé primaires et l'impact", "des réformes ou des chocs",
                       "sur la performance des SSP."],
                      ["Saisir l'utilisation des services,", "le renoncement aux soins et", "les perceptions de la qualité",
                       "par la communauté."],
                      ["Diagnostiquer les causes", "sous-jacentes et évaluer les", "contextes de mise en œuvre."]],
            "base_h": "Renforcement des capacités + soutien à l'utilisation des données",
            "base_p": ["Renforcer la capacité nationale de collecte, d'analyse et d'utilisation des données —",
                       "y compris les revues de données et les boucles de rétroaction infranationales."],
            "base_h_size": 15.0,
        },
        "pt": {
            "titles": [["Monitorização do uso", "de serviços SRMNIA-N"],
                       ["Inquéritos telefónicos", "rápidos a unidades"],
                       ["Inquéritos rápidos a", "agregados e utentes"],
                       ["Análises de seguimento", "aprofundadas"]],
            "descs": [["Usar dados do HMIS para", "monitorizar mudanças na", "cobertura dos serviços durante",
                       "reformas, choques ou em", "populações vulneráveis, e tratar", "problemas de qualidade dos",
                       "dados."],
                      ["Avaliar lacunas nos cuidados", "de saúde primários e o impacto", "de reformas ou choques no",
                       "desempenho dos CSP."],
                      ["Captar o uso de serviços, os", "cuidados não procurados e as", "perceções da comunidade sobre",
                       "a qualidade do serviço."],
                      ["Diagnosticar causas", "subjacentes e avaliar os", "contextos de implementação."]],
            "base_h": "Reforço de capacidades + apoio ao uso de dados",
            "base_p": ["Reforçar a capacidade nacional de recolha, análise e uso de dados —",
                       "incluindo revisões de dados e ciclos de retroação subnacionais."],
            "base_h_size": 16.0,
        },
    },
}

# Output filename matches the GFF source name (sans .svg), so the same diagram
# carries the same name across resources/diagrams{,_fr,_pt}/.
RECIPES = {"Technical_approaches_image": FOUR_APPROACHES}

# All languages are regenerated from one template so EN/FR/PT share identical
# typography, card fills, and outlines (the GFF original's flattened text renders
# at a different font/size than live <text>, which looks inconsistent side by side).
PASSTHROUGH: set = set()


def _esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def strip_text(svg: str, classes, base_text_y: float = 480) -> str:
    """Remove the flattened text glyph paths, keeping graphics intact.

    The grey column text (cls-5) is entirely text — strip it all. The white
    cls-6 paths are *both* the 4 white column cards (upper, y < base_text_y) and
    the white base-bar text (lower) — strip only the lower ones so the cards stay.
    """
    svg = re.sub(r'<path class="cls-5"[^>]*/>', "", svg)

    def drop_lower_white(m: re.Match) -> str:
        mm = re.search(r'd="M\s*(-?\d+\.?\d*)[ ,](-?\d+\.?\d*)', m.group(0))
        if mm and float(mm.group(2)) >= base_text_y:
            return ""          # base-bar text glyph
        return m.group(0)       # keep white card
    return re.sub(r'<path class="cls-6"[^>]*/>', drop_lower_white, svg)


def add_white_bg(svg: str) -> str:
    """Insert an opaque white background as the first drawn element."""
    return re.sub(r'(<g id="Layer_1-2">)',
                  r'\1<rect x="0" y="0" width="940" height="651.3556" fill="#ffffff"/>',
                  svg, count=1)


# Column accent colours, left to right, used to outline the white cards so they
# stay visible on a white background (the GFF cards have no real stroke — they
# only read as bordered because their canvas is non-white).
CARD_COLOURS = ((0, "#22aef4"), (235, "#ff6462"), (470, "#1fa29c"), (705, "#f29b35"))


def outline_cards(svg: str, stroke_width: float = 1.5) -> str:
    """Add a column-coloured stroke to each surviving white card (cls-6)."""
    def colour_for(x: float) -> str:
        col = CARD_COLOURS[0][1]
        for thr, c in CARD_COLOURS:
            if x >= thr:
                col = c
        return col

    def repl(m: re.Match) -> str:
        whole = m.group(0)
        mm = re.search(r'd="M\s*(-?\d+\.?\d*)[ ,](-?\d+\.?\d*)', whole)
        if not mm:
            return whole
        col = colour_for(float(mm.group(1)))
        return whole[:-2] + f' stroke="{col}" stroke-width="{stroke_width}"/>'
    return re.sub(r'<path class="cls-6"[^>]*/>', repl, svg)


def build_text(rec: dict, L: dict) -> str:
    p = ['<g id="fastr-text">']
    for cx, title, desc in zip(rec["cols_x"], L["titles"], L["descs"]):
        ty = rec["title_y"]
        p.append(f'<text x="{cx}" y="{ty}" text-anchor="middle" font-family=\'{FONT}\' '
                 f'font-size="{rec["title_size"]}" font-weight="700" fill="{INK}">')
        for i, line in enumerate(title):
            p.append(f'<tspan x="{cx}" dy="{0 if i == 0 else rec["title_lh"]}">{_esc(line)}</tspan>')
        p.append('</text>')
        dy0 = ty + len(title) * rec["title_lh"] + rec["desc_gap"]
        p.append(f'<text x="{cx}" y="{dy0}" text-anchor="middle" font-family=\'{FONT}\' '
                 f'font-size="{rec["desc_size"]}" fill="{GREY}">')
        for i, line in enumerate(desc):
            p.append(f'<tspan x="{cx}" dy="{0 if i == 0 else rec["desc_lh"]}">{_esc(line)}</tspan>')
        p.append('</text>')
    p.append(f'<text x="470" y="{rec["base_h_y"]}" text-anchor="middle" font-family=\'{FONT}\' '
             f'font-size="{L.get("base_h_size", rec["base_h_size"])}" font-weight="700" fill="#ffffff">'
             f'{_esc(L["base_h"])}</text>')
    p.append(f'<text x="470" y="{rec["base_p_y"]}" text-anchor="middle" font-family=\'{FONT}\' '
             f'font-size="{rec["base_p_size"]}" fill="#ffffff">')
    for i, line in enumerate(L["base_p"]):
        p.append(f'<tspan x="470" dy="{0 if i == 0 else rec["base_p_lh"]}">{_esc(line)}</tspan>')
    p.append('</text></g>')
    return "\n".join(p)


def main() -> int:
    built = 0
    for name, rec in RECIPES.items():
        src = (SRC / rec["source"]).read_text()
        template = add_white_bg(outline_cards(strip_text(src, rec["strip"])))
        for lang, L in rec["lang"].items():
            dest = OUT_DIR[lang] / f"{name}.svg"
            dest.parent.mkdir(parents=True, exist_ok=True)
            if lang in PASSTHROUGH:
                dest.write_text(src)  # exact GFF original
                print(f"[{lang}] {dest.relative_to(REPO)}  (GFF original, verbatim)")
            else:
                dest.write_text(template.replace("</svg>", build_text(rec, L) + "</svg>"))
                print(f"[{lang}] {dest.relative_to(REPO)}  (rebuilt, translated)")
            built += 1
    print(f"\nDone — {built} diagram(s) written.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
