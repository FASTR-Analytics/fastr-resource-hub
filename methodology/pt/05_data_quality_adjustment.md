<!-- AUTO-TRANSLATED from 05_data_quality_adjustment.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Ajustamento da qualidade dos dados

## Contexto e objetivo

### Objetivo do módulo

O módulo de Ajustamento da Qualidade dos Dados aborda duas limitações comuns dos dados de rotina dos estabelecimentos de saúde: valores extremos resultantes de erros de comunicação ou de introdução de dados (**outliers**) e lacunas resultantes de comunicação incompleta (**dados em falta**). Em vez de excluir as observações afectadas, o módulo substitui estes valores por estimativas derivadas estatisticamente e informadas pelos padrões históricos de informação de cada estabelecimento.

O processo de ajustamento aplica métodos de suavização de séries temporais que se baseiam nas tendências observadas e na sazonalidade dos dados ao nível dos estabelecimentos. As médias móveis e os perfis históricos específicos de cada estabelecimento são utilizados para corrigir valores anómalos, preservando os padrões subjacentes de prestação de serviços.

Para apoiar a transparência e a flexibilidade analítica, o módulo gera quatro conjuntos de dados paralelos: dados não ajustados, dados apenas com correcções de anomalias, dados apenas com valores em falta imputados e dados com ambos os ajustamentos aplicados. Isto permite aos utilizadores avaliar a sensibilidade dos resultados a diferentes pressupostos de qualidade dos dados e selecionar o conjunto de dados mais adequado ao seu objetivo analítico.

### Fundamentação analítica

Os dados do sistema de informação de gestão da saúde (HMIS) de rotina contêm frequentemente erros de comunicação e lacunas que podem distorcer as tendências observadas e obscurecer os padrões subjacentes na prestação de serviços. Os valores extremos podem criar picos artificiais nos volumes de serviços, enquanto a comunicação incompleta pode resultar em declínios aparentes que reflectem problemas de qualidade dos dados e não verdadeiras mudanças na prestação de serviços. Estas limitações são particularmente importantes quando os dados do HMIS são utilizados para o controlo do desempenho, comparação entre unidades geográficas ou análise de tendências.

Ao tratar sistematicamente os valores atípicos e os dados em falta antes da análise, este módulo melhora a consistência e a interpretabilidade dos dados do HMIS. Isto ajuda a garantir que os resultados analíticos subsequentes se baseiam em padrões de prestação de serviços observados e não em artefactos introduzidos pela variabilidade dos relatórios ou por restrições de qualidade dos dados.

### Pontos-chave

| Componente | Detalhes |
|-----------|---------|
| **Inputs** | Dados brutos do HMIS (`hmis_ISO3.csv`)<br>Sinalizadores de outlier do Módulo 1 (`M1_output_outliers.csv`)<br>Sinalizadores de completude do Módulo 1 (`M1_output_completeness.csv`) |
| Dados ajustados ao nível da instalação (`M2_adjusted_data.csv`)<br>Dados agregados subnacionais (`M2_adjusted_data_admin_area.csv`)<br>Dados agregados nacionais (`M2_adjusted_data_national.csv`)<br>Metadados de exclusão (`M2_low_volume_exclusions.csv`) |
| Substituir valores anómalos e preencher dados em falta utilizando padrões históricos específicos do estabelecimento; produz quatro cenários de ajustamento (nenhum, apenas anómalos, apenas integralidade, ambos)

---

## Fluxo de trabalho analítico

### Visão geral das etapas analíticas

O módulo aplica um processo padronizado de várias etapas para ajustar os dados de rotina das unidades de saúde, preservando os padrões subjacentes de prestação de serviços:

**Passo 1: Carregar e preparar dados**
O módulo integra três entradas: volumes de serviços comunicados ao nível da unidade de saúde (`hmis_ISO3.csv`), sinalizadores de anomalias que identificam valores anómalos (`M1_output_outliers.csv` do Módulo 1) e sinalizadores de integralidade que indicam meses com relatórios incompletos (`M1_output_completeness.csv` do Módulo 1). Os indicadores para os quais o ajustamento não é adequado (qualquer indicador cujo nome contenha `death` ou `still_birth`, sem distinção entre maiúsculas e minúsculas) são identificados e excluídos dos passos de ajustamento subsequentes.

**Etapa 2: Identificar indicadores de baixo volume
Antes de aplicar quaisquer ajustamentos, cada indicador é avaliado quanto ao volume suficiente. Os indicadores que nunca atingem 100 eventos comunicados em qualquer mês ao longo da série cronológica completa (`count >= 100`) são assinalados e excluídos do ajustamento, uma vez que os métodos de suavização estatística não são significativos para indicadores de contagem consistentemente baixa. A lista de indicadores de baixo volume excluídos é guardada em `M2_low_volume_exclusions.csv`.

**Etapa 3: Ajustar valores discrepantes
Para as observações assinaladas como anómalas, o módulo calcula os valores de substituição com base nos padrões históricos de comunicação do estabelecimento. Um conjunto hierárquico de métodos é aplicado sequencialmente:

- Média móvel centrada de seis meses (três meses antes e três meses depois)

- Média móvel a prazo de seis meses

- Média móvel de seis meses para trás

- Mesmo mês do ano anterior

- Média histórica específica da instalação

**Passo 4: Preencher dados em falta e incompletos**
Para os meses identificados como em falta ou incompletos, os valores são imputados utilizando a mesma estrutura de média móvel aplicada ao ajustamento de valores atípicos. Esta abordagem evita quedas artificiais para zero causadas por lacunas temporárias na comunicação de dados, mantendo a coerência com as tendências específicas de cada estabelecimento.

**Passo 5: Criar vários cenários
Para apoiar a transparência e a análise de sensibilidade, o módulo produz quatro conjuntos de dados paralelos:

- Dados não ajustados (valores originais comunicados)

- Dados apenas com ajustes de outlier

- Dados com ajustamentos apenas para relatórios em falta ou incompletos

- Dados com aplicação de ajustamentos por valores aberrantes e por integralidade

**Passo 6: Agregar aos níveis geográficos**
Após o ajustamento, os dados ao nível dos estabelecimentos são agregados aos níveis subnacional e nacional. Todos os cenários de ajustamento são preservados em cada nível geográfico, permitindo a análise a diferentes escalas administrativas.

**Passo 7: Exportar resultados**
O módulo gera ficheiros de saída estruturados para conjuntos de dados ao nível dos estabelecimentos, subnacionais e nacionais, juntamente com um ficheiro de metadados que documenta os indicadores excluídos do ajustamento e os motivos da sua exclusão.

### Diagrama de fluxo de trabalho

