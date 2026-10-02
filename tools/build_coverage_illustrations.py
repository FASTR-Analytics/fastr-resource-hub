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

# 1. 4 000 vaccinated: what coverage is that? The fraction with an unknown bottom
b = clinic(70, 120, 150, 110, label='Centre de santé de la province')
b += arrow(235, 180, 290, 180, DG)
b += f'<rect x="300" y="90" width="520" height="110" rx="10" fill="#EDF1F7" stroke="{NAVY}" stroke-width="2"/>'
b += big(560, 140, '4 000', 40, NAVY); b += t(560, 178, 'enfants vaccinés cette année, comptés dans DHIS2', 15, INK)
b += f'<line x1="300" y1="225" x2="820" y2="225" stroke="{DG}" stroke-width="4"/>'
b += f'<rect x="300" y="250" width="520" height="110" rx="10" fill="{REDBG}" stroke="{RED}" stroke-width="2" stroke-dasharray="8,5"/>'
b += qmark(560, 325, 70)
b += t(560, 350, 'enfants qui devaient être vaccinés dans la province', 15, INK)
b += t(870, 235, '=', 44, DG, weight=700)
b += qmark(1040, 255, 90, DG)
b += t(1040, 290, 'de couverture', 18, INK)
b += t(600, 430, 'Le chiffre du haut, on l’a. Pour le chiffre du bas, on utilise aujourd’hui une estimation. D’où vient-elle ?', 18, INK)
svg('cov_01_question.svg', b, 460)

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

# 3. People move: two provinces
b = t(300, 50, 'Province A · près de la mine', 20, DG, weight=700)
b += village(120, 150, 4, 90)
b += crowd(80, 330, 9, 1, 'child', gap=50)
b += t(300, 370, 'Des familles sont arrivées', 16, INK)
b += big(300, 420, '9 200 enfants en réalité', 26, DG)
b += t(300, 455, 'la projection du recensement en attendait 5 000', 15, MUTED)
b += t(900, 50, 'Province B · zone rurale', 20, DG, weight=700)
b += village(760, 150, 4, 90)
b += crowd(850, 330, 3, 1, 'child', gap=50)
b += t(900, 370, 'Des familles sont parties', 16, INK)
b += big(900, 420, '3 000 enfants en réalité', 26, DG)
b += t(900, 455, 'la projection du recensement en attendait 5 000', 15, MUTED)
# moving family arrow
b += arrow(690, 250, 560, 250, G, 4)
b += person(640, 300, 0.7, G); b += child(665, 300, G)
b += t(625, 320, 'déménagement', 13, MUTED)
svg('cov_03_deplacements.svg', b, 480)

# 4. Result: the projected 5 000 is used as the bottom number in both provinces
b = f'<rect x="60" y="30" width="1080" height="54" rx="10" fill="{REDBG}" stroke="{RED}" stroke-width="2"/>'
b += t(600, 64, 'Le chiffre du bas vient de la projection du recensement : 5 000 enfants, le même chiffre dans les deux provinces', 17, RED, weight=700)
def panel(x, title, num, real, pct_off, pct_real, verdict_off, verdict_real):
    s = f'<rect x="{x}" y="105" width="520" height="300" rx="10" fill="#FFFFFF" stroke="{DG}" stroke-width="2"/>'
    s += t(x+260, 140, title, 20, DG, weight=700)
    # official
    s += t(x+130, 175, 'ce que dit le tableau de bord', 12, MUTED)
    s += t(x+130, 205, f'{num} vaccinés', 16, INK)
    s += f'<line x1="{x+40}" y1="218" x2="{x+220}" y2="218" stroke="{RED}" stroke-width="3"/>'
    s += t(x+130, 242, '5 000 « attendus »', 16, RED, weight=700)
    s += t(x+130, 262, 'projection du recensement', 11, RED)
    s += big(x+130, 320, pct_off, 44, RED)
    s += t(x+130, 352, verdict_off, 13, MUTED)
    s += f'<line x1="{x+260}" y1="170" x2="{x+260}" y2="370" stroke="#E4E7E5" stroke-width="2"/>'
    # real
    s += t(x+390, 175, 'avec le vrai nombre d’enfants', 12, MUTED)
    s += t(x+390, 205, f'{num} vaccinés', 16, INK)
    s += f'<line x1="{x+300}" y1="218" x2="{x+480}" y2="218" stroke="{DG}" stroke-width="3"/>'
    s += t(x+390, 242, f'{real} enfants', 16, DG, weight=700)
    s += t(x+390, 262, 'qui vivent vraiment là', 11, DG)
    s += big(x+390, 320, pct_real, 44, DG)
    s += t(x+390, 352, verdict_real, 13, MUTED)
    return s
b += panel(60, 'Province A', '4 000', '9 200', '80 %', '43 %', 'on croit avoir presque fini', 'plus de la moitié restent à vacciner')
b += panel(620, 'Province B', '2 700', '3 000', '54 %', '90 %', 'on croit être très en retard', 'presque tout le monde est vacciné')
b += t(600, 445, 'Les vaccinations sont bien comptées. C’est le 5 000 qui est faux, et il trompe dans les deux sens.', 18, INK, weight=600)
svg('cov_04_resultat.svg', b, 470)

