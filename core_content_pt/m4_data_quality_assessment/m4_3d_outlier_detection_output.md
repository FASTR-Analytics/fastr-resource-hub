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
- Os valores anómalos são valores extremos em relação ao volume habitual de relatórios de uma instituição; apenas os valores suspeitosamente elevados são assinalados.
- As taxas elevadas de valores anómalos podem refletir erros de introdução de dados OU eventos programáticos reais (campanhas, picos). A investigação distingue os dois - ver m4_3a "Investigação de um valor atípico assinalado".
- A fórmula e o método seguem m4_3c "Metodologia de deteção de valores atípicos".
-->
