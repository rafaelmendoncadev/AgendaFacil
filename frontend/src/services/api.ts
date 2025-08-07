const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
}

interface RegisterResponse {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
}

interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Autenticação
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao fazer login');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    return data;
  }

  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar conta');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
    return data;
  }

  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Erro ao obter dados do usuário');
    }

    return response.json();
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
  }

  // Compromissos
  async getAppointments(date?: string): Promise<{ appointments: Appointment[] }> {
    let url = `${API_BASE_URL}/appointments`;
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }

    const response = await fetch(url, {
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao carregar compromissos');
    }

    return response.json();
  }

  async createAppointment(appointment: {
    title: string;
    description: string;
    date: string;
    time: string;
  }): Promise<{ message: string; appointment: Appointment }> {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(appointment)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar compromisso');
    }

    return response.json();
  }

  async updateAppointment(id: string, appointment: Partial<{
    title: string;
    description: string;
    date: string;
    time: string;
  }>): Promise<{ message: string; appointment: Appointment }> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(appointment)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar compromisso');
    }

    return response.json();
  }

  async deleteAppointment(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao excluir compromisso');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
export type { Appointment };