#!/usr/bin/env python3
"""Illustrations for the Bayesian disruption detection slides (m6_2e–m6_2h).

Writes EN/FR/PT SVGs to resources/diagrams{,_fr,_pt}/:
  disruption_bayes_two_questions.svg  — the two questions the model asks per facility
  disruption_bayes_chart.svg          — an illustrative chart drawn with the platform's
                                        colours (black solid observed, black dashed expected,
                                        grey 95 % band, red below / green above)
  disruption_bayes_gaps.svg           — reporting gap vs service gap

Colours follow the platform chart style (client/src/generate_visualization/
get_style_from_po/_6_disruptions_v2.ts): band #e2e2e2, lines #000000.
Usage: python3 tools/build_disruption_bayes_illustrations.py
"""
import math
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / 'resources'
DG, G, LG, TINT = '#0A544F', '#0C716B', '#1FA29C', '#E8F4F3'
NAVY, PLUM = '#21568C', '#501E50'
RED, REDBG, GREEN, GREENBG = '#C53030', '#FDE8E8', '#1E7B34', '#E3F3E6'
INK, MUTED, GREY = '#1F2A2E', '#5B6B70', '#C9D1D4'
BAND, BLACK = '#e2e2e2', '#000000'
FONT = "font-family=\"Inter, -apple-system, 'Segoe UI', Roboto, sans-serif\""
W = 1200

T = {
 'en': dict(q1='Question 1 · Did the facility report this month?', q1b='Asked for every facility and every month. Gives the chance that a facility reports, from its own history, the season and the trend.',
            q2='Question 2 · When it reports, how much does it deliver?', q2b='Asked only for the months with a report. Gives each facility its own expected volume, with the season and the trend.',
            why='Why two questions? A low total can come from facilities going silent, from facilities delivering less, or both. Only the second is a service disruption.',
            fac='facility', month='month', rep='reported', norep='no report',
            obs='Observed', exp='Expected', band='95 % band', below='below the band: deficit', above='above the band: surplus', inside='inside the band: normal variation',
            cap='Observed vs expected services, 95 % credible interval', vol='services per month',
            full='Expected if every facility had reported', asx='Expected given who usually reports', ob='Observed',
            g1='Reporting gap', g1b='missing reports', g2='Service gap', g2b='real change in delivery', note='Check the reporting gap first: a large one is a data problem, not a service problem.'),
 'fr': dict(q1='Question 1 · L’établissement a-t-il rapporté ce mois-ci ?', q1b='Posée pour chaque établissement et chaque mois. Donne la chance qu’un établissement rapporte, d’après son historique, la saison et la tendance.',
            q2='Question 2 · Quand il rapporte, combien délivre-t-il ?', q2b='Posée seulement pour les mois avec un rapport. Donne à chaque établissement son propre volume attendu, avec la saison et la tendance.',
            why='Pourquoi deux questions ? Un total bas peut venir d’établissements silencieux, d’établissements qui délivrent moins, ou des deux. Seul le second cas est une perturbation de service.',
            fac='établissement', month='mois', rep='a rapporté', norep='pas de rapport',
            obs='Observé', exp='Attendu', band='bande à 95 %', below='sous la bande : déficit', above='au-dessus de la bande : excédent', inside='dans la bande : variation normale',
            cap='Services observés vs attendus, intervalle de crédibilité à 95 %', vol='services par mois',
            full='Attendu si tous les établissements avaient rapporté', asx='Attendu vu qui rapporte d’habitude', ob='Observé',
            g1='Écart de rapportage', g1b='rapports manquants', g2='Écart de service', g2b='vrai changement de prestation', note='Regardez d’abord l’écart de rapportage : s’il est grand, c’est un problème de données, pas de service.'),
 'pt': dict(q1='Pergunta 1 · A unidade reportou este mês?', q1b='Feita para cada unidade e cada mês. Dá a probabilidade de uma unidade reportar, a partir do seu histórico, da época e da tendência.',
            q2='Pergunta 2 · Quando reporta, quanto presta?', q2b='Feita só para os meses com relatório. Dá a cada unidade o seu próprio volume esperado, com a época e a tendência.',
            why='Porquê duas perguntas? Um total baixo pode vir de unidades em silêncio, de unidades que prestam menos, ou de ambas. Só a segunda é uma perturbação do serviço.',
            fac='unidade', month='mês', rep='reportou', norep='sem relatório',
            obs='Observado', exp='Esperado', band='banda de 95 %', below='abaixo da banda: défice', above='acima da banda: excedente', inside='dentro da banda: variação normal',
            cap='Serviços observados vs esperados, intervalo de credibilidade de 95 %', vol='serviços por mês',
            full='Esperado se todas as unidades tivessem reportado', asx='Esperado dado quem costuma reportar', ob='Observado',
            g1='Lacuna de reporte', g1b='relatórios em falta', g2='Lacuna de serviço', g2b='mudança real na prestação', note='Veja primeiro a lacuna de reporte: se for grande, é um problema de dados, não de serviço.'),
}
OUT = {'en': ROOT / 'diagrams', 'fr': ROOT / 'diagrams_fr', 'pt': ROOT / 'diagrams_pt'}


