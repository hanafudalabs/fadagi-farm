import {removeTestUser} from "./test-util.js";
import {api} from "./api.js";
import {logger} from "../utils/logger.js";

describe('POST /api/auth/register', () => {

    afterEach(async () => {
        await removeTestUser();
    });

    it("Should create a test user", async () => {
        const response = await api.post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@me.com",
                password: "password1"
            })
            .expect(201);

        logger.info(response.body.message);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.newUser.email).toBe('test@me.com');
    });
})