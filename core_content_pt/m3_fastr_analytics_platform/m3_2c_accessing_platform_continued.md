---
marp: true
theme: fastr
paginate: true
---

## Produtos, pastas e âmbitos

<style scoped>
.container { display: flex; gap: 1rem; }
.container .img-col { flex: 2; }
.container .img-col img { width: 100%; height: auto; }
.container .text-col { flex: 1; font-size: 0.85em; }
</style>

<div class="container">
<div class="img-col">

![Produtos, pastas e âmbitos dentro da instância](../../resources/diagrams_pt/products_folders_scopes.svg)

</div>
<div class="text-col">

Uma única página **Produtos** para o país: todas as visualizações, apresentações e relatórios, em **pastas**.

Cada produto lê um **pacote de resultados** (que cálculo) através de um **âmbito** (que parte dos dados).

**Questões-chave ao configurar:**

- Que pacote está fixado?
- De que âmbitos a equipa precisa?
- Quem pode abrir ou editar o quê?

</div>
</div>
