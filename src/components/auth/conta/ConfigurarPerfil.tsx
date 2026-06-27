"use client";

import { useState } from "react";
import PacienteForm from "./PacienteForm";
import MedicoForm from "./MedicoForm";
import type { RegisterDTO } from "@/schemas/auth.schema";

interface ConfigurarPerfilProps {
    authData: Omit<RegisterDTO, 'tipo'>;
}

export default function ConfigurarPerfil({ authData }: ConfigurarPerfilProps) {
    const [tipoConta, setTipoConta] = useState<'paciente' | 'medico' | null>(null);

    if (tipoConta === 'paciente') {
        return <PacienteForm authData={authData} onBack={() => setTipoConta(null)} />;
    }

    if (tipoConta === 'medico') {
        return <MedicoForm authData={authData} onBack={() => setTipoConta(null)} />;
    }

    return (
        <div className="w-[100%] max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">Finalize seu cadastro</h2>
                <p className="text-zinc-400 mt-2 text-sm">Olá, {authData.nome.split(' ')[0]}! Como você deseja utilizar nossa plataforma?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <button 
                    onClick={() => setTipoConta('paciente')}
                    className="flex flex-col items-center justify-center p-8 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-[#D4AF37] hover:bg-zinc-900/80 transition-all duration-300 group text-left w-[100%]"
                >
                    <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4 group-hover:border-[#D4AF37] transition-colors">
                        <svg className="w-8 h-8 text-zinc-400 group-hover:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Sou Paciente</h3>
                    <p className="text-sm text-zinc-500 text-center">Quero agendar consultas e acompanhar meu histórico médico.</p>
                </button>

                <button 
                    onClick={() => setTipoConta('medico')}
                    className="flex flex-col items-center justify-center p-8 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-[#D4AF37] hover:bg-zinc-900/80 transition-all duration-300 group text-left w-[100%]"
                >
                    <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-4 group-hover:border-[#D4AF37] transition-colors">
                        <svg className="w-8 h-8 text-zinc-400 group-hover:text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Sou Médico</h3>
                    <p className="text-sm text-zinc-500 text-center">Quero gerenciar meus atendimentos, pacientes e receitas.</p>
                </button>
            </div>
        </div>
    );
}