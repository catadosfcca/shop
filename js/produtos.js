/* ============================================================
   PRODUTOS DA LOJA — edite SOMENTE este arquivo para:
     - adicionar um produto novo
     - remover um produto
     - mudar preço, nome, descrição, foto
     - marcar como "em breve" / indisponível

   Não precisa mexer em index.html nem em site.js para isso.
   ============================================================

   CAMPOS DE CADA PRODUTO:

   id              -> identificador único do produto (curto, sem espaço,
                       sem acento). Usado internamente pelo site e como
                       nome de referência. Ex: "camisa-2-azul".
                       Depois de publicado, evite mudar o id de um
                       produto que já tem link em circulação.

   numero          -> número estilo camisa de jogador, mostrado no canto
                       do card (ex: "10", "07"). Pode repetir entre
                       produtos, é só estético.

   nome            -> nome exibido no site (título do card).

   nomeFormulario  -> texto que será enviado como resposta pré-preenchida
                       no campo "Produto" do Google Forms. PRECISA ser
                       EXATAMENTE IGUAL a uma das opções cadastradas na
                       pergunta "Produto" do formulário (letra, acento,
                       maiúscula/minúscula e travessão incluídos).
                       Se você mudar o "nome" de exibição mas não quiser
                       editar a opção no Forms, mantenha o
                       nomeFormulario com o texto antigo que já existe
                       lá.

   descricao       -> frase curta abaixo do nome no card.

   preco           -> preço mostrado (ex: "R$ 99"). Deixe como texto,
                       incluindo o "R$".

   precoObs        -> texto pequeno ao lado do preço (ex: "à vista/pix").

   imagem          -> caminho da foto, relativo à pasta raiz do site.
                       Coloque o arquivo de imagem dentro da pasta
                       /images.

   disponivel      -> true  = produto normal, com botão "Fazer pedido"
                       false = produto aparece esmaecido, com selo
                               "Em breve" e botão desabilitado. Produtos
                               com disponivel:false NÃO precisam ter uma
                               opção correspondente no Google Forms
                               ainda.

   temTamanho      -> true  = ao pedir esse produto, o comprador vai
                               responder também o campo "Tamanho" no
                               formulário (ex: roupas P/M/G/GG).
                       false = produto de tamanho único (boné, bolsa,
                               porta-chuteira etc.), o formulário pula a
                               pergunta de tamanho pra esse produto.
                       (A lógica de pular a pergunta é configurada
                       dentro do próprio Google Forms — veja o
                       README.md.)

   temPersonalizacao -> true  = ao pedir esse produto, o comprador
                               informa "Nome" e "Número" para
                               personalizar as costas da camisa.
                       false = produto sem personalização de nome/
                               número (acessórios, blusa etc.).
                       (Assim como temTamanho, esse campo é só pra
                       documentar quais produtos precisam dessa seção
                       extra no Google Forms — veja README.md.)

   promptImagem    -> (opcional) o prompt usado para gerar a foto do
                       produto em IA, guardado aqui só de referência,
                       caso precise gerar uma variação no futuro. Pode
                       apagar esse campo se não for usar.

   ------------------------------------------------------------------
   PARA ADICIONAR UM PRODUTO NOVO:
   1. Copie um dos blocos { ... } abaixo e cole antes do "];" no final.
   2. Preencha os campos.
   3. Coloque a foto do produto em /images.
   4. Se o produto já estiver disponível pra venda, cadastre o texto
      exato de "nomeFormulario" como uma nova opção na pergunta
      "Produto" do Google Forms (veja README.md).

   ------------------------------------------------------------------
   ATENÇÃO — ATUALIZAÇÃO DE NOMES (produtos que já existiam):
   "camisa-2-azul" e "bolsa" tiveram o "nome" alterado nesta edição.
   Se o Google Forms já tinha opções com o texto ANTIGO desses dois
   produtos, atualize as opções lá para o novo texto de
   "nomeFormulario" abaixo — senão o pedido chega com o produto errado
   (ou em branco). Veja README.md, seção "Como configurar o Google
   Forms".
   ============================================================ */

