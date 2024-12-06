import ContactRepository from "../repositories/contactRepository.js";
import ContactService from "../services/contactService.js";
import Contact from "../models/contact.js";

const repository = new ContactRepository();
const service = new ContactService(repository);

export async function getAllContacts(req, res) {
  const result = await service.getAllContacts();
  if (!result.success) {
    res.status(result.code).json({
      status: {
        success: false,
        message: result.message,
      },
      data: null,
    });
    return;
  }

  res.status(result.code).json({
    status: {
      success: true,
      message: result.message,
    },
    data: result.data,
  });
}

export async function getContactById(req, res) {
  const result = await service.getContactById(req.params.id);
  if (!result.success) {
    res.status(result.code).json({
      status: {
        success: false,
        message: result.message,
      },
      data: null,
    });
    return;
  }

  res.status(result.code).json({
    status: {
      success: result.success,
      message: result.message,
    },
    data: result.data,
  });
}

export async function createContact(req, res) {
  let code = 500;
  try {
    const contact = req.body;
    const contactModel = Contact.makeModel(contact, true);
    const result = await service.createContact(contactModel);
    code = result.code;
    if (!result.success) {
      res.status(code).json({
        status: {
          success: false,
          message: result.message,
        },
        data: null,
      });
      return;
    }

    res.status(code).json({
      status: {
        success: true,
        message: result.message,
      },
      data: result.data,
    });
  } catch (error) {
    res.status(code).json({
      status: {
        success: false,
        message: error.message,
      },
      data: null,
    });
  }
}

export async function deleteContactById(req, res) {
  const result = await service.deleteContact(req.params.id);
  if (!result.success) {
    res.status(result.code).json({
      status: {
        success: false,
        message: result.message,
      },
      data: null,
    });
    return;
  }

  res.status(result.code).json({
    status: {
      success: true,
      message: result.message,
    },
    data: result.data,
  });
}

export async function updateContactById(req, res) {
  let code = 500;
  try {
    const contact = req.body;
    const contactModel = Contact.makeModel(contact, false);
    const result = await service.updateContact(req.params.id, contactModel);
    code = result.code;
    if (!result.success) {
      res.status(code).json({
        status: {
          success: false,
          message: result.message,
        },
        data: null,
      });
      return;
    }

    res.status(code).json({
      status: {
        success: true,
        message: result.message,
      },
      data: result.data,
    });
  } catch (error) {
    res.status(code).json({
      status: {
        success: false,
        message: error.message,
      },
      data: null,
    });
  }
}
