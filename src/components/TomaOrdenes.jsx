import { useState, useEffect } from "react";

export default function TomaOrdenes() {
  const [productos, setProductos] = useState([]);
  const [orden, setOrden] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data.productos));
  }, []);

  const agregarProducto = (producto) => {
    const nuevaOrden = [...orden];
    const index = nuevaOrden.findIndex((item) => item.id === producto.id);

    if (index !== -1) {
      nuevaOrden[index].cantidad += 1;
    } else {
      nuevaOrden.push({ ...producto, cantidad: 1 });
    }

    setOrden(nuevaOrden);
    calcularTotal(nuevaOrden);
  };

  const eliminarProducto = (id) => {
    const nuevaOrden = orden.filter((item) => item.id !== id);
    setOrden(nuevaOrden);
    calcularTotal(nuevaOrden);
  };

  const calcularTotal = (orden) => {
    const total = orden.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    setTotal(total);
  };

  const enviarOrden = async () => {
    if (orden.length === 0) return alert("La orden está vacía");

    const response = await fetch("/api/ordenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_cliente: "Cliente en barra",
        total,
        empleado_id: 1,
      }),
    });

    const data = await response.json();

    if (data.success) {
      for (const item of orden) {
        await fetch("/api/detalles_orden", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orden_id: data.orderId,
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_unitario: item.precio,
          }),
        });
      }

      alert("Orden enviada con éxito!");
      setOrden([]);
      setTotal(0);
    } else {
      alert("Error al enviar la orden");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#721422] text-white">
      <header className="p-4 text-center bg-[#DC9D00] text-black font-bold text-lg">
        Toma de Órdenes
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-2">Selecciona un producto:</h2>
        <div className="grid grid-cols-2 gap-3">
          {productos.map((producto) => (
            <button
              key={producto.id}
              className="p-3 bg-white text-black rounded-lg shadow-md text-center text-sm"
              onClick={() => agregarProducto(producto)}
            >
              {producto.nombre} <br /> <span className="font-bold">${producto.precio}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white text-black shadow-lg">
        <h2 className="text-lg font-semibold">Orden actual</h2>
        {orden.length === 0 ? (
          <p className="text-gray-500">No hay productos en la orden</p>
        ) : (
          orden.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span>{item.nombre} x{item.cantidad}</span>
              <span>${item.precio * item.cantidad}</span>
              <button className="text-red-500" onClick={() => eliminarProducto(item.id)}>X</button>
            </div>
          ))
        )}
        <hr className="my-2" />
        <h3 className="text-lg font-bold">Total: ${total.toFixed(2)}</h3>
        <button
          className="mt-2 p-3 bg-[#DC9D00] text-black rounded-lg shadow-md w-full text-center"
          onClick={enviarOrden}
        >
          Enviar Orden
        </button>
      </div>
    </div>
  );
}
