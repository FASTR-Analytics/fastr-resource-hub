---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Visualizações e interpretação · Facilitador"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guia do facilitador — Visualizações e interpretação

<p class="meta-line"><strong>Guia do facilitador</strong> · <strong>Visualizações e interpretação</strong> · <strong>6 atividades · ~100 min</strong></p>

## Objetivo

Este módulo ensina os participantes a ler um gráfico e a dizer o que significa — primeiro à mão, depois com a IA, terminando numa atividade de aplicação real sobre os dados do seu próprio país. Emparelha deliberadamente um caminho «faça você mesmo» com um caminho «a IA faz, você verifica», tanto para construir gráficos como para escrever interpretações, para que os participantes completem todo o ciclo eles próprios antes de deixarem a IA assumi-lo.

No final, um participante deve conseguir: ler qualquer gráfico FASTR com um quadro coerente; construir um gráfico e escolher o tipo certo; escrever uma interpretação em três partes; produzir os mesmos resultados com a IA e verificá-los; e identificar uma perturbação real em dados reais.

## A sessão num relance

| # | Atividade | Duração | Formato |
|---|-----------|---------|---------|
| 1 | Como ler uma visualização FASTR | ~10 min | Individual, depois pares |
| 2 | Criar a sua primeira visualização | ~15 min | Prática, individual |
| 3 | Escrever uma interpretação para um gráfico | ~20 min | Individual |
| 4 | Construir uma visualização com a IA | ~15 min | Prática, individual |
| 5 | Deixar a IA redigir a interpretação | ~15 min | Prática, individual |
| 6 | Aplicar — detetar uma perturbação | ~25 min | Equipas de país |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Conduzir a sessão

**Preparação.** Tenha uma visualização guardada e uma apresentação existente prontas na conta de demonstração para mostrar gráficos de imediato. Confirme que os participantes concluíram a Configuração da instância — a atividade 6 usa dados reais do país, que já têm de estar carregados.

**Como demonstrar.** Cada tarefa na plataforma deve ser demonstrada primeiro, depois praticada a partir da ficha, que reexplica o que mostrou. A demonstração detalhada do construtor de gráficos (atividade 2) é a que deve ensaiar — carrega a distinção filtrar/desagregar de que depende o resto do módulo.

**Agrupamento.** As atividades 1 a 5 são individuais, com partilha em pares. A atividade 6 é a síntese em equipa de país — sente as equipas juntas para ela.

**Ritmo.** A atividade 1 é a referência sobre a qual o resto assenta; não a salte. Se o tempo for curto, aperte as atividades 4 e 5 (a passagem com IA) em vez da passagem manual (2 e 3) — os participantes têm de formar o seu próprio juízo antes de verem a IA trabalhar.

**A mensagem a transmitir.** A IA é rápida, mas o participante é responsável. Reforce a verificação sempre que a IA aparece.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## As atividades

### 1. Como ler uma visualização FASTR · ~10 min · individual → pares

**O que acontece.** Os participantes aprendem um quadro de seis passos para ler qualquer gráfico — indicador, nível/período, comparação, valores, o que se destaca, o «e então» — veem como escolher tipos de gráfico, e praticam numa apresentação existente com um colega.

**Demonstrar.** Percorra os seis passos uma vez num gráfico real, nomeando cada passo em voz alta, antes de os participantes tentarem.

**Como é um bom resultado.** Um participante que verifica a legenda, os eixos e as notas de rodapé *antes* de interpretar, e consegue enunciar o «e então» de um gráfico numa frase.

**Atenção a.**
- Ler mal o eixo Y — o erro mais comum. Façam ler o eixo em voz alta primeiro.
- Saltar para «o que significa» antes de estabelecer «o que mostra».

### 2. Criar a sua primeira visualização · ~15 min · prática

**O que acontece.** Os participantes constroem um gráfico com o construtor integrado (o assistente **Metric → Presets → Create**): + Create visualization → escolher uma métrica (ex.: *M3. Service utilization → Number of services reported*) → escolher um preset como *Service volume over time (monthly)* → Create. A ficha explica depois **filtrar vs desagregar** e os quatro modos de apresentação (Lines / Grid / Rows / Columns).

**Demonstrar (~3 min, ao vivo).** Abra uma visualização guardada e use o **painel esquerdo** — sublinhe que é preciso *descer (scroll)* para chegar a estes controlos, é aqui que as pessoas se perdem:
1. Comece com um indicador, total nacional; diga por palavras o que mostra.
2. Em **Display (disaggregate)**, decomponha **por distrito** — alterne entre **Lines**, **Rows**, depois **Grid**, para verem os *mesmos dados em formas diferentes*.
3. Em **Filter (subset)**, marque só dois distritos — o gráfico mostra apenas esses. Nomeie: *«estou a escolher o que mostrar»*.
4. **Mostre a armadilha:** desagregar por distrito *e* filtrar para um único distrito → não resta nada para comparar.