const PRODUTOS = [

  {
    id: "camisa-2-azul",
    numero: "01",
    nome: "Camisa 2 Jogador Azul — ENERG Oficial",
    nomeFormulario: "Camisa 2 Jogador Azul — ENERG Oficial",
    descricao: "Segundo manto do Catados FCCA, tecido esportivo.",
    preco: "R$ 99",
    precoObs: "à vista/pix",
    imagem: "images/camisa-2-azul.jpg",
    disponivel: true,
    temTamanho: true,
    temPersonalizacao: true
  },

  {
    id: "camisa-2-goleiro-laranja",
    numero: "02",
    nome: "Camisa 2 Goleiro Laranja — ENERG Oficial",
    nomeFormulario: "Camisa 2 Goleiro Laranja — ENERG Oficial",
    descricao: "Camisa oficial de goleiro, tecido esportivo respirável.",
    preco: "R$ 99",
    precoObs: "à vista/pix",
    imagem: "images/camisa-2-goleiro-laranja.jpg",
    disponivel: true,
    temTamanho: true,
    temPersonalizacao: true
  },

  {
    id: "camisa-torcedor-1-branca",
    numero: "03",
    nome: "Camisa Torcedor 1 Branca — Catados Oficial",
    nomeFormulario: "Camisa Torcedor 1 Branca — Catados Oficial",
    descricao: "Camisa oficial da torcida, modelo branco, tecido leve.",
    preco: "R$ 99",
    precoObs: "à vista/pix",
    imagem: "images/camisa-torcedor-1-branca.jpg",
    disponivel: true,
    temTamanho: true,
    temPersonalizacao: true
  },

  {
    id: "camisa-torcedor-2-listrada",
    numero: "04",
    nome: "Camisa Torcedor 2 Listrada — Catados Oficial",
    nomeFormulario: "Camisa Torcedor 2 Listrada — Catados Oficial",
    descricao: "Camisa oficial da torcida, listrada tradicional, tecido leve.",
    preco: "R$ 99",
    precoObs: "à vista/pix",
    imagem: "images/camisa-torcedor-2-listrada.jpg",
    disponivel: true,
    temTamanho: true,
    temPersonalizacao: true
  },

  {
    id: "bone-trucker",
    numero: "05",
    nome: "Boné Trucker — Catados Oficial",
    nomeFormulario: "Boné Trucker — Catados Oficial",
    descricao: "Tela respirável, aba curva, ajuste regulável.",
    preco: "R$ 59",
    precoObs: "à vista/pix",
    imagem: "images/bone-trucker.jpg",
    disponivel: true,
    temTamanho: false,
    temPersonalizacao: false,
    promptImagem: "Product mockup photo of a black trucker cap, structured front panel with mesh back panel, curved brim, club crest patch centered on the front panel (shield badge with a cartoon mascot: bald bearded man holding a beer mug and a skewer, red-and-white striped jersey background, banner with a founding date), three-quarter angled product shot, centered composition, pure black background with a subtle dark red glow/vignette around the product, dramatic studio lighting, sharp focus, square 1:1 aspect ratio, no visible person, no watermark."
  },

  {
    id: "porta-chuteira",
    numero: "06",
    nome: "Porta Chuteira — Catados Oficial",
    nomeFormulario: "Porta Chuteira — Catados Oficial",
    descricao: "Bolsa ventilada para chuteiras, resistente.",
    preco: "R$ 49",
    precoObs: "à vista/pix",
    imagem: "images/porta-chuteira.jpg",
    disponivel: true,
    temTamanho: false,
    temPersonalizacao: false,
    promptImagem: "Product mockup photo of a rectangular shoe/cleat bag with rounded red piping edges and a red top handle, black fabric body with a subtle red diagonal streak and paint-splatter texture, club crest patch centered on the front panel (shield badge with a cartoon mascot: bald bearded man holding a beer mug and a skewer, red-and-white striped jersey background, banner with a founding date), large customizable jersey-style number '00' and 'SEU NOME' placeholder text printed below the crest in a distressed white sports typography, red zipper pull on top pocket, three-quarter angled product shot, centered composition, pure black background with a subtle dark red glow/vignette around the product, dramatic studio lighting, sharp focus, square 1:1 aspect ratio, no visible person, no watermark."
  },

  {
    id: "bolsa",
    numero: "07",
    nome: "Bolsa/Mala Catados Oficial",
    nomeFormulario: "Bolsa/Mala Catados Oficial",
    descricao: "Mala esportiva reforçada, alça de mão e tiracolo.",
    preco: "R$ 59",
    precoObs: "à vista/pix",
    imagem: "images/bolsa-mala.jpg",
    disponivel: true,
    temTamanho: false,
    temPersonalizacao: false
  },

  {
    id: "blusa",
    numero: "08",
    nome: "Blusa Catados Oficial",
    nomeFormulario: "Blusa Catados Oficial",
    // ATENÇÃO: preço ainda não informado — usei R$ 99 como referência
    // (mesma faixa das camisas). Ajuste o valor abaixo antes de divulgar.
    descricao: "Jaqueta oficial do Catados FCCA, zíper e detalhes exclusivos.",
    preco: "R$ 99",
    precoObs: "à vista/pix",
    imagem: "images/blusa.jpg",
    disponivel: true,
    temTamanho: true,
    temPersonalizacao: false
  },

];
