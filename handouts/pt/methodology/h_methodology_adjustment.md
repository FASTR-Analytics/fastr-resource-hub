---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Recapitulativo de metodologia · Ajustamento da qualidade dos dados"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Recapitulativo de metodologia · Módulo M2</span>

# Ajustamento da qualidade dos dados

<p class="meta-line"><strong>O que o módulo faz</strong> · <strong>Como ler os seus resultados</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">O que faz</p>

Este módulo **repara** os problemas que o anterior encontrou. Preenche os meses em falta e substitui os picos atípicos, para que as tendências e a cobertura não sejam distorcidas por alguns números maus.

<p class="sb-label">O que não faz</p>

Nunca inventa uma tendência. Cada substituição vem do **próprio histórico** da unidade, e os dados que passaram nas verificações de qualidade ficam exatamente como foram reportados.

<p class="sb-label">Quatro versões</p>

Guarda os dados de quatro formas — **não ajustado**, **valores atípicos corrigidos**, **lacunas preenchidas** e **ambos** — para que consiga sempre ver exatamente o que mudou.

</aside>
<div class="p1-main">

## Como funciona a correção

Quando o módulo anterior sinaliza um mês como **valor atípico** ou **em falta**, o FASTR substitui apenas esse valor — usando os **próprios meses circundantes** da unidade, nunca números emprestados de outra unidade. Percorre uma escada curta e toma a primeira opção que o histórico da unidade permitir:

1. **Os meses mesmo à volta** — a média dos meses de cada lado do sinalizado. Este é o caso normal: o próprio nível da unidade nesse momento
2. **Se o mês sinalizado estiver mesmo no início ou no fim dos registos** — não há meses suficientes em *ambos* os lados, por isso o FASTR usa o lado que tiver dados: os **6 meses logo a seguir** (quando a lacuna está perto do início) ou os **6 logo antes** (quando está perto do fim)
3. **Apenas para um valor atípico — o mesmo mês um ano antes** — para serviços sazonais, isto compara o semelhante com o semelhante (um dezembro com um dezembro)
4. **Se nenhum desses existir** — a **média geral** da unidade para esse indicador

Os meses que passaram nas verificações de qualidade ficam exatamente como foram reportados, por isso a forma real da atividade é preservada.

**Alguns indicadores nunca são ajustados:** óbitos e nados-mortos (cada caso importa e não deve ser suavizado), e indicadores de muito baixo volume — os que nunca chegam a 100 num mês, onde há sinal demasiado escasso para estimar. Estes mantêm os valores em bruto.

<div class="callout-footer">O ajustamento preenche e suaviza usando o próprio histórico de cada unidade — nunca pede emprestado a outras unidades e nunca inventa uma tendência.</div>

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">O que a correção faz</span>

## Um pico, substituído — a tendência mantida

![Antes e depois: um único pico atípico é substituído pela média dos meses próximos, e a tendência subjacente é preservada w:100%](../../../resources/diagrams/why_adjust_outliers.svg)

Cada valor sinalizado é trocado pelo próprio nível normal da unidade, por isso o pico desaparece mas a forma real da atividade mantém-se intacta.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">O resultado</span>

## Quanto é que os dados mudaram?

![Variação percentual do volume devido ao ajustamento de valores atípicos: uma tabela de distritos por indicador, cada célula colorida de verde, amarelo ou vermelho w:100%](../../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

- **O que é cada célula** — escolha um distrito (uma linha) e um indicador (uma coluna). O número é quanto o total desse indicador **mudou** depois de removidos os picos suspeitos. 0% = nada precisou de correção; um número grande = grandes picos foram retirados
- **Como ler** — **verde = os dados em bruto já estavam limpos; vermelho = precisaram de muita correção.** Uma célula vermelha é um aviso de que o total *em bruto* ali estava inflacionado e teria exagerado a atividade

<div class="callout-footer">Exemplo trabalhado — <strong>Distrito de Karene → Planeamento familiar (longa duração): 5,7%, vermelho</strong> significa que corrigir os valores atípicos cortou o total desse indicador em cerca de 6% ali; sem a correção, teria contabilizado em excesso esses serviços. Uma correção grande não é uma falha — é sinal de que os dados em bruto o teriam induzido em erro, e agora não o farão.</div>

A plataforma também produz esta tabela para **lacunas preenchidas** e para **ambas as correções juntas** — compare-as para ver se foram os picos ou os meses em falta que mais pesaram numa área.
