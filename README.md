# Catados.Shop — Loja Oficial

Site estático (HTML/CSS/JS puro, sem build, sem dependências) da loja
oficial do Catados FCCA. O comprador monta o pedido inteiro no
próprio site — escolhe produtos, tamanho, nome/número e quantidade,
tudo guardado num carrinho — e manda **um único** formulário do
Google Forms no final, já preenchido com o resumo completo. Ele não
precisa abrir um formulário por produto.

## Estrutura do projeto

```
shop/
├── index.html          <- estrutura da página (raramente precisa editar)
├── css/
│   └── style.css        <- cores, fontes, layout
├── js/
│   ├── produtos.js       <- ★ EDITE AQUI para adicionar/mudar produtos
│   ├── config.js         <- ★ EDITE AQUI para configurar o Google Forms
│   └── site.js            <- lógica do catálogo e do carrinho (não mexer)
├── images/
│   ├── logo.png
│   └── (uma foto por produto, referenciada em produtos.js)
└── README.md
```

No dia a dia, **99% das manutenções acontecem em `js/produtos.js`**.
Os outros arquivos só mudam se o formulário ou o visual da loja
mudarem.

---

## Como funciona o carrinho (pedido com vários itens)

1. Cada produto disponível mostra, no próprio card: seletor de
   Tamanho (se `temTamanho: true`), campos de Nome e Número (se
   `temPersonalizacao: true`) e um contador de quantidade.
2. O comprador ajusta essas opções e clica **"Adicionar ao pedido"**
   — o item entra no carrinho, guardado no navegador dele
   (`localStorage`), sem precisar sair da página. Pode voltar e
   adicionar quantos produtos diferentes quiser.
3. O ícone de carrinho no topo mostra quantos itens já foram
   adicionados e abre um painel lateral com a lista (dá pra ajustar
   quantidade ou remover item ali mesmo).
4. Ao clicar em **"Finalizar pedido"**, o site monta um texto único
   com todos os itens (produto, tamanho, nome, número e quantidade de
   cada um) e abre o Google Forms **já preenchido** nesse texto — o
   comprador só completa Nome completo e WhatsApp e envia.

Como o carrinho já resolve tamanho/nome/número/quantidade no próprio
site, o Google Forms fica bem mais simples de configurar (veja
abaixo) — não precisa mais de seções condicionais nem de uma opção
por produto.

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
   | `nome`           | Nome exibido no site e usado no resumo do pedido enviado pro Forms. |
   | `nomeFormulario` | Legado/opcional — só é usado se você decidir manter, além do resumo, uma pergunta separada de múltipla escolha "Produto" no Forms (veja nota no fim desta seção). Não precisa preencher com cuidado especial hoje em dia. |
   | `descricao`      | Frase curta abaixo do nome. |
   | `preco`          | Ex: `"R$ 79"`. |
   | `precoObs`       | Ex: `"à vista/pix"`. |
   | `imagem`         | Caminho da foto, ex: `"images/camisa-3-branca.jpg"`. |
   | `disponivel`     | `true` = à venda / `false` = aparece "Em breve", esmaecido, sem botão. |
   | `temTamanho`     | `true` = mostra o seletor de Tamanho (editável) no card / `false` = sem seletor editável. |
   | `tamanhoFixo`    | Opcional, só com `temTamanho: false`. Texto fixo desabilitado (ex: `"Único"`) mostrado no lugar do seletor — hoje usado em Boné, Bolsa/Mala e Porta Chuteira. |
   | `temPersonalizacao` | `true` = mostra os campos de Nome e Número no card (hoje: camisas e porta-chuteira) / `false` = sem esses campos. |
   | `personalizacaoObrigatoria` | Só importa com `temPersonalizacao: true`. `true` = Nome/Número obrigatórios pra adicionar ao pedido (hoje: as 4 camisas) / `false` = opcionais (hoje: Porta Chuteira). |
   | `cores`          | Opcional — lista de cores, ex: `["Preto", "Branco"]`. Mostra um seletor de Cor no card. Omita se o produto não tem variação de cor. |
   | `imagensPorCor`  | Opcional, junto com `cores`. Mapa de cor → foto, ex: `{"Preto": "images/x.jpg", "Branco": "images/x-branco.jpg"}`. Troca a foto do card ao mudar a cor. |
   | `promptImagem`   | Opcional — prompt de IA usado pra gerar a foto, só de referência. |

