<!-- AUTO-TRANSLATED from 06b_disruption_detection.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Detecção de perturbações

## Contexto e finalidade

### Objetivo do módulo

O módulo de deteção de perturbações identifica os meses em que o volume de um serviço de saúde foi invulgarmente baixo ou invulgarmente elevado, em comparação com o que as unidades que comunicaram dados nesse mês prestariam normalmente. Substitui a abordagem baseada em gráficos de controlo e regressão de painel do anterior módulo «Utilização de serviços» (M3), que foi retirado da plataforma.

O módulo aplica um modelo bayesiano de duas partes aos dados mensais ao nível das unidades de saúde. Uma parte modela se cada unidade de saúde apresenta dados num determinado mês. A outra parte modela a quantidade de serviços prestados por uma unidade de saúde quando esta apresenta dados. Manter estas duas questões separadas é a ideia central: uma queda no total nacional pode resultar de unidades de saúde que deixam de apresentar dados, de unidades de saúde que prestam menos serviços, ou de ambos, sendo que apenas a segunda situação constitui uma interrupção do serviço.

Para cada indicador, mês e área geográfica, o módulo produz um volume observado, um volume esperado, um intervalo de credibilidade de 95 % em torno dessa expectativa e um aviso quando o volume observado fica fora do intervalo.

### Fundamentação analítica

Os volumes agregados de serviço variam por diversas razões: sazonalidade, tendência a longo prazo, abertura ou encerramento de instalações, instalações que deixam de enviar relatórios durante alguns meses e alterações reais na prestação do serviço. As abordagens anteriores modelavam diretamente a série agregada, pelo que um mês em que um décimo das instalações não apresentasse relatórios parecia idêntico a um mês em que todas as instalações prestassem um décimo menos.

A modelação ao nível das unidades de saúde resolve esta questão. O volume esperado para um mês é calculado apenas a partir das unidades que efetivamente apresentaram relatórios nesse mês, pelo que os valores observados e esperados são comparados com base no mesmo conjunto de unidades. Uma lacuna nos relatórios não cria uma falsa perturbação, e um declínio real entre as unidades que apresentam relatórios não é ocultado pela chegada de uma nova unidade que apresenta relatórios.

A modelação ao nível das unidades de saúde também lida com a heterogeneidade. Um efeito aleatório por unidade permite que cada unidade tenha o seu próprio nível de referência, pelo que um grande hospital e um pequeno posto de saúde são comparados com o seu próprio histórico, em vez de com uma média nacional.

### Pontos-chave

| Componente | Detalhes |
|-----------|---------|
| **Entradas** | Volumes ajustados ao nível da unidade, provenientes do módulo de ajuste da qualidade dos dados (`M2_adjusted_data.csv`)<br>HMIS bruto (`hmis_ISO3.csv`), apenas para atribuir níveis administrativos às unidades |
| **Resultados** | `M11_disruptions_analysis_admin_area_1.csv` a `_4.csv`: valores observados, esperados, limites de credibilidade de 95 %, lacunas de reporte e de prestação de serviços, e indicadores de défice/excedente por indicador, mês e área |
| **Objetivo** | Detetar alterações reais na prestação de serviços entre as unidades de saúde que comunicam dados, separadamente das alterações na exaustividade dos relatórios |
| **Pré-requisito** | Módulo de ajuste da qualidade dos dados (M2) |
| **Método** | Modelo bayesiano de intensidade latente em duas partes (modelo de reporte de Bernoulli e modelo de serviço binomial negativo) ajustado com o INLA |

O modelo foi desenvolvido por Mustapha Wasseja e integrado na plataforma como módulo `m011`.

---

## Fluxo de trabalho analítico

### Visão geral das etapas analíticas

O módulo é executado uma vez por indicador ao nível da unidade de saúde e, em seguida, agrega os resultados a cada nível administrativo. Não é ajustado nenhum modelo separado por província ou distrito.

1. **Carregar os dados ajustados.** As contagens mensais ao nível da unidade de saúde provêm do módulo de ajuste da qualidade dos dados. A contagem utilizada é a contagem não ajustada ou a contagem ajustada para valores atípicos. As contagens imputadas com base na completude são deliberadamente rejeitadas: este módulo modela ele próprio as lacunas nos relatórios, pelo que tem de as identificar nos dados.

2. **Construir a grelha «unidade de saúde por mês».** Para cada indicador, cada unidade de saúde é emparelhada com cada mês do período. Uma célula é marcada como «reportada» quando existe um valor e como «não reportada» nos restantes casos. Os meses anteriores ao primeiro relatório de uma unidade de saúde são omitidos por predefinição, pelo que uma unidade que tenha aberto a meio do período não é considerada «silenciosa» antes de existir.

3. **Aplicar a política do zero.** Algumas instâncias do HMIS armazenam um zero explícito quando uma unidade não reportou qualquer atividade; outras preenchem automaticamente com zero quando nada foi enviado. Uma regra configurável determina quais os zeros que correspondem a relatórios reais e quais são reclassificados como dados em falta.

4. **Ajustar o modelo de reporte (Parte 1).** Um modelo de Bernoulli aplicado à grelha completa estima, para cada unidade e mês, a probabilidade de a unidade apresentar um relatório. O modelo inclui uma tendência temporal linear, termos de sazonalidade de Fourier e um efeito aleatório da unidade.

5. **Ajustar o modelo de serviço (Parte 2).** Um modelo binomial negativo aplicado apenas às células de reporte estima a intensidade latente do serviço para cada unidade e mês, com a mesma tendência, sazonalidade e efeito da unidade.

6. **Agregar aos níveis administrativos.** Para cada área e mês, o volume esperado é a soma das intensidades modeladas nas instalações que comunicaram dados nesse mês. O volume observado é a soma dos valores comunicados por estas. O intervalo de credibilidade de 95 % é construído a partir das mesmas instalações.

7. **Assinalar desvios.** Um mês é assinalado como deficitário quando o volume observado está abaixo do limite inferior do intervalo e como excedentário quando está acima do limite superior.

8. **Decompor a diferença.** São calculadas mais duas expectativas para todas as instalações, quer tenham ou não apresentado relatórios, para dividir o défice em relação a um cenário contrafactual de relatórios completos numa parte relativa aos relatórios e numa parte relativa aos serviços.

9. **Gerar resultados.** Um ficheiro por nível administrativo, reescrito após cada indicador, de modo a que uma falha numa fase tardia de um período prolongado não faça perder nada do que já foi calculado.

### Pontos-chave de decisão

**Variável de contagem**

O valor predefinido é a contagem ajustada em relação a valores atípicos. A contagem não ajustada está disponível para casos em que o ajuste de valores atípicos não seja considerado fiável. As contagens imputadas para garantir a exaustividade não são oferecidas, uma vez que preenchem as lacunas que o módulo se destina a modelar.

**Termos de sazonalidade**

A sazonalidade é representada por pares de termos seno e cosseno. O valor predefinido de dois pares capta um ciclo anual e um semestral. Indicadores com picos acentuados de campanhas, como a suplementação de vitamina A, podem necessitar de três ou quatro pares.

**Política de zeros**

Estão disponíveis cinco configurações. `all` trata cada zero como um relatório real de atividade nula e é a configuração predefinida. `none` trata cada zero como ausente. O `auto` mantém um zero como valor real apenas quando a unidade de saúde submeteu pelo menos um outro indicador nesse mês, e o `strict` exige adicionalmente que esse outro indicador seja superior a zero, para sistemas que preenchem automaticamente zeros em todos os indicadores de uma só vez. `detect` escolhe entre `all`, `auto` e `strict` com base na proporção e no padrão dos zeros nos dados.

**Instalações novas e encerradas**

Os meses anteriores ao lançamento são excluídos por predefinição. Também é possível definir um período de tolerância para o encerramento presumido: os meses da grelha que se situem a mais de N meses após o último relatório de sempre de uma instalação são excluídos, enquanto os primeiros N meses de silêncio continuam a contar como não comunicados, de modo a que uma verdadeira interrupção na comunicação de dados permaneça visível. Esta opção está desativada por predefinição, uma vez que o silêncio prolongado é ambíguo.

**Intervalos de confiança em níveis detalhados**

Por predefinição, o intervalo para uma área é a soma dos limites do intervalo ao nível da instalação. Este método é rápido e ligeiramente conservador, tornando-se aproximado ao nível distrital e em níveis inferiores. Os sorteios posteriores conjuntos fornecem intervalos devidamente calibrados em todos os níveis, com um tempo de execução cerca de dez vezes superior e uma pegada de memória muito maior.

### Resultados da análise e visualização

A plataforma fornece uma métrica por nível para os resultados nacionais e da área administrativa 2, cada uma com um gráfico predefinido:

| Métrica | Ficheiro de resultados | Gráfico |
|--------|-------------|-------|
| Detecção bayesiana de perturbações, nacional | `M11_disruptions_analysis_admin_area_1.csv` | Gráfico de perturbações com banda de credibilidade de 95 %, um painel por indicador |
| Detecção bayesiana de perturbações, área administrativa 2 | `M11_disruptions_analysis_admin_area_2.csv` | O mesmo gráfico, indicadores nas linhas e áreas nas colunas |

O gráfico apresenta o volume observado como uma linha preta contínua e o volume esperado como uma linha preta tracejada, sobre uma faixa cinzenta que representa o intervalo de credibilidade de 95 %. Nos pontos em que a linha observada se eleva acima da faixa, a área entre ambas é sombreada a verde; nos pontos em que fica abaixo da faixa, é sombreada a vermelho. Para indicadores em que um aumento é desfavorável, as duas cores são invertidas.

