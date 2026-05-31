---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Saída de deteção de outlier

<div class="output-layout">
<div class="output-viz">

![Outliers output](../../resources/default_outputs/Default_1._Proportion_of_outliers.png)

</div>
<div class="output-text">

**O que você vê:** Mapa de calor mostrando a proporção de valores sinalizados como discrepantes por indicador e região.

**Fórmula:** % de valores atípicos = (valores sinalizados / valores totais) × 100

**Interpretação:** Taxas elevadas podem indicar erros de introdução de dados ou eventos legítimos, como campanhas. Rever os registos das instalações para distinguir entre os dois.

</div>
</div>

<!--
NOTAS DO APRESENTADOR:
- A presença de outliers examina se um ponto de dados numa série de valores é extremo (seja anormalmente alto ou baixo) em relação a outros na série
- Os outliers podem ser o resultado de mudanças nas actividades programáticas (como uma campanha intensificada) ou podem ser problemas de qualidade dos dados
- Para a análise FASTR, identificamos os valores anómalos que são valores suspeitosamente elevados em comparação com o volume habitual de serviços comunicados pelo estabelecimento (por exemplo, os valores baixos não são identificados como anómalos na análise FASTR)
- Os valores anómalos são identificados através da avaliação da variação dentro da unidade de saúde nos relatórios mensais para cada indicador
- Um outlier é definido como: Um valor superior a 10 vezes o desvio médio absoluto (DMA) do valor mediano mensal para o indicador em cada período de tempo, OU um valor para o qual a contribuição proporcional em volume para uma instalação, indicador e período de tempo é superior a 80%
- E para o qual: O volume é maior ou igual à mediana, o volume não está em falta, e o volume é maior que 100
- Para a análise FASTR, o período de tempo considerado para identificar os valores atípicos utilizando a abordagem MAD abrange todo o conjunto de dados. Isto significa que, se o conjunto de dados incluir cinco anos de dados, o valor mediano para cada indicador será calculado ao longo de todo o período de cinco anos
- Para a análise FASTR, a abordagem de afetação proporcional para identificar os valores anómalos é aplicada numa base de ano civil. Isto significa que todos os dados do ano de 2024 serão utilizados para avaliar a contribuição proporcional dos volumes de serviço comunicados em 2024. Se a análise for efectuada a meio do ano, apenas serão considerados os dados disponíveis até esse momento, o que poderá levar a que os dados de um ano parcial sejam utilizados na avaliação
- Isto restringe a análise FASTR a valores anómalos, que são valores suspeitosamente elevados em comparação com o volume habitual de serviços comunicados por um estabelecimento
- Os dados em falta num sistema DHIS2 podem dever-se à não comunicação ou à comunicação de zero serviços prestados (os zeros não são frequentemente armazenados no DHIS2). Não podemos distinguir entre dados em falta devido à não comunicação e dados em falta devido à comunicação de zero serviços. Como tal, os valores em falta são excluídos da análise
- Restringimos a deteção de valores atípicos a volumes de serviços superiores a 100, uma vez que tal ajuda a concentrarmo-nos em dados significativos, estáveis e operacionalmente importantes. Reduz o ruído devido à volatilidade dos pequenos volumes e concentra-se nos valores anómalos com maior impacto (por exemplo, os grandes volumes são susceptíveis de ter implicações mais significativas na análise)
-->
