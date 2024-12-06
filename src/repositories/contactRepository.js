import getConnection from "../config/db.js";
import Contact from "../models/contact.js";

/**
 * Clase para manejar las operaciones CRUD sobre los contactos
 *
 * @interface IContactRepository
 * @property {function} findAll Devuelve todos los contactos
 * @property {function} findById Devuelve un contacto por su identificador
 * @property {function} create Crea un nuevo contacto
 * @property {function} update Actualiza un contacto
 * @property {function} delete Elimina un contacto
 *
 * @implements {IContactRepository}
 * @class ContactRepository
 *
 */
export default class ContactRepository {
  async findAll() {
    const connection = await getConnection();
    const sql = "SELECT * FROM contacts";
    const [rows, _] = await connection.execute(sql);
    return rows;
  }

  async findById(id) {
    const connection = await getConnection();
    const sql = "SELECT * FROM contacts WHERE id = ?";
    const [rows, _] = await connection.execute(sql, [id]);
    return rows[0];
  }

  async create(model) {
    const connection = await getConnection();
    const fields = model.getFieldsForSql(Contact.Modes.INSERT);
    const bindValues = model.getBindValues();
    const placeholders = model.getPlaceholdersForSql();
    const sql = `INSERT INTO contacts (${fields}) VALUES (${placeholders})`;
    const [rows, _] = await connection.execute(sql, [...bindValues]);
    return rows;
  }

  async update(id, model) {
    const connection = await getConnection();
    const fields = model.getFieldsForSql(Contact.Modes.UPDATE);
    const bindValues = model.getBindValues();
    const sql = `UPDATE contacts SET ${fields} WHERE id = ?`;
    const [rows] = await connection.execute(sql, [...bindValues, id]);
    return rows.affectedRows;
  }

  async delete(id) {
    const connection = await getConnection();
    const sql = "DELETE FROM contacts WHERE id = ?";
    const [rows, _] = await connection.execute(sql, [id]);
    return rows.deletedRows;
  }
}
