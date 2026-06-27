"use client";

import { useState, useMemo } from "react";
import { useConsulta } from "@/hooks/consulta.hook";
import { useDiagnostico } from "@/hooks/diagnostico.hook";
import { useBuscarMedicoPorId } from "@/hooks/medico.hook";
import { useBuscarPacientePorId } from "@/hooks/paciente.hook";
import { useAuth } from "@/hooks/auth.hook";

type TabType = "consultas" | "diagnosticos";

interface ConfirmDialogState {
    isOpen: boolean;
    type: "consulta" | "diagnostico";
    id: string;
    title: string;
}

interface RescheduleModalState {
    isOpen: boolean;
    consultaId: string;
    novaData: string;
    novoHorario: string;
}

export default function ViewHistorico() {
    const { user } = useAuth();
    const { buscarTodasConsultas, atualizarConsulta, deletarConsulta } = useConsulta();
    const { buscarTodosDiagnosticos, deletarDiagnostico } = useDiagnostico();
    
    const [activeTab, setActiveTab] = useState<TabType>("consultas");
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
        isOpen: false,
        type: "consulta",
        id: "",
        title: ""
    });
    const [rescheduleModal, setRescheduleModal] = useState<RescheduleModalState>({
        isOpen: false,
        consultaId: "",
        novaData: "",
        novoHorario: ""
    });

    const { data: consultas, isLoading: loadingConsultas } = buscarTodasConsultas;
    const { data: diagnosticos, isLoading: loadingDiagnosticos } = buscarTodosDiagnosticos;

    // Filtrar consultas do usuário
    const minhasConsultas = useMemo(() => {
        if (!consultas || !user) return [];
        return consultas.filter(c => 
            user.tipo === "paciente" ? c.pacienteId === user.userId : c.medicoId === user.userId
        );
    }, [consultas, user]);

    // Filtrar diagnósticos do usuário
    const meusDiagnosticos = useMemo(() => {
        if (!diagnosticos || !user) return [];
        return diagnosticos.filter(d => d.pacienteId === user.userId);
    }, [diagnosticos, user]);

    const handleCancelarConsulta = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            type: "consulta",
            id,
            title: "Cancelar Consulta"
        });
    };

    const handleDeletarDiagnostico = (id: string) => {
        setConfirmDialog({
            isOpen: true,
            type: "diagnostico",
            id,
            title: "Excluir Diagnóstico"
        });
    };

    const handleConfirm = async () => {
        try {
            if (confirmDialog.type === "consulta") {
                atualizarConsulta({
                    id: confirmDialog.id,
                    data: { status: "cancelada" }
                });
            } else {
                deletarDiagnostico(confirmDialog.id);
            }
            setConfirmDialog({ isOpen: false, type: "consulta", id: "", title: "" });
        } catch (error) {
            console.error("Erro ao executar ação:", error);
        }
    };

    const handleReagendarClick = (consultaId: string, data: string, horario: string) => {
        setRescheduleModal({
            isOpen: true,
            consultaId,
            novaData: data,
            novoHorario: horario
        });
    };

    const handleSalvarReschedule = async () => {
        try {
            atualizarConsulta({
                id: rescheduleModal.consultaId,
                data: {
                    data: new Date(rescheduleModal.novaData),
                    horario: rescheduleModal.novoHorario
                }
            });
            setRescheduleModal({
                isOpen: false,
                consultaId: "",
                novaData: "",
                novoHorario: ""
            });
        } catch (error) {
            console.error("Erro ao reagendar:", error);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300 p-6">
            {/* Header */}
            <div className="text-center mb-8 border-b border-zinc-800/80 pb-6">
                <h2 className="text-3xl font-bold text-white tracking-tight">Histórico</h2>
                <p className="text-zinc-400 mt-2 text-sm">Visualize todas as suas consultas e diagnósticos</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-zinc-900/40 p-2 rounded-lg border border-zinc-800">
                <button
                    onClick={() => setActiveTab("consultas")}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                        activeTab === "consultas"
                            ? "bg-[#D4AF37] text-black shadow-lg"
                            : "text-zinc-300 hover:text-white"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Consultas ({minhasConsultas.length})
                    </div>
                </button>
                <button
                    onClick={() => setActiveTab("diagnosticos")}
                    className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                        activeTab === "diagnosticos"
                            ? "bg-[#D4AF37] text-black shadow-lg"
                            : "text-zinc-300 hover:text-white"
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Diagnósticos ({meusDiagnosticos.length})
                    </div>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {/* Consultas Tab */}
                {activeTab === "consultas" && (
                    <div className="space-y-4">
                        {loadingConsultas ? (
                            <div className="flex justify-center py-10">
                                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : minhasConsultas.length === 0 ? (
                            <div className="text-center py-10 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                                <svg className="w-12 h-12 text-zinc-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-zinc-400">Nenhuma consulta registrada</p>
                            </div>
                        ) : (
                            minhasConsultas.map((consulta) => (
                                <ConsultaCard
                                    key={consulta.id}
                                    consulta={consulta}
                                    userType={user?.tipo}
                                    onCancel={handleCancelarConsulta}
                                    onReschedule={handleReagendarClick}
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Diagnósticos Tab */}
                {activeTab === "diagnosticos" && (
                    <div className="space-y-4">
                        {loadingDiagnosticos ? (
                            <div className="flex justify-center py-10">
                                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : meusDiagnosticos.length === 0 ? (
                            <div className="text-center py-10 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                                <svg className="w-12 h-12 text-zinc-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-zinc-400">Nenhum diagnóstico registrado</p>
                            </div>
                        ) : (
                            meusDiagnosticos.map((diagnostico) => (
                                <DiagnosticoCard
                                    key={diagnostico.id}
                                    diagnostico={diagnostico}
                                    onDelete={handleDeletarDiagnostico}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Confirm Dialog */}
            {confirmDialog.isOpen && (
                <ConfirmDialog
                    title={confirmDialog.title}
                    message={`Tem certeza que deseja ${confirmDialog.type === "consulta" ? "cancelar esta consulta" : "excluir este diagnóstico"}?`}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmDialog({ isOpen: false, type: "consulta", id: "", title: "" })}
                />
            )}

            {/* Reschedule Modal */}
            {rescheduleModal.isOpen && (
                <RescheduleModal
                    novaData={rescheduleModal.novaData}
                    novoHorario={rescheduleModal.novoHorario}
                    onDataChange={(data) => setRescheduleModal({ ...rescheduleModal, novaData: data })}
                    onHorarioChange={(horario) => setRescheduleModal({ ...rescheduleModal, novoHorario: horario })}
                    onSave={handleSalvarReschedule}
                    onCancel={() => setRescheduleModal({ isOpen: false, consultaId: "", novaData: "", novoHorario: "" })}
                />
            )}
        </div>
    );
}

// Componente de Card de Consulta
function ConsultaCard({
    consulta,
    userType,
    onCancel,
    onReschedule
}: {
    consulta: any;
    userType?: string;
    onCancel: (id: string) => void;
    onReschedule: (id: string, data: string, horario: string) => void;
}) {
    const dataFormatada = new Date(consulta.data).toLocaleDateString("pt-BR");
    
    // CORREÇÃO: Definindo o mapeamento de cores como Record<string, string>
    const statusColorsMap: Record<string, string> = {
        agendada: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        cancelada: "bg-red-500/20 text-red-400 border-red-500/30",
        concluida: "bg-green-500/20 text-green-400 border-green-500/30"
    };

    // Acessando a cor de forma segura e garantindo um fallback
    const statusColor = statusColorsMap[consulta.status] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";

    return (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center">
                            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg">{dataFormatada} às {consulta.horario}</h3>
                            <p className="text-zinc-400 text-sm">{consulta.motivo}</p>
                        </div>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}>
                    {consulta.status ? consulta.status.charAt(0).toUpperCase() + consulta.status.slice(1) : "Desconhecido"}
                </span>
            </div>

            {/* Detalhes */}
            <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-zinc-800">
                <div>
                    <p className="text-xs text-zinc-500 uppercase">ID</p>
                    <p className="text-white text-sm font-mono">{consulta.id.substring(0, 8)}...</p>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 uppercase">Status</p>
                    <p className="text-white text-sm capitalize">{consulta.status}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
                {consulta.status === "agendada" && (
                    <>
                        <button
                            onClick={() => onReschedule(consulta.id, new Date(consulta.data).toISOString().split('T')[0], consulta.horario)}
                            className="flex-1 py-2 px-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-all text-sm font-medium"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Reagendar
                            </span>
                        </button>
                        <button
                            onClick={() => onCancel(consulta.id)}
                            className="flex-1 py-2 px-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancelar
                            </span>
                        </button>
                    </>
                )}
                {consulta.status === "cancelada" && (
                    <div className="text-xs text-red-400 py-2 text-center">Consulta cancelada</div>
                )}
                {consulta.status === "concluida" && (
                    <div className="text-xs text-green-400 py-2 text-center">Consulta concluída</div>
                )}
            </div>
        </div>
    );
}

// Componente de Card de Diagnóstico
function DiagnosticoCard({
    diagnostico,
    onDelete
}: {
    diagnostico: any;
    onDelete: (id: string) => void;
}) {
    const dataFormatada = new Date(diagnostico.dataDiagnostico).toLocaleDateString("pt-BR");

    return (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-all">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-lg">{diagnostico.descricao}</h3>
                            <p className="text-zinc-400 text-sm">{dataFormatada}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CID */}
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-zinc-500 uppercase mb-1">Código CID</p>
                <p className="text-[#D4AF37] font-mono font-bold text-lg">{diagnostico.cid}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
                <button
                    onClick={() => onDelete(diagnostico.id)}
                    className="flex-1 py-2 px-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-all text-sm font-medium"
                >
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Excluir
                    </span>
                </button>
            </div>
        </div>
    );
}

// Dialog de Confirmação
function ConfirmDialog({
    title,
    message,
    onConfirm,
    onCancel
}: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-sm w-full space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0-6a4 4 0 100 8 4 4 0 000-8z" />
                        </svg>
                    </div>
                    <h3 className="text-white font-bold text-lg">{title}</h3>
                </div>
                <p className="text-zinc-400 text-sm">{message}</p>
                <div className="flex gap-3 pt-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}

// Modal de Reagendamento
function RescheduleModal({
    novaData,
    novoHorario,
    onDataChange,
    onHorarioChange,
    onSave,
    onCancel
}: {
    novaData: string;
    novoHorario: string;
    onDataChange: (data: string) => void;
    onHorarioChange: (horario: string) => void;
    onSave: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md w-full space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-white font-bold text-lg">Reagendar Consulta</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Nova Data</label>
                        <input
                            type="date"
                            value={novaData}
                            onChange={(e) => onDataChange(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] [color-scheme:dark]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Novo Horário</label>
                        <input
                            type="time"
                            value={novoHorario}
                            onChange={(e) => onHorarioChange(e.target.value)}
                            className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] [color-scheme:dark]"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-800">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 px-4 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 py-2 px-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#D4AF37]/90 transition-all font-medium"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}