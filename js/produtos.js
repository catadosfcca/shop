/* ============================================================
   PRODUTOS DA LOJA — edite SOMENTE este arquivo para:
     - adicionar um produto novo
     - remover um produto
     - mudar preço, nome, descrição, foto
     - marcar como "em breve" / indisponível

   Não precisa mexer em index.html nem em site.js para isso.

   O pedido funciona por CARRINHO: o comprador escolhe tamanho,
   nome, número e quantidade no próprio card do produto, adiciona
   quantos itens quiser, e no final manda tudo de uma vez num único
   link do Google Forms (campo "Resumo do Pedido"). Por isso
   `temTamanho` e `temPersonalizacao` controlam diretamente o que
   aparece no CARD DO SITE — não é mais preciso configurar seções
   nem navegação condicional no Forms. Veja README.md.
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

   nome            -> nome exibido no site e usado no resumo do pedido
                       que chega pro Google Forms.

   nomeFormulario  -> legado/opcional, não é mais necessário pro
                       carrinho funcionar. Só importa se você decidir
                       adicionar de volta uma pergunta separada de
                       múltipla escolha "Produto" no Forms (veja nota
                       no README.md). Pode deixar como está.

   descricao       -> frase curta abaixo do nome no card.

   preco           -> preço mostrado (ex: "R$ 99"). Deixe como texto,
                       incluindo o "R$".

   precoObs        -> texto pequeno ao lado do preço (ex: "à vista/pix").

   imagem          -> caminho da foto, relativo à pasta raiz do site.
                       Coloque o arquivo de imagem dentro da pasta
                       /images.

   disponivel      -> true  = produto normal, com controles de pedido
                               e botão "Adicionar ao pedido".
                       false = produto aparece esmaecido, com selo
                               "Em breve" e botão desabilitado.

   temTamanho      -> true  = mostra um seletor de Tamanho (P/M/G/GG),
                               editável, no card desse produto.
                       false = sem seletor editável. Se quiser mostrar
                               um "Tamanho Único" fixo (não editável),
                               use o campo tamanhoFixo (abaixo) junto
                               com temTamanho: false.

   tamanhoFixo     -> (opcional) só faz sentido com temTamanho: false.
                       Texto fixo mostrado no lugar do seletor de
                       Tamanho, desabilitado (o comprador não pode
                       mudar). Hoje usado como "Único" no Boné, na
                       Bolsa/Mala e no Porta Chuteira. Omita se não
                       quiser mostrar nada de tamanho nesse produto.

   temPersonalizacao -> true  = mostra os campos "Nome" e "Número" no
                               card desse produto, pra personalizar a
                               estampa.
                       false = produto sem personalização de nome/
                               número (acessórios, blusa etc.).

   personalizacaoObrigatoria -> só importa se temPersonalizacao: true.
                       true  = Nome e Número ficam OBRIGATÓRIOS — o
                               site bloqueia "Adicionar ao pedido" se
                               estiverem em branco (hoje: as 4
                               camisas).
                       false = Nome e Número continuam opcionais (hoje:
                               Porta Chuteira).

   cores           -> (opcional) lista de cores disponíveis, ex:
                       ["Preto", "Branco"]. Se presente, mostra um
                       seletor de Cor no card, e a cor escolhida entra
                       no resumo do pedido. Se o produto não tem
                       variação de cor, pode omitir esse campo.

   imagensPorCor   -> (opcional) só faz sentido junto com cores. Mapa
                       de cor -> caminho da foto, ex:
                       { "Preto": "images/copo-termico.jpg",
                         "Branco": "images/copo-termico-branco.jpg" }
                       Ao trocar a cor no seletor, a foto do card troca
                       junto. Se uma cor não tiver entrada nesse mapa,
                       usa a foto padrão do campo "imagem".

   promptImagem    -> (opcional) o prompt usado para gerar a foto do
                       produto em IA, guardado aqui só de referência,
                       caso precise gerar uma variação no futuro. Pode
                       apagar esse campo se não for usar.

   ------------------------------------------------------------------
   PARA ADICIONAR UM PRODUTO NOVO:
   1. Copie um dos blocos { ... } abaixo e cole antes do "];" no final.
   2. Preencha os campos.
   3. Coloque a foto do produto em /images.
   4. Pronto — não precisa mexer no Google Forms, o carrinho já monta
      o resumo do pedido usando o "nome" que você cadastrou.
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
    temPersonalizacao: true,
    personalizacaoObrigatoria: true
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
    temPersonalizacao: true,
    personalizacaoObrigatoria: true
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
    temPersonalizacao: true,
    personalizacaoObrigatoria: true
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
    temPersonalizacao: true,
    personalizacaoObrigatoria: true
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
    tamanhoFixo: "Único",
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
    tamanhoFixo: "Único",
    temPersonalizacao: true,
    personalizacaoObrigatoria: false,
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
    tamanhoFixo: "Único",
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

  {
    id: "copo-termico",
    numero: "09",
    nome: "Copo Térmico Catados",
    nomeFormulario: "Copo Térmico Catados",
    descricao: "Aço inox, parede dupla, tampa com canudo. 590ml.",
    preco: "R$ 65",
    precoObs: "à vista/pix",
    imagem: "images/copo-termico.jpg",
    disponivel: true,
    temTamanho: false,
    temPersonalizacao: false,
    cores: ["Preto", "Branco"],
    imagensPorCor: {
      "Preto": "images/copo-termico.jpg",
      "Branco": "images/copo-termico-branco.jpg"
    }
  },

  {
    id: "chaveiro",
    numero: "10",
    nome: "Chaveiro Oficial Catados",
    nomeFormulario: "Chaveiro Oficial Catados",
    descricao: "Acrílico resistente, escudo Catados FCCA dos dois lados.",
    preco: "R$ 4,99",
    precoObs: "à vista/pix",
    imagem: "images/chaveiro.jpg",
    disponivel: true,
    temTamanho: false,
    temPersonalizacao: false
  },

];
