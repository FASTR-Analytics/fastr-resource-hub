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
b += big(165, 290, '93 000 habitants', 24, DG)
b += arrow(330, 190, 420, 190)
b += t(610, 60, 'Chaque année depuis', 18, MUTED, weight=600)
for i, (yr, v) in enumerate([('+1 an', '95 800'), ('+2 ans', '98 700'), ('…', '…'), ('+10 ans', '125 000')]):
    x = 460 + i*110
    b += f'<rect x="{x}" y="120" width="92" height="150" rx="8" fill="{TINT}" stroke="{DG}" stroke-width="1.5"/>'
    b += t(x+46, 150, yr, 15, MUTED); b += t(x+46, 205, '× 1,03', 18, DG, weight=700); b += t(x+46, 245, v, 15, INK)
b += t(610, 300, 'On fait grossir le chiffre de 3 % par an, partout. Dix ans plus tard : 125 000.', 16, INK)
b += arrow(900, 190, 960, 190)
b += t(1070, 60, 'Puis on prend une part', 18, MUTED, weight=600)
b += f'<rect x="980" y="120" width="190" height="150" rx="8" fill="{REDBG}" stroke="{RED}" stroke-width="2"/>'
b += t(1075, 155, '4 % de 125 000', 15, INK); b += t(1075, 178, 'ont moins d’un an', 15, INK)
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
b = t(600, 40, 'Si 8 femmes vues vont avec 2 femmes non vues…', 22, DG, weight=700)
b += crowd(300, 135, 8, 1, 'pregnant', gap=52)
b += t(480, 165, '8 vues', 16, PLUM, weight=600)
b += crowd(760, 135, 2, 1, 'pregnant', gap=52, outline=True)
b += t(785, 165, '2 non vues', 16, MUTED, weight=600)
b += t(600, 210, '… alors 8 000 femmes vues vont avec 2 000 femmes non vues.', 22, DG, weight=700)
b += f'<rect x="200" y="240" width="560" height="100" rx="10" fill="#EDF1F7" stroke="{NAVY}" stroke-width="2"/>'
b += big(480, 290, '8 000', 40, NAVY); b += t(480, 325, 'vues au centre de santé (DHIS2)', 15, INK)
b += t(790, 300, '+', 40, DG, weight=700)
b += f'<rect x="820" y="240" width="200" height="100" rx="10" fill="#FFFFFF" stroke="{PLUM}" stroke-width="2" stroke-dasharray="6,4"/>'
b += big(920, 290, '2 000', 40, PLUM); b += t(920, 325, 'non vues', 15, INK)
b += f'<rect x="300" y="365" width="600" height="72" rx="10" fill="{TINT}" stroke="{DG}" stroke-width="2"/>'
b += big(600, 411, '= 10 000 femmes enceintes dans le district', 26, DG)
b += t(600, 478, 'Les 2 000 non vues sont déduites des 8 000 vues. Personne ne les a comptées, et pourtant on les a.', 16, MUTED)
svg('cov_08_raisonnement.svg', b, 500)

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
labels = [('− 3 %', 'grossesses perdues'), ('− 2 %', 'mort-nés (+ jumeaux)'), ('− 4 %', 'décès avant 1 mois')]
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
        rate, what = labels[i]
        b += f'<rect x="{x+204}" y="196" width="74" height="32" rx="16" fill="{REDBG}" stroke="{RED}" stroke-width="2"/>'
        b += t(x+241, 218, rate, 16, RED, weight=800)
        b += arrow(x+208, 252, x+274, 252)
        b += t(x+241, 372, what, 12, RED, weight=600)
b += t(600, 60, 'Toutes les grossesses ne donnent pas un enfant à vacciner', 22, DG, weight=700)
b += t(600, 95, 'À chaque étape, on en perd une part. Ces taux en rouge sont des taux démographiques : ils changent d’un pays à l’autre.', 17, MUTED)
b += t(600, 430, 'Chaque pictogramme vaut 1 000 personnes. Le district a 9 200 enfants à vacciner, pas 5 000.', 17, INK)
svg('cov_10_cascade.svg', b, 470)

