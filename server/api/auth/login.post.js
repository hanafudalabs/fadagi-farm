import {userLoginValidation} from "~/server/validation/user-login-validation.js";
import prisma from "~/utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Validate user input
    const {error, value} = userLoginValidation.validate(body);
    if (error) {
        throw createError({
            statusCode: 400, statusMessage: error.details[0].message
        });
    }

    const {email, password} = value;
    const config = useRuntimeConfig(event);

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (!user) {
        throw createError({
            statusCode: 404, statusMessage: "User not found"
        });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        throw createError({
            statusCode: 401, statusMessage: "Invalid email or password"
        });
    }

    // Generate JWT token
    const token = jwt.sign({userId: user.id}, config.jwtSecret, {
        expiresIn: "1d"
    });

    // Set JWT token in cookie
    setCookie(event, "token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24,
        path: "/"
    });

    delete user.password;

    // Send response with completed user data (without password)
    event.node.res.statusCode = 200;
    return {
        success: true, message: "User logged in successfully", data: {user}
    }
})