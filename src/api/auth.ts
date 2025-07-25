const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
  };
  token: string;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Función helper para manejar respuestas de la API
const handleApiResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la solicitud');
  }
  
  return data;
};

// Función helper para hacer requests autenticados
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};

export const authApi = {
  // Login de usuario
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await handleApiResponse(response);
    
    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Registro de usuario
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await handleApiResponse(response);
    
    // Guardar token en localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Obtener datos del usuario autenticado
  getUser: async () => {
    const response = await authenticatedFetch('/api/user', {
      method: 'GET',
    });

    return handleApiResponse(response);
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await authenticatedFetch('/api/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  // Resetear contraseña
  resetPassword: async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/api/password/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return handleApiResponse(response);
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('auth_token');
    return !!token;
  },

  // Obtener token
  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  // Obtener usuario desde localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};