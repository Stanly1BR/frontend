import api from "@/lib/api";

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
}

export const getProdutos = async () => {
    const response = await api.get("/produtos");
    return response.data;
}

export const getProdutoById = async (id: number) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
}

export const createProduto = async (produto: Omit<Produto, "id">) => {
    const response = await api.post("/produtos", produto);
    return response.data;
}

export const updateProduto = async (id: number, produto: Omit<Produto, "id">) => {
    const response = await api.put(`/produtos/${id}`, produto);
    return response.data;
}

export const deleteProduto = async (id: number) => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
}