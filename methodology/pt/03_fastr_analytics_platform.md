<!-- AUTO-TRANSLATED from 03_fastr_analytics_platform.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# A plataforma de análise de dados FASTR

## Visão geral

A plataforma de análise FASTR é uma ferramenta baseada na Web concebida para apoiar a avaliação da qualidade, o ajuste e a análise de dados de saúde de rotina. Permite aos utilizadores carregar e analisar dados de várias fontes, incluindo o DHIS2, com métodos estatísticos integrados para gerar um conjunto de dados ajustado e realizar análises prioritárias sobre indicadores selecionados. A plataforma oferece uma interface intuitiva para a realização de análises e disponibiliza opções flexíveis para a visualização e exportação de resultados.

![Capacidades da plataforma](resources/diagrams/platform_capabilities.svg)

## Principais capacidades

### Gestão de dados

A plataforma oferece funcionalidades abrangentes de gestão de dados. Os utilizadores podem importar e gerir estruturas de unidades de saúde, incluindo áreas administrativas e unidades individuais. O sistema suporta a importação de dados de Sistemas de Informação de Gestão de Saúde (HMIS) e Avaliações de Unidades de Saúde (HFA), permitindo aos utilizadores gerir indicadores de múltiplas fontes enquanto acompanham as versões dos conjuntos de dados ao longo do tempo.

### Análise de dados

As capacidades analíticas são fornecidas através de módulos configuráveis. Os administradores selecionam e configuram os módulos ao gerar um **pacote de resultados** — um conjunto versionado de resultados calculados, produzido ao nível da instância. Os módulos processam dados utilizando scripts estatísticos baseados em R e podem ser encadeados para suportar análises complexas e em várias etapas, com ferramentas integradas para monitorizar o estado do processamento e rever registos. Todos os projetos anexados a um pacote leem os mesmos resultados calculados.

### Assistente de IA

Um assistente de IA integrado ajuda os utilizadores a compreender e interpretar os seus dados. O assistente pode explicar os resultados dos módulos, descrever tendências e padrões de dados, fornecer insights sobre visualizações e ajudar a gerar conteúdo narrativo para relatórios. Os utilizadores podem fazer perguntas sobre os dados dos seus projetos em linguagem natural e receber orientação contextual sobre análise e interpretação.

### Visualização

A plataforma oferece ferramentas de visualização robustas para apresentar resultados analíticos. Os utilizadores podem criar gráficos, mapas e tabelas a partir de dados processados, com opções para filtrar e desagregar por múltiplas dimensões. As visualizações podem ser personalizadas em termos de aparência e estilo e exportadas como imagens ou ficheiros de dados para utilização em aplicações externas.

### Partilha de resultados

Depois de os utilizadores terem criado visualizações, a plataforma oferece três formas de as partilhar, adequadas a diferentes públicos:

- **Painéis** — páginas em tempo real e partilháveis que agrupam visualizações numa única vista. Os gráficos atualizam-se sempre que os dados são atualizados, e o painel de controlo pode ser publicado através de um link público para que as partes interessadas o abram num navegador sem uma conta FASTR.
- **Apresentações** — resultados em formato de apresentação de slides concebidos para reuniões e workshops ao vivo. Exporte para PowerPoint ou PDF para apresentação presencial.
- **Relatórios** — documentos narrativos extensos que combinam análises escritas com dados em tempo real. Exporte para Word ou PDF para que as partes interessadas possam ler o documento na íntegra.

### Colaboração

A plataforma suporta o trabalho colaborativo através de uma estrutura baseada em projetos. Os utilizadores podem organizar o seu trabalho em projetos distintos e atribuir aos membros da equipa diferentes funções, incluindo permissões de visualizador, editor e administrador. Os controlos de acesso funcionam ao nível do projeto, e os projetos podem ser bloqueados para evitar alterações indesejadas.

## Quem deve utilizar esta aplicação?

### Analistas de dados

Os analistas de dados irão considerar a plataforma valiosa para analisar tendências de dados de saúde, criar visualizações e gerar relatórios para os decisores. Os módulos analíticos e as ferramentas de visualização foram concebidos para apoiar fluxos de trabalho rigorosos de análise de dados.

### Gestores de programas de saúde

