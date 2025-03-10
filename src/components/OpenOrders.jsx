import { useState, useEffect } from "react";

export default function OpenOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para obtener las órdenes abiertas
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/ordenes-abiertas");
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        alert("Error al obtener órdenes: " + data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Función para cerrar una orden
  const closeOrder = async (orderId) => {
    try {
      const res = await fetch("/api/ordenes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Orden cerrada con éxito!");
        fetchOrders(); // Refrescar la lista
      } else {
        alert("Error al cerrar la orden: " + data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="p-4 text-white">Cargando órdenes...</p>;

  return (
    <div className="flex flex-col h-screen bg-[#721422] text-white">
      <header className="p-4 text-center bg-[#DC9D00] text-black font-bold text-lg">
        Órdenes Abiertas
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {orders.length === 0 ? (
          <p className="text-gray-300">No hay órdenes abiertas.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-white text-black rounded-lg shadow"
              >
                <div className="mb-2 md:mb-0">
                  <p className="font-bold">Orden ID: {order.id}</p>
                  <p>Cliente: {order.nombre_cliente}</p>
                  <p>Total: ${order.total}</p>
                </div>
                <button
                  onClick={() => closeOrder(order.id)}
                  className="bg-red-500 hover:bg-red-600 transition-colors text-white px-4 py-2 rounded"
                >
                  Cerrar Orden
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