<iframe src="../resources/diagrams/mod2_workflow.html" width="100%" height="800" style="border: 1px solid #ccc; border-radius: 4px;" title="Fluxo de trabalho interativo do módulo 2"></iframe>

### Pontos de decisão chave

**Identificação dos valores sujeitos a ajustamento

O módulo aplica ajustamentos a duas categorias de observações:

- Valores assinalados como anómalos através dos procedimentos de deteção estatística implementados no módulo 1
- Valores correspondentes a meses identificados como incompletos ou em falta devido a lacunas de reporte

Certos indicadores são explicitamente excluídos do ajustamento:

- Indicadores de mortalidade e de nados-mortos (qualquer `indicator_common_id` cujo nome contenha `death` ou `still_birth`, sem distinção de maiúsculas e minúsculas - abrangendo óbitos de menores de cinco anos, óbitos maternos, óbitos neonatais, nados-mortos, etc.), uma vez que representam eventos discretos para os quais o alisamento ou a imputação não são adequados
- Indicadores de baixo volume que nunca atingem 100 eventos notificados em qualquer mês, para os quais o ajustamento estatístico não é significativo

**Seleção do cenário de ajustamento**

O módulo gera quatro cenários de ajustamento para acomodar diferentes contextos analíticos e condições de qualidade dos dados:

- **Sem ajustamento**: Mantém os valores reportados e é adequado para exercícios de validação ou contextos em que a qualidade dos dados é avaliada como elevada
- **Ajuste apenas de outlier**: Aplica correcções quando estão presentes valores extremos, mas a exaustividade do relatório é estável
- **Apenas ajustamento de exaustividade**: Aborda as lacunas no reporte, preservando os valores reportados em períodos com dados completos
- **Ajustes de outlier e de completude**: Aplica ambas as correcções quando estão presentes limitações de qualidade dos dados em ambas as dimensões

### Processamento de dados e resultados

**Estrutura de entrada
O módulo recebe os volumes de serviços mensais ao nível do estabelecimento, juntamente com os sinais de qualidade dos dados gerados no módulo 1, incluindo os indicadores de anomalias e o estado de integralidade. Cada combinação estabelecimento-indicador-mês é tratada como uma observação distinta para potencial ajustamento.

**Aplicação dos ajustamentos
Com base no cenário selecionado, são geradas contagens de serviços ajustadas. As observações assinaladas como anómalas são substituídas por valores derivados de médias históricas específicas do estabelecimento, excluindo os períodos anómalos. Para os meses com relatórios incompletos ou em falta, os valores são imputados utilizando padrões históricos a nível do estabelecimento para manter a continuidade da série cronológica.

**Geração de conjuntos de dados paralelos
São produzidas quatro versões paralelas das contagens ajustadas: valores não ajustados, valores ajustados por anomalias, valores ajustados por exaustividade e valores com ambos os ajustamentos aplicados. Esta estrutura permite que as análises a jusante avaliem explicitamente a sensibilidade a diferentes pressupostos de qualidade dos dados.

**Estrutura de agregação e de resultados**
Os dados ajustados ao nível dos estabelecimentos são agregados aos níveis distrital, subnacional e nacional, com os quatro cenários de ajustamento retidos. Cada registo de resultados inclui a unidade geográfica, o indicador, o período de tempo e as contagens de serviços correspondentes em cada cenário, apoiando uma análise flexível entre casos de utilização e objectivos analíticos.

---
### Resultados da análise e visualização

A análise FASTR gera três resultados visuais principais, comparando os volumes de serviço antes e depois dos ajustes:

**1. Impacto do ajuste de outlier**

Mapa de calor que mostra a variação percentual do volume de serviços devido ao ajustamento de anomalias, por indicador e área geográfica.

percentagem de variação do volume devido ao ajustamento dos valores atípicos] (resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

**2. Impacto do ajustamento da integralidade**

Mapa de calor que mostra a variação percentual do volume de serviços devido ao ajustamento da integralidade (dados em falta), por indicador e área geográfica.

percentagem de variação do volume devido ao ajustamento da integralidade] (resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

**3. Impacto do ajustamento combinado**

Mapa de calor que mostra a variação percentual do volume de serviços quando são aplicados os ajustamentos de anomalias e de integralidade.

percentagem de variação do volume devido ao ajustamento por diferença e por integralidade] (resources/default_outputs/Default_3._Percent_change_in_volume_due_to_both_outlier_and_completeness_adjustment.png)

**Guia de interpretação**

Para todos os mapas de calor:

- **Linhas**: Áreas geográficas (zonas/regiões)
- **Colunas**: Indicadores de saúde
- **Valores**: Variação percentual do volume de serviços após o ajustamento

Para o mapa de calor do ajuste de outlier (output 1):

- **Valores negativos**: Os valores extremamente altos foram substituídos por estimativas mais baixas
- Valores próximos de zero indicam poucos valores atípicos detectados

Para o mapa de calor do ajustamento da integralidade (resultado 2):

- **Valores positivos**: Os dados em falta foram preenchidos, aumentando o volume total
- Valores próximos de zero indicam que o relatório já estava completo

Para o mapa de calor do ajustamento combinado (output 3):

- Mostra o efeito líquido de ambos os ajustamentos
- Negativo = predomina o efeito de outlier; Positivo = predomina o efeito de integralidade

---

## Referência pormenorizada

### Parâmetros de configuração

**O módulo `m002` não expõe quaisquer parâmetros ajustáveis pelo utilizador na plataforma FASTR** - os ajustes são executados com a mesma lógica interna para cada projeto. As configurações documentadas abaixo são codificadas dentro do módulo e são descritas aqui para transparência, não para configuração.

??? "Indicadores excluídos (hard-coded)"

    Alguns indicadores são excluídos de todos os ajustamentos devido à sua natureza sensível. A exclusão é feita através de uma correspondência de expressão regular não sensível a maiúsculas e minúsculas em `indicator_common_id`:

    ```r
    EXCLUDED_PATTERN <- "death|still_birth"
    ```

    Isso corresponde a qualquer indicador cujo nome contenha `death` (por exemplo, `u5_deaths`, `maternal_deaths`, `neonatal_deaths`) ou `still_birth`. Para esses códigos, o `count` bruto original é preservado em cada coluna de cenário (`count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both`).

    **Fundamentação**: As contagens de mortalidade e de nados-mortos não devem ser suavizadas ou imputadas, uma vez que representam eventos discretos que podem ter uma variação temporal genuína. O seu ajustamento pode ocultar padrões epidemiológicos importantes ou sinais de surtos.

