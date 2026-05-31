---
marp: true
theme: fastr
paginate: true
---

## Outliers

A presença de outliers examina se um ponto de dados numa série de valores é extremo (ou anormalmente alto ou baixo) em relação a outros na série.

Os outliers podem ser o resultado de mudanças nas actividades programáticas (como uma campanha intensificada) ou podem ser problemas de qualidade de dados.

Para a análise FASTR, identificamos os valores anómalos que são valores suspeitosamente elevados em comparação com o volume habitual de serviços comunicados pelo estabelecimento (por exemplo, os valores baixos não são identificados como anómalos na análise FASTR).

<!--
NOTAS DO APRESENTADOR:
- A presença de outliers examina se um ponto de dados numa série de valores é extremo (seja anormalmente alto ou baixo) em relação a outros na série
- Os outliers podem ser o resultado de mudanças nas actividades programáticas (como uma campanha intensificada) ou podem ser problemas de qualidade dos dados
- Para a análise FASTR, identificamos os valores anómalos que são valores suspeitosamente elevados em comparação com o volume habitual de serviços comunicados pelo estabelecimento (por exemplo, os valores baixos não são identificados como anómalos na análise FASTR)
- Os valores anómalos são identificados através da avaliação da variação dentro da unidade de saúde nos relatórios mensais para cada indicador
- Um outlier é definido como: Um valor superior a 10 vezes o desvio médio absoluto (DMA) do valor mediano mensal para o indicador em cada período de tempo, OU um valor para o qual a contribuição proporcional em volume para uma instalação, indicador e período de tempo é superior a 80%
- E para o qual: O volume é maior ou igual à mediana, o volume não está em falta e o volume é maior que 100
-->
