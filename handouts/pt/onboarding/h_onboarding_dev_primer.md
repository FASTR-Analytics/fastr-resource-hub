---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Primer técnico"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Primer técnico</span>

# FASTR para programadores

<p class="meta-line"><strong>Um mapa de alto nível dos dados, do pipeline e do vocabulário</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">O que é o FASTR</p>

**F**requent **A**ssessments and **S**ystem **T**ools for **R**esilience — a abordagem da GFF à análise de ciclo rápido e ao uso de dados.

<p class="sb-label">Numa frase</p>

Um **pipeline de dados** que extrai registos de saúde mensais de rotina de uma base de dados nacional, os limpa, e os transforma em estimativas fiáveis sobre se as pessoas estão a receber os cuidados de que precisam.

<p class="sb-label">Modelo mental</p>

ETL → validar → transformar → KPI. Os termos de saúde assentam sobre engenharia de dados padrão — são etiquetas de domínio, nada mais.

</aside>
<div class="p1-main">

## A forma geral

```
DHIS2                  Dados HMIS           Módulos FASTR            Resultados
(base de origem)   →   (contagens em   →    (etapas do pipeline) →   (estimativas limpas,
 uma linha por          bruto)               M1 → M2 → M3             gráficos, % cobertura)
 unidade ×                                    M5 → M6
 indicador ×
 mês
```

- **DHIS2** — a base de dados de produção do país para dados de saúde. Aplicação web + API REST. Apenas de leitura no que toca ao pipeline.
- **Dados HMIS** — o que extraímos: **contagens de serviços mensais** de rotina, um número por unidade, por indicador, por mês.
- **Módulos** — etapas do pipeline. Cada uma lê o resultado da etapa anterior; as dependências formam um DAG.
- **Resultados** — CSVs e gráficos que as equipas de saúde usam para tomar decisões.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Os dados</span>

## De onde vêm os dados: DHIS2

O **DHIS2** é uma plataforma de código aberto que a maioria dos países de rendimento baixo e médio usa como armazém nacional de dados de saúde de rotina — efetivamente a **base de dados de produção fonte da verdade**.

- Cada clínica e hospital (uma **unidade sanitária**) reporta números todos os meses
- Os dados são indexados por **unidade × indicador × mês**
- São extraídos via **API** do DHIS2 (ou uma exportação CSV) para uma tabela plana — os **dados HMIS** (`hmis_XXX.csv`, onde `XXX` é o código do país)

![Um painel do DHIS2 h:300](../../../resources/screenshots/dhis2_demo_dashboard.png)

<p style="text-align:center; font-size:8.5pt; color:#6b7280; margin-top:-0.2em;">Uma instância do DHIS2 — a demonstração pública (dados de exemplo da Serra Leoa). É deste tipo de sistema que os dados são extraídos.</p>

> **Contagens, não percentagens.** O pipeline ingere **contagens em bruto** — *«152 crianças receberam Penta1 nesta unidade em março de 2024»* — nunca *«92% de cobertura.»* As contagens podem ser somadas entre unidades e permitem que a deteção de valores atípicos funcione sobre a magnitude; as percentagens não.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Os dados</span>

## O que é um «indicador»

Na saúde global, um **indicador** é uma variável definida e mensurável usada para monitorizar um sistema de saúde — para acompanhar a prestação de serviços, a cobertura ou os resultados de saúde ao longo do tempo e entre lugares, e para informar decisões. É um substituto padronizado: não se consegue medir «a saúde materna está a melhorar?» diretamente, por isso acompanha-se algo contável que faça as suas vezes.

Nos dados HMIS de rotina, cada indicador é um evento de serviço específico que as unidades registam e reportam mensalmente. (Para um programador: pense nele como uma métrica acompanhada — um evento nomeado e contado, como um tipo de evento em análise de produto.) O FASTR centra-se num pequeno conjunto central de indicadores **SRMNIA-N** de alto volume (saúde reprodutiva, materna, neonatal, infantil, do adolescente + nutrição):

<span class="data-pill data-pill-green">CPN1</span> <span class="data-pill data-pill-green">CPN4</span> <span class="data-pill data-pill-navy">Parto institucional</span> <span class="data-pill data-pill-navy">CPP1</span> <span class="data-pill data-pill-gold">BCG</span> <span class="data-pill data-pill-gold">Penta1</span> <span class="data-pill data-pill-gold">Penta3</span> <span class="data-pill data-pill-deep-green">Consultas externas</span>

| Indicador | Em português simples |
|-----------|---------------|
| **CPN1 / CPN4** | A 1.ª / 4.ª consulta pré-natal (antes do parto) de uma mulher grávida |
| **Parto institucional** | Um parto que ocorreu numa unidade sanitária |
| **CPP1** | Primeira consulta pós-parto (após o nascimento) |
| **BCG** | Vacina da tuberculose, dada à nascença |
| **Penta1 / Penta3** | 1.ª / 3.ª dose da vacina infantil 5 em 1 |
| **Consultas externas** | Visitas em ambulatório — um substituto do uso geral de serviços de saúde |