Os ficheiros da área de administração 3 e da área de administração 4 são gerados, mas não têm métricas integradas; podem ser consultados através de visualizações personalizadas e do assistente de IA.

---

## Referência detalhada

### Parâmetros de configuração

Os parâmetros são definidos em **Resultados → Predefinições do módulo** e aplicam-se a todos os pacotes de resultados gerados posteriormente.

| Parâmetro | Opções | Predefinição | Finalidade |
|-----------|---------|---------|---------|
| `SELECTEDCOUNT` | `count_final_none`, `count_final_outliers` | `count_final_outliers` | Variável de contagem a modelar. As contagens imputadas por completude são rejeitadas. |
| `FOURIER_K` | inteiro | `2` | Número de pares seno/cosseno para a sazonalidade. Aumente para 3 ou 4 no caso de indicadores do tipo «campanha». |
| `USE_POSTERIOR_DRAWS` | sim / não | não | Amostragens posteriores conjuntas (500 amostras) para intervalos de credibilidade subnacionais calibrados. Mais lento e com maior consumo de memória em países de grande dimensão. |
| `ZEROS_REAL` | `all`, `detect`, `auto`, `strict`, `none` | `all` | Como são tratados os zeros explícitos. |
| `EXCLUDE_PRELAUNCH` | sim / não | sim | Excluir os meses da grelha anteriores ao primeiro relatório de sempre de uma instalação. |
| `POSTCLOSURE_GRACE` | meses inteiros | `0` (desativado) | Eliminar os meses da grelha que se situem mais de N meses após o último relatório de uma instalação. |

### Especificações de entrada

**`M2_adjusted_data.csv`** (do módulo de ajuste da qualidade dos dados): uma linha por instalação, indicador e mês, com as colunas de contagem ajustadas. Apenas as colunas-chave e a coluna de contagem selecionada são lidas, uma vez que o ficheiro pode exceder 80 milhões de linhas.

**`hmis_ISO3.csv`**: utilizado apenas para consultar os níveis administrativos de cada unidade. O módulo deteta a coluna `admin_area_N` de nível mais baixo presente e produz agregados até esse nível.

### Especificações de saída

Quatro ficheiros partilham as mesmas colunas, com uma ou mais colunas de área à frente:

| Coluna | Significado |
|--------|---------|
| `admin_area_1` … `admin_area_4` | Identificadores de área para o nível do ficheiro |
| `indicator_common_id` | Indicador |
| `period_id` | Mês, no formato AAAAMM |
| `observed` | Soma dos valores comunicados pelas instalações que comunicaram nesse mês |
| `expected` | Soma da intensidade de serviço modelada nas mesmas instalações |
| `ppi_lwr`, `ppi_upr` | Limites inferior e superior do intervalo de credibilidade de 95 % de `expected` |
| `expected_full` | Soma da intensidade modelada em todas as instalações da área, quer tenham ou não comunicado |
| `expected_as` | Soma da intensidade ponderada pela probabilidade de comunicação, em todas as instalações |
| `gap_reporting` | `expected_full − expected_as`: défice atribuível à não comunicação |
| `gap_service` | `expected_as − observed`: défice atribuível à alteração do serviço |
| `flag_deficit` | 1 quando `observed < ppi_lwr` |
| `flag_surplus` | 1 quando `observed > ppi_upr` |
| `mean_p` | Probabilidade média modelada de comunicação entre as unidades da área |
| `n_facilities` | Número de unidades que comunicaram nesse mês |

Os níveis que não existem nos dados do país recebem um ficheiro vazio com as mesmas colunas.

### Modelo estatístico

Seja $f$ o índice das instalações e $t$ o índice dos meses.

**Parte 1, comunicação de dados.** O facto de a instalação $f$ comunicar dados no mês $t$ é modelado como

$$
\text{reported}_{f,t} \sim \text{Bernoulli}(p_{f,t}), \qquad
\text{logit}(p_{f,t}) = \alpha + \beta\, z_t + \sum_{k=1}^{K}\left(a_k \sin\tfrac{2\pi k m_t}{12} + b_k \cos\tfrac{2\pi k m_t}{12}\right) + u_f
$$

onde $z_t$ é o índice temporal padronizado, $m_t$ o mês civil, $K$ o número de pares de Fourier e $u_f$ um efeito aleatório independente da unidade.

**Parte 2, serviço.** Para as células em que existe um relatório, a contagem é modelada como

$$
y_{f,t} \sim \text{NegBin}(\mu_{f,t}, \phi), \qquad
\log(\mu_{f,t}) = \alpha' + \beta' z_t + \sum_{k=1}^{K}\left(a'_k \sin\tfrac{2\pi k m_t}{12} + b'_k \cos\tfrac{2\pi k m_t}{12}\right) + v_f
$$

com o seu próprio efeito aleatório da instalação $v_f$ e um parâmetro de sobredispersão $\phi$. A família binomial negativa acomoda a variação extra-Poisson típica das contagens nas instalações.

**Distribuições a priori e ajuste.** Ambos os efeitos aleatórios de instalação utilizam uma distribuição a priori de complexidade penalizada na sua precisão, com $P(\sigma > 1) = 0.01$. Ambos os modelos são ajustados com a aproximação de Laplace aninhada integrada (INLA), o que fornece marginais a posteriori sem amostragem de Monte Carlo por cadeias de Markov e torna viável um modelo por instalação para dezenas de milhares de instalações.

**Linha de base esperada e intervalo.** Para uma área $A$ e um mês $t$, sendo $R_{A,t}$ o conjunto de instalações em $A$ que reportaram em $t$:

$$
\text{expected}_{A,t} = \sum_{f \in R_{A,t}} \tilde\mu_{f,t}
$$

onde $\tilde\mu_{f,t}$ é a mediana a posteriori de $\mu_{f,t}$. O intervalo predefinido soma os quantis de 2,5 % e 97,5 % ao nível da unidade de saúde sobre o mesmo conjunto. Com amostragens posteriores conjuntas, somam-se 500 amostras de $\mu$ em cada área e mês e, em vez disso, consideram-se os quantis de 2,5 % e 97,5 % dessas somas.

**Decomposição da diferença.** Para cada célula da grelha, incluindo os meses sem dados, é reconstruída uma intensidade prevista $\hat\mu_{f,t}$ a partir dos efeitos fixos e do efeito da instalação. Em seguida,

$$
\text{expected\_full}_{A,t} = \sum_{f \in A} \hat\mu_{f,t}, \qquad
\text{expected\_as}_{A,t} = \sum_{f \in A} \tilde p_{f,t}\,\hat\mu_{f,t}
$$

e as duas diferenças resultam conforme definido na tabela de resultados. Os indicadores são sempre calculados em relação a `expected`, nunca em relação a estes cenários contrafactuais.

### Interpretação

- Um mês com `flag_deficit = 1` representa um declínio real na prestação de serviços entre as instalações que reportaram, após ter em conta a tendência, a sazonalidade e as diferenças entre instalações. Não se explica pelo facto de as instalações terem deixado de comunicar dados.
- Um mês com `flag_surplus = 1` representa um aumento real, por exemplo, uma campanha ou uma recuperação.
- Um mês dentro da faixa situa-se dentro da variação esperada e não deve ser interpretado como um sinal, mesmo que o total bruto tenha variado.
- Um valor elevado de `gap_reporting` ao lado de um valor baixo de `gap_service` significa que a lacuna no total bruto se deve, na sua maioria, à falta de relatórios, sendo uma questão de qualidade dos dados e não de prestação de serviços.
- O `mean_p` acompanha a completude dos relatórios tal como o modelo a percebe e situa-se normalmente entre 60 % e 95 %.

Os últimos meses da série merecem cautela por uma razão diferente: os relatórios atrasados chegam após a execução da análise, pelo que os valores observados mais recentes podem ser revistos em alta num pacote posterior.

### Notas de utilização

- **Tempo de execução e memória.** Cada indicador ajusta dois modelos ao nível da unidade. Numa rede de grande dimensão, uma execução demora várias horas. O intervalo de soma marginal predefinido é a escolha prática para pacotes de rotina; os sorteios conjuntos devem ser reservados para uma análise específica de alguns indicadores.
- **Robustez.** Um indicador que não converge ou que apresenta dados degenerados é ignorado, com uma mensagem no registo de geração, e a execução continua. Os resultados são atualizados após cada indicador.
- **Escolha da política de zeros.** Observe a proporção de zeros nos dados ajustados e verifique se os meses de instalação com valores totalmente nulos abrangem vários indicadores ao mesmo tempo. Se os zeros forem raros, o `all` é a escolha certa. Se o sistema preencher com zeros em massa, utilize o `strict` ou deixe que o `detect` escolha.
- **Relação com os módulos de qualidade dos dados.** Uma vez que o módulo modela o próprio relatório, deve ser alimentado com contagens que ainda contenham as lacunas de reporte. Executá-lo com contagens imputadas com base na completude faria com que todos os meses parecessem totalmente reportados e removeria a informação de que a Parte 1 necessita.

### Leitura adicional

- Rue, H., Martino, S. e Chopin, N. (2009). Inferência bayesiana aproximada para modelos gaussianos latentes utilizando aproximações de Laplace aninhadas integradas. *Journal of the Royal Statistical Society: Series B*, 71(2), 319–392.
- Simpson, D., Rue, H., Riebler, A., Martins, T. G. e Sørbye, S. H. (2017). Penalização da complexidade dos componentes do modelo: uma abordagem fundamentada e prática para a construção de distribuições a priori. *Statistical Science*, 32(1), 1–28.


