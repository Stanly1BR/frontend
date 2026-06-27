"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const authRoutes = ["/auth", "/recuperar-senha", "/reset-password"];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  return (
    <div className="flex min-h-screen w-full bg-zinc-950">
      
      {/* Cabeçalho Mobile (Visível apenas em telas menores) */}
      {!isAuthRoute && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 flex items-center px-4 z-40">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <h2 className="ml-2 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tight">
            Clinica<span className="text-[#D4AF37]">Médica</span>
          </h2>
        </div>
      )}

      {/* Sidebar recebendo o estado */}
      {!isAuthRoute && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
      )}
      
      {/* Ajuste de margens: ml-0 no mobile, ml-[280px] no desktop (lg) */}
      <main
        className={`flex-1 transition-all duration-300 ${
          isAuthRoute 
            ? "w-full p-0" 
            : "w-full lg:ml-[280px] p-6 pt-24 lg:pt-6" // pt-24 no mobile para não ficar atrás do cabeçalho
        }`}
      >
        {children}
      </main>
    </div>
  );
}