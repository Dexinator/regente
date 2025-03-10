export const prerender = false;

import { connectDB } from "../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST({ request }) {
  try {
    const { usuario, contraseña } = await request.json();

    // Verificar que los datos sean obligatorios
    if (!usuario || !contraseña) {
      return new Response(JSON.stringify({ success: false, error: "Usuario y contraseña requeridos" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const db = await connectDB();
    const [rows] = await db.execute("SELECT * FROM empleados WHERE usuario = ?", [usuario]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "Usuario no encontrado" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      });
    }

    const empleado = rows[0];
    const contraseñaValida = await bcrypt.compare(contraseña, empleado.contraseña);

    if (!contraseñaValida) {
      return new Response(JSON.stringify({ success: false, error: "Contraseña incorrecta" }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: empleado.id, usuario: empleado.usuario, rol: empleado.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" } // El token expira en 8 horas
    );

    return new Response(
      JSON.stringify({ success: true, token, empleado: { id: empleado.id, nombre: empleado.nombre, rol: empleado.rol } }),
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
