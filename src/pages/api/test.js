import pool from "../../lib/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS resultado");
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
