import request from "supertest";
import { app } from "../../../../app";
import { CityModel } from "../../infra/mongodb/models/CityModel";

describe("Create City", () => {
  beforeEach(async () => {
    return CityModel.deleteMany();
  });

  it("Should be able to create a new city", async () => {
    const response = await request(app)
      .post("/cities")
      .send({
        name: "Faina",
        state: "Goiás",
      });
    expect(response.status).toBe(201);
    const createdResponse = await request(app).get("/cities")
    expect(createdResponse.status).toBe(200);
    expect(createdResponse.body).toHaveLength(1);
    expect(createdResponse.body[0]).toHaveProperty("id");
    expect(createdResponse.body[0]).toHaveProperty("name");
    expect(createdResponse.body[0]).toHaveProperty("state");
  });

  it("Should not be able to create a new city without a name", async () => {
    const response = await request(app)
      .post("/cities")
      .send({
        name: "",
        state: "Goiás",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "name" can not be empty.')
  });

  it("Should not be able to create a new city without a state", async () => {
    const response = await request(app)
      .post("/cities")
      .send({
        name: "Faina",
        state: "",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "state" can not be empty.')
  });

  it("Should not be able to create a new city when another city with same name already exists in state", async () => {
    await request(app)
      .post("/cities")
      .send({
        name: "Faina",
        state: "Goiás",
      });
    const response = await request(app)
      .post("/cities")
      .send({
        name: "Faina",
        state: "Goiás",
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('City already exists.')
  });
});