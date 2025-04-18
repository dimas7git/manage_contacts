#  Manage Contacts

Sistema de gerenciamento de contatos completo com frontend em React e backend em Node.js/Express, utilizando Sequelize + MySQL.

---

##  Funcionalidades

- Cadastro, edição e exclusão de contatos
- Busca por nome, e-mail, telefone, cidade, bairro ou CEP
- Filtros por:
  - Status (ativo/inativo)
  - Data de criação
- Exportação dos contatos em `.csv`
- Preenchimento automático de endereço via **CEP (ViaCEP API)**

---

##  Tecnologias Utilizadas

###  Backend
- Node.js
- Express
- Sequelize + MySQL
- JWT (autenticação)
- Bcrypt
- Jest + Supertest
- dotenv

###  Frontend
- React
- Tailwind CSS
- Axios
- React Router DOM
- HeroIcons e React Icons
- PapaParse (CSV)
- XLSX (planilhas)

---

##  Como Rodar o Projeto

###  Pré-requisitos

- Node.js
- MySQL (criar um banco `manage_contacts`)
- Yarn ou npm

---

###  Configuração do Backend

```bash
cd backend
cp .env.example .env

npm install
npm run dev
```

### Exemplo .env

```bash
DB_HOST=localhost
DB_USER=root
DB_PASS=sua_senha
DB_NAME=manage_contacts
JWT_SECRET=uma_chave_secreta
```

###  Configuração do Frontend

```bash
cd frontend
npm install
npm start
```