Os gestores de programas de saúde podem utilizar a plataforma para monitorizar o desempenho dos programas, acompanhar indicadores-chave e partilhar insights com as suas equipas. A funcionalidade de relatórios permite a comunicação regular de resultados para apoiar a gestão de programas baseada em evidências.

### Administradores de sistema

Os administradores de sistema são responsáveis pela configuração da plataforma, gestão de utilizadores, importação de dados e configuração do sistema para satisfazer as necessidades organizacionais. As ferramentas administrativas proporcionam controlo sobre o acesso dos utilizadores, as fontes de dados e as definições da plataforma.

## Como funciona a aplicação

### Nível da organização (instância)

A **instância** funciona como o principal espaço de trabalho da organização dentro da plataforma. Cada instância contém todos os utilizadores registados, a estrutura administrativa partilhada (incluindo áreas administrativas e unidades de saúde), definições de indicadores partilhadas, fontes de dados (tanto HMIS como HFA) e todos os projetos criados dentro da organização.

### Nível do projeto

Os **projetos** fornecem espaços de trabalho de autoria específicos dentro de uma instância. Cada projeto lê os seus números no **pacote de resultados** que lhe está anexado — os projetos não processam dados por si próprios. Dentro de um projeto, os utilizadores criam visualizações, painéis, apresentações e relatórios adaptados a objetivos analíticos específicos. Criar um projeto requer apenas um nome, e um projeto pode ser limitado a uma única área administrativa.

![Projetos dentro da instância](resources/diagrams/projects_within_instance.svg)


### Fluxo de dados

A plataforma segue um fluxo de dados estruturado: **Importação de dados → Geração de um pacote de resultados → Visualizações → Painéis, apresentações e relatórios**. Os administradores importam primeiro os dados das unidades de saúde ao nível da instância. Em seguida, é gerado um pacote de resultados: os módulos analíticos selecionados processam os dados e guardam os seus resultados em conjunto, como um pacote versionado. Os projetos anexam um pacote — vários projetos podem ler o mesmo — e transformam os seus resultados em gráficos, mapas e tabelas. As visualizações podem então ser reunidas em painéis para partilha em tempo real, apresentações para exibição ao vivo ou relatórios narrativos para divulgação por escrito.


## Requisitos técnicos

### Idiomas suportados

A aplicação suporta atualmente inglês e francês. As definições de idioma podem ser configuradas ao nível da instância para satisfazer as necessidades de diferentes comunidades de utilizadores.

### Requisitos do navegador

A aplicação foi concebida para funcionar com navegadores web modernos. Recomenda-se o Chrome para um desempenho ideal, embora o Firefox, o Safari e o Edge também sejam suportados. O JavaScript deve estar ativado para uma funcionalidade completa.

## Conceitos básicos

Compreender estes conceitos fundamentais ajudará os utilizadores a trabalhar eficazmente com a aplicação.

### Instância

Uma **instância** é o espaço de trabalho principal da organização dentro da plataforma. Funciona como o contentor de nível superior para todos os utilizadores, a estrutura administrativa partilhada, as fontes de dados e os projetos. Cada organização opera normalmente dentro de uma única instância que fornece a base para todo o trabalho analítico.

### Projetos

Um **projeto** é um espaço de trabalho de autoria específico dentro de uma instância. Cada projeto lê os seus números no pacote de resultados que lhe está anexado. Dentro de cada projeto, os utilizadores criam visualizações, geram relatórios e colaboram com os membros da equipa. Podem existir vários projetos dentro de uma instância, cada um com a sua própria configuração de acesso de utilizadores — e, se necessário, limitado a uma única área administrativa.

### Estrutura

A **estrutura** define a organização hierárquica das áreas administrativas e das instalações de saúde dentro da plataforma.

**As áreas administrativas** representam limites geográficos organizados em até quatro níveis. A Área Administrativa 1 representa as fronteiras do país. A Área Administrativa 2 corresponde às maiores unidades subnacionais, como províncias ou regiões. A Área Administrativa 3 abrange unidades de nível médio, como distritos ou departamentos, enquanto a Área Administrativa 4 representa unidades menores, como comunas ou subdistritos. Nem todas as instâncias requerem os quatro níveis administrativos.

