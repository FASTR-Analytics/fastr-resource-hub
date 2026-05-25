---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Relatórios FASTR padrão"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Verificar um relatório gerado por IA

<p class="meta-line"><strong>Referência</strong> · <strong>Relatórios FASTR padrão</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Porque é importante</p>

O Assistente de IA pode gerar um relatório de perturbações completo em 5–10 minutos. **É você** que o valida. A IA pode soar confiante e ainda assim estar errada — num número, no nome de uma região, num agrupamento de indicadores, numa comparação.

<p class="sb-label">A regra central</p>

Cada afirmação do relatório tem de ser verificável contra o gráfico ou a tabela subjacente. Se não conseguir rastrear uma frase até aos dados, sinalize-a. A verificação é o que faz **antes** de o relatório sair da equipa.

</aside>
<div class="p1-main">

## Como se constrói um relatório FASTR — os prompts

O construtor de relatórios usa um conjunto de prompts da biblioteca de prompts:

- **Prompt 1 — FASTR disruption report.** O relatório base. A IA pede país / período / subtítulo, encontra os indicadores disponíveis, propõe agrupamentos, você confirma, e constrói o relatório diapositivo a diapositivo.
- **Prompt 2 — Regional disruption analysis.** *Opcional.* Adiciona um diapositivo por área subnacional.
- **Prompt 3 — Data quality assessment.** *Opcional.* Adiciona um anexo sobre completude, valores atípicos, consistência.
- **Prompt 5 — Review slide deck.** O **prompt de verificação**. Corra-o depois de o relatório estar gerado — verifica toda a apresentação por si.

## Duas passagens para verificar

A verificação tem duas passagens, e precisa de **ambas**:

1. **Passagem 1 — Auto-revisão da IA.** Corra o **Prompt 5** para a IA verificar o seu próprio resultado contra os dados.
2. **Passagem 2 — Revisão da equipa.** A IA não apanha tudo. A equipa percorre a lista manual.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Passagem 1 — Correr a revisão da IA (Prompt 5)

Depois de o Prompt 1 (e algum dos Prompt 2 / 3) terminar de gerar, abra a biblioteca de prompts e corra o **Prompt 5: Review slide deck**. A IA percorre **todos os diapositivos numa só passagem** e verifica seis coisas:

| # | O que o Prompt 5 verifica |
|---|----------------------|
| 1 | **Exatidão dos dados** — cada número no texto bate certo com os dados subjacentes; estatísticas não verificáveis ficam marcadas `[UNVERIFIED]`; atenção a fabricação dissimulada («aproximadamente X» a esconder um valor inventado) |
| 2 | **Nomes e direção dos indicadores** — os nomes batem certo com os rótulos exatos da plataforma; indicadores de serviço a subir = bom, indicadores de mortalidade a subir = mau, sem trocas |
| 3 | **Siglas e metodologia** — qualquer expansão de sigla ou descrição de metodologia é verificada contra a documentação oficial |
| 4 | **Linguagem e enquadramento** — sem afirmações causais, hedging adequado, sem sobregeneralização, termos de saúde corretos |
| 5 | **Consistência entre diapositivos** — o mesmo indicador mostra o mesmo valor em todo o lado; nomes e períodos consistentes |
| 6 | **Contagem de palavras** — cada bloco de texto dentro do intervalo-alvo |

**O que recebe de volta:** um resumo — *«[X] diapositivos revistos, [Y] problemas em [Z] diapositivos»* — com uma correção sugerida por problema. Você escolhe: corrigir tudo automaticamente, rever um a um, ou terminar.

> **A Passagem 1 é rápida e apanha erros mecânicos.** Mas só verifica a apresentação contra si própria e contra os dados. Não é o fim da verificação — é o início.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Passagem 2 — Revisão da equipa

O Prompt 5 não pode saber coisas que só a sua equipa de país sabe. **Não consegue dizer:**

- se os **agrupamentos de indicadores fazem sentido** para o seu país
- se uma «perturbação» é **real ou explicada** por um acontecimento local conhecido (uma greve, uma campanha, uma rutura de stock)
- se o **«e então» é realista** e acionável no seu contexto
- se falta **contexto local**

É para isso que serve a lista manual abaixo. Percorram-na **em equipa**, com os gráficos de origem abertos na plataforma ao lado do relatório.

**Antes de começar a revisão de equipa:**

- ☐ O Prompt 5 foi corrido e os problemas sinalizados foram corrigidos
- ☐ A sua equipa de país está reunida — isto é uma atividade de equipa, não individual
- ☐ Os gráficos de origem estão abertos na plataforma, ao lado do relatório

