import type { MedicoDTO } from '../schemas/medico.schema';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://localhost:3001/api/medicos';

export class MedicoService {
    static async getById(id: string): Promise<MedicoDTO> {
        const response = await fetchWithAuth(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch medico');
        }

        return response.json();
    }

    static async getAll(): Promise<MedicoDTO[]> {
        const response = await fetchWithAuth(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch medicos');
        }

        return response.json();
    }

    static async create(data: Omit<MedicoDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicoDTO> {
        const response = await fetchWithAuth(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create medico');
        }

        return response.json();
    }

    static async update(id: string, data: Partial<Omit<MedicoDTO, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MedicoDTO> {
        const response = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update medico');
        }

        return response.json();
    }

    static async delete(id: string): Promise<void> {
        const response = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete medico');
        }
    }
}