# 5. The idea: combine two sources we already have, the survey and DHIS2
b = t(600, 40, 'On a déjà deux sources. Chacune dit une moitié de la réponse.', 20, DG, weight=700)
# survey box
b += f'<rect x="60" y="80" width="470" height="285" rx="12" fill="#F4ECF4" stroke="{PLUM}" stroke-width="2"/>'
b += t(295, 115, 'L’enquête (EDS, MICS)', 19, PLUM, weight=700)
b += t(295, 140, 'va voir les familles chez elles, vues ou non par le centre', 13, MUTED)
b += crowd(120, 238, 8, 1, 'pregnant', gap=40)
b += crowd(445, 238, 2, 1, 'pregnant', gap=40, fill=PLUM, outline=True)
b += t(295, 282, 'Elle dit la PART qui vient au centre de santé', 15, INK, weight=600)
b += big(295, 322, '8 sur 10', 30, PLUM)
b += t(295, 348, 'mais pas combien elles sont en tout', 12, MUTED)
# plus
b += t(600, 245, '+', 54, DG, weight=700)
# dhis2 box
b += f'<rect x="670" y="80" width="470" height="285" rx="12" fill="#EDF1F7" stroke="{NAVY}" stroke-width="2"/>'
b += t(905, 115, 'DHIS2', 19, NAVY, weight=700)
b += t(905, 140, 'le registre du centre de santé, chaque mois', 13, MUTED)
b += '<g transform="translate(778 194) scale(0.5)">' + clinic(0, 50, 120, 80, label='') + '</g>'
b += arrow(860, 236, 915, 236, NAVY)
b += crowd(935, 238, 4, 1, 'pregnant', gap=40, fill=NAVY)
b += t(905, 282, 'Il dit COMBIEN sont venues', 15, INK, weight=600)
b += big(905, 322, '8 000', 30, NAVY)
b += t(905, 348, 'mais rien sur celles qui ne sont pas venues', 12, MUTED)
b += f'<rect x="250" y="392" width="700" height="46" rx="23" fill="{TINT}" stroke="{DG}" stroke-width="2"/>'
b += t(600, 421, 'Ensemble, elles donnent le total : combien de femmes enceintes il y a vraiment', 16, DG, weight=700)
b += t(600, 472, 'C’est l’idée de FASTR. Les trois pages suivantes la déroulent avec les chiffres.', 15, MUTED)
svg('cov_05_idee.svg', b, 490)

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
b += big(600, 411, '= 10 000 femmes enceintes dans la province', 26, DG)
b += t(600, 478, 'Les 2 000 non vues sont déduites des 8 000 vues. Personne ne les a comptées, et pourtant on les a.', 16, MUTED)
svg('cov_08_raisonnement.svg', b, 500)

# 9. Same thing written as a division
b = f'<rect x="150" y="110" width="900" height="130" rx="10" fill="#FFFFFF" stroke="{DG}" stroke-width="2"/>'
b += t(300, 160, '« 8 sur 10 »', 20, PLUM, weight=600); b += t(300, 195, 's’écrit 0,80', 18, INK)
b += t(600, 160, '8 000 ÷ 0,80', 26, DG, weight=700); b += t(600, 195, 'femmes vues ÷ part des femmes vues', 15, MUTED)
b += t(900, 160, '= 10 000', 26, DG, weight=700); b += t(900, 195, 'toutes les femmes enceintes', 15, MUTED)
b += t(600, 300, 'Diviser par 0,80, c’est la même chose que multiplier par 10 et diviser par 8 :', 18, INK)
b += t(600, 335, '8 000 × 10 ÷ 8 = 10 000', 24, DG, weight=700)
b += t(600, 420, 'Vous n’avez pas besoin de faire ce calcul. FASTR le fait pour chaque province et chaque année.', 17, MUTED)
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
b += t(600, 430, 'Chaque pictogramme vaut 1 000 personnes. La province a 9 200 enfants à vacciner, pas 5 000.', 17, INK)
svg('cov_10_cascade.svg', b, 470)

# 10b. The five rates: defaults vs your country
b = t(600, 48, 'FASTR est livré avec des valeurs par défaut. Elles ne sont pas celles de votre pays.', 20, DG, weight=700)
rates = [('Perte de grossesse', '3 %', 'enquêtes, littérature'), ('Jumeaux', '1,5 %', 'EDS (DHS)'), ('Mortinatalité', '20 ‰', 'ONU IGME'), ('Mortalité néonatale', '39 ‰', 'EDS (DHS), ONU IGME'), ('Mortalité post-néonatale', '28 ‰', 'EDS (DHS), ONU IGME')]
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

