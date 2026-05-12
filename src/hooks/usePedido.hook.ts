import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createPedido, deletePedido, updatePedido, Pedido, PedidoItem } from "@/service/pedido.service";
import { pedidoQueries } from "@/service/pedido.queries";

export const usePedidos = () => useQuery(pedidoQueries.lista());
export const usePedidoById = (id: number) => useQuery(pedidoQueries.detalhe(id));

export const usePedido = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: pedidoQueries.all() });

  const createMutation = useMutation({
    mutationFn: (data: { clienteId: number; items: PedidoItem[] }) => createPedido(data),
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: (pedido: Pedido) => updatePedido(pedido.id, pedido),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePedido(id),
    onSuccess: invalidate,
  });

    return { createMutation, updateMutation, deleteMutation };
};