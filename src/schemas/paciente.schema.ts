import z from 'zod';

export const pacienteSchema = z.object({
    id: z.uuid().optional(),
    nome: z.string().max(100),
    cpf: z.string().length(11),
    dataNascimento: z.coerce.date(),
    telefone: z.string().length(11),
    authId: z.uuid(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type PacienteDTO = z.infer<typeof pacienteSchema>;
