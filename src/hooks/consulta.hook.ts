import { ConsultaService } from "@/services/consulta.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ConsultaDTO } from "@/schemas/consulta.schema";

export const useConsulta = () => {
    const queryClient = useQueryClient();

    const buscarConsultaPorId = (id: string) => useQuery({
        queryKey: ['consulta', id],
        queryFn: async () => ConsultaService.getById(id),
        enabled: !!id,
    });

    const buscarTodasConsultas = useQuery({
        queryKey: ['consultas'],
        queryFn: async () => ConsultaService.getAll()
    });

    const criarConsulta = useMutation({
        mutationFn: (data: Omit<ConsultaDTO, 'id' | 'createdAt' | 'updatedAt'>) => ConsultaService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultas'] });
        },
    });

    const atualizarConsulta = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Omit<ConsultaDTO, 'id' | 'createdAt' | 'updatedAt'>> }) => ConsultaService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultas'] });
        },
    });

    const deletarConsulta = useMutation({
        mutationFn: (id: string) => ConsultaService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['consultas'] });
        },
    });

    return {
        buscarConsultaPorId,
        buscarTodasConsultas,
        criarConsulta: criarConsulta.mutate,
        criarConsultaAsync: criarConsulta.mutateAsync, // Adicionado para uso com await
        atualizarConsulta: atualizarConsulta.mutate,
        deletarConsulta: deletarConsulta.mutate
    };
}