'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePedidos, usePedido } from '@/hooks/usePedido.hook';
import { useClientes } from '@/hooks/useCliente.hook';
import { useProdutos } from '@/hooks/useProduto.hoo';

interface ClientePedidoCount {
  clienteId: number;
  clienteNome: string;
  count: number;
}

interface PedidoData {
  id: number;
  clienteId: number;
  total: number;
  status: string;
  createdAt: string;
}

interface ClienteData {
  id: number;
  nome: string;
}

interface ProdutoData {
  id: number;
}

export default function RelatorioPedidosSection() {
  const { data: pedidos, isLoading } = usePedidos();
  const { createMutation } = usePedido();
  const { data: clientes } = useClientes();
  const { data: produtos } = useProdutos();
  
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [clientePedidoCount, setClientePedidoCount] = useState<ClientePedidoCount[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Usar useCallback para evitar re-runs desnecessários
  const contarPedidos = useCallback(() => {
    if (pedidos && clientes) {
      const counts: { [key: number]: { nome: string; count: number } } = {};
      
      (pedidos as PedidoData[]).forEach((pedido: PedidoData) => {
        if (!counts[pedido.clienteId]) {
          const cliente = (clientes as ClienteData[]).find((c: ClienteData) => c.id === pedido.clienteId);
          counts[pedido.clienteId] = {
            nome: cliente?.nome || 'Desconhecido',
            count: 0,
          };
        }
        counts[pedido.clienteId].count += 1;
      });

      const resultado = Object.entries(counts).map(([clienteId, data]) => ({
        clienteId: parseInt(clienteId),
        clienteNome: data.nome,
        count: data.count,
      }));

      setClientePedidoCount(resultado);
    }
  }, [pedidos, clientes]);

  // Usar useEffect corretamente
  useEffect(() => {
    contarPedidos();
  }, [contarPedidos]);

  // Gerar pedidos automaticamente (a partir do 2º do cliente)
  const handleGenerarPedidosAuto = async () => {
    if (!clientes || clientes.length === 0 || !produtos || produtos.length === 0) {
      alert('Cadastre clientes e produtos primeiro!');
      return;
    }

    setIsGenerating(true);

    // Para cada cliente, gerar até 3 pedidos (a partir do 2º)
    for (const cliente of clientes) {
      // Gera 2 pedidos por cliente (começa no 2º)
      for (let pedidoNum = 1; pedidoNum <= 2; pedidoNum++) {
        // Seleciona 2-3 produtos aleatórios
        const quantidadeProdutos = Math.floor(Math.random() * 2 + 2);
        const items = [];

        for (let i = 0; i < quantidadeProdutos; i++) {
          const produtoAleatorio = produtos[Math.floor(Math.random() * produtos.length)];
          items.push({
            produtoId: produtoAleatorio.id,
            quantidade: Math.floor(Math.random() * 3 + 1),
          });
        }

        await createMutation.mutateAsync({
          clienteId: cliente.id,
          items,
        });

        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setIsGenerating(false);
  };

  // Filtrar pedidos por período
  const pedidosFiltrados = pedidos?.filter((pedido: any) => {
    if (!dataInicio && !dataFim) return true;

    const dataPedido = new Date(pedido.createdAt);
    const inicio = dataInicio ? new Date(dataInicio) : new Date(0);
    const fim = dataFim ? new Date(dataFim) : new Date();

    return dataPedido >= inicio && dataPedido <= fim;
  }) || [];

  // Calcular total de vendas no período
  const totalVendas = pedidosFiltrados.reduce((sum: number, pedido: any) => {
    return sum + parseFloat(pedido.total || 0);
  }, 0);

  return (
    <section className="p-8 bg-purple-50 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-purple-900">📊 Pedidos e Relatórios</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Geração Automática */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-900">⚙️ Geração Automática</h3>
          <p className="text-slate-900 mb-4 text-sm">
            Gera 2 pedidos por cliente automaticamente. (A partir do 2º pedido)
          </p>
          
          <button
            onClick={handleGenerarPedidosAuto}
            disabled={isGenerating || createMutation.isPending}
            className="w-full bg-purple-600 text-white p-3 rounded font-semibold hover:bg-purple-700 disabled:bg-gray-400 mb-4"
          >
            {isGenerating ? 'Gerando pedidos...' : 'Gerar Pedidos Automáticos'}
          </button>

          {createMutation.isError && (
            <p className="text-red-900 text-sm">Erro ao criar pedido</p>
          )}
          {createMutation.isSuccess && (
            <p className="text-green-900 text-sm">Pedido criado com sucesso!</p>
          )}
        </div>

        {/* Filtro por Período */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-900">📅 Filtro por Período</h3>
          
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Data Início"
          />
          
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Data Fim"
          />

          <button
            onClick={() => {
              setDataInicio('');
              setDataFim('');
            }}
            className="w-full bg-gray-400 text-white p-2 rounded font-semibold hover:bg-gray-500"
          >
            Limpar Filtro
          </button>
        </div>

        {/* Estatísticas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-900">📈 Estatísticas</h3>
          
          <div className="mb-3">
            <p className="text-slate-900 text-sm">Total de Pedidos</p>
            <p className="text-3xl font-bold text-purple-600">{pedidosFiltrados.length}</p>
          </div>

          <div>
            <p className="text-slate-900 text-sm">Total de Vendas</p>
            <p className="text-2xl font-bold text-green-600">R$ {totalVendas.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4 text-slate-900">📦 Pedidos {dataInicio || dataFim ? '(Filtrados)' : ''}</h3>

        {isLoading ? (
          <p className="text-slate-900">Carregando pedidos...</p>
        ) : pedidosFiltrados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2">
                <tr>
                  <th className="p-2 text-left text-slate-900">ID</th>
                  <th className="p-2 text-left text-slate-900">Cliente</th>
                  <th className="p-2 text-right text-slate-900">Total</th>
                  <th className="p-2 text-left text-slate-900">Status</th>
                  <th className="p-2 text-left text-slate-900">Data</th>
                </tr>
              </thead>
              <tbody>
                {pedidosFiltrados.map((pedido: PedidoData) => {
                  const cliente = (clientes as ClienteData[])?.find((c: ClienteData) => c.id === pedido.clienteId);
                  const dataPedido = new Date(pedido.createdAt);
                  
                  return (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-semibold text-slate-900">#{pedido.id}</td>
                      <td className="p-2 text-slate-900">{cliente?.nome || 'Desconhecido'}</td>
                      <td className="p-2 text-right font-semibold text-slate-900">R$ {parseFloat(pedido.total.toString()).toFixed(2)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          pedido.status === 'Concluído' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {pedido.status}
                        </span>
                      </td>
                      <td className="p-2 text-slate-900">{dataPedido.toLocaleDateString('pt-BR')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-900">Nenhum pedido encontrado para o período</p>
        )}
      </div>

      {/* Relatório de Clientes com Múltiplos Pedidos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-slate-900">👥 Clientes com Múltiplos Pedidos</h3>

        {clientePedidoCount.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2">
                <tr>
                  <th className="p-2 text-left text-slate-900">Cliente</th>
                  <th className="p-2 text-center text-slate-900">Quantidade de Pedidos</th>
                  <th className="p-2 text-left text-slate-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {clientePedidoCount.map((item) => (
                  <tr key={item.clienteId} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-semibold text-slate-900">{item.clienteNome}</td>
                    <td className="p-2 text-center">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded font-semibold">
                        {item.count} pedido{item.count > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="p-2">
                      {item.count >= 2 ? (
                        <span className="text-green-900 font-semibold">✓ Cliente Recorrente</span>
                      ) : (
                        <span className="text-slate-900">Primeiro pedido</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-900">Nenhum cliente com pedidos</p>
        )}
      </div>
    </section>
  );
}
