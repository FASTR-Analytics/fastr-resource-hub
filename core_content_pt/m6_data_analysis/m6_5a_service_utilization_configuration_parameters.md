---
marp: true
theme: fastr
paginate: true
---

## Módulo de utilização de serviços: Parâmetros de configuração

**Nota:** Esses parâmetros se aplicam apenas à análise de interrupção. A análise de utilização de serviço ano a ano não requer configuração.

<div style="font-size: 0.75em;">

| Parâmetro | Descrição |
|-----------|-------------|
| Variável de contagem para modelagem** | Contagem ajustada usada para calcular valores esperados |
| Variável de contagem para visualização** | Contagem ajustada plotada como real observada
| Regressões na área administrativa 3. Sim = detalhada; Não = mais rápida
| Executar análise da área administrativa 4** | Análise de nível mais fino. Lenta em grandes conjuntos de dados
| Limite MAD** | MADs sinalizando desvios acentuados. Padrão 1,5; maior = menos sensível
| Janela de suavização (k)** | Meses na mediana móvel (ímpar). Predefinição 7
| Limiar de queda** | Sinalizar se real < X × esperado. Padrão 0,9 (≥10% de queda); 0,8 = apenas grandes quedas
| Limite de % de diferença** | Sinalizador quando o real difere do esperado em > X%. Padrão 10 |

</div>

<!--
NOTAS DO APRESENTADOR:
- Estes parâmetros controlam a sensibilidade da deteção de perturbações
- Limite MAD: menor = mais sensível (mais sinalizadores), maior = mais conservador
- Janela de suavização: maior = tendências mais suaves, menor = capta mudanças rápidas
- Limite de mergulho: 0.9 significa assinalar se <90% do esperado (queda de 10%)
- A análise a nível distrital é opcional - aumenta significativamente o tempo de cálculo
- Seleção da variável de contagem: utilizar "ambos" para a maioria das análises (outlier + exaustividade ajustada)
- Os parâmetros podem ser ajustados com base no contexto do país e na qualidade dos dados
-->
