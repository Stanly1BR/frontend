"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/auth.hook";
import { usePaciente } from "@/hooks/paciente.hook";
import type { RegisterDTO } from "@/schemas/auth.schema";
import { useRouter } from "next/navigation";

interface PacienteFormProps {
    authData: Omit<RegisterDTO, 'tipo'>;
    onBack: () => void;
}

export default function PacienteForm({ authData, onBack }: PacienteFormProps) {
    const router = useRouter();
    const { registerAsync } = useAuth();
    const { criarPacienteAsync } = usePaciente();

    const [cpf, setCpf] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [telefone, setTelefone] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const authResponse = await registerAsync({ ...authData, tipo: 'paciente' });

            await criarPacienteAsync({
                nome: authData.nome,
                cpf,
                dataNascimento: new Date(dataNascimento),
                telefone,
                authId: authResponse.authId
            });

            router.push('/');
        } catch (error) {
            console.error("Erro ao registrar paciente:", error);
        }
    };

    return (
        <div className="w-[100%] max-w-md mx-auto space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">Dados do Paciente</h2>
                <p className="text-zinc-400 mt-2 text-sm">Preencha as informações abaixo para continuar</p>
            </div>

            <form className="space-y-5 w-[100%]" onSubmit={handleSubmit}>
                <div className="w-[100%]">
                    <label className="block text-sm font-medium text-zinc-300 mb-1">CPF (Apenas números)</label>
                    <input 
                        type="text" 
                        maxLength={11}
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                        placeholder="00000000000"
                        className="w-[100%] px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                </div>
                
                <div className="w-[100%]">
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Data de Nascimento</label>
                    <input 
                        type="date" 
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        required
                        className="w-[100%] px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all [color-scheme:dark]"
                    />
                </div>

                <div className="w-[100%]">
                    <label className="block text-sm font-medium text-zinc-300 mb-1">Telefone (Com DDD)</label>
                    <input 
                        type="text" 
                        maxLength={11}
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        required
                        placeholder="11999999999"
                        className="w-[100%] px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                </div>
                
                <div className="flex gap-4 mt-6">
                    <button 
                        type="button"
                        onClick={onBack}
                        className="w-[30%] py-3 px-4 bg-transparent border border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                        Voltar
                    </button>
                    <button 
                        type="submit" 
                        className="w-[70%] py-3 px-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                    >
                        Cadastrar
                    </button>
                </div>
            </form>
        </div>
    );
}