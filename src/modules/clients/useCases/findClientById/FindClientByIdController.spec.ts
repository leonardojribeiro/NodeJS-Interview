import request from "supertest";
import { app } from "../../../../app";
import { CityModel } from "../../../cities/infra/mongodb/models/CityModel";
import { ClientModel } from "../../infra/mongodb/models/ClientModel";


describe("Find Client By Id", () => {
  beforeAll(async () => {
    await CityModel.deleteMany();
    await ClientModel.deleteMany();
    await request(app)
      .post("/cities")
      .send({
        name: "Faina",
        state: "Goiás",
      });
    const citiesResponse = await request(app).get("/cities");
    const city = citiesResponse.body[0];
    await request(app)
      .post("/clients")
      .send({
        fullName: "Leonardo Jardim Ribeiro",
        age: 23,
        birthdate: new Date("1998-06-25"),
        gender: "masculine",
        city_id: city.id,
      });
  });
 
  it("Should be able to find a client by id", async () => {
    const clientsResponse = await request(app).get('/clients');
    const clientId = clientsResponse.body[0].id;
    const response = await request(app).get(`/clients/${clientId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("fullName");
    expect(response.body).toHaveProperty("age");
    expect(response.body).toHaveProperty("birthdate");
    expect(response.body).toHaveProperty("gender");
    expect(response.body).toHaveProperty("city");
    expect(response.body.city).toHaveProperty("id");
    expect(response.body.city).toHaveProperty("name");
    expect(response.body.city).toHaveProperty("state");
  });

  it("Should not be able to find a client that not exists", async () => {
    const response = await request(app).get('/clients/62b4eadc8d9aa420ca597427')
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Client not found.');
  });

  it("Should not be able to find a client with a invalid id", async () => {
    const response = await request(app).get('/clients/12345')
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The id must be a valid id.');
  });
});