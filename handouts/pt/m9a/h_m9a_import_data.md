---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuração da instância"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Estrutura de unidades</span> <span class="arrow">→</span> <span class="step done">Indicadores</span> <span class="arrow">→</span> <span class="step current">Dados</span> <span class="arrow">→</span> <span class="step">Verificar</span></div>

# Importar dados do HMIS

<p class="meta-line"><strong>Configuração da instância</strong> · <strong>~25 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Unidades importadas (a página de unidades administrativas está verde)
- ☐ Indicadores importados e mapeados (cada indicador DHIS2 tem ligação a um indicador comum)
- ☐ Já decidiu que **período temporal** extrair (ex.: últimos 36 meses — discuta com a sua equipa)

</aside>
<div class="p1-main">

## O que vai fazer

Extrair os valores de dados reais do DHIS2 para os indicadores e o período escolhidos. Esta é a maior operação de dados da configuração — consoante a dimensão do país, pode demorar de 5 a 30 minutos a correr.

<h2 class="step-h"><span class="step-n">1</span><span>Abrir a importação de HMIS Data</span></h2>

Na página **Data**, clique em **HMIS Data** e depois em **New import**.

<h2 class="step-h"><span class="step-n">2</span><span>Escolher «Import directly from DHIS2»</span></h2>

A mesma opção que usou para as unidades. Clique em **Save**.

> Se marcou **Save credentials for this session** anteriormente (nas áreas administrativas ou nos indicadores), a plataforma ignora aqui o formulário de ligação. Caso contrário, aparece agora — os mesmos campos de antes.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Selecionar indicadores e intervalo de tempo</span></h2>

- Marque todos os indicadores para os quais quer dados.
- Defina o **intervalo de tempo** com o cursor — seja criterioso (3 anos de dados mensais ≈ 36 períodos × N unidades, o que cresce depressa).

![h:200](../../../resources/screenshots/m9a_setup/13_select_indicators_period.jpeg)

Clique em **Save selection**.

<h2 class="step-h"><span class="step-n">4</span><span>Configurar o tratamento de erros</span></h2>

No ecrã de configuração da importação, certifique-se de que **Abort the entire import attempt** está selecionado. Isto garante a integridade dos dados: se alguma combinação indicador-período falhar, *toda* a importação é revertida. Não fica com dados meio carregados.

Clique em **Start fetching from DHIS2**.

![h:200](../../../resources/screenshots/m9a_setup/14_abort_start_fetching.jpeg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">5</span><span>Acompanhar o progresso</span></h2>

Um indicador de progresso mostra a contagem corrente das combinações indicador-período obtidas.

> ⚠ **Não feche o separador.** A extração corre na sessão do seu navegador.

<h2 class="step-h"><span class="step-n">6</span><span>Rever o resumo</span></h2>

Quando a extração terminar, clique em **Import Summary** para ver:

- Fonte (URL do DHIS2)
- Data
- Extrações bem-sucedidas vs falhadas
- Total de linhas a aguardar integração

![h:200](../../../resources/screenshots/m9a_setup/15_import_summary.jpeg)

<h2 class="step-h"><span class="step-n">7</span><span>Integrar</span></h2>

Se o resumo estiver correto, clique em **Integrate and finalize**. Aguarde a conclusão da barra de integração.

<h2 class="step-h"><span class="step-n">8</span><span>Arrumar</span></h2>

Clique em **Remove completed upload form** para limpar a interface. Os dados importados mantêm-se — está apenas a ocultar o formulário.

## Ponto de verificação

A página HMIS Data mostra agora os seus indicadores como um gráfico, com os valores a evoluir ao longo do tempo.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## O que pode correr mal

- **«Failed: X combinations»** — normalmente significa que uma combinação unidade-indicador não tem dados no DHIS2 para esse período. Se forem poucas, pode reimportar com um conjunto mais restrito. Se forem muitas, verifique o mapeamento de indicadores (Fase 3 de *Importar indicadores*).
- **O navegador bloqueia / o separador deixa de responder** — extrações grandes (mais de 1000 unidades × 36 meses × 10 indicadores) sobrecarregam o navegador. Reduza os indicadores ou encurte o intervalo de tempo e extraia por lotes.
- **A rede cai a meio da extração** — a definição *abort the entire import* protege-o aqui. Volte a correr com a mesma seleção.

> 🔎 **Confirme na sua interface atual**: os ecrãs de importação e os nomes podem diferir das capturas de ecrã; o fluxo é o mesmo.

## A seguir

Passo final: **Verificar e explorar** — confirme que está tudo correto e aprenda a navegar nos seus dados.
