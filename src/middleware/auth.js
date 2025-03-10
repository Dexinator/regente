export function isAuthenticated() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      return !!token; // Retorna true si el token existe, false si no
    }
    return false;
  }
  