# 11. Coverage at last: the fraction from slide 5, now with its bottom number filled in
b = t(600, 40, 'On repart de la fraction du début. Le chiffre du bas vient de la cascade : 9 200.', 18, DG, weight=700)
b += clinic(70, 110, 150, 110, label='Centre de santé de la province')
b += arrow(235, 170, 290, 170, DG)
b += f'<rect x="300" y="80" width="520" height="110" rx="10" fill="#EDF1F7" stroke="{NAVY}" stroke-width="2"/>'
b += big(560, 130, '4 000', 40, NAVY); b += t(560, 168, 'enfants vaccinés cette année, comptés dans DHIS2', 15, INK)
b += f'<line x1="300" y1="215" x2="820" y2="215" stroke="{DG}" stroke-width="4"/>'
b += f'<rect x="300" y="240" width="520" height="110" rx="10" fill="{TINT}" stroke="{DG}" stroke-width="2.5"/>'
b += big(560, 290, '9 200', 40, DG); b += t(560, 328, 'enfants à vacciner, estimés par FASTR (enquête + DHIS2 + cascade)', 14, INK)
b += t(870, 225, '=', 44, DG, weight=700)
b += big(1040, 245, '43 %', 64, DG)
b += t(1040, 282, 'de couverture', 18, INK)
b += t(1040, 310, 'plus de la moitié des enfants', 13, MUTED); b += t(1040, 328, 'restent à vacciner', 13, MUTED)
b += f'<rect x="300" y="380" width="520" height="40" rx="20" fill="{REDBG}"/>'
b += t(560, 406, 'Avec le 5 000 du recensement projeté, on aurait lu 80 %.', 15, RED, weight=600)
b += t(600, 460, 'Mêmes 4 000 enfants vaccinés. La décision à prendre n’est pas du tout la même.', 18, INK)
svg('cov_11_couverture.svg', b, 490)

# 12. Overview: four steps, plain words
b = t(600, 50, 'Ce que vous venez de voir, la plateforme le fait en quatre étapes', 20, DG, weight=700)
stepsP3 = [('1', 'Compter à partir', 'd’un service', PLUM), ('2', 'Déduire les', 'autres âges', DG),
           ('3', 'Choisir la', 'meilleure chaîne', NAVY), ('4', 'Calculer la', 'couverture', G)]
for i, (n, l1, l2, col) in enumerate(stepsP3):
    x = 70 + i*290
    b += f'<circle cx="{x+110}" cy="190" r="56" fill="{col}"/>'
    b += big(x+110, 208, n, 48, '#FFFFFF')
    b += t(x+110, 285, l1, 19, INK, weight=600); b += t(x+110, 312, l2, 19, INK, weight=600)
    if i < 3: b += arrow(x+180, 190, x+230, 190)
b += t(600, 400, 'Les étapes 1 et 2, c’est l’exemple des 10 000 femmes enceintes. Les étapes 3 et 4 sont nouvelles.', 16, MUTED)
b += t(600, 435, 'Tout se calcule automatiquement quand on génère un paquet de résultats.', 16, INK)
svg('cov_12_quatre_etapes.svg', b, 470)

# 13. Four entry points = four independent, complete chains
PL, TW, SB, NMR = 0.03, 0.015, 0.02, 0.039
def chain_from(level, v):
    """Fill the 4 levels (grossesses, accouchements, naissances vivantes, enfants) from one known level."""
    g = a = nv = e = None
    if level == 0: g = v; a = g*(1-PL); nv = a/(1-0.5*TW)*(1-SB); e = nv*(1-NMR)
    if level == 2: nv = v; a = nv/(1-SB)*(1-0.5*TW); g = a/(1-PL); e = nv*(1-NMR)
    if level == 3: e = v; nv = e/(1-NMR); a = nv/(1-SB)*(1-0.5*TW); g = a/(1-PL)
    return [g, a, nv, e]
def fmt(v): return f'{int(round(v/10)*10):,}'.replace(',', ' ')
levels = ['grossesses', 'accouchements', 'naissances vivantes', 'enfants à vacciner']
chains = [('CPN1', '8 000 ÷ 80 %', 0, 10000, PLUM), ('Accouchements', '6 200 ÷ 65 %', 2, 6200/0.65, DG),
          ('BCG', '8 600 ÷ 88 %', 2, 8600/0.88, DG), ('Penta1', '7 800 ÷ 85 %', 3, 7800/0.85, LG)]
b = t(600, 36, 'Quatre services, quatre chaînes complètes et indépendantes', 20, DG, weight=700)
entry_txt = [('8 000 consultations CPN1', '80 % des femmes enceintes y vont'), ('6 200 accouchements en établissement', '65 % des mères y accouchent'),
             ('8 600 doses de BCG', '88 % des nouveau-nés le reçoivent'), ('7 800 doses de Penta1', '85 % des nourrissons le reçoivent')]
