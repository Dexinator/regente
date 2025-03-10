import { useState } from "react";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null); // Resetear errores previos
  
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contraseña }),
    });
  
    const data = await response.json();
  
    if (data.success) {
      // Guardar token y datos del usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("empleado", JSON.stringify(data.empleado));
  
      // Redirigir según el rol del usuario
      switch (data.empleado.rol) {
        case "admin":
          window.location.href = "/admin-dashboard";
          break;
        case "mesero":
          window.location.href = "/ordenes";
          break;
        case "cocinero":
          window.location.href = "/cocina";
          break;
        case "financiero":
          window.location.href = "/reportes";
          break;
        default:
          window.location.href = "/"; // Página de inicio por defecto
      }
    } else {
      setError(data.error);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#721422] text-white">
      <h1 className="text-2xl font-bold mb-4">Iniciar Sesión</h1>

      {error && <p className="text-red-500">{error}</p>}

      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        className="mb-2 p-3 text-black rounded w-80"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={contraseña}
        onChange={(e) => setContraseña(e.target.value)}
        className="mb-4 p-3 text-black rounded w-80"
      />

      <button
        onClick={handleLogin}
        className="bg-[#DC9D00] text-black px-6 py-3 rounded-lg font-bold text-lg"
      >
        Iniciar Sesión
      </button>
    </div>
  );
}
