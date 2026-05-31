---
marp: true
theme: fastr
paginate: true
---

<style scoped>
table { font-size: 0.7em; }
td, th { padding: 4px 8px !important; }
</style>

## Consistência entre indicadores relacionados

Os indicadores do programa com uma relação previsível são examinados para determinar se existe a relação esperada entre eles. Por outras palavras, este processo examina se a relação observada entre os indicadores, tal como é mostrada nos dados reportados, é a esperada.

<div class="columns">
<div>

| Par de indicadores | Relação esperada |
|----------------|----------------------|
| ANC1 / ANC4 | Rácio deve ser ≥ 0,95 |
| Penta1 / Penta3 | Rácio deve ser ≥ 0,95 |
| BCG / Entrega na instalação | Dentro de 30% (≥0,7 e ≤1,3) |

Esperamos que o número de mulheres grávidas que recebem uma primeira consulta de ANC seja sempre maior do que o número de mulheres grávidas que recebem uma quarta consulta de ANC.

A BCG é uma vacina de dose à nascença, pelo que esperamos que estes indicadores sejam iguais. No entanto, reconhecemos que pode haver mais variabilidade nesta relação prevista, pelo que definimos um intervalo de 30%.

</div>
<div>

![Ilustração de consistência h:280](../../resources/diagrams/consistency_illustration.svg)

</div>
</div>

<!--
NOTAS DO APRESENTADOR:
- A coerência verifica as relações lógicas: ANC1 deve ser sempre ≥ ANC4 (não se pode ter a 4ª consulta sem a 1ª)
- Avaliamos ao nível do DISTRITO porque os pacientes deslocam-se entre instalações dentro de um distrito
- Exemplo: a mulher tem ANC1 no posto de saúde, ANC4 no hospital distrital - continua a ser consistente a nível distrital
- BCG vs. partos permite uma tolerância de 30% porque nem todos os partos ocorrem em estabelecimentos de saúde
- Perguntar: No vosso contexto, é comum os pacientes procurarem serviços diferentes em estabelecimentos diferentes?
-->
