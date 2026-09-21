---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuração da instância"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Estrutura das unidades</span> <span class="arrow">→</span> <span class="step current">Indicadores</span> <span class="arrow">→</span> <span class="step">Dados</span> <span class="arrow">→</span> <span class="step">Verificar</span></div>

# Adicionar indicadores

<p class="meta-line"><strong>Configuração da instância</strong> · <strong>~30 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Concluiu **Ligar à plataforma** e **Importar a estrutura de unidades**
- ☐ A sua **Lista de preparação de dados FASTR** está aberta na folha *Modelo de correspondência de indicadores*: vai usar a coluna **C — INDICADOR DE INTERESSE** (ex. CPN1, CPN4) e a coluna **G — NOME OFICIAL NO DHIS2**

<p class="sb-label">Porque é importante</p>

Sem indicadores, o FASTR não sabe o que descarregar do DHIS2 nem com que nome analisá-lo.

</aside>
<div class="p1-main">

## O que vai fazer

Para cada indicador da sua lista, três gestos num só ecrã:

1. **Procurá-lo** no DHIS2, a partir do FASTR
2. **Dar-lhe um nome**: um ID curto (ex. `anc1`) e um rótulo legível (ex. «CPN 1.ª consulta»)
3. **Guardar**

Todos os indicadores vivem numa **única tabela**. Cada linha tem um tipo: **Elemento DHIS2** (obtido do DHIS2), **Carregado** (ficheiro CSV), **Soma** ou **Calculado** (uma fórmula). Aqui cria elementos DHIS2.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">1</span><span>Abrir a lista de indicadores</span></h2>

1. Clique em **Dados** na barra superior e depois, na secção **HMIS**, no cartão **Indicadores**.
2. Veja a **lista por defeito**. Cada linha mostra o **ID do indicador**, o **rótulo**, o **tipo** e a coluna **Definido por** (o código DHIS2 e o seu nome original). Se um indicador da sua lista já existir, salte-o.

![w:470](../../../resources/screenshots/indicators_v2_en/02_indicator_list.png)

> **As linhas marcadas «Especial»** são lidas pelo ID pelos módulos de análise (`anc1`, `delivery`, `bcg`…). Mantenha esses IDs: preencha-os com o código DHIS2 certo em vez de criar outros.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Pesquisar no DHIS2</span></h2>

1. Clique em **Adicionar do DHIS2**, no canto superior direito da lista. O FASTR usa a **ligação DHIS2 guardada** da instância (cartão **Ligação DHIS2** da página Dados, a mesma do passo anterior).
2. No campo de pesquisa, escreva um termo da coluna **G — NOME OFICIAL NO DHIS2** (ex. `pré-natal`) ou cole o ID DHIS2. Clique em **Pesquisar**.
3. Nos resultados, clique em **Adicionar** ao lado de cada elemento pretendido. Ele passa para a coluna **Elementos selecionados**.

![w:470](../../../resources/screenshots/indicators_v2_en/03_search_dhis2.png)

4. Pesquise outro termo se necessário; a seleção mantém-se. Depois clique em **Seguinte: nomear indicadores (N)**.

> **Dica:** uma palavra ampla (`vacina`, `parto`) traz toda a família de uma vez. As linhas a cinzento «Não pode ser adicionado» não são contagens mensais. **Subgrupo** (faixa etária, sexo)? Abra a **seta** da linha e adicione a linha **COC** pretendida, não a linha principal.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Nomear e guardar</span></h2>

O FASTR propõe um **ID** e um **rótulo** para cada elemento, a partir do nome DHIS2. Substitua-os:

- **ID do indicador**: o nome técnico. **Só minúsculas, algarismos e sublinhados**, sem acentos nem espaços (ex. `mam_novo`). Para um indicador da lista FASTR, use o seu ID padrão (`anc1`, `anc4`, `penta1`…).
- **Rótulo**: o nome mostrado nos gráficos. Acentos e espaços são permitidos; use a coluna **C — INDICADOR DE INTERESSE**.

![w:470](../../../resources/screenshots/indicators_v2_en/04_name.png)

Clique em **Guardar**. Repita os passos 2 e 3 até cobrir toda a lista.

## Ponto de controlo

De volta à lista, cada novo indicador aparece com o distintivo **Elemento DHIS2**, o seu código DHIS2 em **Definido por** e um visto em **Incluir**. O contador **Indicadores (N)** aumentou na mesma medida.

![w:400](../../../resources/screenshots/indicators_v2_en/05_check.png)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## O que pode correr mal

- **«… já existe; escolha outro identificador»**: o ID está ocupado. Abra o indicador existente com o lápis e altere o código DHIS2, ou escolha outro ID.
- **«Já adicionado como …»**: esse código DHIS2 já está no FASTR. Nada a criar.
- **O ID é rejeitado**: acento, espaço, vírgula, parêntese reto ou palavra reservada. Minúsculas, algarismos, sublinhados.
- **A pesquisa DHIS2 não devolve nada**: outro termo, ou verifique se o utilizador DHIS2 da ligação lê os metadados.
- **«Nenhuma ligação DHIS2 guardada»**: página **Dados**, cartão **Ligação DHIS2**, introduza o URL e as credenciais.
- **Dois códigos DHIS2 para um mesmo indicador** (duas faixas etárias a somar): adicione ambos como elementos e depois **Criar** → tipo **Soma**.

## O que se segue

Os indicadores estão definidos, mas **ainda não foi descarregado nenhum número**. Passe a **Importar dados do HMIS**.
