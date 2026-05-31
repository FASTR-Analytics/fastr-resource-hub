---
marp: true
theme: fastr
paginate: true
---

## Relações esperadas que ajudam na estimativa de denominadores

![Fluxograma da cascata de denominadores](../../resources/diagrams/denominator_cascade.svg)

<!--
NOTAS DO APRESENTADOR:
A cascata demográfica mostra como as populações se transformam através das fases da vida
- Começa com a gravidez → aplica-se a perda de gravidez → partos
- Partos → ajuste para gémeos → nascimentos
- Nascimentos → subtrair nados-mortos → nados-vivos
- Nados vivos → subtrair mortes neonatais → elegível para DPT
- Elegíveis à DPT → subtrair mortes pós-neonatais → Elegíveis ao sarampo
- Cada passo utiliza as taxas de mortalidade específicas do país
- Esta lógica funciona em ambas as direcções (para a frente e para trás)

Fórmulas-chave:
- Preg = Del/(1-PLR)
- Del = Preg*(1-PLR)
- TB = Del/(1-0.5*TWR)
- Del = TB*(1-0.5*TWR)
- TB = LB/(1-SBR)
- LB = TB*(1-SBR)
- Preg = (LB*(1-0,5*TWR))/((1-SBR)*(1-PLR))

A nível provincial, utilizamos todos os valores por defeito!
-->
