"use client";

import { useState } from "react";
// Importando os hooks separadamente
import { usePaciente, useBuscarPacientePorId } from "@/hooks/paciente.hook";

interface PacienteConfigProps {
    userId: string;
}

export default function PacienteConfig({ userId }: PacienteConfigProps) {
    // Chamada do hook na raiz do componente
    const { data: paciente, isLoading, isError } = useBuscarPacientePorId(userId);

    if (isLoading) {
        return <div className="text-[#D4AF37] text-center py-10 animate-pulse font-medium">Carregando dados do paciente...</div>;
    }

    if (isError || !paciente) {
        return <div className="text-red-400 text-center py-10 bg-red-500/10 rounded-xl border border-red-500/20">Erro ao carregar o perfil. Verifique se o cadastro foi concluído.</div>;
    }

    return <PacienteFormInner paciente={paciente} />;
}

function PacienteFormInner({ paciente }: { paciente: any }) {
    const { atualizarPaciente } = usePaciente();
    const [isSaved, setIsSaved] = useState(false);

    const [formData, setFormData] = useState(() => {
        const dataFormatada = new Date(paciente.dataNascimento).toISOString().split('T')[0];
        
        return {
            nome: paciente.nome,
            cpf: paciente.cpf,
            dataNascimento: dataFormatada,
            telefone: paciente.telefone
        };
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const dadosParaSalvar = {
            ...formData,
            dataNascimento: new Date(formData.dataNascimento + 'T12:00:00') 
        };
        
        atualizarPaciente({ id: paciente.id, data: dadosParaSalvar });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/40 border border-zinc-800 p-8 rounded-xl shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-zinc-950 border border-[#D4AF37] flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-white">Dados do Paciente</h3>
                    <p className="text-xs text-zinc-500">Gerencie suas informações de contato e documentação</p>
                </div>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Nome Completo</label>
                    <input 
                        type="text" 
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                        required
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">CPF</label>
                        <input 
                            type="text" 
                            maxLength={11}
                            value={formData.cpf}
                            onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Nascimento</label>
                        <input 
                            type="date" 
                            value={formData.dataNascimento}
                            onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                            required
                            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all [color-scheme:dark]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Telefone</label>
                        <input 
                            type="text" 
                            maxLength={11}
                            value={formData.telefone}
                            onChange={(e) => setFormData({...formData, telefone: e.target.value})}
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