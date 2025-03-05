import mysql from "mysql2/promise";
import { Client } from "ssh2";
import fs from "fs";

const sshClient = new Client();

export async function connectDB() {
  return new Promise((resolve, reject) => {
    sshClient
      .on("ready", () => {
        sshClient.forwardOut(
          "127.0.0.1",
          3306,
          process.env.DATABASE_HOST, // La VM en Google Cloud
          3306,
          async (err, stream) => {
            if (err) {
              sshClient.end();
              return reject(err);
            }

            const pool = mysql.createPool({
              host: "127.0.0.1", // Se conecta a MySQL a través del túnel SSH
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
        privateKey: fs.readFileSync("/root/.ssh/vercel_vm"), // Clave SSH privada
      });
  });
}
