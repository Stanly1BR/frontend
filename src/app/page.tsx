'use client';

import ProdutoSection from '@/components/produto';
import ClienteSection from '@/components/cliente';
import RelatorioPedidosSection from '@/components/relatorioPedidos';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 mb-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2 text-white">🛍️ Sistema de Gestão de Vendas</h1>
        <p className="text-white">Cadastro automático de produtos, clientes, pedidos e relatórios</p>
      </header>

      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Seção de Produtos */}
        <ProdutoSection />

        {/* Seção de Clientes */}
        <ClienteSection />

        {/* Seção de Pedidos e Relatórios */}
        <RelatorioPedidosSection />

        {/* Footer */}
        <footer className="mt-12 p-8 bg-white rounded-lg shadow text-center text-slate-900">
          <p>© 2024 Sistema de Gestão de Vendas - Desenvolvido com Next.js + React Query</p>
        </footer>
      </div>
    </main>
  );
}