> Verifiquem a **Secção A + Secção B** em todos os relatórios. Acrescentem a **Secção C / D** apenas se correram o Prompt 2 / Prompt 3.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Secção A — Verificações gerais (todos os relatórios)

| ☐ | Verificação | Notas |
|---|-------|-------|
| ☐ | **Todos os diapositivos gerados** — nenhum em falta, nenhum meio-renderizado |  |
| ☐ | O **nome do país** está correto e consistente em todos os diapositivos |  |
| ☐ | O **período de análise** está correto em todos os gráficos |  |
| ☐ | **Sem texto de marcador** esquecido — ex.: `[COUNTRY]`, `[VERIFY]`, `[UNVERIFIED]` |  |
| ☐ | A **última página** (link FASTR / diapositivo de fecho) é mesmo o último diapositivo |  |

## Secção B — Prompt 1: relatório de perturbações base

| ☐ | Verificação | Notas |
|---|-------|-------|
| ☐ | **Capa** — país, subtítulo e data todos corretos |  |
| ☐ | Os **agrupamentos de indicadores batem certo com o que confirmou** na conversa |  |
| ☐ | **Cada grupo tem o seu diapositivo de análise** — nenhum fundido, nenhum perdido |  |
| ☐ | **Os gráficos carregam e mostram dados** — sem gráficos em branco ou partidos |  |
| ☐ | Cada **interpretação bate certo com o gráfico** desse diapositivo |  |
| ☐ | **Os títulos são analíticos, não só nomes de indicadores** — «CPN1 caiu 12% no Norte», não «Resultados de CPN1» |  |
| ☐ | O **«e então» faz sentido** para o seu país? É acionável? |  |

> **Se uma verificação falhar:** para marcadores ou estrutura, peça à IA que regenere o diapositivo indicado. Para uma interpretação errada: *«O diapositivo 6 diz que os volumes subiram — o gráfico mostra uma queda. Verifica de novo.»*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Secção C — Prompt 2: análise regional de perturbações

*Só se correu o Prompt 2.*

| ☐ | Verificação | Notas |
|---|-------|-------|
| ☐ | O resumo inclui **todas** as áreas subnacionais (conte-as) |  |
| ☐ | **Um diapositivo por área** — nenhum em falta, nenhum duplicado |  |
| ☐ | Nomes das áreas **escritos corretamente** (correspondem à nomenclatura oficial) |  |
| ☐ | Cada interpretação refere a **área certa** |  |
| ☐ | Os gráficos observado-vs-esperado usam a **mesma escala entre diapositivos** |  |
| ☐ | As magnitudes batem certo com o gráfico de origem (sem quedas inflacionadas, sem picos perdidos) |  |

## Secção D — Prompt 3: anexo de qualidade dos dados

*Só se correu o Prompt 3.*

| ☐ | Verificação | Notas |
|---|-------|-------|
| ☐ | O anexo está **numerado corretamente** (Anexo 1 ou 2) |  |
| ☐ | As três dimensões de QD presentes: **completude, valores atípicos, consistência** |  |
| ☐ | O **código de cores é lógico**: verde = bom, vermelho = alerta |  |
| ☐ | Áreas ou indicadores de baixa qualidade são **explicitamente sinalizados** no texto |  |
| ☐ | As pontuações de QD **batem certo com a plataforma** — abra o módulo AQD lado a lado |  |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Leitura final da equipa

Quando todas as secções passarem, **leiam cada interpretação em conjunto, como equipa** — cada membro a tomar uma secção, os restantes a acompanhar. Atenção a:

- **Algo que se lê mal** — um número demasiado redondo, uma tendência que não está no gráfico
- **Algo exagerado** — «dramático», «alarmante», «sem precedentes» sem provas
- **Algo genérico** — frases que poderiam aplicar-se a qualquer país, não ao seu
- **Contexto local em falta** — a greve, o problema na cadeia de abastecimento, a nova política. Você acrescenta-o.

Se alguém na equipa hesitar numa frase, **sinalize-a**. A hesitação costuma significar que algo está errado.

## Validação final

Antes de o relatório sair da equipa, a equipa tem de conseguir dizer:

> *«O Prompt 5 foi corrido e os seus problemas corrigidos. Cada número é verificável. Cada interpretação reflete o que sabemos. Nenhuma frase é genérica. Nenhuma afirmação fica sem apoio.»*

Se ainda não conseguem dizer isto, continuem a iterar.

## A seguir

Quando o relatório passar nas duas passagens de verificação, finalize a formatação (títulos, números de página, logótipos), exporte e dissemine usando o seu plano de ação do país.
