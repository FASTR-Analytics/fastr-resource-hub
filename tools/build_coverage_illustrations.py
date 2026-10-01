"""Generate the pictogram illustrations of the French coverage deck (resources/diagrams_fr/cov_NN_*.svg); one idea per picture, FASTR palette, 1 pictogram = 1 000 people in the cascade."""
import math, pathlib
OUT = pathlib.Path(__file__).resolve().parent.parent / 'resources' / 'diagrams_fr'
DG, G, LG, TINT = '#0A544F', '#0C716B', '#1FA29C', '#E8F4F3'
PLUM, NAVY, RED, REDBG = '#501E50', '#21568C', '#C53030', '#FDE8E8'
INK, MUTED, GREY = '#1A1F1E', '#4A5654', '#C7D1CF'
FONT = "font-family=\"Inter, -apple-system, 'Segoe UI', Roboto, sans-serif\""
W, H = 1200, 560

def person(x, y, s=1.0, fill=DG, outline=False):
    """Pictogram: head + body, anchored at feet centre (x, y)."""
    st = f'fill="none" stroke="{fill}" stroke-width="{3*s}"' if outline else f'fill="{fill}"'
    return (f'<circle cx="{x}" cy="{y-62*s}" r="{14*s}" {st}/>'
            f'<path d="M{x-20*s},{y} v-{30*s} a{20*s},{20*s} 0 0 1 {40*s},0 v{30*s} z" {st}/>')

def child(x, y, fill=LG, outline=False):
    return person(x, y, 0.62, fill, outline)

def pregnant(x, y, fill=PLUM, outline=False):
    st = f'fill="none" stroke="{fill}" stroke-width="3"' if outline else f'fill="{fill}"'
    return (f'<circle cx="{x}" cy="{y-62}" r="14" {st}/>'
            f'<path d="M{x-20},{y} v-30 a20,20 0 0 1 40,0 v30 z" {st}/>'
            f'<circle cx="{x+16}" cy="{y-22}" r="12" {st}/>')

def clinic(x, y, w=160, h=120, label='Centre de santé'):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="#FFFFFF" stroke="{DG}" stroke-width="3"/>'
            f'<polygon points="{x-10},{y} {x+w/2},{y-50} {x+w+10},{y}" fill="{G}"/>'
            f'<rect x="{x+w/2-12}" y="{y+30}" width="24" height="60" fill="{RED}"/>'
            f'<rect x="{x+w/2-30}" y="{y+48}" width="60" height="24" fill="{RED}"/>'
            f'<text x="{x+w/2}" y="{y+h+28}" text-anchor="middle" font-size="16" font-weight="600" fill="{DG}">{label}</text>')

def house(x, y, w=70, h=50, fill='#FFFFFF'):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{DG}" stroke-width="2.5"/>'
            f'<polygon points="{x-6},{y} {x+w/2},{y-34} {x+w+6},{y}" fill="{G}"/>'
            f'<rect x="{x+w/2-9}" y="{y+h-26}" width="18" height="26" fill="{DG}"/>')

def village(x, y, n=5, gap=90):
    return ''.join(house(x+i*gap, y) for i in range(n))

def crowd(x0, y0, cols, rows, kind='person', gap=46, fill=None, outline=False, count=None):
    out = []; k = 0
    for r in range(rows):
        for c in range(cols):
            if count is not None and k >= count: break
            x, y = x0 + c*gap, y0 + r*90
            if kind == 'child': out.append(child(x, y, fill or LG, outline))
            elif kind == 'pregnant': out.append(pregnant(x, y, fill or PLUM, outline))
            else: out.append(person(x, y, 1.0, fill or DG, outline))
            k += 1
    return ''.join(out)

def big(x, y, txt, size=44, fill=DG, anchor='middle', weight=700):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" font-weight="{weight}" fill="{fill}">{txt}</text>'

def t(x, y, txt, size=18, fill=INK, anchor='middle', weight=400):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" font-weight="{weight}" fill="{fill}">{txt}</text>'

def arrow(x1, y1, x2, y2, color=DG, w=3):
    ang = math.atan2(y2-y1, x2-x1); L = 14
    p1 = (x2 - L*math.cos(ang-0.5), y2 - L*math.sin(ang-0.5)); p2 = (x2 - L*math.cos(ang+0.5), y2 - L*math.sin(ang+0.5))
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}" stroke-linecap="round"/>'
            f'<polyline points="{p1[0]:.0f},{p1[1]:.0f} {x2},{y2} {p2[0]:.0f},{p2[1]:.0f}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>')

def qmark(x, y, size=90, fill=RED):
    return f'<text x="{x}" y="{y}" text-anchor="middle" font-size="{size}" font-weight="800" fill="{fill}">?</text>'

