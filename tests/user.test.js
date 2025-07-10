import {createTestUser, removeTestUser} from "./test-util.js";
import {api} from "./api.js";
import {logger} from "../utils/logger.js";

/**
 * User Registration Tests
 */
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

        logger.info(response.body);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.newUser.email).toBe('test@me.com');
    });

    it("Should create a user with referrer code", async () => {
        const response = await api.post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test2@me.com",
                password: "password1",
                referrerCode: "1320793e-f769-4758-9d83-f1aeec20d1bb"
            })
            .expect(201);

        logger.info(response.body);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.newUser.email).toBe('test2@me.com');
    });

    it("Should not create a user with existing email", async () => {
        const response = await api.post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@me.com",
                password: "password1"
            })
            .expect(409);

        logger.info(response.body);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(409);
        expect(response.body.success).toBeUndefined();
        expect(response.body.message).toBe('Email already exists');
    });

    it("Should not create a user with invalid email", async () => {
        const response = await api.post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test",
                password: "password1"
            })
            .expect(400);

        logger.info(response.body);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(400);
        expect(response.body.success).toBeUndefined();
        expect(response.body.message).toBe('Email is invalid');
    });

    it("Should not create a user with invalid password", async () => {
        const response = await api.post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@me.com",
                password: "pass"
            })
            .expect(400);

        logger.info(response.body);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(400);
        expect(response.body.success).toBeUndefined();
        expect(response.body.message).toBe('Password must be at least 8 characters long and contain at least one letter and one number');
    });
})

/**
 * User Login Tests
 */
describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("Should login a user", async () => {
        const response = await api.post("/api/auth/login")
            .send({
                email: "testbudi@investor.com",
                password: "password123"
            })
            .expect(200);

        logger.info(response.body);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.user.email).toBe('testbudi@investor.com');
    });

    it("Should not login a user with invalid email", async () => {
        const response = await api.post("/api/auth/login")
            .send({
                email: "test",
                password: "password123"
            })
            .expect(400);

        logger.info(response.body);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(400);
        expect(response.body.success).toBeUndefined();
        expect(response.body.message).toBe('Invalid email or password');
    });

    it("Should not login a user with invalid password", async () => {
        const response = await api.post("/api/auth/login")
            .send({
                email: "testbudi@investor.com",
                password: "pass"
            })
            .expect(401);

        logger.info(response.body);
        logger.info(JSON.stringify(response.body.data, null, 2));

        expect(response.status).toBe(401);
        expect(response.body.success).toBeUndefined();
        expect(response.body.message).toBe('Invalid email or password');
    });
})