??? "Exclusões de baixo volume (codificadas)"

    Os indicadores são também automaticamente excluídos do **ajustamento** se nenhuma observação de estabelecimento-mês atingir 100 (`count >= 100`) em qualquer parte do conjunto de dados. Isto evita um ajustamento estatístico sem sentido em indicadores com contagens consistentemente baixas. Os indicadores de baixo volume excluídos têm o seu `count` bruto preservado em todas as quatro colunas do cenário, tal como os indicadores de mortalidade/parto excluídos.

    **Lógica de exclusão**:

    ```r
    low_volume_check <- raw_data[, .(has_volume = any(count >= 100, na.rm = TRUE)),
                                 by = indicator_common_id]
    low_volume_check[, low_volume_exclude := !has_volume]
    LOW_VOLUME_INDICATORS <- low_volume_check[has_volume == FALSE, indicator_common_id]
    ```

    A lista completa (com um marcador `low_volume_exclude` TRUE/FALSE por indicador) é guardada em `M2_low_volume_exclusions.csv` para maior transparência.

??? "Configuração da janela de rolagem (hard-coded)"

    O módulo utiliza uma janela de **6 meses** para todas as médias móveis. Esta escolha equilibra:

    **Vantagens**:

    - Captura tendências de médio prazo
    - Reduz o impacto das flutuações a curto prazo
    - Pontos de dados suficientes para médias estáveis
    - Funciona bem tanto para indicadores estáveis como sazonais

    **Desvios**:

    - Pode não captar mudanças rápidas na prestação de serviços
    - Pode ser demasiado suave em casos de mudanças programáticas genuínas
    - Requer pelo menos 6 observações válidas para uma média centrada óptima

### Especificações de entrada/saída

??? "Ficheiros de entrada"

    O módulo requer três ficheiros de entrada de etapas de processamento anteriores:

    | Ficheiro | Fonte | Descrição | Variáveis-chave |
    |------|--------|-------------|---------------|
    | Dados brutos do HMIS Volumes de serviços ao nível das instalações
    | `M1_output_outliers.csv` | Módulo 1 | Sinalizadores de outlier para cada indicador de mês de instalação | `facility_id`, `indicator_common_id`, `period_id`, `outlier_flag` |
    | `M1_output_completeness.csv` | Módulo 1 | Sinalizadores de exaustividade para cada indicador de mês da instalação | `facility_id`, `indicator_common_id`, `period_id`, `completeness_flag` |

??? "Estrutura de dados de entrada"

    **Dados brutos do HMIS (`hmis_ISO3.csv`)**:

    ```text
    facility_id | admin_area_1 | admin_area_2 | admin_area_3 | period_id | indicator_common_id | count
    ------------|--------------|--------------|--------------|-----------|---------------------|-------
    FAC001      | ISO3         | Province_A   | District_A   | 202301    | anc1                | 145
    FAC001      | ISO3         | Province_A   | District_A   | 202302    | anc1                | 152
    FAC001      | ISO3         | Province_A   | District_A   | 202303    | anc1                | 890  # Outlier
    ```

    **Sinalizadores de anomalias (`M1_output_outliers.csv`)**:

    ```text
    facility_id | indicator_common_id | period_id | outlier_flag
    ------------|---------------------|-----------|-------------
    FAC001      | anc1                | 202301    | 0
    FAC001      | anc1                | 202302    | 0
    FAC001      | anc1                | 202303    | 1           # Flagged as outlier
    ```

    **Sinalizadores de completude (`M1_output_completeness.csv`)**:

    ```text
    facility_id | indicator_common_id | period_id | completeness_flag
    ------------|---------------------|-----------|------------------
    FAC001      | anc1                | 202301    | 1             # Complete
    FAC001      | anc1                | 202302    | 0             # Incomplete
    FAC001      | anc1                | 202303    | 1             # Complete
    ```

??? "Ficheiros de saída"

    O módulo gera quatro ficheiros de saída:

    | Ficheiro | Nível | Descrição | Colunas-chave |
    |------|-------|-------------|-------------|
    | `M2_adjusted_data.csv` | Estabelecimento | Volumes ajustados para todos os cenários a nível do estabelecimento | `facility_id`, áreas administrativas (excl. admin_area_1), `period_id`, `indicator_common_id`, `count_final_*` |
    | `M2_adjusted_data_admin_area.csv` | Subnacional | Volumes ajustados agregados em áreas administrativas subnacionais | Áreas administrativas (excl. admin_area_1), `period_id`, `indicator_common_id`, `count_final_*` |
    | `M2_adjusted_data_national.csv` | Nacional | Volumes agregados ajustados a nível nacional | `admin_area_1`, `period_id`, `indicator_common_id`, `count_final_*` |
    indicadores excluídos do ajustamento devido a volumes baixos | `indicator_common_id`, `low_volume_exclude` | Metadados | Indicadores excluídos do ajustamento devido a volumes baixos | `indicator_common_id`, `low_volume_exclude` | Metadados

??? "Estrutura de dados de saída"

    **Facility-Level Output** (`M2_adjusted_data.csv`):

    ```text
    facility_id | admin_area_2 | admin_area_3 | period_id | indicator_common_id | count_final_none | count_final_outliers | count_final_completeness | count_final_both
    ------------|--------------|--------------|-----------|---------------------|------------------|----------------------|--------------------------|------------------
    FAC001      | Province_A   | District_A   | 202301    | anc1                | 145              | 145                  | 145                      | 145
    FAC001      | Province_A   | District_A   | 202302    | anc1                | 152              | 152                  | 148                      | 148
    FAC001      | Province_A   | District_A   | 202303    | anc1                | 890              | 148                  | 890                      | 148
    ```

    Cada coluna `count_final_*` representa um cenário de ajuste diferente:

    - `count_final_none`: Nenhum ajuste aplicado (valores originais)
    - `count_final_outliers`: Apenas o ajuste de outlier aplicado
    - `count_final_completeness`: Aplicado apenas o ajuste de completitude
    - `count_final_both`: Aplicados os ajustamentos de outlier e de integralidade

### Documentação das funções-chave

??? "Bibliotecas necessárias"

    O módulo depende dos seguintes pacotes do R:

    -   `data.table` - Manipulação de dados de alto desempenho, agregação e cálculos de janela móvel (`frollmean` para médias móveis)
    -   `zoo` - Carregado para utilitários de séries temporais
    -   `lubridate` - Manuseamento de datas (`month()`, `year()`) utilizado para o fallback mesmo mês-último ano

