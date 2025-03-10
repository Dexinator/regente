import mysql from "mysql2/promise";
import { Client } from "ssh2";
import fs from "fs";
import "dotenv/config";

const sshClient = new Client();

// Si se define la variable SSH_PRIVATE_KEY, se usa y se formatea correctamente;
// de lo contrario, se intenta leer la clave desde el archivo.
const privateKey = process.env.SSH_PRIVATE_KEY
  ? process.env.SSH_PRIVATE_KEY.replace(/\\n/g, "\n")
  : fs.readFileSync("C:/Users/jbadi/.ssh/google_cloud");

export async function connectDB() {
  return new Promise((resolve, reject) => {
    sshClient
      .on("ready", () => {
        sshClient.forwardOut(
          "127.0.0.1",
          3306,
          process.env.DATABASE_HOST, // La IP de MySQL en SiteGround
          3306,
          async (err, stream) => {
            if (err) {
              sshClient.end();
              return reject(err);
            }

            const pool = mysql.createPool({
              host: "127.0.0.1", // Se conecta a través del túnel SSH
              user: process.env.DATABASE_USER,
              password: process.env.DATABASE_PASSWORD,
              database: process.env.DATABASE_NAME,
              stream,
              waitForConnections: true,
              connectionLimit: 10,
              queueLimit: 0,
            });

            resolve(pool);
          }
        );
      })
      .connect({
        host: process.env.SSH_HOST, // La IP de la VM en Google Cloud
        port: 22,
        username: process.env.SSH_USER, // Usuario de la VM
        privateKey, // Usa la clave privada desde la variable o el archivo
      });
  });
}
