"use client";

import { useAuth } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { AuthSession } from "@/utils/auth-session";

export default function UserProfile() {
    const { logout } = useAuth();
    const router = useRouter();

    // 1. ESTADO REATIVO (Escutando o evento auth-change em tempo real)
    const [isLogged, setIsLogged] = useState(false);
    // Nota: Garanta que sua API e seu AuthResponseDTO retornem 'nome' e 'tipo' 
    // além do token e userId para o dinamismo funcionar por completo!
    const [userData, setUserData] = useState<any>(null); 

    useEffect(() => {
        // Define o estado na montagem
        setIsLogged(AuthSession.isAuthenticated());
        setUserData(AuthSession.get());

        // Inscreve o componente para ouvir mudanças de sessão (Login/Logout)
        const unsubscribe = AuthSession.subscribe((session) => {
            setIsLogged(!!session);
            setUserData(session);
        });

        return () => unsubscribe();
    }, []);

    // 2. LÓGICA DE MENU (Inspirada no seu user-menu)
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeInstant();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openMenu = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
    };

    const closeDelayed = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 300); // 300ms garante que o mouse passe para o submenu sem fechar
    };

    function closeInstant() {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(false);
    }

    const handleLogout = () => {
        logout();
        closeInstant();
    };

    // 3. DADOS DINÂMICOS
    const nomeExibicao = isLogged ? (userData?.nome || "Usuário Logado") : "Visitante";
    
    const roleExibicao = isLogged 
        ? (userData?.tipo === 'medico' ? 'Médico' : userData?.tipo === 'paciente' ? 'Paciente' : "Acesso Restrito") 
        : "Faça login para continuar";

    // Pega as iniciais (ex: "S" e "A" de um nome completo)
    const getIniciais = (nome: string) => {
        if (!isLogged) return "?";
        const partes = nome.trim().split(" ");
        if (partes.length > 1) {
            return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
        }
        return nome.substring(0, 2).toUpperCase();
    };

    return (
        <div 
            className="relative w-full p-4 border-t border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900/50 transition-colors duration-300 cursor-pointer"
            ref={menuRef}
            onMouseEnter={openMenu}
            onMouseLeave={closeDelayed}
            onClick={() => isOpen ? closeDelayed() : openMenu()}
        >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-[#D4AF37]/50 flex items-center justify-center overflow-hidden shrink-0">
                    <span className="text-[#D4AF37] font-bold text-sm tracking-wider">
                        {getIniciais(nomeExibicao)}
                    </span>
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                        {nomeExibicao}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                        {roleExibicao}
                    </p>
                </div>
            </div>

            <div 
                className={`absolute left-0 bottom-full w-full pb-2 transition-all duration-300 z-50 transform ${
                    isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                }`}
            >
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 shadow-2xl shadow-black/50 mx-4">
                    {isLogged ? (
                        <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-md transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Deslogar do sistema
                        </button>
                    ) : (
                        <button 
                            onClick={() => {
                                closeInstant();
                                router.push('/auth');
                            }} 
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#D4AF37] hover:text-yellow-400 hover:bg-[#D4AF37]/10 rounded-md transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                            Entrar no sistema
                        </button>
                    )}
                </div>
            </div>
            
        </div>
    );
}