4. Coloque o arquivo da foto dentro de `images/`.
5. Salve e publique o site. Pronto — nenhum outro arquivo precisa ser
   tocado, e você **não** precisa mexer no Google Forms: o resumo do
   pedido já vem pronto do carrinho, com o `nome` do produto que você
   acabou de cadastrar.

### Para remover um produto
Apague o bloco `{ ... }` correspondente em `js/produtos.js` (ou mude
`disponivel` para `false` se quiser só pausar a venda temporariamente).

### Para mudar preço, nome, foto ou descrição
Edite os campos do produto correspondente em `js/produtos.js`.

---

## Tabela de medidas das camisas

Toda camisa (`temTamanho: true`) mostra um botão **"i"** ao lado de
"Tamanho", que abre uma janela com a tabela de medidas — largura e
altura em cm, mais o aviso de variação. É uma tabela **única,
compartilhada por todas as camisas** (não por produto), pra não
repetir a mesma informação em cada card.

Pra mudar os tamanhos disponíveis ou as medidas, edite a constante
`TABELA_MEDIDAS_CAMISAS` no topo de `js/produtos.js`:

```js
const TABELA_MEDIDAS_CAMISAS = [
  { tamanho: "P",         largura: 47, altura: 61 },
  { tamanho: "M",         largura: 50, altura: 63 },
  { tamanho: "G",         largura: 53, altura: 65 },
  { tamanho: "GG",        largura: 56, altura: 66 },
  { tamanho: "EGG",       largura: 60, altura: 69 },
  { tamanho: "Especial",  largura: 65, altura: 72 },
  { tamanho: "Especial+", largura: 72, altura: 72 },
];
```

Essa lista alimenta automaticamente **duas coisas ao mesmo tempo**:
1. as opções do seletor "Tamanho" em toda camisa;
2. as linhas da tabela do botão "i".

Adicionar, remover ou renomear um tamanho aqui já atualiza os dois
lugares — não precisa mexer em `index.html` nem em `site.js`.

O texto de aviso ("As medidas podem variar até 2 cm.") fica na
constante `MEDIDAS_OBSERVACAO`, logo abaixo da tabela no mesmo
arquivo.

---

## Como configurar o Google Forms (do zero)

Como o carrinho já compila tudo num resumo de texto, o formulário
fica simples — só 3 perguntas, sem seções, sem navegação condicional:

1. Crie **um único formulário**, com estes campos:
   - Nome completo (resposta curta)
   - WhatsApp (resposta curta)
   - Resumo do Pedido (**resposta longa / parágrafo** — é aqui que o
     link do site chega pré-preenchido com a lista de itens)

2. Na tela de edição do formulário, clique nos 3 pontinhos (⋮) no
   canto superior direito → **"Preencher formulário"** (esse é o nome
   atual da função; antes era chamado de "Obter link pré-preenchido").

3. Isso abre o formulário como se você fosse responder. No campo
   "Resumo do Pedido", digite um valor de teste (ex: `TESTE`).

4. Clique em **"Gerar link"** (no menu ⋮ dessa tela de preview).

5. Copie o link gerado — algo como:
   ```
   https://docs.google.com/forms/d/e/xxxx/viewform?entry.123456789=TESTE
   ```
   O número depois de `entry.` é o **ID do campo**. Copie e cole em
   `FORM_ENTRY_RESUMO` dentro de `js/config.js`.

6. Copie o link **base** do formulário (sem os parâmetros de
   `entry.`) para `FORM_BASE_URL` em `js/config.js` — normalmente
   termina em `/viewform`.

7. Pronto. Teste no site: adicione 2 ou 3 produtos ao carrinho e
   clique em "Finalizar pedido" — deve abrir o Forms com o campo
   "Resumo do Pedido" já preenchido com a listinha completa, no
   formato:
   ```
   Pedido Nº CTD-260718-A3F9

   1) Camisa 2 Jogador Azul — ENERG Oficial | Qtd: 2 | Tamanho: G | Nome: JOAO | Número: 10
   2) Boné Trucker — Catados Oficial | Qtd: 1
   ```

