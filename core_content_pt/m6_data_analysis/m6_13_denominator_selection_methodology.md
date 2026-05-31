---
marp: true
theme: fastr
paginate: true
---

## Metodologia de seleção do denominador

O FASTR constrói **quatro cadeias de denominadores candidatos**, cada uma ancorada num serviço de ponto de entrada HMIS diferente (ANC1, entregas, BCG, Penta1). Para cada cadeia, a plataforma:

1. **Calcula a população do ponto de entrada** combinando o volume do serviço HMIS com a cobertura do inquérito mais recente para esse serviço. (Exemplo: volume de ANC1 ÷ cobertura do inquérito ANC1 → estimativa de gravidezes)
2. **Estende-se através da cascata demográfica** utilizando parâmetros específicos do país - perda de gravidez, nados-mortos, mortalidade neonatal e pós-neonatal - para derivar as outras populações-alvo de que uma cadeia necessita (nados-vivos, bebés sobreviventes, etc.).

Para escolher entre as quatro cadeias, a plataforma compara cada uma delas com as **Perspectivas da População Mundial das Nações Unidas (PPM das Nações Unidas)** a nível nacional e seleciona a cadeia cujo rácio médio em relação às PPM das Nações Unidas é o mais próximo de 1,0.

**A cadeia escolhida é então utilizada para todos os indicadores e todos os níveis geográficos.

**Na Parte 2 (m006), um analista pode anular a seleção automática definindo `DENOMINATOR_CHAIN` para uma cadeia específica (`anc1`, `delivery`, `bcg`, ou `penta1`) se as considerações programáticas defenderem uma escolha diferente.

<!--
NOTAS DO APRESENTADOR:
- A lógica de seleção reside na função select_best_chain() do m005.
- O WPP da ONU é a *âncora* utilizada para comparar cadeias; os inquéritos NÃO são o critério de seleção.
- Rácio mediano mais próximo de 1,0 = cadeia cuja população calculada corresponde, em média, ao PPM da ONU.
- Uma cadeia aplica-se a TODOS os indicadores na análise - não cadeias diferentes por indicador.
- A mesma cadeia aplica-se a TODOS os níveis geográficos (nacional, admin2, admin3).
- Os utilizadores podem substituir manualmente através do parâmetro DENOMINATOR_CHAIN em m006.
-->
