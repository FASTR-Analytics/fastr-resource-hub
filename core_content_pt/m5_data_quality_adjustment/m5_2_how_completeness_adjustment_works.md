---
marp: true
theme: fastr
paginate: true
---

## Como funciona o ajuste de completude

Um estabelecimento que perde um mês de relatório parece, nos dados brutos, como uma queda súbita para zero - uma queda nos serviços que não aconteceu de facto. O FASTR preenche estas lacunas com estimativas extraídas de um quadro de média móvel de seis meses ancorado no historial de relatórios do próprio estabelecimento.

| Prioridade | Método | Quando aplicado |
|---|---|---|
| 1 | Média de 6 meses centrada | Existem dados suficientes antes e depois da lacuna |
| 2 | Média de 6 meses para frente | O intervalo está no início da série temporal
| 3 | Média de 6 meses para trás | O intervalo está no final da série temporal
| 4 | Média histórica da facilidade | Recuo quando não é possível uma janela de rolagem

O resultado: as lacunas temporárias na comunicação de dados já não se traduzem em declínios artificiais no volume de serviços medido.
