---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuração da instância"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Estrutura de unidades</span> <span class="arrow">→</span> <span class="step current">Indicadores</span> <span class="arrow">→</span> <span class="step">Dados</span> <span class="arrow">→</span> <span class="step">Verificar</span></div>

# Importar e mapear indicadores

<p class="meta-line"><strong>Configuração da instância</strong> · <strong>~30 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Concluiu **Ligar à plataforma** e **Importar a estrutura de unidades**
- ☐ A sua **Lista de verificação de preparação de dados FASTR** está aberta na folha *Modelo de mapeamento de indicadores* — vai usar a coluna **C — INDICATOR OF INTEREST** (ex.: CPN1, CPN4) e a coluna **G — OFFICIAL INDICATOR NAME IN DHIS2**

<p class="sb-label">Porque é importante</p>

Sem o mapeamento, o FASTR consegue extrair os dados mas não saberá como compará-los entre países ou análises.

</aside>
<div class="p1-main">

## O que vai fazer

Configurar os indicadores em três rondas:

1. **Criar indicadores comuns** — nomes genéricos que o FASTR usa internamente (ex.: `anc1`, `anc4`)
2. **Importar indicadores do DHIS2** — os nomes específicos do país, do seu DHIS2 (ex.: «Antenatal client 1st visit»)
3. **Mapear** cada indicador DHIS2 ao indicador comum correspondente

</div>
</div>

---

<h2 class="step-h"><span class="step-n">1</span><span>Criar indicadores comuns</span></h2>

1. Na secção **Data** (painel esquerdo), clique em **Indicators**.

   ![h:160](../../../resources/screenshots/m9a_setup/07_indicators_page.jpeg)

2. Consulte a **lista de indicadores predefinidos** — se os seus indicadores já lá estiverem, avance para a Fase 2. Pode renomear um predefinido através do ícone de lápis, se necessário.
3. Para adicionar um novo, clique em **Create common indicator** (canto superior esquerdo).
4. No formulário, preencha:
   - **Common ID** — o nome da variável. **Sem acentos, sem espaços**. São permitidos sublinhados (ex.: `mam_nouveau`).
   - **Label** — o nome a apresentar (acentos e espaços permitidos; use a coluna **C — INDICATOR OF INTEREST** do seu *Modelo de mapeamento de indicadores*).

   ![h:200](../../../resources/screenshots/m9a_setup/08_create_common_form.jpeg)

5. **Repita para cada indicador** do seu *Modelo de mapeamento de indicadores*.

---

<h2 class="step-h"><span class="step-n">2</span><span>Importar os nomes dos indicadores do DHIS2</span></h2>

1. Clique em **Import DHIS2 indicator**.

   ![h:160](../../../resources/screenshots/m9a_setup/09_import_dhis2_btn.jpeg)

> A **ligação DHIS2 guardada** da instância é usada automaticamente. Se ainda não existir, adicione-a uma vez em **Gerir ligação**, na página Importações — os mesmos campos de *Importar a estrutura de unidades*.

2. No campo de pesquisa, escreva um termo da coluna **G — OFFICIAL INDICATOR NAME IN DHIS2** do seu *Modelo de mapeamento de indicadores* (ex.: `antenatal` para cuidados pré-natais).
3. Clique em **Search**. Os resultados aparecem na lista.
4. Clique no ícone **Add** ao lado de cada indicador que pretende. A coluna da direita («Selected») vai-se preenchendo.

   ![h:200](../../../resources/screenshots/m9a_setup/10_dhis2_search_results.jpeg)

5. Repita para cada indicador (pesquise outro termo conforme necessário). Quando terminar, clique em **Save Selected (N)** no canto superior direito.

> **Dica:** pesquise termos abrangentes (ex.: `vaccine`, `delivery`) para ver todos os indicadores DHIS2 relacionados de uma vez — mais fácil do que pesquisar um a um.

---

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Mapear indicadores DHIS2 a indicadores comuns</span></h2>

Para cada indicador DHIS2 importado, ligue-o ao seu correspondente comum:

1. Clique no **ícone de lápis (editar)** ao lado do indicador DHIS2.
2. No painel que abre, clique no **ícone +** em *Associated common indicators*.

   ![h:200](../../../resources/screenshots/m9a_setup/11_mapping_panel.jpeg)

3. Selecione o indicador comum correspondente na lista pendente.
4. Clique em **Save**.
5. **Repita para cada indicador DHIS2.**

## Ponto de verificação

Ao voltar à página de indicadores, deverá ver cada indicador DHIS2 com o respetivo indicador comum mapeado ao lado.

![h:200](../../../resources/screenshots/m9a_setup/12_all_mapped.jpeg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## O que pode correr mal

- **«Common ID rejected»** — o ID contém um espaço, acento ou carácter especial. Use apenas letras minúsculas + sublinhados.
- **A pesquisa DHIS2 não devolve nada** — experimente outro termo, ou verifique se o seu utilizador DHIS2 tem acesso aos metadados do indicador.
- **Nenhum indicador comum correspondente na lista** — volte à Fase 1 e crie-o primeiro.
- **Mesmo indicador DHIS2 mapeado a dois indicadores comuns** — normalmente errado. Cada indicador DHIS2 deve mapear-se a exatamente um indicador comum.

> 🔎 **Confirme na sua interface atual**: os nomes dos botões e a localização dos painéis podem diferir; o fluxo é o mesmo.

## A seguir

Com as unidades e os indicadores no lugar, está pronto para extrair os valores de dados. Avance para **Importar dados do HMIS**.
