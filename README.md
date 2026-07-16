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
│   ├── camisa-2-azul.jpg
│   ├── bone-trucker.jpg
│   ├── porta-chuteira.jpg
│   └── bolsa.jpg
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

1. Crie **um único formulário**, com estes campos, nesta ordem:
   - Nome completo (resposta curta)
   - WhatsApp (resposta curta)
   - Produto (múltipla escolha — uma opção para cada produto com
     `disponivel: true` em `produtos.js`)
   - Tamanho (múltipla escolha: P / M / G / GG)
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

7. Copie o link **base** do formulário (sem os parâmetros de
   `entry.`) para `FORM_BASE_URL` em `js/config.js` — normalmente
   termina em `/viewform`.

### Como esconder "Tamanho" pra quem pede boné, bolsa etc.

O campo Tamanho só faz sentido pra camisas — boné, bolsa e porta-
chuteira são tamanho único. O Google Forms não deixa esconder uma
pergunta por link, mas dá pra pular ela usando seções + navegação
condicional:

1. Divida o formulário em 3 seções (ícone "Adicionar seção" na barra
   lateral direita — parece um retângulo com duas linhas):
   - **Seção 1:** Nome completo, WhatsApp, Produto
   - **Seção 2:** Tamanho (só essa pergunta)
   - **Seção 3:** Quantidade (e o que mais tiver)

2. Na pergunta "Produto" (Seção 1), clique nos 3 pontinhos (⋮) no
   canto da pergunta → **"Ir para seção com base na resposta"**.

3. Configure o destino de cada opção:
   - Produtos com `temTamanho: true` em `produtos.js` (ex: camisas) →
     Ir para Seção 2 (Tamanho)
   - Produtos com `temTamanho: false` (boné, bolsa, porta-chuteira) →
     Ir para Seção 3 (pula o Tamanho)

4. No rodapé da Seção 2 (Tamanho), deixe "Continuar para" como "Ir
   para a próxima seção" (Seção 3).

Resultado: quem pede uma camisa vê a pergunta de tamanho normalmente;
quem pede boné, bolsa ou porta-chuteira nunca vê essa pergunta.

**Lembrete:** sempre que adicionar um produto novo com
`temTamanho: true` ou `false`, volte nesse passo 3 e configure o
destino da nova opção também — isso é feito manualmente dentro do
Google Forms, o site não controla essa parte.

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
