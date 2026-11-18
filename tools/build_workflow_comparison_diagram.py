#!/usr/bin/env python3
"""Build workflow_manual_vs_fastr.svg (EN/FR/PT): the monthly reporting workflow
done by hand versus with the FASTR platform (2.x).

Run: python3 tools/build_workflow_comparison_diagram.py
Writes resources/diagrams/, resources/diagrams_fr/, resources/diagrams_pt/.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
F = 'font-family="Inter, -apple-system, sans-serif"'

T = {
    "en": dict(
        title_a="Manual workflow", sub_a="Every month, every report, by hand",
        title_b="With the FASTR platform", sub_b="Once set up, three steps a month",
        a=[("1", "Log in to DHIS2", "Find the right data sets and indicators"),
           ("2", "Download the last months", "One export per indicator and level, as Excel or CSV"),
           ("3", "Excel or another analysis tool", "Clean, build the tables and charts by hand"),
           ("4", "Word or another text tool", "Paste the tables and charts, write the text, fix the layout")],
        b=[("1", "Data, then Import", "Pull the latest months from DHIS2 through the API"),
           ("2", "Results, then Generate a package", "Quality checks, adjustments, disruptions and coverage computed in one go. Pin the new package."),
           ("3", "Products, then report or slide deck", "A new report chooses its package when created. An existing one: menu, Results package and scope, pick the new package. Every chart refreshes; the AI rewrites the text.")],
        foot_a="Each step repeats next month. Errors creep in at every copy and paste.",
        foot_b="Every report and chart is linked to one package: switch the package and everything updates."),
    "fr": dict(
        title_a="Circuit manuel", sub_a="Chaque mois, chaque rapport, à la main",
        title_b="Avec la plateforme FASTR", sub_b="Une fois configurée, trois étapes par mois",
        a=[("1", "Se connecter au DHIS2", "Retrouver les bons jeux de données et indicateurs"),
           ("2", "Télécharger les derniers mois", "Un export par indicateur et par niveau, en Excel ou CSV"),
           ("3", "Excel ou un autre outil d'analyse", "Nettoyer, construire les tableaux et les graphiques à la main"),
           ("4", "Word ou un autre outil de texte", "Coller les tableaux et graphiques, rédiger le texte, refaire la mise en page")],
        b=[("1", "Données, puis Importer", "Récupérer les derniers mois du DHIS2 par l'API"),
           ("2", "Résultats, puis Générer un paquet", "Qualité, ajustements, perturbations et couverture calculés d'un coup. Épinglez le nouveau paquet."),
           ("3", "Produits, puis rapport ou présentation", "Un nouveau rapport choisit son paquet à la création. Un rapport existant : menu, Paquet de résultats et portée, choisir le nouveau paquet. Tous les graphiques se mettent à jour ; l'IA réécrit le texte.")],
        foot_a="Chaque étape se répète le mois suivant. Les erreurs s'invitent à chaque copier-coller.",
        foot_b="Chaque rapport et chaque graphique est lié à un paquet : changer de paquet met tout à jour."),
    "pt": dict(
        title_a="Circuito manual", sub_a="Todos os meses, todos os relatórios, à mão",
        title_b="Com a plataforma FASTR", sub_b="Depois de configurada, três passos por mês",
        a=[("1", "Iniciar sessão no DHIS2", "Encontrar os conjuntos de dados e indicadores certos"),
           ("2", "Transferir os últimos meses", "Uma exportação por indicador e nível, em Excel ou CSV"),
           ("3", "Excel ou outra ferramenta de análise", "Limpar, construir as tabelas e os gráficos à mão"),
           ("4", "Word ou outra ferramenta de texto", "Colar tabelas e gráficos, escrever o texto, refazer a paginação")],
        b=[("1", "Dados, depois Importar", "Obter os últimos meses do DHIS2 pela API"),
           ("2", "Resultados, depois Gerar um pacote", "Qualidade, ajustes, perturbações e cobertura calculados de uma vez. Fixe o novo pacote."),
           ("3", "Produtos, depois relatório ou apresentação", "Um relatório novo escolhe o pacote ao ser criado. Um existente: menu, Pacote de resultados e âmbito, escolher o novo pacote. Todos os gráficos se atualizam; a IA reescreve o texto.")],
        foot_a="Cada passo repete-se no mês seguinte. Os erros entram a cada copiar e colar.",
        foot_b="Cada relatório e gráfico está ligado a um pacote: mudar de pacote atualiza tudo."),
}
OUT = {"en": "resources/diagrams", "fr": "resources/diagrams_fr", "pt": "resources/diagrams_pt"}

W, H = 960, 530


def wrap(text, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > width and cur:
            lines.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        lines.append(cur)
    return lines


def row(y, title, sub, steps, foot, dark, light, ink, badge_fill, badge_ink, card_w, gap, x0, h):
    g = []
    g.append(f'<text x="{x0}" y="{y - 30}" {F} font-size="17" font-weight="700" fill="{dark}">{title}</text>')
    g.append(f'<text x="{x0}" y="{y - 12}" {F} font-size="11" fill="#666">{sub}</text>')
    for i, (n, head, body) in enumerate(steps):
        x = x0 + i * (card_w + gap)
        g.append(f'<rect x="{x}" y="{y}" width="{card_w}" height="{h}" rx="10" fill="{light}" stroke="{dark}" stroke-width="1.4"/>')
        g.append(f'<circle cx="{x + 20}" cy="{y + 22}" r="12" fill="{badge_fill}"/>')
        g.append(f'<text x="{x + 20}" y="{y + 26.5}" text-anchor="middle" {F} font-size="12" font-weight="700" fill="{badge_ink}">{n}</text>')
        hy = y + 50
        for line in wrap(head, 24):
            g.append(f'<text x="{x + 12}" y="{hy}" {F} font-size="12" font-weight="700" fill="{ink}">{line}</text>'); hy += 15
        hy += 4
        for line in wrap(body, 34 if card_w > 250 else 30):
            g.append(f'<text x="{x + 12}" y="{hy}" {F} font-size="10.5" fill="#444">{line}</text>'); hy += 13.5
        if i < len(steps) - 1:
            ax = x + card_w + 4
            g.append(f'<polyline points="{ax},{y + h/2 - 6} {ax + gap - 10},{y + h/2} {ax},{y + h/2 + 6}" fill="none" stroke="{dark}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>')
    g.append(f'<text x="{x0}" y="{y + h + 20}" {F} font-size="11" font-style="italic" fill="{dark}">{foot}</text>')
    return "\n".join(g)


def build(lang):
    t = T[lang]
    g = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">',
         f'<rect width="{W}" height="{H}" fill="#ffffff"/>']
    x0 = 30
    # manual: 4 cards
    gap = 26
    cw4 = (W - 2 * x0 - 3 * gap) / 4
    g.append(row(70, t["title_a"], t["sub_a"], t["a"], t["foot_a"], "#6B7280", "#F3F4F6", "#1F2937", "#6B7280", "#ffffff", cw4, gap, x0, 150))
    # divider
    g.append(f'<line x1="{x0}" y1="262" x2="{W - x0}" y2="262" stroke="#E4E7E5" stroke-width="1"/>')
    # fastr: 3 cards
    cw3 = (W - 2 * x0 - 2 * gap) / 3
    g.append(row(310, t["title_b"], t["sub_b"], t["b"], t["foot_b"], "#0A544F", "#E8F4F3", "#0A544F", "#1FA29C", "#ffffff", cw3, gap, x0, 180))
    g.append('</svg>')
    out = ROOT / OUT[lang] / "workflow_manual_vs_fastr.svg"
    out.write_text("\n".join(g) + "\n", encoding="utf-8")
    print("wrote", out.relative_to(ROOT))


if __name__ == "__main__":
    for lang in T:
        build(lang)
