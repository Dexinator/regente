export const prerender = false;

import { connectDB } from "../../lib/db";

export async function GET({ request }) {
  try {
    const db = await connectDB();
    const url = new URL(request.url);
    const fecha = url.searchParams.get("fecha") || new Date().toISOString().split("T")[0]; // Fecha actual por defecto

    // Obtener ventas del día seleccionado
    const [ventas] = await db.execute(
      "SELECT COUNT(*) as orderCount, COALESCE(SUM(total), 0) as totalSales FROM ordenes WHERE estado = 'cerrada' AND DATE(fecha) = ?",
      [fecha]
    );

    // Obtener desglose de productos vendidos en la fecha seleccionada
    const [productosVendidos] = await db.execute(
      `SELECT p.nombre, SUM(d.cantidad) as cantidad_vendida
       FROM detalles_orden d
       JOIN productos p ON d.producto_id = p.id
       JOIN ordenes o ON d.orden_id = o.id
       WHERE o.estado = 'cerrada' AND DATE(o.fecha) = ?
       GROUP BY p.id
       ORDER BY cantidad_vendida DESC`,
      [fecha]
    );

    // Obtener ventas por categoría en la fecha seleccionada
    const [ventasPorCategoria] = await db.execute(
        `SELECT p.categoria, 
                SUM(d.cantidad) as cantidad_total,
                SUM(d.cantidad * d.precio_unitario) as total_vendido
         FROM detalles_orden d
         JOIN productos p ON d.producto_id = p.id
         JOIN ordenes o ON d.orden_id = o.id
         WHERE o.estado = 'cerrada' AND DATE(o.fecha) = ?
         GROUP BY p.categoria
         ORDER BY total_vendido DESC`,
        [fecha]
      ); 
      
    return new Response(
      JSON.stringify({
        success: true,
        report: ventas[0],
        productosVendidos,
        ventasPorCategoria,
        fechaSeleccionada: fecha,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}
