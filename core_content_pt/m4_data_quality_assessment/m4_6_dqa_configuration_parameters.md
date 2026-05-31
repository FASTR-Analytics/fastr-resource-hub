---
marp: true
theme: fastr
paginate: true
---

## Módulo DQA: Parâmetros de configuração

| Parâmetro | Descrição |
|-----------|-------------|
| Limite de proporção para deteção de outlier** | Ajusta o limite de contribuição proporcional para sinalizar um estabelecimento-mês como outlier
| Limite mínimo de contagem para consideração** | Define a contagem mínima necessária para que um estabelecimento-mês seja considerado um outlier
| Os outliers são definidos como observações que são superiores a X vezes o desvio médio absoluto (DMA) do valor mediano mensal para o indicador em cada período de tempo
| Define quais os indicadores que são incluídos na avaliação dos outliers e da exaustividade para inclusão na pontuação DQA
| Define quais os pares de indicadores utilizados para análise de consistência e os intervalos de rácios esperados

<!--
NOTAS DO APRESENTADOR:
- Esses parâmetros podem ser ajustados nas configurações da plataforma
- Os valores padrão funcionam bem para a maioria dos contextos, mas podem ser personalizados
- O multiplicador MAD de 10 é conservador - apenas assinala os valores extremos
- A contagem mínima de 100 evita que as instalações de baixo volume sejam demasiado assinaladas
- Os pares de consistência podem ser modificados com base nos indicadores que está a analisar
-->
