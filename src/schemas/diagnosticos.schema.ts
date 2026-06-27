import z from 'zod';

export const diagnosticosSchema = z.object({
    id: z.uuid().optional(),
    descricao: z.string().min(1, 'A descrição é obrigatória'),
    cid: z.string().min(1, 'O CID é obrigatório'),
    pacienteId: z.uuid(),
    consultaId: z.uuid(),
    dataDiagnostico: z.coerce.date(),
});

export type DiagnosticoDTO = z.infer<typeof diagnosticosSchema>;