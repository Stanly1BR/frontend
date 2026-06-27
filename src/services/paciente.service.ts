import type { PacienteDTO } from '../schemas/paciente.schema';
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://localhost:3001/api/pacientes';

export class PacienteService {
    static async getById(id: string): Promise<PacienteDTO> {
        const response = await fetchWithAuth(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch paciente');
        }

        return response.json();
    }

    static async getAll(): Promise<PacienteDTO[]> {
        const response = await fetchWithAuth(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch pacientes');
        }

        return response.json();
    }

    static async create(data: Omit<PacienteDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<PacienteDTO> {
        const response = await fetchWithAuth(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create paciente');
        }

        return response.json();
    }

    static async update(id: string, data: Partial<Omit<PacienteDTO, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PacienteDTO> {
        const response = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update paciente');
        }

        return response.json();
    }

    static async delete(id: string): Promise<void> {
        const response = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete paciente');
        }
    }
}