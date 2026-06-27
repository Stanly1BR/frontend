// components/configuracao/ViewConfiguracao.tsx
"use client";

import { useAuth } from "@/hooks/auth.hook";
import MedicoConfig from "./MedicoConfig";
import PacienteConfig from "./PacienteConfig";

export default function ViewConfiguracao() {
    const { user } = useAuth();
    
    if (!user || !user.userId) {
        return (
            <div className="flex justify-center items-center h-64 animate-in fade-in">
                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const tipoConta = user.tipo; // 'medico' ou 'paciente'
    const userId = user.userId;

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 p-6">
            <div className="text-center mb-8 border-b border-zinc-800/80 pb-6">
                <h2 className="text-3xl font-bold text-white tracking-tight">Configurações de Perfil</h2>
                <p className="text-zinc-400 mt-2 text-sm">Visualize e atualize suas informações no sistema</p>
            </div>

            

            {tipoConta === 'medico' && <MedicoConfig userId={userId} />}
            {tipoConta === 'paciente' && <PacienteConfig userId={userId} />}
            
            {!tipoConta && (
                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                    <p className="text-red-400 font-medium">Não foi possível identificar o tipo da sua conta.</p>
                    <p className="text-red-400/80 text-sm mt-1">Por favor, faça login novamente.</p>
                </div>
            )}
        </div>
    );
}