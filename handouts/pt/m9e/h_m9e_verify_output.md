---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Relatório de perturbações"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Criar com IA</span> <span class="arrow">→</span> <span class="step current">Verificar o resultado</span> <span class="arrow">→</span> <span class="step">Refinar</span> <span class="arrow">→</span> <span class="step">Revisão por pares</span></div>

# Verificar o resultado da IA

<p class="meta-line"><strong>Atividade</strong> · <strong>Relatório de perturbações</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Porque é importante</p>

O Assistente de IA pode gerar um relatório de perturbações completo em 5–10 minutos. **É você** que o valida. A IA pode soar confiante e ainda assim estar errada — num número, no nome de uma região, num agrupamento de indicadores, numa comparação.

<p class="sb-label">A regra central</p>

Cada afirmação do relatório tem de ser verificável contra o gráfico ou a tabela subjacente. Se não conseguir rastrear uma frase até aos dados, sinalize-a.

</aside>
<div class="p1-main">

## Duas passagens para verificar

A verificação tem duas passagens, e precisa de **ambas**:

1. **Passagem 1 — Auto-revisão da IA.** Corra o **Prompt 5: Review slide deck** para a IA verificar o seu próprio resultado contra os dados.
2. **Passagem 2 — Revisão da equipa.** A IA não apanha tudo. A equipa percorre a lista de verificação manual abaixo.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Passagem 1 — Correr a revisão da IA (Prompt 5)

Depois de o relatório estar gerado, abra a biblioteca de prompts e corra o **Prompt 5: Review slide deck**. A IA percorre todos os diapositivos numa só passagem e verifica seis coisas:

| # | O que o Prompt 5 verifica |
|---|----------------------|
| 1 | **Exatidão dos dados** — cada número no texto bate certo com os dados; estatísticas não verificáveis ficam marcadas `[UNVERIFIED]` |
| 2 | **Nomes e direção dos indicadores** — os nomes batem certo com os rótulos da plataforma; serviço a subir = bom, mortalidade a subir = mau, sem trocas |
| 3 | **Siglas e metodologia** — qualquer expansão de sigla ou descrição de metodologia é verificada contra a documentação oficial |
| 4 | **Linguagem e enquadramento** — sem afirmações causais, hedging adequado, sem sobregeneralização |
| 5 | **Consistência entre diapositivos** — o mesmo indicador mostra o mesmo valor em todo o lado; nomes e períodos consistentes |
| 6 | **Contagem de palavras** — cada bloco de texto dentro do intervalo-alvo |

**O que recebe de volta:** um resumo — *«[X] diapositivos revistos, [Y] problemas em [Z] diapositivos»* — com uma correção sugerida por problema. Você escolhe: corrigir tudo automaticamente, rever um a um, ou terminar.

> A Passagem 1 apanha erros mecânicos. Mas só verifica a apresentação contra si própria e contra os dados. É o início da verificação, não o fim.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Passagem 2 — Revisão da equipa

O Prompt 5 não pode saber coisas que só a sua equipa de país sabe. **Não consegue dizer:**

- se os **agrupamentos de indicadores fazem sentido** para o seu país
- se uma «perturbação» é **real ou explicada** por um acontecimento local conhecido (uma greve, uma campanha, uma rutura de stock)
- se o **«e então» é realista** e acionável no seu contexto
- se falta **contexto local**

Percorram a lista abaixo **em equipa**, com os gráficos de origem abertos na plataforma ao lado do relatório.

**Antes de começar a revisão de equipa:**

- ☐ O Prompt 5 foi corrido e os problemas sinalizados foram corrigidos
- ☐ A sua equipa de país está reunida — isto é uma atividade de equipa, não individual
- ☐ Os gráficos de origem estão abertos na plataforma, ao lado do relatório

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Verificações gerais — todos os relatórios

| ☐ | Verificação | Notas |
|---|-------|-------|
| ☐ | **Todos os diapositivos gerados** — nenhum em falta, nenhum meio-renderizado |  |
| ☐ | O **nome do país** está correto e consistente em todos os diapositivos |  |
| ☐ | O **período de análise** está correto em todos os gráficos |  |
| ☐ | **Sem texto de marcador** esquecido — ex.: `[COUNTRY]`, `[UNVERIFIED]` |  |
| ☐ | A **última página** (link FASTR / diapositivo de fecho) é mesmo o último diapositivo |  |

## Relatório de perturbações base — Prompt 1

| ☐ | Verificação | Notas |
|---|-------|-------|
| ☐ | **Capa** — país, subtítulo e data todos corretos |  |
| ☐ | Os **agrupamentos de indicadores batem certo com o que confirmou** na conversa |  |
| ☐ | **Cada grupo tem o seu diapositivo de análise** — nenhum fundido, nenhum perdido |  |
| ☐ | **Os gráficos carregam e mostram dados** — sem gráficos em branco ou partidos |  |
| ☐ | Cada **interpretação bate certo com o gráfico** desse diapositivo |  |
| ☐ | **Os títulos são achados, não só nomes de indicadores** — «CPN1 caiu 12% no Norte», não «Resultados de CPN1» |  |
| ☐ | O **«e então» faz sentido** para o seu país? É acionável? |  |

> **Se uma verificação falhar:** para marcadores ou estrutura, peça à IA que regenere o diapositivo indicado. Para uma interpretação errada: *«O diapositivo 6 diz que os volumes subiram — o gráfico mostra uma queda. Verifica de novo.»*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Leitura final da equipa

Quando todas as secções passarem, **leiam cada interpretação em conjunto, como equipa** — cada membro a tomar uma secção, os restantes a acompanhar. Atenção a:

- **Algo que se lê mal** — um número demasiado redondo, uma tendência que não está no gráfico
- **Algo exagerado** — «dramático», «alarmante», «sem precedentes» sem provas
- **Algo genérico** — frases que poderiam aplicar-se a qualquer país, não ao seu
- **Contexto local em falta** — a greve, o problema na cadeia de abastecimento, a nova política. Você acrescenta-o.

Se alguém na equipa hesitar numa frase, **sinalize-a**. A hesitação costuma significar que algo está errado.

## Validação

Antes de passar à fase de refinamento, a equipa tem de conseguir dizer:

> *«O Prompt 5 foi corrido e os seus problemas corrigidos. Cada número é verificável. Cada interpretação reflete o que sabemos. Nenhuma frase é genérica. Nenhuma afirmação fica sem apoio.»*

## A seguir

**Refinar** — aplique a sua formatação e, se for útil, acrescente secções regionais ou de qualidade dos dados com o Prompt 2 e o Prompt 3.
