"use client";

import { useAuth } from "@/hooks/auth.hook";
import PacienteDashboard from "./PacienteDashboard";
import MedicoDashboard from "./MedicoDashboard";

export default function ViewDashboard() {
    const { user } = useAuth();

    if (!user || !user.userId) {
        return (
            <div className="flex justify-center items-center h-64 animate-in fade-in">
                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <>
            {user.tipo === "paciente" && <PacienteDashboard userId={user.userId} />}
            {user.tipo === "medico" && <MedicoDashboard userId={user.userId} />}
            {!user.tipo && (
                <div className="w-full max-w-5xl mx-auto p-6">
                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                        <p className="text-red-400 font-medium">Não foi possível identificar o tipo da sua conta.</p>
                        <p className="text-red-400/80 text-sm mt-1">Por favor, faça login novamente.</p>
                    </div>
                </div>
            )}
        </>
    );
}
