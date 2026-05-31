<!-- AUTO-TRANSLATED from 03_fastr_analytics_platform.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# A plataforma de análise de dados FASTR

## Visão geral

A plataforma analítica FASTR é uma ferramenta baseada na Web concebida para apoiar a avaliação, o ajustamento e a análise da qualidade dos dados de saúde de rotina. Permite aos utilizadores carregar e analisar dados de várias fontes, incluindo o DHIS2, com métodos estatísticos integrados para gerar um conjunto de dados ajustados e executar análises prioritárias sobre indicadores selecionados. A plataforma fornece uma interface de fácil utilização para a execução de análises e oferece opções flexíveis para visualizar e exportar resultados.

capacidades da plataforma](resources/diagrams_pt/platform_capabilities.svg)

## Principais capacidades

### Gestão de dados

A plataforma oferece uma funcionalidade abrangente de gestão de dados. Os utilizadores podem importar e gerir estruturas de unidades de saúde, incluindo áreas administrativas e unidades individuais. O sistema suporta a importação de dados dos Sistemas de Informação de Gestão da Saúde (HMIS) e das Avaliações das Unidades Sanitárias (HFA), permitindo aos utilizadores gerir indicadores de múltiplas fontes enquanto acompanham as versões dos conjuntos de dados ao longo do tempo.

### Análise de dados

As capacidades analíticas são fornecidas através de módulos configuráveis. Os utilizadores podem ativar e configurar módulos analíticos que processam dados utilizando scripts estatísticos baseados em R. Estes módulos podem ser encadeados para suportar análises complexas de vários passos, com ferramentas integradas para monitorizar o estado do processamento e rever os registos.

### Assistente de IA

Um assistente de IA integrado ajuda os utilizadores a compreender e interpretar os seus dados. O assistente pode explicar os resultados do módulo, descrever tendências e padrões de dados, fornecer informações sobre visualizações e ajudar a gerar conteúdo narrativo para relatórios. Os utilizadores podem fazer perguntas sobre os dados do seu projeto em linguagem natural e receber orientação contextual sobre análise e interpretação.

### Visualização

A plataforma oferece ferramentas de visualização robustas para apresentar resultados analíticos. Os utilizadores podem criar gráficos, mapas e tabelas a partir de dados processados, com opções para filtrar e desagregar por várias dimensões. As visualizações podem ser personalizadas em termos de aspeto e estilo, e exportadas como imagens ou ficheiros de dados para utilização em aplicações externas.

### Relatórios

A funcionalidade de relatórios permite aos utilizadores combinar várias visualizações em relatórios abrangentes. Os relatórios podem ser exportados como apresentações em PowerPoint ou documentos PDF. Os utilizadores podem organizar e reordenar as páginas dos relatórios para satisfazer necessidades de comunicação específicas e partilhar os relatórios concluídos com os intervenientes.

### Colaboração

A plataforma suporta o trabalho colaborativo através de uma estrutura baseada em projectos. Os utilizadores podem organizar o seu trabalho em projectos distintos e atribuir aos membros da equipa diferentes funções, incluindo permissões de visualizador, editor e administrador. Os controlos de acesso funcionam ao nível do projeto e os projectos podem ser bloqueados para evitar alterações não intencionais.

## Quem deve utilizar esta aplicação?

### Analistas de dados

Os analistas de dados acharão a plataforma valiosa para analisar tendências de dados de saúde, criar visualizações e gerar relatórios para os decisores. Os módulos analíticos e as ferramentas de visualização foram concebidos para suportar fluxos de trabalho de análise de dados rigorosos.

### Gestores de programas de saúde

Os gestores de programas de saúde podem utilizar a plataforma para monitorizar o desempenho do programa, acompanhar os principais indicadores e partilhar informações com as suas equipas. A funcionalidade de elaboração de relatórios permite a comunicação regular de resultados para apoiar a gestão de programas baseada em factos.

### Administradores do sistema

Os administradores do sistema são responsáveis pela configuração da plataforma, gestão de utilizadores, importação de dados e configuração do sistema para satisfazer as necessidades da organização. As ferramentas administrativas permitem controlar o acesso dos utilizadores, as fontes de dados e as definições da plataforma.

## Como funciona a aplicação

### Nível da organização (instância)

