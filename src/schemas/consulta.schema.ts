import z from 'zod';

export const consultaSchema = z.object({
  id: z.uuid().optional(),
  pacienteId: z.uuid(),
    medicoId: z.uuid(),
    data: z.coerce.date(),
    horario: z.string(),
    motivo: z.string(),
    status: z.enum(['agendada', 'cancelada', 'concluida']),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type ConsultaDTO = z.infer<typeof consultaSchema>;