??? "1. `apply_adjustments()`"

    Função principal que implementa a lógica de ajustamento para um único cenário.

    **Finalidade**:

    Substitui valores discrepantes e/ou incompletos usando médias móveis e padrões históricos.

    **Parâmetros**:

    - `raw_data` (data.table): Dados originais do HMIS com contagens de serviços
    - `completeness_data` (data.table): Sinalizadores de integralidade do módulo 1
    - `outlier_data` (data.table): Sinalizadores de outlier do Módulo 1
    - `adjust_outliers` (lógico): Aplicar ou não o ajustamento de outlier
    - `adjust_completeness` (lógico): Aplicar ou não o ajustamento da integralidade

    **Retornos**:

    data.table com valores ajustados na coluna `count_working` e metadados de ajustamento

    **Operações-chave**:

    1. Mescla conjuntos de dados de entrada por `facility_id`, `indicator_common_id` e `period_id`
    2. Converte `period_id` em datas para ordenação temporal
    3. Calcula médias móveis (centradas, para a frente, para trás) para valores válidos
    4. Aplica a hierarquia de ajuste com base na disponibilidade de dados
    5. Rastreia o método de reajuste utilizado para cada valor substituído

??? "2. `apply_adjustments_scenarios()`"

    Função de agrupamento que executa ajustamentos nos quatro cenários.

    **Objetivo**:

    Aplica a lógica de ajuste sob diferentes combinações de ajustes de outlier e completitude.

    **Parâmetros**:

    - `raw_data` (data.table): Dados originais do HMIS
    - `completeness_data` (data.table): Sinalizadores de integralidade
    - `outlier_data` (data.table): Sinalizadores de outlier

    **Retornos**:

    data.table com quatro colunas `count_final_*`, uma por cenário

    **Cenários processados**:

    1. `none`: Sem ajustes (baseline)
    2. `outliers`: Apenas ajustamento de outlier
    3. `completeness`: Apenas ajustamento de integralidade
    4. `both`: Excedente seqüencial e, em seguida, ajuste de completitude

    **Lógica de processamento**:

    - Chama o `apply_adjustments()` uma vez por cenário
    - Preserva o `count` bruto para os indicadores que correspondem ao regex `death|still_birth` e para os indicadores de baixo volume (substituindo qualquer `count_working` específico do cenário)
    - Mescla todos os resultados do cenário em uma única tabela de formato amplo com quatro colunas `count_final_*`

### Métodos estatísticos e algoritmos

??? "Metodologia de ajuste de outlier"

    O ajustamento de valores aberrantes é aplicado a qualquer valor de estabelecimento-mês assinalado no Módulo 1 (`outlier_flag == 1`). O objetivo é substituir estes valores anómalos por dados históricos válidos do mesmo estabelecimento e indicador.

    **Abordagem estatística**:

    As médias móveis são utilizadas para estimar os valores esperados. Uma média móvel (também designada por média móvel) é a média de um conjunto de períodos de tempo em torno do período de referência. Esta técnica suaviza as flutuações a curto prazo e realça as tendências a longo prazo.

    **Definição de valores válidos**:

    Apenas os valores que satisfazem TODOS os critérios seguintes são utilizados nos cálculos:

    - `!is.na(count)` (non-missing)
    - `outlier_flag == 0` (não assinalado como valor atípico)

    **Implementação**:

    O módulo utiliza o `frollmean()` do pacote `zoo` para efetuar cálculos de rolamento eficientes:

    ```r
    data_adj[, valid_count := fifelse(outlier_flag == 0L & !is.na(count), count, NA_real_)]
    data_adj[, `:=`(
      roll6   = frollmean(valid_count, 6, na.rm = TRUE, align = "center"),
      fwd6    = frollmean(valid_count, 6, na.rm = TRUE, align = "left"),
      bwd6    = frollmean(valid_count, 6, na.rm = TRUE, align = "right"),
      fallback= mean(valid_count, na.rm = TRUE)
    ), by = .(facility_id, indicator_common_id)]
    ```

??? "Hierarquia de ajustamento para valores atípicos"

    O processo de ajustamento segue esta **ordem hierárquica** (parando no primeiro método disponível):

    1.  **Média centrada de 6 meses (`roll6`)**

        -   Utiliza os três meses anteriores e os três meses posteriores ao mês anómalo
        -   Fornece uma média equilibrada com base em tendências próximas
        -   Aplicada quando existem valores válidos suficientes em ambos os lados do mês
        -   Etiqueta do método: `roll6`

    2.  **Média prospetiva de 6 meses (`fwd6`)**

        -   Utilizada se a média centrada não puder ser calculada (por exemplo, no início da série cronológica)
        -   Obtém a média dos próximos seis meses válidos
        -   Etiqueta do método: `forward`

    3.  **Média regressiva de 6 meses (`bwd6`)**

        -   Utilizado se nem o `roll6` nem o `fwd6` estiverem disponíveis
        -   Obtém a média dos seis meses válidos mais recentes antes do valor atípico
        -   Etiqueta do método: `backward`

    4.  **Mesmo mês do ano anterior

        -   Se não existir uma média de 6 meses válida, é utilizado o valor do **mesmo mês do ano anterior** (por exemplo, Jan 2023 para Jan 2024)
        -   Só é aplicado se esse valor anterior for válido (não assinalado como anómalo e não em falta) e apenas quando for encontrado exatamente um registo correspondente do ano anterior
        -   Particularmente útil para indicadores sazonais (por exemplo, malária, infecções respiratórias)
        -   Etiqueta do método: `same_month_last_year`
        -   **Implementação**:

        ```r
        data_adj[, `:=`(mm = month(date), yy = year(date))]
        data_adj <- data_adj[, {
          for (i in which(outlier_flag == 1L & is.na(adj_method))) {
            j <- which(mm == mm[i] & yy == yy[i] - 1 & outlier_flag == 0L & !is.na(count))
            if (length(j) == 1L) {
              count_working[i] <- count[j]
              adj_method[i]    <- "same_month_last_year"
              adjust_note[i]   <- format(date[j], "%b-%Y")
            }
          }
          .SD
        }, by = .(facility_id, indicator_common_id)]
        ```

    5.  **Média de todos os valores históricos (Fallback)**

        -   Se todos os métodos anteriores falharem, é utilizada a média de todos os valores históricos válidos para esse indicador de facilidade
        -   Fornece uma linha de base específica da instalação quando não existe um padrão temporal disponível
        -   Etiqueta do método: `fallback`

    **Caso extremo**:

    Se nem mesmo a média de recurso ao nível do estabelecimento puder ser calculada (por exemplo, o estabelecimento não tem quaisquer observações válidas não outlier para esse indicador), o valor outlier permanece como `NA` nas colunas do cenário ajustado.