def svg(name, body, h=H):
    OUT.joinpath(name).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {h}" {FONT}>{body}</svg>')
    print('wrote', name)

# 1. 4 000 vaccinated: is it a lot?
b = clinic(80, 230, label='Centre de santé du district')
b += crowd(330, 300, 10, 2, 'child', gap=44, count=20)
b += big(540, 170, '4 000 enfants vaccinés cette année', 30, DG)
b += t(540, 205, 'Beaucoup ? Peu ? Impossible de le dire avec ce seul chiffre.', 18, MUTED)
b += t(600, 440, 'Pour répondre, il faut savoir combien d’enfants vivent dans le district.', 20, INK)
b += qmark(1080, 320, 110)
b += t(1080, 380, 'enfants dans le district', 16, MUTED)
svg('cov_01_question.svg', b, 470)

# 2. Where the official number comes from: census then growth then share
b = t(140, 60, 'Il y a dix ans', 18, MUTED, weight=600)
b += village(60, 150, 3, 80)
b += t(165, 240, 'Le recensement compte tout le monde', 16, INK)
b += big(165, 290, '100 000 habitants', 24, DG)
b += arrow(330, 190, 420, 190)
b += t(610, 60, 'Chaque année depuis', 18, MUTED, weight=600)
for i, (yr, v) in enumerate([('+1 an', '103 000'), ('+2 ans', '106 000'), ('+3 ans', '109 000'), ('…', '…')]):
    x = 460 + i*110
    b += f'<rect x="{x}" y="120" width="92" height="150" rx="8" fill="{TINT}" stroke="{DG}" stroke-width="1.5"/>'
    b += t(x+46, 150, yr, 15, MUTED); b += t(x+46, 205, '× 1,03', 18, DG, weight=700); b += t(x+46, 245, v, 15, INK)
b += t(610, 300, 'On fait grossir le chiffre du même pourcentage, partout', 16, INK)
b += arrow(900, 190, 960, 190)
b += t(1070, 60, 'Puis on prend une part', 18, MUTED, weight=600)
b += f'<rect x="980" y="120" width="190" height="150" rx="8" fill="{REDBG}" stroke="{RED}" stroke-width="2"/>'
b += t(1075, 155, '4 % d’enfants', 15, INK); b += t(1075, 178, 'de moins d’un an', 15, INK)
b += big(1075, 225, '5 000', 34, RED); b += t(1075, 252, 'enfants « attendus »', 14, MUTED)
b += t(600, 400, 'C’est ce chiffre, la population cible, qui est inscrit dans DHIS2 et dans les plans.', 20, INK)
b += t(600, 435, 'Il suppose que tout le monde grandit au même rythme et que personne ne déménage.', 17, MUTED)
svg('cov_02_recensement.svg', b, 470)

# 3. People move: two districts
b = t(300, 50, 'District A · près de la mine', 20, DG, weight=700)
b += village(120, 150, 4, 90)
b += crowd(100, 330, 8, 1, 'child', gap=50)
b += t(300, 370, 'Des familles sont arrivées', 16, INK)
b += big(300, 420, '8 000 enfants', 26, DG)
b += t(300, 455, 'la projection en attendait 5 000', 15, MUTED)
b += t(900, 50, 'District B · zone rurale', 20, DG, weight=700)
b += village(760, 150, 4, 90)
b += crowd(800, 330, 3, 1, 'child', gap=50)
b += crowd(950, 330, 5, 1, 'child', gap=50, fill=GREY, outline=True)
b += t(900, 370, 'Des familles sont parties', 16, INK)
b += big(900, 420, '3 000 enfants', 26, DG)
b += t(900, 455, 'la projection en attendait 5 000', 15, MUTED)
# moving family arrow
b += arrow(690, 250, 560, 250, G, 4)
b += person(640, 300, 0.7, G); b += child(665, 300, G)
b += t(625, 320, 'déménagement', 13, MUTED)
svg('cov_03_deplacements.svg', b, 480)

# 4. Result: coverages that mean nothing
def panel(x, title, num, denom, pct, note, color):
    s = f'<rect x="{x}" y="70" width="500" height="330" rx="10" fill="#FFFFFF" stroke="{DG}" stroke-width="2"/>'
    s += t(x+250, 110, title, 20, DG, weight=700)
    s += t(x+250, 160, f'{num} enfants vaccinés', 18, INK)
    s += f'<line x1="{x+120}" y1="178" x2="{x+380}" y2="178" stroke="{DG}" stroke-width="3"/>'
    s += t(x+250, 210, f'{denom} enfants « attendus »', 18, INK)
    s += big(x+250, 290, pct, 54, color)
    s += t(x+250, 340, note, 15, MUTED)
    return s
