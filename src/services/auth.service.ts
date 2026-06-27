import type { LoginDTO, RegisterDTO, AuthResponseDTO } from '../schemas/auth.schema';

const API_URL = 'http://localhost:3001/api/auth';

export class AuthService {
    static async login(data: LoginDTO): Promise<AuthResponseDTO> {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    }

    static async register(data: RegisterDTO): Promise<AuthResponseDTO> {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return response.json();
    }
}