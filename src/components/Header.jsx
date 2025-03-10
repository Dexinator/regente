import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo.jsx";

export default function Header() {
    const { empleado, isAuthenticated } = useAuth();
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [cargado, setCargado] = useState(false); // 🔵 Estado para evitar el error de hidratación
    
    useEffect(() => {
        setCargado(true);
    }, []);
    
    if (!cargado) return null; // 🔵 Evita el renderizado hasta que el cliente cargue
    
    return (
        <header className="w-full bg-[#DC9D00] text-black p-4 flex justify-between items-center">
        {/* 🔵 Logo */}
        <div className="flex items-center">
        <Logo className="h-10 w-auto" />
        <h1 className="text-xl font-bold ml-2">El Palacio Negro</h1>
        </div>
        
        {/* 🔵 Botón de menú hamburguesa en móviles */}
        {isAuthenticated && (
            <div className="md:hidden relative z-50">
            <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-black text-2xl font-bold fixed top-4 right-4 bg-white p-2 rounded-md shadow-lg"
            >
            ☰
            </button>
            </div>
        )}
        
        
        {/* 🔵 Menú normal en pantallas grandes */}
        {isAuthenticated && (
            <nav className="hidden md:flex">
            <a href="/admin-dashboard" className="mr-4 font-semibold hover:underline">
            Inicio
            </a>
            {(empleado?.rol === "mesero" || empleado?.rol === "admin") && (
                <a href="/ordenes" className="mr-4 font-semibold hover:underline">
                Órdenes
                </a>
            )}
            {(empleado?.rol === "financiero" || empleado?.rol === "admin") && (
                <a href="/reportes" className="mr-4 font-semibold hover:underline">
                Reportes
                </a>
            )}
            {empleado?.rol === "admin" && (
                <a href="/empleados" className="mr-4 font-semibold hover:underline">
                Empleados
                </a>
            )}
            {(empleado?.rol === "admin" || empleado?.rol === "cocinero") && (
                <a href="/inventario" className="mr-4 font-semibold hover:underline">
                Inventario
                </a>
            )}
            </nav>
        )}
        
        {/* 🔵 Menú desplegable en móviles */}
        {menuAbierto && (
            <nav className="absolute top-16 right-4 bg-white shadow-lg p-4 rounded-md flex flex-col text-black w-48">
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
            </nav>
        )}
        </header>
    );
}
