/* ============================================================
   LÓGICA DO SITE — não precisa editar isso para adicionar
   produtos (edite js/produtos.js) nem para configurar o
   formulário (edite js/config.js).

   Como funciona o pedido com vários itens:
   1. Cada card tem um botão "Adicionar ao pedido", que guarda o
      item (produto + cor/tamanho + nome/número + quantidade) no
      carrinho, salvo no navegador do comprador (localStorage).
   2. O ícone de carrinho no topo mostra quantos itens já foram
      adicionados e abre um painel lateral com a lista.
   3. "Finalizar pedido" monta um texto único com todos os itens
      e abre o Google Forms JÁ PREENCHIDO nesse campo — o
      comprador só completa Nome e WhatsApp e envia.
   ============================================================ */

const CARRINHO_STORAGE_KEY = "catados_shop_carrinho_v1";

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

/* ---------- CARRINHO: LEITURA E ESCRITA ---------- */

function carregarCarrinho() {
  try {
    const bruto = localStorage.getItem(CARRINHO_STORAGE_KEY);
    return bruto ? JSON.parse(bruto) : [];
  } catch (erro) {
    return [];
  }
}

function salvarCarrinho(carrinho) {
  try {
    localStorage.setItem(CARRINHO_STORAGE_KEY, JSON.stringify(carrinho));
  } catch (erro) {
    // localStorage indisponível (ex: modo privado/anônimo) — o carrinho
    // continua funcionando só durante essa visita à página.
  }
}

function adicionarAoCarrinho(produto, campos) {
  const carrinho = carregarCarrinho();

  // Se já existe um item igual (mesmo produto, cor, tamanho, nome e
  // número), só soma a quantidade em vez de criar uma linha duplicada.
  const existente = carrinho.find((item) =>
    item.produtoId === produto.id &&
    item.cor === campos.cor &&
    item.tamanho === campos.tamanho &&
    item.nomePersonalizado === campos.nome &&
    item.numeroPersonalizado === campos.numero
  );

  if (existente) {
    existente.quantidade += campos.quantidade;
  } else {
    const precoUnitario = (typeof campos.precoVariante === "number" && !isNaN(campos.precoVariante))
      ? campos.precoVariante
      : converterPrecoParaNumero(produto.preco);

    carrinho.push({
      itemId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      produtoId: produto.id,
      nome: produto.nome,
      imagem: obterImagemParaCor(produto, campos.cor),
      cor: campos.cor || "",
      tamanho: campos.tamanho || "",
      nomePersonalizado: campos.nome || "",
      numeroPersonalizado: campos.numero || "",
      quantidade: campos.quantidade,
      precoUnitario,
    });
  }

  salvarCarrinho(carrinho);
  atualizarInterfaceCarrinho();
}

function removerDoCarrinho(itemId) {
  const carrinho = carregarCarrinho().filter((item) => item.itemId !== itemId);
  salvarCarrinho(carrinho);
  atualizarInterfaceCarrinho();
}

function alterarQuantidadeCarrinho(itemId, delta) {
  const carrinho = carregarCarrinho();
  const item = carrinho.find((i) => i.itemId === itemId);
  if (!item) return;
  item.quantidade = Math.max(1, item.quantidade + delta);
  salvarCarrinho(carrinho);
  atualizarInterfaceCarrinho();
}

function limparCarrinho() {
  salvarCarrinho([]);
  atualizarInterfaceCarrinho();
}

/* ---------- RENDERIZAÇÃO DOS CARDS DE PRODUTO ---------- */

function obterImagemParaCor(produto, cor) {
  return (produto.imagensPorCor && produto.imagensPorCor[cor]) || produto.imagem;
}

