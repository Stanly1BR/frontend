import ViewConfiguracao from "@/components/configuracao/ViewConfiguracao";

export default function Configuracao() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-white">Configuração</h1>
            <p className="text-zinc-400">Página de configuração</p>

            <ViewConfiguracao />
        </div>
    );
}