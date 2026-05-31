---
marp: true
theme: fastr
paginate: true
---

## Extrair contagens, não percentagens

O FASTR analisa **contagens de serviços em bruto**, não percentagens, proporções ou valores de cobertura pré-calculados.

<div class="columns">
<div>

| Fazer extração | Não **fazer** extração |
|------------|--------------------|
| Visitas ANC1 por estabelecimento por mês | Taxa de cobertura ANC1 (%) |
| Doses de Penta1 administradas | Proporção de cobertura de vacinação |
| Partos nos estabelecimentos de saúde | Indicadores de cobertura pré-calculados |

</div>
<div>

**Porquê contagens e não percentagens?

- Não é possível detetar valores anómalos numa percentagem: esta limita-se a 100 e esconde o volume subjacente.
- As percentagens não podem ser somadas em instalações de diferentes dimensões para produzir um total regional.
- A plataforma constrói a própria cobertura a partir de contagens e denominadores populacionais (**Módulos 5 e 6**).
- Os ajustamentos de anomalias e de exaustividade (**módulos 1 e 2**) requerem a execução de contagens brutas.

</div>
</div>

<!--
NOTAS DO APRESENTADOR:
- Esta é a regra mais importante para a extração de dados.
- Erro comum: extrair "elementos de dados" do DHIS2 que já armazenam a % de cobertura.
- Extrair sempre o numerador (número de serviços); a plataforma trata do resto.
- Se o indicador do DHIS2 disser "taxa", "%" ou "proporção", é o campo errado.
- Exemplo concreto para ancorar a regra: Visitas ANC1 (contagem) vs taxa de cobertura ANC1 (%).
-->
