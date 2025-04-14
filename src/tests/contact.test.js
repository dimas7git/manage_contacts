const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");
const db = require("../models");

const SECRET = process.env.JWT_SECRET;

let token;

beforeAll(async () => {
  await db.sequelize.sync({ force: true }); 

  const user = await db.User.create({
    name: "Test",
    email: `test${Date.now()}@example.com`,
    password_hash: "hashedpass"
  });

  token = `Bearer ${jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" })}`;
});


describe("Contatos", () => {
  it("deve criar um contato", async () => {
    const res = await request(app)
      .post("/contacts")
      .set("Authorization", token)
      .send({
        name: "Contato Teste",
        email: "contato@email.com",
        phone: "123456789",
        status: "ativo"
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("contact");
  });

  it("deve buscar todos os contatos do usuário", async () => {
    const res = await request(app)
      .get("/contacts")
      .set("Authorization", token);

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
afterAll(async () => {
  await db.sequelize.close();
});