**Unidades de saúde** são os pontos de prestação de serviços de saúde — incluindo hospitais, clínicas e postos de saúde — que estão ligados a áreas administrativas dentro da estrutura. As unidades podem ter atributos adicionais, tais como o tipo de unidade (hospital, centro de saúde ou dispensário) e a categoria de propriedade (pública, privada ou religiosa).

### Fontes de dados

#### Dados do HMIS

Os dados do Sistema de Informação de Gestão de Saúde (HMIS) contêm estatísticas de rotina dos serviços de saúde recolhidas nas unidades. Isto inclui indicadores de prestação de serviços, dados de vigilância de doenças e métricas de desempenho dos programas. Os dados do HMIS são normalmente reportados mensalmente e constituem a base para a maioria das análises de rotina do sistema de saúde.

#### Dados HFA

Os dados da Avaliação de Unidades de Saúde (HFA) contêm informações sobre as características e a capacidade das unidades. Isto inclui dados sobre a disponibilidade de infraestruturas, equipamento e consumíveis, níveis de pessoal e prontidão dos serviços. Os dados HFA complementam os dados HMIS, fornecendo contexto sobre as unidades a partir das quais os dados de rotina são reportados.

### Indicadores

**Os indicadores** são métricas de saúde mensuráveis utilizadas na plataforma. Existem três tipos:

- **Os indicadores comuns** são definidos e partilhados em toda a instância para uma medição consistente.
- **Os indicadores DHIS2** são importados de sistemas DHIS2 externos e podem seguir diferentes convenções de nomenclatura ou métodos de cálculo.
- **Os indicadores calculados** são métricas derivadas que combinam dois valores — tipicamente um indicador numerador dividido por um denominador (outro indicador ou um valor baseado na população). Por exemplo, as consultas de ANC1 divididas pela população-alvo de mulheres grávidas fornecem uma estimativa da cobertura de ANC1. Os indicadores calculados podem ser apresentados como uma percentagem, uma contagem ou uma taxa por 10 000, e suportam limiares de semáforo para uma análise rápida do desempenho (por exemplo, verde a partir de 80%, amarelo entre 70% e 79%, vermelho abaixo de 70%).

As definições dos indicadores calculados são aplicadas no momento da geração de um pacote de resultados, pelo que uma definição alterada tem efeito no pacote seguinte. Os denominadores baseados na população requerem que um ficheiro CSV da população seja carregado ao nível da instância antes de poderem ser utilizados.

### Conjuntos de dados e versões

Um **conjunto de dados** é uma coleção de dados de saúde, sejam eles HMIS ou HFA. Cada vez que os dados são importados para a plataforma, é criada uma nova versão. Este sistema de versões permite aos utilizadores acompanhar as alterações ao longo do tempo, alternar entre versões, se necessário, e manter um histórico completo dos dados para fins de auditoria e comparação.

### Módulos

**Módulos** são unidades de processamento de dados que executam scripts R analíticos dentro da plataforma. Cada módulo recebe dados de entrada de conjuntos de dados ou dos resultados de outros módulos, processa e analisa os dados de acordo com métodos estatísticos definidos e produz objetos de resultados como ficheiros de saída. Os módulos podem ser encadeados para suportar fluxos de trabalho analíticos complexos, nos quais um módulo utiliza os resultados de outro como entradas.

Os módulos são selecionados e configurados no assistente de geração de pacotes de resultados, ao nível da instância. Alguns módulos têm pré-requisitos — outros módulos cujos resultados utilizam — e a plataforma adiciona-os automaticamente quando um módulo dependente é selecionado.

### Visualizações

**Visualizações** são representações visuais de dados gerados a partir dos resultados dos módulos. A plataforma suporta três tipos principais de visualização: gráficos (incluindo gráficos de barras, gráficos de linhas e gráficos circulares), mapas (visualizações geográficas que mostram dados em áreas administrativas) e tabelas (apresentações de dados em tabelas).

As visualizações podem ser filtradas por várias dimensões e desagregadas por fatores como tipo de instalação, período de tempo ou nível administrativo. Os utilizadores podem personalizar a aparência e o estilo das visualizações, bem como exportá-las para utilização em aplicações externas ou incluí-las diretamente em painéis, apresentações ou relatórios.

### Painéis