function criarCardHTML(produto) {
  if (!produto.disponivel) {
    return `
      <article class="card indisponivel" data-produto-id="${escapeHtml(produto.id)}">
        <div class="card-media">
          <span class="numero">Nº <b>${escapeHtml(produto.numero)}</b></span>
          <span class="badge-em-breve">Em breve</span>
          <img class="card-foto" src="${escapeHtml(produto.imagem)}" alt="${escapeHtml(produto.nome)}">
        </div>
        <div class="card-info">
          <div class="card-nome">${escapeHtml(produto.nome)}</div>
          <div class="card-desc">${escapeHtml(produto.descricao)}</div>
          <div class="card-rodape">
            <div class="preco"><span class="preco-valor">${escapeHtml(produto.preco)}</span><span class="preco-obs">${escapeHtml(produto.precoObs)}</span></div>
            <span class="btn desabilitado" aria-disabled="true">Indisponível</span>
          </div>
        </div>
      </article>
    `;
  }

  const campoCor = (produto.cores && produto.cores.length) ? `
    <div>
      <label class="campo-label" for="cor-${produto.id}">Cor</label>
      <select class="select-tamanho" id="cor-${produto.id}" data-campo="cor">
        ${produto.cores.map((cor, indice) =>
          `<option value="${escapeHtml(cor)}"${indice === 0 ? " selected" : ""}>${escapeHtml(cor)}</option>`
        ).join("")}
      </select>
    </div>
  ` : "";

  const campoTamanho = produto.temTamanho ? `
    <div>
      <label class="campo-label" for="tamanho-${produto.id}">
        Tamanho
        <button type="button" class="btn-info-tamanho" data-acao="abrir-medidas" aria-label="Ver tabela de medidas (largura e altura em cm)">i</button>
      </label>
      <select class="select-tamanho" id="tamanho-${produto.id}" data-campo="tamanho">
        ${TABELA_MEDIDAS_CAMISAS.map((linha) =>
          `<option value="${escapeHtml(linha.tamanho)}"${linha.tamanho === "M" ? " selected" : ""}>${escapeHtml(linha.tamanho)}</option>`
        ).join("")}
      </select>
    </div>
  ` : (produto.tamanhoFixo ? `
    <div>
      <label class="campo-label" for="tamanho-${produto.id}">Tamanho</label>
      <select class="select-tamanho select-fixo" id="tamanho-${produto.id}" data-campo="tamanho" disabled aria-disabled="true">
        <option value="${escapeHtml(produto.tamanhoFixo)}" selected>${escapeHtml(produto.tamanhoFixo)}</option>
      </select>
    </div>
  ` : (produto.variantes && produto.variantes.length ? `
    <div>
      <label class="campo-label" for="tamanho-${produto.id}">Tamanho</label>
      <select class="select-tamanho" id="tamanho-${produto.id}" data-campo="tamanho">
        ${produto.variantes.map((variante, indice) =>
          `<option value="${escapeHtml(variante.label)}" data-preco="${variante.preco}"${indice === 0 ? " selected" : ""}>${escapeHtml(variante.label)} — ${escapeHtml(formatarPrecoCurto(variante.preco))}</option>`
        ).join("")}
      </select>
    </div>
  ` : ""));

  const nomeObrigatorio = produto.temPersonalizacao && produto.personalizacaoObrigatoria;

  const camposPersonalizacao = produto.temPersonalizacao ? `
    <div class="linha-dupla">
      <div>
        <label class="campo-label" for="nome-${produto.id}">Nome${nomeObrigatorio ? ' <span class="campo-obrigatorio">*</span>' : " (opcional)"}</label>
        <input class="input-personalizado" id="nome-${produto.id}" data-campo="nome" type="text" maxlength="20" placeholder="Ex: JOÃO"${nomeObrigatorio ? " required" : ""}>
      </div>
      <div>
        <label class="campo-label" for="numero-${produto.id}">Número${nomeObrigatorio ? ' <span class="campo-obrigatorio">*</span>' : " (opcional)"}</label>
        <input class="input-personalizado" id="numero-${produto.id}" data-campo="numero" type="text" maxlength="3" inputmode="numeric" placeholder="Ex: 10"${nomeObrigatorio ? " required" : ""}>
      </div>
    </div>
  ` : "";

  const opcoes = (campoCor || campoTamanho || camposPersonalizacao)
    ? `<div class="card-opcoes">${campoCor}${campoTamanho}${camposPersonalizacao}</div>`
    : "";

  const imagemInicial = (produto.cores && produto.cores.length)
    ? obterImagemParaCor(produto, produto.cores[0])
    : produto.imagem;

  return `
    <article class="card" data-produto-id="${escapeHtml(produto.id)}">
      <div class="card-media">
        <span class="numero">Nº <b>${escapeHtml(produto.numero)}</b></span>
        <img class="card-foto" src="${escapeHtml(imagemInicial)}" alt="${escapeHtml(produto.nome)}">
      </div>
      <div class="card-info">
        <div class="card-nome">${escapeHtml(produto.nome)}</div>
        <div class="card-desc">${escapeHtml(produto.descricao)}</div>

        ${opcoes}

        <div class="card-rodape">
          <div class="preco"><span class="preco-valor" data-campo-preco>${escapeHtml(produto.preco)}</span><span class="preco-obs">${escapeHtml(produto.precoObs)}</span></div>
          <div class="qtd-stepper">
            <button type="button" data-acao="menos" aria-label="Diminuir quantidade">−</button>
            <span data-campo="qtd-valor">1</span>
            <button type="button" data-acao="mais" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>

        <button type="button" class="btn btn-adicionar" data-acao="adicionar">Adicionar ao pedido</button>
      </div>
    </article>
  `;
}

