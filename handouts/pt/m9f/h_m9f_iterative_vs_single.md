---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Técnicas de prompting"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Escrever um prompt claro</span> <span class="arrow">→</span> <span class="step done">Explorar</span> <span class="arrow">→</span> <span class="step current">Iterativo vs único</span> <span class="arrow">→</span> <span class="step">Refinar</span> <span class="arrow">→</span> <span class="step">Modelo em PDF</span> <span class="arrow">→</span> <span class="step">Verificar o resultado</span></div>

# Abordagem iterativa vs prompt único

<p class="meta-line"><strong>Atividade</strong> · <strong>Técnicas de prompting</strong> · <strong>~30 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Trabalhou **Escrever um prompt claro** e **Explorar com o Assistente de IA**
- ☐ O Assistente de IA está aberto no projeto do seu país

<p class="sb-label">Porque é importante</p>

Há duas formas válidas de obter um resultado estruturado: construí-lo ao longo de várias mensagens (iterativa) ou condensar tudo num prompt bem estruturado (único). Ambas funcionam — o compromisso é **controlo vs rapidez**.

</aside>
<div class="p1-main">

## Exercício A — Conversa iterativa

Construa um pequeno relatório de qualidade dos dados percorrendo estes quatro prompts **por ordem**. Aguarde a resposta da IA depois de cada um antes de enviar o seguinte:

1. *Podes ajudar-me a perceber a qualidade dos nossos dados de 2024? Gostaria de um resumo de 3 diapositivos para partilhar com a minha equipa.*
2. *Vamos focar a qualidade global, as diferenças regionais e as prioridades de melhoria.*
3. *Que região tem a qualidade dos dados mais fraca? Destaca-a.*
4. *O que devemos fazer quanto a isto? Torna o último diapositivo mais acionável.*

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Exercício B — Prompt único bem estruturado

Agora gere o **mesmo** relatório de 3 diapositivos com um só prompt. Abra uma conversa nova com a IA e cole:

> Constrói um relatório de qualidade dos dados de 3 diapositivos para 2024, cobrindo (1) estado global, (2) comparação regional e (3) recomendações.

## Reflexão

Depois de correr ambos os exercícios, responda:

- Como diferiram os resultados entre o caminho iterativo e o prompt único?
- Qual abordagem foi mais fácil ou natural para *esta* tarefa?
- Onde é que a IA fez suposições que precisaram de esclarecimento?

## Quando usar cada um

| Use o iterativo quando… | Use um prompt único quando… |
|---------------------|---------------------------|
| Não tem a certeza do que quer | Sabe exatamente o que quer |
| Quer reagir ao que a IA produz pelo caminho | Quer que a IA assuma uma estrutura à partida |
| Está a explorar ou a experimentar | Está a produzir algo repetível (ex.: um relatório recorrente) |

Ambas as abordagens usam os mesmos dados e métodos — nenhuma é «melhor» em geral. Adeque a abordagem à tarefa.

> **Regra prática:** recorra à abordagem **iterativa** quando explora uma análise nova ou uma pergunta pontual; recorra à **biblioteca de prompts** (um prompt único estruturado) quando produz um relatório de rotina e recorrente — um relatório trimestral de perturbações, uma análise regional, um anexo de QD.

## A seguir

Avance para **Refinar o seu prompt** para um exercício autónomo de aperto de um único prompt ao longo de três rondas.
