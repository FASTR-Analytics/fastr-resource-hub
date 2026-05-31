<!-- AUTO-TRANSLATED from 01_identify_questions_indicators.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# Identificar questões e indicadores

> Nota: O conteúdo desta secção baseia-se nos materiais de apresentação existentes do FASTR e está sujeito a revisão.

## Visão geral

Esta secção descreve o processo de identificação de questões políticas e programáticas prioritárias e de seleção de indicadores apropriados para a análise FASTR. Ela fornece uma abordagem estruturada para garantir que as análises FASTR sejam orientadas pela demanda, analiticamente viáveis e alinhadas com as prioridades nacionais.

Especificamente, esta secção abrange:

1. **Introdução ao FASTR: lacunas e desafios**
   Uma visão geral das lacunas analíticas que o FASTR foi concebido para colmatar, o seu papel na redução da fragmentação na análise de dados de rotina e a forma como o FASTR pode ser posicionado como um ponto de entrada para o envolvimento com as partes interessadas do governo.

2. **Desenvolvimento de um caso de utilização de dados**
   Orientação sobre o co-desenvolvimento de casos de utilização de dados através de workshops com o Ministério da Saúde e outras partes interessadas, incluindo exemplos práticos de implementações nacionais.

3. **Definição de questões prioritárias e seleção de indicadores**
   Um quadro para formular questões analíticas prioritárias, selecionar indicadores adequados e alinhar a análise FASTR com as estratégias nacionais e as necessidades de tomada de decisões.

4. **Preparação para a extração de dados**
   Uma visão geral de alto nível das considerações pré-extração, incluindo a compreensão da configuração do DHIS2, o mapeamento de indicadores para elementos de dados e o planeamento do calendário de extração.

---

## Definição de questões prioritárias

A utilização efectiva dos dados de rotina depende de questões analíticas bem definidas. As questões prioritárias fornecem orientações para as análises FASTR e ajudam a garantir que os resultados são relevantes e acionáveis para os decisores.

**As caraterísticas de uma boa pergunta prioritária incluem

- **Aborda um problema prioritário**
  Centra-se em tópicos de interesse claro para os decisores políticos e gestores de programas.

- **Relevante**
  Suficientemente importante para justificar a análise e informar a tomada de decisões.

- **Baseado nas realidades actuais**
  Ligado aos desafios, reformas ou choques em curso que afectam a prestação de serviços.

- **Significativo para as partes interessadas**
  Aborda questões que interessam a indivíduos ou grupos específicos envolvidos no planeamento ou na implementação.

- **Respondível**
  Pode ser abordado utilizando os dados, métodos e prazos disponíveis.

### Avaliar a relevância: questões-chave a considerar

Ao avaliar se uma questão é prioritária, as seguintes considerações são úteis:

- **Quem** é o público-alvo?  
- **O que é que eles precisam ou querem saber?  
- **Quando é que precisam da informação?  
- **Qual o período ou acontecimento** de interesse?  
- **Porque é que esta informação é necessária?  
- **Como é que os resultados vão ser utilizados?

### O que é que queremos dizer com "respondível"?

Uma pergunta é considerada respondível se as seguintes condições forem satisfeitas:

**Disponibilidade de dados**
- Os dados necessários existem e são de tipo, quantidade e qualidade suficientes.

**Viabilidade analítica**
- Estão disponíveis métodos adequados e estatisticamente válidos, cuja aplicação é viável.

**Oportunidade**
- A análise pode ser concluída dentro do prazo exigido (por exemplo, ciclos de relatórios trimestrais).

### Estrutura PICO para formular perguntas com resposta

**Nota:** Esta estrutura foi incluída no material de apresentação original e é mantida aqui como uma ferramenta opcional.

A estrutura PICO, comummente utilizada na saúde pública e na investigação baseada em evidências, fornece uma forma estruturada de formular perguntas claras e com resposta.

| Componente | Descrição |
|----------|-------------|
| População** | A população ou grupo de interesse
| Intervenção** | O serviço, programa ou ação que está a ser examinado
| Comparação** | A linha de base ou condição de comparação relevante, se aplicável
| Resultado** | A mudança esperada ou o objetivo de saúde pública

---

## Seleção de indicadores: o que faz um bom indicador FASTR?

