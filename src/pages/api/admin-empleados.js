export const prerender = false; 

import { connectDB } from "../../lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const db = await connectDB();
    await db.query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    await db.query("SET CHARACTER SET utf8mb4");

    const [empleados] = await db.query("SELECT id, nombre, usuario, rol, activo FROM empleados");

    db.end();

    return new Response(JSON.stringify({ success: true, empleados }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
}

export async function POST({ request }) {
  try {
    const db = await connectDB();
    const { nombre, usuario, contraseña, rol } = await request.json();

    if (!nombre || !usuario || !contraseña || !rol) {
      return new Response(JSON.stringify({ success: false, error: "Faltan datos obligatorios" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

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
      "INSERT INTO empleados (nombre, usuario, contraseña, rol, activo, fecha_registro) VALUES (?, ?, ?, ?, 1, NOW())",
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

export async function PUT({ request }) {
  try {
    const db = await connectDB();
    const { id, nombre, rol, activo } = await request.json();

    if (!id || !nombre || !rol || activo === undefined) {
      return new Response(JSON.stringify({ success: false, error: "Faltan datos obligatorios" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    await db.query("UPDATE empleados SET nombre = ?, rol = ?, activo = ? WHERE id = ?", [nombre, rol, activo, id]);

    db.end();

    return new Response(
      JSON.stringify({ success: true, message: "Empleado actualizado correctamente" }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
}

export async function PATCH({ request }) {
    try {
      const db = await connectDB();
      const { id, nuevaContraseña } = await request.json();
  
      if (!id || !nuevaContraseña) {
        return new Response(
          JSON.stringify({ success: false, error: "Faltan datos obligatorios" }),
          { headers: { "Content-Type": "application/json" }, status: 400 }
        );
      }
  
      // Hashear la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(nuevaContraseña, salt);
  
      // Actualizar la contraseña en la base de datos
      await db.query("UPDATE empleados SET contraseña = ? WHERE id = ?", [hashedPassword, id]);
  
      db.end();
  
      return new Response(
        JSON.stringify({ success: true, message: "Contraseña actualizada correctamente" }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }
  }