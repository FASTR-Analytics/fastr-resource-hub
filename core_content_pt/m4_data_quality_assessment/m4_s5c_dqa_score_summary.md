---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Saída da pontuação média do DQA

<div class="output-layout">
<div class="output-viz">

![Pontuação média de DQA](../../resources/default_outputs/Default_6._Mean_DQA_score.png)

</div>
<div class="output-text">

**O que você vê:** Mapa de calor mostrando a pontuação média de DQA em meses de instalações, por indicador e região.

**Pontuação:** Média da pontuação de completude e da pontuação de consistência. Varia de 0% a 100%.

**Interpretação:** Uma medida mais matizada do que a pontuação global. Capta o progresso parcial - uma região pode ter uma pontuação de 75% mesmo que nem todas as verificações sejam aprovadas. Utilize esta medida para acompanhar as melhorias ao longo do tempo.

</div>
</div>

<!--
NOTAS DO APRESENTADOR:
- A pontuação DQA combina todas as dimensões numa pontuação resumida
- 100% = completo + sem valores atípicos + consistente - o objetivo para dados de qualidade
- Utilizar o mapa de calor para identificar áreas prioritárias para a melhoria da qualidade dos dados
- Isto completa o módulo DQA - de seguida, veremos como ajustar estes problemas
-->
