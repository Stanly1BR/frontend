import type { DiagnosticoDTO } from "@/schemas/diagnosticos.schema.js";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://localhost:3001/api/diagnosticos';

export class DiagnosticoService {
    static async getById(id: string): Promise<DiagnosticoDTO> {
        const response = await fetchWithAuth(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch diagnostico');
        }

        return response.json();
    }

    static async getAll(): Promise<DiagnosticoDTO[]> {
        const response = await fetchWithAuth(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch diagnosticos');
        }

        return response.json();
    }

    static async create(data: Omit<DiagnosticoDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiagnosticoDTO> {
        const response = await fetchWithAuth(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create diagnostico');
        }

        return response.json();
    }

    static async update(id: string, data: Partial<Omit<DiagnosticoDTO, 'id' | 'createdAt' | 'updatedAt'>>): Promise<DiagnosticoDTO> {
        const response = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update diagnostico');
        }

        return response.json();
    }

    static async delete(id: string): Promise<void> {
        const response = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete diagnostico');
        }
    }
}
