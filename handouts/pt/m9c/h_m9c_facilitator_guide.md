---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Visualizações e interpretação · Facilitador"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guia do facilitador — Visualizações e interpretação

<p class="meta-line"><strong>Guia do facilitador</strong> · <strong>Visualizações e interpretação</strong></p>

## Sobre estas atividades

Estas atividades ensinam os participantes a **ler um gráfico e dizer o que significa** — primeiro manualmente, depois com a IA, terminando numa atividade de aplicação real sobre dados do país. Emparelham deliberadamente um caminho «faça você mesmo» com um caminho «a IA faz, você verifica», tanto para construir gráficos como para escrever interpretações.

**Seis fichas.** **~100 min** de tempo dos participantes.

## Como conduzir

- Comece pelo **quadro de leitura** (ficha 1) — é a referência sobre a qual tudo o resto assenta.
- A sequência emparelha **uma passagem manual completa** (fichas 2 + 3) com **uma passagem completa com IA** (fichas 4 + 5), para que os participantes completem todo o ciclo construir-e-interpretar eles próprios antes de verem a IA fazê-lo.
- Para cada tarefa na plataforma, **demonstre primeiro**, depois deixe os participantes seguir a ficha. A ficha reexplica o que mostrou.
- O fio condutor: a IA é rápida, mas o participante é responsável. Reforce a verificação sempre que a IA aparece.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## As atividades

### 1. Como ler uma visualização FASTR

**Referência · ~10 min**

**O que é** — uma referência reutilizável: um quadro de seis passos para ler qualquer gráfico.
**O que a ficha cobre** — os seis passos (indicador, nível/período, comparação, valores, o que se destaca, o «e então»), como escolher tipos de gráfico, e prática numa apresentação existente com um colega.
**Atenção a** — ler mal o eixo Y é o erro mais comum. Lembre os participantes de verificar a legenda, os eixos e as notas de rodapé *antes* de interpretar.

### 2. Criar a sua primeira visualização

**Atividade · ~15 min**

**O que é** — uma atividade prática para criar um gráfico com o construtor integrado (o assistente **Metric → Presets → Create**).
**O que a ficha cobre** — + Create visualization → escolher uma métrica (ex.: *M3. Service utilization → Number of services reported*) → escolher um preset pronto como *Service volume over time (monthly)* → Create. Depois explica **filtrar vs desagregar**, onde os encontrar ao editar uma visualização, e os quatro modos de apresentação (Lines / Grid / Rows / Columns).
**Atenção a** — os participantes confundem **filtrar** (escolher o que mostrar — marca os indicadores/período que quer) com **desagregar** (dividir um total nas suas partes). Reforce a diferença em voz alta; está na base de cada gráfico que constroem. O caminho rápido é métrica → preset → Create; **Custom** serve só para controlo manual. Além disso: gráficos de linhas para tendências, de barras para comparar.

> **Demonstração — usar os dois, ao vivo (~3 min).** Abra uma visualização guardada e mostre o **painel esquerdo** (sublinhe que é preciso *descer (scroll)* para lá chegar — é aqui que as pessoas se perdem):
> 1. Comece com um indicador, total nacional. Diga por palavras o que mostra.
> 2. Em **Display (disaggregate)**, decomponha **por distrito** — alterne entre **Lines**, depois **Rows**, depois **Grid**, para verem os *mesmos dados em formas diferentes*.
> 3. Em **Filter (subset)**, marque só dois distritos — o gráfico mostra apenas esses. Nomeie: «estou a *escolher o que mostrar*».
> 4. **Mostre a armadilha:** desagregar por distrito **e** filtrar para um único distrito → não resta nada para comparar. Regra a repetir: *filtre o que não precisa, desagregue o que quer comparar.*

### 3. Escrever uma interpretação para um gráfico

**Atividade · ~20 min**

**O que é** — uma atividade de escrita que ensina a estrutura de interpretação em três partes para um diapositivo.
**O que a ficha cobre** — um título que transmite a mensagem, um «o que vê» só com factos, e um «o que significa» orientado para a ação, colocado ao lado de um gráfico num diapositivo.
**Atenção a** — títulos que apenas descrevem («Resultados de cobertura»), factos misturados com interpretação, e «e então» vagos que não nomeiam pessoa nem próximo passo.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 4. Construir uma visualização com o Assistente de IA

**Atividade · ~15 min**

**O que é** — uma atividade prática para produzir o mesmo gráfico através de pedidos à IA em linguagem comum.
**O que a ficha cobre** — escrever um pedido de gráfico, rever se a IA correspondeu ao pedido (indicador, período, ajustados vs brutos), iterar em pequenos passos, e guardar.
**Atenção a** — os participantes confiam na primeira resposta. Têm de verificar o indicador, o período, o tipo de gráfico — e sobretudo **dados ajustados vs brutos** — antes de guardar.

### 5. Deixar a IA redigir a interpretação

**Atividade · ~15 min**

**O que é** — uma atividade prática para usar a IA na redação do texto de interpretação, depois verificá-lo.
**O que a ficha cobre** — pedir uma interpretação à IA, verificar cada afirmação contra o gráfico, refinar em linguagem comum, e acrescentar o contexto local que a IA não pode conhecer.
**Atenção a** — confiar em texto de IA que soa confiante. Cada afirmação tem de ser verificada contra o gráfico, e a ação recomendada tem de ser assumida pelo participante.

### 6. Aplicar — detetar uma perturbação

**Atividade · ~25 min**

**O que é** — uma atividade-síntese de aplicação que usa dados reais do país para identificar uma perturbação e escrever uma conclusão.
**O que a ficha cobre** — as equipas de país escolhem um indicador sinalizado, abrem o seu gráfico de perturbações, percorrem o quadro de seis passos, acrescentam contexto local, escrevem uma conclusão em três partes e partilham-na com a sala.
**Atenção a** — uma perturbação raramente é uma quebra de um único mês. Oriente as equipas para quedas sustentadas (3+ meses); lembre-as de que volumes estáveis podem ainda significar cobertura a cair se a população estiver a crescer.

## Para terminar

A atividade 6 é a prova de que estas atividades resultaram: uma equipa que consegue escolher uma perturbação real e enunciá-la com clareza tem a competência central do FASTR. Use a partilha final para fazer emergir e corrigir conclusões fracas.
