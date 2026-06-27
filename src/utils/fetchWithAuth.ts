import { AuthSession } from './auth-session';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    // 1. Busca os dados da sessão (que contém o token)
    const session = AuthSession.get();
    
    // 2. Prepara os headers
    const headers = new Headers(options.headers);
    
    // 3. Se existir um token, injeta no formato Bearer
    if (session && session.token) {
        headers.set('Authorization', `Bearer ${session.token}`);
    }

    // 4. Garante que o Content-Type padrão seja JSON (opcional, mas útil)
    if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
    }

    // 5. Executa o fetch original repassando a URL e as novas opções
    const response = await fetch(url, {
        ...options,
        headers,
    });

    return response;
}