---
marp: true
theme: fastr
paginate: true
---

## Estimando denominadores a partir de ANC-1

Exemplo prático. O inquérito diz que 80% das mulheres grávidas recebem ANC1. O HMIS reporta 10.000 consultas ANC1 no período, portanto 10.000 ÷ 0,80 ≈ 12.500 gravidezes. A partir das gravidezes, o FASTR percorre a cascata: gravidezes → partos (aplicar a taxa de perda de gravidez) → nados-vivos (aplicar a taxa de nados-mortos) → crianças que sobrevivem a cada faixa etária (aplicar a mortalidade neonatal e infantil). Cada etapa utiliza as taxas específicas de cada país, obtidas a partir do DHS ou das estatísticas vitais mais recentes. A cadeia termina com a população elegível para qualquer serviço a jusante - DPT, sarampo, controlo do crescimento - sem necessidade de solicitar o inquérito para cada um deles.

![Exemplo de cascata de denominadores h:340](../../resources/diagrams/denominator_cascade_example.svg)

<!--
NOTAS DO APRESENTADOR:
- Percorra o exemplo lentamente: Visitas ANC1 → taxa de cobertura → gravidezes → passos em cascata
- Os 80% são do inquérito, os 10.000 são do HMIS - é o casamento das duas fontes de dados
- A taxa de cada etapa é específica de cada país; os números acima das setas no diagrama são ilustrativos
- Ponto final: ~9.067 crianças elegíveis para vacinação DPT (de 12.500 gravidezes)
- Os números são ilustrativos - as taxas reais variam consoante o país
-->
