---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Recapitulativo de metodologia · Utilização de serviços"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Recapitulativo de metodologia · Módulo M3</span>

# Utilização de serviços

<p class="meta-line"><strong>O que o módulo faz</strong> · <strong>Como ler os seus resultados</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">O que faz</p>

Este módulo analisa se os serviços de saúde estão a **subir, descer ou manter-se estáveis** — e, sobretudo, se uma mudança é uma **perturbação real** ou apenas ruído mensal normal.

<p class="sb-label">A pergunta que responde</p>

*«Houve mesmo algo a perturbar os serviços aqui, ou são apenas as subidas e descidas habituais?»*

<p class="sb-label">Construído sobre dados limpos</p>

Corre sobre os dados **ajustados** do módulo anterior, para que valores atípicos e meses em falta não criem falsos alarmes.

</aside>
<div class="p1-main">

## Como funciona

Não se pode avaliar uma perturbação comparando um mês com o anterior — os serviços sobem e descem naturalmente com as estações e variam ao longo dos anos. Por isso, para cada unidade (ou área) e indicador, o FASTR começa por construir um nível **esperado**: uma linha que já tem em conta a tendência de longo prazo **e** o padrão sazonal.

Depois compara o valor **real** reportado com essa linha esperada. Um mês é sinalizado como perturbação quando o real se afasta demasiado do esperado:

- uma queda ou pico **acentuado** num único mês
- uma quebra ou subida **sustentada** que dura vários meses
- uma **série de relatórios em falta**

Por fim, uma regressão mede **quão grande** foi a perturbação — a % média abaixo ou acima do esperado — e se é estatisticamente real e não acaso. É isso que lhe permite dizer *«a CPN1 correu cerca de 15% abaixo do esperado de março a julho.»*

<div class="callout-footer">A perícia está na comparação: não «este número é alto?» mas «é mais alto ou mais baixo do que esperaríamos para este lugar, este serviço, esta época do ano?»</div>

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Como funciona · visualmente</span>

## Detetar uma perturbação

![A linha observada vs a linha esperada: onde a observada corre acima é um excedente, onde corre abaixo é uma perturbação w:100%](../../../resources/diagrams/disruption_chart_annotated.svg)

O intervalo sombreado é a distância entre o que aconteceu realmente e o que o FASTR esperava — verde acima da linha, vermelho abaixo.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Resultado 1 · a tendência</span>

## Real vs esperado — detetar perturbações

![Comparação da utilização de serviços reportada com as tendências esperadas: gráficos de linhas por indicador, com áreas sombreadas onde o real se afasta do esperado w:100%](../../../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

- **O que mostra** — um painel por indicador. A **linha preta** é o volume real reportado em cada mês. Por trás dela está o nível **esperado** que o FASTR calculou para essa área — um caminho que já incorpora a tendência de longo prazo *e* o padrão sazonal, por isso «esperado» significa *normal para este lugar, este serviço, esta época do ano*. Onde o real e o esperado se afastam, o intervalo é sombreado: **verde** quando o real corre acima do esperado (um excedente), **vermelho** quando corre abaixo (uma perturbação)
- **Como ler** — em três passagens. **(1) Forma:** siga a linha preta para a trajetória geral — a subir, plana, ou a descer ao longo dos anos. **(2) Quebras:** procure manchas sombreadas; cada uma é um período em que a realidade deixou o caminho esperado, e quanto **maior e mais longa** a mancha, mais grave — um bloco vermelho fundo ao longo de vários meses é uma perturbação sustentada, uma faixa fina é menor. **(3) Entre indicadores:** se aparecer vermelho nos *mesmos* meses em vários painéis, algo atingiu o sistema todo (uma greve, uma rutura de stock, um choque); vermelho num só painel aponta para uma causa específica desse serviço

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Resultado 1 · a tendência (continuação)</span>

- **Atenção a** — um único mês estranho é geralmente ruído; espere por uma série sustentada antes de agir. Verde não é automaticamente bom (pode ser uma campanha de recuperação ou dupla contagem) e vermelho não é automaticamente mau — ambos merecem um «porquê?». Confronte as manchas vermelhas com eventos conhecidos (cortes de financiamento, eleições, vagas epidémicas) para passar de «algo mudou» a «foi isto que o mudou»

<div class="callout-footer">Exemplo trabalhado — no painel da <strong>4.ª visita pré-natal</strong>, o bloco verde de 2020–2021 é um longo período em que as visitas correram acima da linha esperada. As pequenas marcas vermelhas perto de 2019 são quebras curtas e pontuais — não uma perturbação sustentada.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Resultado 2 · a magnitude</span>

## Variação interanual — quanto se moveu

![Volume de serviços por ano e variação interanual: barras por indicador por ano, coloridas para grandes saltos ou quedas w:100%](../../../resources/default_outputs/Module3_1_Change_in_service_volume.png)

- **O que mostra** — o **volume anual total** de cada indicador em barras ao longo dos anos, com a variação interanual rotulada. Uma barra fica **verde** quando o volume subiu mais de 10% face ao ano anterior, **vermelha** quando caiu mais de 10%, e fica cinzenta quando se manteve mais ou menos estável
- **Como ler** — este é o companheiro a vista de pássaro do gráfico de tendência: aquele mostra a temporização *dentro do ano*, este mostra a magnitude *entre anos*. Leia ao longo de uma linha para ver se um serviço está a crescer, a encolher ou estável, e leia a % rotulada em qualquer barra colorida para dimensionar a variação. Uma **barra vermelha no ano mais recente** é a que exige ação — o serviço terminou o período materialmente abaixo de onde começou
- **Porque pode confiar** — é construída sobre os dados ajustados, por isso uma barra vermelha é uma queda real de serviços, não um artefacto de um mês em falta ou de um pico removido

<div class="callout-footer">Exemplo trabalhado — <strong>a 1.ª visita pré-natal termina 2025 em −13,6%</strong> (vermelho): acabou o período bem abaixo do ano anterior. Uma barra verde anterior (+19,5%) foi uma recuperação; o vermelho recente é o que exige ação. Em conjunto, o gráfico de tendência mostra <em>quando e onde</em> os serviços se afastaram da expectativa, e este mostra <em>quanto</em> se moveram.</div>