A seleção de indicadores é fundamental para a qualidade e a utilidade da análise FASTR. Os indicadores devem ser escolhidos com base nos seguintes critérios:

- **Relevância**
  O indicador está em conformidade com as questões prioritárias e os objectivos políticos.

- **Volume**
  O indicador é comunicado em volumes suficientemente elevados para permitir uma análise sólida.

- **Exaustividade**
  A exaustividade dos relatórios é elevada em todas as instalações e ao longo do tempo.

- **Frequência
  O indicador é comunicado com frequência suficiente (normalmente mensal) para permitir uma análise de ciclo rápido.

- **Tipo
  O indicador representa uma contagem de serviços prestados.

### Porquê concentrar-se em indicadores de grande volume?

Um dos principais pontos fortes da abordagem FASTR é a sua capacidade de se ajustar aos problemas de qualidade dos dados. Indicadores de alto volume são mais adequados para este processo porque:

- **Sensibilidade reduzida a valores discrepantes**
  Nos indicadores de baixo volume, os pontos de dados individuais podem afetar desproporcionadamente as tendências.

- **Estimativas mais estáveis**
  Os dados de elevado volume reduzem a variabilidade aleatória e melhoram a fiabilidade da deteção de tendências.

- **Identificação mais clara das verdadeiras anomalias**
  As contagens mais elevadas facilitam a distinção entre anomalias genuínas e variações naturais.

Os indicadores de contagem também permitem a validação e o ajustamento contínuos antes de as proporções ou medidas de cobertura serem derivadas externamente.

### Porquê concentrar-se em indicadores de elevada exaustividade?

Indicadores com alta completude de relatório são preferidos porque eles:

- **Melhoram a fiabilidade dos dados**
  Dados mais completos reduzem o enviesamento e fornecem uma imagem mais representativa da prestação de serviços.

- **Apoiam uma análise coerente**
  Uma elevada exaustividade permite comparações significativas ao longo do tempo e em áreas geográficas.

- **Reduzir erros de interpretação**
  Os dados incompletos podem sugerir falsamente alterações na utilização dos serviços quando as alterações são motivadas por lacunas nos relatórios e não por tendências reais.

Embora possam ser utilizados métodos estatísticos como a imputação para tratar dados incompletos, estes métodos requerem pressupostos sobre os valores em falta. São fornecidos mais pormenores em [Ajustamento da qualidade dos dados] (05_data_quality_adjustment.md).

### Porquê concentrar-se em indicadores de contagem?

**Limitações dos indicadores de proporção**

- As proporções limitam a capacidade de ajustar os numeradores e denominadores separadamente para questões de qualidade dos dados.  
- Os numeradores e denominadores podem ser afectados por diferentes fontes de erro.  
- Separar as contagens da estimativa do denominador permite um ajustamento mais transparente e flexível.

**A mortalidade como um acontecimento raro

- Os indicadores de mortalidade são normalmente de baixa frequência e não se adequam a ajustamentos frequentes.  
- Estes indicadores são geralmente melhor analisados utilizando dados anuais do que mensais ou trimestrais.

---

## Indicadores principais FASTR

A abordagem FASTR centra-se num conjunto central de indicadores RMNCAH-N que representam pontos-chave ao longo da continuidade da saúde e nutrição reprodutiva, materna, neonatal, infantil e do adolescente em países de baixo e médio rendimento. Estes indicadores têm normalmente um maior volume de relatórios e são mais completos e servem como indicadores de padrões mais alargados de prestação de serviços.

As consultas externas também são incluídas como um indicador da utilização global dos serviços de saúde. Podem ser acrescentados indicadores específicos de cada país ou programa, conforme necessário, para refletir as prioridades nacionais.

---

## Preparação para a extração de dados

Esta etapa inclui uma lista de verificação pré-extração, revisão da configuração do DHIS2, mapeamento de indicadores para elementos de dados e planeamento do cronograma de extração. Estes passos garantem que as análises a jusante se baseiam em dados consistentes e bem compreendidos.

---

