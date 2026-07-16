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
   ============================================================ */

const PRODUTOS = [

  {
    id: "camisa-2-azul",
    numero: "10",
    nome: "Camisa 2 Azul — ENERG Oficial",
    nomeFormulario: "Camisa 2 Azul — ENERG Oficial",
    descricao: "Segundo manto do Catados FCCA, tecido esportivo.",
    preco: "R$ 99",
    precoObs: "à vista/pix",
    imagem: "images/camisa-2-azul.jpg",
    disponivel: true,
    temTamanho: true,
    promptImagem: "Product mockup photo of a football/soccer jersey, dark navy blue with diagonal lightning-bolt stripe pattern in a slightly lighter blue tone, 'energ' sponsor wordmark centered on chest in white with an orange accent dash, club crest patch on the upper right chest (shield badge with a cartoon mascot: bald bearded man holding a beer mug and a skewer, red-and-white striped jersey background, banner with a founding date), matching smaller crest patch on the left sleeve, sponsor wordmark on the right sleeve cuff, blue-and-orange lightning pattern trim on collar and sleeve cuffs, small manufacturer wing logo on chest, 'DRY-PREMIUM' and product tag details on hem, photographed flat/ghost-mannequin style facing forward, centered composition, pure black background with a subtle dark red glow/vignette around the product, studio product photography, sharp focus, square 1:1 aspect ratio, no visible person, no watermark."
  },

  {
    id: "bone-trucker",
    numero: "07",
    nome: "Boné Trucker — Catados Oficial",
    nomeFormulario: "Boné Trucker — Catados Oficial",
    descricao: "Tela respirável, aba curva, ajuste regulável.",
    preco: "R$ 59",
    precoObs: "à vista/pix",
    imagem: "images/bone-trucker.jpg",
    disponivel: true,
    temTamanho: false,
    promptImagem: "Product mockup photo of a black trucker cap, structured front panel with mesh back panel, curved brim, club crest patch centered on the front panel (shield badge with a cartoon mascot: bald bearded man holding a beer mug and a skewer, red-and-white striped jersey background, banner with a founding date), three-quarter angled product shot, centered composition, pure black background with a subtle dark red glow/vignette around the product, dramatic studio lighting, sharp focus, square 1:1 aspect ratio, no visible person, no watermark."
  },

  {
    id: "porta-chuteira",
    numero: "04",
    nome: "Porta Chuteira — Catados Oficial",
    nomeFormulario: "Porta Chuteira — Catados Oficial",
    descricao: "Bolsa ventilada para chuteiras, resistente.",
    preco: "R$ 49",
    precoObs: "à vista/pix",
    imagem: "images/porta-chuteira.jpg",
    disponivel: true,
    temTamanho: false,
    promptImagem: "Product mockup photo of a rectangular shoe/cleat bag with rounded red piping edges and a red top handle, black fabric body with a subtle red diagonal streak and paint-splatter texture, club crest patch centered on the front panel (shield badge with a cartoon mascot: bald bearded man holding a beer mug and a skewer, red-and-white striped jersey background, banner with a founding date), large customizable jersey-style number '00' and 'SEU NOME' placeholder text printed below the crest in a distressed white sports typography, red zipper pull on top pocket, three-quarter angled product shot, centered composition, pure black background with a subtle dark red glow/vignette around the product, dramatic studio lighting, sharp focus, square 1:1 aspect ratio, no visible person, no watermark."
  },

  {
    id: "bolsa",
    numero: "01",
    nome: "Bolsa Catados Oficial",
    nomeFormulario: "Bolsa Catados Oficial",
    descricao: "Tote bag resistente, alça reforçada.",
    preco: "Em breve",
    precoObs: "indisponível",
    imagem: "images/bolsa.jpg",
    disponivel: false,
    temTamanho: false,
    promptImagem: "Product photography, BOLSA CATADOS OFICIAL on a dark charcoal-black background (#0B0B0C), dramatic studio lighting with a subtle red rim light (#C8102E), soft shadow beneath the product, centered composition, square 1:1 aspect ratio, sports merchandise catalog style, sharp focus, no text, no watermark, no people, high detail fabric/texture."
  },

];
