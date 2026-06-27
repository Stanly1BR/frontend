"use client";

import { useState, useMemo } from "react";
import { useConsulta } from "@/hooks/consulta.hook";
import { useMedico } from "@/hooks/medico.hook";
import { useBuscarPacientePorId } from "@/hooks/paciente.hook";

interface FormData {
    medicoId: string;
    data: string;
    horario: string;
    motivo: string;
}

export default function PacienteDashboard({ userId }: { userId: string }) {
    const { criarConsultaAsync } = useConsulta();
    const { buscarTodosMedicos } = useMedico();
    const { data: paciente, isLoading: loadingPaciente } = useBuscarPacientePorId(userId);
    
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    const [formData, setFormData] = useState<FormData>({
        medicoId: "",
        data: "",
        horario: "",
        motivo: ""
    });

    const { data: medicos, isLoading: loadingMedicos } = buscarTodosMedicos;

    // Próximas consultas
    const { buscarTodasConsultas } = useConsulta();
    const { data: todasConsultas } = buscarTodasConsultas;
    
    const proximasConsultas = useMemo(() => {
        if (!todasConsultas) return [];
        const agora = new Date();
        return todasConsultas
            .filter(c => c.pacienteId === userId && c.status === "agendada" && new Date(c.data) >= agora)
            .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
            .slice(0, 3);
    }, [todasConsultas, userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.medicoId || !formData.data || !formData.horario || !formData.motivo) {
            setErrorMessage("Por favor, preencha todos os campos!");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            await criarConsultaAsync({
                pacienteId: userId,
                medicoId: formData.medicoId,
                data: new Date(formData.data),
                horario: formData.horario,
                motivo: formData.motivo,
                status: "agendada"
            });

            setSuccessMessage("Consulta agendada com sucesso!");
            setFormData({ medicoId: "", data: "", horario: "", motivo: "" });
            setTimeout(() => {
                setShowModal(false);
                setSuccessMessage("");
            }, 2000);
        } catch (error) {
            setErrorMessage("Erro ao agendar consulta. Tente novamente.");
            console.error("Erro:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingPaciente) {
        return (
            <div className="w-full max-w-5xl mx-auto p-6 flex justify-center items-center h-96">
                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300 p-6">
            {/* Header */}
            <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white">
                    Bem-vindo, {paciente?.nome?.split(" ")[0]}! 👋
                </h1>
                <p className="text-zinc-400 text-lg">Gerencie suas consultas e saúde</p>
            </div>

            {/* Grid Principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card - Nova Consulta */}
                <div className="md:col-span-1 bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 border border-[#D4AF37]/30 rounded-xl p-6 hover:border-[#D4AF37]/50 transition-all cursor-pointer"
                     onClick={() => setShowModal(true)}>
                    <div className="flex items-center gap-4 h-full">
                        <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
                            <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Agendar Consulta</h3>
                            <p className="text-[#D4AF37] text-sm">Reserve sua próxima consulta</p>
                        </div>
                    </div>
                </div>

                {/* Card - Consultas Agendadas */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-zinc-400 text-sm mb-2">Próximas Consultas</p>
                    <p className="text-white text-3xl font-bold">{proximasConsultas.length}</p>
                    <p className="text-blue-400 text-xs mt-2">Agendadas para você</p>
                </div>

                {/* Card - Saúde */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-zinc-400 text-sm mb-2">Status de Saúde</p>
                    <p className="text-white text-2xl font-bold">Ativo</p>
                    <p className="text-green-400 text-xs mt-2">Tudo em dia com o acompanhamento</p>
                </div>
            </div>

            {/* Próximas Consultas */}
            <div className="space-y-4">
                <div className="border-b border-zinc-800 pb-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Próximas Consultas
                    </h2>
                </div>

                {proximasConsultas.length === 0 ? (
                    <div className="text-center py-12 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                        <svg className="w-16 h-16 text-zinc-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-zinc-400 text-lg font-medium">Você não tem consultas agendadas</p>
                        <p className="text-zinc-500 text-sm mt-1">Clique em "Agendar Consulta" para marcar sua próxima visita</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {proximasConsultas.map((consulta) => (
                            <div key={consulta.id} className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-5 hover:border-[#D4AF37]/30 transition-all">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-white font-semibold">{new Date(consulta.data).toLocaleDateString("pt-BR")}</p>
                                                <span className="text-[#D4AF37] font-mono text-sm">às {consulta.horario}</span>
                                            </div>
                                            <p className="text-zinc-400 text-sm mb-2">{consulta.motivo}</p>
                                            <div className="inline-block px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-xs font-medium">
                                                {consulta.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal - Agendar Consulta */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-white">Agendar Consulta</h2>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Messages */}
                            {successMessage && (
                                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                                    <p className="text-green-400 font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {successMessage}
                                    </p>
                                </div>
                            )}
                            {errorMessage && (
                                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                                    <p className="text-red-400 font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0-6a4 4 0 100 8 4 4 0 000-8z" />
                                        </svg>
                                        {errorMessage}
                                    </p>
                                </div>
                            )}

                            {/* Médico */}
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-3">Escolha o Médico</label>
                                {loadingMedicos ? (
                                    <div className="flex justify-center py-4">
                                        <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : !medicos || medicos.length === 0 ? (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <p className="text-yellow-400 text-sm">Nenhum médico disponível no momento</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-3">
                                        {medicos.map((medico) => (
                                            <label
                                                key={medico.id}
                                                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                                                    formData.medicoId === medico.id
                                                        ? "bg-[#D4AF37]/20 border-[#D4AF37]"
                                                        : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="medico"
                                                    value={medico.id}
                                                    checked={formData.medicoId === medico.id}
                                                    onChange={(e) => setFormData({ ...formData, medicoId: e.target.value })}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-white font-medium">{medico.nome}</p>
                                                    <p className="text-zinc-400 text-sm">{medico.especialidade}</p>
                                                    <p className="text-[#D4AF37] text-xs font-mono mt-1">CRM: {medico.crm}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Data e Horário */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Data</label>
                                    <input
                                        type="date"
                                        value={formData.data}
                                        onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-2">Horário</label>
                                    <input
                                        type="time"
                                        value={formData.horario}
                                        onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Motivo */}
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">Motivo da Consulta</label>
                                <textarea
                                    value={formData.motivo}
                                    onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
                                    required
                                    placeholder="Descreva o motivo da sua consulta..."
                                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                                    rows={4}
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-zinc-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#D4AF37]/90 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                            Agendando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Agendar Consulta
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