**Os painéis** são páginas ativas e partilháveis que agrupam visualizações guardadas numa única vista. Cada mosaico num painel é um gráfico, mapa ou tabela que se atualiza automaticamente sempre que os dados subjacentes são atualizados — pelo que um painel mostra sempre o estado atual dos dados sem necessidade de reexportação.

Os painéis podem ser publicados num URL público (com controlos de acesso opcionais) para que as partes interessadas os abram num navegador sem precisarem de uma conta FASTR. Estão disponíveis dois layouts: uma **grelha** que organiza os blocos em linhas e colunas e uma **barra lateral** que organiza os blocos num menu do lado esquerdo para navegação.

Os painéis também suportam **grupos de réplicas** — um único bloco pode conter muitas variantes do mesmo gráfico (por exemplo, uma por distrito), com um menu suspenso que permite ao utilizador alternar entre elas. Isto mantém o painel compacto quando a mesma análise precisa de ser apresentada para muitas áreas.

### Apresentações

**Apresentações** são resultados no estilo de apresentações de slides, concebidas para workshops ao vivo ou reuniões com partes interessadas. O editor dispõe um gráfico, título ou bloco de texto por slide, semelhante ao PowerPoint. As apresentações são exportadas para PowerPoint (.pptx) ou PDF e são mais adequadas para resultados que serão projetados numa sala enquanto alguém os explica ao público.

### Relatórios

**Os relatórios** são documentos narrativos extensos que combinam a sua análise escrita com dados em tempo real da plataforma. O editor funciona como um processador de texto com formatação Markdown: os utilizadores escrevem comentários, incorporam visualizações que se atualizam automaticamente quando os dados são atualizados e adicionam imagens estáticas para contextualizar.

Os relatórios são exportados para **Word (.docx) ou PDF** e foram concebidos para que as partes interessadas leiam um documento na íntegra, em vez de assistirem a uma apresentação. Utilize uma apresentação quando o produto final for projetado numa reunião; utilize um relatório quando o produto final for lido numa secretária ou numa caixa de entrada.

### Pacotes de resultados

Um **pacote de resultados** é um conjunto versionado de resultados calculados, gerado ao nível da instância. Gerar um pacote executa os módulos analíticos selecionados sobre os conjuntos de dados escolhidos e guarda os seus resultados em conjunto. Os projetos não processam dados por si próprios: cada projeto anexa um pacote e lê nele todos os seus números, pelo que vários projetos podem trabalhar sobre os mesmos resultados consistentes.

Um administrador pode **fixar** um pacote como referência da instância, e cada projeto pode ser configurado para seguir sempre o pacote fixado. A atualização mensal de rotina resume-se então a três passos: importar os novos dados, gerar um pacote e fixá-lo — os projetos acompanham.

### Desagregação

**Desagregação** refere-se ao processo de decompor os dados por dimensões para identificar padrões e variações. Os dados podem ser desagregados por período de tempo (mensal, trimestral ou anual), por nível de área administrativa, por tipo de instalação, por propriedade da instalação ou por categorias de indicadores. Esta capacidade permite uma análise mais matizada e ajuda a identificar disparidades entre diferentes dimensões.

### Funções dos utilizadores

Podem ser atribuídas diferentes funções aos utilizadores, que determinam as suas permissões dentro da plataforma. Ao **nível da instância**, os Administradores Globais têm acesso total a todas as definições da instância e projetos. Ao **nível do projeto**, estão disponíveis três funções: os Administradores podem modificar as definições do projeto, módulos, visualizações e relatórios; Os editores podem criar e modificar visualizações e relatórios; e Os visualizadores podem visualizar o conteúdo do projeto, mas não podem fazer modificações.

### Pontuações de qualidade dos dados

A plataforma avalia automaticamente a integridade e a precisão dos dados, gerando pontuações de qualidade que ajudam os utilizadores a identificar potenciais problemas nos dados. Estas pontuações apoiam os processos de revisão da qualidade dos dados e ajudam a priorizar áreas que requerem atenção.

### Estado de bloqueio

Os projetos podem ser **bloqueados** para impedir modificações, permitindo ainda assim que os utilizadores visualizem relatórios. Quando um projeto está bloqueado, as suas visualizações e definições não podem ser alteradas, proporcionando um mecanismo para preservar o trabalho depois de finalizado.

