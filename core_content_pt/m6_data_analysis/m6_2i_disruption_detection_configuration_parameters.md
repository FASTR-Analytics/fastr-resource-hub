---
marp: true
theme: fastr
paginate: true
---

## Módulo de deteção de perturbações: parâmetros de configuração

**Nota:** definem-se em Resultados → Predefinições dos módulos. Aplicam-se a todos os pacotes de resultados gerados depois.

<div style="font-size: 0.75em;">

| Parâmetro | Descrição |
|-----------|-----------|
| **Variável de contagem** | Contagem não ajustada ou ajustada para outliers. As contagens imputadas por completude são recusadas: o módulo modela ele próprio as lacunas de reporte. Predefinição: ajustada para outliers |
| **Termos de sazonalidade de Fourier (K)** | Pares seno/cosseno para a sazonalidade. Predefinição 2 (anual + semestral); 3–4 para indicadores de campanha como a vitamina A |
| **Amostras da posteriori** | Sim = bandas de credibilidade bem calibradas ao nível do distrito, cerca de dez vezes mais lento. Predefinição não |
| **Tratamento dos zeros** | all = cada zero é um relatório real (predefinição); none = os zeros são em falta; auto / strict = um zero é real só se outro indicador foi submetido nesse mês; detect = escolha a partir dos dados |
| **Excluir meses antes do primeiro relatório** | Ignorar os meses anteriores ao primeiro relatório de uma unidade, para não contar unidades novas como silenciosas. Predefinição sim |
| **Tolerância de encerramento (meses)** | Excluir os meses mais de N meses depois do último relatório de uma unidade, como encerramento presumido. Predefinição 0 (desativado) |

</div>

<!--
NOTAS PARA O APRESENTADOR:
- A maioria dos países corre com as predefinições. Os dois ajustes que merecem conversa: a política de zeros (o vosso DHIS2 preenche zeros automaticamente?) e o K de Fourier para indicadores de campanha.
- As amostras da posteriori só importam se as bandas ao nível do distrito servirem para decidir; para a monitorização nacional e provincial de rotina, a predefinição chega.
- A tolerância de encerramento serve para sistemas em que muitas unidades deixam de reportar definitivamente; caso contrário, deixe desativada.
-->
