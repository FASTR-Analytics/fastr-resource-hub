---
marp: true
theme: fastr
paginate: true
---

## Processo analítico em duas partes

O módulo de estimativa de cobertura funciona em duas partes sequenciais:

| Parte | Componentes |
|------|------------|
**Parte 1: Cálculo do denominador** | Construir quatro cadeias de denominadores candidatos, combinando os volumes do HMIS com a cobertura do inquérito em cada ponto de entrada e, em seguida, alargando através de parâmetros demográficos. Comparar as cadeias com o PPM da ONU e selecionar a cadeia cujo rácio mediano em relação ao PPM da ONU seja o mais próximo de 1,0. |
| Aplicar a cadeia selecionada a todos os indicadores. Projetar os valores do inquérito para os anos pós-inquérito utilizando os deltas anuais do HMIS. Gerar estimativas finais de cobertura a nível nacional e subnacional. |

<!--
NOTAS DO APRESENTADOR:
- Cobertura = serviços / população alvo - o desafio é conhecer a população alvo
- O HMIS utiliza normalmente populações de captação que são frequentemente inexactas
- A nossa abordagem: derivar denominadores dos dados do HMIS validados com base em inquéritos
- A Parte 1 calcula e valida os denominadores, a Parte 2 gera estimativas
- Isto permite seguir as tendências e as disparidades subnacionais em termos de cobertura
-->
