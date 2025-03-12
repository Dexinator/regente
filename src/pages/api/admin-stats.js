import { connectDB } from "../../lib/db";

export async function GET() {
  try {
    const db = await connectDB(); // 🔵 Conexión a la base de datos

    // Consultas SQL para obtener estadísticas clave
    const [ordenesAbiertas] = await db.query("SELECT COUNT(*) AS total FROM ordenes WHERE estado = 'abierta'");
    const [ingresosHoy] = await db.query("SELECT SUM(total) AS total FROM ordenes WHERE DATE(fecha) = CURDATE()");
    const [empleadosActivos] = await db.query("SELECT COUNT(*) AS total FROM empleados");

    // Cerrar la conexión después de la consulta
    db.end();

    // Formatear la respuesta con los valores obtenidos
    return new Response(
      JSON.stringify({
        success: true,
        ordenesAbiertas: ordenesAbiertas[0].total || 0,
        ingresosHoy: ingresosHoy[0].total || 0,
        empleadosActivos: empleadosActivos[0].total || 0,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}