b = panel(60, 'District A', '4 000', '5 000', '80 %', 'Le vrai chiffre : 4 000 sur 8 000, soit 50 %', RED)
b += panel(640, 'District B', '3 300', '5 000', '110 %', 'Plus de vaccinés que d’enfants ? Le 5 000 est faux.', RED)
b += t(600, 450, 'Les deux districts ont vacciné correctement. Ce sont les « 5 000 » qui sont faux.', 20, INK)
svg('cov_04_resultat.svg', b, 480)

# 5. The idea: ask the services. Clinic sees most pregnant women.
b = clinic(100, 220, 180, 130, label='Centre de santé')
b += crowd(360, 330, 10, 1, 'pregnant', gap=56, count=8)
b += crowd(920, 330, 2, 1, 'pregnant', gap=56, fill=PLUM, outline=True)
b += f'<rect x="330" y="140" width="520" height="40" rx="20" fill="{TINT}"/>'
b += t(590, 167, 'La plupart des femmes enceintes passent par le centre de santé', 16, DG, weight=600)
b += t(590, 390, '8 femmes sur 10 viennent en consultation prénatale', 20, PLUM, weight=700)
b += t(975, 390, '2 ne viennent pas', 16, MUTED)
b += t(600, 460, 'Le centre de santé « voit » presque tout le monde. C’est là que FASTR va compter.', 20, INK)
svg('cov_05_idee.svg', b, 500)

# 6. Survey: 8 out of 10
b = t(600, 60, 'L’enquête ménages demande à chaque femme : « êtes-vous allée en consultation prénatale ? »', 19, INK)
b += crowd(330, 230, 10, 1, 'pregnant', gap=60, count=8)
b += crowd(810, 230, 2, 1, 'pregnant', gap=60, fill=PLUM, outline=True)
b += f'<rect x="300" y="250" width="470" height="6" rx="3" fill="{PLUM}"/>'
b += t(535, 290, '8 ont répondu oui', 20, PLUM, weight=700)
b += f'<rect x="790" y="250" width="100" height="6" rx="3" fill="{GREY}"/>'
b += t(840, 290, '2 ont répondu non', 16, MUTED)
b += big(600, 380, 'Sur 10 femmes enceintes, 8 viennent.', 30, DG)
b += t(600, 420, 'Ce chiffre vaut pour tout le pays et toutes les femmes, vues ou non. Une enquête tous les cinq ans.', 16, MUTED)
svg('cov_06_enquete.svg', b, 460)

# 7. DHIS2: 8 000 came
b = clinic(80, 200, 170, 125, label='Centre de santé')
b += f'<rect x="330" y="150" width="400" height="200" rx="10" fill="#EDF1F7" stroke="{NAVY}" stroke-width="2"/>'
b += t(530, 185, 'Registre DHIS2 · cette année', 16, NAVY, weight=600)
b += big(530, 265, '8 000', 54, NAVY)
b += t(530, 305, 'premières consultations prénatales', 17, INK)
b += t(530, 330, 'comptées une par une, chaque mois', 14, MUTED)
b += crowd(800, 300, 8, 1, 'pregnant', gap=48)
b += t(968, 340, 'Ce sont les « 8 sur 10 » : celles qui sont venues', 15, MUTED)
b += t(600, 430, 'DHIS2 compte les femmes vues. Il ne peut pas compter celles qui ne sont pas venues.', 20, INK)
svg('cov_07_dhis2.svg', b, 470)

# 8. The reasoning: 8 seen -> 2 unseen, so 8 000 seen -> 2 000 unseen
b = t(600, 50, 'Si 8 femmes vues vont avec 2 femmes non vues…', 22, DG, weight=700)
b += crowd(300, 160, 8, 1, 'pregnant', gap=52)
b += t(480, 190, '8 vues', 16, PLUM, weight=600)
b += crowd(760, 160, 2, 1, 'pregnant', gap=52, outline=True)
b += t(785, 190, '2 non vues', 16, MUTED, weight=600)
b += t(600, 240, '… alors 8 000 femmes vues vont avec 2 000 femmes non vues.', 22, DG, weight=700)
b += f'<rect x="200" y="280" width="560" height="110" rx="10" fill="#EDF1F7" stroke="{NAVY}" stroke-width="2"/>'
b += big(480, 335, '8 000', 40, NAVY); b += t(480, 372, 'vues au centre de santé (DHIS2)', 15, INK)
b += t(790, 345, '+', 40, DG, weight=700)
b += f'<rect x="820" y="280" width="200" height="110" rx="10" fill="#FFFFFF" stroke="{PLUM}" stroke-width="2" stroke-dasharray="6,4"/>'
b += big(920, 335, '2 000', 40, PLUM); b += t(920, 372, 'non vues', 15, INK)
b += f'<rect x="300" y="420" width="600" height="80" rx="10" fill="{TINT}" stroke="{DG}" stroke-width="2"/>'
b += big(600, 470, '= 10 000 femmes enceintes dans le district', 26, DG)
b += t(600, 535, 'Les 2 000 non vues sont déduites des 8 000 vues. Personne ne les a comptées, et pourtant on les a.', 16, MUTED)
svg('cov_08_raisonnement.svg', b, 560)

