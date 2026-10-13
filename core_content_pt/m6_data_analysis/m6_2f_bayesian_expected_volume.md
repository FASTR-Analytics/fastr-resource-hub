---
marp: true
theme: fastr
paginate: true
---

## Como se constrói o volume esperado

Para cada área e mês, o modelo soma o volume esperado **apenas das unidades que reportaram nesse mês** e compara-o com o que essas mesmas unidades reportaram de facto.

<div style="font-size: 0.9em;">

| | Abordagem anterior | Abordagem bayesiana |
|---|---|---|
| **Unidade modelada** | Total do distrito ou da província | Cada unidade de saúde |
| **Relatórios em falta** | Preenchidos e depois modelados | Modelados como pergunta separada |
| **Volume esperado** | Tendência + época sobre o total | Tendência + época + nível próprio de cada unidade |
| **Incerteza** | Limiares fixos | Banda de credibilidade de 95 % |
| **Uma unidade fica em silêncio** | Parece uma quebra | Retirada dos dois lados da comparação |

</div>

<!--
NOTAS PARA O APRESENTADOR:
- A linha-chave é a última. Quando uma unidade deixa de reportar, o modelo antigo via uma quebra no total. O novo retira essa unidade do observado e do esperado nesse mês, e a comparação fica como-para-como.
- «Banda de credibilidade»: o intervalo em que o modelo espera ver o volume 95 vezes em 100. Fora da banda é sinal; dentro é variação normal.
- A banda é mais larga em áreas pequenas e indicadores de baixo volume, e isso é correto: menos dados, menos certeza.
-->
