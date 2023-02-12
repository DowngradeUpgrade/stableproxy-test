import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class ProductsModel {
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

  async addProductsToReview(products) {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      for (const product of products) {
        const { sku, name, url, color, description, avgPrice, images } =
          product;

        const [rows] = await connection.query(
          "SELECT * FROM products_review WHERE sku = ?",
          [sku]
        );

        if (rows.length === 0) {
          const [rows] = await connection.query(
            "INSERT INTO products_review (sku, name, url, color, description, price) VALUES (?, ?, ?, ?, ?, ?)",
            [sku, name, url, color, description, avgPrice]
          );
        } else {
          const [rows] = await connection.query(
            "UPDATE products_review SET name = ?, url = ?, color = ?, description = ?, price = ? WHERE sku = ?",
            [name, url, color, description, avgPrice, sku]
          );
        }

        for (const image of images) {
          const [rows] = await connection.query(
            "INSERT INTO products_images (sku, image) VALUES (?, ?)",
            [sku, image]
          );
        }
      }
      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    return "ok";
  }

  async getAllProducts(page, limit) {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      let rows = [];

      if (page && limit) {
        [rows] = await connection.query(
          "SELECT id, name, url, new_price, created_at FROM products LIMIT ?, ?",
          [(page - 1) * limit, limit]
        );
      } else {
        [rows] = await connection.query("SELECT id, name, url, new_price, created_at FROM products");
      }

      await connection.commit();

      return {
        data: rows,
        total: rows.length,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async getReviewProducts() {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      const [rows] = await connection.query("SELECT * FROM products_review");

      await connection.commit();

      return rows;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async transgerProductsToMain(products) {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      for (const product of products) {
        const { id, new_price } = product;

        const [old_data] = await connection.query(
          "SELECT * FROM products_review WHERE id = ?",
          [id]
        );

        const { sku, name, url, color, description, price } = old_data[0];

        
        const [rows] = await connection.query(
          "SELECT * FROM products WHERE sku = ?",
          [sku]
        );

        if (rows.length === 0) {
          const [rows] = await connection.query(
            "INSERT INTO products (sku, name, url, color, description, old_price, new_price) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [sku, name, url, color, description, price, new_price]
          );
        } else {
          const [rows] = await connection.query(
            "UPDATE products SET name = ?, url = ?, color = ?, description = ?, old_price = ?, new_price = ? WHERE sku = ?",
            [name, url, color, description, price, new_price, sku]
          );
        }

        const [res] = await connection.query(
          "DELETE FROM products_review WHERE sku = ?",
          [sku]
        );
      }
      await connection.commit();

      return "ok";
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }

  async deleteProductsFromReview(products) {
    const connection = await this.db.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      for (const product of products) {
        const { id } = product;

        const [old_data] = await connection.query(
          "SELECT * FROM products_review WHERE id = ?",
          [id]
        );

        const { sku } = old_data[0];

        const [res] = await connection.query(
          "DELETE FROM products_review WHERE sku = ?",
          [sku]
        );
      }
      await connection.commit();

      return "ok";
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

export default new ProductsModel();