**Diga algo como.** *«Filtrem o que não precisam; desagreguem o que querem comparar. E gráficos de linhas para tendências, de barras para comparar.»*

**Como é um bom resultado.** Um gráfico guardado, e um participante capaz de explicar a diferença entre filtrar e desagregar por palavras suas.

**Atenção a.**
- Confundir **filtrar** (escolher o que mostrar) com **desagregar** (dividir um total nas partes) — a distinção está na base de cada gráfico.
- Recorrer a **Custom** quando um preset chegaria; métrica → preset → Create é o caminho rápido.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Escrever uma interpretação para um gráfico · ~20 min · individual

**O que acontece.** Uma atividade de escrita que ensina a estrutura de interpretação em três partes: um título que transmite a mensagem, um «o que vê» só com factos, e um «o que significa» orientado para a ação, colocado ao lado de um gráfico num diapositivo.

**Demonstrar.** Mostre um título fraco e um forte lado a lado — *«Resultados de cobertura»* contra um título que enuncia a conclusão — para tornar concreta a diferença entre descrever e concluir.

**Diga algo como.** *«O título é a vossa conclusão, não o vosso tema. "O que vê" é só factos. "O que significa" tem de nomear uma pessoa ou um próximo passo.»*

**Como é um bom resultado.** Uma interpretação em três partes cujo título transmite a mensagem e cujo «e então» aponta para uma ação concreta.

**Atenção a.**
- Títulos que apenas descrevem («Resultados de cobertura»).
- Factos misturados com interpretação no «o que vê».
- «E então» vagos que não nomeiam pessoa nem próximo passo.

### 4. Construir uma visualização com a IA · ~15 min · prática

**O que acontece.** Os participantes produzem o mesmo gráfico através de pedidos à IA em linguagem comum: escrever um pedido, verificar se a IA correspondeu (indicador, período, dados ajustados vs brutos), iterar em pequenos passos, e guardar.

**Demonstrar.** Escreva um pedido de gráfico ao vivo, depois mostre onde confirmar que a IA usou o indicador certo, o período certo, e — sobretudo — os **dados ajustados vs brutos**.

**Diga algo como.** *«Antes de guardar, verifiquem que a IA usou dados ajustados, não brutos, e o período que realmente pediram. Ela adivinha muitas vezes.»*

**Como é um bom resultado.** Um gráfico guardado conforme ao pedido no indicador, período, tipo de gráfico, e ajustado/bruto.

**Atenção a.**
- Confiar na primeira resposta. Verificar antes de guardar — sobretudo **dados ajustados vs brutos**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Deixar a IA redigir a interpretação · ~15 min · prática

**O que acontece.** Os participantes usam a IA para redigir o texto de interpretação, depois verificam-no: pedir uma interpretação, verificar cada afirmação contra o gráfico, refinar em linguagem comum, e acrescentar o contexto local que a IA não pode conhecer.

**Demonstrar.** Gere uma interpretação no ecrã, depois verifique uma só afirmação contra o gráfico em voz alta — mostrando que «soa bem» não é o teste.

**Diga algo como.** *«A IA consegue descrever o gráfico, mas não conhece o vosso contexto. Verifiquem cada afirmação contra o gráfico, e a ação recomendada é vossa.»*

**Como é um bom resultado.** Uma interpretação em que cada afirmação foi verificada contra o gráfico e onde se acrescentou contexto local.

**Atenção a.**
- Confiar em texto que soa confiante. Cada afirmação é verificada contra o gráfico; a ação recomendada é assumida pelo participante.

### 6. Aplicar — detetar uma perturbação · ~25 min · equipas de país

**O que acontece.** A síntese: com dados reais do país, as equipas escolhem um indicador sinalizado, abrem o seu gráfico de perturbações, percorrem o quadro de seis passos, acrescentam contexto local, escrevem uma conclusão em três partes, e partilham-na com a sala.

**Demonstrar.** Nada de novo a demonstrar — isto aplica todo o módulo. Prepare-a relembrando às equipas os seis passos e a estrutura de conclusão em três partes.

**Diga algo como.** *«Uma quebra de um único mês é normalmente ruído. Procurem uma queda sustentada — três meses ou mais — e lembrem-se de que volumes estáveis podem ainda significar cobertura a cair se a população estiver a crescer.»*

**Como é um bom resultado.** Uma conclusão claramente enunciada sobre uma perturbação real e sustentada, defensável perante a sala.

**Atenção a.**
- Equipas a chamar perturbação a uma quebra de um único mês. Oriente-as para quedas sustentadas (3+ meses).
- Use a partilha final para fazer emergir e corrigir conclusões fracas — é a prova de que o módulo resultou.

## Para encerrar

A atividade 6 é a prova de que estas atividades resultaram: uma equipa que consegue escolher uma perturbação real nos seus próprios dados e enunciá-la com clareza tem a competência central do FASTR. Tudo o que precede no módulo existe para tornar essa partilha final possível.
