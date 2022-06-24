import request from "supertest";
import { app } from "../../../../app";
import { CityModel } from "../../../cities/infra/mongodb/models/CityModel";
import { ClientModel } from "../../infra/mongodb/models/ClientModel";


describe("Update Fullname Of Client", () => {
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
 
  it("Should be able to update the fullname of registered client", async () => {
    const clientsResponse = await request(app).get('/clients');
    const clientId = clientsResponse.body[0].id;
    const response = await request(app)
      .patch(`/clients/${clientId}`)
      .send({
        fullName: "Leonardo J. Ribeiro"
      });
    expect(response.status).toBe(200);
    const clientUpdatedResponse = await request(app).get(`/clients/${clientId}`);
    expect(clientUpdatedResponse.body.fullName).toBe("Leonardo J. Ribeiro");
    expect(clientUpdatedResponse.body).toHaveProperty("id");
    expect(clientUpdatedResponse.body).toHaveProperty("fullName");
    expect(clientUpdatedResponse.body).toHaveProperty("age");
    expect(clientUpdatedResponse.body).toHaveProperty("birthdate");
    expect(clientUpdatedResponse.body).toHaveProperty("gender");
    expect(clientUpdatedResponse.body).toHaveProperty("city");
    expect(clientUpdatedResponse.body.city).toHaveProperty("id");
    expect(clientUpdatedResponse.body.city).toHaveProperty("name");
    expect(clientUpdatedResponse.body.city).toHaveProperty("state");
  });

  it("Should not be able to update the fullname of registered client without a fullname", async () => {
    const clientsResponse = await request(app).get('/clients');
    const clientId = clientsResponse.body[0].id;
    const response = await request(app)
      .patch(`/clients/${clientId}`)
      .send({
        fullName: ""
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The "fullname" can not be empty.');
  });

  it("Should not be able to update the fullname of registered client when another client has a same fullname", async () => {
    const clientsResponse = await request(app).get('/clients');
    const clientId = clientsResponse.body[0].id;
    const response = await request(app)
      .patch(`/clients/${clientId}`)
      .send({
        fullName: "Maria da Silva"
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Client alread exists.');
  });

  it("Should not be able to update the fullname of client that not exists", async () => {
    const clientId = "62b4eadc8d9aa420ca597427";
    const response = await request(app)
      .patch(`/clients/${clientId}`)
      .send({
        fullName: "Maria da Silva"
      });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Client not found.');
  });

  it("Should not be able to update the fullname of registered client with a invalid id", async () => {
    const clientId = "12345";
    const response = await request(app)
      .patch(`/clients/${clientId}`)
      .send({
        fullName: "Maria da Silva"
      });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('The id must be a valid id.');
  });
});