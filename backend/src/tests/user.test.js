const request = require("supertest");
const app = require("../app");
const db = require("../models");
beforeAll(async () => {
  await db.sequelize.sync({ force: true });
});

describe("Usuário", () => {
  it("deve registrar um novo usuário", async () => {
    const res = await request(app).post("/register").send({
      name: "Novo Usuário",
      email: "novo@email.com",
      password: "123456"
    });
    console.log(res.body); 
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user");
  });

  it("deve fazer login e retornar token", async () => {
    const res = await request(app).post("/login").send({
      email: "novo@email.com",
      password: "123456"
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
afterAll(async () => {
  await db.sequelize.close();
});
