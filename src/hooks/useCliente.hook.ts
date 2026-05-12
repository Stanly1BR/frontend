import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createCliente, deleteCliente, updateCliente } from "@/service/cliente.service";
import { clienteQueries } from "@/service/cliente.queries";

interface Cliente {
    id: number;
    nome: string;
    email: string;
    telefone: string;
}

// 1. Hooks de leitura ficam puros e simples
export const useClientes = () => useQuery(clienteQueries.lista());
export const useClienteById = (id: number) => useQuery(clienteQueries.detalhe(id));

// 2. Hook de ações (Mutations) separado
export const useCliente = () => {
  const queryClient = useQueryClient();

  // Uma função utilitária para invalidar o cache
  const invalidate = () => queryClient.invalidateQueries({ queryKey: clienteQueries.all() });

  const createMutation = useMutation({
    mutationFn: (cliente: Omit<Cliente, "id">) => createCliente(cliente),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: (cliente: Cliente) => updateCliente(cliente.id, cliente),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCliente(id),
    onSuccess: invalidate,
  });

  return { createMutation, updateMutation, deleteMutation };
};