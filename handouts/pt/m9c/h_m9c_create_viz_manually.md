---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Visualizações e interpretação"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Ler uma visualização</span> <span class="arrow">→</span> <span class="step current">Construir manualmente</span> <span class="arrow">→</span> <span class="step">Construir com IA</span> <span class="arrow">→</span> <span class="step">Escrever interpretação</span> <span class="arrow">→</span> <span class="step">Interpretação com IA</span> <span class="arrow">→</span> <span class="step">Detetar perturbação</span></div>

# Criar a sua primeira visualização

<p class="meta-line"><strong>Atividade</strong> · <strong>Visualizações e interpretação</strong> · <strong>~15 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Tem sessão iniciada e está no projeto do seu país
- ☐ Está no separador **Visualizations**
- ☐ Tem uma pasta sua (ou pode usar a partilhada)

</aside>
<div class="p1-main">

## O que vai fazer

Criar o seu primeiro gráfico com o construtor integrado: escolher uma **métrica**, escolher um **gráfico pré-definido**, e fica guardado no projeto. Vai percorrer o construtor você mesmo; a próxima atividade faz o mesmo com o Assistente de IA.

<h2 class="step-h"><span class="step-n">1</span><span>Abrir o construtor de visualizações</span></h2>

No separador Visualizations, clique em **+ Create visualization**. Abre-se um construtor com dois passos — **Metric** depois **Presets**. Escolher um preset com nome abre o gráfico no editor; escolher **Custom** acrescenta um terceiro passo **Configure**.

![O botão "+ Create visualization" h:34](../../../resources/screenshots/m9c/new_viz_button.png)

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Escolher uma métrica</span></h2>

As métricas estão agrupadas por módulo à esquerda (M1. Data quality, M3. Service utilization, M4. Coverage…). Uma métrica é **o que se mede** — ex.: *Number of services reported*, *Actual vs expected service volume*, *Coverage*.

Para uma tendência de volume de serviços, abra **M3. Service utilization** e escolha uma métrica como **Number of services reported**. Clique em **Next**.

<h2 class="step-h"><span class="step-n">3</span><span>Escolher um gráfico pré-definido</span></h2>

Verá uma grelha de **presets** — gráficos prontos. Escolha **Service volume over time (monthly)** — um gráfico de linhas do volume mensal por indicador. Clique em **Create**.

![Etapa Presets — cinco presets nomeados mais Custom, cada um com uma miniatura h:280](../../../resources/screenshots/m9c/create_viz_presets.png)

O seu gráfico é criado e aparece na lista **Visualizations**. Use a vista **By folder** para o colocar na sua pasta.

> Os outros presets dão gráficos de **barras** trimestrais ou anuais. **Custom → Configure manually** permite escolher o tipo de gráfico (tabela, série temporal, barras, mapa) e como decompor os dados — ver a secção seguinte.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Filtrar vs desagregar — qual é a diferença?

Estas duas palavras surgem muito. Não são o mesmo:

- **Filtrar = escolher o que mostrar.** Escolha os indicadores, locais ou meses que quer — só esses aparecem. ex.: *mostrar só CPN1*, ou *só a região Norte*. Como um foco de luz: aponta-o para o que quer ver.
- **Desagregar = decompor.** Dividir um total nas suas partes para as poder comparar — ex.: *uma linha por indicador*, ou *uma barra por distrito*. Nada é ocultado; o total é mostrado nas suas partes.

![Filtrar = escolher o que mostrar: marque CPN1 e só CPN1 aparece h:140](../../../resources/diagrams/m9c_filter.svg)

![Desagregar "CPN1 por distrito" mostrado de quatro formas — Lines, Grid, Rows, Columns h:195](../../../resources/diagrams/m9c_disaggregate.svg)

> **Exemplo.** Comece com *total de visitas CPN1, a nível nacional*. **Filtre** para a "região Norte" → agora vê só o CPN1 do Norte. **Desagregue** "por distrito" → o mesmo total dividido numa barra (ou linha) por distrito.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Onde faz isto quando edita uma visualização

Abra uma visualização guardada — os controlos estão no **painel esquerdo**, e muitas vezes terá de **descer (scroll)** para os encontrar (é aqui que as pessoas se perdem). Duas secções fazem o trabalho:

- **Filter (subset)** — **escolha o que quer ver**: marque **Time period**, **Indicator** e o nível administrativo. Só os valores marcados aparecem.
- **Display (disaggregate)** — escolha **como as partes são mostradas**. A lista pendente dá cinco opções:
  - **Lines** — uma linha por parte, todas no mesmo gráfico
  - **Grid** — um pequeno gráfico separado para cada parte, lado a lado
  - **Rows** — uma linha de tabela por parte
  - **Columns** — uma coluna de tabela por parte
  - **Multi-chart (replicants)** — um gráfico em tamanho real por parte, empilhados

![O painel esquerdo do editor de visualizações — desça até "Filter (subset)" e "Display (disaggregate)" h:400](../../../resources/screenshots/m9c/edit_viz_panel.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

> **Atenção quando usa os dois em conjunto.** Eis a armadilha, com um exemplo. Dividiu um gráfico **por distrito** porque quer comparar os distritos. Depois **filtra-o** para apenas um distrito — e os outros desaparecem. Agora está a olhar para um único distrito isolado, e não resta nada para comparar.
>
> **A regra simples:** use o **filter** para escolher os dados que quer ver, e use o **disaggregate** para os dividir nas partes que quer comparar. Só não filtre até ficar com apenas uma das coisas que queria comparar.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Experimente algumas opções

Repita com uma métrica ou preset diferente — uma métrica de cobertura em **M4**, ou o gráfico de barras de mudança trimestral — para ver como cada um se lê.

> **Dica:** os gráficos de linhas (*Service volume over time*) são melhores para tendências ao longo do tempo. Os gráficos de barras (*quarterly / annual change*) são melhores para comparar períodos ou locais. A ficha de referência *Como ler uma visualização FASTR* aprofunda o tema.

## Verifique-se

Deverá ter agora:

- Pelo menos um gráfico criado e visível na sua lista **Visualizations**
- O caminho na memória: **+ Create visualization → Metric → Presets → Create**
- Uma noção de que presets servem para tendências vs comparações

## A seguir

A próxima atividade faz o mesmo com o Assistente de IA — escrevendo um pedido em linguagem comum em vez de percorrer o construtor. Mesmo resultado, caminho diferente.

> 🔎 **Confirme na sua interface atual**: os nomes (*+ Create visualization*, *Create*) podem diferir ligeiramente. O caminho **Metric → Presets → Create** é a estrutura-chave.
