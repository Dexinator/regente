import { useState, useEffect } from "react";

export default function TomaOrdenes() {
  const [ordenId, setOrdenId] = useState(null);
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [total, setTotal] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [empleadoId, setEmpleadoId] = useState(null); // ✅ Estado para empleado_id

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = new URLSearchParams(window.location.search).get("orden_id");
      setOrdenId(id);

      const empleado = localStorage.getItem("empleado");
      if (empleado) {
        try {
          setEmpleadoId(JSON.parse(empleado).id);
        } catch (error) {
          console.error("Error al parsear empleado:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!ordenId) return;

    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data.productos));

    fetch(`/api/ordenes?id=${ordenId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrden(data.orden.detalles || []);
          setTotal(data.orden.total || 0);
        }
      });
  }, [ordenId]);

  if (!ordenId) return <p className="text-white">Cargando orden...</p>;

  const agregarProducto = async (producto) => {
    if (!ordenId || !empleadoId) return alert("Error: No se pudo identificar la orden o empleado");

    const nuevaOrden = [...orden];
    const index = nuevaOrden.findIndex((item) => item.id === producto.id);

    if (index !== -1) {
      nuevaOrden[index].cantidad += 1;
    } else {
      nuevaOrden.push({ ...producto, cantidad: 1 });
    }

    setOrden(nuevaOrden);
    calcularTotal(nuevaOrden);

    await fetch("/api/detalles_orden", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orden_id: ordenId,
        producto_id: producto.id,
        cantidad: 1,
        precio_unitario: producto.precio,
        empleado_id: empleadoId,
      }),
    });
  };

  const calcularTotal = (orden) => {
    const total = orden.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    setTotal(total);
  };

  const eliminarProducto = async (id) => {
    const nuevaOrden = orden.filter((item) => item.id !== id);
    setOrden(nuevaOrden);
    calcularTotal(nuevaOrden);
  };

  return (
    <div className="flex flex-col h-screen bg-[#721422] text-white">
      <header className="p-4 text-center bg-[#DC9D00] text-black font-bold text-lg">
        Toma de Órdenes - Orden #{ordenId}
      </header>

      {/* Campo de búsqueda */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          className="w-full p-3 mb-3 border rounded-lg text-black"
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* Lista de productos */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-2">Selecciona un producto:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {productos
            .filter((p) =>
              p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
              (p.categoria && p.categoria.toLowerCase().includes(filtro.toLowerCase()))
            )
            .map((producto) => (
              <button
                key={producto.id}
                className="p-4 bg-white text-black rounded-lg shadow-md text-lg font-semibold text-center"
                onClick={() => agregarProducto(producto)}
              >
                {producto.nombre} <br /> <span className="font-bold">${producto.precio}</span>
              </button>
            ))}
        </div>
      </div>

      {/* Resumen de la orden */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white text-black shadow-lg">
        <h2 className="text-lg font-semibold">Orden actual</h2>
        {orden.length === 0 ? (
          <p className="text-gray-500">No hay productos en la orden</p>
        ) : (
          orden.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-lg">
              <span>{item.nombre} x{item.cantidad}</span>
              <span>${item.precio * item.cantidad}</span>
              <button className="text-red-500" onClick={() => eliminarProducto(item.id)}>X</button>
            </div>
          ))
        )}
        <hr className="my-2" />
        <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
      </div>
    </div>
  );
}