function renderizarCatalogo() {
  const grid = document.getElementById("grid-produtos");
  if (!grid) return;
  grid.innerHTML = PRODUTOS.map(criarCardHTML).join("");
}

function lerCamposCard(article) {
  const campos = { cor: "", tamanho: "", precoVariante: null, nome: "", numero: "", quantidade: 1 };

  const corEl = article.querySelector('[data-campo="cor"]');
  if (corEl) campos.cor = corEl.value;

  const tamanhoEl = article.querySelector('[data-campo="tamanho"]');
  if (tamanhoEl) {
    campos.tamanho = tamanhoEl.value;
    const opcaoSelecionada = tamanhoEl.selectedOptions && tamanhoEl.selectedOptions[0];
    if (opcaoSelecionada && opcaoSelecionada.dataset.preco) {
      campos.precoVariante = parseFloat(opcaoSelecionada.dataset.preco);
    }
  }

  const nomeEl = article.querySelector('[data-campo="nome"]');
  if (nomeEl) campos.nome = nomeEl.value.trim();

  const numeroEl = article.querySelector('[data-campo="numero"]');
  if (numeroEl) campos.numero = numeroEl.value.trim();

  const qtdEl = article.querySelector('[data-campo="qtd-valor"]');
  campos.quantidade = qtdEl ? (parseInt(qtdEl.textContent, 10) || 1) : 1;

  return campos;
}

function limparCamposCard(article) {
  const nomeEl = article.querySelector('[data-campo="nome"]');
  if (nomeEl) nomeEl.value = "";
  const numeroEl = article.querySelector('[data-campo="numero"]');
  if (numeroEl) numeroEl.value = "";
  const qtdEl = article.querySelector('[data-campo="qtd-valor"]');
  if (qtdEl) qtdEl.textContent = "1";
}

function validarCamposObrigatorios(article, produto, campos) {
  const camposInvalidos = [];

  if (produto.temPersonalizacao && produto.personalizacaoObrigatoria) {
    if (!campos.nome) camposInvalidos.push(article.querySelector('[data-campo="nome"]'));
    if (!campos.numero) camposInvalidos.push(article.querySelector('[data-campo="numero"]'));
  }

  article.querySelectorAll(".campo-erro").forEach((el) => el.classList.remove("campo-erro"));
  camposInvalidos.forEach((el) => el && el.classList.add("campo-erro"));

  return camposInvalidos.filter(Boolean);
}

