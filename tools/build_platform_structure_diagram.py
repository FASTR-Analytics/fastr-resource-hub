#!/usr/bin/env python3
"""Build products_folders_scopes.svg (EN/FR/PT): how a 2.x instance is organised.

Replaces projects_within_instance.svg (platform 1.x) in methodology chapter 3 and
slide m3_2c. Run: python3 tools/build_platform_structure_diagram.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
T = {
    "en": dict(title="Country platform", products="Products page", packages="Results packages", scopes="Scopes",
               f1="Nutrition", f2="Quarterly bulletin", p1="Stunting review", p1t="Deck", p2="Vitamin A trend", p2t="Visualization",
               p3="Q3 bulletin", p3t="Report", pk1="2026-10 · pinned", pk2="2026-07", sc1="All data · built in", sc2="Northern region 2023–2025",
               chip1="2026-10", chip2="All data", chip3="Northern region", caption="Every product reads one results package through one scope",
               folder="Folder"),
    "fr": dict(title="Plateforme du pays", products="Page Produits", packages="Paquets de résultats", scopes="Portées",
               f1="Nutrition", f2="Bulletin trimestriel", p1="Revue du retard de croissance", p1t="Présentation", p2="Tendance vitamine A", p2t="Visualisation",
               p3="Bulletin T3", p3t="Rapport", pk1="2026-10 · épinglé", pk2="2026-07", sc1="Toutes les données · intégrée", sc2="Région Nord 2023–2025",
               chip1="2026-10", chip2="Toutes les données", chip3="Région Nord", caption="Chaque produit lit un paquet de résultats à travers une portée",
               folder="Dossier"),
    "pt": dict(title="Plataforma do país", products="Página Produtos", packages="Pacotes de resultados", scopes="Âmbitos",
               f1="Nutrição", f2="Boletim trimestral", p1="Revisão do atraso de crescimento", p1t="Apresentação", p2="Tendência vitamina A", p2t="Visualização",
               p3="Boletim T3", p3t="Relatório", pk1="2026-10 · fixado", pk2="2026-07", sc1="Todos os dados · integrado", sc2="Região Norte 2023–2025",
               chip1="2026-10", chip2="Todos os dados", chip3="Região Norte", caption="Cada produto lê um pacote de resultados através de um âmbito",
               folder="Pasta"),
}
OUT = {"en": "resources/diagrams", "fr": "resources/diagrams_fr", "pt": "resources/diagrams_pt"}
F = "font-family=\"Inter, -apple-system, sans-serif\""

def chip(x, y, label, fill, color):
    w = 7 * len(label) + 14
    return (f'<rect x="{x}" y="{y}" width="{w}" height="16" rx="8" fill="{fill}"/>'
            f'<text x="{x + w/2}" y="{y + 11.5}" text-anchor="middle" {F} font-size="8.5" font-weight="600" fill="{color}">{label}</text>', w)

def product(x, y, name, typ, pk, sc, dark):
    col = "#0C716B" if dark else "#1FA29C"
    s = [f'<rect x="{x}" y="{y}" width="300" height="42" rx="6" fill="#fff" stroke="{col}" stroke-width="1.2"/>',
         f'<text x="{x+10}" y="{y+16}" {F} font-size="10" font-weight="700" fill="#0A544F">{name}</text>',
         f'<text x="{x+290}" y="{y+16}" text-anchor="end" {F} font-size="8.5" fill="#666">{typ}</text>']
    c1, w1 = chip(x + 10, y + 22, pk, "#E8F4F3", "#0C716B")
    c2, _ = chip(x + 10 + w1 + 6, y + 22, sc, "#FFF4E0", "#8A5A00")
    return "\n".join(s + [c1, c2])

def build(lang):
    t = T[lang]
    g = []
    g.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 380">')
    g.append('<rect x="20" y="20" width="660" height="340" rx="14" fill="#F8F9FA" stroke="#0A544F" stroke-width="2.5"/>')
    g.append('<rect x="20" y="20" width="220" height="32" rx="8" fill="#0A544F"/>')
    g.append(f'<text x="130" y="41" text-anchor="middle" {F} font-size="13" font-weight="700" fill="#fff">{t["title"]}</text>')
    # Products panel
    g.append('<rect x="40" y="68" width="330" height="262" rx="10" fill="#fff" stroke="#1FA29C" stroke-width="1.5"/>')
    g.append('<rect x="40" y="68" width="330" height="28" rx="10" fill="#1FA29C"/><rect x="40" y="86" width="330" height="10" fill="#1FA29C"/>')
    g.append(f'<text x="205" y="87" text-anchor="middle" {F} font-size="11" font-weight="700" fill="#fff">{t["products"]}</text>')
    g.append(f'<polygon points="52,109 52,119 60,114" fill="#0C716B"/><text x="66" y="116" {F} font-size="10" font-weight="700" fill="#0C716B">{t["f1"]}</text><text x="358" y="116" text-anchor="end" {F} font-size="8.5" fill="#999">{t["folder"]}</text>')
    g.append(product(58, 124, t["p1"], t["p1t"], t["chip1"], t["chip2"], False))
    g.append(product(58, 172, t["p2"], t["p2t"], t["chip1"], t["chip3"], False))
    g.append(f'<polygon points="52,231 52,241 60,236" fill="#0C716B"/><text x="66" y="238" {F} font-size="10" font-weight="700" fill="#0C716B">{t["f2"]}</text><text x="358" y="238" text-anchor="end" {F} font-size="8.5" fill="#999">{t["folder"]}</text>')
    g.append(product(58, 246, t["p3"], t["p3t"], t["chip1"], t["chip2"], True))
    # Packages panel
    def panel(x, y, h, head, rows, fills):
        s = [f'<rect x="{x}" y="{y}" width="270" height="{h}" rx="10" fill="#fff" stroke="#0C716B" stroke-width="1.5"/>',
             f'<rect x="{x}" y="{y}" width="270" height="28" rx="10" fill="#0C716B"/><rect x="{x}" y="{y+18}" width="270" height="10" fill="#0C716B"/>',
             f'<text x="{x+135}" y="{y+19}" text-anchor="middle" {F} font-size="11" font-weight="700" fill="#fff">{head}</text>']
        for i, (r, fl) in enumerate(zip(rows, fills)):
            yy = y + 40 + i * 30
            s.append(f'<rect x="{x+12}" y="{yy}" width="246" height="22" rx="5" fill="{fl}"/>')
            s.append(f'<text x="{x+22}" y="{yy+15}" {F} font-size="9.5" font-weight="600" fill="#0A544F">{r}</text>')
        return "\n".join(s)
    g.append(panel(390, 68, 112, t["packages"], [t["pk1"], t["pk2"]], ["#E8F4F3", "#F8F9FA"]))
    g.append(panel(390, 196, 112, t["scopes"], [t["sc1"], t["sc2"]], ["#FFF4E0", "#F8F9FA"]))
    g.append(f'<text x="350" y="350" text-anchor="middle" {F} font-size="10.5" fill="#0A544F" font-weight="600">{t["caption"]}</text>')
    g.append('</svg>')
    out = ROOT / OUT[lang] / "products_folders_scopes.svg"
    out.write_text("\n".join(g) + "\n", encoding="utf-8")
    print("wrote", out.relative_to(ROOT))

if __name__ == "__main__":
    for lang in T: build(lang)
