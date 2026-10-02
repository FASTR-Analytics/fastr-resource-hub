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
for i, (svc, calc, lvl, v, col) in enumerate(chains):
    x = 50 + i*290
    vals = chain_from(lvl, v)
    b += f'<rect x="{x}" y="60" width="260" height="44" rx="10" fill="{col}"/>'
    b += t(x+130, 88, f'Chaîne {svc}', 17, '#FFFFFF', weight=700)
    b += t(x+130, 128, f'DHIS2 ÷ enquête : {calc}', 13, MUTED)
    for k, (lab, val) in enumerate(zip(levels, vals)):
        y = 150 + k*74
        known = (k == lvl)
        b += f'<rect x="{x}" y="{y}" width="260" height="54" rx="8" fill="{col if known else "#FFFFFF"}" stroke="{col}" stroke-width="{2.5 if known else 1.5}" stroke-dasharray="{"none" if known else "6,4"}"/>'
        b += big(x+130, y+26, fmt(val), 20, '#FFFFFF' if known else col)
        b += t(x+130, y+45, lab, 12, '#FFFFFF' if known else MUTED)
        if k < 3:
            up = k >= lvl   # below the known level we go down (×), above it we go up (÷)
            b += (arrow(x+130, y+56, x+130, y+72, col, 2) if up else arrow(x+130, y+72, x+130, y+56, col, 2))
    b += t(x+130, 468, 'point de départ en plein, le reste calculé', 11, MUTED) if i == 0 else ''
b += t(600, 498, 'La plateforme construit les quatre chaînes, puis en retient une seule pour tout (étape 3).', 15, INK)
svg('cov_13_quatre_chaines.svg', b, 515)

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
b += t(600, 440, 'La chaîne la plus proche de l’ONU est retenue : ici les accouchements, à 1,03. Une seule chaîne pour tous les indicateurs et toutes les provinces.', 16, INK)
b += t(600, 470, 'L’ONU n’est pas « la vérité » : c’est un repère indépendant pour départager les chaînes. La chaîne BCG, nationale seulement, ne participe pas au choix automatique.', 14, MUTED)
svg('cov_14_choix_chaine.svg', b, 500)

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
b += t(230, 160, 'chaque année, chaque province', 14, INK)
b += t(230, 185, 'volume corrigé ÷ dénominateur', 14, MUTED)
b += f'<rect x="430" y="70" width="340" height="150" rx="10" fill="#FFFFFF" stroke="{PLUM}" stroke-width="2"/>'
b += f'<rect x="491" y="111" width="18" height="18" fill="{PLUM}" transform="rotate(45 500 120)"/>'
b += t(655, 112, 'Point d’enquête', 18, PLUM, weight=700)
b += t(600, 160, 'les années où il y a une EDS (DHS) ou MICS', 14, INK)
b += t(600, 185, 'la mesure de référence', 14, MUTED)
b += f'<rect x="800" y="70" width="340" height="150" rx="10" fill="#FFFFFF" stroke="{PLUM}" stroke-width="2"/>'
b += f'<line x1="830" y1="120" x2="910" y2="120" stroke="{PLUM}" stroke-width="4" stroke-dasharray="9,6"/>'
b += t(1025, 112, 'Projection', 18, PLUM, weight=700)
b += t(970, 160, 'l’enquête prolongée par le SNIS', 14, INK)
b += t(970, 185, 'national et provinces', 14, MUTED)
b += f'<rect x="60" y="260" width="520" height="150" rx="10" fill="{TINT}"/>'
b += t(320, 300, 'Pour voir la tendance', 18, DG, weight=700)
b += t(320, 335, 'regardez la couverture SNIS :', 16, INK)
b += t(320, 360, 'disponible chaque année et par province', 16, INK)
b += f'<rect x="620" y="260" width="520" height="150" rx="10" fill="{TINT}"/>'
b += t(880, 300, 'Pour voir le niveau', 18, DG, weight=700)
b += t(880, 335, 'regardez la projection :', 16, INK)
b += t(880, 360, 'calée sur la dernière enquête', 16, INK)
b += t(600, 460, 'Si les deux séries s’écartent beaucoup, c’est le dénominateur qu’il faut questionner avant les services.', 16, MUTED)
svg('cov_17_lire_graphique.svg', b, 490)

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


# 19. The cascade as a worked calculation (real default rates, 10 000 pregnancies)
b = t(600, 40, 'Avec les valeurs par défaut, pour 10 000 grossesses', 20, DG, weight=700)
rows = [('10 000', 'grossesses', PLUM, None, None, 'point de départ : CPN1 ÷ enquête (étape 1)'),
        ('9 700', 'accouchements', DG, '10 000 × (1 − 3 %)', '− 3 %', 'on enlève les grossesses perdues'),
        ('9 770', 'naissances', DG, '9 700 × (1 + 0,75 %)', '+ 0,75 %', 'on ajoute les deuxièmes jumeaux (1,5 % de jumeaux)'),
        ('9 580', 'naissances vivantes', DG, '9 770 × (1 − 2 %)', '− 2 %', 'on enlève les mort-nés (20 ‰)'),
        ('9 200', 'enfants à vacciner (Penta)', LG, '9 580 × (1 − 3,9 %)', '− 3,9 %', 'on enlève les décès du premier mois (39 ‰)'),
        ('8 940', 'enfants pour la rougeole', LG, '9 200 × (1 − 2,8 %)', '− 2,8 %', 'on enlève les décès de 1 à 11 mois (28 ‰)')]
y0, rh = 70, 62
for i, (n, lab, col, calc, rate, note) in enumerate(rows):
    y = y0 + i*rh
    if i: b += arrow(150, y-8, 150, y+8, col, 2.5)
    b += f'<rect x="60" y="{y+10}" width="180" height="46" rx="8" fill="{col}"/>'
    b += big(150, y+42, n, 24, '#FFFFFF')
    b += t(262, y+38, lab, 16, INK, anchor='start', weight=700)
    if calc:
        b += f'<rect x="520" y="{y+13}" width="72" height="40" rx="20" fill="{REDBG}" stroke="{RED}" stroke-width="2"/>'
        b += t(556, y+39, rate, 14, RED, weight=800)
        b += t(610, y+38, f'= {calc}', 15, INK, anchor='start')
    b += t(880, y+38, note, 13, MUTED, anchor='start')
b += f'<line x1="500" y1="{y0+rh}" x2="500" y2="{y0+6*rh}" stroke="#E4E7E5" stroke-width="1.5"/>'
b += f'<line x1="865" y1="{y0+rh}" x2="865" y2="{y0+6*rh}" stroke="#E4E7E5" stroke-width="1.5"/>'
b += t(600, y0+6*rh+28, 'Mêmes taux pour toutes les provinces. FASTR refait ce calcul pour chaque province et chaque année.', 15, INK)
svg('cov_19_cascade_calcul.svg', b, y0+6*rh+50)


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