---

## Abordagem anterior: cartas de controlo e regressão em painel (módulo M3 retirado)

Até 2026, a deteção de perturbações era executada no módulo de utilização do serviço (M3), que modelava volumes agregados através do controlo estatístico de processos e da regressão de painel. O módulo foi retirado da plataforma e substituído pelo módulo bayesiano descrito acima. O seu método é aqui mantido para referência, uma vez que os relatórios nacionais elaborados antes da alteração o citam e porque os seus resultados ainda são legíveis em pacotes de resultados mais antigos.

??? "Como funcionava o modelo anterior"

    ### Visão geral das etapas analíticas

    O módulo funciona em duas partes sequenciais, cada uma com um objetivo distinto:

    **Parte 1: Análise da carta de controlo** - Identifica padrões invulgares nos volumes de serviço

    1. **Preparar os dados**: Carregar os dados dos serviços de saúde, remover os valores anómalos previamente identificados, agregar ao nível geográfico adequado e preencher os meses em falta utilizando a interpolação.

    2. **Modelar os padrões esperados**: Para cada combinação de indicador de saúde e área geográfica, usar métodos estatísticos robustos para estimar como devem ser os volumes de serviços com base em tendências históricas e padrões sazonais (por exemplo, contabilizar aumentos previsíveis de casos de malária durante a estação das chuvas).

    3. **Detetar desvios**: Comparar os volumes de serviço reais com os padrões esperados e identificar desvios significativos utilizando várias regras de deteção:
       - **Perturbações acentuadas**: Um único mês com desvios extremos
       - **Quedas sustentadas**: Declínios graduais ao longo de vários meses
       - **Quedas sustentadas**: Períodos consistentemente abaixo dos níveis esperados
       - **Subidas sustentadas**: Períodos consistentemente acima dos níveis esperados
       - **Padrões de dados em falta**: Lacunas nos relatórios que podem indicar problemas

    4. **Sinalizar períodos de interrupção**: Marcar os meses em que é detectado qualquer padrão de interrupção, assegurando que os meses recentes são sempre assinalados para revisão.

    **Parte 2: Análise de perturbações** - Quantifica o impacto das perturbações identificadas

    5. **Aplicar modelos de regressão**: Utilizar regressão de painel a vários níveis geográficos (nacional, provincial, distrital) para estimar o volume de serviços alterado durante os períodos de perturbação assinalados, controlando as tendências e a sazonalidade.

    6. **Calcular défices e excedentes**: Comparar os volumes previstos com os volumes reais para quantificar a magnitude das interrupções em números absolutos e percentagens.

    7. **Gerar resultados**: Criar ficheiros de resumo que mostrem os impactos das perturbações em cada nível geográfico, prontos para visualização e elaboração de relatórios.

    ### Diagrama de fluxo de trabalho

    <iframe src="../resources/diagrams/mod3_workflow.html" width="100%" height="800" style="border: 1px solid #ccc; border-radius: 4px;" title="Fluxo de trabalho interativo do módulo 3"></iframe>

    ### Pontos de decisão chave

    **Nível geográfico de análise**

    O módulo suporta a análise de perturbações a várias escalas geográficas. Os utilizadores podem limitar a análise aos níveis nacional e provincial, o que é computacionalmente mais rápido e adequado para a monitorização de rotina, ou alargar a análise aos níveis distrital e distrital para obter informações mais granulares para uma investigação e resposta direcionadas.

    **Seleção do nível da carta de controlo

    O nível a que as cartas de controlo são calculadas determina onde é efectuada a modelação estatística. Isto é configurado através de dois sinalizadores e segue a convenção FASTR em que os números de nível administrativo mais elevado correspondem a unidades geográficas mais pequenas.

    - **Configuração predefinida (ambos os sinalizadores definidos como FALSE)**
      As cartas de controlo são calculadas a um nível subnacional intermédio (**admin_area_2**). Os volumes de serviço são agregados a este nível e a estimativa de tendências, o cálculo do limite de controlo e a deteção de perturbações são efectuados para cada combinação geografia-indicador. Esta opção é a mais eficiente em termos de cálculo e é adequada para a monitorização de rotina.

    - **MODELO_DE_DISTRITO_EXECUTADO = TRUE**
      As cartas de controlo são calculadas a um nível subnacional mais fino (**admin_area_3**). Os volumes de serviço são agregados a unidades geográficas mais pequenas, permitindo a deteção de perturbações localizadas que podem ser ocultadas em níveis de agregação mais elevados. Esta opção é mais intensiva em termos de cálculo, mas proporciona uma maior resolução espacial.

    - **RUN_ADMIN_AREA_4_ANALYSIS = TRUE**
      As cartas de controlo são calculadas ao nível geográfico mais granular disponível (**admin_area_4**). Isto permite a identificação de perturbações altamente localizadas ou ao nível das instalações. É a opção que consome mais recursos e é normalmente utilizada para análises direcionadas ou de diagnóstico.

    O nível do gráfico de controle de qualidade selecionado determina onde a modelagem estatística é conduzida, incluindo a estimativa de tendências, o cálculo do limite de controle e a marcação de interrupções. Independentemente do nível a que as cartas de controlo são calculadas, os resultados das perturbações são agregados e comunicados a todos os níveis geográficos disponíveis (nacional e subnacional).


    **Definições de sensibilidade

    O módulo utiliza limiares estatísticos configuráveis para definir o que constitui uma perturbação. As definições mais sensíveis (limiares mais baixos) assinalam desvios mais pequenos dos padrões esperados e são adequadas para fins de alerta precoce. As definições mais conservadoras (limiares mais elevados) restringem a deteção a desvios maiores e são úteis para se concentrarem em perturbações importantes.

    **Tratamento da exaustividade dos relatórios

    O módulo aceita versões alternativas das contagens de serviços produzidas pelo Módulo 2, permitindo aos utilizadores escolher entre analisar os volumes brutos comunicados ou os volumes ajustados para a exaustividade dos relatórios. Isto proporciona flexibilidade para alinhar a análise das perturbações com diferentes pressupostos de qualidade dos dados.

??? "Processamento de dados e resultados"


    **Transformação de entrada**

    O módulo começa com contagens mensais de serviços ao nível dos estabelecimentos (por exemplo, entregas comunicadas por cada estabelecimento). Estes dados são agregados ao nível geográfico selecionado. As observações identificadas como anómalas no Módulo 1 são excluídas para evitar que os valores anómalos influenciem a estimativa das tendências e os limites de controlo.

    **Estimativa e deteção de padrões

    Utilizando métodos estatísticos robustos, o módulo estima os padrões de utilização de serviços esperados para cada indicador e unidade geográfica com base em dados históricos, tendo em conta as tendências a longo prazo e a sazonalidade. Os meses em que os volumes de serviço observados se desviam significativamente destes padrões esperados são assinalados como potenciais interrupções.

    **Quantificação dos impactos das perturbações

    Para os períodos identificados como perturbados, são utilizados modelos baseados em regressão para estimar os volumes de serviço contrafactuais - que representam a utilização esperada na ausência de perturbações. As diferenças entre os volumes previstos e observados são calculadas para quantificar os défices ou excedentes de serviço.

    **Estrutura de saída

    Os resultados finais apresentam métricas de perturbação a vários níveis geográficos, desde resumos nacionais a resultados locais pormenorizados. Os dados originais reportados são preservados, com campos adicionais que fornecem valores esperados, sinais de perturbação e impactos quantificados.

??? "Gráficos real vs esperado"

    **2. Serviços efectivos versus serviços previstos (nacional)**

    Gráfico de linhas que compara os volumes de serviços observados com as previsões do modelo a nível nacional.

    número de serviços efetivo vs. previsto a nível nacional](resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

    **3. Serviços reais versus serviços previstos (subnacional)**

    Gráficos de linhas por região, comparando os volumes observados com os padrões esperados.

    número de serviços efectivos e previstos a nível subnacional] (resources/default_outputs/Module3_3_Actual_vs_expected_subnational.png)

    Para os gráficos reais versus esperados (resultados 2-3):

    - **Linha preta**: Volumes de serviço reais (observados)
    - **Áreas sombreadas a vermelho**: Períodos de défice (real abaixo do previsto)
    - **Áreas sombreadas a verde**: Períodos de excedente (real acima do esperado)


### Parâmetros de configuração

??? "Parâmetros de análise do núcleo"

    | Parâmetro | Predefinição | Tipo | Descrição | Orientação de ajuste |
    |-----------|---------|------|-------------|-----------------|
    | `COUNTRY_ISO3` | "ISO3" | String | Código de país de três letras | Defina o código do seu país (por exemplo, "RWA", "UGA", "ZMB") |
    | `SELECTEDCOUNT` | "count_final_outliers" | String | Coluna de dados usada para modelagem de regressão | Opções: `count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both` |
    | `VISUALIZATIONCOUNT` | "count_final_outliers" | String | Coluna de dados utilizada para visualização | As mesmas opções que `SELECTEDCOUNT`; podem ser diferentes se pretender modelar uma e traçar outra |