function bindEventosGrid() {
  const grid = document.getElementById("grid-produtos");
  if (!grid) return;

  grid.addEventListener("click", (evento) => {
    const acao = evento.target.getAttribute("data-acao");
    if (!acao) return;

    if (acao === "abrir-medidas") {
      abrirMedidas();
      return;
    }

    const article = evento.target.closest("article[data-produto-id]");
    if (!article) return;

    const produto = PRODUTOS.find((p) => p.id === article.getAttribute("data-produto-id"));
    if (!produto) return;

    if (acao === "mais" || acao === "menos") {
      const qtdEl = article.querySelector('[data-campo="qtd-valor"]');
      if (!qtdEl) return;
      const valorAtual = parseInt(qtdEl.textContent, 10) || 1;
      qtdEl.textContent = String(acao === "mais" ? valorAtual + 1 : Math.max(1, valorAtual - 1));
      return;
    }

    if (acao === "adicionar") {
      const campos = lerCamposCard(article);

      const camposInvalidos = validarCamposObrigatorios(article, produto, campos);
      if (camposInvalidos.length) {
        camposInvalidos[0].focus();
        mostrarToast("Preencha Nome e Número antes de adicionar");
        return;
      }

      adicionarAoCarrinho(produto, campos);
      limparCamposCard(article);
      mostrarToast(`${produto.nome} adicionado ao pedido`);
    }
  });

  // Troca a foto do card quando o comprador muda a cor selecionada.
  // Troca a foto do card quando o comprador muda a cor selecionada, e
  // atualiza o preço exibido quando o tamanho escolhido tem preço
  // próprio (produto.variantes).
  grid.addEventListener("change", (evento) => {
    const campo = evento.target.getAttribute("data-campo");
    if (campo !== "cor" && campo !== "tamanho") return;

    const article = evento.target.closest("article[data-produto-id]");
    if (!article) return;

    const produto = PRODUTOS.find((p) => p.id === article.getAttribute("data-produto-id"));
    if (!produto) return;

    if (campo === "cor") {
      const foto = article.querySelector(".card-foto");
      if (foto) foto.src = obterImagemParaCor(produto, evento.target.value);
      return;
    }

    // campo === "tamanho": só atualiza o preço se a opção escolhida
    // tiver um preço próprio (data-preco), ou seja, só em produtos
    // com "variantes" — tamanhos normais de camisa não mexem no preço.
    const opcaoSelecionada = evento.target.selectedOptions && evento.target.selectedOptions[0];
    if (!opcaoSelecionada || !opcaoSelecionada.dataset.preco) return;

    const precoEl = article.querySelector("[data-campo-preco]");
    if (precoEl) precoEl.textContent = formatarPrecoCurto(parseFloat(opcaoSelecionada.dataset.preco));
  });
}

/* ---------- RENDERIZAÇÃO DO PAINEL DO CARRINHO ---------- */

function renderizarItemCarrinho(item) {
  const detalhes = [];
  if (item.cor) detalhes.push(`Cor ${escapeHtml(item.cor)}`);
  if (item.tamanho) detalhes.push(`Tamanho ${escapeHtml(item.tamanho)}`);
  if (item.nomePersonalizado) detalhes.push(`Nome "${escapeHtml(item.nomePersonalizado)}"`);
  if (item.numeroPersonalizado) detalhes.push(`Nº ${escapeHtml(item.numeroPersonalizado)}`);

  return `
    <div class="carrinho-item" data-item-id="${escapeHtml(item.itemId)}">
      <img src="${escapeHtml(item.imagem)}" alt="${escapeHtml(item.nome)}">
      <div class="carrinho-item-info">
        <div class="carrinho-item-nome">${escapeHtml(item.nome)}</div>
        ${detalhes.length ? `<div class="carrinho-item-detalhe">${detalhes.join(" · ")}</div>` : ""}
        <div class="carrinho-item-linha2">
          <div class="qtd-stepper">
            <button type="button" data-acao-item="menos" aria-label="Diminuir quantidade">−</button>
            <span>${item.quantidade}</span>
            <button type="button" data-acao-item="mais" aria-label="Aumentar quantidade">+</button>
          </div>
          <button type="button" class="carrinho-item-remover" data-acao-item="remover">Remover</button>
        </div>
      </div>
    </div>
  `;
}

function atualizarInterfaceCarrinho() {
  const carrinho = carregarCarrinho();
  const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);

  const badge = document.getElementById("carrinho-badge");
  if (badge) {
    badge.textContent = String(totalItens);
    badge.hidden = totalItens === 0;
  }

  const container = document.getElementById("carrinho-itens");
  if (container) {
    container.innerHTML = carrinho.length
      ? carrinho.map(renderizarItemCarrinho).join("")
      : `<p class="carrinho-vazio">Seu pedido está vazio.<br>Adicione produtos do catálogo ao lado.</p>`;
  }

  const totalValorEl = document.getElementById("carrinho-total-valor");
  if (totalValorEl) {
    const totais = calcularTotaisPedido(carrinho);
    totalValorEl.textContent = `R$ ${formatarValorReais(totais.valor)}`;
  }

  const btnFinalizar = document.getElementById("btn-finalizar");
  if (btnFinalizar) btnFinalizar.disabled = carrinho.length === 0;

  const btnLimpar = document.getElementById("btn-limpar-carrinho");
  if (btnLimpar) btnLimpar.disabled = carrinho.length === 0;
}

