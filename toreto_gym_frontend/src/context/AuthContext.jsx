import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const API_URL = 'http://localhost:3001/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = async (correo, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.mensaje || 'Error al iniciar sesión');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));

      setUser(data.usuario);

      return data.usuario;
    } catch (error) {
      throw new Error(error.message || 'Error en la petición');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const hasRole = (rolesPermitidos) => {
    if (!user) return false;

    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }

    return rolesPermitidos.includes(user.rol);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}