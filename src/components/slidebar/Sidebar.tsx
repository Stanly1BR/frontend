"use client";

import Link from "next/link";
import UserProfile from "./UserProfile";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Overlay escuro de fundo para Mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Container da Sidebar com animação de deslize */}
            <aside className={`fixed top-0 left-0 z-50 w-[280px] h-screen bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}>
                
                <div className="p-6">
                    
                    <div className="flex justify-between items-center mb-10 pl-2">
                        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tight">
                            Clinica<span className="text-[#D4AF37]">Médica</span>
                        </h2>
                        
                        {/* Botão de Fechar (Visível apenas no Mobile) */}
                        <button 
                            onClick={onClose} 
                            className="lg:hidden p-1 text-zinc-500 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <nav className="space-y-2 w-full">
                        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-white bg-zinc-900/0 hover:bg-zinc-900/40 rounded-lg transition-all group w-full border border-transparent hover:border-zinc-800">
                            <svg className="w-5 h-5 text-zinc-500 group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            <span className="font-medium text-sm">Home</span>
                        </Link>
                        
                        <Link href="/historico" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-white bg-zinc-900/0 hover:bg-zinc-900/40 rounded-lg transition-all group w-full border border-transparent hover:border-zinc-800">
                            <svg className="w-5 h-5 text-zinc-500 group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <span className="font-medium text-sm">Histórico</span>
                        </Link>
                        
                        <Link href="/configuracao" className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-white bg-zinc-900/0 hover:bg-zinc-900/40 rounded-lg transition-all group w-full border border-transparent hover:border-zinc-800">
                            <svg className="w-5 h-5 text-zinc-500 group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            <span className="font-medium text-sm">Configurações</span>
                        </Link>
                    </nav>
                </div>

                <UserProfile />
                
            </aside>
        </>
    );
}