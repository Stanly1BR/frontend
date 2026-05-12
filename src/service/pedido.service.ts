import api from "@/lib/api";

export interface PedidoItem {
    produtoId: number;
    quantidade: number;
}

export interface Pedido {
    id: number;
    clienteId: number;
    total: number;
    status: string;
    geradoAutomaticamente: boolean;
}

export const getPedidos = async () => {
    const response = await api.get("/pedido");
    return response.data;
}

export const getPedidoById = async (id: number) => {
    const response = await api.get(`/pedido/${id}`);
    return response.data;
}

export const createPedido = async (data: { clienteId: number; items: PedidoItem[] }) => {
    const response = await api.post("/pedido", data);
    return response.data;
}

export const updatePedido = async (id: number, pedido: Omit<Pedido, "id">) => {
    const response = await api.put(`/pedido/${id}`, pedido);
    return response.data;
}

export const deletePedido = async (id: number) => {
    const response = await api.delete(`/pedido/${id}`);
    return response.data;
}