??? "Metodologia de ajustamento da integralidade"

    O ajustamento de integralidade é aplicado a qualquer mês de instalação em que a contagem de trabalho esteja em falta (`is.na(count_working)`). No cenário `completeness` isto deve-se ao facto de o `count` original ser `NA` (ou seja, o estabelecimento não comunicou esse mês). No cenário `both`, a contagem de trabalho também pode ser `NA` porque a etapa anómala não produziu uma substituição. O `completeness_flag` do Módulo 1 é incorporado para referência, mas não é utilizado como acionador de substituição.

    **Abordagem estatística**:

    É aplicada a mesma metodologia de média móvel, mas a definição de "valores válidos" difere ligeiramente:

    **Valores válidos para o ajustamento da integralidade**:

    - `!is.na(count_working)` (não em falta, possivelmente já ajustado para valores atípicos)
    - `outlier_flag == 0` (não assinalado como valor aberrante nos dados originais)

    **Diferença fundamental do ajustamento de outlier**:

    - O ajustamento de integralidade pode utilizar valores que já foram ajustados para outliers (quando os cenários incluem ambos os ajustamentos)
    - Não é utilizado o método do mesmo mês e do último ano (apenas médias móveis e fallback)

    **Implementação**:

    ```r
    data_adj[, valid_count := fifelse(!is.na(count_working) & outlier_flag == 0L, count_working, NA_real_)]
    data_adj[, `:=`(
      roll6   = frollmean(valid_count, 6, na.rm = TRUE, align = "center"),
      fwd6    = frollmean(valid_count, 6, na.rm = TRUE, align = "left"),
      bwd6    = frollmean(valid_count, 6, na.rm = TRUE, align = "right"),
      fallback= mean(valid_count, na.rm = TRUE)
    ), by = .(facility_id, indicator_common_id)]
    ```

??? "Hierarquia de ajustamento para ser completa"

    A substituição segue esta **ordem hierárquica**:

    1.  **Média centrada de 6 meses (`roll6`)**

        -   Utiliza três meses válidos antes e depois do mês em falta ou incompleto
        -   Método preferido quando existem dados circundantes suficientes
        -   Etiqueta do método: `roll6`

    2.  **Média prospetiva de 6 meses (`fwd6`)**

        -   Utilizado se a média centrada não puder ser calculada (por exemplo, no início da série cronológica)
        -   Etiqueta de método: `forward`

    3.  **Média regressiva de 6 meses (`bwd6`)**

        -   Utilizado se não estiverem disponíveis valores centrados ou prospectivos (por exemplo, no final da série cronológica)
        -   Etiqueta do método: `backward`

    4.  **Média de todos os valores históricos (Fallback)**

        -   Se não for possível calcular médias móveis, utiliza a média de todos os valores válidos para esse indicador de facilidade
        -   Fornece uma linha de base específica do estabelecimento
        -   Etiqueta do método: `fallback`

    **Caso extremo**:

    Se o estabelecimento não tiver valores válidos para esse indicador, a própria média de recurso é `NA` e o valor permanece em falta nas colunas do cenário ajustado.

??? "Lógica de processamento do cenário"

    O módulo processa todos os quatro cenários de ajuste simultaneamente usando a função `apply_adjustments_scenarios()`:

    **Cenário 1: Nenhum** (`count_final_none`)

    - `adjust_outliers = FALSE`, `adjust_completeness = FALSE`
    - Dados originais em bruto sem modificações
    - Serve como linha de base para comparação

    **Cenário 2: valores anómalos** (`count_final_outliers`)

    - `adjust_outliers = TRUE`, `adjust_completeness = FALSE`
    - Apenas os valores anómalos são substituídos
    - Os valores em falta/incompletos permanecem como estão
    - Caso de utilização: Quando a exaustividade é elevada mas os valores anómalos são uma preocupação

    **Cenário 3: Integralidade** (`count_final_completeness`)

    - `adjust_outliers = FALSE`, `adjust_completeness = TRUE`
    - Apenas os valores em falta/incompletos são imputados
    - Os outliers são mantidos nos dados
    - Caso de utilização: Quando a qualidade dos dados é boa mas a comunicação é esporádica

    **Cenário 4: ambos** (`count_final_both`)

    - `adjust_outliers = TRUE`, `adjust_completeness = TRUE`
    - **Processamento sequencial**: Os outliers são ajustados primeiro, depois a integralidade
    - Ajuste mais abrangente
    - Caso de utilização: Quando ambos os problemas de qualidade dos dados são predominantes

    **Ordem de processamento para o cenário "Ambos "**:

    1. O ajuste de outlier cria `count_working` com outliers substituídos
    2. O ajustamento de integralidade opera então no `count_working`, utilizando os valores já ajustados
    3. Isto assegura que a imputação da integralidade utiliza valores limpos (sem outliers) quando disponíveis

    **Importante**:

    Após os ajustamentos específicos do cenário, os indicadores excluídos são repostos no seu `count` bruto original. Isto aplica-se tanto aos indicadores de mortalidade/nascimento (correspondidos através do regex `EXCLUDED_PATTERN`) como aos indicadores de baixo volume:

    ```r
    dat[grepl(EXCLUDED_PATTERN, indicator_common_id, ignore.case = TRUE) |
        indicator_common_id %in% LOW_VOLUME_INDICATORS, count_working := count]
    ```

    Como resultado, as quatro colunas `count_final_*` para esses indicadores são todas iguais ao valor bruto.

??? "Métodos de agregação"

    Todas as agregações geográficas usam **somas simples**:

    ```r
    sum(count_final_both, na.rm = TRUE)
    ```

    **Rationale**:

    - Os volumes de serviço são aditivos (por exemplo, entregas totais = soma das entregas dos estabelecimentos)
    - Os valores em falta (`NA`) são tratados como zero na agregação
    - Consistente com as práticas de comunicação padrão do HMIS

    **Cuidado**:

    Se muitos estabelecimentos tiverem valores `NA` após o ajustamento, os totais subnacionais/nacionais podem ser subestimados. O cenário `count_final_none` fornece um ponto de referência para avaliar o impacto.

??? "Tratamento de dados em falta nos cálculos"

    O módulo aplica `na.rm = TRUE` em todos os cálculos contínuos:

    ```r
    frollmean(valid_count, 6, na.rm = TRUE, align = "center")
    ```

    **Implicação**:

    As médias móveis são calculadas apenas a partir dos valores válidos disponíveis. Se existirem menos de 6 valores, a média é calculada a partir do que estiver disponível. Se não existirem valores válidos, o resultado é `NA`.

### Exemplos de código

??? "Exemplo 1: Ajuste de outlier"

    **Cenário**:

    Um estabelecimento comunica uma contagem invulgarmente elevada de primeiras consultas de cuidados pré-natais (ANC1) em março de 2023.

    **Dados**:

    ```text
    period_id | count | outlier_flag | Surrounding valid values
    ----------|-------|--------------|-------------------------
    202301    | 145   | 0            | valid
    202302    | 152   | 0            | valid
    202303    | 890   | 1            | OUTLIER
    202304    | 148   | 0            | valid
    202305    | 155   | 0            | valid
    202306    | 147   | 0            | valid
    ```

    **Cálculo de ajuste** (média centrada de 6 meses):

    - Valores válidos: [145, 152, 148, 155, 147] (exclui o valor discrepante 890)
    - Média: (145 + 152 + 148 + 155 + 147) / 5 = 149,4
    - **Valor ajustado**: 149.4

    **Método utilizado**:

    `roll6`

