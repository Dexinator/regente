import { useState, useEffect } from "react";

export default function SalesReport() {
    const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
    const [report, setReport] = useState(null);
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Función para obtener los reportes según la fecha seleccionada
    const fetchReport = async (selectedDate) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reportes?fecha=${selectedDate}`);
            const data = await res.json();
            if (data.success) {
                setReport(data.report);
                setProductos(data.productosVendidos);
                setCategorias(data.ventasPorCategoria);
            } else {
                console.error("Error:", data.error);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Cargar los datos al iniciar
    useEffect(() => {
        fetchReport(fecha);
    }, []);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#721422] text-white p-4">
        <h1 className="text-2xl font-bold mb-4">Reportes de Ventas</h1>
        
        {/* Selector de fecha */}
        <div className="mb-4">
        <label className="mr-2 text-lg">Seleccionar Fecha:</label>
        <input
        type="date"
        className="p-2 text-black rounded"
        value={fecha}
        onChange={(e) => {
            setFecha(e.target.value);
            fetchReport(e.target.value);
        }}
        />
        </div>
        
        {/* Indicadores de Ventas */}
        {loading ? (
            <p className="text-lg">Cargando reportes...</p>
        ) : report ? (
            <div className="bg-white text-black p-4 rounded shadow w-full max-w-md">
            <p className="mb-2 text-lg">
            <span className="font-bold">Total de órdenes cerradas:</span> {report.orderCount}
            </p>
            <p className="text-lg">
            <span className="font-bold">Total de ventas:</span> ${Number(report.totalSales || 0).toFixed(2)}
            </p>
            </div>
        ) : (
            <p>No hay datos de reportes disponibles.</p>
        )}
        
        {/* Desglose de productos vendidos */}
        <div className="mt-6 w-full max-w-md bg-white text-black p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Productos Vendidos</h2>
        {productos.length > 0 ? (
            <ul>
            {productos.map((producto, index) => (
                <li key={index} className="flex justify-between py-2 border-b">
                <span>{producto.nombre}</span>
                <span className="font-bold">{producto.cantidad_vendida}x</span>
                </li>
            ))}
            </ul>
        ) : (
            <p>No se vendieron productos en esta fecha.</p>
        )}
        </div>
        
        {/* Desglose de ventas por categoría */}
        {/* Desglose de ventas por categoría con monto total */}
        <div className="mt-6 w-full max-w-md bg-white text-black p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">Ventas por Categoría</h2>
        {categorias.length > 0 ? (
            <ul>
            {categorias.map((cat, index) => (
                <li key={index} className="flex justify-between py-2 border-b">
                <span>
                {cat.categoria || "Sin Categoría"} ({cat.cantidad_total}x)
                </span>
                <span className="font-bold">${Number(cat.total_vendido || 0).toFixed(2)}</span>
                </li>
            ))}
            </ul>
        ) : (
            <p>No hay ventas por categoría en esta fecha.</p>
        )}
        </div>
        
        </div>
    );
}