??? "Parâmetros da carta de controlo"

    | Parâmetro | Padrão | Tipo | Descrição | Orientação de ajuste
    |-----------|---------|------|-------------|-----------------|
    | `SMOOTH_K` | 7 | Inteiro (ímpar) | Tamanho da janela da mediana móvel em meses | Valores maiores = tendências mais suaves, menos sensibilidade. Deve ser um número ímpar (por exemplo, 5, 7, 9, 11)
    | Limiar de unidades MAD para perturbações acentuadas | Menor = mais sensível (por exemplo, 1,0), maior = mais conservador (por exemplo, 2,0) |
    | 0,90 | Numérico | Limite de proporção para quedas sustentadas | 0,90 = sinalizar se estiver abaixo de 90% do esperado (queda de 10%). Use 0,80 para o limite de queda de 20%
    | Se o valor real diferir do previsto em >10%, use o valor previsto nas visualizações

    **Nota**: `RISE_THRESHOLD` é automaticamente calculado como `1 / DIP_THRESHOLD` (predefinição: ~1,11) para espelhar simetricamente a deteção de interrupções.

??? "Parâmetros de análise geográfica"

    | Parâmetro | Predefinição | Tipo | Descrição | Orientação de ajuste
    |-----------|---------|------|-------------|-----------------|
    | Nível geográfico para cartas de controlo | Definido automaticamente com base em `RUN_DISTRICT_MODEL` e `RUN_ADMIN_AREA_4_ANALYSIS` |
    | `RUN_DISTRICT_MODEL` | FALSE | Lógico | Se deve executar regressões admin_area_3 | Definir TRUE para análise a nível distrital (aumenta o tempo de execução) |
    | Se deve executar a análise admin_area_4 | Definir TRUE para análise de nível mais fino (muito lento para grandes conjuntos de dados) |

??? "Parâmetros da fonte de dados"

    | Parâmetro | Predefinição | Tipo | Descrição |
    |-----------|---------|------|-------------|
    | `PROJECT_DATA_HMIS` | "hmis_ISO3.csv" | String | Nome do ficheiro para os dados brutos do HMIS

??? "Guia de seleção de parâmetros"

    **Para análise de alta sensibilidade** (deteção de perturbações mais pequenas):
    - `MADS_THRESHOLD = 1.0`
    - `DIP_THRESHOLD = 0.95` (queda de 5%)
    - `SMOOTH_K = 5` (menos suavização)

    **Para uma análise conservadora** (apenas grandes perturbações):
    - `MADS_THRESHOLD = 2.0`
    - `DIP_THRESHOLD = 0.80` (queda de 20%)
    - `SMOOTH_K = 9` ou `11` (mais suavização)

    **Para um tempo de execução mais rápido**:
    - `RUN_DISTRICT_MODEL = FALSE`
    - `RUN_ADMIN_AREA_4_ANALYSIS = FALSE`
    - `CONTROL_CHART_LEVEL = "admin_area_2"`

### Especificações de entrada/saída

??? "Requisitos de entrada"

    #### Entradas primárias

    1. **`M2_adjusted_data.csv`** (fonte de dados principal)
       - Resultado do Módulo 2 (Ajustes de qualidade dos dados)
       - Contém contagens de serviços ajustadas com diferentes pressupostos de exaustividade
       - Colunas obrigatórias: `facility_id`, `indicator_common_id`, `period_id`, `count_final_none`, `count_final_outliers`, `count_final_completeness`, `count_final_both`

    2. **`M1_output_outliers.csv`**
       - Resultado do módulo 1 (avaliação da qualidade dos dados)
       - Contém `outlier_flag` para identificar e excluir pontos de dados anómalos
       - Colunas obrigatórias: `facility_id`, `indicator_common_id`, `period_id`, `outlier_flag`

    3. **`hmis_ISO3.csv`** (utilizado apenas para pesquisa geográfica)
       - Ficheiro HMIS em bruto utilizado unicamente para extrair o mapeamento facility_id → admin_area_1
       - Necessário porque M2_adjusted_data.csv não inclui admin_area_1
       - Colunas obrigatórias: `facility_id`, `admin_area_1`

    #### Requisitos de dados

    - **Cobertura temporal**: Mínimo de 12 meses de dados para modelação sazonal
    - **Integralidade dos dados**: Os meses em falta são preenchidos por interpolação
    - **Integralidade geográfica**: Dados a níveis administrativos especificados
    - **Dados de contagem**: Contagens inteiras não negativas (as previsões são limitadas a zero)

    ### Saídas

    #### 1. Resultados da carta de controlo

    **`M3_chartout.csv`**

    **Finalidade**: Contém as perturbações marcadas da análise do gráfico de controlo de qualidade

    **Colunas**:

    - `admin_area_*`: Identificador geográfico (o nível depende de `CONTROL_CHART_LEVEL`)
    - `indicator_common_id`: Código do indicador do serviço de saúde
    - `period_id`: Período de tempo no formato AAAAMM
    - `tagged`: Sinal binário (1 = perturbação detectada, 0 = normal)

    **Utilização**: Identifica os meses que requerem investigação adicional para cada combinação indicador-geografia

    **`M3_service_utilization.csv`**

    **Finalidade**: Cópia de passagem dos dados ajustados para visualização

    **Origem**: Cópia direta de `M2_adjusted_data.csv`

    **Uso**: Fornece dados de base para traçar volumes de serviço reais

    **`M3_memory_log.txt`**

    **Finalidade**: Rastreia o uso de memória durante a execução

    **Utilização Diagnóstico para otimização do desempenho e resolução de problemas

    #### 2. Resultados da análise de perturbações

    **`M3_disruptions_analysis_admin_area_1.csv`** (Nível nacional - sempre gerado)

    **Colunas**:

    - `admin_area_1`: Nome do país
    - `indicator_common_id`: Indicador do serviço de saúde
    - `period_id`: Período de tempo (AAAAMM)
    - `count_sum`: Volume real de serviços (soma de todos os estabelecimentos)
    - `count_expect_sum`: Volume de serviço esperado (soma das previsões)
    - `count_expected_if_above_diff_threshold`: Valor para plotagem (esperado se |diferença| > DIFERENÇA, caso contrário, real)

    **`M3_disruptions_analysis_admin_area_2.csv`** (Nível de província - sempre gerado)

    **Coluna adicional**: `admin_area_2` (nome da província/região)

    **A mesma estrutura**: Como o ficheiro admin_area_1 mas desagregado por província

    **`M3_disruptions_analysis_admin_area_3.csv`** (Nível distrital - condicional)

    **Gerado quando**: `RUN_DISTRICT_MODEL = TRUE`

    **Colunas adicionais**: `admin_area_2`, `admin_area_3`

    **A mesma estrutura**: Como acima, mas desagregada por distrito

    **`M3_disruptions_analysis_admin_area_4.csv`** (Nível de bairro - condicional)

    **Gerado quando**: `RUN_ADMIN_AREA_4_ANALYSIS = TRUE`

    **Colunas adicionais**: `admin_area_2`, `admin_area_3`, `admin_area_4`

    **Aviso**: Ficheiro de tamanho muito grande para países com muitas alas

    #### 3. Ficheiros de resumo de défice/excedente

    **`M3_all_indicators_shortfalls_admin_area_*.csv`** (um para cada nível geográfico)

    **Objetivo**: Métricas pré-calculadas de défice e excedente para relatórios

    **Colunas comuns**:

    - Identificador(es) geográfico(s): `admin_area_*`
    - `indicator_common_id`: Indicador do serviço de saúde
    - `period_id`: Período de tempo (AAAAMM)
    - `count_sum`: Volume real de serviços
    - `count_expect_sum`: Volume de serviço previsto
    - `shortfall_absolute`: Número absoluto de serviços em falta (se a interrupção for negativa)
    - `shortfall_percent`: Percentagem do défice em relação ao previsto
    - `surplus_absolute`: Número absoluto de serviços em excesso (se a perturbação for positiva)
    - `surplus_percent`: Percentagem de excedente em relação ao previsto

    **Nota**: Se os níveis geográficos opcionais forem desactivados, são criados ficheiros de espaço reservado vazios para compatibilidade com os processos a jusante.

    #### Ficheiros temporários (limpos automaticamente)

    Durante a execução, o módulo cria ficheiros de lote temporários para gestão da memória:
    - `M3_temp_controlchart_batch_*.csv`
    - `M3_temp_indicator_batch_*.csv`
    - `M3_temp_province_batch_*.csv`
    - `M3_temp_district_batch_*.csv`
    - `M3_temp_admin4_batch_*.csv`

    Estes ficheiros são automaticamente eliminados após a conclusão bem sucedida. Se o script falhar, estes ficheiros podem permanecer e serão limpos na próxima execução.

### Documentação das funções principais

