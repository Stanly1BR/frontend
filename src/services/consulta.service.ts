import { ConsultaDTO } from "@/schemas/consulta.schema";
import { fetchWithAuth } from '../utils/fetchWithAuth';

const API_URL = 'http://localhost:3001/api/consultas';

export class ConsultaService {
    static async getById(id: string): Promise<ConsultaDTO> {
        const response = await fetchWithAuth(`${API_URL}/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch consulta');
        }

        return response.json();
    }

    static async getAll(): Promise<ConsultaDTO[]> {
        const response = await fetchWithAuth(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch consultas');
        }

        return response.json();
    }

    static async create(data: Omit<ConsultaDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<ConsultaDTO> {
        const response = await fetchWithAuth(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to create consulta');
        }

        return response.json();
    }

    static async update(id: string, data: Partial<Omit<ConsultaDTO, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ConsultaDTO> {
        const response = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update consulta');
        }

        return response.json();
    }

    static async delete(id: string): Promise<void> {
        const response = await fetchWithAuth(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete consulta');
        }
    }
}