??? "Exemplo 2: Correção da integralidade"

    **Cenário**:

    Um estabelecimento não comunica os testes de malária em fevereiro de 2023.

    **Dados**:

    ```text
    period_id | count | completeness_flag | Surrounding valid values
    ----------|-------|-------------------|-------------------------
    202301    | 45    | 1                 | valid
    202302    | NA    | 0                 | INCOMPLETE
    202303    | 48    | 1                 | valid
    202304    | 52    | 1                 | valid
    202305    | 50    | 1                 | valid
    ```

    **Cálculo de reajuste** (média centrada de 6 meses):

    - Valores válidos: [45, 48, 52, 50, ...]
    - Média: 48.75 (utilizando os meses circundantes disponíveis)
    - **Valor calculado**: 48.75

    **Método utilizado**:

    `roll6`

??? "Exemplo 3: Indicador sazonal com mesmo mês-último ano"

    **Cenário**:

    Os casos de malária mostram uma forte sazonalidade, e um outlier de junho de 2023 precisa de ser ajustado.

    **Dados**:

    ```text
    period_id | count | outlier_flag | Notes
    ----------|-------|--------------|-------
    202206    | 234   | 0            | June 2022 (valid)
    202306    | 1850  | 1            | June 2023 (OUTLIER)
    ```

    **Lógica de ajuste**:

    1. Médias móveis centradas, progressivas e regressivas indisponíveis (dados insuficientes)
    2. Método do mesmo mês e do último ano ativado
    3. Valor de junho de 2022 = 234 (válido)
    4. **Valor ajustado**: 234

    **Método utilizado**:

    `same_month_last_year`

??? "Exemplo 4: Comparação de cenários"

    **Facilidade**:

    FAC001

    **Indicador**:

    Entregas institucionais

    **Período:

    Q1 2023

    **Dados originais**:

    ```text
    Month    | Count | Outlier? | Complete?
    ---------|-------|----------|----------
    Jan 2023 | 78    | No       | Yes
    Feb 2023 | 450   | Yes      | Yes       # Outlier
    Mar 2023 | NA    | -        | No        # Incomplete
    ```

    **Resultados do cenário**:

    | Mês | Nenhum | Outliers | Completude | Ambos |
    |----------|------|----------|--------------|------|
    jan 2023 | 78 | 78 | 78 | 78 | 78 | 78 |
    | Fev 2023 | 450 | 82* | 450 | 82* |
    | Mar 2023 | NA | NA | 80** | 80** |

    *Ajustado usando a média móvel

    **Calculado usando a média móvel

    **Interpretação**:

    - **Nenhuma**: Dados brutos com problemas óbvios
    - **Outliers**: Fevereiro corrigido, mas março continua em falta
    - **Completude**: Março preenchido, mas o outlier de fevereiro mantém-se
    - **Ambos**: Conjunto de dados mais completo e limpo

??? "Exemplo 5: Agregação geográfica"

    **Código de agregação subnacional**:

    ```r
    adjusted_data_admin_area_final <- adjusted_data_export[
      ,
      .(
        count_final_none         = sum(count_final_none,         na.rm = TRUE),
        count_final_outliers     = sum(count_final_outliers,     na.rm = TRUE),
        count_final_completeness = sum(count_final_completeness, na.rm = TRUE),
        count_final_both         = sum(count_final_both,         na.rm = TRUE)
      ),
      by = c(geo_admin_area_sub, "indicator_common_id", "period_id")
    ]
    ```

    **Código de agregação nacional**:

    ```r
    adjusted_data_national_final <- adjusted_data_export[
      ,
      .(
        count_final_none         = sum(count_final_none,         na.rm = TRUE),
        count_final_outliers     = sum(count_final_outliers,     na.rm = TRUE),
        count_final_completeness = sum(count_final_completeness, na.rm = TRUE),
        count_final_both         = sum(count_final_both,         na.rm = TRUE)
      ),
      by = .(admin_area_1, indicator_common_id, period_id)
    ]
    ```

### Resolução de problemas

??? "Problemas comuns"

    **Problema 1: Todos os valores permanecem não ajustados

    **Causas possíveis**:

    - O nome do indicador corresponde ao padrão de exclusão `death|still_birth`
    - Indicador marcado como de baixo volume (nenhuma observação atingiu `count >= 100`)
    - Nenhuma marcação de outlier (`outlier_flag == 1`) e nenhum valor em falta nos dados de entrada

    **Solução**:

    Verificar o `M2_low_volume_exclusions.csv` e verificar se as saídas do módulo 1 contêm sinalizadores

    **Problema 2: Os valores ajustados não parecem razoáveis

    **Causas possíveis**:

    - Insuficiência de dados históricos válidos para médias móveis
    - As alterações genuínas do programa estão a ser suavizadas
    - Padrões sazonais não capturados pela janela de 6 meses

    **Solução**:

    - Rever os gráficos das séries cronológicas específicas das instalações
    - Considerar a possibilidade de utilizar o cenário "apenas valores anómalos" se a exaustividade for boa
    - Validar com base nos registos de implementação do programa

    **Problema 3: Muitos valores NA após o ajustamento

    **Causas possíveis**:

    - O estabelecimento tem dados muito escassos
    - Não há valores válidos disponíveis para qualquer método de ajustamento
    - Os primeiros meses da série cronológica carecem de dados históricos

    **Solução**:

    - Esperado para estabelecimentos com um historial de comunicação limitado
    - Considerar a filtragem da qualidade dos dados a nível do estabelecimento
    - Os agregados nacionais/subnacionais somarão os valores disponíveis

    **Questão 4: Os totais subnacionais/nacionais não correspondem às expectativas

    **Causas possíveis**:

    - Valores NA tratados como zero na agregação
    - Cenários diferentes produzem totais diferentes
    - Baixa exaustividade dos relatórios em geral

    **Solução**:

    - Comparar `count_final_none` com `count_final_both` para avaliar o impacto do ajustamento
    - Rever as estatísticas de exaustividade do Módulo 1
    - Considerar o limiar de qualidade dos dados para inclusão

