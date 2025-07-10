import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';

export const removeTestUser = async () => {
    await prisma.user.deleteMany({
        where: {
            email: {
                contains: "investor.com"
            }
        }
    });
}

export const createTestUser = async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.create({
        data: {
            name: "Budi Investor Test User",
            email: "testbudi@investor.com",
            password: hashedPassword
        }
    })
}