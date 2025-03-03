export const prerender = false; 

import pool from "../../lib/db";

// 🟢 Crear una nueva orden (preso_id opcional)
export async function POST({ request }) {
  try {
    const { preso_id = null, nombre_cliente, total, empleado_id } = await request.json();

    const [result] = await pool.query(
      "INSERT INTO ordenes (preso_id, nombre_cliente, total, empleado_id) VALUES (?, ?, ?, ?)",
      [preso_id, nombre_cliente, total, empleado_id]
    );

    return new Response(JSON.stringify({ success: true, orderId: result.insertId }), {
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


// 🔵 Obtener detalles de una orden
export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "ID de orden requerido" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const [orden] = await pool.query("SELECT * FROM ordenes WHERE id = ?", [id]);
    if (orden.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Orden no encontrada" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    }

    return new Response(JSON.stringify({ success: true, orden: orden[0] }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

// 🟠 Cerrar una orden
export async function PUT({ request }) {
  try {
    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ success: false, error: "ID de orden requerido" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    await pool.query("UPDATE ordenes SET estado = 'cerrada' WHERE id = ?", [id]);

    return new Response(JSON.stringify({ success: true, message: "Orden cerrada" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