<!--
////////////////////////////////////////////////////////////////////
// //
// _____ _ _____ ____ _____ ____ ___ _ _ _____ _ _ //
// / ____| | |_ _| _ \| ____| / ___/ _ \| \ | |_ _| \ | |//
// | (___ | | | | | | | | |__ | | | | | | \| | | | | \| |//
// \___ \| | | | | | | | | | | __| | | | | | | . ` | | | | . ` |//
// ____) | |___ _| |_| |_| | |____ | |__| |_| | |\ | | | | |\ |//
// |_____/|_____|_____|____/|______| \____\___/|_| \_|| |_| |_| \_|//
// //
// Editar os diapositivos do workshop abaixo desta linha //
// //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m1_1 -->
## O que é um caso de utilização de dados?

Um caso de utilização de dados é um cenário específico em que os dados são utilizados para atingir um determinado objetivo ou resolver um problema.

**Por que é importante definir um caso de uso de dados?

- Conduz a melhores resultados, alinhando os esforços de dados com os objectivos organizacionais.
- Orienta a tomada de decisões, fornecendo um quadro claro para a análise
- Aumenta a eficiência, concentrando as análises num conjunto de indicadores-chave relevantes para resolver uma necessidade específica de dados
<!-- /SLIDE -->

<!-- SLIDE:m1_1a -->
## Nigéria: Monitorização trimestral do desempenho

Na Nigéria, o FASTR está a permitir a monitorização trimestral do desempenho da Iniciativa Nacional de Renovação do Setor da Saúde - e a informar os esforços de reforço dos sistemas ao longo do caminho.

<div style="display: flex; gap: 1em;">
<div style="flex: 1;">

![Nigéria FASTR exemplo 1](resources/screenshots/country_examples/nigeria_example_1.png)

</div>
<div style="flex: 1;">

![Nigéria FASTR exemplo 2](resources/screenshots/country_examples/nigeria_example_2.png)

</div>
</div>

<div style="font-size: 0.75em;">

 Não se trata de puxar por um indicador que não nos dará boas informações. Trata-se de utilizar este processo FASTR para tomar melhores decisões e reestruturar o sistema."
>
- **Dr. Anthony Adoghe**, Diretor de M&A, Ministério Federal da Saúde e da Segurança Social

</div>
<!-- /SLIDE -->

<!-- SLIDE:m1_1a2 -->
## Guiné: Acompanhamento do progresso do caso de investimento

<p style="font-size: 0.85em;">A monitorização trimestral da utilização dos serviços do RMNCAH-N ajudou a Guiné a acompanhar o progresso do caso de investimento e a detetar rapidamente os desafios - como esta queda acentuada na imunização no início de 2024.</p>

![Monitorização da imunização na Guiné h:440](resources/screenshots/country_examples/guinea_immunization.jpeg)
<!-- /SLIDE -->

<!-- SLIDE:m1_1a3 -->
## Etiópia: Monitorização dos resultados do programa do governo

<p style="font-size: 0.85em;">Utilização da análise FASTR HMIS para monitorizar os resultados priorizados no programa governamental apoiado pelo BM/GFF na Etiópia.</p>

![Monitorização FASTR da Etiópia h:440](resources/screenshots/country_examples/ethiopia_example.png)
<!-- /SLIDE -->

<!-- SLIDE:m1_1b -->
## Qual é o nosso caso comum de utilização de dados que será o foco deste workshop?

Após grandes mudanças na disponibilidade de recursos de fontes externas, muitos países estão a sofrer reduções abruptas e dramáticas no financiamento

- Resultando em lacunas críticas nos programas e sistemas
- Levando a efeitos potencialmente graves na prestação de serviços e nos resultados de saúde para mulheres, crianças e adolescentes

**Principais questões que se colocam

- Qual é a magnitude dos cortes e que efeito estão a ter na prestação de serviços?
- Qual é a melhor forma de dar prioridade aos recursos restantes?
- Que outras adaptações podem salvaguardar e reforçar a prestação de serviços essenciais às mulheres, crianças e adolescentes?
<!-- /SLIDE -->

<!-- SLIDE:m1_1c -->
## Como seleccionamos os indicadores? O que é que faz um bom indicador para a análise FASTR?

A seleção de indicadores é fundamental para a qualidade e utilidade da análise FASTR. Os indicadores devem ser escolhidos com base nos seguintes critérios:

