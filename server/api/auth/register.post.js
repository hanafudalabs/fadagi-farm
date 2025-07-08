import prisma from "~/utils/prisma.js";
import bcrypt from "bcrypt";
import {userRegisterValidation} from "~/server/validation/user-register-validation.js";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Validate user input
    const {error, value} = userRegisterValidation.validate(body);
    if (error) {
        throw createError({
            statusCode: 400, statusMessage: error.details[0].message
        });
    }

    const {name, email, password, referrerCode} = value;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email
        }
    });
    if (existingUser) {
        throw createError({
            statusCode: 409, statusMessage: "Email already exists"
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Logic for handling referrer code
    let referredById = null;
    if (referrerCode) {
        const referrer = await prisma.user.findUnique({
            where: {
                referralCode: referrerCode
            }
        });

        if (referrer) {
            referredById = referrer.id;
        } else {
            throw createError({
                statusCode: 400, statusMessage: "Invalid referrer code"
            });
        }
    }

    // Create a new user
    let newUser
    try {
        newUser = await prisma.user.create({
            data: {
                name, email, password: hashedPassword, role: "INVESTOR", ...(referredById && {
                    referredById: referredById
                })
            }
        });
    } catch (error) {
        throw createError({
            statusCode: 500, statusMessage: "Failed to create user"
        });
    }

    delete newUser.password;

    // Send response with completed user data
    event.node.res.statusCode = 201;
    return {
        success: true, message: "User created successfully", data: {newUser}
    }
});