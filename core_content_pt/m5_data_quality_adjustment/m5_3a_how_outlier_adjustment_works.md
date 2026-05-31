---
marp: true
theme: fastr
paginate: true
---

## Como funciona o ajuste de outlier

Para cada valor assinalado, o FASTR calcula uma **média móvel** dos meses circundantes - uma janela de seis meses que capta o nível típico de comunicação da instalação sem ser distorcido pelo próprio valor atípico. O valor anómalo é então substituído por essa média.

Quando uma janela de seis meses centrada não é possível (por exemplo, o outlier situa-se perto do início ou do fim da série temporal), o FASTR recorre a uma hierarquia de alternativas:

| Prioridade | Método | Quando aplicado |
|---|---|---|
| 1 | Média de 6 meses centrada | 3 meses antes + 3 meses depois do outlier |
| 2 | Média de 6 meses para frente | Dados anteriores insuficientes (outlier próximo ao início da série)
| 3 | Média de 6 meses para trás | Dados seguintes insuficientes (outlier perto do fim da série) |
| 4 | Mesmo mês, ano anterior | Quando as médias móveis não são possíveis; útil para indicadores fortemente sazonais
| 5 | Média histórica da instalação | Recuo final quando não existem dados comparáveis recentes

A substituição é sempre ancorada no histórico de relatórios do próprio estabelecimento - nunca importada de outro estabelecimento ou de uma média nacional.