??? "`robust_control_chart(panel_data, selected_count)`"

    **Purpose**: Identifica anomalias na utilização de serviços utilizando regressão robusta e limites de controlo baseados em MAD.

    **Entradas**:

    - `panel_data`: Dados de séries cronológicas para uma combinação específica de indicador-geografia
    - `selected_count`: Nome da coluna que contém as contagens de volume de serviço a analisar

    **Processo

    1. Ajusta um modelo linear robusto (utilizando `MASS::rlm()`) com controlos sazonais e tendências temporais
    2. Aplica a suavização da mediana móvel aos valores previstos para reduzir o ruído
    3. Calcula os resíduos e normaliza-os utilizando o Desvio Absoluto Mediano (DMA)
    4. Aplica uma lógica de marcação baseada em regras para identificar diferentes tipos de perturbação
    5. Assinala automaticamente os meses mais recentes para garantir uma deteção atempada

    **Resultados**:

    - `count_predict`: Volume de serviço previsto a partir de regressão robusta
    - `count_smooth`: Previsões suavizadas usando a mediana móvel
    - `residual`: Diferença entre valores reais e suavizados
    - `robust_control`: Resíduo padronizado (residual/MAD)
    - `tagged`: Sinalizador binário (1 = perturbação detectada, 0 = variação normal)
    - Sinalizadores adicionais: `tag_sharp`, `tag_sustained`, `tag_sustained_dip`, `tag_sustained_rise`, `tag_missing`

    **Caraterísticas principais**:

    - Trata dados em falta com interpolação
    - Utiliza regressão robusta para minimizar a influência de outliers
    - Emprega várias regras de deteção de perturbações para diferentes padrões
    - Assegura previsões não negativas (as contagens não podem ser negativas)

    ### Modelos de regressão de painel

    A análise de perturbações utiliza modelos de regressão em painel (`fixest::feols()`) a vários níveis geográficos. São executadas regressões separadas para cada unidade geográfica em cada nível, com erros padrão agrupados para ter em conta a correlação dentro da área.

    **Modelo a nível nacional** (Área administrativa 1):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Regressão única em todas as instalações, com erros padrão agrupados a nível distrital (`admin_area_3`) quando está disponível mais do que um distrito; caso contrário, não agrupados.

    **Modelos a nível da província** (Área administrativa 2):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Regressão separada para cada província, com erros padrão agrupados a nível distrital quando mais de um distrito está disponível; caso contrário, não agrupados.

    **Modelos a nível distrital** (Área administrativa 3 - opcional):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Execução de regressão separada para cada distrito (é necessário um mínimo de 10 observações), com erros padrão agrupados ao nível do distrito (`admin_area_4`) quando está disponível mais do que um distrito; caso contrário, não agrupados.

    **Modelos a nível de distrito** (Área administrativa 4 - opcional):

    ```r
    count ~ date + factor(month) + tagged
    ```

    Execução de regressão separada para cada ala/unidade mais fina (é necessário um mínimo de 8 observações, sem agrupamento).

    ### Funções de apoio

    **`mem_usage(msg)`**: Rastreia e regista o consumo de memória durante a execução

    **Processamento de dados**:

    - Processamento em lote com ficheiros temporários baseados em disco para eficiência de memória
    - Operações eficientes de data.table para grandes conjuntos de dados
    - Estratégias progressivas de agregação e fusão

### Métodos estatísticos e algoritmos

??? "Análise de cartas de controlo"

    Os volumes de serviço são agregados ao nível geográfico especificado (configurável através de `CONTROL_CHART_LEVEL`). O pipeline remove os outliers (`outlier_flag == 1`), preenche os meses em falta e filtra os meses de baixo volume (<50% do volume médio global).

    Um modelo de regressão robusto estima os volumes de serviço esperados por indicador × área geográfica (`panelvar`). Uma mediana móvel centrada é aplicada para suavizar os valores previstos. Os valores residuais (reais - suavizados) são normalizados utilizando o MAD. As perturbações são identificadas através de um sistema de marcação baseado em regras.

    #### Regras de deteção de perturbações

    Cada regra é controlada por parâmetros definidos pelo utilizador, permitindo a personalização da sensibilidade e do comportamento da lógica de deteção:

    **Perturbações acentuadas**: Sinaliza um único mês quando o residual padronizado (residual dividido pelo MAD) excede um limite:

    $$ \left| \frac{\text{residual}}{\text{MAD}} \right| \geq \text{MADS_THRESHOLD} $$

    - **Parâmetro:** `MADS_THRESHOLD` (predefinição: `1.5`)
    - Valores mais baixos tornam a deteção mais sensível a picos ou quedas súbitas.

    **Quedas sustentadas**: Assinala uma queda sustentada se:

    - Três meses consecutivos apresentarem desvios ligeiros (residual padronizado ≥ 1 mas < `MADS_THRESHOLD`), e
    - O mês atual tiver um resíduo padronizado ≥ 1,5 (limiar codificado).

    Isso captura declínios mais lentos e compostos.

    **Quedas sustentadas**: Sinaliza períodos em que o volume real cai consistentemente abaixo de uma proporção definida do volume esperado (previsão suavizada):

    $$ \text{count_original} < \text{DIP_THRESHOLD} \times \text{count_smooth} $$

    - **Parâmetro:** `DIP_THRESHOLD` (predefinição: `0.90`)
    - Os utilizadores podem ajustar este parâmetro para detetar descidas mais profundas ou menos profundas (por exemplo, `0.80` para uma descida de 20%).

    **Subidas sustentadas**: Simétrico a quedas, assinala períodos de desempenho superior consistente:

    $$ \text{count_original} > \text{LIMIAR_DE_ELEVAÇÃO} \times \text{count_smooth} $$

    - **Parâmetro:** `RISE_THRESHOLD` (predefinição: `1 / DIP_THRESHOLD`, por exemplo, `1.11`)
    - Os utilizadores podem ajustar este parâmetro para detetar picos de volume ascendentes.

    **Dados em falta**: Assinala quando 2 ou mais dos últimos 3 meses têm um volume de serviço em falta (`NA`) ou nulo.

    - **Regra fixa**.

    **Substituição de cauda recente**: Assinala automaticamente todos os meses nos últimos 6 meses de dados para garantir que as tendências recentes são revistas, mesmo que a marcação baseada no modelo não seja conclusiva.

    - **Regra fixa**.

    **Marcação final**: A um mês é atribuído `tagged = 1` se **qualquer** das seguintes condições for satisfeita:

    - `tag_sharp == 1`
    - `tag_sustained == 1`
    - `tag_sustained_dip == 1`
    - `tag_sustained_rise == 1`
    - `tag_missing == 1`
    - É abrangido pelos 6 meses mais recentes (`last_6_months == 1`)

    ### Modelo de regressão robusto

    **Ajuste do modelo**:

    Se ≥12 observações e >12 datas únicas:

    $$Y_{it} = \beta_0 + \sum \gamma_m \cdot \text{mês}_m + \beta_1 \cdot \text{data} + \epsilon_{it}$$

    Se apenas ≥12 observações:

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \epsilon_{it}$$

    Se os dados forem insuficientes: utilizar a mediana dos valores observados.

    **Aplicar a suavização da mediana móvel às previsões**:

    $$ \text{count_smooth}_{it} = \text{Median}(\text{count_predict}_{t-k}, \dots, \text{count_predict}_t, \dots, \text{count\_predict}_{t+k}) $$

    - **Parâmetro:** `SMOOTH_K` (predefinição: 7, tem de ser ímpar)
    - Um `SMOOTH_K` maior suaviza mais; um menor retém mais variação.

    **Calcular os resíduos**:

    $$ \text{residual}_{it} = \text{contagem_original}_{it} - \text{contagem_suave}_{it} $$

    **Padronizar os resíduos utilizando MAD**:

    $$ \text{controlo_robusto}_{it} = \text{residual}_{it} / \text{MAD}_i $$$

    ### Modelos de regressão da análise de perturbações

    Depois de as anomalias serem identificadas e guardadas no `M3_chartout.csv`, a análise de perturbações quantifica o seu impacto utilizando modelos de regressão. Estes modelos estimam a alteração da utilização do serviço durante os períodos de perturbação assinalados, ajustando as tendências a longo prazo e as variações sazonais.

    Para cada indicador, estimamos:

    $$ Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{month}_m + \beta_2 \cdot \text{tagged} + \epsilon_{it} $$

    em que:
    - $Y_{it}$ é o volume de serviço observado,
    - $\text{date}$ capta as tendências temporais,
    - $\text{month}_m$ controla a sazonalidade,
    - $\text{tagged}$ é a dummy de perturbação (da análise da carta de controlo),
    - $\epsilon_{it}$ é o termo de erro.

    O coeficiente do `tagged` ($\beta_2$) mede a variação relativa da utilização dos serviços durante as perturbações assinaladas. São efectuadas regressões separadas a nível nacional, provincial e distrital para avaliar o impacto em diferentes escalas geográficas.

    #### Regressão a nível nacional

    A regressão a nível nacional estima a forma como a utilização dos serviços muda a nível nacional quando ocorre uma perturbação. Em vez de analisar províncias ou distritos individuais separadamente, este modelo considera os dados de todo o país numa única regressão. Os erros são agrupados ao nível geográfico mais baixo disponível (`lowest_geo_level`), normalmente distritos.

    **Especificação do modelo

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{mês} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Onde:
    - $Y_{it}$ = volume (por exemplo, número de entregas)
    - $\text{date}$ = tendência temporal
    - $\text{month}_m$ = controlo da sazonalidade (variável de fator)
    - $\text{tagged}$ = dummy para o período de perturbação
    - $\epsilon_{it}$ = termo de erro, agrupado a nível distrital (`admin_area_3`)

    #### Regressão ao nível da província

    A regressão de perturbação a nível provincial estima como a utilização de serviços muda a nível provincial quando ocorre uma perturbação. Ao contrário do modelo a nível nacional, esta abordagem efectua regressões separadas para cada província para captar as variações regionais.

    **Especificação do modelo** (executado separadamente para cada província):

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{mês} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Onde:
    - $Y_{it}$ = volume (por exemplo, número de entregas)
    - $\text{date}$ = tendência temporal
    - $\text{mês}_m$ = controlo da sazonalidade (variável de fator)
    - $\text{tagged}$ = dummy para o período de perturbação
    - $\epsilon_{it}$ = termo de erro, agrupado a nível distrital

    #### Regressão a nível distrital

    A regressão de perturbação a nível distrital estima como a utilização de serviços muda a nível distrital quando ocorre uma perturbação. Esta abordagem efectua regressões separadas para cada distrito para captar variações localizadas.

    **Especificação do modelo** (executado separadamente para cada distrito):

    $$Y_{it} = \beta_0 + \beta_1 \cdot \text{date} + \sum_{m=1}^{12} \gamma_m \cdot \text{mês} + \beta_2 \cdot \text{tagged} + \epsilon_{it}$$

    Onde:
    - $Y_{it}$ = volume (por exemplo, número de entregas)
    - $\text{date}$ = tendência temporal
    - $\text{mês}_m$ = controlo da sazonalidade (variável de fator)
    - $\text{tagged}$ = dummy para o período de perturbação
    - $\epsilon_{it}$ = termo de erro, agrupado ao nível do bairro (`admin_area_4`) se existirem vários agrupamentos

    #### Resultados da regressão

    Cada nível de regressão produz os seguintes resultados:

    **Valores esperados (`expect_admin_area_*`)**: Volume de serviço previsto ajustado para sazonalidade e tendências.

    **Efeito de perturbação (`b_admin_area_*`)**: Variação relativa estimada durante as interrupções:

    $$ b_{\text{admin_area_*}} = -\frac{\text{diff mean}}{\text{predict mean}} $$

    **Coeficiente de tendência (`b_trend_admin_area_*`)**: Reflecte a tendência a longo prazo.

    - Positivo = aumento da utilização do serviço
    - Negativo = diminuição da utilização dos serviços
    - Próximo de zero = tendência estável

    **P-value (`p_admin_area_*`)**: Mede a significância estatística do efeito de perturbação.

    - Valores mais baixos = evidência mais forte de uma verdadeira perturbação

    ### Métodos estatísticos utilizados

    **Regressão robusta (`MASS::rlm`)**:

    - Utiliza mínimos quadrados iterativamente reponderados (IRLS)
    - Minimiza a influência de outliers e valores extremos
    - Mais resistente à especificação incorrecta do modelo do que os mínimos quadrados normais
    - Predefinição: ponderação de Huber com um máximo de 100 iterações

    **MAD (Desvio Absoluto Mediano)**:

    - Medida robusta de escala/variabilidade
    - Fórmula: `MAD = median(|x - median(x)|)`
    - Mais resistente aos valores atípicos do que o desvio padrão
    - Utilizado para normalizar os resíduos para deteção de anomalias

    **Regressão de painel (`fixest::feols`)**:

    - Estimativa de efeitos fixos com erros padrão agrupados
    - Tem em conta a correlação dentro do grupo nos erros
    - Mais eficiente do que os pacotes tradicionais de regressão em painel
    - Lida com painéis desequilibrados de forma graciosa

    **Agrupamento geográfico**:

    - As regressões utilizam erros padrão agrupados ao nível geográfico mais baixo disponível
    - Isto tem em conta a correlação dentro da área nos padrões de prestação de serviços
    - Exemplo: O modelo nacional agrupa-se por distrito, o modelo provincial agrupa-se por distrito
    - Evita a subestimação dos erros-padrão e os falsos positivos

