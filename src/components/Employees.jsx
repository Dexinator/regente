import { useState, useEffect } from "react";

export default function Employees() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("mesero"); // Valor por defecto
  const [editando, setEditando] = useState(null);
  const rolesDisponibles = ["admin", "mesero", "cocinero", "financiero"];
  const [nuevaContraseña, setNuevaContraseña] = useState("");
const [cambiarPassId, setCambiarPassId] = useState(null);


  useEffect(() => {
    fetchEmpleados();
  }, []);

  const fetchEmpleados = async () => {
    try {
      const res = await fetch("/api/admin-empleados");
      const data = await res.json();
      if (data.success) {
        setEmpleados(data.empleados);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
      setLoading(false);
    }
  };

  const agregarEmpleado = async () => {
    if (!nombre || !usuario || !contraseña || !rol) return alert("Todos los campos son obligatorios");

    const res = await fetch("/api/admin-empleados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, usuario, contraseña, rol }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Empleado agregado correctamente");
      fetchEmpleados();
      setNombre("");
      setUsuario("");
      setContraseña("");
      setRol("mesero");
    } else {
      alert("Error al agregar empleado: " + data.error);
    }
  };

  const cambiarEstadoEmpleado = async (id, estado) => {
    const res = await fetch("/api/admin-empleados", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, activo: estado ? 1 : 0 }),
    });

    const data = await res.json();
    if (data.success) {
      alert(estado ? "Empleado activado" : "Empleado desactivado");
      fetchEmpleados();
    } else {
      alert("Error al cambiar estado del empleado: " + data.error);
    }
  };

  const cambiarContraseña = async () => {
    if (!cambiarPassId || !nuevaContraseña) return alert("Todos los campos son obligatorios");
  
    const res = await fetch("/api/admin-empleados", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cambiarPassId, nuevaContraseña }),
    });
  
    const data = await res.json();
    if (data.success) {
      alert("Contraseña actualizada correctamente");
      setNuevaContraseña("");
      setCambiarPassId(null);
    } else {
      alert("Error al cambiar contraseña: " + data.error);
    }
  };
  

  return (
    <div className="min-h-screen bg-[#721422] text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Empleados</h1>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Nombre"
          className="p-2 text-black"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Usuario"
          className="p-2 text-black"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="p-2 text-black"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
        />
        <select
          className="p-2 text-black"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          {rolesDisponibles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <button
          className="bg-green-500 p-2 rounded"
          onClick={agregarEmpleado}
        >
          Agregar
        </button>
      </div>
      {cambiarPassId && (
  <div className="flex space-x-2 mb-4">
    <input
      type="password"
      placeholder="Nueva Contraseña"
      className="p-2 text-black"
      value={nuevaContraseña}
      onChange={(e) => setNuevaContraseña(e.target.value)}
    />
    <button className="bg-blue-500 p-2 rounded" onClick={cambiarContraseña}>
      Confirmar Cambio
    </button>
    <button className="bg-gray-500 p-2 rounded" onClick={() => setCambiarPassId(null)}>
      Cancelar
    </button>
  </div>
)}



      {loading ? (
        <p className="text-white">Cargando empleados...</p>
      ) : (
        <table className="w-full max-w-4xl bg-white text-black rounded-lg overflow-hidden">
          <thead className="bg-[#DC9D00] text-black">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Rol</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id} className="text-center border-t">
                <td className="p-3">{emp.id}</td>
                <td className="p-3">{emp.nombre}</td>
                <td className="p-3">{emp.rol}</td>
                <td className="p-3">{emp.activo ? "Activo" : "Inactivo"}</td>
                <td className="p-3">
  <button
    onClick={() => setCambiarPassId(emp.id)}
    className="bg-blue-500 p-2 rounded mr-2"
  >
    🔑 Cambiar Contraseña
  </button>
  <button
    onClick={() => cambiarEstadoEmpleado(emp.id, !emp.activo)}
    className={emp.activo ? "bg-red-500 p-2 rounded" : "bg-green-500 p-2 rounded"}
  >
    {emp.activo ? "Desactivar" : "Activar"}
  </button>
</td>

                
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