A **instância** serve como o espaço de trabalho principal da organização dentro da plataforma. Cada instância contém todos os utilizadores registados, a estrutura administrativa partilhada (incluindo áreas administrativas e unidades de saúde), definições de indicadores partilhados, fontes de dados (tanto HMIS como HFA) e todos os projectos criados na organização.

### Nível do projeto

**Os projectos** proporcionam espaços de trabalho de análise específicos dentro de uma instância. Cada projeto permite aos utilizadores selecionar os dados a incluir, definindo períodos de tempo, instalações e indicadores específicos. Dentro de um projeto, os utilizadores podem ativar módulos analíticos, criar visualizações e construir relatórios adaptados a objectivos analíticos específicos.

![Projectos dentro da instância](resources/diagrams_pt/projects_within_instance.svg)


### Fluxo de dados

A plataforma segue um fluxo de dados estruturado: **Importação de dados → Processamento de módulos → Visualizações → Relatórios**. Os utilizadores começam por carregar os dados da unidade de saúde ao nível da instância. Os projectos são então criados com janelas de dados específicas que definem o âmbito da análise. Os módulos analíticos processam e analisam os dados selecionados, produzindo resultados que podem ser utilizados para criar gráficos, mapas e tabelas. Finalmente, as visualizações são combinadas em relatórios exportáveis para divulgação.


## Requisitos técnicos

### Idiomas suportados

A aplicação suporta atualmente o inglês e o francês. As definições de idioma podem ser configuradas ao nível da instância para satisfazer as necessidades de diferentes comunidades de utilizadores.

### Requisitos do navegador

A aplicação foi concebida para funcionar com navegadores Web modernos. O Chrome é recomendado para um desempenho ótimo, embora o Firefox, o Safari e o Edge também sejam suportados. O JavaScript deve estar ativado para uma funcionalidade completa.

## Conceitos básicos

A compreensão destes conceitos básicos ajudará os utilizadores a trabalhar eficazmente com a aplicação.

### Instância

Uma **instância** é o espaço de trabalho principal da organização dentro da plataforma. Funciona como o contentor de nível superior para todos os utilizadores, a estrutura administrativa partilhada, as fontes de dados e os projectos. Cada organização opera normalmente numa única instância que fornece a base para todo o trabalho analítico.

### Projectos

Um **projeto** é um espaço de trabalho de análise focado dentro de uma instância. Os projectos permitem aos utilizadores trabalhar com subconjuntos específicos de dados, definindo períodos de tempo, instalações e indicadores relevantes para um determinado objetivo analítico. Em cada projeto, os utilizadores podem ativar módulos analíticos, criar visualizações, gerar relatórios e colaborar com membros da equipa. Podem existir vários projectos numa única instância, cada um com diferentes âmbitos de dados e configurações de acesso do utilizador.

### Estrutura

A **estrutura** define a organização hierárquica das áreas administrativas e dos estabelecimentos de saúde na plataforma.

**As áreas administrativas** representam os limites geográficos organizados em até quatro níveis. A área administrativa 1 representa os limites do país. A área administrativa 2 corresponde às maiores unidades subnacionais, como províncias ou regiões. A área administrativa 3 engloba unidades de nível intermédio, como distritos ou departamentos, enquanto a área administrativa 4 representa unidades mais pequenas, como comunas ou subdistritos. Nem todos os casos exigem os quatro níveis administrativos.

**As instalações de saúde** são os pontos de prestação de serviços de saúde - incluindo hospitais, clínicas e postos de saúde - que estão ligados a áreas administrativas dentro da estrutura. As instalações podem ter atributos adicionais, como o tipo de instalação (hospital, centro de saúde ou dispensário) e a categoria de propriedade (pública, privada ou religiosa).

### Fontes de dados

#### Dados do HMIS

Os dados do Sistema de Informação de Gestão da Saúde (HMIS) contêm estatísticas de rotina dos serviços de saúde recolhidas nos estabelecimentos. Isto inclui indicadores de prestação de serviços, dados de vigilância de doenças e métricas de desempenho do programa. Os dados do HMIS são normalmente comunicados numa base mensal e constituem a base para a maioria das análises de rotina do sistema de saúde.

#### Dados HFA

Os dados da Avaliação dos Estabelecimentos de Saúde (HFA) contêm informações sobre as caraterísticas e a capacidade dos estabelecimentos. Incluem dados sobre a disponibilidade de infra-estruturas, equipamento e materiais, níveis de pessoal e prontidão dos serviços. Os dados do HFA complementam os dados do HMIS, fornecendo contexto sobre as instalações a partir das quais os dados de rotina são comunicados.