<div class="callout-footer">Escolhidos pelo elevado volume de reporte e porque fazem as vezes de muitos outros serviços prestados na mesma visita. Os países acrescentam os seus por cima.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">O pipeline</span>

## O que os módulos fazem

Cada módulo é uma etapa. Correm **por ordem**, e cada um consome o resultado dos anteriores — a `→` é uma dependência de dados real.

<h2 class="step-h"><span class="step-n">1</span><span>M1 — Avaliação da qualidade dos dados (AQD)</span></h2>

Validação + deteção de anomalias. Sinaliza **valores atípicos** (uma contagem muito fora de linha com o próprio histórico da unidade) e lacunas de **completude** (meses em que uma unidade não reportou). Apenas de leitura — rotula problemas, não altera nada.

<h2 class="step-h"><span class="step-n">2</span><span>M2 — Ajustamento da qualidade dos dados</span></h2>

A etapa de correção. Consome as marcações do M1 e **repara** os dados — substitui valores atípicos, preenche lacunas com estimativas estatísticas — para que a matemática a jusante não seja enviesada por entradas más. Emite o conjunto de dados ajustado.

<h2 class="step-h"><span class="step-n">3</span><span>M3 — Utilização de serviços</span></h2>

Análise de tendências: os serviços estão a subir ou a descer? Usa regressão para medir tendências e detetar **perturbações** (ex.: uma queda nas visitas após um corte de financiamento ou um choque).

<h2 class="step-h"><span class="step-n">4</span><span>M5 → M6 — Estimativas de cobertura</span></h2>

**Cobertura** = a proporção das pessoas que *precisavam* de um serviço e que efetivamente o receberam. Exemplo: 8 000 bebés num distrito receberam a vacina do sarampo, e vivem ali cerca de 10 000 bebés → ~80% de cobertura.

O número de cima (8 000) é uma **contagem** que já temos. O número de baixo (10 000 — a **população-alvo**) *não* está nos dados: nenhum sistema reporta «quantos bebés existem». Estimar esse denominador é a parte difícil, e é toda a tarefa do M5 — deriva-o dos dados HMIS, de inquéritos domiciliares e de projeções populacionais da ONU. O **M6** calcula então a % de cobertura e preenche as lacunas entre os anos de inquérito.

<div class="callout-footer">M1 validar → M2 corrigir → M3 tendências → M5/M6 cobertura. (O M4 é o módulo de cobertura mais antigo, a ser substituído pelo M5+M6.)</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Referência</span>

## Descodificador de jargão

| Termo | Significado |
|------|---------|
| **DHIS2** | Base de dados nacional de saúde de onde o pipeline lê (tem uma API) |
| **HMIS** | Health Management Information System — os dados de rotina em si |
| **Unidade (sanitária)** | Uma clínica ou hospital — uma fonte de reporte |
| **Indicador** | Um evento de saúde contado (uma métrica) |
| **Contagem / volume** | Número em bruto de eventos. A entrada. Nunca uma % |
| **Área administrativa** | Nível geográfico: nacional → região → distrito → posto |
| **Valor atípico** | Uma contagem implausivelmente alta face ao próprio histórico da unidade |
| **Completude** | Se uma unidade reportou de todo num dado mês |
| **Cobertura** | % da população-alvo que recebeu um serviço (um KPI) |
| **Denominador** | A população-alvo (ex.: todas as mulheres grávidas) — estimada, não contada |
| **SRMNIA-N** | O domínio de saúde: saúde reprodutiva, materna, neonatal, infantil, do adolescente + nutrição |
| **Perturbação** | Uma queda significativa no volume de serviços (choque, corte de financiamento, etc.) |
| **Módulo (Mx)** | Uma etapa no pipeline |

## Aprofundar

- **Documentação de metodologia** — uma página por módulo do pipeline (AQD, ajustamento, utilização de serviços, cobertura), com toda a lógica e parâmetros
  <br>Ler: [FASTR-Analytics.github.io/fastr-resource-hub](https://FASTR-Analytics.github.io/fastr-resource-hub/) · Fonte: [github.com/FASTR-Analytics/fastr-resource-hub](https://github.com/FASTR-Analytics/fastr-resource-hub/tree/main/methodology)
- **Código-fonte dos módulos do pipeline** — cada módulo (`m001`…`m006`) inclui um `definition.json` (entradas, parâmetros, saídas) e um `script.R` (a lógica)
  <br>[github.com/FASTR-Analytics/modules](https://github.com/FASTR-Analytics/modules)
