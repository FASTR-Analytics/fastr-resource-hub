---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Como funciona a deteção de interrupções

<div class="output-layout">
<div class="output-text">

A análise prossegue em quatro etapas. Em primeiro lugar, **utilizamos dados anteriores para definir expectativas**, examinando vários anos de dados históricos para compreender o padrão típico de cada mês, tendo em conta as alterações sazonais regulares.

Em segundo lugar, **detectamos alterações invulgares** comparando os volumes de serviço actuais com estas expectativas. Os volumes que são muito superiores ou inferiores ao esperado são assinalados como alterações invulgares que requerem investigação.

Em terceiro lugar, **tratamos de perturbações passadas** ajustando os dados históricos para eliminar alterações anteriores grandes e inesperadas. Isto garante que os eventos pontuais não distorcem a nossa compreensão do que constitui uma prestação de serviços "normal".

Em quarto lugar, **detectamos as perturbações ao longo do tempo** examinando as tendências para identificar mudanças claras na utilização dos serviços de saúde ao longo de vários meses, distinguindo entre flutuações temporárias e mudanças sustentadas.

</div>
<div class="output-viz">

![Deteção de perturbações](../../resources/diagrams/disruption_chart.png)

</div>
</div>

<!--
NOTAS DO APRESENTADOR:
1. Usando dados passados para definir expectativas: Começamos por analisar os dados dos serviços de saúde dos últimos anos para compreender o padrão típico de cada mês. Por exemplo, se virmos que certos serviços costumam ter volumes mais altos ou mais baixos durante determinados meses, usamos esse padrão para ajudar a definir as expectativas "normais" para cada mês no futuro. Este passo ajuda-nos a ter em conta as alterações sazonais regulares, como um aumento das consultas relacionadas com a gripe durante os meses de inverno.
2. Detetar alterações invulgares: Assim que soubermos o que é "normal", podemos comparar os volumes de serviço actuais com essas expectativas. Se virmos que o número de pessoas que utilizam um determinado serviço de saúde é muito superior ou inferior ao esperado, consideramos que se trata de uma alteração invulgar. Isto pode dever-se a factores como uma epidemia, uma catástrofe natural ou mesmo alterações na política de cuidados de saúde.
3. Lidar com perturbações passadas: Para manter a precisão da nossa análise, ajustamos os nossos dados históricos removendo grandes alterações inesperadas anteriores. Isto garante que os eventos pontuais do passado não distorcem a nossa compreensão do que é "normal" atualmente.
4. Detetar perturbações ao longo do tempo: Por último, analisamos as tendências ao longo do tempo para ver se existem mudanças claras na utilização dos serviços de saúde. Por exemplo, se houver uma queda nas vacinações de rotina durante vários meses, podemos identificar esse facto como uma perturbação a longo prazo. Ao monitorizar estas tendências, temos uma melhor noção se as mudanças são apenas sazonais ou se podem dever-se a problemas maiores e duradouros que precisam de atenção.
-->
