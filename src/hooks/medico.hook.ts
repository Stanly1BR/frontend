import { MedicoService } from '../services/medico.service';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MedicoDTO } from '../schemas/medico.schema';

// 1. Hook independente para buscar o médico por ID
export const useBuscarMedicoPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ['medico', id],
        queryFn: async () => MedicoService.getById(id!),
        enabled: !!id,
    });
};

// 2. Hook geral para as demais operações
export const useMedico = () => {
    const queryClient = useQueryClient();

    const buscarTodosMedicos = useQuery({
        queryKey: ['medicos'],
        queryFn: async () => MedicoService.getAll()
    });

    const criarMedico = useMutation({
        mutationFn: (data: Omit<MedicoDTO, 'id' | 'createdAt' | 'updatedAt'>) => MedicoService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medicos'] });
        },
    });

    const atualizarMedico = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Omit<MedicoDTO, 'id' | 'createdAt' | 'updatedAt'>> }) => MedicoService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medicos'] });
            queryClient.invalidateQueries({ queryKey: ['medico'] }); // Renova o cache da busca individual
        },
    });

    const deletarMedico = useMutation({
        mutationFn: (id: string) => MedicoService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['medicos'] });
        },
    });

    return {
        buscarTodosMedicos,
        criarMedico: criarMedico.mutate,
        criarMedicoAsync: criarMedico.mutateAsync,
        atualizarMedico: atualizarMedico.mutate,
        deletarMedico: deletarMedico.mutate
    };
}