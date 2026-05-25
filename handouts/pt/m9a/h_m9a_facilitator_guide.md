---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Configuração da instância · Facilitador"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guia do facilitador — Configuração da instância

<p class="meta-line"><strong>Guia do facilitador</strong> · <strong>Configuração da instância</strong> · <strong>5 atividades · ~90 min</strong></p>

## Objetivo

A Configuração da instância é a sequência que liga os dados DHIS2 de um país a uma instância FASTR. Os participantes importam a estrutura de unidades, definem e mapeiam os indicadores, extraem os dados do HMIS, e verificam o resultado. Todas as atividades posteriores da formação assentam nos dados carregados aqui, por isso o módulo é um pré-requisito e não um tema em si.

As cinco atividades correm por uma **ordem estrita**: cada passo depende do anterior, e os erros propagam-se — um mapeamento de indicador errado no passo 3 reaparece como um número errado no passo 5. No final, cada equipa deve ter uma instância verificada cujos valores conferidos batem certo com o DHIS2.

## A sessão num relance

| # | Atividade | Duração | Formato |
|---|-----------|---------|---------|
| 1 | Antes de começar | ~5 min | Guiada, sala toda |
| 2 | Importar a estrutura de unidades | ~20 min | Guiada, sala toda |
| 3 | Importar e mapear indicadores | ~30 min | Guiada, sala toda |
| 4 | Importar dados do HMIS | ~25 min | Guiada, sala toda |
| 5 | Verificar e explorar a sua configuração | ~10 min | Guiada, sala toda |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Conduzir a sessão

**Preparação.** Confirme duas coisas para cada equipa *antes* de começar: credenciais DHIS2 funcionais (URL, nome de utilizador, palavra-passe) e uma Lista de verificação de preparação de dados preenchida. A falta de acesso é o maior sorvedouro de tempo aqui, e é algo que só você ou um administrador podem resolver — não o participante.

**Como demonstrar.** As fichas são procedimentos detalhados clique a clique. Demonstre os primeiros cliques de cada passo no ecrã partilhado para os participantes se situarem, depois deixe-os seguir a ficha ao seu ritmo. Os momentos delicados a mostrar devagar estão assinalados em **Demonstrar** abaixo.

**Agrupamento.** Esta é uma sequência guiada, não trabalho independente — mantenha a sala em conjunto e avance passo a passo. Não deixe os mais rápidos avançar à frente; os passos seguintes falham em silêncio se um anterior ficou mal feito.

**Ritmo.** Se alguém ficar para trás, pare a sala toda. O custo de esperar é muito inferior ao de uma equipa descobrir no passo 5 que o passo 3 estava errado e ter de refazer a sequência.

**A mensagem a transmitir.** A configuração só está «concluída» quando a verificação passa. Um mosaico verde não é prova; um valor conferido que bate certo com o DHIS2 é.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## As atividades

### 1. Antes de começar · ~5 min · sala toda

**O que acontece.** Uma página de orientação que apresenta a sequência de quatro passos e explica como são tratadas as credenciais DHIS2. Os participantes reúnem o que precisam — Lista de verificação preenchida, URL/nome de utilizador/palavra-passe do DHIS2, navegador estável. Não há um passo de «ligação» separado; as credenciais introduzem-se na primeira importação.

**Diga algo como.** *«Na primeira importação ser-lhe-á pedido o seu login do DHIS2. Marque "Save credentials for this session" — senão terá de o reintroduzir a cada passo.»*

**Como é um bom resultado.** Cada equipa com a sua lista e credenciais em mão antes de alguém clicar em importar.

**Atenção a.**
- Equipas sem acesso DHIS2 confirmado. Resolva isto antes de começar, não a meio da sequência.
- A caixa «Save credentials for this session» esquecida, que provoca pedidos repetidos.

### 2. Importar a estrutura de unidades · ~20 min · sala toda

**O que acontece.** Um procedimento passo a passo para extrair a hierarquia administrativa do país para o FASTR: Data → Structure & maps → Admin areas → import directly from DHIS2 → selecionar o nível **Facility** → finalizar até o mosaico Structure & maps ficar verde.

