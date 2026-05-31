---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Saída do ajuste de completude

<div class="output-layout">
<div class="output-viz">

![Ajuste de completude](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
<div class="output-text">

**O que vê:** Mapa de calor que mostra a alteração do volume de serviço após a imputação de dados em falta com médias móveis.

**Fórmula:** % de alteração = (ajustado - original) / original × 100

**Interpretação:** Os valores são normalmente positivos (a imputação acrescenta volume). Ajustes grandes indicam áreas que precisam ser melhoradas em termos de completude.

</div>
</div>

<!--
NOTAS DO APRESENTADOR:
- Dois resultados mostrados: ajuste de outlier e ajuste de completude
- Mapa de calor de outliers: valores negativos significam que os outliers foram removidos (redução das contagens inflacionadas)
- Mapa de calor da integralidade: valores positivos significam que as lacunas foram preenchidas (aumento do volume total)
- Os grandes ajustamentos (cores escuras) indicam áreas/indicadores com problemas de qualidade dos dados
- Utilize-os para identificar onde concentrar os esforços de melhoria da qualidade dos dados
- Comparar regiões: quais as que têm mais problemas de anomalias do que problemas de exaustividade?
-->
