/**
 * Query Key Factory para Cliente
 * Centraliza e organiza todas as query keys
 */

export const clienteQueries = {
  all: () => ["cliente"] as const,
  lista: () => ({
    queryKey: ["cliente"],
    queryFn: async () => {
      const { getClientes } = await import("@/service/cliente.service");
      return getClientes();
    },
  }),
  detalhe: (id: number) => ({
    queryKey: ["cliente", id],
    queryFn: async () => {
      const { getClienteById } = await import("@/service/cliente.service");
      return getClienteById(id);
    },
    enabled: !!id,
  }),
};
