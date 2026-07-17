/* ============================================================
   CONFIG DO FORMULÁRIO — edite só esta parte quando precisar
   trocar o Google Forms ou o ID do campo.

   Veja o passo a passo completo em README.md ("Como configurar
   o Google Forms").
   ============================================================ */

const FORM_CONFIG = {
  // Link base do formulário, terminando em /viewform
  FORM_BASE_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfOUMWc2c-nBkgV2WL2xN5TTWjnQuTZSIgn5Cq0y7ArpxcAQA/viewform",

  // ID do campo "Resumo do Pedido" no Forms (resposta longa/parágrafo).
  // É esse campo que recebe, num só texto, TODOS os itens do carrinho
  // (produto, tamanho, nome, número e quantidade de cada um).
  // O número depois de "entry." no link de pré-preenchimento. Deixe ""
  // se ainda não tiver criado esse campo no Forms.
  FORM_ENTRY_RESUMO: "",
};
