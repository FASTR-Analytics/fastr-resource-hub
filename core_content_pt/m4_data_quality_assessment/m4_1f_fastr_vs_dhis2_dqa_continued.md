---
marp: true
theme: fastr
paginate: true
---

## Como é que a análise da qualidade dos dados FASTR difere da análise DQA feita no DHIS2?

<div style="font-size: 0.8em;">

**Continuação da seleção de indicadores, medidas e limiares**

O objetivo da avaliação da qualidade dos dados orienta a seleção de indicadores, medidas e limiares.

- A DQA do DHIS2 avalia quatro medidas de consistência interna: presença de valores atípicos, consistência ao longo do tempo, consistência entre indicadores relacionados e consistência entre os dados comunicados e os registos originais (esta métrica requer uma avaliação do local/recolha de dados). O FASTR centra-se em duas destas medidas: presença de valores anómalos e consistência entre indicadores relacionados, uma vez que são importantes para a análise e podem ser efectuadas de forma rotineira e remota, sem visitas às unidades de saúde.

- O FASTR e o DHIS2 DQA utilizam métodos diferentes de deteção de valores atípicos (DMA vs. desvios-padrão); o FASTR centra-se na identificação de valores atípicos MUITO grandes que têm uma influência indevida na análise e para os quais serão feitos ajustamentos; o DHIS2 DQA centra-se na identificação de valores atípicos que devem ser acompanhados ao nível da unidade de saúde, sem impacto negativo significativo mesmo que alguns valores corretos sejam assinalados como potenciais valores atípicos, uma vez que estes serão investigados mais aprofundadamente.

- A DQA do DHIS2 pode avaliar a concordância com fontes de dados externas, tais como inquéritos periódicos à população e a consistência dos dados da população que servem de denominador para a análise da cobertura. O FASTR não inclui isto na avaliação da qualidade dos dados, mas incorpora-o na nossa análise de cobertura.

</div>
