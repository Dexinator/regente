export const prerender = false;

import { connectDB } from "../../lib/db";
import bcrypt from "bcryptjs";

export async function POST({ request }) {
  try {
    const { nombre, usuario, contraseña, rol } = await request.json();

    // Verificar que los campos sean obligatorios
    if (!nombre || !usuario || !contraseña || !rol) {
      return new Response(JSON.stringify({ success: false, error: "Todos los campos son obligatorios" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verificar que el rol sea válido
    const rolesValidos = ["admin", "mesero", "cocinero", "financiero"];
    if (!rolesValidos.includes(rol)) {
      return new Response(JSON.stringify({ success: false, error: "Rol no válido" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const db = await connectDB();

    // Verificar si el usuario ya existe
    const [existeUsuario] = await db.execute("SELECT id FROM empleados WHERE usuario = ?", [usuario]);
    if (existeUsuario.length > 0) {
      return new Response(JSON.stringify({ success: false, error: "El usuario ya está registrado" }), {
        headers: { "Content-Type": "application/json" },
        status: 409,
      });
    }

    // Hashear la contraseña antes de almacenarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Insertar el nuevo empleado en la base de datos
    await db.execute(
      "INSERT INTO empleados (nombre, usuario, contraseña, rol, fecha_registro) VALUES (?, ?, ?, ?, NOW())",
      [nombre, usuario, hashedPassword, rol]
    );

    return new Response(JSON.stringify({ success: true, message: "Empleado registrado correctamente" }), {
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
