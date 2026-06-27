"use client";

import { useState } from "react";
// Importando os hooks separadamente
import { useMedico, useBuscarMedicoPorId } from "@/hooks/medico.hook";

interface MedicoConfigProps {
    userId: string;
}

export default function MedicoConfig({ userId }: MedicoConfigProps) {
    // Chamada do hook na raiz do componente
    const { data: medico, isLoading, isError } = useBuscarMedicoPorId(userId);

    if (isLoading) {
        return <div className="text-[#D4AF37] text-center py-10 animate-pulse font-medium">Carregando dados do médico...</div>;
    }

    if (isError || !medico) {
        return <div className="text-red-400 text-center py-10 bg-red-500/10 rounded-xl border border-red-500/20">Erro ao carregar o perfil. Verifique se o cadastro foi concluído.</div>;
    }

    return <MedicoFormInner medico={medico} />;
}

function MedicoFormInner({ medico }: { medico: any }) {
    const { atualizarMedico } = useMedico();
    const [isSaved, setIsSaved] = useState(false);

    const [formData, setFormData] = useState({
        nome: medico.nome,
        crm: medico.crm,
        especialidade: medico.especialidade
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        atualizarMedico({ id: medico.id, data: formData });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/40 border border-zinc-800 p-8 rounded-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-zinc-950 border border-[#D4AF37] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white">Perfil Médico</h3>
                    <p className="text-xs text-zinc-500">Mantenha seu CRM e especialidade atualizados</p>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Nome de Exibição</label>
                    <input 
                        type="text" 
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">CRM</label>
                        <input 
                            type="text" 
                            maxLength={10}
                            value={formData.crm}
                            onChange={(e) => setFormData({...formData, crm: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all uppercase"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Especialidade</label>
                        <input 
                            type="text" 
                            maxLength={100}
                            value={formData.especialidade}
                            onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-4 border-t border-zinc-800/80">
                {isSaved && <span className="text-[#D4AF37] text-sm animate-pulse">Alterações salvas com sucesso!</span>}
                <button 
                    type="submit" 
                    className="py-3 px-8 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold rounded-lg transition-all duration-300"
                >
                    Salvar Alterações
                </button>
            </div>
        </form>
    );
}