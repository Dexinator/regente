import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo.jsx";

export default function Header() {
  const { empleado, isAuthenticated, logout } = useAuth();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setCargado(true);
  }, []);

  if (!cargado) return null;

  return (
    <header className="w-full bg-[#DC9D00] text-black p-4 flex justify-between items-center relative">
      {/* Logo y título */}
      <div className="flex items-center">
        <Logo className="h-10 w-auto" />
        <h1 className="text-xl font-bold ml-2">El Palacio Negro</h1>
      </div>

      {/* Menú para pantallas grandes */}
      {isAuthenticated && (
        <nav className="hidden md:flex space-x-4">
          <a href="/admin-dashboard" className="font-semibold hover:underline">
            Inicio
          </a>
          {(empleado?.rol === "mesero" || empleado?.rol === "admin") && (
            <a href="/ordenes" className="font-semibold hover:underline">
              Órdenes
            </a>
          )}
          {(empleado?.rol === "financiero" || empleado?.rol === "admin") && (
            <a href="/reportes" className="font-semibold hover:underline">
              Reportes
            </a>
          )}
          {empleado?.rol === "admin" && (
            <a href="/empleados" className="font-semibold hover:underline">
              Empleados
            </a>
          )}
          {(empleado?.rol === "admin" || empleado?.rol === "cocinero") && (
            <a href="/inventario" className="font-semibold hover:underline">
              Inventario
            </a>
          )}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded"
          >
            Cerrar Sesión
          </button>
        </nav>
      )}

      {/* Menú hamburguesa para pantallas pequeñas */}
      {isAuthenticated && (
        <div className="md:hidden relative">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-black text-2xl font-bold fixed top-4 right-4 bg-white p-2 rounded-md shadow-lg z-50"
          >
            ☰
          </button>
          {menuAbierto && (
            <nav className="absolute top-16 right-4 bg-white shadow-lg p-4 rounded-md flex flex-col text-black w-48 z-50">
              <a href="/admin-dashboard" className="py-2 hover:bg-gray-200 rounded">
                Inicio
              </a>
              {(empleado?.rol === "mesero" || empleado?.rol === "admin") && (
                <a href="/ordenes" className="py-2 hover:bg-gray-200 rounded">
                  Órdenes
                </a>
              )}
              {(empleado?.rol === "financiero" || empleado?.rol === "admin") && (
                <a href="/reportes" className="py-2 hover:bg-gray-200 rounded">
                  Reportes
                </a>
              )}
              {empleado?.rol === "admin" && (
                <a href="/empleados" className="py-2 hover:bg-gray-200 rounded">
                  Empleados
                </a>
              )}
              {(empleado?.rol === "admin" || empleado?.rol === "cocinero") && (
                <a href="/inventario" className="py-2 hover:bg-gray-200 rounded">
                  Inventario
                </a>
              )}
              <button
                onClick={logout}
                className="mt-2 bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded"
              >
                Cerrar Sesión
              </button>
            </nav>
          )}
        </div>
      )}
    </header>
  );
}
