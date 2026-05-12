export const pedidoQueries = {
    all: () => ["pedido"] as const,
    lista: () => ({
        queryKey: ["pedido"],
        queryFn: async () => {
            const { getPedidos } = await import("@/service/pedido.service");
            return getPedidos();
        },
    }),
    detalhe: (id: number) => ({
        queryKey: ["pedido", id],
        queryFn: async () => {
            const { getPedidoById } = await import("@/service/pedido.service");
            return getPedidoById(id);
        },
        enabled: !!id,
    }),
};
