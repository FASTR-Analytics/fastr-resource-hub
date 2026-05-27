---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Visualizações & Interpretação"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Ler uma viz</span> <span class="arrow">→</span> <span class="step done">Construir manualmente</span> <span class="arrow">→</span> <span class="step done">Construir com IA</span> <span class="arrow">→</span> <span class="step done">Escrever interpretação</span> <span class="arrow">→</span> <span class="step done">Interpretação IA</span> <span class="arrow">→</span> <span class="step current">Identificar perturbação</span></div>

# Aplicação — identificar uma perturbação

<p class="meta-line"><strong>Atividade</strong> · <strong>Visualizações & Interpretação</strong> · <strong>~25 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Concluiu os 5 documentos anteriores
- ☐ Está autenticado na plataforma, dentro do projeto do seu país
- ☐ Está no separador **Visualizations**

<p class="sb-label">Porque é importante</p>

Os primeiros cinco documentos ensinaram a técnica. É aqui que a usa: abrir um gráfico de perturbações real do seu país, aplicar o quadro de seis passos, e produzir um achado que um decisor possa de facto utilizar.

</aside>
<div class="p1-main">

## O que vai fazer

Abrir o gráfico Disruptions and surpluses (national), restringi-lo a um indicador e a um período de interesse, percorrer o quadro de seis passos, e depois escrever um achado em três partes para partilhar com a sala.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">1</span><span>Encontrar o gráfico de perturbações</span></h2>

No separador **Visualizations**, mude o seletor de vista (no topo esquerdo da lista) para **By module**. Isto agrupa as visualizações pelo módulo que as produz.

Abra **M3. Service utilization**. Desça até ao grupo **Actual vs expected service volume — National**. O primeiro cartão do grupo é **Disruptions and surpluses (national)**. Clique para abrir.

![Separador Visualizations em vista By module, M3 Service utilization selecionado h:300](../../../resources/screenshots/m9c/spot_disruption_01_m3_module_list.png)

<h2 class="step-h"><span class="step-n">2</span><span>Ler a vista por defeito</span></h2>

O gráfico por defeito mostra cada indicador-base num pequeno gráfico em grelha. Duas linhas pretas atravessam cada gráfico: uma linha **contínua** para o **volume mensal observado**, e uma linha **tracejada** para o volume **esperado**, previsto a partir das tendências passadas. A área entre as duas é preenchida — **vermelha** onde o observado fica **abaixo** do esperado (uma perturbação), **verde** onde o observado fica **acima** do esperado (um excedente).

![Grelha por defeito das perturbações e excedentes, todos os indicadores visíveis h:340](../../../resources/screenshots/m9c/spot_disruption_02_all_indicators_grid.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Filtrar a um indicador</span></h2>

No separador **Data** à esquerda, encontre a secção **Filter (subset)** e marque a caixa **Indicator**. Surge uma lista de chips de indicadores (ANC1, ANC4, BCG, DELIVERY, OPD, PENTA1, PENTA3, PNC1_MOTHER, PNC1_NEWBORN). Clique num chip para filtrar o gráfico a esse indicador. Clique em mais para adicionar outros.

![Filtro Indicator expandido com a lista de chips h:340](../../../resources/screenshots/m9c/spot_disruption_03_indicator_filter_open.png)

Quando só um indicador está selecionado, a grelha colapsa num gráfico único em tamanho real. Também pode marcar **Time period** para restringir a janela temporal.

![Filtrado a ANC1, gráfico único em tamanho real h:340](../../../resources/screenshots/m9c/spot_disruption_04_filtered_anc1.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Aplicar os seis passos</span></h2>

No gráfico filtrado, percorra o quadro de seis passos do documento *Ler uma viz*:

| Passo | Para este gráfico |
|-------|-------------------|
| 1. Que indicador? | O que filtrou |
| 2. Que nível e período? | Nacional. O período que escolheu. |
| 3. O que se compara? | Volume mensal observado (linha contínua preta) vs **esperado** (linha tracejada preta, previsto a partir das tendências passadas) |
| 4. Ler os valores | Onde é que a área entre as duas linhas se enche de vermelho (observado abaixo do esperado)? Em quanto? |
| 5. O que se destaca? | Uma queda sustentada, três meses ou mais? Um pico isolado? Um padrão? |
| 6. E então? | Que ação isto sugere? |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">5</span><span>Adicionar contexto que o gráfico não mostra</span></h2>

O gráfico mostra o *quê*. A sua equipa-país traz o *porquê*. Identificado um padrão, junte o que sabe:

- Houve alguma **mudança no financiamento ou nos recursos humanos** nesse período?
- Há **lacunas conhecidas em insumos ou recursos humanos** (medicamentos, equipamento, pessoal)?
- Mesmo que os **números pareçam bons**, a qualidade dos cuidados caiu?

<h2 class="step-h"><span class="step-n">6</span><span>Escrever o seu achado</span></h2>

Use a estrutura em três partes do documento *Escrever uma interpretação*:

1. **Título** — a mensagem numa frase
2. **O que se vê** — os factos visíveis no gráfico
3. **O que significa** — o "e então", ligado a um próximo passo concreto

<h2 class="step-h"><span class="step-n">7</span><span>Partilhar com a sala</span></h2>

Quando cada equipa-país terminar, uma pessoa partilha o achado. Atenção a:

- O achado é **específico**? Um indicador, um período, uma ação.
- O "e então" está **ligado a um decisor real**?
- A equipa **trouxe contexto local** que o gráfico sozinho não mostrava?

## A observar

- **Uma queda de um único mês é, em regra, ruído.** Procure uma queda sustentada, três meses ou mais.
- **Verde não é "bom" nem vermelho é "mau".** Apenas indicam direção: verde = observado acima do esperado, vermelho = observado abaixo. Uma pequena zona vermelha de um mês é ruído normal; uma zona vermelha sustentada ao longo de vários meses é o que importa investigar.

## A seguir

Termina aqui a série *Visualizações & Interpretação*. O módulo seguinte trata da construção de relatórios — juntar os gráficos, interpretações e achados num documento partilhável.
