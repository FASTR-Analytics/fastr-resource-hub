---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Visualizações e interpretação"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Ler uma visualização</span> <span class="arrow">→</span> <span class="step done">Construir manualmente</span> <span class="arrow">→</span> <span class="step current">Construir com IA</span> <span class="arrow">→</span> <span class="step">Escrever interpretação</span> <span class="arrow">→</span> <span class="step">Interpretação com IA</span> <span class="arrow">→</span> <span class="step">Detetar perturbação</span></div>

# Construir uma visualização com o Assistente de IA

<p class="meta-line"><strong>Atividade</strong> · <strong>Visualizações e interpretação</strong> · <strong>~15 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Já construiu pelo menos um gráfico manualmente (ficha anterior)
- ☐ Tem sessão iniciada e a sua pasta aberta
- ☐ Sabe que indicador quer representar (CPN1, Penta3, …)

</aside>
<div class="p1-main">

## O que vai fazer

Pedir ao Assistente de IA que crie o mesmo tipo de gráfico que acabou de construir manualmente — mas escrevendo um pedido em linguagem comum. Mesmo resultado, caminho diferente.

<h2 class="step-h"><span class="step-n">1</span><span>Abrir o Assistente de IA</span></h2>

O painel de conversa da IA fica do lado direito do separador **Visualizations**. Escreva um pedido curto, como:

> *«Mostra-me um gráfico de série temporal das visitas de CPN1 nos últimos 12 meses, usando dados ajustados aos valores atípicos.»*

A IA devolve um gráfico no painel com três botões por baixo — **ecrã inteiro**, **Save as new viz**, **Add to a deck** — e um texto curto a explicar o que construiu e o que poderia mudar a seguir.

> **Seja específico quanto ao ajustamento.** *«Dados ajustados»* sozinho é ambíguo — a métrica expõe quatro versões: sem ajustamento, valores atípicos só, completude só, ou ambos. Diga qual no pedido, ou a IA escolhe por si (normalmente valores atípicos só).

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Rever o que a IA devolve</span></h2>

O gráfico aparece no topo do painel; o texto por baixo nomeia o indicador, o período e qual o ajustamento usado. **Confronte-o com o que pediu:**

- Indicador certo? Período certo?
- Gráfico de linhas para uma tendência, ou outra coisa? Faz sentido?
- Qual o ajustamento? O texto nomeia-o explicitamente (p. ex. *ajustado aos valores atípicos*).

Se algo estiver errado, diga-o em linguagem comum na mesma conversa — *«Usa antes os dados brutos»*, *«Muda para gráfico de barras»*, *«Cobre só os últimos 6 meses»*.

<h2 class="step-h"><span class="step-n">3</span><span>Iterar</span></h2>

A primeira resposta raramente entrega o gráfico exato que quer. Refine em pequenos passos:

- *«Desagrega por região.»*
- *«Acrescenta Penta3 no mesmo eixo.»*
- *«Mostra só os últimos 6 meses.»*

Cada instrução é um pequeno passo. A IA também propõe ações seguintes no fim de cada resposta — use-as ou ignore-as.

<h2 class="step-h"><span class="step-n">4</span><span>Guardar</span></h2>

Quando gostar do que vê, clique em **Save as new viz** por baixo do gráfico e coloque-o na sua pasta. O botão ao lado **Add to a deck** faz as duas coisas de uma vez se já tiver uma apresentação aberta.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Experimente com três indicadores

Repita o mesmo fluxo com três indicadores diferentes — escolha de programas distintos (CPN, vacinação, parto). Vai ganhar sensibilidade para como a IA interpreta pedidos curtos.

## Manual vs IA — quando usar cada um

- **Manual** quando sabe exatamente o que quer e clicar é mais rápido do que escrever.
- **IA** quando quer explorar — *«mostra-me algo útil sobre X»* — ou quando não se lembra dos nomes exatos dos filtros.

> A IA é um acelerador, não um substituto. É você que decide se o gráfico responde à sua pergunta.

## A seguir

A próxima ficha é sobre **escrever a interpretação** — o texto que acompanha o gráfico no diapositivo. Use o quadro de seis passos da referência *Ler uma visualização*.

> 🔎 **Confirme na sua interface atual**: os nomes dos botões e a disposição da conversa da IA podem diferir ligeiramente. O fluxo (pedir → rever → iterar → guardar) é o mesmo.