for i, (svc, calc, lvl, v, col) in enumerate(chains):
    x = 50 + i*290
    vals = chain_from(lvl, v)
    b += f'<rect x="{x}" y="60" width="260" height="36" rx="10" fill="{col}"/>'
    b += t(x+130, 84, f'Chaîne {svc}', 16, '#FFFFFF', weight=700)
    d, e = entry_txt[i]
    b += f'<rect x="{x}" y="102" width="260" height="38" rx="6" fill="#EDF1F7"/>'
    b += t(x+8, 117, 'DHIS2 compte', 11, NAVY, anchor='start', weight=700); b += t(x+8, 133, d, 13, INK, anchor='start', weight=600)
    b += f'<rect x="{x}" y="144" width="260" height="38" rx="6" fill="#F4ECF4"/>'
    b += t(x+8, 159, 'L’ENQUÊTE dit', 11, PLUM, anchor='start', weight=700); b += t(x+8, 175, e, 13, INK, anchor='start', weight=600)
    b += t(x+130, 199, f'{calc}  =', 12, MUTED)
    for k, (lab, val) in enumerate(zip(levels, vals)):
        y = 208 + k*64
        known = (k == lvl)
        b += f'<rect x="{x}" y="{y}" width="260" height="50" rx="8" fill="{col if known else "#FFFFFF"}" stroke="{col}" stroke-width="{2.5 if known else 1.5}" stroke-dasharray="{"none" if known else "6,4"}"/>'
        b += big(x+130, y+24, fmt(val), 19, '#FFFFFF' if known else col)
        b += t(x+130, y+42, lab, 12, '#FFFFFF' if known else MUTED)
        if k < 3:
            up = k >= lvl
            b += (arrow(x+130, y+52, x+130, y+62, col, 2) if up else arrow(x+130, y+62, x+130, y+52, col, 2))
b += t(300, 478, 'En plein : le chiffre obtenu avec DHIS2 ÷ enquête. En pointillé : le reste, calculé avec la cascade.', 12, MUTED)
b += t(600, 504, 'La plateforme construit les quatre chaînes, puis en retient une seule pour tout (étape 3).', 15, INK)
svg('cov_13_quatre_chaines.svg', b, 520)

# 14. Choose the chain: compare each chain to the UN estimate (national, one population, one year)
b = t(600, 40, 'Exemple : les naissances vivantes de tout le pays, pour une année', 20, DG, weight=700)
b += t(600, 66, 'Chaque chaîne donne son chiffre national. On le compare au chiffre de l’ONU pour la même année.', 14, MUTED)
ref = 1000
bars = [('ONU', 1000, GREY, 'Nations unies (WPP)'), ('Chaîne CPN1', 1150, PLUM, ''), ('Chaîne Accouchements', 1030, DG, ''), ('Chaîne Penta1', 870, LG, '')]
base_y, scale = 330, 0.2
for i, (lab, v, col, sub) in enumerate(bars):
    x = 170 + i*230; h = v*scale
    b += f'<rect x="{x}" y="{base_y-h}" width="110" height="{h}" rx="4" fill="{col}"/>'
    b += t(x+55, base_y-h+26, f'{v*1000:,}'.replace(',', ' '), 16, INK if col == GREY else '#FFFFFF', weight=700)
    b += t(x+55, base_y+28, lab, 15, INK, weight=600)
    b += t(x+55, base_y+50, sub if sub else f'{v/ref:.2f} × le chiffre ONU', 13, MUTED)
b += f'<line x1="130" y1="{base_y}" x2="1070" y2="{base_y}" stroke="{DG}" stroke-width="2"/>'
b += f'<line x1="130" y1="{base_y-ref*scale}" x2="1070" y2="{base_y-ref*scale}" stroke="{MUTED}" stroke-width="1.5" stroke-dasharray="8,6"/>'
b += f'<rect x="{170+2*230-20}" y="{base_y-1030*scale-14}" width="150" height="{1030*scale+72}" rx="10" fill="none" stroke="{DG}" stroke-width="3" stroke-dasharray="10,6"/>'
b += t(600, 420, 'La chaîne la plus proche de l’ONU est retenue : ici Accouchements, à 1,03. Une seule chaîne pour tous les indicateurs et toutes les provinces.', 15, INK)
b += t(600, 446, 'En vrai, FASTR compare trois populations (grossesses, naissances vivantes, nourrissons) sur toutes les années, et prend la médiane.', 13, MUTED)
b += t(600, 468, 'L’ONU n’est pas « la vérité » : c’est un repère indépendant pour départager. La chaîne BCG n’entre pas dans ce choix automatique.', 13, MUTED)
svg('cov_14_choix_chaine.svg', b, 490)

# 15. Coverage per year, per province: volume / denominator
b = t(600, 50, 'Pour chaque indicateur, chaque année, chaque province', 20, DG, weight=700)
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


# Platform coverage chart colours (platform: client/src/generate_visualization/get_style_from_po/_2_coverage.ts)
P_HMIS, P_SURVEY, P_PROJ = '#CED4DB', '#000000', '#F04D44'
P_HMIS_INK = '#8A9299'   # readable version of the grey for text

