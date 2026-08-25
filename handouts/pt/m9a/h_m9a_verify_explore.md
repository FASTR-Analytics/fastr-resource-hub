---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuração da instância"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Estrutura de unidades</span> <span class="arrow">→</span> <span class="step done">Indicadores</span> <span class="arrow">→</span> <span class="step done">Dados</span> <span class="arrow">→</span> <span class="step current">Verificar</span></div>

# Verificar e explorar a sua configuração

<p class="meta-line"><strong>Configuração da instância</strong> · <strong>~10 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Concluiu as quatro fichas anteriores (ligação / unidades / indicadores / dados)

</aside>
<div class="p1-main">

## O que vai fazer

Fazer uma verificação pontual dos dados importados, aprender a navegar no explorador de gráficos e confirmar que está tudo pronto para os módulos de análise.

<h2 class="step-h"><span class="step-n">1</span><span>Ver os dados importados como gráfico</span></h2>

Na página **HMIS Data**, os seus indicadores aparecem como séries temporais. O painel esquerdo lista cada indicador que importou.

![h:200](../../../resources/screenshots/m9a_setup/16_chart_imported.jpeg)

<h2 class="step-h"><span class="step-n">2</span><span>Ativar/desativar indicadores no gráfico</span></h2>

No painel esquerdo, **marque/desmarque** os indicadores para os mostrar ou ocultar. Útil para comparar dois ou três de cada vez sem confusão.

<h2 class="step-h"><span class="step-n">3</span><span>Ajustar a escala do eixo Y</span></h2>

Use o cursor **Scale** no fundo para alternar entre uma escala linear e um eixo Y mais amplo quando um indicador domina os restantes.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Verificar pontualmente um valor conhecido</span></h2>

Escolha um período (ex.: o mês passado) e uma unidade sanitária que conheça bem. Compare mentalmente o valor reportado pelo FASTR com o que esperaria dos seus painéis do DHIS2.

> Se coincidirem → está tudo bem. Se houver uma grande discrepância → verifique o mapeamento de indicadores (causa mais comum) antes de correr qualquer análise.

<h2 class="step-h"><span class="step-n">5</span><span>Rever o histórico de importações</span></h2>

Abra o separador **Histórico** da página Importações para ver todas as importações realizadas, e o separador **Por indicador** para os meses de dados e a última importação de cada indicador. Útil para acompanhar o que foi carregado e quando.

![h:200](../../../resources/screenshots/m9a_setup/17_previous_imports.jpeg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Ponto de verificação

De volta à página **Data**, deverá ter agora:

- ✓ Unidades administrativas e sanitárias (verde)
- ✓ Indicadores (mapeados)
- ✓ Dados do HMIS (carregados, com valores a evoluir ao longo do tempo)

Está pronto para correr os módulos de análise — qualidade dos dados, utilização de serviços, estimativa de cobertura, etc.

## O que pode correr mal

- **Todos os valores parecem planos / a zero** — o intervalo de períodos pode não coincidir com o período em que o DHIS2 tem dados. Verifique o intervalo de tempo e reimporte.
- **Alguns indicadores aparecem, outros não** — o mapeamento ficou incompleto. Volte à página de indicadores e confirme que cada indicador DHIS2 tem ligação a um indicador comum.
- **O gráfico não carrega** — experimente outro navegador; os gráficos do FASTR usam funcionalidades web modernas que navegadores antigos podem não suportar.

> 🔎 **Confirme na sua interface atual**: os controlos do gráfico e a disposição dos painéis podem diferir das capturas de ecrã; o fluxo é o mesmo.

## A seguir

Configuração concluída. Um administrador pode agora **gerar um pacote de resultados** (Resultados → Gerar novo pacote de resultados) para que os projetos usem os dados. Depois avance para **Getting Started** (M9b) para conhecer a interface da plataforma em profundidade.
