import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/login"; // Redirigir solo si ya terminó de cargar y no hay sesión
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <p className="text-center text-white">Cargando...</p>; // 🔵 Evita redirecciones anticipadas

  return isAuthenticated ? children : null;
}