### Etapas da análise detalhada

??? "Parte 1: Análise da carta de controlo"

    #### Passo 1: Preparar os dados

    - Carregar volumes de serviço ajustados do `M2_adjusted_data.csv`.
    - Carregar os sinalizadores de outlier do `M1_output_outliers.csv`.
    - Carregar o HMIS em bruto apenas para extrair a pesquisa `facility_id → admin_area_1` (depois descartar).
    - Fundir os sinais de anomalia em dados ajustados por estabelecimento × indicador × mês.
    - Remover as linhas assinaladas como anómalas (`outlier_flag == 1`).
    - Criar uma variável `date` a partir de `period_id` e extrair `year` e `month`.
    - Criar um `panelvar` único para cada combinação área geográfica-indicador.
    - Agregar os dados ao nível geográfico especificado, somando o `count_model` (com base no `SELECTEDCOUNT`) por data.
    - Preencher os meses em falta em cada painel para garantir a continuidade.
    - Preencher os metadados em falta utilizando o preenchimento progressivo e retroativo.

    #### Passo 2: Filtrar os meses de baixo volume

    - Calcule o volume de serviço médio global para cada `panelvar`.
    - Se o `count_original` for <50% da média global, elimine o valor definindo-o como `NA`.

    #### Passo 3: Aplicar a regressão e a suavização

    Estimar o volume de serviço esperado usando regressão robusta e, em seguida, suavizar a tendência prevista.

    - Ajuste a regressão robusta (`rlm`) para cada painel usando uma das três especificações de modelo com base na disponibilidade de dados.
    - Aplicar a suavização da mediana móvel às previsões utilizando o tamanho da janela `SMOOTH_K`.
    - Se a suavização não for possível (por exemplo, nas extremidades da série), voltar às previsões do modelo.
    - Calcular os resíduos: real - suavizado
    - Padronizar os resíduos usando MAD

    Esta variável de controlo normalizada é utilizada para detetar anomalias no Passo 4.

    #### Passo 4: Perturbações de etiquetas

    Aplique a marcação baseada em regras para identificar possíveis interrupções. Cada regra é regida por parâmetros definidos pelo utilizador que podem ser ajustados em termos de sensibilidade:

    - **Rupções agudas**: Marcar se `|robust_control| ≥ MADS_THRESHOLD`
    - **Quedas sustentadas**: Marcar se 3 meses consecutivos tiverem desvios ligeiros (residual ≥ 1 mas < MADS_THRESHOLD) e o mês atual tiver um residual ≥ 1,5
    - **Quedas sustentadas**: Marcar toda a sequência se `count_original < DIP_THRESHOLD × count_smooth` durante mais de 3 meses
    - **Subidas sustentadas**: Marcar toda a sequência se `count_original > RISE_THRESHOLD × count_smooth` durante mais de 3 meses
    - **Dados em falta**: Marcar se 2+ dos últimos 3 meses estiverem em falta ou forem zero
    - **Substituição de cauda recente**: Marcar automaticamente todos os meses nos últimos 6 meses de dados

    É atribuído a um mês o código `tagged = 1` se qualquer uma das condições acima referidas for satisfeita. Os registos marcados são guardados em `M3_chartout.csv` e passados para a análise de perturbação.

??? "Parte 2: Análise de perturbações"

    #### Etapa 1: Preparação de dados

    - O conjunto de dados `M3_chartout` é fundido com o conjunto de dados principal para integrar a variável `tagged`, que identifica as perturbações assinaladas.
    - O nível geográfico mais baixo disponível (`lowest_geo_level`) é identificado para o agrupamento, com base na coluna `admin_area_*` de maior resolução disponível.

    #### Passo 2: Regressão a nível nacional

    Para cada `indicator_common_id`, estimar o modelo a nível nacional com erros agrupados a nível distrital.

    - Um modelo de regressão de painel é aplicado a nível nacional, estimando o volume de serviços esperado (`expect_admin_area_1`) para cada indicador.
    - O modelo controla as tendências a longo prazo e os padrões sazonais na utilização dos serviços.
    - Quando uma perturbação (`tagged = 1`) é identificada, os volumes de serviços previstos são ajustados através da remoção do efeito estimado da perturbação para isolar o seu impacto.
    
    #### Passo 3: Regressão intermédia a nível subnacional

    Para cada combinação `indicator_common_id` × `admin_area_2`, são estimados modelos subnacionais, com erros padrão agrupados a um nível administrativo inferior.

    - É aplicado um modelo de regressão de painel de efeitos fixos a um nível subnacional intermédio, estimando os volumes de serviço esperados (`expect_admin_area_2`) e tendo em conta as caraterísticas geográficas variáveis no tempo.
    - O modelo controla as tendências históricas e a sazonalidade.
    - Quando é identificada uma perturbação, os volumes previstos são ajustados para isolar o efeito da perturbação.

    #### Passo 4: Regressão fina a nível subnacional (se `RUN_DISTRICT_MODEL = TRUE`)

    Para cada combinação de `indicator_common_id` × `admin_area_3`, são estimados modelos subnacionais, com erros padrão agrupados ao nível do distrito (`admin_area_4`) quando está disponível mais do que um distrito.

    - Um modelo de regressão de painel de efeitos fixos é aplicado a um nível subnacional fino, estimando os volumes de serviço esperados (`expect_admin_area_3`).
    - Os painéis com menos de 10 observações são ignorados.
    - O modelo controla as tendências históricas e a sazonalidade.
    - Quando é identificada uma perturbação, os volumes previstos são ajustados para isolar o efeito da perturbação.

    #### Passo 5: Regressão ao nível da ala (se `RUN_ADMIN_AREA_4_ANALYSIS = TRUE`)

    Para cada combinação `indicator_common_id` × `admin_area_4`, os modelos ao nível da ala são estimados sem agrupamento.

    - Um modelo de regressão de painel é aplicado ao nível geográfico mais fino, estimando os volumes de serviço esperados (`expect_admin_area_4`).
    - Os painéis com menos de 8 observações são ignorados.
    - O modelo controla as tendências históricas e a sazonalidade.
    - Quando é identificada uma perturbação, os volumes previstos são ajustados para isolar o efeito da perturbação.

    #### Passo 6: Preparar os resultados para visualização

    Uma vez que os valores esperados tenham sido calculados para cada nível (país, província, distrito), o pipeline compara os valores previstos e reais para avaliar a magnitude da perturbação.

    Para cada mês e indicador, o pipeline calcula:

    - **Diferença absoluta e percentual** entre os valores previstos e reais:

    $$ \text{diff_percent} = 100 \times \frac{\text{previsto} - \text{real}}{\text{previsto}} $$

    - É utilizado um parâmetro de limiar configurável `DIFFPERCENT` (predefinição: `10`) para determinar quando é que uma perturbação é significativa.

        Se a diferença percentual for superior a ±10%, o valor esperado (previsto) é retido e utilizado para a elaboração de gráficos e estatísticas de resumo. Caso contrário, é utilizado o valor real observado.

        Isto assegura que as flutuações menores não conduzem a perturbações artificiais na visualização, enquanto os desvios significativos são preservados.

    - O valor final ajustado para a representação gráfica é armazenado num campo como `count_expected_if_above_diff_threshold`.

        Este valor reflecte
        - A contagem prevista (se o desvio for superior ao limiar), ou
        - A contagem real (se estiver dentro do intervalo aceitável).

    Esta lógica é aplicada de forma consistente em todos os níveis de administração. Estes valores ajustados são depois exportados como parte dos ficheiros de saída finais para cada nível.