### Indicadores

**Os indicadores** são métricas de saúde mensuráveis utilizadas na plataforma. Estes podem ser **Indicadores Comuns**, que são definidos e partilhados em toda a instância para uma medição consistente, ou **Indicadores DHIS2**, que são importados de sistemas DHIS2 externos e podem seguir diferentes convenções de nomenclatura ou métodos de cálculo.

### Conjuntos de dados e versões

Um **conjunto de dados** é uma coleção de dados de saúde, seja HMIS ou HFA. Cada vez que os dados são importados para a plataforma, é criada uma nova versão. Este sistema de versões permite aos utilizadores acompanhar as alterações ao longo do tempo, alternar entre versões, se necessário, e manter um histórico de dados completo para efeitos de auditoria e comparação.

### Módulos

**Os módulos** são unidades de processamento de dados que executam scripts R analíticos na plataforma. Cada módulo recebe dados de entrada de conjuntos de dados ou dos resultados de outros módulos, processa e analisa os dados de acordo com métodos estatísticos definidos e produz objectos de resultados como ficheiros de saída. Os módulos podem ser encadeados para suportar fluxos de trabalho analíticos complexos em que um módulo utiliza os resultados de outro como entradas.

A plataforma distingue dois tipos de módulos. Uma **Definição de módulo** é o modelo ou projeto para um tipo de análise, definindo os métodos analíticos e os parâmetros disponíveis. Uma **instância de módulo** é um módulo que foi ativado e configurado num projeto específico. Alguns módulos têm pré-requisitos, o que significa que outros módulos têm de ser activados primeiro antes de poderem ser utilizados.

### Visualizações (objectos de apresentação)

**As visualizações**, também designadas por objectos de apresentação, são representações visuais de dados gerados a partir de resultados de módulos. A plataforma suporta três tipos principais de visualização: gráficos (incluindo gráficos de barras, gráficos de linhas e gráficos de tartes), mapas (visualizações geográficas que mostram dados em áreas administrativas) e tabelas (apresentações de dados tabulares).

As visualizações podem ser filtradas por várias dimensões e desagregadas por factores como o tipo de estabelecimento, o período de tempo ou o nível administrativo. Os utilizadores podem personalizar o aspeto e o estilo das visualizações e exportá-las para utilização em aplicações externas ou incluí-las diretamente em relatórios.

### Relatórios

*os *Relatórios** são colecções de páginas de visualização concebidas para exportação e partilha com as partes interessadas. Os relatórios podem ser exportados como apresentações do PowerPoint ou documentos PDF e podem ser organizados com várias páginas configuradas com layouts e orientações personalizados. Cada página de um relatório é um **item de relatório** que contém uma visualização.

### Janela

**Windowing** refere-se ao processo de seleção de um subconjunto de dados de instância para utilização num projeto. Os utilizadores podem filtrar dados por período de tempo (selecionando meses ou anos específicos), por indicadores (incluindo todos ou apenas indicadores específicos), por áreas administrativas (incluindo todas ou regiões específicas) e por instalações (filtrando por tipo de instalação ou propriedade). Esta funcionalidade permite que os projectos se concentrem nos dados mais relevantes para os seus objectivos analíticos sem carregar todo o conjunto de dados.

### Desagregação

**A desagregação** refere-se ao processo de decompor os dados por dimensões para identificar padrões e variações. Os dados podem ser desagregados por período de tempo (mensal, trimestral ou anual), por nível de área administrativa, por tipo de estabelecimento, por propriedade do estabelecimento ou por categorias de indicadores. Esta capacidade permite uma análise mais pormenorizada e ajuda a identificar disparidades em diferentes dimensões.

### Funções do utilizador

Podem ser atribuídas aos utilizadores diferentes funções que determinam as suas permissões dentro da plataforma. Ao nível da **instância**, os Administradores globais têm acesso total a todas as definições e projectos da instância. Ao nível do **projeto**, estão disponíveis três funções: Os administradores podem modificar as definições, módulos, visualizações e relatórios do projeto; os editores podem criar e modificar visualizações e relatórios; e os visualizadores podem ver o conteúdo do projeto, mas não podem fazer modificações.

### Pontuações de qualidade de dados

A plataforma avalia automaticamente a integridade e a precisão dos dados, gerando pontuações de qualidade que ajudam os utilizadores a identificar potenciais problemas com os dados. Estas pontuações apoiam os processos de revisão da qualidade dos dados e ajudam a dar prioridade às áreas que requerem atenção.

