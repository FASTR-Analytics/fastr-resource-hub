---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Configuração da instância · Facilitador"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Guia do facilitador — Configuração da instância

<p class="meta-line"><strong>Guia do facilitador</strong> · <strong>Configuração da instância</strong></p>

## Sobre estas atividades

A Configuração da instância é a sequência prática de configuração — os participantes ligam os dados DHIS2 de um país a uma instância FASTR. As cinco atividades correm por uma **ordem estrita**: cada passo depende do anterior, e os erros propagam-se — um mapeamento de indicador errado no passo 3 reaparece como um número errado no passo 5.

**Cinco fichas**, por ordem. **~90 min** de tempo dos participantes. A maioria das falhas aqui são erros de credenciais ou de mapeamento, não conceptuais.

## Como conduzir

- Esta é uma **sequência guiada** — mantenha a sala em conjunto, passo a passo. Não deixe ninguém avançar à frente.
- As fichas são procedimentos detalhados. Demonstre os primeiros cliques de cada passo, depois deixe os participantes seguir a ficha ao seu ritmo.
- Tenha as **credenciais DHIS2** e a **Lista de verificação de preparação de dados** de cada equipa confirmadas *antes* de começar — falta de acesso bloqueia a sala inteira.
- Se alguém ficar para trás, **pare a sala**. Os passos seguintes não funcionam sem os anteriores concluídos.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## As atividades

### 1. Antes de começar

**Orientação · ~5 min**

**O que é** — uma página de orientação que apresenta a sequência de quatro passos e explica como são tratadas as credenciais DHIS2.
**O que a ficha cobre** — os participantes reúnem o que precisam (Lista de verificação de preparação de dados preenchida, URL / nome de utilizador / palavra-passe do DHIS2, um navegador estável); não há um passo de «ligação» separado — as credenciais introduzem-se na primeira importação.
**Atenção a** — diga aos participantes para marcarem **«Save credentials for this session»** no primeiro pedido, ou serão questionados de novo em cada importação seguinte.

### 2. Importar a estrutura de unidades

**Procedimento de configuração · ~20 min**

**O que é** — um procedimento passo a passo para extrair a hierarquia administrativa do país para o FASTR.
**O que a ficha cobre** — Data → Structure & maps → Admin areas → import directly from DHIS2 → selecionar o nível **Facility** → finalizar até o mosaico Structure & maps ficar verde.
**Atenção a** — uma lista de unidades vazia ou uma hierarquia com aspeto errado significa normalmente que se escolheu o nível DHIS2 errado, ou que o utilizador não tem acesso de leitura às unidades organizacionais. As falhas de autenticação são tipicamente um URL malformado.

### 3. Importar e mapear indicadores

**Procedimento de configuração · ~30 min**

**O que é** — um procedimento em três fases para definir e mapear indicadores. O passo mais longo e mais sujeito a erros.
**O que a ficha cobre** — criar indicadores comuns, importar os nomes dos indicadores DHIS2 do país, depois mapear cada indicador DHIS2 ao seu correspondente comum.
**Atenção a** — um Common ID rejeitado significa que se usou um espaço, acento ou carácter especial: insista apenas em letras minúsculas e sublinhados. Cada indicador DHIS2 mapeia-se a **exatamente um** indicador comum.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 4. Importar dados do HMIS

**Procedimento de configuração · ~25 min**

**O que é** — a maior operação de dados da configuração: extrair os valores de dados reais do HMIS do DHIS2.
**O que a ficha cobre** — selecionar indicadores e um intervalo de tempo, definir o tratamento de erros para **«Abort the entire import attempt»**, extrair, rever o resumo da importação, depois integrar e finalizar.
**Atenção a** — extrações grandes podem bloquear o navegador. Avise os participantes para não fecharem o separador a meio da extração; para países grandes, restrinja os indicadores / intervalo de tempo e importe por lotes.

### 5. Verificar e explorar a sua configuração

**Procedimento de configuração · ~10 min**

**O que é** — um passo de verificação para conferir pontualmente os dados importados e conhecer o explorador de gráficos.
**O que a ficha cobre** — ver os indicadores como séries temporais, ativar/desativar indicadores, ajustar a escala do eixo Y, conferir um valor conhecido de uma unidade contra o DHIS2, e rever o histórico de importações.
**Atenção a** — valores planos ou a zero significam normalmente que o intervalo de períodos não coincide com os dados do DHIS2. Uma verificação pontual que não bate certo deve-se quase sempre a **mapeamento de indicadores incompleto no passo 3** — reencaminhe-os para lá.

## Para terminar

A configuração só está «concluída» quando o passo de verificação passa. Se uma verificação pontual falhar, não avance — o resto da formação assenta nestes dados.
