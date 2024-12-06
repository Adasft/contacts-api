export default class Contact {
  static Modes = {
    INSERT: "insert",
    UPDATE: "update",
  };

  static #schema = {
    name: { required: true, type: "string" },
    lastname: { required: true, type: "string" },
    email: {
      required: true,
      type: "string",
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      required: true,
      type: "string",
      pattern:
        /^\+(?:1|7|2[0-7]|3[0-469]|4[013-9]|5[1-8]|6[0-6]|8[1-469]|9[0-58]|2[89]|5[09]|7[0-7])\d{6,14}$/,
    },
    website: { required: false, type: "string" },
    address: { required: false, type: "string" },
    company: { required: false, type: "string" },
  };

  constructor(fields = {}, validateFields = true) {
    this.#validateFields(fields, validateFields);

    for (const [key] of Object.entries(Contact.#schema)) {
      this[key] = fields[key] ?? null;
    }
  }

  /**
   * Valida los campos según el esquema.
   * @param {Object} fields - Campos proporcionados
   * @param {Boolean} validateFields - Si debe validar campos requeridos
   * @throws {Error} Si faltan campos requeridos o los valores son invalidos
   */
  #validateFields(fields, validateFields) {
    for (const [field, rules] of Object.entries(Contact.#schema)) {
      const value = fields[field];

      if (
        validateFields &&
        rules.required &&
        (value === undefined || value === null)
      ) {
        throw new Error(`El campo '${field}' es obligatorio.`);
      }

      if (value !== undefined && value !== null && rules.type) {
        const type = typeof value;
        if (type !== rules.type) {
          throw new Error(
            `El campo '${field}' debe ser de tipo '${rules.type}', pero se recibió '${type}'.`
          );
        }
      }

      if (rules.pattern && value && !rules.pattern.test(value)) {
        throw new Error(`El campo '${field}' no tiene un formato válido.`);
      }
    }
  }

  static makeModel(contact, requiredFields = true) {
    return new Contact(contact, requiredFields);
  }

  toObject() {
    return Object.fromEntries(
      Object.entries(Contact.#schema).map(([key]) => [key, this[key]])
    );
  }

  getBindValues() {
    return Object.values(this.toObject()).filter((value) => value !== null);
  }

  #filterFields(mode) {
    const model = this.toObject();
    return Object.keys(Contact.#schema).filter((key) => {
      const isRequired = Contact.#schema[key].required;
      const hasValue = model[key] !== null;
      return mode === Contact.Modes.INSERT ? isRequired || hasValue : hasValue;
    });
  }

  /**
   * Devuelve los campos del modelo en formato SQL:
   * - Incluye campos requeridos
   * - Incluye campos opcionales que tengan un valor asignado
   * - Formato: (name, lastname, email, phone, ...)
   *
   * @param {"insert" | "update"} mode - Modo de formato: 'insert' o 'update'.
   */
  getFieldsForSql(mode) {
    const fields = this.#filterFields(mode);
    return mode === Contact.Modes.INSERT
      ? fields.join(", ")
      : fields.map((key) => `${key} = ?`).join(", ");
  }

  getPlaceholdersForSql() {
    const fields = this.#filterFields(Contact.Modes.INSERT);
    return fields.map(() => "?").join(", ");
  }

  isEmpty() {
    return Object.values(this.toObject()).every(
      (value) => value === null || value === ""
    );
  }
}
