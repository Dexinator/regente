import { useState, useEffect } from "react";

export function useAuth() {
  const [empleado, setEmpleado] = useState(null);
  const [cargado, setCargado] = useState(false); // Inicializa el estado de carga

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("🚫 No hay token en localStorage. Autenticación NO válida.");
      setCargado(true);
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      console.log("✅ TOKEN DECODIFICADO:", decoded);
      setEmpleado({ id: decoded.id, nombre: decoded.usuario, rol: decoded.rol });

      // 🔵 Esperamos 100ms antes de marcar `cargado` como `true` para evitar problemas de sincronización
      setTimeout(() => {
        setCargado(true);
        console.log("🔄 ESTADO FINAL -> cargado:", true, "isAuthenticated:", true);
      }, 100);
    } catch (error) {
      console.error("❌ Error al decodificar el token:", error);
      logout();
    }
  }, []);

  const login = (token) => {
    console.log("🔐 INICIANDO SESIÓN...");
    localStorage.setItem("token", token);

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setEmpleado({ id: decoded.id, nombre: decoded.usuario, rol: decoded.rol });

      setTimeout(() => {
        setCargado(true);
        console.log("🚀 REDIRIGIENDO A DASHBOARD...");
        window.location.href = "/admin-dashboard";
      }, 100);
    } catch (error) {
      console.error("❌ Error al decodificar el token en login:", error);
      logout();
    }
  };

  const logout = () => {
    console.log("🚪 CERRANDO SESIÓN...");
    localStorage.removeItem("token");
    setEmpleado(null);
    setCargado(false);
    setTimeout(() => {
      console.log("🔄 REDIRIGIENDO A LOGIN...");
      window.location.href = "/login";
    }, 100);
  };

  console.log("📌 VALOR FINAL -> cargado:", cargado, "isAuthenticated:", cargado && !!empleado);

  return { empleado, isAuthenticated: cargado && !!empleado, login, logout, cargado };
}
