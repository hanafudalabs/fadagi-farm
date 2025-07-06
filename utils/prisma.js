import { PrismaClient } from '../generated/prisma/index.js'

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
} else {
    // Hindari membuat koneksi baru setiap kali ada hot-reload di development
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;