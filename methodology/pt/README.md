<!-- AUTO-TRANSLATED from README.md -->
<!-- Add REVIEWED marker after human review to protect from overwrite -->

# methodology/

A única fonte de verdade para o conteúdo da metodologia FASTR. As edições aqui propagam-se
em todos os outros sítios.

## O que é isto

A documentação canónica da metodologia, criada em Markdown. A partir desta pasta:

- O sítio público de documentação em **<https://fastr-analytics.org>** é construído
  a partir de [`FASTR-Analytics/site`](https://github.com/FASTR-Analytics/site), que
  fornece esta pasta via `pnpm sync:methodology` (veja `sync-methodology.ts` em
  esse repositório).
- A biblioteca de **slides** do workshop (`core_content/` e `core_content_fr/`) é
  extraída por `tools/00_extract_slides.py`.
- **A compilação local do MkDocs foi retirada.** O `mkdocs.yml` ainda existe, mas agora
  serve um redireccionamento para fastr-analytics.org (`javascripts/redirect.js` +
  `overrides/main.html`). Não adicione novas funcionalidades ao MkDocs - corrija o conteúdo aqui e
  ele vai para o novo site na próxima sincronização.

Assim, uma alteração aqui flui para duas superfícies activas a jusante - corrige-se uma vez, sai em cascata.

## Layout

```
methodology/
├── 00_introduction.md             # one file per module — slide markers + content
├── 01_identify_questions_indicators.md
├── …
├── 11_user_guide.md
├── disclaimer.md                  # site-level pages
├── index.md
├── mkdocs.yml                     # MkDocs site config
├── javascripts/                   # site enhancements
└── fr/                            # French mirror — same filenames, translated
```

Os limites do slide são marcados com comentários HTML que o extrator lê:

```markdown
<!-- SLIDE:m4_2 -->
## Indicator completeness

…slide content…
<!-- /SLIDE -->
```

O ID do marcador (`m4_2`) torna-se o nome do ficheiro do diapositivo em `core_content/`.

## Como adicionar/editar

1. Editar o ficheiro PT em `methodology/` (a fonte da verdade).
2. Atualizar o espelho FR em `methodology/fr/<same-filename>` - não há
   Inglês no sítio.
3. Executar novamente a extração para que a biblioteca de diapositivos e os metadados se mantenham sincronizados:
   ```bash
   python3 tools/00_extract_slides.py
   python3 tools/00_extract_slides.py --lang fr
   ```
4. Para pré-visualizar a sua edição, faça push e veja o
   [repositório do sítio](https://github.com/FASTR-Analytics/site) seguinte
   `pnpm sync:methodology`, ou execute o site localmente de acordo com o seu README.

## Comandos chave

```bash
python3 tools/00_extract_slides.py [--lang fr]     # re-extract slides
python3 tools/validate_content.py                  # drift guard
```

(A pré-visualização da documentação local está agora no [repositório do site](https://github.com/FASTR-Analytics/site) - veja o seu README)

## Gotchas

- **Nunca edite manualmente o `core_content/`** - ele é regenerado a partir daqui. Corrija aqui.
- o `--prune` no extrator é destrutivo quando o `core_content/` se afastou
  do `methodology/`. Inspecionar o diff antes de fazer o commit.
- Renomear um `<!-- SLIDE:xxx -->` id renomeia o arquivo extraído e quebra
  `_meta.yaml`/deck references - coordene cuidadosamente.
- O sítio de marketing vende esta pasta. Renomear ficheiros ou diretórios sem
  sem coordenar com o `sync-methodology.ts` irá quebrar o sítio público.
- O conteúdo FR é a tradução efectiva - não deixe marcadores de posição em inglês em
  `methodology/fr/`.
- **As imagens incorporadas nos diapositivos necessitam de uma restrição de altura `h:`** - O Marp dimensiona as imagens
  imagens sem restrições à largura do diapositivo, o que normalmente corta a parte inferior da
  tela de 1280×720. Utilize a sintaxe `![alt h:480](path.svg)`. Veja
  [`help and instructions/05_style_guide.md`](../help%20and%20instructions/05_style_guide.md#images-in-slides--the-h-constraint)
  para as diretrizes de altura por esquema.