function abrirCarrinho() {
  document.getElementById("carrinho-drawer")?.classList.add("aberto");
  document.getElementById("carrinho-overlay")?.classList.add("aberto");
}

function fecharCarrinho() {
  document.getElementById("carrinho-drawer")?.classList.remove("aberto");
  document.getElementById("carrinho-overlay")?.classList.remove("aberto");
}

/* ---------- MODAL: TABELA DE MEDIDAS DAS CAMISAS ---------- */

function renderizarTabelaMedidas() {
  const corpo = document.getElementById("tabela-medidas-linhas");
  if (!corpo) return;

  corpo.innerHTML = TABELA_MEDIDAS_CAMISAS.map((linha) => `
    <tr>
      <td>${escapeHtml(linha.tamanho)}</td>
      <td>${linha.largura}</td>
      <td>${linha.altura}</td>
    </tr>
  `).join("");

  const obs = document.getElementById("medidas-observacao");
  if (obs) obs.textContent = MEDIDAS_OBSERVACAO;
}

function abrirMedidas() {
  document.getElementById("medidas-modal")?.classList.add("aberto");
  document.getElementById("medidas-overlay")?.classList.add("aberto");
}

function fecharMedidas() {
  document.getElementById("medidas-modal")?.classList.remove("aberto");
  document.getElementById("medidas-overlay")?.classList.remove("aberto");
}

function bindEventosMedidas() {
  document.getElementById("btn-fechar-medidas")?.addEventListener("click", fecharMedidas);
  document.getElementById("medidas-overlay")?.addEventListener("click", fecharMedidas);

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") fecharMedidas();
  });
}

function bindEventosCarrinho() {
  document.getElementById("btn-carrinho")?.addEventListener("click", abrirCarrinho);
  document.getElementById("btn-fechar-carrinho")?.addEventListener("click", fecharCarrinho);
  document.getElementById("carrinho-overlay")?.addEventListener("click", fecharCarrinho);

  document.getElementById("carrinho-itens")?.addEventListener("click", (evento) => {
    const acao = evento.target.getAttribute("data-acao-item");
    if (!acao) return;

    const linha = evento.target.closest("[data-item-id]");
    if (!linha) return;
    const itemId = linha.getAttribute("data-item-id");

    if (acao === "mais") alterarQuantidadeCarrinho(itemId, 1);
    if (acao === "menos") alterarQuantidadeCarrinho(itemId, -1);
    if (acao === "remover") removerDoCarrinho(itemId);
  });

  document.getElementById("btn-limpar-carrinho")?.addEventListener("click", () => {
    if (confirm("Limpar todos os itens do pedido?")) limparCarrinho();
  });

  document.getElementById("btn-finalizar")?.addEventListener("click", finalizarPedido);
}

/* ---------- RESUMO DO PEDIDO E LINK DO FORMULÁRIO ---------- */

