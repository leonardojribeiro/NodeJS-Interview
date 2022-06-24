import request from "supertest";
import { app } from "../../../../app";
import { CityModel } from "../../../cities/infra/mongodb/models/CityModel";
import { ClientModel } from "../../infra/mongodb/models/ClientModel";


describe("Delete Client By Id", () => {
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
    await request(app)
      .post("/clients")
      .send({
        fullName: "Maria da Silva",
        age: 20,
        birthdate: new Date("2002-01-16"),
        gender: "female",
        city_id: city.id,
      });
  });

  it("Should be able to delete a client by id", async () => {
    let clientsResponse = await request(app).get('/clients');
    const clientId = clientsResponse.body[0].id;
    const response = await request(app).delete(`/clients/${clientId}`);
    expect(response.status).toBe(204);
    clientsResponse = await request(app).get('/clients');
    expect(clientsResponse.body).toHaveLength(1);
  });

  it("Should not be able to delete a client that not exists", async () => {
    const response = await request(app).delete('/clients/62b4eadc8d9aa420ca597427')
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Client not found.');
  });

  it("Should not be able to delete a client with a invalid id", async () => {
    const response = await request(app).get('/clients/12345')
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The id must be a valid id.');
  });
});