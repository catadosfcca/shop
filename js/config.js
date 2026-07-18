/* ============================================================
   CONFIG DO FORMULÁRIO — edite só esta parte quando precisar
   trocar o Google Forms ou o ID de algum campo.

   Veja o passo a passo completo em README.md ("Como configurar
   o Google Forms").
   ============================================================ */

const FORM_CONFIG = {
  // Link base do formulário, terminando em /viewform
  FORM_BASE_URL: "https://docs.google.com/forms/d/e/1FAIpQLSfOUMWc2c-nBkgV2WL2xN5TTWjnQuTZSIgn5Cq0y7ArpxcAQA/viewform",

  // ID do campo "Resumo do Pedido" no Forms (resposta longa/parágrafo).
  // Recebe, num só texto, o número do pedido e todos os itens do
  // carrinho (produto, tamanho, nome, número e quantidade de cada um).
  FORM_ENTRY_RESUMO: "1430321684",

  // ---------------------------------------------------------------
  // CAMPOS OPCIONAIS — deixe "" se ainda não tiver criado no Forms.
  // Eles não são obrigatórios pro pedido funcionar (o resumo acima já
  // tem tudo), mas criam COLUNAS SEPARADAS na planilha de respostas,
  // o que facilita muito organizar/filtrar/somar pedidos depois. Veja
  // README.md, seção "Organizando os pedidos na planilha".
  // ---------------------------------------------------------------

  // ID do campo "Nº do Pedido" (resposta curta). Cada pedido recebe um
  // código único (ex: CTD-260718-A3F9) — útil pra referenciar um
  // pedido específico numa conversa de WhatsApp, ou pra achar rápido
  // na planilha.
  FORM_ENTRY_NUMERO_PEDIDO: "",

  // ID do campo "Quantidade de Itens" (resposta curta). Soma total de
  // peças do pedido (2 camisas + 1 boné = 3), numa coluna separada.
  FORM_ENTRY_QTD_ITENS: "",

  // ID do campo "Valor Total (R$)" (resposta curta). Soma do
  // preço × quantidade de cada item, calculada automaticamente pelo
  // carrinho — numa coluna separada, já pronta pra somar na planilha.
  FORM_ENTRY_VALOR_TOTAL: "",
};
