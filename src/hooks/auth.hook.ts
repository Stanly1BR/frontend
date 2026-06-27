import { AuthService } from '../services/auth.service';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginDTO, RegisterDTO, AuthResponseDTO } from '../schemas/auth.schema';
import { AuthSession } from '../utils/auth-session';
import { useRouter } from "next/navigation";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: (data: LoginDTO) => AuthService.login(data),
        onSuccess: (data: AuthResponseDTO) => {
            AuthSession.set(data);
            queryClient.setQueryData(['user'], data);
            router.push('/');
        },
    });

    const registerMutation = useMutation({
        mutationFn: (data: RegisterDTO) => AuthService.register(data),
        onSuccess: (data: AuthResponseDTO) => {
            AuthSession.set(data);
            queryClient.setQueryData(['user'], data);
            router.push('/auth');
        },
    });

    const logout = () => {
        AuthSession.clear();
        queryClient.setQueryData(['user'], null);
        router.push('/auth');
    };

    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            return AuthSession.get(); 
        },
        // O initialData faz com que o React Query já inicie com a sessão
        // lida do LocalStorage, evitando atrasos na primeira renderização
        initialData: () => AuthSession.get(),
    });

    return {
        user: userQuery.data,
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        registerAsync: registerMutation.mutateAsync, // Adicionado para uso com await
        logout
    };
}