# 10b. The five rates: defaults vs your country
b = t(600, 48, 'FASTR est livré avec des valeurs par défaut. Elles ne sont pas celles de votre pays.', 20, DG, weight=700)
rates = [('Perte de grossesse', '3 %', 'enquêtes, littérature'), ('Jumeaux', '1,5 %', 'EDS'), ('Mortinatalité', '20 ‰', 'ONU IGME'), ('Mortalité néonatale', '39 ‰', 'EDS, ONU IGME'), ('Mortalité post-néonatale', '28 ‰', 'EDS, ONU IGME')]
for i, (name, default, src) in enumerate(rates):
    x = 40 + i*228
    b += f'<rect x="{x}" y="85" width="212" height="300" rx="12" fill="#FFFFFF" stroke="{DG}" stroke-width="2"/>'
    b += f'<rect x="{x}" y="85" width="212" height="46" rx="12" fill="{DG}"/><rect x="{x}" y="110" width="212" height="21" fill="{DG}"/>'
    b += t(x+106, 116, name, 14, '#FFFFFF', weight=700)
    b += t(x+106, 162, 'valeur par défaut', 12, MUTED)
    b += big(x+106, 206, default, 36, MUTED)
    b += f'<line x1="{x+30}" y1="232" x2="{x+182}" y2="232" stroke="#E4E7E5" stroke-width="2"/>'
    b += t(x+106, 262, 'votre pays', 12, RED, weight=700)
    b += f'<rect x="{x+36}" y="276" width="140" height="48" rx="8" fill="{REDBG}" stroke="{RED}" stroke-width="2" stroke-dasharray="7,5"/>'
    b += big(x+106, 310, '?', 34, RED)
    b += t(x+106, 360, f'source : {src}', 12, MUTED)
b += f'<rect x="150" y="410" width="900" height="44" rx="22" fill="{TINT}"/>'
b += t(600, 437, 'Dans la plateforme : Résultats → Paramètres par défaut des modules. Un taux modifié s’applique au prochain paquet de résultats.', 15, DG, weight=600)
svg('cov_10b_taux_pays.svg', b, 480)

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


# ───────────────────────── Part 3: what the platform does ─────────────────────────

# 12. Overview: the four steps as a path
b = ''
stepsP3 = [('1', 'Compter à partir', 'd’un service', 'CPN1 ÷ enquête', PLUM),
           ('2', 'Déduire les autres', 'populations', 'la cascade', DG),
           ('3', 'Choisir la chaîne', 'la plus crédible', 'contre l’ONU', NAVY),
           ('4', 'Calculer et', 'prolonger', 'couverture + enquête', G)]
for i, (n, l1, l2, l3, col) in enumerate(stepsP3):
    x = 70 + i*290
    b += f'<circle cx="{x+110}" cy="150" r="46" fill="{col}"/>'
    b += big(x+110, 166, n, 40, '#FFFFFF')
    b += t(x+110, 235, l1, 18, INK, weight=600); b += t(x+110, 260, l2, 18, INK, weight=600)
    b += t(x+110, 292, l3, 15, MUTED)
    if i < 3: b += arrow(x+170, 150, x+230, 150)
b += f'<rect x="90" y="340" width="520" height="40" rx="20" fill="{TINT}"/>'
b += t(350, 366, 'Module « Dénominateurs de couverture » : étapes 1 à 3', 15, DG, weight=600)
b += f'<rect x="700" y="340" width="420" height="40" rx="20" fill="{TINT}"/>'
b += t(910, 366, 'Module « Estimations de couverture » : étape 4', 15, DG, weight=600)
b += t(600, 440, 'Tout cela tourne quand on génère un paquet de résultats. Personne ne fait les calculs à la main.', 17, MUTED)
svg('cov_12_quatre_etapes.svg', b, 470)

# 13. Four entry points, four chains: a ladder with four rungs
levels = [('grossesses', PLUM), ('accouchements', DG), ('naissances vivantes', DG), ('enfants à vacciner', LG)]
ys = [110, 200, 290, 380]
b = ''
for (lab, col), y in zip(levels, ys):
    b += f'<rect x="60" y="{y}" width="250" height="56" rx="10" fill="{col}"/>'
    b += t(185, y+34, lab, 17, '#FFFFFF', weight=700)
for y1, y2 in zip(ys, ys[1:]):
    b += arrow(150, y1+60, 150, y2-4, DG); b += arrow(220, y2-4, 220, y1+60, DG)
