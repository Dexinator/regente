export const prerender = false;

import { connectDB } from "../../lib/db";

// 🔵 Obtener lista de clientes registrados (presos)
export async function GET({ request }) {
  try {
    const db = await connectDB();
    const url = new URL(request.url);
    const filtro = url.searchParams.get("q"); // Parámetro opcional para buscar por nombre o ID

    let query = "SELECT id, reg_name FROM presos";
    let params = [];

    if (filtro) {
      if (!isNaN(filtro)) {
        // Si el filtro es un número, buscar por ID
        query += " WHERE id = ?";
        params = [parseInt(filtro)];
      } else {
        // Si es texto, buscar por nombre
        query += " WHERE reg_name LIKE ?";
        params = [`%${filtro}%`];
      }
    }

    const [presos] = await db.execute(query, params);

    return new Response(JSON.stringify({ success: true, presos }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
