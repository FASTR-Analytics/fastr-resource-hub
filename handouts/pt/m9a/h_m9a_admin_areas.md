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

- ☐ Leu **Antes de começar** (URL do DHIS2 + credenciais conhecidas)
- ☐ Sabe que nível da hierarquia DHIS2 corresponde a *unidade de saúde* (frequentemente o nível 4 ou 5)

</aside>
<div class="p1-main">

## O que vai fazer

Extrair o registo de unidades do seu país — cada unidade com a sua região e distrito — diretamente do DHIS2 para o FASTR. As áreas administrativas são **derivadas automaticamente das linhas de unidades**: nunca gere as áreas separadamente. Depois disto, qualquer análise pode desagregar resultados por região, distrito ou unidade.

<h2 class="step-h"><span class="step-n">1</span><span>Abrir o registo de Unidades</span></h2>

1. Clique em **Dados** na barra superior. A página está organizada nas secções **Geral**, **HMIS**, **HFA** e **ICEH**.
2. Na secção **HMIS**, clique no cartão **Unidades**.

![h:180](../../../resources/screenshots/m9a_setup/20_data_page.png)

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Importar do DHIS2</span></h2>

Inicie uma importação DHIS2 a partir da página de Unidades. Aparece a **ligação DHIS2 guardada** — a que foi configurada uma vez para toda a instância em **Gerir ligação**. Confirme-a.

> Ainda sem ligação guardada? Um administrador configura-a uma vez — URL (com `https://`), utilizador, palavra-passe — e fica guardada encriptada para toda a instância. Depois disso ninguém volta a digitar credenciais.

<h2 class="step-h"><span class="step-n">3</span><span>Selecionar o nível de unidade</span></h2>

Selecione **Unidade de saúde (Facility)**. Os módulos de análise do FASTR exigem dados ao nível da unidade — agregam das unidades para distritos e regiões, nunca ao contrário. Selecionar *Facility* traz automaticamente todos os níveis acima (distrito, região, …).

Lance a importação e aguarde a conclusão — de 30 segundos a alguns minutos, conforme o tamanho do país.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Ponto de controlo

- A página **Unidades** lista as unidades do país com as suas áreas administrativas.
- De volta à página **Dados**, o cartão Unidades mostra as contagens — unidades e áreas em cada nível. Verifique se são plausíveis para o seu país.

![h:190](../../../resources/screenshots/m9a_setup/35_hmis_facilities.png)

## O que pode correr mal

- **Lista de unidades vazia** — o utilizador DHIS2 da ligação guardada pode não ter acesso de leitura às unidades organizacionais. Confirme com o administrador do DHIS2.
- **Hierarquia com aspeto errado** — foi escolhido o nível errado. Reimporte com o nível certo; as unidades existentes são atualizadas, não duplicadas.
- **Falha de autenticação** — normalmente um URL malformado (`https://` em falta ou barra final) e não uma palavra-passe errada. Corrija em **Gerir ligação**, na página Importações.
- **Importação demorada** — países grandes (1000+ unidades) demoram mais. Aguarde pelo menos 5 minutos antes de repetir.

## O que se segue

Avance para **Importar e mapear indicadores**.
