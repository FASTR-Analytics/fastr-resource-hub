---
marp: true
theme: fastr
paginate: true
---

## Metodologia de deteção de outlier

Os valores atípicos são identificados através da avaliação da variação dentro da instalação nos relatórios mensais para cada indicador.

Um outlier é definido como:

Um valor superior a **10 vezes o desvio médio absoluto (DMA)** do valor mediano mensal para o indicador em cada período de tempo, **OU** um valor para o qual a contribuição proporcional em volume para uma instalação, indicador e período de tempo é **superior a 80%**

**E** para o qual:

- O volume é **maior ou igual à mediana**
- O volume é **sem falta**
- O volume é **superior a 100**

<!--
NOTAS DO APRESENTADOR:
- Para a análise FASTR, o período de tempo considerado para identificar outliers usando a abordagem MAD abrange todo o conjunto de dados. Isto significa que se o conjunto de dados incluir cinco anos de dados, o valor mediano para cada indicador será calculado ao longo de todo o período de cinco anos
- Para a análise FASTR, a abordagem de afetação proporcional para identificar os valores anómalos é aplicada numa base de ano civil. Isto significa que todos os dados do ano 2024 serão utilizados para avaliar a contribuição proporcional dos volumes de serviço comunicados em 2024. Se a análise for efectuada a meio do ano, apenas serão considerados os dados disponíveis até esse momento, o que poderá levar a que os dados de um ano parcial sejam utilizados na avaliação
- Isto restringe a análise FASTR a valores anómalos, que são valores suspeitosamente elevados em comparação com o volume habitual de serviços comunicados por um estabelecimento
- Os dados em falta de um sistema DHIS2 podem dever-se à não comunicação ou à comunicação de zero serviços prestados (os zeros não são frequentemente armazenados no DHIS2). Não podemos distinguir entre dados em falta devido à não comunicação e dados em falta devido à comunicação de zero serviços. Como tal, os valores em falta são excluídos da análise
- Restringimos a deteção de valores atípicos a volumes de serviços superiores a 100, uma vez que tal ajuda a concentrarmo-nos em dados significativos, estáveis e operacionalmente importantes. Reduz o ruído devido à volatilidade dos pequenos volumes e concentra-se nos valores anómalos com maior impacto (por exemplo, os grandes volumes são susceptíveis de ter implicações mais significativas na análise)
-->