b += t(150, 462, '× taux : on descend', 13, MUTED); b += t(220, 480, '÷ taux : on remonte', 13, MUTED)
entries = [('CPN1', '8 000 consultations', '÷ 80 % viennent', '10 000', 0, PLUM),
           ('Accouchements', '6 200 en établissement', '÷ 65 % y accouchent', '9 540', 2, DG),
           ('BCG', '8 600 doses', '÷ 88 % vaccinés', '9 770', 2, DG),
           ('Penta1', '7 800 doses', '÷ 85 % vaccinés', '9 180', 3, LG)]
rows_y = [110, 245, 305, 380]
for (svc, cnt, share, res, lvl, col), y in zip(entries, rows_y):
    b += f'<rect x="420" y="{y}" width="720" height="50" rx="10" fill="#FFFFFF" stroke="{col}" stroke-width="2"/>'
    b += f'<rect x="420" y="{y}" width="150" height="50" rx="10" fill="{col}"/><rect x="560" y="{y}" width="10" height="50" fill="{col}"/>'
    b += t(495, y+31, svc, 16, '#FFFFFF', weight=700)
    b += t(690, y+31, cnt, 15, INK, anchor='middle')
    b += t(870, y+31, share, 15, INK, anchor='middle')
    b += t(1070, y+31, f'= {res}', 18, col, weight=800)
    b += arrow(418, y+25, 316, ys[lvl]+28, col, 2.5)
b += t(600, 50, 'Chaque service mesuré par l’enquête donne un chiffre à un étage. La cascade remplit les autres étages.', 19, DG, weight=700)
b += t(780, 80, 'DHIS2', 12, MUTED, weight=600); b += t(870, 80, 'enquête', 12, MUTED, weight=600); b += t(1070, 80, 'population', 12, MUTED, weight=600)
b += t(780, 475, 'Quatre points de départ, quatre chaînes complètes : quatre réponses à la question « combien de personnes ? ».', 15, INK)
svg('cov_13_quatre_chaines.svg', b, 500)

# 14. Choose the chain: compare to the UN estimate
b = t(600, 50, 'Au niveau national, on compare chaque chaîne à l’estimation de l’ONU', 20, DG, weight=700)
ref = 10000
bars = [('ONU', 10000, GREY), ('CPN1', 11500, PLUM), ('Accouchements', 10300, DG), ('Penta1', 8700, LG)]
base_y, scale = 330, 0.02
for i, (lab, v, col) in enumerate(bars):
    x = 170 + i*230; h = v*scale
    b += f'<rect x="{x}" y="{base_y-h}" width="110" height="{h}" rx="4" fill="{col}"/>'
    b += t(x+55, base_y+28, lab, 16, INK, weight=600)
    b += t(x+55, base_y-h+26, f'{v:,}'.replace(',', ' '), 16, INK if col == GREY else '#FFFFFF', weight=700)
    if i:
        ratio = v/ref
        b += t(x+55, base_y+54, f'{ratio:.2f} × ONU', 14, MUTED)
b += f'<line x1="130" y1="{base_y}" x2="1070" y2="{base_y}" stroke="{DG}" stroke-width="2"/>'
b += f'<line x1="130" y1="{base_y-ref*scale}" x2="1070" y2="{base_y-ref*scale}" stroke="{MUTED}" stroke-width="1.5" stroke-dasharray="8,6"/>'
b += f'<rect x="{170+2*230-8}" y="{base_y-10300*scale-40}" width="126" height="{10300*scale+100}" rx="10" fill="none" stroke="{DG}" stroke-width="3" stroke-dasharray="10,6"/>'
b += t(600, 440, 'La chaîne la plus proche de l’ONU est retenue : ici les accouchements, à 1,03. Une seule chaîne pour tous les indicateurs et tous les districts.', 16, INK)
b += t(600, 470, 'L’ONU n’est pas « la vérité » : c’est un repère indépendant pour départager les chaînes. La chaîne BCG, nationale seulement, ne participe pas au choix automatique.', 14, MUTED)
svg('cov_14_choix_chaine.svg', b, 500)