def plat_chart(x0, y0, xw, yh, years, hmis, survey, proj, show_labels=True):
    """Draw a coverage chart the way the platform does: grey HMIS line, black survey points, red projection."""
    o = ''
    n = len(years)
    def X(i): return x0 + i*xw/(n-1)
    def Y(p): return y0 - (p-60)/40*yh
    for p in (60, 70, 80, 90, 100):
        o += f'<line x1="{x0}" y1="{Y(p)}" x2="{x0+xw}" y2="{Y(p)}" stroke="#E4E7E5" stroke-width="1"/>'
        o += t(x0-14, Y(p)+5, f'{p} %', 12, MUTED, anchor='end')
    for i, yr in enumerate(years): o += t(X(i), y0+24, yr, 13, MUTED)
    def series(vals, col, w, dash=''):
        pts = [(X(i), Y(v)) for i, v in enumerate(vals) if v is not None]
        s_ = ''
        if len(pts) > 1:
            s_ += '<polyline points="' + ' '.join(f'{x},{y}' for x, y in pts) + f'" fill="none" stroke="{col}" stroke-width="{w}" {dash}/>'
        for x, y in pts: s_ += f'<circle cx="{x}" cy="{y}" r="5" fill="{col}"/>'
        return s_, pts
    s1, p1 = series(hmis, P_HMIS, 3)
    s2, p2 = series(survey, P_SURVEY, 3)
    s3, p3 = series(proj, P_PROJ, 3)
    o += s1 + s3 + s2
    if show_labels:
        for pts, vals, col, dy in ((p1, hmis, P_HMIS_INK, 12), (p3, proj, P_PROJ, -6), (p2, survey, P_SURVEY, -10)):
            if pts:
                last = [v for v in vals if v is not None][-1]
                o += t(pts[-1][0]+14, pts[-1][1]+5+dy, f'{last} %', 12, col, anchor='start', weight=700)
    return o

# 16. Prolong the last survey with the HMIS trend, drawn like the platform chart
b = t(600, 40, 'L’enquête donne le niveau, le SNIS donne la tendance', 20, DG, weight=700)
b += f'<rect x="100" y="58" width="1000" height="350" rx="8" fill="#FFFFFF" stroke="#E4E7E5"/>'
b += t(600, 82, 'Estimations de couverture pour penta1', 14, INK, weight=600)
b += plat_chart(180, 370, 700, 260, ['2020', '2021', '2022', '2023'], [78, 80, 83, 85], [None, 82, None, None], [None, 82, 85, 87])
# legend inside the frame, platform order
lx = 940
for i, (lab, col) in enumerate((('Estimation basée sur l’enquête', P_SURVEY), ('Estimation projetée', P_PROJ), ('Couverture calculée à partir du SNIS', P_HMIS))):
    y = 120 + i*26
    b += f'<line x1="{lx-20}" y1="{y}" x2="{lx+8}" y2="{y}" stroke="{col}" stroke-width="3"/><circle cx="{lx-6}" cy="{y}" r="4" fill="{col}"/>'
    b += t(lx+16, y+4, lab, 10, INK, anchor='start')
b += t(600, 436, 'Le SNIS (gris) monte de 3 points puis de 2. On part de l’enquête (noir, 82 %) et on ajoute les mêmes points : 85 %, puis 87 % (rouge).', 15, INK)
b += t(600, 460, 'Quand une nouvelle enquête arrive, la projection repart de sa valeur.', 13, MUTED)
svg('cov_16_projection.svg', b, 480)

# 17. Reading the chart: the three series as the platform draws them, and what to look at
b = f'<rect x="60" y="40" width="640" height="330" rx="8" fill="#FFFFFF" stroke="#E4E7E5"/>'
b += t(380, 64, 'Estimations de couverture pour penta1', 14, INK, weight=600)
b += plat_chart(130, 320, 500, 210, ['2019', '2020', '2021', '2022', '2023'], [72, 75, 80, 83, 85], [78, None, 82, None, None], [None, None, 82, 85, 87])
cards = [(P_SURVEY, 'Noir : l’enquête', 'La mesure de référence. Un point seulement les années où il y a eu une EDS (DHS) ou une MICS.'),
         (P_PROJ, 'Rouge : la projection', 'La dernière enquête, prolongée avec la tendance du SNIS. National et provinces.'),
         (P_HMIS_INK, 'Gris : le SNIS', 'Volume corrigé ÷ dénominateur FASTR. Chaque année, chaque province.')]
for i, (col, head, txt) in enumerate(cards):
    y = 40 + i*110
    b += f'<rect x="730" y="{y}" width="410" height="98" rx="10" fill="#FFFFFF" stroke="{col if col != P_HMIS_INK else P_HMIS}" stroke-width="2"/>'
    b += f'<line x1="750" y1="{y+28}" x2="790" y2="{y+28}" stroke="{col if col != P_HMIS_INK else P_HMIS}" stroke-width="3"/><circle cx="770" cy="{y+28}" r="5" fill="{col if col != P_HMIS_INK else P_HMIS}"/>'
    b += t(805, y+33, head, 15, col, anchor='start', weight=700)
    words = txt.split(); l1 = ''
    while words and len(l1 + ' ' + words[0]) <= 62: l1 = (l1 + ' ' + words.pop(0)).strip()
    b += t(750, y+58, l1, 12, INK, anchor='start'); b += t(750, y+78, ' '.join(words), 12, INK, anchor='start')
