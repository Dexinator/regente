import { useState } from "react";

export function useAuth() {
  // Lectura síncrona: al inicializar el hook, obtenemos el token de localStorage
  let initialEmpleado = null;
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        initialEmpleado = { id: decoded.id, nombre: decoded.usuario, rol: decoded.rol };
      } catch (error) {
        console.error("Error decoding token:", error);
        // Si hay error, se elimina el token
        localStorage.removeItem("token");
      }
    }
  }

  const [empleado, setEmpleado] = useState(initialEmpleado);

  const login = (token) => {
    localStorage.setItem("token", token);
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setEmpleado({ id: decoded.id, nombre: decoded.usuario, rol: decoded.rol });
      window.location.href = "/admin-dashboard";
    } catch (error) {
      console.error("Error decoding token in login:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setEmpleado(null);
    window.location.href = "/login";
  };

  return { empleado, isAuthenticated: !!empleado, login, logout };
}