### Estado do bloqueio

Os projectos podem ser **bloqueados** para evitar modificações na sua configuração, permitindo ainda que os utilizadores visualizem relatórios. Quando um projeto está bloqueado, os módulos e as definições de dados não podem ser alterados, fornecendo um mecanismo para preservar as configurações analíticas depois de terem sido finalizadas.

!!! dica "Guia do utilizador"
    Para obter tutoriais passo a passo sobre a utilização da plataforma, consulte o [Guia do utilizador FASTR](11_user_guide.md).

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

<!-- SLIDE:m3_1 -->
## Plataforma de análise FASTR

A **plataforma analítica FASTR** é uma ferramenta baseada na Web concebida para apoiar a avaliação, o ajustamento e a análise da qualidade dos dados de saúde de rotina.

Permite aos utilizadores carregar e analisar dados de várias fontes, incluindo o DHIS2, com métodos estatísticos incorporados para gerar um conjunto de dados ajustados e executar análises prioritárias em indicadores selecionados.

A plataforma fornece uma interface de fácil utilização para executar análises e oferece opções flexíveis para visualizar e exportar resultados.

<div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">

![h:180](../resources/screenshots/platform/platform_overview_1.png) ![h:180](../resources/screenshots/platform/platform_overview_2.png) ![h:180](../resources/screenshots/platform/platform_overview_3.png)

</div>
<!-- /SLIDE -->

<!-- SLIDE:m3_1b -->
## Capacidades da plataforma

<div class="columns">
<div>

![Capacidades da plataforma](../resources/diagrams_pt/platform_capabilities.svg)

</div>
<div>

**Gestão de dados** - Importar listas de estabelecimentos e dados de indicadores do DHIS2 ou de ficheiros

**Análise de dados** - Executar módulos estatísticos para avaliação e ajuste da qualidade

**Visualização** - Explore os resultados com gráficos e tabelas interactivos

**Relatórios** - Exportar resultados para PowerPoint ou PDF para as partes interessadas

**Colaboração** - Trabalhe em conjunto com a sua equipa em projectos partilhados

**Assistente de IA** - Obtenha ajuda para interpretar resultados e compreender os seus dados

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m3_2a -->
## País Instância

Cada país tem a sua própria **instância** da plataforma de análise FASTR.

Uma instância contém:

- Todos os utilizadores registados e as suas contas
- A estrutura administrativa partilhada (regiões, distritos, instalações)
- Definições de indicadores e fontes de dados
- Todos os projectos criados para esse país

**Pense numa instância como o espaço de trabalho dedicado ao seu país
<!-- /SLIDE -->

<!-- SLIDE:m3_2b -->
## Funções e permissões do utilizador

Existem dois níveis de permissões na plataforma:

&nbsp;

**Funções ao nível da instância:**

- os **Administradores de instância** podem adicionar utilizadores, criar projectos, atribuir funções, carregar dados, importar e configurar módulos e executar análises

&nbsp;

**Funções ao nível do projeto:**

- **Project Editors** pode criar visualizações, criar relatórios e descarregar/exportar resultados
- **Project Viewers** podem ver visualizações, ver relatórios e descarregar/exportar resultados

&nbsp;

*Os administradores são atribuídos por instância; os editores e visualizadores são atribuídos por projeto*
<!-- /SLIDE -->

<!-- SLIDE:m3_2c -->
## Projectos dentro de uma instância

<style scoped>
.container { display: flex; gap: 1rem; }
.container .img-col { flex: 2; }
.container .img-col img { width: 100%; height: auto; }
.content .text-col { flex: 1; font-size: 0.85em; }
</style>

<div class="contentor">
<div class="img-col">

![Projectos dentro da instância](../resources/diagrams_pt/projects_within_instance.svg)

</div>
<div class="text-col">

Cada instância de país pode conter **múltiplos projectos**.

Um país pode necessitar apenas de um projeto, ou podem ser utilizados vários projectos para:

- Diferentes versões de análises
- Um projeto de demonstração ou de recreio
- Projectos separados para diferentes equipas ou programas

**Questões-chave aquando da criação:**

- Quem é o administrador?
- Quem pode editar?
- Quem pode ver?

</div>
</div>
<!-- /SLIDE -->

---

**Contacto**: <fastr@worldbank.org>