- **Relevância** - Este indicador fornece dados que se alinham com as nossas questões e objectivos prioritários?
- **Volume** - Este indicador é recolhido num volume elevado, o que melhora a solidez da análise?
- **Exaustividade** - O indicador tem uma taxa de exaustividade elevada em todos os estabelecimentos que comunicam dados?
- **Frequência** - O indicador é comunicado com frequência suficiente (por exemplo, mensalmente) para permitir uma análise de ciclo rápido?
- **Tipo** - Este indicador é uma contagem dos serviços prestados?
<!-- /SLIDE -->

<!-- SLIDE:m1_2 -->
## Indicadores principais do FASTR

A abordagem FASTR centra-se num conjunto central de indicadores RMNCAH-N que representam pontos-chave ao longo da continuidade da saúde e nutrição reprodutiva, materna, neonatal, infantil e do adolescente em países de baixo e médio rendimento.

Estes indicadores têm normalmente um maior volume de relatórios e são mais completos, servindo como indicadores de padrões mais alargados de prestação de serviços.

- Cliente pré-natal 1ª visita
- Cliente pré-natal 4ª consulta
- Parto institucional
- Cuidados pós-natais 1
- Doses de BCG
- Pentavalente 1ª dose
- 3ª dose de Pentavalente
- Consultas em ambulatório
<!-- /SLIDE -->

<!-- SLIDE:m1_2a -->
<!-- _class: columns-image-right -->

## Os países selecionaram indicadores para se alinharem com o contexto das perturbações e as prioridades nacionais

![Data prep checklist h:280](../resources/screenshots/data_prep_checklist.png)

- A lista de verificação de preparação de dados FASTR foi partilhada com os países
- A lista de controlo inclui os principais indicadores RMNCAH-N do FASTR
- Os países acrescentaram indicadores adicionais relevantes para o seu contexto (por exemplo, serviços afectados por mudanças de financiamento, prioridades governamentais)
- Estes são os indicadores incluídos na análise atual
- Os países podem continuar a acrescentar indicadores ao longo do tempo, conforme necessário
<!-- /SLIDE -->

<!-- SLIDE:m1_3 -->
## Porquê concentrar-se em indicadores de grande volume?

Um dos principais pontos fortes da abordagem FASTR é a sua capacidade de se ajustar aos problemas de qualidade dos dados. Os indicadores de alto volume são mais adequados para esse processo porque:

**Sensibilidade reduzida a outliers**
Nos indicadores de baixo volume, os pontos de dados individuais podem afetar desproporcionadamente as tendências.

**Estimativas mais estáveis**
Os dados de grande volume reduzem a variabilidade aleatória e melhoram a fiabilidade da deteção de tendências.

**Identificação mais clara das verdadeiras anomalias**
Contagens maiores facilitam a distinção entre anomalias genuínas e variação natural.
<!-- /SLIDE -->

<!-- SLIDE:m1_3a -->
## Por que se concentrar em indicadores de alta completude?

Indicadores com alta completude de relatório são preferidos porque eles:

**Melhoram a fiabilidade dos dados**
Dados mais completos reduzem o enviesamento e fornecem uma imagem mais representativa da prestação de serviços.

**Apoiam uma análise coerente**
Uma elevada exaustividade permite comparações significativas ao longo do tempo e em áreas geográficas.

**Reduzir erros de interpretação**
Dados incompletos podem sugerir falsamente alterações na utilização de serviços quando as alterações são motivadas por lacunas nos relatórios e não por tendências reais.

Embora os métodos estatísticos, como a imputação, possam ser utilizados para lidar com dados incompletos, estes métodos exigem pressupostos sobre os valores em falta.
<!-- /SLIDE -->

<!-- SLIDE:m1_3b -->
## Porquê concentrar-se em indicadores de contagem?

**Limitações dos indicadores de proporção**

- As proporções limitam a capacidade de ajustar numeradores e denominadores separadamente para questões de qualidade de dados
- Os numeradores e denominadores podem ser afectados por diferentes fontes de erro
- Separar as contagens da estimativa do denominador permite um ajustamento mais transparente e flexível

**A mortalidade como um acontecimento raro

- Os indicadores de mortalidade são tipicamente de baixa frequência e não se adequam bem ao ajustamento
- Estes indicadores são geralmente melhor analisados utilizando dados anuais em vez de mensais ou trimestrais
<!-- /SLIDE -->

---

**Contacto**: <fastr@worldbank.org>
