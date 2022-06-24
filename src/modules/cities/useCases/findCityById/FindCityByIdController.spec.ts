import request from "supertest";
import { app } from "../../../../app";
import { CityModel } from "../../infra/mongodb/models/CityModel";

describe("Find City By Id", () => {
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

  it("Should be able to find a city by id", async () => {
    const citiesResponse = await request(app).get("/cities");
    const cityId = citiesResponse.body[0].id;
    const response = await request(app).get(`/cities/${cityId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("state");
  });

  it("Should not be able to find a city that not exists", async () => { 
    const response = await request(app).get("/cities/62b4eadc8d9aa420ca597427");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("City not found.");
  });

  it("Should not be able to find a city whit a invalid id", async () => { 
    const response = await request(app).get("/cities/12345");
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The id must be a valid id.");
  });
});