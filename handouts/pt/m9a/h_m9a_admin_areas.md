---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuração da instância"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step current">Estrutura de unidades</span> <span class="arrow">→</span> <span class="step">Indicadores</span> <span class="arrow">→</span> <span class="step">Dados</span> <span class="arrow">→</span> <span class="step">Verificar</span></div>

# Importar a estrutura de unidades

<p class="meta-line"><strong>Configuração da instância</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Já leu **Antes de começar** (sabe o seu URL do DHIS2 + credenciais)
- ☐ Sabe que nível da sua hierarquia DHIS2 corresponde a *unidade sanitária* (frequentemente o nível 4 ou 5)

</aside>
<div class="p1-main">

## O que vai fazer

Extrair toda a hierarquia administrativa do seu país (regiões → distritos → unidades sanitárias) diretamente do DHIS2 para o FASTR. Depois disto, qualquer análise pode desagregar os resultados por região, distrito ou unidade sanitária.

<h2 class="step-h"><span class="step-n">1</span><span>Abrir o fluxo de importação</span></h2>

1. Clique no separador **Data** na navegação superior.
2. Vá a **Structure & maps**.
3. Clique em **Admin areas and facilities**.
4. Clique em **Add admin areas and facilities**.

![h:160](../../../resources/screenshots/m9a_setup/03_admin_units_menu.jpeg)

<h2 class="step-h"><span class="step-n">2</span><span>Escolher «Import from DHIS2»</span></h2>

Verá duas opções. Escolha a **segunda — Import directly from DHIS2**. (A primeira serve para carregamentos manuais a partir de uma folha de cálculo — mais lento e mais sujeito a erros.)

![h:170](../../../resources/screenshots/m9a_setup/04_import_from_dhis2.jpeg)

Clique em **Continue**.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Ligar ao DHIS2 (só na primeira vez)</span></h2>

A plataforma mostra agora um pequeno formulário de ligação ao DHIS2. Preencha três campos:

- **DHIS2 URL** — o endereço da sua instância DHIS2 (inclua `https://`)
- **DHIS2 Username**
- **DHIS2 Password**

Marque **Save credentials for this session** — não voltará a ser solicitado nas importações seguintes.

![h:220](../../../resources/screenshots/m9a_setup/02_credentials_form.jpeg)

Clique em **Confirm and continue**.

> Se já guardou as credenciais nesta sessão (ex.: numa importação anterior), este passo é ignorado automaticamente.

<h2 class="step-h"><span class="step-n">4</span><span>Selecionar o nível de unidade sanitária</span></h2>

Selecione **Facility**. Os módulos de análise do FASTR exigem dados ao nível da unidade sanitária — agregam internamente das unidades para os distritos e regiões, e não o contrário. Selecionar *Facility* traz automaticamente todos os níveis acima (distrito, região, …).

![h:160](../../../resources/screenshots/m9a_setup/05_select_facility_level.jpeg)

Clique em **Save** e depois em **Start import**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">5</span><span>Confirmar e integrar</span></h2>

- Selecione **Add new facilities and update existing ones if needed**.
- Clique em **Finalize and integrate**.

Aguarde a conclusão da importação — aparece uma barra de progresso; habitualmente de 30 seg a alguns minutos, consoante a dimensão do país.

## Ponto de verificação

Após a integração:

- A página Admin areas and facilities lista a hierarquia do seu país.
- De volta à página **Data**, o Structure & maps aparece a **verde**.

![h:200](../../../resources/screenshots/m9a_setup/06_facilities_green.jpeg)

## O que pode correr mal

- **Lista de unidades vazia** — o seu utilizador DHIS2 pode não ter acesso de leitura às unidades organizacionais. Verifique com o administrador do DHIS2.
- **A hierarquia parece errada** — escolheu o nível errado. Reimporte; a opção *update existing* mantém as alterações não destrutivas.
- **A autenticação falha** — normalmente o URL errado (sem `https://` ou com barra no fim) ou um erro na palavra-passe. Reabra o fluxo de importação para recuperar o formulário de ligação.
- **A importação fica bloqueada** — países grandes (mais de 1000 unidades) demoram mais. Aguarde pelo menos 5 min antes de tentar de novo.

> 🔎 **Confirme na sua interface atual**: a localização dos painéis e os nomes dos botões podem diferir das capturas de ecrã; o fluxo é o mesmo.

## A seguir

Avance para **Importar e mapear indicadores**.