b += f'<rect x="60" y="390" width="1080" height="40" rx="20" fill="{TINT}"/>'
b += t(600, 416, 'Pour la tendance, regardez le gris. Pour le niveau, regardez le rouge. S’ils s’écartent beaucoup, questionnez le dénominateur avant les services.', 14, DG, weight=600)
svg('cov_17_lire_graphique.svg', b, 450)

# 18. Three screens in the platform, in order
b = ''
screens = [('1', 'Régler', 'Menu Résultats', 'Paramètres par défaut des modules', ['les 5 taux du pays', 'niveau : national, province', 'chaîne : « auto »'], DG),
           ('2', 'Générer', 'Menu Résultats', 'Générer un nouveau paquet', ['cocher les 2 modules de couverture', 'l’ajustement qualité est requis', 'attendre « Prêt », puis épingler'], NAVY),
           ('3', 'Lire', 'Dans le projet', 'Visualisations', ['Séries temporelles de couverture', 'national, province', 'Couverture (SNIS uniquement)'], G)]
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


# 19. The cascade: going down (multiply) and going up (divide), on the same ladder
PL, TW, SB, NMR = 0.03, 0.015, 0.02, 0.039
lv = ['grossesses', 'accouchements', 'naissances', 'naissances vivantes', 'enfants à vacciner']
pills = ['− 3 %', '+ 0,75 %', '− 2 %', '− 3,9 %']
whats = ['grossesses perdues', 'jumeaux', 'mort-nés', 'décès du 1er mois']
down = [10000]; down += [down[0]*(1-PL)]; down += [down[1]*(1+0.5*TW)]; down += [down[2]*(1-SB)]; down += [down[3]*(1-NMR)]
upv = [7800/0.85]; upv = [upv[0]/(1-NMR)] + upv; upv = [upv[0]/(1-SB)] + upv; upv = [upv[0]/(1+0.5*TW)] + upv; upv = [upv[0]/(1-PL)] + upv
ops = ['(1 − 3 %)', '(1 + 0,75 %)', '(1 − 2 %)', '(1 − 3,9 %)']
b = t(600, 36, 'Les mêmes taux servent dans les deux sens', 20, DG, weight=700)
b += f'<rect x="60" y="56" width="340" height="34" rx="17" fill="{PLUM}"/>'; b += t(230, 78, 'DESCENDRE : on multiplie  (chaîne CPN1)', 13, '#FFFFFF', weight=700)
b += f'<rect x="800" y="56" width="340" height="34" rx="17" fill="{LG}"/>'; b += t(970, 78, 'REMONTER : on divise  (chaîne Penta1)', 13, '#FFFFFF', weight=700)
y0, dy, bh = 108, 76, 42
for k, lab in enumerate(lv):
    y = y0 + k*dy
    b += f'<rect x="450" y="{y}" width="300" height="{bh}" rx="8" fill="{TINT}" stroke="{DG}" stroke-width="1.5"/>'
    b += t(600, y+27, lab, 15, DG, weight=700)
    # left (down) and right (up) numbers at this level
    known_l, known_r = (k == 0), (k == 4)
    b += f'<rect x="60" y="{y}" width="110" height="{bh}" rx="8" fill="{PLUM if known_l else "#FFFFFF"}" stroke="{PLUM}" stroke-width="2"/>'
    b += big(115, y+28, fmt(down[k]), 18, '#FFFFFF' if known_l else PLUM)
    b += f'<rect x="1030" y="{y}" width="110" height="{bh}" rx="8" fill="{LG if known_r else "#FFFFFF"}" stroke="{LG}" stroke-width="2"/>'
    b += big(1085, y+28, fmt(upv[k]), 18, '#FFFFFF' if known_r else LG)
    if k < 4:
        gy = y + bh + dy/2 - bh/2   # middle of the gap
        b += f'<rect x="560" y="{gy-13}" width="80" height="26" rx="13" fill="{REDBG}" stroke="{RED}" stroke-width="1.5"/>'
        b += t(600, gy+5, pills[k], 13, RED, weight=800)
        b += t(700, gy+5, whats[k], 11, RED, anchor='start')
        b += arrow(115, y+bh+3, 115, y+dy-3, PLUM, 2)
        b += t(190, gy+5, f'× {ops[k]}', 14, INK, anchor='start', weight=600)
        b += arrow(1085, y+dy-3, 1085, y+bh+3, LG, 2)
        b += t(1020, gy+5, f'÷ {ops[k]}', 14, INK, anchor='end', weight=600)
