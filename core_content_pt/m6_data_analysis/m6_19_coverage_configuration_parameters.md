---
marp: true
theme: fastr
paginate: true
---

## Módulo de cobertura: Parâmetros de configuração

<div style="font-size: 0.8em;">

| Parâmetro | Descrição |
|-----------|-------------|
| Valor de contagem a utilizar** | Qual a contagem ajustada a utilizar para o cálculo da cobertura
| Nível para o qual calcular a cobertura** | Níveis geográficos para a estimativa de cobertura: nacional, provincial (área administrativa 2) ou distrital (área administrativa 3) |
| Taxa de perda de gravidez** | Proporção de gravidezes que terminam em perda antes do parto
| Taxa de gémeos** | Proporção de partos que resultam em gémeos
| Taxa de natimortos** | Proporção de nascimentos que são natimortos
| Taxa de mortalidade neonatal** | Mortes nos primeiros 28 dias por nado-vivo
| Taxa de mortalidade pós-neonatal** | Mortes de 28 dias a 1 ano por nado vivo
| Taxa de mortalidade infantil** | Mortes antes de 1 ano de idade por nado vivo
| Taxa de mortalidade de menores de 5 anos** | Mortes antes dos 5 anos por nado vivo

</div>

As taxas de mortalidade específicas de cada país podem ser obtidas a partir dos relatórios DHS, do IGME da ONU ou das estatísticas vitais nacionais.

<!--
NOTAS DO APRESENTADOR:
- Os parâmetros de configuração controlam os cálculos do denominador
- Variável de contagem: quais dados ajustados usar (recomendar "ambos")
- Níveis de análise: nacional, provincial, distrital - escolha com base na qualidade dos dados
- Taxas demográficas: predefinições fornecidas, mas devem ser utilizados valores específicos do país
- Fontes de taxas: Relatórios DHS, estimativas IGME da ONU, estatísticas vitais nacionais
- As taxas de mortalidade afectam significativamente os cálculos dos denominadores
- Maior mortalidade = denominadores de população sobrevivente mais pequenos
-->
