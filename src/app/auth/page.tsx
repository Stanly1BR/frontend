"use client";

import { useState } from "react";
import Login from "@/components/auth/login";
import Registrar from "@/components/auth/registrar";

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-black font-sans text-zinc-100">
            
            <div className="w-full md:w-[50%] lg:w-[40%] flex flex-col justify-center items-center p-8 sm:p-12 bg-zinc-950 border-r border-zinc-900 transition-all duration-300">
                
                <div className="w-full max-w-md">
                    {isLoginView ? <Login /> : <Registrar />}
                </div>
                
                <div className="mt-8 text-center w-full">
                    <button 
                        onClick={() => setIsLoginView(!isLoginView)}
                        className="text-zinc-500 hover:text-[#D4AF37] text-sm transition-colors duration-200"
                    >
                        {isLoginView 
                            ? "Ainda não tem uma conta? Crie uma agora." 
                            : "Já possui uma conta? Faça login aqui."}
                    </button>
                </div>
            </div>

            <div className="flex md:w-[50%] lg:w-[60%] flex-col justify-center p-12 lg:p-24 relative overflow-hidden bg-zinc-950 transition-all duration-300">
                
                <div className="absolute top-0 right-0 w-100 h-100 bg-[#D4AF37] opacity-[0.03] rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-125 h-125 bg-[#D4AF37] opacity-[0.02] rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
                
                <div className="relative z-10 w-full max-w-xl">
                    <div className="inline-block px-3 py-1 mb-6 border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-semibold tracking-wider rounded-full uppercase">
                        Sistema De Gerenciamento de clinica médica
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-500 mb-6 leading-tight">
                        DocMed <br />
                        <span className="text-[#D4AF37]">Gerenciamento inteligente de consultas</span>
                    </h1>
                    
                    <p className="text-lg text-zinc-400 mb-10 leading-relaxed font-light">
                        A solução definitiva para sua gestão, integrando agendamento, prontuário eletrônico e faturamento em uma única plataforma intuitiva e eficiente.
                    </p>
                    
                    <ul className="space-y-5">
                        <li className="flex items-start">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-[#D4AF37]/50 flex items-center justify-center mt-1">
                                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                            </div>
                            <span className="ml-4 text-zinc-300">Agendamento inteligente de consultas</span>
                        </li>
                        <li className="flex items-start">
                            <div className="shrink-0 w-6 h-6 rounded-full bg-zinc-900 border border-[#D4AF37]/50 flex items-center justify-center mt-1">
                                <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                            </div>
                            <span className="ml-4 text-zinc-300">Prontuário eletrônico completo</span>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>
    );
}