b += t(115, y0+5*dy+8, 'point de départ', 11, MUTED); b += t(1085, y0+5*dy+8, 'point de départ', 11, MUTED)
b += t(600, y0+5*dy+36, 'Descendre, c’est enlever une part : on multiplie. Remonter, c’est retrouver le total : on divise par la même chose.', 15, INK)
svg('cov_19_cascade_calcul.svg', b, y0+5*dy+56)

# 20. Why these four services: who comes, so what it counts
b = t(600, 36, 'Un service est un bon point de départ quand on sait qui vient, et que l’enquête mesure la part qui vient', 17, DG, weight=700)
rows = [('CPN1', 'pregnant', PLUM, 'Les femmes enceintes viennent à la première consultation prénatale.', 'L’enquête demande aux mères : « êtes-vous allée en CPN ? »', 'grossesses'),
        ('Accouchements', 'baby', DG, 'Les mères accouchent dans un établissement de santé.', 'L’enquête demande, pour chaque enfant né vivant : « où avez-vous accouché ? »', 'naissances vivantes'),
        ('BCG', 'baby', DG, 'Le BCG se donne à la naissance ou dans les premiers jours.', 'L’enquête demande : « cet enfant a-t-il reçu le BCG ? »', 'naissances vivantes'),
        ('Penta1', 'child', LG, 'Le Penta1 se donne à 6 semaines : l’enfant a passé le premier mois.', 'L’enquête demande : « cet enfant a-t-il reçu le Penta1 ? »', 'enfants à vacciner')]
for i, (svc, kind, col, who, ask, level) in enumerate(rows):
    y = 70 + i*100
    b += f'<rect x="40" y="{y}" width="1120" height="86" rx="10" fill="#FFFFFF" stroke="{col}" stroke-width="1.5"/>'
    b += f'<rect x="40" y="{y}" width="170" height="86" rx="10" fill="{col}"/><rect x="200" y="{y}" width="10" height="86" fill="{col}"/>'
    b += t(125, y+50, svc, 17, '#FFFFFF', weight=700)
    px = 270
    if kind == 'pregnant': b += f'<g transform="translate(0 8) scale(1)">' + pregnant(px, y+60, col) + '</g>'
    elif kind == 'child': b += child(px, y+58, col)
    else: b += child(px, y+62, col); b += f'<circle cx="{px}" cy="{y+30}" r="7" fill="none" stroke="{col}" stroke-width="2"/>'
    b += t(330, y+34, who, 14, INK, anchor='start', weight=600)
    b += t(330, y+60, ask, 13, MUTED, anchor='start')
    b += t(905, y+30, 'donc on compte des', 12, MUTED, anchor='start')
    b += f'<rect x="900" y="{y+40}" width="240" height="32" rx="16" fill="{TINT}"/>'
    b += t(1020, y+61, level, 14, DG, weight=700)
b += t(600, 492, 'Quatre services, quatre âges de la vie : c’est pour cela qu’ils peuvent chacun servir de point de départ.', 15, INK)
svg('cov_20_pourquoi_services.svg', b, 510)


# 21. What coverage is: a share, drawn as a fraction
b = t(600, 40, 'La couverture, c’est la part des personnes qui ont reçu un service parmi toutes celles qui devaient le recevoir', 18, DG, weight=700)
b += f'<rect x="120" y="80" width="560" height="110" rx="10" fill="#EDF1F7" stroke="{NAVY}" stroke-width="2"/>'
for k in range(8): b += child(170 + k*62, 150, NAVY)
b += t(400, 180, '8 enfants vaccinés cette année', 15, NAVY, weight=700)
b += f'<line x1="120" y1="215" x2="680" y2="215" stroke="{DG}" stroke-width="4"/>'
b += f'<rect x="120" y="240" width="560" height="110" rx="10" fill="{TINT}" stroke="{DG}" stroke-width="2"/>'
for k in range(10): b += child(150 + k*56, 310, DG)
b += t(400, 340, '10 enfants qui devaient être vaccinés', 15, DG, weight=700)
b += t(740, 225, '=', 44, DG, weight=700)
b += big(930, 240, '80 %', 64, DG)
b += t(930, 280, 'de couverture', 18, INK)
b += t(600, 410, 'Pour la calculer, il faut deux chiffres : ceux qui ont reçu le service, et tous ceux qui devaient le recevoir.', 16, INK)
svg('cov_21_couverture_def.svg', b, 470)