function gerarNumeroPedido() {
  const agora = new Date();
  const aa = String(agora.getFullYear()).slice(-2);
  const mm = String(agora.getMonth() + 1).padStart(2, "0");
  const dd = String(agora.getDate()).padStart(2, "0");
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CTD-${aa}${mm}${dd}-${aleatorio}`;
}

function converterPrecoParaNumero(precoTexto) {
  // "R$ 99" -> 99 | "R$ 4,99" -> 4.99
  const somenteNumeros = String(precoTexto).replace(/[^\d,.-]/g, "").replace(",", ".");
  const valor = parseFloat(somenteNumeros);
  return Number.isFinite(valor) ? valor : 0;
}

function calcularTotaisPedido(carrinho) {
  return carrinho.reduce((totais, item) => {
    // Prioriza o preço salvo no próprio item (guardado no momento em
    // que foi adicionado — importante pra produtos com variantes de
    // preço, como o Símbolo Decorativo). Carrinhos salvos antes dessa
    // mudança não têm precoUnitario ainda, daí o fallback abaixo.
    let precoUnitario = item.precoUnitario;
    if (typeof precoUnitario !== "number" || isNaN(precoUnitario)) {
      const produto = PRODUTOS.find((p) => p.id === item.produtoId);
      precoUnitario = produto ? converterPrecoParaNumero(produto.preco) : 0;
    }
    totais.quantidade += item.quantidade;
    totais.valor += precoUnitario * item.quantidade;
    return totais;
  }, { quantidade: 0, valor: 0 });
}

function formatarValorReais(valor) {
  return valor.toFixed(2).replace(".", ",");
}

// Formato curto pra mostrar preço de variante: "R$ 30" (sem decimais
// quando é redondo) ou "R$ 30,50" (com decimais quando precisa).
function formatarPrecoCurto(valor) {
  return Number.isInteger(valor) ? `R$ ${valor}` : `R$ ${formatarValorReais(valor)}`;
}

// Uma linha por item — mais fácil de ler dentro de uma célula da
// planilha do que um item quebrado em várias linhas.
function montarResumoPedido(carrinho, numeroPedido) {
  const linhasItens = carrinho.map((item, indice) => {
    const detalhes = [`Qtd: ${item.quantidade}`];
    if (item.cor) detalhes.push(`Cor: ${item.cor}`);
    if (item.tamanho) detalhes.push(`Tamanho: ${item.tamanho}`);
    if (item.nomePersonalizado) detalhes.push(`Nome: ${item.nomePersonalizado}`);
    if (item.numeroPersonalizado) detalhes.push(`Número: ${item.numeroPersonalizado}`);
    return `${indice + 1}) ${item.nome} | ${detalhes.join(" | ")}`;
  });

  return [`Pedido Nº ${numeroPedido}`, "", ...linhasItens].join("\n");
}

function montarLinkFormularioPedido(dados) {
  const base = FORM_CONFIG.FORM_BASE_URL;
  if (!base || base === "FORM_LINK_AQUI") return null;

  const params = new URLSearchParams();
  if (FORM_CONFIG.FORM_ENTRY_RESUMO) {
    params.set(`entry.${FORM_CONFIG.FORM_ENTRY_RESUMO}`, dados.resumo);
  }
  // Campos opcionais — só entram no link se o id estiver configurado
  // em config.js (senão a coluna nem existe no Forms ainda).
  if (FORM_CONFIG.FORM_ENTRY_NUMERO_PEDIDO) {
    params.set(`entry.${FORM_CONFIG.FORM_ENTRY_NUMERO_PEDIDO}`, dados.numeroPedido);
  }
  if (FORM_CONFIG.FORM_ENTRY_QTD_ITENS) {
    params.set(`entry.${FORM_CONFIG.FORM_ENTRY_QTD_ITENS}`, String(dados.quantidadeTotal));
  }
  if (FORM_CONFIG.FORM_ENTRY_VALOR_TOTAL) {
    params.set(`entry.${FORM_CONFIG.FORM_ENTRY_VALOR_TOTAL}`, formatarValorReais(dados.valorTotal));
  }

  const separador = base.includes("?") ? "&" : "?";
  return params.toString() ? `${base}${separador}${params.toString()}` : base;
}

function finalizarPedido() {
  const carrinho = carregarCarrinho();
  if (!carrinho.length) return;

  if (!FORM_CONFIG.FORM_ENTRY_RESUMO) {
    mostrarToast("Formulário ainda não configurado — veja README.md");
    return;
  }

  const numeroPedido = gerarNumeroPedido();
  const totais = calcularTotaisPedido(carrinho);
  const resumo = montarResumoPedido(carrinho, numeroPedido);

  const link = montarLinkFormularioPedido({
    resumo,
    numeroPedido,
    quantidadeTotal: totais.quantidade,
    valorTotal: totais.valor,
  });

  if (!link) {
    mostrarToast("Formulário ainda não configurado — veja README.md");
    return;
  }

  window.open(link, "_blank", "noopener");
  mostrarToast(`Pedido ${numeroPedido} — finalize no formulário que abriu`);

  limparCarrinho();
  fecharCarrinho();
}

/* ---------- TOAST (feedback rápido) ---------- */

let toastTimeoutId = null;

function mostrarToast(mensagem) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = mensagem;
  toast.classList.add("mostrar");

  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => toast.classList.remove("mostrar"), 2200);
}

/* ---------- INICIALIZAÇÃO ---------- */

function inicializar() {
  renderizarCatalogo();
  bindEventosGrid();
  bindEventosCarrinho();
  atualizarInterfaceCarrinho();
  renderizarTabelaMedidas();
  bindEventosMedidas();
}

document.addEventListener("DOMContentLoaded", inicializar);
