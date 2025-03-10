export const prerender = false;

import { connectDB } from "../../lib/db";

export async function GET() {
  try {
    const db = await connectDB(); // Usamos el túnel SSH
    // Seleccionamos solo las órdenes cuyo estado es "abierta"
    const [orders] = await db.execute("SELECT * FROM ordenes WHERE estado = 'abierta'");
    return new Response(JSON.stringify({ success: true, orders }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
