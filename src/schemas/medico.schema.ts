import z from 'zod';

export const medicoSchema = z.object({
    id: z.uuid().optional(),
    nome: z.string().max(100),
    crm: z.string().length(10),
    especialidade: z.string().max(100),
    authId: z.uuid(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type MedicoDTO = z.infer<typeof medicoSchema>;