??? "Controlos de garantia de qualidade"

    O módulo inclui vários controlos de qualidade:

    1. **Exclusões de baixo volume**: Identifica e exclui automaticamente os indicadores que nunca atingem `count >= 100`
    2. **Rastreamento de ajustes**: Conta e relata o número de valores ajustados por cada método (`roll6`, `forward`, `backward`, `same_month_last_year`, `fallback`)
    3. **Indicadores excluídos**: Garante que os indicadores de mortalidade e de nados-mortos (correspondidos através da regex `death|still_birth`) nunca são ajustados
    4. **Registo de consola**: Fornece estatísticas detalhadas de progresso e resumo

    **Exemplo de saída da consola**:

    ```text
    Running adjustments...
     -> Adjusting outliers...
         Roll6 adjusted: 1,245
         Forward-filled: 89
         Backward-filled: 67
         Same-month LY: 34
         Fallback mean: 12
     -> Adjusting for completeness...
         Roll6 filled: 2,103
         Forward-filled: 234
         Backward-filled: 178
         Fallback mean: 45
    ```


### Notas de uso

??? "Escolher o cenário correto"

    | Situação | Cenário recomendado | Justificativa
    |-----------|---------------------|-----------|
    | Alta qualidade dos dados, problemas mínimos | `none` | Nenhum ajuste necessário |
    | Qualidade dos dados sem imputação | Boa qualidade, baixa frequência de notificação | `outliers` | Qualidade dos dados sem imputação
    | Boa qualidade, baixa frequência de comunicação | `completeness` | Preencher lacunas preservando os valores reais |
    | Qualidade e exaustividade fracas | `both` | Limpeza exaustiva |
    | Incerteza sobre a qualidade dos dados | Comparar todos os cenários | Análise de sensibilidade | Análise de sensibilidade

??? "Etapas de validação"

    Depois de executar este módulo, considere:

    1. **Comparar cenários**: Examinar as diferenças entre `count_final_none` e `count_final_both`
    2. **Rever as exclusões**: Verificar se o `M2_low_volume_exclusions.csv` tem indicadores inesperados
    3. **Análise agregada**: Assegurar que os totais subnacionais e nacionais são razoáveis
    4. **Gráficos temporais**: Visualizar as tendências antes/depois do ajustamento para identificar a suavização excessiva
    5. **Verificações pontuais a nível de estabelecimento**: Rever os ajustamentos para uma amostra de instalações

??? "Limitações"

    1. **As janelas de enrolar pressupõem estabilidade**: Os ajustes funcionam melhor quando a prestação de serviços é relativamente estável. As alterações genuínas do programa (por exemplo, novas campanhas) podem ser incorretamente suavizadas.

    2. **Não há incerteza de ajuste**: O módulo fornece estimativas pontuais sem intervalos de confiança. Os valores ajustados devem ser tratados como estimativas.

    3. **Ajustes específicos da instalação**: Não há empréstimo de informações entre instalações. As instalações com dados muito escassos podem ter ajustamentos instáveis.

    4. **Padrões sazonais**: Embora o mesmo mês do ano anterior ajude, a forte sazonalidade intra-anual pode não ser totalmente captada por janelas de 6 meses.

    5. **Tratamento de NA na agregação**: Os valores em falta são tratados como zero aquando da soma para níveis geográficos mais elevados, o que pode subestimar os totais se a falta for elevada.

---

**Contacto**: <fastr@worldbank.org>

---

<!--
////////////////////////////////////////////////////////////////////
// //
// _____ _ _____ ____ _____ ____ ___ _ _ _____ _ _ //
// / ____| | |_ _| _ \| ____| / ___/ _ \| \ | |_ _| \ | |//
// | (___ | | | | | | | | |__ | | | | | | \| | | | | \| |//
// \___ \| | | | | | | | | | __| | | | | | | . ` | | | | . ` |//
// ____) | |___ _| |_| |_| | |____ | |__| |_| | |\ | | | | |\ |//
// |_____/|_____|_____|____/|______| \____\___/|_| \_|| |_| |_| \_|//
// //
// Editar os diapositivos do workshop abaixo desta linha //
// //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m5_1 -->
## Da deteção à correção

O módulo 1 assinalou os problemas de qualidade dos dados - valores extremos, relatórios em falta, inconsistências internas. O módulo 2 continua a partir daí.

O FASTR substitui os valores assinalados por estimativas razoáveis a partir dos padrões históricos de cada estabelecimento, para que as análises de utilização de serviços e de cobertura a jusante funcionem com dados mais limpos.

Para apoiar a transparência, o FASTR produz **quatro conjuntos de dados paralelos**:

- **Não ajustados** - valores originais comunicados
- **Outliers ajustados** - valores extremos substituídos
- **Completude ajustada** - valores em falta imputados
- **Ajustados** - todas as correcções aplicadas

Os próximos slides apresentam cada ajuste e seu resultado.
<!-- /SLIDE -->

<!-- SLIDE:m5_3 -->
## Por que ajustar para outliers?

Um único valor extremo - digamos, um pico de 10× no relatório causado por um erro de entrada de dados - pode distorcer a tendência de serviço subjacente para toda uma instalação. O gráfico mostra os mesmos dados antes e depois do ajuste de outliers: o pico é removido, o padrão subjacente é preservado.

![Outlier impact h:340](../resources/diagrams_pt/outlier_impact.svg)

<!--
NOTAS DO APRESENTADOR:
- Painel esquerdo: dados em bruto com o pico causado pelo erro de introdução de dados.
- Painel da direita: a mesma série após o ajuste de outlier utilizando médias móveis.
- Ponto-chave: a tendência é preservada, apenas o artefacto é removido.
- É por esta razão que as estimativas de utilização de serviços e de cobertura a jusante se tornam mais fiáveis.
-->
<!-- /SLIDE -->

<!-- SLIDE:m5_3a -->
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
<!-- /SLIDE -->

<!-- SLIDE:m5_3b -->
<!-- _class: output -->
## Saída de ajuste de outlier

<div class="output-layout">
<div class="output-viz">

