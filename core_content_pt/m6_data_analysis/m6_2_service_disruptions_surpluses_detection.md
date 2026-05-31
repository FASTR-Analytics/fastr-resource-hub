---
marp: true
theme: fastr
paginate: true
---

## Deteção de interrupções e excedentes nos serviços

A abordagem FASTR para detetar interrupções de serviço e excedentes utiliza **regressão de séries temporais interrompidas (ITS)** com efeitos fixos ao nível do estabelecimento. Este quadro estatístico permite uma interpretação mais significativa e a comparação de dados de contagem em áreas subnacionais, possibilitando uma visão que os dados brutos por si só não podem fornecer.

Ao concentrar-se em mudanças e tendências significativas em vez de números brutos, esta abordagem permite uma análise mais exacta e comparável. As alterações anteriores grandes e inesperadas nos dados históricos são removidas para estabelecer uma linha de base limpa. As alterações inesperadas de volume são então estimadas comparando os volumes observados com os volumes esperados com base em tendências históricas e sazonalidade.
