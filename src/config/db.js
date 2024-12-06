import mysql from "mysql2/promise";

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: parseInt(DB_PORT),
  connectionLimit: 10,
  queueLimit: 0,
});

const getConnection = async () => {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    throw error;
  }
};

export default getConnection;
