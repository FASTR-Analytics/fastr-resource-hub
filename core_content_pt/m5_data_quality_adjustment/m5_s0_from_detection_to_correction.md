---
marp: true
theme: fastr
paginate: true
---

## Da deteção à correção

O módulo Avaliação da qualidade dos dados assinalou os problemas de qualidade dos dados - valores extremos, relatórios em falta, inconsistências internas. O módulo Ajustes da qualidade dos dados continua a partir daí.

O FASTR substitui os valores assinalados por estimativas razoáveis a partir dos padrões históricos de cada estabelecimento, para que as análises de utilização de serviços e de cobertura a jusante funcionem com dados mais limpos.

Para apoiar a transparência, o FASTR produz **quatro conjuntos de dados paralelos**:

- **Não ajustados** - valores originais comunicados
- **Outliers ajustados** - valores extremos substituídos
- **Completude ajustada** - valores em falta imputados
- **Ajustados** - todas as correcções aplicadas

Os próximos slides apresentam cada ajuste e seu resultado.
