import { connectDB } from "../../lib/db";

export async function GET() {
  try {
    const db = await connectDB(); // Usa la conexión a través del túnel SSH
    const [rows] = await db.execute("SELECT 1 + 1 AS resultado");
    return new Response(JSON.stringify({ success: true, resultado: rows[0].resultado }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
