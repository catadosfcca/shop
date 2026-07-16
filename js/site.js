/* ============================================================
   LÓGICA DO SITE — não precisa editar isso para adicionar
   produtos (edite js/produtos.js) nem para configurar o
   formulário (edite js/config.js).
   ============================================================ */

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function montarLinkFormulario(produto) {
  const base = FORM_CONFIG.FORM_BASE_URL;
  if (!base || base === "FORM_LINK_AQUI") return null;

  const params = new URLSearchParams();
  if (FORM_CONFIG.FORM_ENTRY_PRODUTO) {
    params.set(`entry.${FORM_CONFIG.FORM_ENTRY_PRODUTO}`, produto.nomeFormulario);
  }
  // O campo Tamanho fica em branco no link (o torcedor escolhe no
  // formulário), mas se quiser travar um valor padrão dá pra usar
  // FORM_CONFIG.FORM_ENTRY_TAMANHO da mesma forma acima.

  const separador = base.includes("?") ? "&" : "?";
  return params.toString() ? `${base}${separador}${params.toString()}` : base;
}

function criarCardHTML(produto) {
  const classeCard = produto.disponivel ? "card" : "card indisponivel";
  const badge = produto.disponivel ? "" : `<span class="badge-em-breve">Em breve</span>`;

  const botao = produto.disponivel
    ? `<a class="btn" data-produto-id="${escapeHtml(produto.id)}" target="_blank" rel="noopener">Fazer pedido</a>`
    : `<span class="btn desabilitado" aria-disabled="true">Indisponível</span>`;

  return `
    <article class="${classeCard}" data-produto-id="${escapeHtml(produto.id)}">
      <div class="card-media">
        <span class="numero">Nº <b>${escapeHtml(produto.numero)}</b></span>
        ${badge}
        <img class="card-foto" src="${escapeHtml(produto.imagem)}" alt="${escapeHtml(produto.nome)}">
      </div>
      <div class="card-info">
        <div class="card-nome">${escapeHtml(produto.nome)}</div>
        <div class="card-desc">${escapeHtml(produto.descricao)}</div>
        <div class="card-rodape">
          <div class="preco">${escapeHtml(produto.preco)}<span>${escapeHtml(produto.precoObs)}</span></div>
          ${botao}
        </div>
      </div>
    </article>
  `;
}

function renderizarCatalogo() {
  const grid = document.getElementById("grid-produtos");
  if (!grid) return;

  grid.innerHTML = PRODUTOS.map(criarCardHTML).join("");

  grid.querySelectorAll(".btn[data-produto-id]").forEach((botao) => {
    const produto = PRODUTOS.find((p) => p.id === botao.getAttribute("data-produto-id"));
    if (!produto) return;

    const link = montarLinkFormulario(produto);

    if (link) {
      botao.href = link;
    } else {
      // Formulário ainda não configurado: botão fica visível mas inerte,
      // pra não gerar um link quebrado sem querer.
      botao.classList.add("desabilitado");
      botao.removeAttribute("target");
      botao.setAttribute("aria-disabled", "true");
      botao.title = "Formulário de pedidos ainda não configurado";
    }
  });
}

document.addEventListener("DOMContentLoaded", renderizarCatalogo);