![Outlier adjustment](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div class="output-text">

**O que você vê:** Mapa de calor mostrando o quanto o volume de serviço mudou após a substituição de valores atípicos por médias móveis.

**Fórmula:** % de alteração = (ajustado - original) / original × 100

**Interpretação:** Os valores são tipicamente negativos - a remoção de outliers reduz o volume. Ajustes grandes justificam uma investigação sobre a sua origem.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m5_2 -->
## Como funciona o ajuste de completude

Um estabelecimento que perde um mês de relatório parece, nos dados brutos, como uma queda súbita para zero - uma queda nos serviços que não aconteceu de facto. O FASTR preenche estas lacunas com estimativas extraídas de um quadro de média móvel de seis meses ancorado no historial de relatórios do próprio estabelecimento.

| Prioridade | Método | Quando aplicado |
|---|---|---|
| 1 | Média de 6 meses centrada | Existem dados suficientes antes e depois da lacuna |
| 2 | Média de 6 meses para frente | O intervalo está no início da série temporal
| 3 | Média de 6 meses para trás | O intervalo está no final da série temporal
| 4 | Média histórica da facilidade | Recuo quando não é possível uma janela de rolagem

O resultado: as lacunas temporárias na comunicação de dados já não se traduzem em declínios artificiais no volume de serviços medido.
<!-- /SLIDE -->

<!-- SLIDE:m5_2a -->
<!-- _class: output -->
## Resultado do ajustamento de exaustividade

<div class="output-layout">
<div class="output-viz">

![Ajuste de completude](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
<div class="output-text">

**O que vê:** Mapa de calor que mostra a alteração do volume de serviço após a imputação de dados em falta com médias móveis.

**Fórmula:** % de alteração = (ajustado - original) / original × 100

**Interpretação:** Os valores são normalmente positivos - a imputação acrescenta volume. Ajustes grandes indicam áreas que precisam de ser melhoradas na fonte.

</div>
</div>
<!-- /SLIDE -->


<!-- ═══════════════════════════════════════════════════════════════════════════
     SLIDES CONDENSADOS: Métodos + Interpretação combinados
═══════════════════════════════════════════════════════════════════════════ -->

<!-- SLIDE:m5_s1 -->
## Como funciona o ajuste

Os valores anómalos e os valores em falta são substituídos utilizando **médias móveis de 6 meses** a partir dos dados históricos de cada estabelecimento. A mesma abordagem hierárquica aplica-se a ambos os ajustamentos:

| Prioridade | Método | Quando aplicado |
|---|---|---|
| 1 | Média de 6 meses centrada | Dados suficientes antes e depois do valor |
| 2 | Média de 6 meses para frente | O valor está no início da série |
| 3 | Média de 6 meses para trás | O valor está no final da série |
| 4 | Média histórica da instalação | Recurso quando as médias móveis não são possíveis

A substituição é baseada no próprio padrão do estabelecimento, de modo que cada ajuste permanece ancorado ao que o estabelecimento normalmente reporta.
<!-- /SLIDE -->

<!-- SLIDE:m5_s1a -->
## Por que ajustar para outliers?

![Porquê ajustar para outliers - antes e depois](../resources/diagrams_pt/outlier_impact.svg)

<!--
NOTAS DO APRESENTADOR:
- Exemplo visual que mostra o impacto do ajuste de outlier
- O painel esquerdo mostra dados em bruto com um pico causado por um erro de introdução de dados
- O painel da direita mostra os mesmos dados após o ajuste de outlier utilizando médias móveis
- Ponto-chave: a tendência subjacente é preservada enquanto o pico artificial é removido
- Isto torna mais fiáveis as estimativas de utilização e cobertura dos serviços a jusante
-->
<!-- /SLIDE -->

<!-- SLIDE:m5_s2 -->
## Saída do ajuste de outlier

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Outlier adjustment](../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**O que você vê:** Mapa de calor mostrando o quanto o volume de serviço mudou após a substituição de outliers por médias móveis.

**Fórmula:** % de alteração = (ajustado - original) / original × 100

**Interpretação:** Os valores são tipicamente negativos (os outliers removidos reduzem o volume). Ajustes grandes justificam uma investigação sobre a sua origem.

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m5_1a -->
## Indicadores excluídos do ajustamento

Alguns indicadores estão excluídos do processo de ajustamento:

- **Indicadores de mortalidade** (mortes maternas, mortes neonatais, mortes de menores de 5 anos): Estes representam eventos discretos em que o alisamento ou a imputação não são adequados
- **Indicadores de baixo volume**: Os indicadores que nunca excedem 100 eventos notificados em qualquer mês são excluídos do ajustamento

<!--
NOTAS DO APRESENTADOR:
- Este módulo aborda as questões identificadas no DQA
- Conceito-chave: substituímos os valores problemáticos por estimativas baseadas no histórico da própria instituição
- Quatro conjuntos de dados paralelos permitem a análise de sensibilidade - até que ponto os resultados mudam?
- A mortalidade foi excluída porque a suavização de eventos raros discretos é inadequada
- Baixo volume excluído porque o ajustamento acrescenta ruído a dados já escassos
-->
<!-- /SLIDE -->

<!-- SLIDE:m5_s0 -->
## Da deteção à correção

O módulo 1 assinalou os problemas de qualidade dos dados - valores extremos, relatórios em falta, inconsistências internas. O módulo 2 continua a partir daí.

O FASTR substitui os valores assinalados por estimativas razoáveis a partir dos padrões históricos de cada estabelecimento, para que as análises de utilização de serviços e de cobertura a jusante funcionem com dados mais limpos.

Para apoiar a transparência, o FASTR produz **quatro conjuntos de dados paralelos**:

- **Não ajustados** - valores originais comunicados
- **Outliers ajustados** - valores extremos substituídos
- **Completude ajustada** - valores em falta imputados
- **Ajustados** - todas as correcções aplicadas

Os próximos slides apresentam cada ajuste e seu resultado.
<!-- /SLIDE -->

<!-- SLIDE:m5_s0a -->
## Indicadores excluídos do ajuste

Duas categorias de indicadores são excluídas do processo de ajustamento:

- **Indicadores de mortalidade** (mortes maternas, mortes neonatais, mortes de menores de 5 anos) - eventos discretos em que o alisamento ou a imputação não são apropriados.
- **Indicadores de baixo volume** - indicadores que nunca excedem 100 eventos notificados em qualquer mês. O ajustamento acrescentaria ruído a dados já escassos.
<!-- /SLIDE -->

<!-- SLIDE:m5_s2b -->
<!-- _class: output -->
## Saída do ajuste de completude

<div class="output-layout">
<div class="output-viz">

![Ajuste de completude](../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
<div class="output-text">

**O que vê:** Mapa de calor que mostra a alteração do volume de serviço após a imputação de dados em falta com médias móveis.

**Fórmula:** % de alteração = (ajustado - original) / original × 100

**Interpretação:** Os valores são normalmente positivos (a imputação acrescenta volume). Ajustes grandes indicam áreas que precisam ser melhoradas em termos de completude.

</div>
</div>

<!--
NOTAS DO APRESENTADOR:
- Dois resultados mostrados: ajuste de outlier e ajuste de completude
- Mapa de calor de outliers: valores negativos significam que os outliers foram removidos (redução das contagens inflacionadas)
- Mapa de calor da integralidade: valores positivos significam que as lacunas foram preenchidas (aumento do volume total)
- Os grandes ajustamentos (cores escuras) indicam áreas/indicadores com problemas de qualidade dos dados
- Utilize-os para identificar onde concentrar os esforços de melhoria da qualidade dos dados
- Comparar regiões: quais as que têm mais problemas de anomalias do que problemas de exaustividade?
-->
<!-- /SLIDE -->
