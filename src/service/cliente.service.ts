import api from "@/lib/api";

interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
}

const getClientes = async () => {
    const response = await api.get("/cliente");
    return response.data;
}

const getClienteById = async (id: number) => {
    const response = await api.get(`/cliente/${id}`);
    return response.data;
}

const createCliente = async (cliente: Omit<Cliente, "id">) => {
    const response = await api.post("/cliente", cliente);
    return response.data;
}

const updateCliente = async (id: number, cliente: Cliente) => {
    const response = await api.put(`/cliente/${id}`, cliente);
    return response.data;
}

const deleteCliente = async (id: number) => {
    const response = await api.delete(`/cliente/${id}`);
    return response.data;
}

export {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente
}