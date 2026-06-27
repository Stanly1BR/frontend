import z from 'zod';

export const authSchema = z.object({
    id: z.uuid().optional(),
    nome: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    tipo: z.enum(['medico', 'paciente']),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type AuthDTO = z.infer<typeof authSchema>;
export type LoginDTO = Pick<AuthDTO, 'email' | 'password'>;
export type RegisterDTO = Omit<AuthDTO, 'id' | 'createdAt' | 'updatedAt'>;

export const AuthResponseSchema = z.object({
    token: z.string(),
    userId: z.string().nullable(),
    authId: z.string(),
    tipo: z.enum(['medico', 'paciente']),
});

export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;