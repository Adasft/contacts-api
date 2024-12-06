import parsePhoneNumber from "libphonenumber-js";

export default class ContactService {
  constructor(repository) {
    this.repository = repository;
  }

  #modifyContact(contact) {
    const phone = parsePhoneNumber(contact.phone);
    if (!phone) {
      return contact;
    }

    return {
      ...contact,
      email: {
        address: contact.email,
        uri: `mailto:${contact.email}`,
      },
      phone: {
        international: phone.formatInternational(),
        national: phone.formatNational(),
        uri: phone.getURI(),
      },
    };
  }

  async getAllContacts() {
    try {
      const contacts = await this.repository.findAll();
      const data = contacts.map((contact) => this.#modifyContact(contact));
      return {
        success: true,
        message: "Contactos recuperados exitosamente.",
        code: 200,
        data,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message:
          "Ocurrió un error inesperado al intentar recuperar los contactos. Por favor, inténtelo nuevamente más tarde.",
        code: 500,
        data: null,
      };
    }
  }

  async getContactById(id) {
    try {
      const contact = await this.repository.findById(id);

      if (!contact) {
        return {
          success: false,
          message: `El contacto con ID ${id} no fue encontrado. Por favor verifica que el ID sea correcto.`,
          code: 404,
          data: null,
        };
      }

      return {
        success: true,
        message: "Contacto recuperado exitosamente.",
        code: 200,
        data: this.#modifyContact(contact),
      };
    } catch (error) {
      console.error("Error al obtener el contacto:", error);

      return {
        success: false,
        message:
          "Ocurrió un error inesperado al intentar obtener el contacto. Por favor, inténtelo nuevamente más tarde.",
        code: 500,
        data: null,
      };
    }
  }

  async createContact(contactModel) {
    try {
      const data = await this.repository.create(contactModel);
      return {
        success: true,
        message: "Contacto creado exitosamente.",
        code: 201,
        data: {
          id: data.insertId,
        },
      };
    } catch (error) {
      console.error("Error al crear el contacto:", error);
      return {
        success: false,
        message:
          "Ocurrió un error inesperado al intentar crear el contacto. Por favor, inténtelo nuevamente más tarde.",
        code: 500,
        data: null,
      };
    }
  }

  async updateContact(id, contactModel) {
    if (contactModel.isEmpty()) {
      return {
        success: false,
        message: "No se han proporcionado datos para actualizar.",
        code: 400,
        data: null,
      };
    }

    try {
      const updatedRows = await this.repository.update(id, contactModel);

      if (updatedRows === 0) {
        return {
          success: false,
          message: `El contacto con ID ${id} no fue encontrado. No se realizaron cambios.`,
          code: 404,
          data: null,
        };
      }

      const updatedContactResult = await this.getContactById(id);

      if (!updatedContactResult.success) {
        return updatedContactResult;
      }

      return {
        success: true,
        message: "Contacto actualizado exitosamente.",
        code: 200,
        data: updatedContactResult.data,
      };
    } catch (error) {
      console.error("Error al actualizar el contacto:", error);

      return {
        success: false,
        message:
          "Ocurrió un error al intentar actualizar el contacto. Por favor, inténtelo nuevamente más tarde.",
        code: 500,
        data: null,
      };
    }
  }

  async deleteContact(id) {
    try {
      const deletedRows = await this.repository.delete(id);
      if (deletedRows === 0) {
        return {
          success: false,
          message: `El contacto con ID ${id} no fue encontrado. No se realizó ningún cambio.`,
          code: 404,
          data: null,
        };
      }

      return {
        success: true,
        message: "Contacto eliminado exitosamente.",
        code: 200,
        data: null,
      };
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
      return {
        success: false,
        message:
          "Ocurrió un error al intentar eliminar el contacto. Por favor, inténtelo nuevamente más tarde.",
        code: 500,
        data: null,
      };
    }
  }
}