# 15. Coverage per year, per district: volume / denominator
b = t(600, 50, 'Pour chaque indicateur, chaque année, chaque district', 20, DG, weight=700)
years = [('2021', 4000, 9200), ('2022', 4600, 9400), ('2023', 5300, 9600)]
for i, (yr, num, den) in enumerate(years):
    x = 150 + i*330
    b += f'<rect x="{x}" y="90" width="260" height="280" rx="10" fill="#FFFFFF" stroke="{DG}" stroke-width="2"/>'
    b += t(x+130, 125, yr, 20, DG, weight=700)
    b += t(x+130, 170, f'{num:,}'.replace(',', ' ') + ' vaccinés', 17, NAVY, weight=600)
    b += t(x+130, 192, 'volume SNIS corrigé', 13, MUTED)
    b += f'<line x1="{x+50}" y1="208" x2="{x+210}" y2="208" stroke="{DG}" stroke-width="3"/>'
    b += t(x+130, 238, f'{den:,}'.replace(',', ' ') + ' enfants', 17, DG, weight=600)
    b += t(x+130, 260, 'dénominateur de la chaîne', 13, MUTED)
    b += big(x+130, 330, f'{round(100*num/den)} %', 40, DG)
b += t(600, 420, 'Le volume est celui corrigé des valeurs aberrantes par le module d’ajustement.', 16, INK)
b += t(600, 450, 'La couverture n’est pas plafonnée : au-dessus de 100 %, c’est le dénominateur qu’il faut regarder.', 15, MUTED)
svg('cov_15_couverture_annees.svg', b, 480)

# 16. Prolong the last survey with the HMIS trend (chart)
b = t(600, 46, 'L’enquête donne le niveau, le SNIS donne la tendance', 20, DG, weight=700)
x0, y0, xw, yh = 160, 360, 820, 240   # plot area: y 120..360 for 60..100%
def X(i): return x0 + i*xw/3
def Y(p): return y0 - (p-60)/40*yh
for p in (60, 70, 80, 90, 100):
    b += f'<line x1="{x0}" y1="{Y(p)}" x2="{x0+xw}" y2="{Y(p)}" stroke="#E4E7E5" stroke-width="1"/>'
    b += t(x0-14, Y(p)+5, f'{p} %', 13, MUTED, anchor='end')
for i, yr in enumerate(['2020', '2021', '2022', '2023']):
    b += t(X(i), y0+26, yr, 14, MUTED)
hmis = [78, 80, 83, 85]
pts = ' '.join(f'{X(i)},{Y(v)}' for i, v in enumerate(hmis))
b += f'<polyline points="{pts}" fill="none" stroke="{NAVY}" stroke-width="3"/>'
for i, v in enumerate(hmis): b += f'<circle cx="{X(i)}" cy="{Y(v)}" r="5" fill="{NAVY}"/>'
b += t(X(3)+16, Y(85)+20, 'SNIS 85 %', 13, NAVY, anchor='start', weight=600)
# survey point 2021 = 82
b += f'<rect x="{X(1)-9}" y="{Y(82)-9}" width="18" height="18" fill="{PLUM}" transform="rotate(45 {X(1)} {Y(82)})"/>'
b += t(X(1)-16, Y(82)-16, 'Enquête 82 %', 13, PLUM, anchor='end', weight=600)
proj = [(1, 82), (2, 85), (3, 87)]
ppts = ' '.join(f'{X(i)},{Y(v)}' for i, v in proj)
b += f'<polyline points="{ppts}" fill="none" stroke="{PLUM}" stroke-width="3" stroke-dasharray="9,6"/>'
for i, v in proj[1:]: b += f'<circle cx="{X(i)}" cy="{Y(v)}" r="5" fill="#FFFFFF" stroke="{PLUM}" stroke-width="3"/>'
b += t(X(3)+16, Y(87)+5, 'Projection 87 %', 13, PLUM, anchor='start', weight=600)
# deltas annotations
b += t(X(1)+ (X(2)-X(1))/2, Y(81)+40, '+3', 14, NAVY, weight=700)
b += t(X(2)+ (X(3)-X(2))/2, Y(84)+40, '+2', 14, NAVY, weight=700)
b += t(600, 440, 'Le SNIS monte de 3 points puis de 2. On part de l’enquête (82 %) et on ajoute les mêmes points : 85 %, puis 87 %.', 16, INK)
b += t(600, 468, 'Quand une nouvelle enquête arrive, la projection repart de sa valeur.', 14, MUTED)
svg('cov_16_projection.svg', b, 490)

