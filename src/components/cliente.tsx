'use client';

import { useState } from 'react';
import { useCliente, useClientes } from '@/hooks/useCliente.hook';

interface ClienteData {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export default function ClienteSection() {
  const { createMutation } = useCliente();
  const { data: clientes, isLoading } = useClientes();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const nomes = [
    'João Silva',
    'Maria Santos',
    'Pedro Oliveira',
    'Ana Costa',
    'Carlos Ferreira',
    'Juliana Martins',
    'Roberto Gomes',
    'Fernanda Lima',
    'Lucas Alves',
    'Beatriz Rocha',
  ];

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nome && email && telefone) {
      await createMutation.mutateAsync({
        nome,
        email,
        telefone,
      });
      setNome('');
      setEmail('');
      setTelefone('');
    }
  };

  const handleGenerateAuto = async () => {
    setIsGenerating(true);
    let sucessos = 0;
    let tentativas = 0;
    
    while (sucessos < 5 && tentativas < 20) {
      try {
        tentativas++;
        const clienteNome = nomes[Math.floor(Math.random() * nomes.length)];
        const emailUnico = `cliente${Date.now()}${Math.floor(Math.random() * 10000)}@email.com`;
        const telefonGerado = `(${Math.floor(Math.random() * 89 + 11)}) 9${Math.floor(Math.random() * 90000000 + 10000000)}`;
        
        await createMutation.mutateAsync({
          nome: `${clienteNome} ${Math.floor(Math.random() * 10000)}`,
          email: emailUnico,
          telefone: telefonGerado,
        });
        
        sucessos++;
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error('Erro ao criar cliente:', error);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    setIsGenerating(false);
  };

  return (
    <section className="p-8 bg-green-50 rounded-lg mb-8">
      <h2 className="text-3xl font-bold mb-6 text-green-900">👥 Cadastro de Clientes</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário Manual */}
        <form onSubmit={handleCreateManual} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-900">Cadastro Manual</h3>
          
          <input
            type="text"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <input
            type="tel"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-green-600 text-white p-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
          >
            {createMutation.isPending ? 'Criando...' : 'Cadastrar Cliente'}
          </button>
        </form>

        {/* Geração Automática */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-slate-900">Geração Automática</h3>
          <p className="text-slate-900 mb-4">
            Clique para gerar 5 clientes aleatoriamente com dados automáticos.
          </p>
          
          <button
            onClick={handleGenerateAuto}
            disabled={isGenerating || createMutation.isPending}
            className="w-full bg-emerald-600 text-white p-3 rounded font-semibold hover:bg-emerald-700 disabled:bg-gray-400 mb-4"
          >
            {isGenerating ? 'Gerando clientes...' : 'Gerar 5 Clientes Automáticos'}
          </button>

          {createMutation.isError && (
            <p className="text-red-900 text-sm mb-2">Erro ao criar cliente</p>
          )}
          {createMutation.isSuccess && (
            <p className="text-green-900 text-sm">Cliente criado com sucesso!</p>
          )}
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-slate-900">Clientes Cadastrados</h3>
        
        {isLoading ? (
          <p className="text-slate-900">Carregando clientes...</p>
        ) : clientes && clientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b-2">
                <tr>
                  <th className="p-2 text-left text-slate-900">ID</th>
                  <th className="p-2 text-left text-slate-900">Nome</th>
                  <th className="p-2 text-left text-slate-900">Email</th>
                  <th className="p-2 text-left text-slate-900">Telefone</th>
                </tr>
              </thead>
              <tbody>
                {(clientes as ClienteData[]).map((cliente: ClienteData) => (
                  <tr key={cliente.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 text-slate-900">{cliente.id}</td>
                    <td className="p-2 font-semibold text-slate-900">{cliente.nome}</td>
                    <td className="p-2 text-slate-900">{cliente.email}</td>
                    <td className="p-2 text-slate-900">{cliente.telefone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-900">Nenhum cliente cadastrado</p>
        )}
      </div>
    </section>
  );
}
