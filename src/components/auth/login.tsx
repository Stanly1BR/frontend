"use client";

import { useAuth } from "@/hooks/auth.hook";
import { useState } from "react";

export default function Login() {
    const { login} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, password });
    };

    return (
        <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white tracking-tight">Bem-vindo de volta</h2>
                <p className="text-zinc-400 mt-2 text-sm">Insira suas credenciais para acessar o painel</p>
            </div>

            <form className="space-y-5 w-full" onSubmit={handleSubmit}>
                <div className="w-full">
                    <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                </div>
                <div className="w-full">
                    <div className="flex justify-between items-center mb-1 w-full">
                        <label className="block text-sm font-medium text-zinc-300">Senha</label>
                        <a href="#" className="text-xs text-[#D4AF37] hover:text-yellow-400 transition-colors">Esqueceu a senha?</a>
                    </div>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="w-full py-3 px-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-semibold rounded-lg transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}