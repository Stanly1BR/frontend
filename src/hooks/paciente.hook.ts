import { PacienteService } from '../services/paciente.service';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { PacienteDTO } from '../schemas/paciente.schema';

// 1. Extraímos a busca por ID para um Hook próprio
export const useBuscarPacientePorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ['paciente', id],
        queryFn: async () => PacienteService.getById(id!),
        enabled: !!id,
    });
};

// 2. Mantemos as outras operações agrupadas
export const usePaciente = () => {
    const queryClient = useQueryClient();

    const buscarTodosPacientes = useQuery({
        queryKey: ['pacientes'],
        queryFn: async () => PacienteService.getAll()
    });

    const criarPaciente = useMutation({
        mutationFn: (data: Omit<PacienteDTO, 'id' | 'createdAt' | 'updatedAt'>) => PacienteService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pacientes'] });
        },
    });

    const atualizarPaciente = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Omit<PacienteDTO, 'id' | 'createdAt' | 'updatedAt'>> }) => PacienteService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pacientes'] });
            queryClient.invalidateQueries({ queryKey: ['paciente'] }); // Atualiza o cache individual
        },
    });

    const deletarPaciente = useMutation({
        mutationFn: (id: string) => PacienteService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pacientes'] });
        },
    });

    return {
        buscarTodosPacientes,
        criarPaciente: criarPaciente.mutate,
        criarPacienteAsync: criarPaciente.mutateAsync,
        atualizarPaciente: atualizarPaciente.mutate,
        deletarPaciente: deletarPaciente.mutate
    };
}