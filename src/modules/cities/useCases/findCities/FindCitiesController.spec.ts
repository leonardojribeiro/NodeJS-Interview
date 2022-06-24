import request from "supertest";
import { app } from "../../../../app";
import { CityModel } from "../../infra/mongodb/models/CityModel";

describe("Find Cities", () => {
  beforeAll(async () => {
    await CityModel.deleteMany();
    await request(app)
      .post("/cities")
      .send({
        name: "Faina",
        state: "Goiás",
      });
    await request(app)
      .post("/cities")
      .send({
        name: "Itapuranga",
        state: "Goiás",
      });
  });

  it("Should be able to find the registered cities", async () => {
    const response = await request(app).get("/cities")
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("state");
  });

  it("Should be able to search cities by name", async () => {
    const response = await request(app)
      .get("/cities")
      .query({
        name: "Fai"
      })
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("state");
  });

  it("Should be able to search cities by state", async () => {
    const response = await request(app)
      .get("/cities")
      .query({
        state: "goi"
      })
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("state");
  });

  it("Should be able to search cities by name and state", async () => {
    const response = await request(app)
      .get("/cities")
      .query({
        name: "iTa",
        state: "goi"
      })
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("state");
  });

  it("Should not be able to search cities when not satisfies the query", async () => {
    const response = await request(app)
      .get("/cities")
      .query({
        state: "Minas"
      })
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});