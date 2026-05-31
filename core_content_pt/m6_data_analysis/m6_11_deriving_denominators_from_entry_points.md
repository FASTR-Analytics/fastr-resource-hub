---
marp: true
theme: fastr
paginate: true
---

## Derivando denominadores de pontos de entrada

Cada indicador HMIS (ANC1, entregas, BCG, Penta1) serve como um **ponto de entrada** para calcular denominadores. A partir de qualquer ponto de entrada, a cascata deriva outras populações em ambas as direcções:

- **Para a frente:** Aplicar taxas de mortalidade/atrito para descer na cascata
  - *Exemplo: Elegível para DPT → Elegível para Sarampo1 → Elegível para Sarampo2
- **Inverter as taxas de mortalidade (adicionar mortes) para subir na cascata
  - *Exemplo:* Penta1 → Nados-vivos → Partos → Gravidezes

Isto dá-nos **múltiplas estimativas independentes do denominador** para cada população-alvo, permitindo-nos selecionar a mais exacta.

<!--
NOTAS DO APRESENTADOR:
- Cada indicador do HMIS pode servir como ponto de entrada para o cálculo do denominador
- A cascata funciona em duas direcções - para a frente e para trás
- Para a frente: aplicar taxas de mortalidade para obter populações a jusante
- Para trás: inverter a lógica (adicionar mortes de volta) para obter populações a montante
- Exemplo: a partir do Penta1, pode estimar os nados-vivos, depois os partos e depois as gravidezes
- Múltiplos pontos de entrada dão-nos múltiplas estimativas independentes do denominador
- A existência de múltiplas estimativas permite a validação e a seleção da melhor opção
-->
