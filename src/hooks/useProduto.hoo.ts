import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProduto, deleteProduto, updateProduto } from "@/service/produto.service";
import { produtoQueries } from "@/service/produto.queries";

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
}

export const useProdutos = () => useQuery(produtoQueries.lista());
export const useProdutoById = (id: number) => useQuery(produtoQueries.detalhe(id));

export const useProduto = () => {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: produtoQueries.all() });

  const createMutation = useMutation({
    mutationFn: (produto: Omit<Produto, "id">) => createProduto(produto),
    onSuccess: invalidate,
    onError: (error: any) => {
      console.error('❌ Erro ao criar produto:', error?.message || error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (produto: Produto) => updateProduto(produto.id, produto),
    onSuccess: invalidate,
    onError: (error: any) => {
      console.error('❌ Erro ao atualizar produto:', error?.message || error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduto(id),
    onSuccess: invalidate,
    onError: (error: any) => {
      console.error('❌ Erro ao deletar produto:', error?.message || error);
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}