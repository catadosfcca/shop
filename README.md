# Catados.Shop — Loja Oficial

Site estático (HTML/CSS/JS puro, sem build, sem dependências) da loja
oficial do Catados FCCA. Pedidos são feitos por um formulário do
Google Forms, que abre pré-preenchido com o produto escolhido.

## Estrutura do projeto

```
shop/
├── index.html          <- estrutura da página (raramente precisa editar)
├── css/
│   └── style.css        <- cores, fontes, layout
├── js/
│   ├── produtos.js       <- ★ EDITE AQUI para adicionar/mudar produtos
│   ├── config.js         <- ★ EDITE AQUI para configurar o Google Forms
│   └── site.js            <- lógica que monta os cards e os links (não mexer)
├── images/
│   ├── logo.png
│   └── (uma foto por produto, referenciada em produtos.js)
└── README.md
```

No dia a dia, **99% das manutenções acontecem em `js/produtos.js`**.
Os outros arquivos só mudam se o formulário ou o visual da loja
mudarem.

---

## Como adicionar um produto novo

1. Abra `js/produtos.js`.
2. Copie um dos blocos `{ ... }` existentes e cole antes do `];` no
   final do arquivo.
3. Preencha os campos (todos comentados no topo do arquivo):

   | Campo            | O que é |
   |------------------|---------|
   | `id`             | Identificador único e curto do produto (ex: `"camisa-3-branca"`). Não muda depois de publicado. |
   | `numero`         | Número estilo camisa de jogador mostrado no card (ex: `"09"`). |
   | `nome`           | Nome exibido no site. |
   | `nomeFormulario` | Texto enviado como resposta no campo "Produto" do Google Forms. **Precisa ser idêntico** a uma opção cadastrada na pergunta "Produto" do formulário. |
   | `descricao`      | Frase curta abaixo do nome. |
   | `preco`          | Ex: `"R$ 79"`. |
   | `precoObs`       | Ex: `"à vista/pix"`. |
   | `imagem`         | Caminho da foto, ex: `"images/camisa-3-branca.jpg"`. |
   | `disponivel`     | `true` = à venda / `false` = aparece "Em breve", esmaecido, sem link. |
   | `temTamanho`     | `true` = pede tamanho no formulário (roupas) / `false` = tamanho único. |
   | `temPersonalizacao` | `true` = pede Nome e Número personalizado no formulário (só camisas) / `false` = sem personalização. |
   | `promptImagem`   | Opcional — prompt de IA usado pra gerar a foto, só de referência. |

4. Coloque o arquivo da foto dentro de `images/`.
5. Se o produto já está disponível para venda (`disponivel: true`),
   cadastre o texto de `nomeFormulario` como uma nova opção na
   pergunta **"Produto"** do Google Forms (veja seção abaixo).
6. Salve e publique o site. Pronto — nenhum outro arquivo precisa ser
   tocado.

### Para remover um produto
Apague o bloco `{ ... }` correspondente em `js/produtos.js` (ou mude
`disponivel` para `false` se quiser só pausar a venda temporariamente).

### Para mudar preço, nome, foto ou descrição
Edite os campos do produto correspondente em `js/produtos.js`.

---

## Como o "ID do Produto" se conecta ao formulário pré-preenchido

Cada produto tem dois identificadores diferentes, com finalidades
diferentes:

- **`id`** — usado só internamente pelo site (código, nome de
  arquivo). Não aparece pro comprador.
- **`nomeFormulario`** — é o valor que vai literalmente dentro do link
  do Google Forms, no parâmetro `entry.<ID_DO_CAMPO>=<nomeFormulario>`.
  O Forms só reconhece isso corretamente se o texto bater com uma das
  opções de múltipla escolha já cadastradas na pergunta "Produto".

Ou seja: o "link" entre o site e o formulário funciona em duas partes:
1. O **ID do campo** do formulário (ex: `956172927`) — fica em
   `js/config.js`, é o mesmo para todos os produtos, e só muda se você
   recriar o formulário do zero.
2. O **valor do produto** (`nomeFormulario`) — fica em
   `js/produtos.js`, é diferente por produto, e precisa bater com o
   texto exato da opção no formulário.

---

## Como configurar o Google Forms (do zero)

1. Crie **um único formulário**, com estes campos:
   - Nome completo (resposta curta)
   - WhatsApp (resposta curta)
   - Produto (múltipla escolha — uma opção para cada produto com
     `disponivel: true` em `produtos.js`, veja a lista completa mais
     abaixo)
   - Tamanho (múltipla escolha: P / M / G / GG)
   - Nome para estampar (resposta curta) — só pra camisas
   - Número personalizado (resposta curta) — só pra camisas
   - Quantidade (resposta curta ou múltipla escolha)

   Produtos com `disponivel: false` ("Em breve") não precisam de opção
   no formulário ainda — não têm botão de pedido no site.

2. Na tela de edição do formulário, clique nos 3 pontinhos (⋮) no
   canto superior direito → **"Preencher formulário"** (esse é o nome
   atual da função; antes era chamado de "Obter link pré-preenchido").

3. Isso abre o formulário como se você fosse responder. No campo
   "Produto", digite um valor de teste (ex: `TESTE`).

4. Clique em **"Gerar link"** (no menu ⋮ dessa tela de preview).

