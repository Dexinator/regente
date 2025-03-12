export const prerender = false;

import { connectDB } from "../../lib/db";

// 🟢 Agregar un producto a una orden
export async function POST({ request }) {
  try {
    const db = await connectDB();
    const { orden_id, producto_id, cantidad, precio_unitario, empleado_id } = await request.json();

    // Validar que los datos necesarios estén presentes
    if (!orden_id || !producto_id || !cantidad || !precio_unitario || !empleado_id) {
      return new Response(JSON.stringify({ success: false, error: "Datos incompletos" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Insertar el producto en la orden con el empleado que lo agregó
    await db.execute(
      "INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio_unitario, empleado_id) VALUES (?, ?, ?, ?, ?)",
      [orden_id, producto_id, cantidad, precio_unitario, empleado_id]
    );

    return new Response(JSON.stringify({ success: true, message: "Producto agregado a la orden" }), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

// 🔵 Obtener detalles de una orden con productos y empleados que los agregaron
export async function GET({ request }) {
  try {
    const db = await connectDB();
    const url = new URL(request.url);
    const orden_id = url.searchParams.get("orden_id");

    if (!orden_id) {
      return new Response(JSON.stringify({ success: false, error: "ID de orden requerido" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Obtener los productos de la orden con la información de los empleados
    const [productos] = await db.execute(
      `SELECT d.id, d.producto_id, p.nombre AS producto_nombre, d.cantidad, d.precio_unitario, 
              d.empleado_id, e.nombre AS empleado_nombre
       FROM detalles_orden d
       JOIN productos p ON d.producto_id = p.id
       JOIN empleados e ON d.empleado_id = e.id
       WHERE d.orden_id = ?`,
      [orden_id]
    );

    return new Response(JSON.stringify({ success: true, productos }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
