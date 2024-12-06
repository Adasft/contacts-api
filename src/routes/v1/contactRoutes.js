import express from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
} from "../../controllers/contactControllers.js";

/**
 * Devuelve todos los contactos
 * GET api/v1/contacts
 *
 * Devuelve un contacto por su identificador
 * GET api/v1/contacts/:id
 *
 * Crea un nuevo contacto
 * POST api/v1/contacts
 * - Parametros:
 *   - name*: Nombre del contacto
 *   - lastname*: Apellido del contacto
 *   - email*: Correo electrónico del contacto
 *   - phone*: Número de teléfono del contacto
 *   - website?: Sitio web del contacto
 *   - address?: Dirección del contacto
 *   - company?: Compañía del contacto
 *
 * Elimina un contacto
 * DELETE api/v1/contacts/:id
 *
 * Actualiza un contacto
 * PUT api/v1/contacts/:id
 * - Parametros:
 *   - name?: Nombre del contacto
 *   - lastname?: Apellido del contacto
 *   - email?: Correo electrónico del contacto
 *   - phone?: Número de teléfono del contacto
 *   - website?: Sitio web del contacto
 *   - address?: Dirección del contacto
 *   - company?: Compañía del contacto
 */
const router = express.Router();

// GET api/v1/contacts -> Devuelve todos los contactos
router.get("/", getAllContacts);

// GET api/v1/contacts/:id -> Devuelve un contacto por su identificador
router.get("/:id", getContactById);

// POST api/v1/contacts -> Crea un nuevo contacto
router.post("/", createContact);

// DELETE api/v1/contacts/:id -> Elimina un contacto
router.delete("/:id", deleteContactById);

// PUT api/v1/contacts/:id -> Actualiza un contacto
router.put("/:id", updateContactById);

export default router;
