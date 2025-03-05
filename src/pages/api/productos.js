export const prerender = false; // Permite peticiones dinámicas

import { connectDB } from "../../lib/db";

// 🟢 Obtener la lista de productos
export async function GET() {
  try {
    const db = await connectDB(); // Usa la conexión con SSH
    const [productos] = await db.execute("SELECT * FROM productos");

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