### Exemplos de código

??? "Exemplo 1: Executando o módulo com configurações padrão"

    ```r
    # Set working directory
    setwd("/path/to/module/directory")

    # Load required libraries
    library(data.table)
    library(lubridate)
    library(zoo)
    library(MASS)
    library(fixest)
    library(stringr)
    library(dplyr)
    library(tidyr)

    # Configure country
    COUNTRY_ISO3 <- "SLE"
    PROJECT_DATA_HMIS <- "hmis_SLE.csv"

    # Use default settings (admin_area_2 level analysis)
    RUN_DISTRICT_MODEL <- FALSE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    # Run the module
    source("03_module_service_utilization.R")
    ```

    Com as predefinições, o módulo executa a análise da carta de controlo ao nível de admin_area_2 e produz estimativas de perturbação para os níveis nacional e regional.

??? "Exemplo 2: Ajustar a sensibilidade de deteção de perturbações"

    ```r
    # Make disruption detection more sensitive (lower thresholds)
    MADS_THRESHOLD <- 1.0        # Flag at 1 MAD (default: 1.5)
    DIP_THRESHOLD <- 0.95        # Flag if <95% of expected (default: 0.90)
    SMOOTH_K <- 5                # Smaller smoothing window (default: 7)

    # Make disruption detection less sensitive (higher thresholds)
    MADS_THRESHOLD <- 2.0        # Flag only at 2 MADs
    DIP_THRESHOLD <- 0.80        # Flag only if <80% of expected
    SMOOTH_K <- 9                # Larger smoothing window

    source("03_module_service_utilization.R")
    ```

    **Caso de uso**: Ajustar a sensibilidade com base na qualidade dos dados. Os dados mais ruidosos podem exigir limiares menos sensíveis para evitar falsos positivos.

??? "Exemplo 3: Executar análise a nível distrital"

    ```r
    # Enable district-level analysis (slower but more detailed)
    RUN_DISTRICT_MODEL <- TRUE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    source("03_module_service_utilization.R")
    ```

    **Caso de uso**: Quando são necessários padrões de perturbação a nível distrital para a planificação de programas subnacionais.

    **Nota**: A análise a nível distrital aumenta substancialmente o tempo de execução. Para países grandes, considere a execução durante a noite.

??? "Exemplo 4: Seleção do cenário de ajustamento para análise"

    ```r
    # Use unadjusted data for sensitivity analysis
    SELECTEDCOUNT <- "count_final_none"
    VISUALIZATIONCOUNT <- "count_final_none"

    # Use outlier-adjusted only
    SELECTEDCOUNT <- "count_final_outliers"
    VISUALIZATIONCOUNT <- "count_final_outliers"

    # Use fully adjusted data (default)
    SELECTEDCOUNT <- "count_final_both"
    VISUALIZATIONCOUNT <- "count_final_both"

    source("03_module_service_utilization.R")
    ```

    **Caso de uso**: Comparar estimativas de perturbação em diferentes cenários de ajustamento da qualidade dos dados.

??? "Exemplo 5: Otimização de memória para grandes conjuntos de dados"

    ```r
    # Reduce batch sizes for memory-constrained environments
    BATCH_SIZE_CC <- 50      # Control chart batches (default: 100)
    BATCH_SIZE_IND <- 3      # Indicator batches (default: 5)
    BATCH_SIZE_PROV <- 10    # Province batches (default: 20)
    BATCH_SIZE_DIST <- 10    # District batches (default: 15)

    # Disable memory-intensive analyses
    RUN_DISTRICT_MODEL <- FALSE
    RUN_ADMIN_AREA_4_ANALYSIS <- FALSE

    source("03_module_service_utilization.R")
    ```

    **Caso de uso**: Executando em máquinas com RAM limitada (<8GB).

??? "Exemplo 6: Uso programático de saídas"

    ```r
    # Load disruption analysis outputs
    disruptions_national <- read.csv("M3_disruptions_analysis_admin_area_1.csv")
    shortfalls_national <- read.csv("M3_all_indicators_shortfalls_admin_area_1.csv")

    # Calculate total service shortfall by indicator
    annual_shortfalls <- shortfalls_national %>%
      mutate(year = period_id %/% 100) %>%
      group_by(indicator_common_id, year) %>%
      summarise(
        total_expected = sum(count_expect_sum, na.rm = TRUE),
        total_actual = sum(count_sum, na.rm = TRUE),
        total_shortfall = sum(shortfall_absolute, na.rm = TRUE),
        avg_shortfall_pct = mean(shortfall_percent, na.rm = TRUE),
        .groups = "drop"
      )

    # Identify months with largest disruptions
    worst_months <- shortfalls_national %>%
      filter(shortfall_percent > 10) %>%
      arrange(desc(shortfall_percent)) %>%
      head(20)

    # Load control chart results for detailed analysis
    control_chart <- read.csv("M3_chartout.csv")

    # Count tagged periods by indicator
    tagged_summary <- control_chart %>%
      group_by(indicator_common_id) %>%
      summarise(
        total_periods = n(),
        tagged_periods = sum(tagged, na.rm = TRUE),
        pct_tagged = 100 * tagged_periods / total_periods,
        .groups = "drop"
      )
    ```


### Resolução de problemas

??? "Problemas e soluções comuns"

    #### Problema: O script trava com o erro "sem memória

    **Soluções**:

    - Reduzir o tamanho dos lotes (por exemplo, `BATCH_SIZE_IND <- 3`)
    - Definir `RUN_DISTRICT_MODEL <- FALSE`
    - Definir `RUN_ADMIN_AREA_4_ANALYSIS <- FALSE`
    - Fechar outras aplicações
    - Executar numa máquina com mais RAM

    ---

    #### Problema: Aviso "modelo falhou ao convergir"

    **Explicação**: A regressão robusta não convergiu totalmente em 100 iterações

    **Impacto**: Normalmente mínimo - a convergência parcial é muitas vezes suficiente

    **Soluções**:

    - Verificar a qualidade dos dados para esse painel
    - Aumentar o parâmetro `maxit` na chamada `rlm()` (linha 229, 247)
    - Geralmente, é seguro ignorar se apenas alguns painéis forem afectados

    ---

    #### Problema: Muitas linhas vazias nos arquivos de saída

    **Explicação**: Dados insuficientes para certas combinações indicador-geografia

    **Soluções**:

    - Comportamento esperado para indicadores esparsos
    - Filtrar os resultados para valores que não estão a faltar
    - Considerar a agregação a um nível geográfico superior

    ---

    #### Questão: Todos os meses recentes assinalados como interrupções

    **Explicação**: Marcação automática dos últimos 6 meses

    **Objetivo**: Assegurar que as tendências recentes são analisadas mesmo sem provas estatísticas sólidas

    **Soluções**:

    - Comportamento esperado, não é um bug
    - Rever manualmente os meses recentes
    - Ajustar a lógica `last_6_months` se necessário (linha 333)

    ---

    #### Problema: a variável `tagged` foi retirada da regressão

    **Mensagem**: Variável automaticamente definida como 0

    **Explicação**: Nenhuma variação em `tagged` dentro desse painel (tudo 0 ou tudo 1)

    **Soluções**:

    - Esperado em painéis sem interrupções ou com interrupções constantes
    - Não é um erro - o efeito de perturbação está corretamente definido como 0

    ---

    #### Problema: Os ficheiros temporários permanecem após a execução

    **Causa**: O script travou antes da limpeza

    **Soluções

    - Eliminar manualmente: `M3_temp_*.csv`
    - Ou voltar a executar o script (limpeza automática no início)

    ---

    #### Problema: Resultados muito diferentes em diferentes níveis geográficos

    **Explicação**: A agregação geográfica diferente capta padrões diferentes

    **Exemplo**: A tendência nacional pode ser estável enquanto alguns distritos registam grandes interrupções

    **Soluções**:

    - Comportamento esperado - não é um erro
    - Utilize o nível apropriado para a sua pergunta de investigação
    - Verifique os padrões entre os níveis para obter robustez

### Notas de uso