# 22. The two numbers: the top we have, the bottom nobody counts
b = ''
b += f'<rect x="60" y="50" width="520" height="300" rx="12" fill="#EDF1F7" stroke="{NAVY}" stroke-width="2"/>'
b += t(320, 90, 'Le chiffre du haut', 20, NAVY, weight=700)
b += t(320, 118, 'les enfants vaccinés', 15, INK)
b += clinic(230, 170, 110, 70, label='')
b += arrow(350, 205, 400, 205, NAVY)
b += f'<rect x="410" y="175" width="130" height="60" rx="8" fill="#FFFFFF" stroke="{NAVY}" stroke-width="2"/>'
b += t(475, 200, 'DHIS2', 15, NAVY, weight=700); b += t(475, 222, 'chaque mois', 12, MUTED)
b += t(320, 280, 'Compté un par un au centre de santé.', 15, INK, weight=600)
b += t(320, 306, 'Ce chiffre, on l’a.', 17, NAVY, weight=700)
b += f'<rect x="620" y="50" width="520" height="300" rx="12" fill="{REDBG}" stroke="{RED}" stroke-width="2"/>'
b += t(880, 90, 'Le chiffre du bas', 20, RED, weight=700)
b += t(880, 118, 'tous les enfants qui devaient l’être', 15, INK)
for k in range(10): b += child(700 + k*40, 200, RED, outline=True)
b += qmark(1070, 190, 60)
b += t(880, 280, 'Ceux qui ne sont pas venus, personne ne les compte.', 15, INK, weight=600)
b += t(880, 306, 'Ce chiffre, il faut l’estimer.', 17, RED, weight=700)
b += t(600, 400, 'On appelle le chiffre du haut le numérateur, celui du bas le dénominateur.', 16, INK)
b += t(600, 430, 'Toute cette présentation porte sur le chiffre du bas : comment FASTR l’estime, et pourquoi cela change les résultats.', 16, DG, weight=700)
svg('cov_22_deux_chiffres.svg', b, 460)


# 23. Rule: between two surveys, keep the last survey value; DHS before MICS
years = ['2021', '2022', '2023', '2024', '2025']
xs = [330 + i*190 for i in range(5)]
b = t(600, 36, 'L’enquête ne sort pas tous les ans. Entre deux enquêtes, on garde la dernière valeur.', 18, DG, weight=700)
rows_y = {'yr': 80, 'srv': 150, 'dhis': 270, 'pop': 360}
for x, yr in zip(xs, years): b += t(x, rows_y['yr'], yr, 18, INK, weight=700)
b += t(60, rows_y['srv']+6, 'Enquête', 15, PLUM, anchor='start', weight=700)
b += t(60, rows_y['srv']+26, '« part des femmes qui viennent »', 11, MUTED, anchor='start')
b += t(60, rows_y['dhis']+6, 'DHIS2', 15, NAVY, anchor='start', weight=700)
b += t(60, rows_y['dhis']+26, 'consultations CPN1 comptées', 11, MUTED, anchor='start')
b += t(60, rows_y['pop']+6, '= femmes enceintes', 15, DG, anchor='start', weight=700)
b += t(60, rows_y['pop']+26, 'DHIS2 ÷ part de l’enquête', 11, MUTED, anchor='start')
survey = {0: '8 sur 10', 4: '7 sur 10'}
carried = ['8 sur 10', '8 sur 10', '8 sur 10', '8 sur 10', '7 sur 10']
dhis = ['8 000', '8 400', '8 900', '9 300', '9 100']
pop = ['10 000', '10 500', '11 100', '11 600', '13 000']
y = rows_y['srv']
for i, x in enumerate(xs):
    if i in survey:
        b += f'<rect x="{x-12}" y="{y-12}" width="24" height="24" fill="{PLUM}" transform="rotate(45 {x} {y})"/>'
        b += t(x, y+40, survey[i], 15, PLUM, weight=800)
        b += t(x, y+58, 'nouvelle enquête', 11, PLUM)
    else:
        b += f'<circle cx="{x}" cy="{y}" r="9" fill="#FFFFFF" stroke="{PLUM}" stroke-width="2.5" stroke-dasharray="3,2"/>'
        b += t(x, y+40, carried[i], 15, PLUM, weight=600)
        b += t(x, y+58, 'pas d’enquête : on garde', 11, MUTED)
    if i < 4: b += f'<line x1="{x+14}" y1="{y}" x2="{xs[i+1]-14}" y2="{y}" stroke="{PLUM}" stroke-width="2.5" stroke-dasharray="{"none" if i==3 else "8,5"}"/>'
for i, x in enumerate(xs):
    b += f'<rect x="{x-60}" y="{rows_y["dhis"]-22}" width="120" height="40" rx="8" fill="#EDF1F7" stroke="{NAVY}" stroke-width="1.5"/>'
    b += t(x, rows_y['dhis']+5, dhis[i], 16, NAVY, weight=700)
    b += f'<rect x="{x-60}" y="{rows_y["pop"]-22}" width="120" height="40" rx="8" fill="{TINT}" stroke="{DG}" stroke-width="1.5"/>'
    b += t(x, rows_y['pop']+5, pop[i], 16, DG, weight=700)
    b += arrow(x, rows_y['dhis']+20, x, rows_y['pop']-24, DG, 2)
b += f'<rect x="150" y="415" width="900" height="40" rx="20" fill="{TINT}"/>'
b += t(600, 441, 'Deux enquêtes la même année ? FASTR prend l’EDS (DHS) ; la MICS sert si l’EDS manque.', 14, DG, weight=600)
svg('cov_23_regles.svg', b, 475)