# 17. Reading the chart: three series, which to look at
b = f'<rect x="60" y="70" width="340" height="150" rx="10" fill="#FFFFFF" stroke="{NAVY}" stroke-width="2"/>'
b += f'<line x1="90" y1="120" x2="170" y2="120" stroke="{NAVY}" stroke-width="4"/><circle cx="130" cy="120" r="5" fill="{NAVY}"/>'
b += t(285, 112, 'Couverture SNIS', 18, NAVY, weight=700, anchor='middle')
b += t(230, 160, 'chaque année, chaque district', 14, INK)
b += t(230, 185, 'volume corrigé ÷ dénominateur', 14, MUTED)
b += f'<rect x="430" y="70" width="340" height="150" rx="10" fill="#FFFFFF" stroke="{PLUM}" stroke-width="2"/>'
b += f'<rect x="491" y="111" width="18" height="18" fill="{PLUM}" transform="rotate(45 500 120)"/>'
b += t(655, 112, 'Point d’enquête', 18, PLUM, weight=700)
b += t(600, 160, 'les années où il y a une EDS ou MICS', 14, INK)
b += t(600, 185, 'la mesure de référence', 14, MUTED)
b += f'<rect x="800" y="70" width="340" height="150" rx="10" fill="#FFFFFF" stroke="{PLUM}" stroke-width="2"/>'
b += f'<line x1="830" y1="120" x2="910" y2="120" stroke="{PLUM}" stroke-width="4" stroke-dasharray="9,6"/>'
b += t(1025, 112, 'Projection', 18, PLUM, weight=700)
b += t(970, 160, 'l’enquête prolongée par le SNIS', 14, INK)
b += t(970, 185, 'national et régions', 14, MUTED)
b += f'<rect x="60" y="260" width="520" height="150" rx="10" fill="{TINT}"/>'
b += t(320, 300, 'Pour voir la tendance', 18, DG, weight=700)
b += t(320, 335, 'regardez la couverture SNIS :', 16, INK)
b += t(320, 360, 'disponible chaque année et par district', 16, INK)
b += f'<rect x="620" y="260" width="520" height="150" rx="10" fill="{TINT}"/>'
b += t(880, 300, 'Pour voir le niveau', 18, DG, weight=700)
b += t(880, 335, 'regardez la projection :', 16, INK)
b += t(880, 360, 'calée sur la dernière enquête', 16, INK)
b += t(600, 460, 'Si les deux séries s’écartent beaucoup, c’est le dénominateur qu’il faut questionner avant les services.', 16, MUTED)
svg('cov_17_lire_graphique.svg', b, 490)

# 18. Three screens in the platform, in order
b = ''
screens = [('1', 'Régler', 'Menu Résultats', 'Paramètres par défaut des modules', ['les 5 taux du pays', 'niveau : national, région, district', 'chaîne : « auto »'], DG),
           ('2', 'Générer', 'Menu Résultats', 'Générer un nouveau paquet', ['cocher les 2 modules de couverture', 'l’ajustement qualité est requis', 'attendre « Prêt », puis épingler'], NAVY),
           ('3', 'Lire', 'Dans le projet', 'Visualisations', ['Séries temporelles de couverture', 'national, région, district', 'Couverture (SNIS uniquement)'], G)]
for i, (n, verb, where, title, items, col) in enumerate(screens):
    x = 60 + i*380
    b += f'<rect x="{x}" y="60" width="340" height="360" rx="12" fill="#FFFFFF" stroke="{col}" stroke-width="2.5"/>'
    b += f'<rect x="{x}" y="60" width="340" height="56" rx="12" fill="{col}"/>'
    b += f'<rect x="{x}" y="90" width="340" height="26" fill="{col}"/>'
    b += t(x+30, 96, n, 24, '#FFFFFF', anchor='start', weight=800)
    b += t(x+70, 96, verb, 22, '#FFFFFF', anchor='start', weight=700)
    b += t(x+170, 150, where, 13, MUTED)
    b += t(x+170, 178, title, 17, INK, weight=700)
    # fake window
    b += f'<rect x="{x+30}" y="200" width="280" height="150" rx="6" fill="#F7F8F7" stroke="#D9E0DE"/>'
    b += f'<rect x="{x+30}" y="200" width="280" height="22" rx="6" fill="#E4E7E5"/>'
    for k, it in enumerate(items):
        b += f'<circle cx="{x+52}" cy="{245+k*36}" r="5" fill="{col}"/>'
        b += t(x+66, 250+k*36, it, 13, INK, anchor='start')
    b += t(x+170, 395, ['une fois par pays', 'à chaque mise à jour des données', 'à chaque revue'][i], 13, MUTED)
    if i < 2: b += arrow(x+345, 240, x+375, 240)
svg('cov_18_plateforme.svg', b, 450)
