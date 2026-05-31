---
marp: true
theme: fastr
paginate: true
---

## Por que ajustar para outliers?

Um único valor extremo - digamos, um pico de 10× no relatório causado por um erro de entrada de dados - pode distorcer a tendência de serviço subjacente para toda uma instalação. O gráfico mostra os mesmos dados antes e depois do ajuste de outliers: o pico é removido, o padrão subjacente é preservado.

![Outlier impact h:340](../../resources/diagrams/outlier_impact.svg)

<!--
NOTAS DO APRESENTADOR:
- Painel esquerdo: dados em bruto com o pico causado pelo erro de introdução de dados.
- Painel da direita: a mesma série após o ajuste de outlier utilizando médias móveis.
- Ponto-chave: a tendência é preservada, apenas o artefacto é removido.
- É por esta razão que as estimativas de utilização de serviços e de cobertura a jusante se tornam mais fiáveis.
-->
