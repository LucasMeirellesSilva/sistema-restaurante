export const forbiddenRoutes: Record<string, string[]> = {
  Garçom: [
    "/configuracao",
    "/usuarios",
    "/catalogo",
    "/ponto-venda",
    "/clientes",
  ],
  Caixa: ["/configuracao", "/usuarios", "/catalogo", "/clientes"],
  Admin: [],
};
