import supertest from "supertest";
import {removeTestUser} from "~/tests/test-util.js";

describe("POST /api/auth/register", () => {
    afterEach(async ()=>{
        await removeTestUser();
    });

    it("Should create a new user", async()=>{
        const response = await supertest(web);
    })
})