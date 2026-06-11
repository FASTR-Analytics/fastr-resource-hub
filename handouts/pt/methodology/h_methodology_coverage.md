---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Recapitulativo de metodologia · Estimativas de cobertura"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Recapitulativo de metodologia · Módulos M5 + M6</span>

# Estimativas de cobertura

<p class="meta-line"><strong>O que os módulos fazem</strong> · <strong>Como ler o resultado</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">O que fazem</p>

Transformam contagens de serviços em bruto em **cobertura** — a proporção das pessoas que *precisavam* de um serviço e que efetivamente o receberam.

<p class="sb-label">Duas partes</p>

- **M5** calcula a **população-alvo** (a parte difícil)
- **M6** transforma-a em cobertura e preenche os anos entre inquéritos

<p class="sb-label">Tenha presente</p>

Estas são **estimativas a partir de dados de rotina** — boas para tendências e comparação, não números nacionais oficiais.

</aside>
<div class="p1-main">

## O que significa «cobertura»

A cobertura responde a uma pergunta simples: **de todas as pessoas que precisavam de um serviço, que proporção o recebeu?**

Tome as primeiras visitas pré-natais (CPN1). Se **10 000** mulheres estavam grávidas num distrito e **8 000** delas tiveram uma visita de CPN1, então a cobertura é 8 000 ÷ 10 000 = **80%**.

Por isso a cobertura é sempre uma fração:

> **cobertura = o número atendido ÷ o número que precisava dele**

![Cobertura de serviço = a população que recebeu o serviço, sobre a população-alvo que dele precisava w:100%](../../../resources/diagrams/coverage_equation.svg)

## O obstáculo

O número **de cima** é fácil — as 8 000 visitas de CPN1 vêm diretamente do HMIS; é apenas a contagem de serviços.

O número **de baixo** é a parte difícil: **ninguém conta quantas mulheres grávidas (ou bebés) há.** Nenhuma unidade entrega um relatório a dizer «houve aqui 10 000 mulheres grávidas este ano».

Por isso toda a tarefa destes módulos se resume a uma pergunta — **onde obtemos esse número de baixo, a população-alvo?** É isso que o M5 se propõe estimar.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">M5 · estimar a população</span>

## Como o M5 encontra o número de baixo

**Passo 1 — pedi-lo emprestado a um inquérito.** De poucos em poucos anos, um inquérito domiciliar mede a cobertura *diretamente*, entrevistando famílias. Pode dizer-nos que, digamos, **80% das mulheres grávidas tiveram CPN1**. Agora combine isto com a contagem que já temos: se as **8 000** visitas de CPN1 são 80% de todas as mulheres grávidas, então o total é 8 000 ÷ 0,80 = **10 000 mulheres grávidas**. Recuperámos o número de baixo que não conseguíamos contar.

**Passo 2 — ajustá-lo ao grupo certo.** 10 000 mulheres grávidas é o denominador certo para os cuidados pré-natais — mas a **Penta1 é dada a bebés**, um grupo diferente. Não precisamos de um segundo inquérito: uma gravidez *torna-se* um nascimento *torna-se* um bebé, e sabemos aproximadamente quantos se perdem em cada etapa. Por isso o FASTR vai descendo o número — menos abortos espontâneos e nados-mortos, menos mortes neonatais — até cerca de **9 100 bebés**. Um inquérito dá agora o denominador para *todos* os indicadores.

**Passo 3 — verificação cruzada, e escolher o melhor.** A CPN1 não é o único ponto de partida; partos, Penta1 e BCG dão cada um a sua própria estimativa da população, e não vão todos concordar. Para escolher, o FASTR alinha cada estimativa com a **projeção populacional da ONU** — um valor independente construído sem o HMIS — e mantém a que fica mais próxima.

<div class="callout-footer">A cobertura só é tão boa quanto o seu denominador. É por isso que o M5 não confia num único indicador — triangula vários e deixa a projeção independente da ONU desempatar.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">M5 · a cadeia da vida (passo 2)</span>

## De gravidezes a bebés

![A cadeia da vida: gravidezes, menos perdas em cada etapa, tornam-se partos, nascimentos, nados-vivos e finalmente bebés elegíveis para vacinas w:100%](../../../resources/diagrams/denominator_cascade.svg)

As **setas verdes** avançam — cada uma aplica uma taxa demográfica padrão (subtraindo as perdas dessa etapa). As **setas vermelhas correm para trás**: as mesmas taxas permitem **retrocalcular** a cadeia a partir de qualquer ponto, por isso o FASTR pode começar pelo indicador que tiver um inquérito (CPN1, parto, Penta1…) e ainda assim chegar a todas as outras populações-alvo.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">M6 · o resultado</span>

## Cobertura ao longo do tempo

Agora a parte fácil: **cobertura = contagem HMIS ÷ essa população**, para cada indicador, ano e área. Os inquéritos só acontecem de poucos em poucos anos, por isso entre eles o FASTR mantém o último valor do inquérito e desloca-o por quanto a cobertura HMIS se moveu — o inquérito define o **nível**, o HMIS a **direção**.

![Estimativas de cobertura ao longo do tempo para um indicador: uma linha HMIS, pontos de inquérito e uma linha projetada w:100%](../../../resources/default_outputs/Module4_1_Coverage_HMIS_National.png)

- **As linhas** — **cinzento** = cobertura HMIS (contagem ÷ população estimada), todos os anos, rotulada *Dados administrativos* na plataforma; **preto** = resultados reais de inquérito (MICS/DHS), rotulados *Estimativa baseada em inquéritos*; **vermelho** = o nível de inquérito projetado para a frente sobre a tendência HMIS onde não existe inquérito, rotulado *Estimativa projetada*
- **Como ler** — onde a linha cinzenta do HMIS e os pontos pretos do inquérito ficam próximos, o denominador é sólido e a tendência é fiável; depois leia a direção — a subir, plana ou a escorregar
- **Atenção a** — cobertura **acima de 100%** é um sinal de aviso (denominador demasiado baixo ou contagem inflacionada), não cobertura real acima do total

<div class="callout-footer">O mesmo gráfico é produzido a nível nacional, regional e distrital — leia-os em conjunto: uma tendência nacional saudável pode ainda esconder um distrito em dificuldades.</div>
