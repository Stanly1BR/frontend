import { DiagnosticoService } from "@/services/diagnostico.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DiagnosticoDTO } from "@/schemas/diagnosticos.schema";

export const useDiagnostico = () => {
    const queryClient = useQueryClient();

    const buscarDiagnosticoPorId = (id: string) => useQuery({
        queryKey: ['diagnostico', id],
        queryFn: async () => DiagnosticoService.getById(id),
        enabled: !!id,
    });

    const buscarTodosDiagnosticos = useQuery({
        queryKey: ['diagnosticos'],
        queryFn: async () => DiagnosticoService.getAll()
    });

    const criarDiagnostico = useMutation({
        mutationFn: (data: Omit<DiagnosticoDTO, 'id' | 'createdAt' | 'updatedAt'>) => DiagnosticoService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
        },
    });

    const atualizarDiagnostico = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Omit<DiagnosticoDTO, 'id' | 'createdAt' | 'updatedAt'>> }) => DiagnosticoService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
        },
    });

    const deletarDiagnostico = useMutation({
        mutationFn: (id: string) => DiagnosticoService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['diagnosticos'] });
        },
    });

    return {
        buscarDiagnosticoPorId,
        buscarTodosDiagnosticos,
        criarDiagnostico: criarDiagnostico.mutate,
        criarDiagnosticoAsync: criarDiagnostico.mutateAsync, // Adicionado para uso com await
        atualizarDiagnostico: atualizarDiagnostico.mutate,
        deletarDiagnostico: deletarDiagnostico.mutate
    };
}