### E se eu quiser manter uma pergunta "Produto" separada, tipo antes?

Não é necessário, mas se você quiser (por exemplo, pra ter uma coluna
extra na planilha de respostas com o nome do produto principal), dá
pra adicionar de volta uma pergunta de múltipla escolha "Produto" no
Forms — só que ela não vem mais pré-preenchida automaticamente pelo
carrinho (porque um pedido pode ter vários produtos ao mesmo tempo, e
essa pergunta só aceita um valor por vez). Nesse caso o comprador
preencheria essa pergunta manualmente olhando o resumo. Pra maioria
das lojas isso é redundante — o "Resumo do Pedido" já traz tudo — mas
o campo `nomeFormulario` em `produtos.js` continua aí, com o texto
certinho, caso você decida usar essa opção no futuro.

---

## Organizando os pedidos na planilha (Google Sheets)

Cada envio do formulário vira **uma linha** na planilha de respostas
— ou seja, cada linha já é o pedido completo de um cliente (mesmo
que tenha vários produtos, tudo fica dentro da célula "Resumo do
Pedido" daquela linha). O "Nº do Pedido" existe justamente pra você
ter uma referência curta e única desse pedido, sem precisar abrir a
célula inteira pra saber do que se trata.

Por padrão, só o "Resumo do Pedido" existe no Forms (funciona sozinho
— o número do pedido já vem escrito na primeira linha desse texto).
Mas dá pra criar **3 colunas extras**, se preenchidas em
`js/config.js`, que deixam a planilha muito mais fácil de organizar
sem precisar abrir cada resposta:

| Campo no Forms (resposta curta) | O que aparece | Pra que serve na planilha |
|---|---|---|
| **Nº do Pedido** | `CTD-260718-A3F9` | Filtrar/buscar um pedido específico, referenciar numa conversa de WhatsApp, evitar confundir dois pedidos do mesmo cliente. |
| **Quantidade de Itens** | `5` | Ordenar por tamanho do pedido, somar total de peças vendidas no mês. |
| **Valor Total (R$)** | `212,97` | Somar faturamento direto com `=SOMA()` na coluna, sem precisar calcular manualmente. |

### Como adicionar essas colunas

1. No Forms, crie 3 perguntas novas de **resposta curta**: "Nº do
   Pedido", "Quantidade de Itens" e "Valor Total (R$)".
2. Pra cada uma, repita o processo de pegar o ID do campo (passos 2 a
   5 acima, usando essa pergunta em vez de "Resumo do Pedido").
3. Cole os IDs em `js/config.js`:
   ```js
   FORM_ENTRY_NUMERO_PEDIDO: "123456789",
   FORM_ENTRY_QTD_ITENS: "234567890",
   FORM_ENTRY_VALOR_TOTAL: "345678901",
   ```
4. Pronto — o carrinho já calcula tudo sozinho (soma quantidade e
   valor de todos os itens, gera o número do pedido) toda vez que o
   comprador clica em "Finalizar pedido". Se deixar algum desses IDs
   em branco, essa coluna simplesmente não é preenchida (não quebra
   nada).

### Dicas de organização na planilha

- Congele a primeira linha (`Exibir → Congelar → 1 linha`) pra manter
  os cabeçalhos visíveis ao rolar.
- Use `Dados → Criar filtro` pra conseguir localizar rapidamente um
  pedido por nome, WhatsApp ou Nº do Pedido.
- Com a coluna "Valor Total" preenchida, uma célula qualquer com
  `=SOMA(F:F)` (troque `F` pela coluna certa) já te dá o faturamento
  total período — sem precisar abrir resposta por resposta.
- Se quiser separar cada PRODUTO em uma linha própria (por exemplo,
  pra saber quantas camisas tamanho G foram vendidas no total, e não
  só o total de itens por pedido), isso exige um script (Google Apps
  Script) que leia o "Resumo do Pedido" de cada linha e quebre em
  linhas individuais numa aba separada — é mais trabalho de
  configurar, mas é possível. Avise se quiser esse script também.

---

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

Detalhe técnico: o carrinho usa `localStorage` do navegador, então
funciona normalmente ao abrir por `http://` ou publicado num domínio
— só não persiste em abas anônimas fechadas ou entre navegadores
diferentes (é por dispositivo/navegador, não por conta).
