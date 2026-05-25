---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Recapitulativo de metodologia · Avaliação da qualidade dos dados"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Recapitulativo de metodologia · Módulo M1</span>

# Avaliação da qualidade dos dados

<p class="meta-line"><strong>O que o módulo faz</strong> · <strong>Como ler os seus resultados</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">O que faz</p>

Antes de alguém confiar num número, este módulo verifica os dados. Lê os relatórios mensais de cada unidade sanitária e sinaliza onde os dados parecem frágeis — para que saiba quanto pode confiar em cada indicador.

<p class="sb-label">O que não faz</p>

Não altera nada. Apenas **mede** a qualidade e mostra-lhe onde estão os problemas. Corrigi-los é a tarefa do módulo seguinte.

<p class="sb-label">As três verificações</p>

- **Valores atípicos** — valores que parecem demasiado altos para serem reais
- **Completude** — meses em que uma unidade não reportou
- **Consistência** — números relacionados que não batem certo

</aside>
<div class="p1-main">

## Como ler os resultados

Cada tabela neste módulo usa o mesmo **semáforo**:

- **Verde** — cumpre o padrão de qualidade
- **Amarelo** — limítrofe; verifique
- **Vermelho** — fica aquém; estes dados precisam de atenção

**O que está por trás de cada quadrado.** Cada verificação funciona da mesma forma por baixo. Pegue numa unidade, um mês, um indicador — esse único relatório ou passa na verificação ou não. Isso é **um teste**. Cada quadrado colorido reúne então todos esses testes para uma área e mostra a **proporção que passou** (para os valores atípicos, a proporção que *falhou*). Assim, um quadrado responde realmente: *de todos os relatórios por trás dele, quantos estavam bem?*

Leia cada tabela com atenção — as cores guiam o olhar, mas o número em cada quadrado importa: diz-lhe **em que indicador** e **em que área** pode confiar, e onde não pode.

Cada verificação olha para os dados de um ângulo diferente — os valores são realistas (valores atípicos), os relatórios estão a chegar (completude), e os números relacionados concordam (consistência). Juntas, dizem-lhe quanto confiar em cada indicador.

<div class="callout-footer">A AQD mede a qualidade — não altera os dados. Leia-a antes de confiar em qualquer tendência; o módulo seguinte repara os problemas que ela encontra.</div>

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Verificação 1 de 3 · valores atípicos</span>

## Valores atípicos — «algum mês é suspeitosamente alto?»

**Como os encontramos.** Para cada unidade, o FASTR aprende como é um mês normal para um indicador, depois sinaliza os meses que quebram o padrão de uma de duas formas:

- **Um valor muito acima do normal.** Digamos que uma unidade reporta habitualmente 40–60 primeiras visitas pré-natais por mês, e depois um mês mostra 900. Isso é mais de **10×** a variação normal de mês a mês da unidade, por isso é sinalizado. (Essa variação é medida com o *desvio absoluto mediano* — uma média robusta que um mês extremo não consegue distorcer.)
- **Um único mês domina o ano.** Se um mês detém mais de **80%** de tudo o que uma unidade reportou para um indicador nos últimos 12 meses, é sinalizado — o sinal típico do total de um ano inteiro registado num só mês.

Só os indicadores com média superior a 100 por mês são verificados, para que as pequenas unidades não sejam sinalizadas por subidas e descidas normais.

