'use client';

import { useState } from 'react';
import { useProduto, useProdutos } from '@/hooks/useProduto.hoo';

interface ProdutoData {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
}

export default function ProdutoSection() {
  const { createMutation } = useProduto();
  const { data: produtos, isLoading } = useProdutos();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [estoque, setEstoque] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const nomesProdutos = [
    'Notebook Dell',
    'Mouse Logitech',
    'Teclado Mecânico',
    'Monitor 27"',
    'Webcam HD',
    'Headset Gamer',
    'SSD 240GB',
    'Memória RAM 8GB',
    'Processador Intel i7',
    'Placa Mãe Z590',
  ];

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nome && descricao && preco && estoque) {
      await createMutation.mutateAsync({
        nome,
        descricao,
        preco: parseFloat(preco),
        estoque: parseInt(estoque),
      });
      setNome('');
      setDescricao('');
      setPreco('');
      setEstoque('');
    }
  };

  const handleGenerateAuto = async () => {
    setIsGenerating(true);
    let sucessos = 0;
    const targetSucessos = 5;
    
    for (let tentativa = 0; tentativa < 20 && sucessos < targetSucessos; tentativa++) {
      try {
        const produtoNome = nomesProdutos[Math.floor(Math.random() * nomesProdutos.length)];
        
        await createMutation.mutateAsync({
          nome: `${produtoNome} - ${Date.now()}${Math.floor(Math.random() * 1000)}`,
          descricao: `Produto de qualidade ${Math.floor(Math.random() * 100) + 1}`,
          preco: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
          estoque: Math.floor(Math.random() * 100 + 10),
        });
        
        sucessos++;
        console.log(`✅ Produto ${sucessos}/${targetSucessos} criado com sucesso`);
        
        // Delay de 500ms entre requisições para não sobrecarregar o servidor
        if (sucessos < targetSucessos) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error: any) {
        console.warn(`⚠️ Tentativa ${tentativa + 1} falhou:`, error?.message || error);
        // Retry após 1 segundo em caso de erro
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`🎉 Geração finalizada: ${sucessos}/${targetSucessos} produtos criados`);
    setIsGenerating(false);
  };

  return (
    <section className="p-8 bg-blue-50 rounded-lg mb-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-900">📦 Cadastro de Produtos</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário Manual */}
        <form onSubmit={handleCreateManual} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-900">Cadastro Manual</h3>
          
          <input
            type="text"
            placeholder="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full text-black mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <textarea
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full text-black mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="number"
            step="0.01"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="w-full text-black mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            type="number"
            placeholder="Estoque"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
            className="w-full text-black mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {createMutation.isPending ? 'Criando...' : 'Cadastrar Produto'}
          </button>
        </form>

        {/* Geração Automática */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-900">Geração Automática</h3>
          <p className="text-slate-900 mb-4">
            Clique para gerar 5 produtos aleatoriamente com dados automáticos.
          </p>
          
          <button
            onClick={handleGenerateAuto}
            disabled={isGenerating || createMutation.isPending}
            className="w-full bg-green-600 text-white p-3 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400 mb-4"
          >
            {isGenerating ? 'Gerando produtos...' : 'Gerar 5 Produtos Automáticos'}
          </button>

          {createMutation.isError && (
            <p className="text-red-900 text-sm mb-2">Erro ao criar produto</p>
          )}
          {createMutation.isSuccess && (
            <p className="text-green-900 text-sm">Produto criado com sucesso!</p>
          )}
        </div>
      </div>

      {/* Lista de Produtos */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-slate-900">Produtos Cadastrados</h3>
        
        {isLoading ? (
          <p className="text-slate-900">Carregando produtos...</p>
        ) : produtos && produtos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2">
                <tr>
                  <th className="p-2 text-left text-slate-900">ID</th>
                  <th className="p-2 text-left text-slate-900">Nome</th>
                  <th className="p-2 text-left text-slate-900">Descrição</th>
                  <th className="p-2 text-right text-slate-900">Preço</th>
                  <th className="p-2 text-right text-slate-900">Estoque</th>
                </tr>
              </thead>
              <tbody>
                {(produtos as ProdutoData[]).map((produto: ProdutoData) => (
                  <tr key={produto.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-slate-900">{produto.id}</td>
                    <td className="p-2 font-semibold text-slate-900">{produto.nome}</td>
                    <td className="p-2 text-slate-900">{produto.descricao}</td>
                    <td className="p-2 text-right font-semibold text-slate-900">R$ {parseFloat(produto.preco.toString()).toFixed(2)}</td>
                    <td className="p-2 text-right">{produto.estoque} un</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-900">Nenhum produto cadastrado</p>
        )}
      </div>
    </section>
  );
}