# 9. Same thing written as a division
b = f'<rect x="150" y="110" width="900" height="130" rx="10" fill="#FFFFFF" stroke="{DG}" stroke-width="2"/>'
b += t(300, 160, '« 8 sur 10 »', 20, PLUM, weight=600); b += t(300, 195, 's’écrit 0,80', 18, INK)
b += t(600, 160, '8 000 ÷ 0,80', 26, DG, weight=700); b += t(600, 195, 'femmes vues ÷ part des femmes vues', 15, MUTED)
b += t(900, 160, '= 10 000', 26, DG, weight=700); b += t(900, 195, 'toutes les femmes enceintes', 15, MUTED)
b += t(600, 300, 'Diviser par 0,80, c’est la même chose que multiplier par 10 et diviser par 8 :', 18, INK)
b += t(600, 335, '8 000 × 10 ÷ 8 = 10 000', 24, DG, weight=700)
b += t(600, 420, 'Vous n’avez pas besoin de faire ce calcul. FASTR le fait pour chaque district et chaque année.', 17, MUTED)
svg('cov_09_division.svg', b, 460)

# 10. From pregnancies to children to vaccinate (cascade as pictograms)
steps = [('10 000', 'grossesses', 10), ('9 700', 'accouchements', 10), ('9 580', 'naissances vivantes', 10), ('9 200', 'enfants à vacciner', 9)]
labels = ['− 3 % de grossesses perdues', '− 2 % de mort-nés (+ jumeaux)', '− 4 % de décès avant 1 mois']
for i, (n, lab, cnt) in enumerate(steps):
    x = 60 + i*295
    col = PLUM if i == 0 else (DG if i < 3 else LG)
    for k in range(10):
        px, py = x + (k % 5)*44, 190 + (k // 5)*80
        if k < cnt: b_ = (pregnant(px, py, PLUM) if i == 0 else (child(px, py, col) if i == 3 else person(px, py, 0.62, col)))
        else: b_ = child(px, py, GREY, outline=True)
        b = (b if i or k else '') + b_ if (i or k) else b_
    b += big(x+88, 300, n, 30, DG); b += t(x+88, 328, lab, 15, INK)
    if i < 3:
        b += arrow(x+205, 230, x+275, 230)
        b += t(x+240, 370, labels[i], 13, MUTED)
b += t(600, 60, 'Toutes les grossesses ne donnent pas un enfant à vacciner', 22, DG, weight=700)
b += t(600, 95, 'La démographie dit combien on en perd à chaque étape. Ces taux sont ceux du pays.', 17, MUTED)
b += t(600, 430, 'Chaque pictogramme vaut 1 000 personnes. Le district a 9 200 enfants à vacciner, pas 5 000.', 17, INK)
svg('cov_10_cascade.svg', b, 470)

# 11. Coverage: 4 000 / 9 200 = 43 %
b = f'<rect x="80" y="80" width="480" height="300" rx="10" fill="{REDBG}" stroke="{RED}" stroke-width="2"/>'
b += t(320, 120, 'Avec la projection du recensement', 18, RED, weight=700)
b += t(320, 170, '4 000 enfants vaccinés', 18, INK)
b += f'<line x1="170" y1="188" x2="470" y2="188" stroke="{RED}" stroke-width="3"/>'
b += t(320, 220, '5 000 enfants « attendus »', 18, INK)
b += big(320, 300, '80 %', 56, RED)
b += t(320, 350, 'On croit que le district a presque fini.', 15, MUTED)
b += f'<rect x="640" y="80" width="480" height="300" rx="10" fill="{TINT}" stroke="{DG}" stroke-width="2"/>'
b += t(880, 120, 'Avec le comptage FASTR', 18, DG, weight=700)
b += t(880, 170, '4 000 enfants vaccinés', 18, INK)
b += f'<line x1="730" y1="188" x2="1030" y2="188" stroke="{DG}" stroke-width="3"/>'
b += t(880, 220, '9 200 enfants qui sont vraiment là', 18, INK)
b += big(880, 300, '43 %', 56, DG)
b += t(880, 350, 'Plus de la moitié des enfants restent à vacciner.', 15, MUTED)
b += t(600, 440, 'Mêmes 4 000 enfants vaccinés. La décision à prendre n’est pas du tout la même.', 20, INK)
svg('cov_11_couverture.svg', b, 480)
