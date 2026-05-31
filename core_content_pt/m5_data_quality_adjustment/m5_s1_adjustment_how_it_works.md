---
marp: true
theme: fastr
paginate: true
---

## Como funciona o ajuste

Os valores anómalos e os valores em falta são substituídos utilizando **médias móveis de 6 meses** a partir dos dados históricos de cada estabelecimento. A mesma abordagem hierárquica aplica-se a ambos os ajustamentos:

| Prioridade | Método | Quando aplicado |
|---|---|---|
| 1 | Média de 6 meses centrada | Dados suficientes antes e depois do valor |
| 2 | Média de 6 meses para frente | O valor está no início da série |
| 3 | Média de 6 meses para trás | O valor está no final da série |
| 4 | Média histórica da instalação | Recurso quando as médias móveis não são possíveis

A substituição é baseada no próprio padrão do estabelecimento, de modo que cada ajuste permanece ancorado ao que o estabelecimento normalmente reporta.
