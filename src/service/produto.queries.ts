export const produtoQueries = {
    all: () => ["produtos"] as const,
    lista: () => ({
        queryKey: ["produtos"],
        queryFn: async () => {
            const { getProdutos } = await import("@/service/produto.service");
            return getProdutos();
        },
    }),
    detalhe: (id: number) => ({
        queryKey: ["produto", id],
        queryFn: async () => {
            const { getProdutoById } = await import("@/service/produto.service");
            return getProdutoById(id);
        },
        enabled: !!id,
    }),
};