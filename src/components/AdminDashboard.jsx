import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    ordenesAbiertas: 0,
    ingresosHoy: 0,
    empleadosActivos: 0,
  });

  useEffect(() => {
    // Simulación de datos (se conectará a API en el futuro)
    setStats({
      ordenesAbiertas: 5,
      ingresosHoy: 3200,
      empleadosActivos: 8,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#721422] text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Panel de Administración</h1>
      
      {/* Sección de estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 w-full max-w-lg">
        <div className="bg-[#DC9D00] text-black p-4 rounded-lg text-center">
          <p className="text-xl font-bold">{stats.ordenesAbiertas}</p>
          <p className="text-sm">Órdenes Abiertas</p>
        </div>
        <div className="bg-[#DC9D00] text-black p-4 rounded-lg text-center">
          <p className="text-xl font-bold">${stats.ingresosHoy}</p>
          <p className="text-sm">Ingresos Hoy</p>
        </div>
        <div className="bg-[#DC9D00] text-black p-4 rounded-lg text-center">
          <p className="text-xl font-bold">{stats.empleadosActivos}</p>
          <p className="text-sm">Empleados Activos</p>
        </div>
      </div>

      {/* Atajos a secciones clave */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        <a href="/ordenes" className="p-4 bg-white text-black rounded-lg text-center font-bold text-sm sm:text-lg">
          Órdenes
        </a>
        <a href="/reportes" className="p-4 bg-white text-black rounded-lg text-center font-bold text-sm sm:text-lg">
          Reportes
        </a>
        <a href="/empleados" className="p-4 bg-white text-black rounded-lg text-center font-bold text-sm sm:text-lg">
          Empleados
        </a>
        <a href="/inventario" className="p-4 bg-white text-black rounded-lg text-center font-bold text-sm sm:text-lg">
          Inventario
        </a>
      </div>
    </div>
  );
}