**Demonstrar.** Mostre o caminho até Structure & maps e o ponto onde se escolhe o **nível** DHIS2 — selecionar o nível errado aqui é a falha mais comum, e é difícil de detetar depois.

**Como é um bom resultado.** Uma lista de unidades conforme à estrutura real do país, e um mosaico Structure & maps verde.

**Atenção a.**
- Uma lista de unidades vazia ou uma hierarquia com aspeto errado — normalmente o nível DHIS2 errado, ou falta de acesso de leitura às unidades organizacionais.
- Falhas de autenticação — tipicamente um URL malformado, não uma palavra-passe errada.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Importar e mapear indicadores · ~30 min · sala toda

**O que acontece.** O passo mais longo e mais sujeito a erros, em três fases: criar os indicadores comuns, importar os nomes dos indicadores DHIS2 do país, depois mapear cada indicador DHIS2 ao seu correspondente comum.

**Demonstrar.** Mostre um mapeamento completo — um indicador DHIS2 ligado a um indicador comum — e a regra de nomenclatura do Common ID, antes de as equipas tratarem a sua própria lista.

**Diga algo como.** *«Os Common IDs são só letras minúsculas e sublinhados. Sem espaços, sem acentos. E cada indicador DHIS2 mapeia-se a exatamente um indicador comum.»*

**Como é um bom resultado.** Cada indicador prioritário mapeado, sem IDs rejeitados nem indicador DHIS2 mapeado a dois indicadores comuns.

**Atenção a.**
- Um Common ID rejeitado — usou-se um espaço, acento ou carácter especial.
- Confusão de mapeamento — lembre que a relação é um-para-um. Um erro aqui reaparece como número errado no passo 5.

### 4. Importar dados do HMIS · ~25 min · sala toda

**O que acontece.** A maior operação de dados da configuração: extrair os valores reais do HMIS do DHIS2. Os participantes selecionam indicadores e um intervalo de tempo, definem o tratamento de erros para **«Abort the entire import attempt»**, extraem, revêm o resumo da importação, depois integram e finalizam.

**Demonstrar.** Mostre o tratamento de erros e o ecrã de resumo da importação, para as equipas saberem como é um resumo saudável antes de integrarem.

**Diga algo como.** *«Não fechem o separador durante a extração. Para um país grande, restrinjam os indicadores ou o intervalo de tempo e importem por lotes em vez de tudo de uma vez.»*

**Como é um bom resultado.** Um resumo de importação limpo, integrado e finalizado, sem erros de abandono.

**Atenção a.**
- Extrações grandes que bloqueiam o navegador — avise para não fechar o separador a meio.
- Países muito grandes que excedem o tempo — façam importar por lotes.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Verificar e explorar a sua configuração · ~10 min · sala toda

**O que acontece.** Um passo de verificação que serve também de introdução ao explorador de gráficos. Os participantes veem os indicadores como séries temporais, ativam/desativam indicadores, ajustam a escala do eixo Y, conferem um valor conhecido de uma unidade contra o DHIS2, e revêm o histórico de importações.

**Demonstrar.** Mostre uma verificação pontual de ponta a ponta: escolha uma unidade e um mês cujo valor conhece, encontre-o no FASTR, e compare-o com o DHIS2. É o momento que prova a configuração.

**Diga algo como.** *«Um mosaico verde significa que a importação correu. Uma verificação que bate certo com o DHIS2 significa que a importação está correta. É a segunda que precisamos.»*

**Como é um bom resultado.** Um valor conferido que bate certo, exatamente, com o DHIS2.

**Atenção a.**
- Valores planos ou a zero — normalmente o intervalo de períodos não coincide com os dados do DHIS2.
- Uma verificação que não bate certo — quase sempre mapeamento de indicadores incompleto no passo 3. Reencaminhe a equipa para lá em vez de continuar.

## Para encerrar

Não avance até a verificação de cada equipa passar. Uma verificação falhada não é um detalhe a corrigir depois — o resto da formação assenta nestes dados, e um erro de mapeamento silencioso reaparecerá como uma conclusão errada no relatório de um participante.