def t(x, y, s, size=16, fill=INK, anchor='middle', weight=400):
    s = s.replace('&', '&amp;').replace('<', '&lt;')
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" font-weight="{weight}" fill="{fill}">{s}</text>'


def clinic(x, y, w=70, h=50, col=DG, dim=False):
    o = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{"#FFFFFF" if not dim else "#F3F5F5"}" stroke="{col if not dim else GREY}" stroke-width="2.5"/>'
    o += f'<polygon points="{x-5},{y} {x+w/2},{y-22} {x+w+5},{y}" fill="{col if not dim else GREY}"/>'
    o += f'<rect x="{x+w/2-5}" y="{y+13}" width="10" height="26" fill="{RED if not dim else GREY}"/><rect x="{x+w/2-13}" y="{y+21}" width="26" height="10" fill="{RED if not dim else GREY}"/>'
    return o


def svg(path, body, h):
    path.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {h}" {FONT}>{body}</svg>')


def two_questions(L):
    b = ''
    # left: grid of facilities x months, some cells empty
    cols, rows = 6, 3
    x0, y0, cw, ch = 60, 90, 90, 80
    pattern = [[1, 1, 0, 1, 1, 1], [1, 0, 0, 1, 1, 0], [1, 1, 1, 1, 0, 1]]
    for r in range(rows):
        b += t(x0 - 12, y0 + r * ch + 50, f'{L["fac"]} {r+1}', 12, MUTED, anchor='end')
        for c in range(cols):
            x, y = x0 + c * cw, y0 + r * ch
            if r == 0: b += t(x + 35, y0 - 16, f'{L["month"]} {c+1}', 11, MUTED)
            b += clinic(x, y + 24, 70, 44, DG, dim=not pattern[r][c])
    ly = y0 + rows * ch + 22
    b += f'<rect x="{x0+120}" y="{ly-8}" width="16" height="16" rx="3" fill="#FFFFFF" stroke="{DG}" stroke-width="2"/>' + t(x0 + 144, ly + 5, L['rep'], 12, INK, anchor='start')
    b += f'<rect x="{x0+300}" y="{ly-8}" width="16" height="16" rx="3" fill="#F3F5F5" stroke="{GREY}" stroke-width="2"/>' + t(x0 + 324, ly + 5, L['norep'], 12, INK, anchor='start')
    # right: two question cards
    for i, (q, qb, col) in enumerate(((L['q1'], L['q1b'], NAVY), (L['q2'], L['q2b'], DG))):
        y = 70 + i * 150
        b += f'<rect x="640" y="{y}" width="500" height="120" rx="12" fill="#FFFFFF" stroke="{col}" stroke-width="2"/>'
        b += f'<rect x="640" y="{y}" width="500" height="40" rx="12" fill="{col}"/><rect x="640" y="{y+22}" width="500" height="18" fill="{col}"/>'
        b += t(890, y + 26, q, 15, '#FFFFFF', weight=700)
        words, lines, cur = qb.split(), [], ''
        for w_ in words:
            if len(cur + ' ' + w_) > 62: lines.append(cur); cur = w_
            else: cur = (cur + ' ' + w_).strip()
        lines.append(cur)
        for k, ln in enumerate(lines[:3]): b += t(890, y + 64 + k * 20, ln, 13, INK)
    b += f'<rect x="60" y="390" width="1080" height="48" rx="24" fill="{TINT}"/>'
    b += t(600, 419, L['why'], 14, DG, weight=600)
    return b, 460


