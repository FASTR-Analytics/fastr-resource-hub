---
marp: true
theme: fastr
paginate: true
---

## Um scorecard em quatro passos

<div style="font-size: 0.9em;">

| Passo | Onde | O quê |
|---|---|---|
| **1. Definir** | Dados → HMIS → Indicadores | **Adicionar indicador** → tipo **Calculado** → fórmula, p. ex. `anc4 / anc1` |
| **2. Definir a regra** | Mesmo formulário, **Análise e apresentação** | **Formato**, **Direção**, **Meta**, **Regra de formatação condicional** (limiares, p. ex. 70 e 80) |
| **3. Gerar** | Resultados → Gerar novo pacote de resultados | Assinalar **Valores dos indicadores**; fixá-lo e mover os produtos para ele (**⋮ → Pacote de resultados e âmbito…**) |
| **4. Construir a tabela** | Produtos → **Novo → Nova visualização** | Módulo **Valores dos indicadores** → métrica **Valor do indicador** → predefinição **Tabela scorecard** → **Apresentação → Formatação condicional: Indicador** |

</div>

Cada célula é colorida pela regra do seu próprio indicador, e a legenda mostra as faixas. Guarda-se sozinha na sua pasta; insira uma cópia num relatório ou numa apresentação.

<!--
NOTAS PARA O APRESENTADOR:
- O passo 2 é o que as pessoas saltam: sem regra a tabela tem números mas não tem cores.
- Alterações a fórmulas, limiares ou números de população fazem efeito no pacote SEGUINTE, não no atual. Regenerar depois de cada alteração.
- Os termos de população (population_pregnancies, population_infants…) vêm da página População da instância; se a página não tiver número para uma área e ano, a célula é omitida, não fica a zero.
-->
