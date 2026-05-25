---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Técnicas de prompting"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Escrever um prompt claro</span> <span class="arrow">→</span> <span class="step done">Explorar</span> <span class="arrow">→</span> <span class="step done">Iterativo vs único</span> <span class="arrow">→</span> <span class="step done">Refinar</span> <span class="arrow">→</span> <span class="step done">Modelo em PDF</span> <span class="arrow">→</span> <span class="step current">Verificar o resultado</span></div>

# Verificar o resultado

<p class="meta-line"><strong>Atividade</strong> · <strong>Técnicas de prompting</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Antes de começar</p>

- ☐ Tem um rascunho gerado pela IA das atividades anteriores (ou um fornecido pelo facilitador)
- ☐ Sabe com que conjunto de dados ou documento a IA trabalhou
- ☐ Tem ~20 minutos para o fazer bem — não se apresse

<p class="sb-label">Porque é importante</p>

A IA é uma escritora fluente, não uma verificadora de factos. Coloque o resultado num relatório sem verificar e fica responsável por qualquer número inventado. Isto dá-lhe uma forma repetível de verificar antes de enviar.

</aside>
<div class="p1-main">

<h2 class="step-h"><span class="step-n">1</span><span>Ler uma vez, marcar as afirmações (~5 min)</span></h2>

Leia o rascunho da IA devagar. À medida que avança, **sublinhe ou destaque cada afirmação factual** — tudo o que possa estar errado:

- Números específicos (percentagens, contagens, datas)
- Nomes de organizações, programas ou locais
- Afirmações de causa e efeito («X causou Y», «por causa de Z…»)
- Citações ou paráfrases atribuídas a uma fonte

Ainda não tente verificar. Apenas marque.

<h2 class="step-h"><span class="step-n">2</span><span>Ordenar por risco (~3 min)</span></h2>

Para cada afirmação marcada, atribua um nível de risco:

| Risco | Como se parece | O que fazer |
|------|---------------------|------------|
| **Alto** | Uma estatística, uma causa-efeito, a recomendação central do diapositivo | Verificar manualmente contra os dados ou a fonte |
| **Médio** | Uma afirmação geral ligada a uma fonte específica que carregou | Verificar com a IA: peça-lhe que cite a fonte |
| **Baixo** | Um facto bem conhecido, ou algo apoiado por várias fontes em que confia | Verificar por amostragem se tiver tempo |

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">3</span><span>Verificar as afirmações de alto risco (~7 min)</span></h2>

Escolha as duas ou três afirmações de alto risco mais importantes e verifique-as você mesmo:

- **Números:** abra os dados com que a IA trabalhou. O número bate certo exatamente?
- **Causa-efeito:** os dados apoiam mesmo a afirmação, ou a IA insinuou algo que os dados não mostram?
- **Fontes:** se a IA citou um documento, abra-o. O documento diz mesmo isso?

**Sinais de alerta do Guia de Escrita com IA:**

- Números redondos como *«aproximadamente 1 milhão»* — podem ser inventados
- Valores precisos sem fonte — provavelmente fabricados
- Números que parecem plausíveis mas que não consegue rastrear

<h2 class="step-h"><span class="step-n">4</span><span>Usar a IA para verificar as de risco médio (~3 min)</span></h2>

Cole uma afirmação de risco médio de volta no Assistente de IA com este prompt:

> *«Quero usar a seguinte afirmação num relatório: [afirmação]. Os dados ou o documento que te dei apoiam isto? Cita a passagem específica.»*

Se a IA não conseguir citar uma fonte, retire a afirmação ou reescreva-a.

<h2 class="step-h"><span class="step-n">5</span><span>Verificação final de consistência (~2 min)</span></h2>

Uma vista rápida antes de dar por terminado:

- ☐ Sem contradições entre secções (os números do resumo batem certo com os do corpo)
- ☐ Siglas definidas na primeira utilização, depois usadas de forma consistente
- ☐ Uma convenção de escrita em todo o documento (ex.: «profissionais de saúde» sempre, sem misturar com «trabalhadores de saúde»)
- ☐ Cada número que manteve pode ser rastreado até à sua fonte

## Com o que deve ficar

Um rascunho com que se sentiria confortável a pôr o seu nome. **Se não pusesse o seu nome, não está terminado.**
