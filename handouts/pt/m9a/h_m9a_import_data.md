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

<p class="meta-line"><strong>Configuração da instância</strong> · <strong>~15 min + tempo do servidor</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Unidades importadas (o cartão Unidades mostra as suas contagens)
- ☐ Indicadores importados e mapeados (cada indicador DHIS2 tem uma ligação a um indicador comum)
- ☐ Já decidiu o **período** a importar (p. ex., últimos 36 meses — discuta com a sua equipa)

</aside>
<div class="p1-main">

## O que vai fazer

Descarregar os valores reais do DHIS2 para os seus indicadores e período. É a maior operação de dados da configuração — conforme o tamanho do país, pode demorar 5 a 30 minutos. A importação corre **no servidor**: depois de lançada, pode fechar o separador e voltar mais tarde.

<h2 class="step-h"><span class="step-n">1</span><span>Abrir a página Importações</span></h2>

Clique em **Dados** na barra superior e, na secção **HMIS**, no cartão **Dados**. Clique em **Importações**.

A página tem quatro separadores — **Atuais**, **Futuras**, **Histórico**, **Por indicador** — e os botões **Nova importação DHIS2**, **Carregar ficheiro CSV** e **Gerir ligação**.

</div>
</div>

![h:190](../../../resources/screenshots/m9a_setup/22_imports_page.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Iniciar o assistente — Credenciais</span></h2>

Clique em **Nova importação DHIS2**. O assistente tem cinco passos: **Credenciais**, **Indicadores**, **Hora**, **Configuração**, **Rever e lançar**.

No passo **Credenciais**, aparece a ligação DHIS2 guardada. Clique em **Seguinte**.

![h:170](../../../resources/screenshots/m9a_setup/25_wizard_credentials.png)

> Ainda sem ligação guardada? Configure-a uma vez em **Gerir ligação**, na página Importações — fica guardada para toda a instância, encriptada, e ninguém volta a digitar credenciais em cada importação.

<h2 class="step-h"><span class="step-n">3</span><span>Indicadores</span></h2>

Marque todos os indicadores pretendidos — a caixa no topo seleciona tudo. Depois **Seguinte**.

![h:200](../../../resources/screenshots/m9a_setup/26_wizard_indicators.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Hora</span></h2>

Escolha **Agora** e depois **Seguinte**.

![h:140](../../../resources/screenshots/m9a_setup/27_wizard_time.png)

> **Para mais tarde:** a opção **Recorrente** agenda esta importação para se repetir sozinha — por exemplo, todos os meses. Com a configuração estável, é uma tarefa de rotina a menos.

<h2 class="step-h"><span class="step-n">5</span><span>Configuração — o intervalo de períodos</span></h2>

Defina o **intervalo de períodos** com os dois cursores. Seja deliberado: 3 anos de dados mensais ≈ 36 períodos × N unidades, e isso cresce depressa. Depois **Seguinte**.

![h:150](../../../resources/screenshots/m9a_setup/28_wizard_config.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">6</span><span>Rever e lançar</span></h2>

Confira o resumo — ligação, número de indicadores, janela e o número de pares (indicador, mês) a descarregar. Clique em **Iniciar importação**.

![h:180](../../../resources/screenshots/m9a_setup/29_wizard_review_launch.png)

<h2 class="step-h"><span class="step-n">7</span><span>Deixar o servidor trabalhar</span></h2>

A importação corre no servidor. O separador **Atuais** mostra o progresso; pode fechar o separador do navegador, trabalhar noutra coisa ou terminar sessão — a importação continua. O separador **Histórico** indica quando termina.

![h:170](../../../resources/screenshots/m9a_setup/23_imports_history.png)

## Ponto de controlo

A página de Dados HMIS mostra agora os seus indicadores num gráfico, com valores ao longo do tempo. O separador **Por indicador** lista cada indicador com os meses com dados e a última importação.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## O que pode correr mal

- **Alguns pares (indicador, mês) falharam** — a importação mantém tudo o que teve êxito; nada é anulado. Abra o separador **Por indicador** para ver os meses falhados por indicador e repetir apenas esses pares. Poucas falhas normalmente significam que não existem dados no DHIS2 para essa combinação; muitas falhas apontam para o mapeamento dos indicadores (ver *Importar indicadores*).

![h:170](../../../resources/screenshots/m9a_setup/24_imports_by_indicator.png)

- **A rede cai durante a importação** — nada a proteger do seu lado: o descarregamento corre no servidor, não no navegador. Consulte o separador Histórico mais tarde.
- **A janela era demasiado estreita** — repita o assistente com um intervalo mais largo. Os meses reimportados são simplesmente atualizados com os valores atuais do DHIS2.

## O que se segue

Último passo: **Verificar e explorar** — confirmar que está tudo em ordem e aprender a navegar nos seus dados. Depois, um administrador **gera um pacote de resultados** para que os projetos usem os novos dados.
