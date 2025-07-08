import supertest from "supertest";

export const api = supertest(process.env.API_BASE_URL);