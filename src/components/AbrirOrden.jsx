import { useState, useEffect } from "react";

export default function AbrirOrden() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [presoId, setPresoId] = useState(null);
  const [empleadoId, setEmpleadoId] = useState(null); // 🔹 Estado para empleado_id
  const [ingresandoNombre, setIngresandoNombre] = useState(false);

  useEffect(() => {
    fetch("/api/presos")
      .then((res) => res.json())
      .then((data) => setClientes(data.presos));

    // 🔹 Obtener empleado_id solo en el cliente
    if (typeof window !== "undefined") {
      const empleado = JSON.parse(localStorage.getItem("empleado"));
      if (empleado) setEmpleadoId(empleado.id);
    }
  }, []);

  const abrirOrden = async () => {
    if (!nombreCliente && !presoId) {
      alert("Selecciona un cliente o ingresa un nombre.");
      return;
    }

    if (!empleadoId) {
      alert("Error: No se pudo obtener la información del empleado.");
      return;
    }

    const response = await fetch("/api/ordenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preso_id: ingresandoNombre ? null : presoId,
        nombre_cliente: nombreCliente || "Cliente en barra",
        total: 0,
        empleado_id: empleadoId, // 🔹 Ahora usamos el estado seguro de empleado_id
      }),
    });

    const data = await response.json();
    if (data.success) {
      window.location.href = `/ordenes?orden_id=${data.orderId}`;
    } else {
      alert("Error al abrir la orden");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#721422] text-white">
      <header className="p-4 text-center bg-[#DC9D00] text-black font-bold text-lg">
        Abrir Orden
      </header>

      {/* Botón para ingresar un nombre manualmente */}
      <div className="p-4">
        <button
          className="w-full p-3 mb-3 bg-gray-700 rounded-lg text-white font-semibold"
          onClick={() => {
            setIngresandoNombre(true);
            setPresoId(null);
          }}
        >
          Cliente no registrado
        </button>
      </div>

      {ingresandoNombre && (
        <div className="p-4">
          <input
            type="text"
            placeholder="Ingresa el nombre del cliente"
            className="w-full p-3 border rounded-lg text-black"
            onChange={(e) => setNombreCliente(e.target.value)}
          />
        </div>
      )}

      {/* Campo de búsqueda */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Buscar cliente (nombre o número de preso)..."
          className="w-full p-3 mb-3 border rounded-lg text-black"
          onChange={(e) => {
            setFiltro(e.target.value);
            setIngresandoNombre(false);
          }}
        />
      </div>

      {/* Lista de clientes filtrados */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-2">Selecciona un cliente:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {clientes
            .filter((p) =>
              p.reg_name.toLowerCase().includes(filtro.toLowerCase()) ||
              (!isNaN(filtro) && p.id.toString().includes(filtro))
            )
            .map((cliente) => (
              <button
                key={cliente.id}
                className="p-4 bg-white text-black rounded-lg shadow-md text-lg font-semibold text-center"
                onClick={() => {
                  setPresoId(cliente.id);
                  setNombreCliente(cliente.reg_name);
                  setIngresandoNombre(false);
                }}
              >
                {cliente.reg_name} (#{cliente.id})
              </button>
            ))}
        </div>
      </div>

      {/* Botón para abrir orden */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white text-black shadow-lg">
        <h2 className="text-lg font-semibold">Cliente seleccionado</h2>
        {nombreCliente ? <p>{nombreCliente}</p> : <p className="text-gray-500">Ninguno</p>}

        <button
          className="mt-2 p-4 bg-[#DC9D00] text-black rounded-lg shadow-md w-full text-xl font-semibold"
          onClick={abrirOrden}
        >
          Abrir Orden
        </button>
      </div>
    </div>
  );
}
