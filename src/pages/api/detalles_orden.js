export const prerender = false; // Permite peticiones dinámicas

import { connectDB } from "../../lib/db";

// 🟢 Agregar productos a una orden
export async function POST({ request }) {
  try {
    const db = await connectDB(); // Usa la conexión con SSH
    const { orden_id, producto_id, cantidad, precio_unitario } = await request.json();

    if (!orden_id || !producto_id || !cantidad || !precio_unitario) {
      return new Response(
        JSON.stringify({ success: false, error: "Faltan datos obligatorios" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const [result] = await db.execute(
      "INSERT INTO detalles_orden (orden_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
      [orden_id, producto_id, cantidad, precio_unitario]
    );

    return new Response(JSON.stringify({ success: true, detalleId: result.insertId }), {
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

// 🔵 Obtener los productos de una orden
export async function GET({ request }) {
  try {
    const db = await connectDB(); // Usa la conexión con SSH
    const url = new URL(request.url);
    const orden_id = url.searchParams.get("orden_id");

    if (!orden_id) {
      return new Response(
        JSON.stringify({ success: false, error: "Se requiere el ID de la orden" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    const [productos] = await db.execute(
      `SELECT d.id, d.orden_id, p.nombre, d.cantidad, d.precio_unitario, (d.cantidad * d.precio_unitario) AS total
       FROM detalles_orden d
       JOIN productos p ON d.producto_id = p.id
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
