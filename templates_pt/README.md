# templates/ + templates_fr/

Modelos de diapositivos de workshops - os diapositivos estruturais (capas, intervalos, agenda,
expectativas, prompts de webinar, etc.) que o construtor de deck injeta em torno do
conteúdo do módulo.

## O que é isto

Ficheiros de origem de diapositivos reutilizáveis que o construtor de apresentações extrai ao montar um
deck de workshop. Cada ficheiro é um único diapositivo Marp com tokens `{{PLACEHOLDER}}`
que o construtor substitui (nome do seminário, datas, local, durações, etc.).
EN vive em `templates/`, FR em `templates_fr/` - espelham ficheiro a ficheiro
(28 ficheiros cada).

## Layout (selecionado)

```
templates/
├── title_slide.md              # workshop cover (title-cover class)
├── section_divider.md          # mid-deck section cover
├── day_title.md  day_recap.md  day_end.md
├── breaks.md  tea_break.md  lunch_break.md   # break design (warm field, big duration)
├── closing.md
├── activity_divider.md         # activity-pointer class (replaced by handout pointer)
├── webinar_*.md                # 8 webinar prompt slides (poll, qa, icebreaker, …)
├── meeting_norms.md  expectations_slide.md  objectives_slide.md
└── …
```

o `templates_fr/` reflecte os mesmos 28 nomes de ficheiros com conteúdo francês.

## Como adicionar/editar

1. Escolha a classe do diapositivo com `<!-- _class: ... -->`. Classes comuns:
   `title-cover`, `section-cover`, `break`, `centered`, `compact`,
   `activity-pointer`, `two-panel`, `dense-table`.
2. Utilizar `{{TITLE}}`, `{{SUBTITLE}}`, `{{COUNTRY}}`, `{{LOCATION}}`, `{{DATE}}`,
   `{{DAY_TITLE}}`, `{{ACTIVITY_NAME}}`, `{{DURATION}}`,
   `{{TEA_RESUME_TIME}}`, `{{LUNCH_RESUME_TIME}}`, `{{LAST_DAY}}` para
   variáveis que o construtor substitui.
3. Os caminhos de imagem de um modelo são resolvidos como `../../resources/<dir>/<file>`.
4. **Espelhar todas as alterações para `templates_fr/`** - mesmo nome de ficheiro, texto traduzido.
5. Teste exportando uma oficina a partir da aplicação web ou
   `npx tsx web-app/scripts/build_deck.mts <id> pdf`.

## Gotchas

- As coberturas (`title-cover` / `section-cover` / `break` / `lead`) suprimem a plataforma
  cromo (kicker, locator, footer) - não os espere nesses diapositivos.
- Os modelos de pausas utilizam o novo design `_class: break` (campo quente + grande duração).
  O construtor de deck também gera pausas dinamicamente a partir da configuração -
  `tea_break.md` / `lunch_break.md` / `breaks.md` são para inserções manuais na biblioteca.
- Os 8 diapositivos do webinar utilizam `_class: centered`. Não volte a usar o antigo
  classe `engagement` sem estilo.
- o `title_slide.md` tem o logótipo `<div>`s absolutamente posicionado - toque com cuidado
  e voltar a exportar o PDF + PPTX para verificar.
