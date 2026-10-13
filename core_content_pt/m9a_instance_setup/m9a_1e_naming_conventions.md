---
marp: true
theme: fastr
paginate: true
---

## Convenções de nomes para indicadores

Os **rótulos** aparecem nas visualizações, por isso mantenha-os curtos. Rótulos longos tornam-se ilegíveis nos gráficos.

- Evitar: *Número total de primeiras consultas pré-natais em unidades públicas*
- Preferir: *CPN1 (unidades públicas)*

Os **IDs do indicador** devem manter-se legíveis e nunca ser um código DHIS2 em bruto. Use `snake_case` em minúsculas, a convenção padrão para nomes de variáveis em análise de dados.

- Evitar: `uTj3xK9pLm2` (ID em bruto) ou `CPN1 Primeiro Trimestre` (espaços e maiúsculas)
- Preferir: `anc1_first_trimester`, `maternal_mortality_rate`, `assisted_deliveries`