!!! dica "Guia do utilizador"
    Para tutoriais passo a passo sobre a utilização da plataforma, consulte o [Guia do utilizador do FASTR](11_user_guide.md).

---

<!--
////////////////////////////////////////////////////////////////////
// //
//   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //
//  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//
//  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//
//   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//
//   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//
//  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
// //
// Editar slides do workshop abaixo desta linha //
// //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m3_1 -->
## Plataforma analítica FASTR

A **plataforma analítica FASTR** é uma ferramenta baseada na web concebida para apoiar a avaliação da qualidade, o ajuste e a análise de dados de saúde de rotina.

Permite aos utilizadores carregar e analisar dados de várias fontes, incluindo o DHIS2, com métodos estatísticos integrados para gerar um conjunto de dados ajustado e realizar análises prioritárias sobre indicadores selecionados.

A plataforma oferece uma interface intuitiva para a realização de análises e disponibiliza opções flexíveis para a visualização e exportação de resultados.

<div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">

![h:180](../resources/screenshots/platform/platform_overview_1.png) ![h:180](../resources/screenshots/platform/platform_overview_2.png) ![h:180](../resources/screenshots/platform/platform_overview_3.png)

</div>
<!-- /SLIDE -->

<!-- SLIDE:m3_1b -->
## Capacidades da plataforma

<div class="columns">
<div>

![Capacidades da plataforma](../resources/diagrams/platform_capabilities.svg)

</div>
<div>

**Gestão de dados** — Importe listas de instalações e dados de indicadores a partir do DHIS2 ou de ficheiros

**Análise de dados** — Módulos estatísticos integrados para avaliação da qualidade, ajuste e cobertura

**Visualização** — Explore os resultados com gráficos e tabelas interativos

**Partilha de resultados** — Crie painéis em tempo real, apresentações de slides ou relatórios narrativos para as partes interessadas

**Colaboração** — Trabalhe em conjunto com a sua equipa em projetos partilhados

**Assistente de IA** — Obtenha ajuda para interpretar resultados e compreender os seus dados

</div>
</div>
<!-- /SLIDE -->

<!-- SLIDE:m3_2a -->
## Instância do país

Cada país tem a sua própria **instância** da plataforma de análise FASTR.

Uma instância contém:

- Todos os utilizadores registados e as suas contas
- A estrutura administrativa partilhada (regiões, distritos, instalações)
- Definições de indicadores e fontes de dados
- Os pacotes de resultados — as análises calculadas que os projetos leem
- Todos os projetos criados para esse país

**Pense numa instância como o espaço de trabalho dedicado ao seu país.**
<!-- /SLIDE -->

<!-- SLIDE:m3_2b -->
## Funções e permissões dos utilizadores

Existem dois níveis de permissões na plataforma:

&nbsp;

**Funções ao nível da instância:**

- **Os administradores da instância** podem adicionar utilizadores, criar projetos, atribuir funções, importar dados e gerar pacotes de resultados

&nbsp;

**Funções ao nível do projeto:**

- **Editores de projeto** podem criar visualizações, criar relatórios e descarregar/exportar resultados
- **Visualizadores de projeto** podem visualizar visualizações, visualizar relatórios e descarregar/exportar resultados

&nbsp;

*Os administradores são atribuídos por instância; os editores e visualizadores são atribuídos por projeto.*
<!-- /SLIDE -->

<!-- SLIDE:m3_2c -->
## Projetos dentro de uma instância

<style scoped>
.container { display: flex; gap: 1rem; }
.container .img-col { flex: 2; }
.container .img-col img { width: 100%; height: auto; }
.container .text-col { flex: 1; font-size: 0.85em; }
</style>

<div class="container">
<div class="img-col">

![Projetos dentro da instância](../resources/diagrams/projects_within_instance.svg)

</div>
<div class="text-col">

Cada instância de país pode conter **vários projetos**.

Um país pode precisar apenas de um projeto, ou podem ser utilizados vários projetos para:

- Diferentes versões de análises
- Um projeto de demonstração ou de teste
- Projetos separados para diferentes equipas ou programas

**Questões-chave ao configurar:**

- Quem é o administrador?
- Quem pode editar?
- Quem pode visualizar?

</div>
</div>
<!-- /SLIDE -->

---

**Contacto**: <fastr@worldbank.org>
