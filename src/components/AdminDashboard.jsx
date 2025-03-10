import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    setCargado(true);
  }, []);

  if (!cargado) return null; // 🔵 Previene la hidratación incorrecta

  return (
    <div className="min-h-screen bg-[#721422] text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Panel de Administración</h1>
      <p className="text-center mb-4">Bienvenido, administrador. Aquí puedes gestionar el negocio.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-xs sm:max-w-md">
        <a href="/ordenes" className="p-3 bg-[#DC9D00] text-black rounded-lg text-center font-bold text-sm sm:text-lg">
          Órdenes
        </a>
        <a href="/reportes" className="p-3 bg-[#DC9D00] text-black rounded-lg text-center font-bold text-sm sm:text-lg">
          Reportes
        </a>
        <a href="/empleados" className="p-3 bg-[#DC9D00] text-black rounded-lg text-center font-bold text-sm sm:text-lg">
          Empleados
        </a>
        <a href="/inventario" className="p-3 bg-[#DC9D00] text-black rounded-lg text-center font-bold text-sm sm:text-lg">
          Inventario
        </a>
      </div>
    </div>
  );
}