def chart(L):
    b = t(600, 36, L['cap'], 16, INK, weight=600)
    x0, y0, xw, yh = 110, 360, 900, 260
    n = 24
    def X(i): return x0 + i * xw / (n - 1)
    def Y(v): return y0 - (v - 400) / 800 * yh
    for v in (400, 600, 800, 1000, 1200):
        b += f'<line x1="{x0}" y1="{Y(v)}" x2="{x0+xw}" y2="{Y(v)}" stroke="#EEF0F0" stroke-width="1"/>'
        b += t(x0 - 12, Y(v) + 5, f'{v}', 12, MUTED, anchor='end')
    b += t(x0 - 12, y0 - yh - 14, L['vol'], 12, MUTED, anchor='end')
    exp = [800 + 60 * math.sin(2 * math.pi * i / 12) + 6 * i for i in range(n)]
    obs = []
    for i, e in enumerate(exp):
        d = 0
        if 8 <= i <= 11: d = -220 + 25 * (i - 8)
        if i == 18: d = 190
        obs.append(e + d + (25 if i % 3 == 0 else -15))
    lo = [e - 90 for e in exp]; hi = [e + 90 for e in exp]
    band = ' '.join(f'{X(i):.0f},{Y(hi[i]):.0f}' for i in range(n)) + ' ' + ' '.join(f'{X(i):.0f},{Y(lo[i]):.0f}' for i in reversed(range(n)))
    b += f'<polygon points="{band}" fill="{BAND}"/>'
    # shading where observed outside band
    for i in range(n - 1):
        for j in (i, i + 1):
            pass
        if obs[i] < lo[i] and obs[i + 1] < lo[i + 1]:
            b += f'<polygon points="{X(i):.0f},{Y(lo[i]):.0f} {X(i+1):.0f},{Y(lo[i+1]):.0f} {X(i+1):.0f},{Y(obs[i+1]):.0f} {X(i):.0f},{Y(obs[i]):.0f}" fill="{RED}" opacity="0.45"/>'
        if obs[i] > hi[i] and obs[i + 1] > hi[i + 1]:
            b += f'<polygon points="{X(i):.0f},{Y(hi[i]):.0f} {X(i+1):.0f},{Y(hi[i+1]):.0f} {X(i+1):.0f},{Y(obs[i+1]):.0f} {X(i):.0f},{Y(obs[i]):.0f}" fill="{GREEN}" opacity="0.45"/>'
    # single-point surplus at i=18: triangle to neighbours' band edge
    i = 18
    b += f'<polygon points="{X(i-1):.0f},{Y(hi[i-1]):.0f} {X(i):.0f},{Y(obs[i]):.0f} {X(i+1):.0f},{Y(hi[i+1]):.0f} {X(i):.0f},{Y(hi[i]):.0f}" fill="{GREEN}" opacity="0.45"/>'
    b += '<polyline points="' + ' '.join(f'{X(i):.0f},{Y(exp[i]):.0f}' for i in range(n)) + f'" fill="none" stroke="{BLACK}" stroke-width="2.5" stroke-dasharray="8,6"/>'
    b += '<polyline points="' + ' '.join(f'{X(i):.0f},{Y(obs[i]):.0f}' for i in range(n)) + f'" fill="none" stroke="{BLACK}" stroke-width="3"/>'
    b += f'<line x1="{x0}" y1="{y0}" x2="{x0+xw}" y2="{y0}" stroke="{INK}" stroke-width="1.5"/>'
    for i in range(0, n, 3): b += t(X(i), y0 + 22, f'{L["month"]} {i+1}', 11, MUTED)
    # annotations
    b += f'<rect x="{X(8)-6}" y="{Y(hi[8])-30}" width="200" height="24" rx="12" fill="{REDBG}" stroke="{RED}"/>'
    b += t(X(8) + 94, Y(hi[8]) - 13, L['below'], 12, RED, weight=700)
    b += f'<rect x="{X(16)}" y="{Y(obs[18])-34}" width="220" height="24" rx="12" fill="{GREENBG}" stroke="{GREEN}"/>'
    b += t(X(16) + 110, Y(obs[18]) - 17, L['above'], 12, GREEN, weight=700)
    b += f'<rect x="{X(1)}" y="{Y(lo[1])+6}" width="230" height="24" rx="12" fill="#FFFFFF" stroke="{MUTED}"/>'
    b += t(X(1) + 115, Y(lo[1]) + 23, L['inside'], 12, MUTED, weight=600)
    # legend
    lx, ly = 120, 410
    b += f'<line x1="{lx}" y1="{ly}" x2="{lx+40}" y2="{ly}" stroke="{BLACK}" stroke-width="3"/>'; b += t(lx + 50, ly + 5, L['obs'], 13, INK, anchor='start')
    b += f'<line x1="{lx+200}" y1="{ly}" x2="{lx+240}" y2="{ly}" stroke="{BLACK}" stroke-width="2.5" stroke-dasharray="8,6"/>'; b += t(lx + 250, ly + 5, L['exp'], 13, INK, anchor='start')
    b += f'<rect x="{lx+400}" y="{ly-9}" width="40" height="18" fill="{BAND}"/>'; b += t(lx + 450, ly + 5, L['band'], 13, INK, anchor='start')
    return b, 440


