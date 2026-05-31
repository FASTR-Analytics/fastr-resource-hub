---
marp: true
theme: fastr
paginate: true
---

## Usando relações demográficas para estimar denominadores

Assim que tiver um ponto de entrada - por exemplo, o número de gravidezes do ANC1 - pode encadear rácios demográficos para calcular a população alvo para todos os outros serviços. Cada seta na cascata é um rácio extraído de uma fonte nacional (DHS, censo, estatísticas vitais):

- Gravidezes → nados-vivos utiliza taxas de perdas fetais e precoces
- Nados-vivos → bebés sobreviventes utiliza a mortalidade neonatal e infantil
- Bebés sobreviventes → coortes elegíveis por idade utiliza a sobrevivência específica por idade

Combine a cadeia e o FASTR pode retornar o denominador para qualquer serviço a partir de qualquer entrada única.
