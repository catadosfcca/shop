/* ============================================================
   LÓGICA DO SITE — não precisa editar isso para adicionar
   produtos (edite js/produtos.js) nem para configurar o
   formulário (edite js/config.js).

   Como funciona o pedido com vários itens:
   1. Cada card tem um botão "Adicionar ao pedido", que guarda o
      item (produto + tamanho + nome/número + quantidade) no
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

  // Se já existe um item igual (mesmo produto, tamanho, nome e número),
  // só soma a quantidade em vez de criar uma linha duplicada.
  const existente = carrinho.find((item) =>
    item.produtoId === produto.id &&
    item.tamanho === campos.tamanho &&
    item.nomePersonalizado === campos.nome &&
    item.numeroPersonalizado === campos.numero
  );

  if (existente) {
    existente.quantidade += campos.quantidade;
  } else {
    carrinho.push({
      itemId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      produtoId: produto.id,
      nome: produto.nome,
      imagem: produto.imagem,
      tamanho: campos.tamanho || "",
      nomePersonalizado: campos.nome || "",
      numeroPersonalizado: campos.numero || "",
      quantidade: campos.quantidade,
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
            <div class="preco">${escapeHtml(produto.preco)}<span>${escapeHtml(produto.precoObs)}</span></div>
            <span class="btn desabilitado" aria-disabled="true">Indisponível</span>
          </div>
        </div>
      </article>
    `;
  }

  const campoTamanho = produto.temTamanho ? `
    <div>
      <label class="campo-label" for="tamanho-${produto.id}">Tamanho</label>
      <select class="select-tamanho" id="tamanho-${produto.id}" data-campo="tamanho">
        <option value="P">P</option>
        <option value="M" selected>M</option>
        <option value="G">G</option>
        <option value="GG">GG</option>
      </select>
    </div>
  ` : "";

  const camposPersonalizacao = produto.temPersonalizacao ? `
    <div class="linha-dupla">
      <div>
        <label class="campo-label" for="nome-${produto.id}">Nome (opcional)</label>
        <input class="input-personalizado" id="nome-${produto.id}" data-campo="nome" type="text" maxlength="20" placeholder="Ex: JOÃO">
      </div>
      <div>
        <label class="campo-label" for="numero-${produto.id}">Número (opcional)</label>
        <input class="input-personalizado" id="numero-${produto.id}" data-campo="numero" type="text" maxlength="3" inputmode="numeric" placeholder="Ex: 10">
      </div>
    </div>
  ` : "";

  const opcoes = (campoTamanho || camposPersonalizacao)
    ? `<div class="card-opcoes">${campoTamanho}${camposPersonalizacao}</div>`
    : "";

  return `
    <article class="card" data-produto-id="${escapeHtml(produto.id)}">
      <div class="card-media">
        <span class="numero">Nº <b>${escapeHtml(produto.numero)}</b></span>
        <img class="card-foto" src="${escapeHtml(produto.imagem)}" alt="${escapeHtml(produto.nome)}">
      </div>
      <div class="card-info">
        <div class="card-nome">${escapeHtml(produto.nome)}</div>
        <div class="card-desc">${escapeHtml(produto.descricao)}</div>

        ${opcoes}

        <div class="card-rodape">
          <div class="preco">${escapeHtml(produto.preco)}<span>${escapeHtml(produto.precoObs)}</span></div>
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
  const campos = { tamanho: "", nome: "", numero: "", quantidade: 1 };

  const tamanhoEl = article.querySelector('[data-campo="tamanho"]');
  if (tamanhoEl) campos.tamanho = tamanhoEl.value;

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

function bindEventosGrid() {
  const grid = document.getElementById("grid-produtos");
  if (!grid) return;

  grid.addEventListener("click", (evento) => {
    const acao = evento.target.getAttribute("data-acao");
    if (!acao) return;

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
      adicionarAoCarrinho(produto, campos);
      limparCamposCard(article);
      mostrarToast(`${produto.nome} adicionado ao pedido`);
    }
  });
}

/* ---------- RENDERIZAÇÃO DO PAINEL DO CARRINHO ---------- */

function renderizarItemCarrinho(item) {
  const detalhes = [];
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

function montarResumoPedido(carrinho) {
  return carrinho.map((item, indice) => {
    const linhas = [`${indice + 1}) ${item.nome} (Qtd: ${item.quantidade})`];
    const detalhes = [];
    if (item.tamanho) detalhes.push(`Tamanho: ${item.tamanho}`);
    if (item.nomePersonalizado) detalhes.push(`Nome: ${item.nomePersonalizado}`);
    if (item.numeroPersonalizado) detalhes.push(`Número: ${item.numeroPersonalizado}`);
    if (detalhes.length) linhas.push(`   ${detalhes.join(" | ")}`);
    return linhas.join("\n");
  }).join("\n\n");
}

function montarLinkFormularioPedido(resumoTexto) {
  const base = FORM_CONFIG.FORM_BASE_URL;
  if (!base || base === "FORM_LINK_AQUI") return null;

  const params = new URLSearchParams();
  if (FORM_CONFIG.FORM_ENTRY_RESUMO) {
    params.set(`entry.${FORM_CONFIG.FORM_ENTRY_RESUMO}`, resumoTexto);
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

  const resumo = montarResumoPedido(carrinho);
  const link = montarLinkFormularioPedido(resumo);

  if (!link) {
    mostrarToast("Formulário ainda não configurado — veja README.md");
    return;
  }

  window.open(link, "_blank", "noopener");
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
}

document.addEventListener("DOMContentLoaded", inicializar);