??? "Diretrizes de interpretação"

    **Efeitos de perturbação (b_admin_area_*)**:

    - Valores negativos indicam quebras no volume de serviço durante os períodos de interrupção
    - Valores positivos indicam excedentes de volume de serviço durante os períodos de interrupção
    - Valores mais próximos de zero indicam impactos menores das perturbações

    **Valores de P (p_admin_area_*)**:

    - Valores < 0,05 sugerem perturbações estatisticamente significativas
    - Valores > 0,05 podem indicar uma variação normal e não verdadeiras perturbações

    **Coeficientes de tendência (b_trend_admin_area_*)**:

    - Os valores positivos indicam um aumento da utilização do serviço ao longo do tempo
    - Valores negativos indicam uma diminuição da utilização do serviço ao longo do tempo
    - Valores próximos de zero indicam padrões de utilização estáveis

??? "Escolher as saídas a analisar"

    **Para visões gerais rápidas**:

    - Comece com mapas de calor ano a ano para identificar áreas/indicadores com mudanças notáveis
    - Utilizar gráficos de controlo para indicadores com suspeitas de perturbações
    - Concentrar-se em indicadores de grande volume onde os padrões são mais fiáveis

    **Para análise subnacional**:

    - O nível provincial fornece padrões fiáveis com um volume de dados suficiente
    - O nível distrital é útil para identificar problemas locais, mas os padrões podem ser mais ruidosos
    - Verificação cruzada dos padrões distritais com as tendências provinciais para garantir a coerência

    **Para análises baseadas no tempo**:

    - Períodos recentes (últimos 6 meses) podem mostrar padrões preliminares que podem mudar
    - Procurar mudanças sustentadas (3+ meses consecutivos) em vez de picos num único mês
    - Considerar eventos conhecidos (mudanças de política, campanhas, greves) ao interpretar

??? "Limitações"

    **Limitações estatísticas**:

    - A deteção de perturbações funciona melhor com mais de 2 anos de dados históricos
    - Os indicadores de baixo volume podem mostrar alterações percentuais elevadas a partir de pequenas alterações absolutas
    - Os padrões sazonais requerem pelo menos 12 meses de dados para serem modelados com exatidão

    **Advertências de interpretação**:

    - As perturbações detectadas exigem uma investigação contextual (nem todas são problemáticas)
    - As perturbações positivas (excedentes) podem refletir campanhas, recuperação ou problemas de dados
    - Padrões geográficos afectados pela distribuição das instalações e pelas taxas de notificação

    **Requisitos de dados**:

    - Os resultados dependem da qualidade da exaustividade e dos ajustamentos de módulos anteriores
    - A falta de identificadores geográficos reduzirá a cobertura da análise subnacional

---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //
//  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//
//  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//
//   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//
//   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//
//  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
//                                                                //
//            Editar os diapositivos abaixo desta linha                //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m6_2e -->
<!-- _class: output -->
## À maneira bayesiana: duas perguntas por unidade

<div class="output-layout">
<div class="output-viz">

![Duas perguntas por unidade w:640](../resources/diagrams_pt/disruption_bayes_two_questions.svg)

</div>
<div class="output-text">

**Pergunta 1:** esta unidade reportou este mês? Feita para cada unidade e cada mês.

**Pergunta 2:** quando reporta, quanto presta? Feita só para os meses com relatório.

**Porquê separá-las:** um total baixo pode vir de unidades em silêncio ou de unidades que prestam menos. Só a segunda é uma perturbação do serviço.

</div>
</div>

<!--
NOTAS PARA O APRESENTADOR:
- Este é o módulo Deteção de perturbações (M11) da plataforma. Substituiu o modelo de cartas de controlo (M3) em 2026; os diapositivos antigos ficam para referência.
- O modelo trabalha unidade a unidade, mês a mês, e depois soma por província e distrito. Não há modelo separado por área.
- A pergunta 1 é um modelo sim/não do reporte. A pergunta 2 é um modelo de contagem do volume de serviços, ajustado só onde existe relatório.
- Cada unidade tem o seu próprio nível de base: um hospital e um posto de saúde são comparados cada um com o seu histórico.
- A tendência e a época estão nas duas perguntas: uma quebra na estação seca ou uma subida nacional lenta não é chamada perturbação.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2f -->
## Como se constrói o volume esperado

Para cada área e mês, o modelo soma o volume esperado **apenas das unidades que reportaram nesse mês** e compara-o com o que essas mesmas unidades reportaram de facto.

<div style="font-size: 0.9em;">

| | Abordagem anterior (M3) | Abordagem bayesiana (M11) |
|---|---|---|
| **Unidade modelada** | Total do distrito ou da província | Cada unidade de saúde |
| **Relatórios em falta** | Preenchidos e depois modelados | Modelados como pergunta separada |
| **Volume esperado** | Tendência + época sobre o total | Tendência + época + nível próprio de cada unidade |
| **Incerteza** | Limiares fixos | Banda de credibilidade de 95 % |
| **Uma unidade fica em silêncio** | Parece uma quebra | Retirada dos dois lados da comparação |

</div>

<!--
NOTAS PARA O APRESENTADOR:
- A linha-chave é a última. Quando uma unidade deixa de reportar, o modelo antigo via uma quebra no total. O novo retira essa unidade do observado e do esperado nesse mês, e a comparação fica como-para-como.
- «Banda de credibilidade»: o intervalo em que o modelo espera ver o volume 95 vezes em 100. Fora da banda é sinal; dentro é variação normal.
- A banda é mais larga em áreas pequenas e indicadores de baixo volume, e isso é correto: menos dados, menos certeza.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2g -->
<!-- _class: output -->
## Ler o gráfico bayesiano de perturbações

<div class="output-layout">
<div class="output-viz">

![Gráfico bayesiano de perturbações h:300](../resources/diagrams_pt/disruption_bayes_chart.svg)

</div>
<div class="output-text">

**O que vê:** volume observado (linha contínua), volume esperado (linha tracejada) e a banda de credibilidade de 95 % (cinzenta).

**O que mostra:** vermelho onde o observado cai abaixo da banda, um défice; verde onde sobe acima, um excedente. Dentro da banda é variação normal.

**Interpretação:** um troço vermelho é uma quebra real entre as unidades que reportaram. Pergunte o que aconteceu nesses meses: ruturas de stock, greves, insegurança, uma campanha noutro lado.

</div>
</div>

<!--
NOTAS PARA O APRESENTADOR:
- Gráfico ilustrativo, desenhado com as cores da plataforma. Na plataforma: pacotes de resultados → gráfico de perturbações com banda de credibilidade de 95 %, um painel por indicador, nacional ou por área administrativa 2.
- Um único mês vermelho merece um olhar; vários meses vermelhos seguidos são o padrão sobre o qual agir.
- Para indicadores em que um aumento é mau (nados-mortos, óbitos), as cores trocam.
- Os últimos meses podem mudar: relatórios tardios chegam depois de o pacote ser gerado.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2h -->
<!-- _class: output -->
## Lacuna de reporte ou lacuna de serviço?

<div class="output-layout">
<div class="output-viz">

![Lacuna de reporte vs lacuna de serviço h:300](../resources/diagrams_pt/disruption_bayes_gaps.svg)

</div>
<div class="output-text">

**O que vê:** três barras para uma área e um mês: o esperado se todas as unidades tivessem reportado, o esperado dado quem costuma reportar, e o observado.

**O que mostra:** o primeiro degrau é a **lacuna de reporte**, relatórios em falta. O segundo é a **lacuna de serviço**, uma mudança real na prestação.

**Interpretação:** uma grande lacuna de reporte é um problema de dados a resolver com as unidades. Uma grande lacuna de serviço é uma questão para o programa.

</div>
</div>

<!--
NOTAS PARA O APRESENTADOR:
- Estas duas lacunas estão na saída do módulo (gap_reporting, gap_service) para cada área e mês, ao lado dos valores observados e esperados.
- Também na saída: mean_p, a probabilidade média de reportar na área nesse mês. Acompanha a completude tal como o modelo a vê.
- Ordem prática: veja primeiro a lacuna de reporte. Se explica a maior parte da quebra, volte à qualidade dos dados antes de perguntar ao programa porque é que os serviços caíram.
-->
<!-- /SLIDE -->

<!-- SLIDE:m6_2i -->
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
<!-- /SLIDE -->

<!-- SLIDE:m6_s2c -->
<!-- _class: output -->
## Deteção de perturbações (bayesiana): o que olhar

<div class="output-layout">
<div class="output-viz">

![Gráfico bayesiano de perturbações h:300](../resources/diagrams_pt/disruption_bayes_chart.svg)

</div>
<div class="output-text">

**O que vê:** observado (contínuo) vs esperado (tracejado) com uma banda cinzenta de 95 %, para as unidades que reportaram em cada mês.

**O que mostra:** vermelho abaixo da banda é um défice real entre as unidades que reportam, não relatórios em falta. Verde acima é um excedente.

**Interpretação:** vários meses vermelhos seguidos são o padrão sobre o qual agir. Veja primeiro a lacuna de reporte, depois pergunte ao programa o que aconteceu.

</div>
</div>

<!--
NOTAS PARA O APRESENTADOR:
- Versão condensada de m6_2e a m6_2h. O modelo faz duas perguntas por unidade: reportou, e quanto prestou quando reportou.
- Como o esperado e o observado usam as mesmas unidades em cada mês, uma unidade em silêncio não aparece como perturbação.
- Módulo M11 da plataforma; os diapositivos antigos de cartas de controlo (m6_2, m6_2b, m6_2d) descrevem o modelo M3 retirado.
-->
<!-- /SLIDE -->