5. Copie o link gerado — algo como:
   ```
   https://docs.google.com/forms/d/e/xxxx/viewform?entry.123456789=TESTE
   ```
   O número depois de `entry.` é o **ID do campo**. Copie e cole em
   `FORM_ENTRY_PRODUTO` dentro de `js/config.js`.

6. Repita o processo (voltando e preenchendo de novo) para o campo
   "Tamanho", e preencha `FORM_ENTRY_TAMANHO` em `js/config.js`.

   "Nome para estampar" e "Número personalizado" **não precisam** de
   ID no `config.js` — são campos que o comprador digita na hora,
   não vêm pré-preenchidos pelo link do site.

7. Copie o link **base** do formulário (sem os parâmetros de
   `entry.`) para `FORM_BASE_URL` em `js/config.js` — normalmente
   termina em `/viewform`.

### Lista de produtos para cadastrar na pergunta "Produto"

Cada opção precisa ser **exatamente igual** (letra por letra, com
acentos e travessão) ao `nomeFormulario` de `produtos.js`. Lista
atual:

| id (`produtos.js`)          | Opção no Forms (`nomeFormulario`)                | Tamanho | Nome/Número |
|------------------------------|---------------------------------------------------|:-------:|:------------:|
| `camisa-2-azul`               | Camisa 2 Jogador Azul — ENERG Oficial              | Sim     | Sim          |
| `camisa-2-goleiro-laranja`    | Camisa 2 Goleiro Laranja — ENERG Oficial           | Sim     | Sim          |
| `camisa-torcedor-1-branca`    | Camisa Torcedor 1 Branca — Catados Oficial         | Sim     | Sim          |
| `camisa-torcedor-2-listrada`  | Camisa Torcedor 2 Listrada — Catados Oficial       | Sim     | Sim          |
| `bone-trucker`                | Boné Trucker — Catados Oficial                     | Não     | Não          |
| `porta-chuteira`              | Porta Chuteira — Catados Oficial                   | Não     | Não          |
| `bolsa`                       | Bolsa/Mala Catados Oficial                         | Não     | Não          |
| `blusa`                       | Blusa Catados Oficial                              | Sim     | Não          |

Essa tabela é só um retrato do momento — a fonte de verdade é sempre
`produtos.js` (campos `nomeFormulario`, `temTamanho` e
`temPersonalizacao`). Se editar um desses, atualize a opção
correspondente no Forms também.

### Estrutura de seções (Tamanho + Nome/Número só pra quem precisa)

O Google Forms não deixa esconder uma pergunta por link, mas dá pra
pular perguntas usando seções + navegação condicional. Como nem todo
produto precisa de Tamanho, e nem todo produto com Tamanho precisa de
Nome/Número (a Blusa tem tamanho mas não personalização), o
formulário fica com **4 seções**:

- **Seção 1:** Nome completo, WhatsApp, Produto
- **Seção 2A — "Tamanho e personalização":** Tamanho, Nome para
  estampar, Número personalizado (as 3 perguntas juntas)
- **Seção 2B — "Só tamanho":** Tamanho (sozinha)
- **Seção 3:** Quantidade (e o que mais tiver — fica igual pra todo
  mundo)

Passo a passo:

1. Crie as 4 seções (ícone "Adicionar seção" na barra lateral direita
   — parece um retângulo com duas linhas) e distribua as perguntas
   como acima.

2. Na pergunta "Produto" (Seção 1), clique nos 3 pontinhos (⋮) no
   canto da pergunta → **"Ir para seção com base na resposta"**.

3. Configure o destino de cada opção, usando a coluna "Tamanho" e
   "Nome/Número" da tabela acima:
   - `temTamanho: true` **e** `temPersonalizacao: true` (as 4
     camisas) → Ir para **Seção 2A**
   - `temTamanho: true` **e** `temPersonalizacao: false` (a Blusa) →
     Ir para **Seção 2B**
   - `temTamanho: false` (boné, porta-chuteira, bolsa/mala) → Ir
     direto para **Seção 3**

4. No rodapé da Seção 2A, deixe "Continuar para" como "Ir para a
   próxima seção" apontando pra **Seção 3**. Faça o mesmo no rodapé
   da Seção 2B.

Resultado: quem pede uma camisa vê Tamanho + Nome + Número; quem pede
a blusa vê só Tamanho; quem pede boné, porta-chuteira ou bolsa/mala
não vê nenhuma das duas.

**Lembrete:** sempre que adicionar um produto novo, volte no passo 3
e configure o destino da nova opção também (Seção 2A, 2B ou direto
pra Seção 3, dependendo de `temTamanho` e `temPersonalizacao` em
`produtos.js`) — isso é feito manualmente dentro do Google Forms, o
site não controla essa parte.

---

## Fotos de produto geradas por IA

Cada produto no `produtos.js` tem um campo opcional `promptImagem`
com o prompt usado para gerar a foto original. O padrão usado em
todas as fotos é: fundo preto puro, leve brilho/vinheta vermelha ao
redor do produto, iluminação de estúdio, composição centralizada,
proporção quadrada 1:1, sem pessoas, sem marca d'água. Reaproveite
esse padrão ao gerar fotos de produtos novos para manter a
identidade visual consistente.

---

## Rodando localmente

Como é um site estático, basta abrir `index.html` num navegador, ou
subir um servidor simples na pasta do projeto, por exemplo:

```
python3 -m http.server 8000
```

e acessar `http://localhost:8000`.
