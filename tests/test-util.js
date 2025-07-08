import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';

export const removeTestUser = async () => {
    await prisma.user.deleteMany({
        where: {
            email: {
                contain: "test"
            }
        }
    });
}

export const createTestUser = async () => {
    const hashedPassword = await bcrypt.hash("password", 10);
    await prisma.user.create({
        data: {
            name: "Test User Investor",
            email: "test-investor@me.com",
            password: hashedPassword
        }
    })
}