const db = require("../../models");
const Contact = db.Contact;

exports.create = async (req, res) => {
  try {
    const contact = await Contact.create({ ...req.body, user_id: req.userId });
    res.status(201).json({ message: "Contato criado", contact });
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar contato", error: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const { status, created_from, created_to, q } = req.query;

    const where = { user_id: req.userId };

    if (status) where.status = status;
    if (created_from || created_to) {
      where.created_at = {};
      if (created_from) where.created_at[db.Sequelize.Op.gte] = new Date(created_from);
      if (created_to) where.created_at[db.Sequelize.Op.lte] = new Date(created_to);
    }
    if (q) {
      where[db.Sequelize.Op.or] = [
        { name: { [db.Sequelize.Op.like]: `%${q}%` } },
        { email: { [db.Sequelize.Op.like]: `%${q}%` } },
        { phone: { [db.Sequelize.Op.like]: `%${q}%` } }
      ];
    }

    const contacts = await Contact.findAll({ where });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar contatos", error: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      where: { id: req.params.id, user_id: req.userId }
    });

    if (!contact) return res.status(404).json({ message: "Contato não encontrado" });

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar contato", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const contact = await Contact.findOne({
      where: { id: req.params.id, user_id: req.userId }
    });

    if (!contact) return res.status(404).json({ message: "Contato não encontrado" });

    await contact.update(req.body);
    res.json({ message: "Contato atualizado", contact });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar contato", error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const rowsDeleted = await Contact.destroy({
      where: { id: req.params.id, user_id: req.userId }
    });

    if (rowsDeleted === 0) return res.status(404).json({ message: "Contato não encontrado" });

    res.json({ message: "Contato deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao deletar contato", error: err.message });
  }
};
