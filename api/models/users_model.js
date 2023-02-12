import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class UsersModel {
  constructor() {
    this.db = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async addUser(login, password, role) {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        "INSERT INTO users (login, password, role) VALUES (?, ?, ?)",
        [login, password, role]
      );

      await connection.commit();
      return "ok";
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async getUserByLogin(login) {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        "SELECT * FROM users WHERE login = ?",
        [login]
      );

      await connection.commit();
      return rows[0];
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async setJwtToken(login, token) {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        "UPDATE users SET token = ? WHERE login = ?",
        [token, login]
      );

      await connection.commit();
      return "ok";
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async getJwtToken(login) {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      const [rows] = await connection.query(
        "SELECT token FROM users WHERE login = ?",
        [login]
      );

      await connection.commit();
      return rows[0].token;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

export default new UsersModel();