def gaps(L):
    b = ''
    bars = [(L['full'], 1000, GREY, '#FFFFFF'), (L['asx'], 860, LG, LG), (L['ob'], 700, DG, DG)]
    x0, y0, scale, bw = 140, 330, 0.26, 150
    for i, (lab, v, stroke, fill) in enumerate(bars):
        x = x0 + i * 330; h = v * scale
        b += f'<rect x="{x}" y="{y0-h}" width="{bw}" height="{h}" rx="4" fill="{fill}" stroke="{stroke}" stroke-width="2.5" {"stroke-dasharray=\"6,4\"" if i == 0 else ""}/>'
        b += t(x + bw / 2, y0 - h - 10, f'{v}', 16, INK, weight=700)
        words, lines, cur = lab.split(), [], ''
        for w_ in words:
            if len(cur + ' ' + w_) > 26: lines.append(cur); cur = w_
            else: cur = (cur + ' ' + w_).strip()
        lines.append(cur)
        for k, ln in enumerate(lines[:3]): b += t(x + bw / 2, y0 + 24 + k * 17, ln, 13, INK)
    # gap braces between bars
    def brace(xa, xb, ya, yb, col, head, sub):
        xm = (xa + xb) / 2
        b_ = f'<line x1="{xa+8}" y1="{ya}" x2="{xb-8}" y2="{ya}" stroke="{col}" stroke-width="2" stroke-dasharray="4,4"/>'
        b_ += f'<line x1="{xa+8}" y1="{yb}" x2="{xb-8}" y2="{yb}" stroke="{col}" stroke-width="2" stroke-dasharray="4,4"/>'
        b_ += f'<line x1="{xm}" y1="{ya}" x2="{xm}" y2="{yb}" stroke="{col}" stroke-width="3"/>'
        b_ += f'<rect x="{xm-78}" y="{(ya+yb)/2-24}" width="156" height="46" rx="8" fill="#FFFFFF" stroke="{col}" stroke-width="2"/>'
        b_ += t(xm, (ya + yb) / 2 - 5, head, 14, col, weight=700) + t(xm, (ya + yb) / 2 + 13, sub, 11, MUTED)
        return b_
    b += brace(x0 + bw, x0 + 330, y0 - 1000 * scale, y0 - 860 * scale, NAVY, L['g1'], L['g1b'])
    b += brace(x0 + 330 + bw, x0 + 660, y0 - 860 * scale, y0 - 700 * scale, RED, L['g2'], L['g2b'])
    b += f'<line x1="{x0-20}" y1="{y0}" x2="{x0+660+bw+20}" y2="{y0}" stroke="{INK}" stroke-width="1.5"/>'
    b += f'<rect x="100" y="400" width="1000" height="44" rx="22" fill="{TINT}"/>'
    b += t(600, 427, L['note'], 14, DG, weight=600)
    return b, 460


for lang, L in T.items():
    out = OUT[lang]; out.mkdir(exist_ok=True)
    for name, fn in (('disruption_bayes_two_questions.svg', two_questions), ('disruption_bayes_chart.svg', chart), ('disruption_bayes_gaps.svg', gaps)):
        body, h = fn(L); svg(out / name, body, h); print('wrote', out / name)
