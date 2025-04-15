import db from "../../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const User = db.User;
const SECRET = process.env.JWT_SECRET;

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ where: { email } });

      if (exists) return res.status(400).json({ message: "E-mail já cadastrado" });

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password_hash: hash });

      res.status(201).json({ message: "Usuário criado com sucesso", user });
    } catch (err) {
      res.status(500).json({ message: "Erro ao registrar usuário", error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });
      res.json({ message: "Login bem-sucedido", token });
    } catch (err) {
      res.status(500).json({ message: "Erro no login", error: err.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      const user = await User.findOne({ where: { email } });

      if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

      const hash = await bcrypt.hash(newPassword, 10);
      user.password_hash = hash;
      await user.save();

      res.json({ message: "Senha redefinida com sucesso" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao redefinir senha", error: err.message });
    }
  }
};

export default userController;
