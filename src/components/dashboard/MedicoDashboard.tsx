"use client";

import { useMemo, useState } from "react";
import { useConsulta } from "@/hooks/consulta.hook";
import { useBuscarMedicoPorId } from "@/hooks/medico.hook";
import { useBuscarPacientePorId } from "@/hooks/paciente.hook";

interface ConsultaDetalhada {
    id: string;
    data: string;
    horario: string;
    motivo: string;
    status: "agendada" | "cancelada" | "concluida";
    pacienteId: string;
    pacienteNome?: string;
    medicoId: string;
}

export default function MedicoDashboard({ userId }: { userId: string }) {
    const { data: medico, isLoading: loadingMedico } = useBuscarMedicoPorId(userId);
    const { buscarTodasConsultas, atualizarConsulta } = useConsulta();
    
    const [selectedTab, setSelectedTab] = useState<"hoje" | "proximas">("hoje");
    const [expandedConsultaId, setExpandedConsultaId] = useState<string | null>(null);

    const { data: todasConsultas, isLoading: loadingConsultas } = buscarTodasConsultas;

    // Obter data de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Filtrar consultas do médico
    const consultasMedico = useMemo(() => {
        if (!todasConsultas) return [];
        return todasConsultas.filter(c => c.medicoId === userId);
    }, [todasConsultas, userId]);

    // Consultas de hoje
    const consultasHoje = useMemo(() => {
        return consultasMedico.filter(c => {
            const dataConsulta = new Date(c.data);
            dataConsulta.setHours(0, 0, 0, 0);
            return dataConsulta.getTime() === hoje.getTime() && c.status !== "cancelada";
        }).sort((a, b) => a.horario.localeCompare(b.horario));
    }, [consultasMedico, hoje]);

    // Próximas consultas
    const proximasConsultas = useMemo(() => {
        const amanha = new Date(hoje);
        amanha.setDate(amanha.getDate() + 1);
        return consultasMedico
            .filter(c => {
                const dataConsulta = new Date(c.data);
                dataConsulta.setHours(0, 0, 0, 0);
                return dataConsulta >= amanha && c.status !== "cancelada";
            })
            .sort((a, b) => {
                const dataA = new Date(a.data).getTime();
                const dataB = new Date(b.data).getTime();
                return dataA - dataB;
            })
            .slice(0, 5);
    }, [consultasMedico, hoje]);

    // Estatísticas
    const stats = useMemo(() => {
        return {
            totalConsultas: consultasMedico.length,
            consultasHoje: consultasHoje.length,
            consultasProximas: proximasConsultas.length,
            consultasConcluidas: consultasMedico.filter(c => c.status === "concluida").length,
            consultasCanceladas: consultasMedico.filter(c => c.status === "cancelada").length,
        };
    }, [consultasMedico, consultasHoje, proximasConsultas]);

    const handleMarcarConcluida = async (consultaId: string) => {
        try {
            atualizarConsulta({
                id: consultaId,
                data: { status: "concluida" }
            });
        } catch (error) {
            console.error("Erro ao marcar como concluída:", error);
        }
    };

    const handleCancelarConsulta = async (consultaId: string) => {
        try {
            atualizarConsulta({
                id: consultaId,
                data: { status: "cancelada" }
            });
        } catch (error) {
            console.error("Erro ao cancelar consulta:", error);
        }
    };

    if (loadingMedico) {
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
                    Bem-vindo, Dr(a). {medico?.nome?.split(" ")[0]}! 👋
                </h1>
                <p className="text-zinc-400 text-lg">{medico?.especialidade}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <StatCard
                    icon="📊"
                    title="Total de Consultas"
                    value={stats.totalConsultas.toString()}
                    color="from-blue-500"
                />
                <StatCard
                    icon="📅"
                    title="Hoje"
                    value={stats.consultasHoje.toString()}
                    color="from-[#D4AF37]"
                    highlight
                />
                <StatCard
                    icon="⏰"
                    title="Próximas"
                    value={stats.consultasProximas.toString()}
                    color="from-purple-500"
                />
                <StatCard
                    icon="✅"
                    title="Concluídas"
                    value={stats.consultasConcluidas.toString()}
                    color="from-green-500"
                />
                <StatCard
                    icon="❌"
                    title="Canceladas"
                    value={stats.consultasCanceladas.toString()}
                    color="from-red-500"
                />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800">
                <button
                    onClick={() => setSelectedTab("hoje")}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                        selectedTab === "hoje"
                            ? "bg-[#D4AF37] text-black shadow-lg"
                            : "text-zinc-300 hover:text-white"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Consultas de Hoje ({stats.consultasHoje})
                    </div>
                </button>
                <button
                    onClick={() => setSelectedTab("proximas")}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                        selectedTab === "proximas"
                            ? "bg-[#D4AF37] text-black shadow-lg"
                            : "text-zinc-300 hover:text-white"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Próximas ({stats.consultasProximas})
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {loadingConsultas ? (
                    <div className="flex justify-center py-10">
                        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : selectedTab === "hoje" ? (
                    <ConsultasSection
                        title="Consultas de Hoje"
                        consultas={consultasHoje}
                        isEmpty={consultasHoje.length === 0}
                        emptyMessage="Nenhuma consulta agendada para hoje"
                        expandedId={expandedConsultaId}
                        onToggleExpand={setExpandedConsultaId}
                        onMarcarConcluida={handleMarcarConcluida}
                        onCancelar={handleCancelarConsulta}
                        isPastDay={false}
                    />
                ) : (
                    <ConsultasSection
                        title="Próximas Consultas"
                        consultas={proximasConsultas}
                        isEmpty={proximasConsultas.length === 0}
                        emptyMessage="Nenhuma consulta agendada"
                        expandedId={expandedConsultaId}
                        onToggleExpand={setExpandedConsultaId}
                        onMarcarConcluida={handleMarcarConcluida}
                        onCancelar={handleCancelarConsulta}
                        isPastDay={false}
                    />
                )}
            </div>
        </div>
    );
}

// Componente de Card de Estatística
function StatCard({
    icon,
    title,
    value,
    color,
    highlight
}: {
    icon: string;
    title: string;
    value: string;
    color: string;
    highlight?: boolean;
}) {
    return (
        <div className={`bg-gradient-to-br ${color} to-transparent rounded-lg p-4 border ${highlight ? "border-[#D4AF37] bg-[#D4AF37]/20" : "border-zinc-800"}`}>
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-zinc-400 text-xs font-medium uppercase">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${highlight ? "text-[#D4AF37]" : "text-white"}`}>{value}</p>
        </div>
    );
}

// Componente de Seção de Consultas
function ConsultasSection({
    title,
    consultas,
    isEmpty,
    emptyMessage,
    expandedId,
    onToggleExpand,
    onMarcarConcluida,
    onCancelar,
    isPastDay
}: {
    title: string;
    consultas: any[];
    isEmpty: boolean;
    emptyMessage: string;
    expandedId: string | null;
    onToggleExpand: (id: string | null) => void;
    onMarcarConcluida: (id: string) => void;
    onCancelar: (id: string) => void;
    isPastDay: boolean;
}) {
    if (isEmpty) {
        return (
            <div className="text-center py-10 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                <svg className="w-12 h-12 text-zinc-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-zinc-400 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {consultas.map((consulta) => (
                <div
                    key={consulta.id}
                    className="bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all"
                >
                    {/* Header - Clicável */}
                    <button
                        onClick={() => onToggleExpand(expandedId === consulta.id ? null : consulta.id)}
                        className="w-full text-left p-5 flex items-center gap-4 hover:bg-zinc-800/30 transition-all"
                    >
                        {/* Hora */}
                        <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center flex-shrink-0">
                            <span className="text-[#D4AF37] font-bold text-sm">{consulta.horario}</span>
                        </div>

                        {/* Info Principal */}
                        <div className="flex-1">
                            <p className="text-white font-semibold text-lg">{consulta.motivo}</p>
                            <p className="text-zinc-400 text-sm">{new Date(consulta.data).toLocaleDateString("pt-BR")}</p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                consulta.status === "agendada"
                                    ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                    : consulta.status === "concluida"
                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                            }`}>
                                {consulta.status}
                            </span>
                            <svg
                                className={`w-5 h-5 text-zinc-400 transition-transform ${expandedId === consulta.id ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </button>

                    {/* Detalhes Expandidos */}
                    {expandedId === consulta.id && (
                        <div className="border-t border-zinc-800 p-5 space-y-4 bg-zinc-950/40">
                            {/* Info do Paciente */}
                            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-4">
                                <p className="text-xs text-zinc-500 uppercase font-semibold mb-2">Paciente</p>
                                <p className="text-white font-medium">{consulta.pacienteNome || "Paciente"}</p>
                                <p className="text-zinc-400 text-sm mt-1">ID: {consulta.pacienteId.substring(0, 8)}...</p>
                            </div>

                            {/* Motivo detalhado */}
                            <div>
                                <p className="text-xs text-zinc-500 uppercase font-semibold mb-2">Motivo da Consulta</p>
                                <p className="text-white">{consulta.motivo}</p>
                            </div>

                            {/* Nota - Anotações */}
                            <div>
                                <label className="block text-xs text-zinc-500 uppercase font-semibold mb-2">Anotações</label>
                                <textarea
                                    placeholder="Adicione suas anotações sobre a consulta..."
                                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Ações */}
                            {consulta.status === "agendada" && (
                                <div className="flex gap-2 pt-2 border-t border-zinc-800">
                                    <button
                                        onClick={() => onMarcarConcluida(consulta.id)}
                                        className="flex-1 py-2 px-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded text-sm font-medium hover:bg-green-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Marcar como Concluída
                                    </button>
                                    <button
                                        onClick={() => onCancelar(consulta.id)}
                                        className="flex-1 py-2 px-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded text-sm font-medium hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancelar
                                    </button>
                                </div>
                            )}
                            {consulta.status === "concluida" && (
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm">
                                    ✓ Consulta concluída com sucesso
                                </div>
                            )}
                            {consulta.status === "cancelada" && (
                                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                                    ✗ Consulta cancelada
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
