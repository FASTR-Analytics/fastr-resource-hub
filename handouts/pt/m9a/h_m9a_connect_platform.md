---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Configuração da instância"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Antes de começar

<p class="meta-line"><strong>Configuração da instância</strong> · <strong>~5 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">O que precisa de ter à mão</p>

- ☐ A sua **Lista de verificação de preparação de dados FASTR** (preenchida — folha *Modelo de mapeamento de indicadores*). [Descarregar o modelo em branco](https://github.com/FASTR-Analytics/fastr-resource-hub/raw/main/resources/checklists/FASTR_data_prep_checklist_en.xlsx)
- ☐ O URL da sua instância DHIS2 (o que a sua equipa usa, ex.: `https://hmis.yourcountry.gov`)
- ☐ O seu nome de utilizador DHIS2
- ☐ A sua palavra-passe DHIS2
- ☐ Um navegador aberto numa rede estável

</aside>
<div class="p1-main">

## O que vem a seguir

Vai percorrer quatro fichas, por ordem:

1. **Importar a estrutura de unidades** — extrair a hierarquia administrativa do seu país e a lista de unidades sanitárias do DHIS2
2. **Importar e mapear indicadores** — definir o que monitorizar e ligá-los aos nomes dos indicadores no DHIS2
3. **Importar dados do HMIS** — extrair os valores de dados propriamente ditos
4. **Verificar e explorar** — confirmar que tudo foi carregado corretamente

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Sobre as credenciais DHIS2

Não existe um passo de «ligação» separado. Na primeira vez que despoletar uma importação (áreas administrativas, indicadores ou dados do HMIS), a plataforma mostra um pequeno formulário:

- URL do DHIS2
- Nome de utilizador do DHIS2
- Palavra-passe do DHIS2
- ☐ Guardar credenciais para esta sessão

> **Dica:** marque **Guardar credenciais para esta sessão** no primeiro pedido. A plataforma memoriza a sua ligação ao DHIS2 até terminar sessão — não precisa de reintroduzir nas importações seguintes.

## Como usar estas fichas

Cada ficha começa com uma secção «Antes de começar» que lista o que já deve estar feito. Leia-a primeiro — não salte etapas, a ordem importa.

## A seguir

Avance para **Importar a estrutura de unidades**.