![Os valores mensais normais situam-se num intervalo habitual; um mês dispara muito acima e é sinalizado w:100%](../../../resources/diagrams/methodology_outlier.svg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Verificação 1 de 3 · o resultado</span>

## Valores atípicos — ler a tabela

![Proporção de valores atípicos: uma tabela de regiões por indicador, cada célula colorida de verde, amarelo ou vermelho w:100%](../../../resources/default_outputs/Default_1._Proportion_of_outliers.png)

- **O que é cada célula** — escolha uma região (uma linha) e um indicador (uma coluna). O número é a frequência com que os relatórios mensais desse indicador pareceram **demasiado altos para serem reais** nessa região. 0,5% significa que quase nunca aconteceu; 3% significa cerca de 1 relatório em cada 33
- **Como ler** — **verde é bom** (quase nenhum mês suspeito); **vermelho significa muitos**. Uma **linha inteira vermelha** significa que essa região introduz números descuidados em muitos indicadores. Uma **coluna inteira vermelha** significa que esse indicador é difícil de reportar corretamente em todo o lado

<div class="callout-footer">Exemplo trabalhado — na tabela acima, encontre <strong>Região 005 → Consulta externa: 3,3%, a vermelho</strong>. Significa que cerca de 1 em cada 30 relatórios mensais de consultas externas na Região 005 foi sinalizado como demasiado alto — provavelmente uma unidade a introduzir um valor acumulado em vez de um mês. O resto da linha da Região 005 está verde, por isso é esse indicador que precisa de uma vista de olhos, não a região toda. O FASTR repara-os no módulo seguinte.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Verificação 2 de 3 · completude</span>

## Completude — «as unidades reportaram mesmo?»

**Como a medimos.** O FASTR começa por determinar a janela em que uma unidade esteve efetivamente ativa para um indicador — do primeiro ao último relatório, pondo de parte longos períodos (6+ meses) mesmo no início ou no fim, quando claramente ainda não estava aberta ou já tinha deixado de reportar. Dentro dessa janela ativa, conta quantos meses têm um número. Uma unidade ativa durante 12 meses que reportou em apenas 9 está **75% completa**. Um espaço em branco conta como em falta — o FASTR não consegue distinguir «não houve serviço» de «ninguém entregou o relatório», por isso trata ambos como uma lacuna.

![Unidades na lateral, meses no topo; as células preenchidas estão reportadas, as em branco em falta — contabilizadas até uma % de completude w:100%](../../../resources/diagrams/completeness_illustration.svg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Verificação 2 de 3 · o resultado</span>

## Completude — ler a tabela

![Completude do indicador: uma tabela de distritos por indicador, cada célula colorida de verde, amarelo ou vermelho w:100%](../../../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

- **O que é cada célula** — escolha um distrito (uma linha) e um indicador (uma coluna). O número é quantos dos meses que esse distrito *devia* ter reportado chegaram efetivamente. 92% significa que 92 em cada 100 relatórios esperados chegaram
- **Como ler** — **verde é bom** (quase todos os relatórios chegaram); **vermelho significa muitos em falta**. Uma **coluna inteira vermelha** é um indicador que quase ninguém reporta (talvez novo, ou pouco claro como). Uma **linha inteira vermelha** é um distrito que reporta fracamente de forma geral

<div class="callout-footer">Exemplo trabalhado — na tabela acima, encontre <strong>Distrito 005 → Cuidados pré-natais 1: 69,7%, a vermelho</strong>. Só cerca de 7 em cada 10 relatórios de CPN1 que esse distrito devia ter enviado chegaram efetivamente. Uma linha de tendência ou de cobertura construída sobre essa célula assenta em dados frágeis — leia-a com cautela.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Verificação 3 de 3 · consistência</span>

## Consistência — «os números relacionados fazem sentido em conjunto?»

**Como a verificamos.** Os indicadores relacionados devem manter uma ordem sensata: mais crianças recebem a 1.ª dose da vacina do que a 3.ª (**Penta1 ≥ Penta3**), mais mulheres uma 1.ª visita pré-natal do que uma 4.ª (**CPN1 ≥ CPN4**), e os partos correspondem aproximadamente às doses de BCG (a injeção dada à nascença).

Numa **única unidade** estes podem quebrar por razões inocentes — os números são pequenos, e uma criança pode receber uma dose numa sessão de extensão e a seguinte numa unidade. Por isso o FASTR soma o **distrito inteiro** antes de verificar; aí, as entradas e saídas equilibram-se e a relação deve manter-se.

A verificação em si é apenas um **rácio**: o FASTR compara cada par no distrito — Penta1 contra Penta3, CPN1 contra CPN4 — e sinaliza qualquer um que caia fora do intervalo plausível. É esse o objetivo: um distrito a reportar mais 3.as doses do que 1.as é impossível na vida real (nenhuma criança recebe uma 3.ª dose sem uma 1.ª), por isso o rácio sinaliza-o como erro.

![Numa unidade, Penta3 pode superar Penta1 porque algumas crianças tiveram a 1.ª dose noutro lado; somado em todo o distrito, Penta1 é maior do que Penta3 como deve ser w:100%](../../../resources/diagrams/district_consistency.svg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Verificação 3 de 3 · o resultado</span>

## Consistência — ler a tabela

![Consistência interna: uma tabela mostrando a proporção de áreas onde os indicadores relacionados seguem o padrão esperado w:100%](../../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

- **O que é cada célula** — escolha uma região (uma linha) e um par de indicadores relacionados (uma coluna). O número é a proporção dos **distritos** dessa região onde os dois números se alinham como devem
- **Como ler** — **verde é bom** (a regra mantém-se em quase todos os distritos); **vermelho significa que está quebrada na maioria**. As três regras: mais 1.as visitas pré-natais do que 4.as (**CPN1 ≥ CPN4**), mais 1.as do que 3.as doses de vacina (**Penta1 ≥ Penta3**), e partos ≈ doses de BCG

<div class="callout-footer">Exemplo trabalhado — <strong>Região 002 → «Parto ≈ BCG»: 0,0%, vermelho</strong> significa que em nenhum dos distritos da Região 002 os números de partos e de BCG coincidem. Muitas vezes isso deve-se a serem registados em locais diferentes, não a um erro real — por isso trate este par como um aviso mais brando do que os pares pré-natal e de vacinas, que devem manter-se firmes.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">O resumo</span>

## A pontuação AQD — um número por região, por ano

**Como é construída.** Olhe para uma unidade num único mês. Conta como **limpa** apenas quando todas as verificações passam ali: os indicadores centrais (consultas externas, Penta1, CPN1) não têm relatórios em falta nem valores atípicos, e os pares relacionados (Penta1/Penta3, CPN1/CPN4) alinham-se. A pontuação AQD é apenas a proporção desses meses-unidade que saem limpos — por isso **84% significa que 84 em cada 100 estavam limpos e fiáveis.**

![Pontuação AQD geral: uma tabela de regiões por ano, cada célula colorida de verde, amarelo ou vermelho w:100%](../../../resources/default_outputs/Default_5._Overall_DQA_score.png)

- **Como ler** — **verde é bom** (a maioria dos meses-unidade estão limpos). Leia da **esquerda para a direita** para ver se uma região está a melhorar ano após ano, e de **cima para baixo** para comparar regiões num único ano

<div class="callout-footer">Exemplo trabalhado — <strong>a Região 001 sobe de 60,8% → 84,4% entre 2022 e 2025</strong> (vermelho para verde): os seus dados tornaram-se progressivamente mais fiáveis. <strong>A Região 003 cai para 47,0%</strong> em 2025 (vermelho) — é aí que a qualidade dos dados precisa de atenção primeiro. Depois passe ao módulo de ajustamento, que repara os problemas aqui encontrados.</div>
