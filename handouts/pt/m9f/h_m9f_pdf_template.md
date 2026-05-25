---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Técnicas de prompting"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Escrever um prompt claro</span> <span class="arrow">→</span> <span class="step done">Explorar</span> <span class="arrow">→</span> <span class="step done">Iterativo vs único</span> <span class="arrow">→</span> <span class="step done">Refinar</span> <span class="arrow">→</span> <span class="step current">Modelo em PDF</span> <span class="arrow">→</span> <span class="step">Verificar o resultado</span></div>

# Usar um relatório anterior como modelo

<p class="meta-line"><strong>Atividade</strong> · <strong>Técnicas de prompting</strong> · <strong>~10 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Trabalhou as atividades de prompting anteriores
- ☐ Tem um relatório anterior (PDF) com que está satisfeito e que gostaria de reproduzir para um novo período

<p class="sb-label">Porque é importante</p>

Por vezes a forma mais fácil de instruir a IA não é descrever o que quer — é **mostrar-lho**. Um relatório anterior permite à IA seguir uma estrutura existente em vez de reinventar o formato.

</aside>
<div class="p1-main">

## Quando usar esta abordagem

- Tem um relatório anterior em que confia e quer replicar
- Quer manter um formato consistente entre períodos
- Não tem um prompt personalizado disponível para este tipo de relatório

<h2 class="step-h"><span class="step-n">1</span><span>Carregar o relatório para os seus Assets</span></h2>

Na página principal, vá a **Assets** → **Upload assets** → selecione o seu PDF.

<h2 class="step-h"><span class="step-n">2</span><span>Incluir o relatório na conversa da IA</span></h2>

Abra uma conversa nova com a IA. Clique no **menu de três pontos** → **Include file** → selecione o relatório que acabou de carregar.

A IA passa a ter o PDF como contexto para tudo nesta conversa.

<h2 class="step-h"><span class="step-n">3</span><span>Pedir à IA que replique a estrutura</span></h2>

Um prompt inicial:

> Usa este relatório como modelo. Cria um relatório semelhante a cobrir [período] para [país/região/âmbito].

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Dicas

> **Verifique, não confie.** Mesmo com um modelo, a IA pode desviar-se — pode simplificar um gráfico, retirar uma secção ou resumir vagamente. Percorra o resultado lado a lado com o modelo antes de partilhar.

> **Guarde os seus «bons» exemplos.** À medida que a sua equipa produz relatórios de que se orgulha, guarde-os nos Assets. Cada um torna-se um modelo que você (ou um colega) pode reutilizar.

## O que pode correr mal

- **A IA não parece «ver» o ficheiro** — confirme que o incluiu na conversa (não só carregou). O menu de três pontos deve mostrar o ficheiro como anexado.
- **O resultado salta secções do modelo** — peça à IA explicitamente: *«Inclui todas as secções do modelo, na mesma ordem.»*
- **O PDF é demasiado grande para carregar** — divida-o por capítulos, ou extraia primeiro as páginas relevantes.

## A seguir

Isto termina o módulo de técnicas de prompting. A partir daqui vai usar estas competências em atividades reais — construir visualizações, apresentações e relatórios de perturbações com a IA como colaboradora.
