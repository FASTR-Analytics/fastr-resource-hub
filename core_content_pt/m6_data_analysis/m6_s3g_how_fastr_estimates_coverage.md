---
marp: true
theme: fastr
paginate: true
---

## Como o FASTR estima a cobertura

Juntando as peças, o FASTR estima a cobertura em três passos:

1. **Construir denominadores de várias maneiras.** Voltar a calcular as populações-alvo de cada ponto de entrada de rotina do HMIS (ANC1, SBA, BCG, Penta1) combinando os volumes de serviço com os valores de cobertura do inquérito. *Exemplo: 10.000 consultas ANC1 com uma cobertura de 80% do inquérito implicam ~12.500 gravidezes.* Paralelamente, derivar denominadores das projecções demográficas da ONU.

2. **Selecione a melhor cadeia.** Calcule a cobertura com cada opção de denominador e compare o rácio médio dos denominadores derivados do HMIS com os denominadores projectados pela ONU. A cadeia cujo rácio mediano se aproxima mais de 1,0 é mantida e aplicada uniformemente em todos os indicadores.

3. **Projetar a cobertura para a frente.** Ancorar no último valor de inquérito disponível e aplicar as tendências do HMIS ano após ano para estender as estimativas de cobertura para os anos posteriores ao inquérito.

> Os inquéritos ancoram o cálculo retroativo; o WPP da ONU arbitra entre cadeias; as tendências do HMIS levam a estimativa para a frente.
