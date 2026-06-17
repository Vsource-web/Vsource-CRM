import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function validateUser(
    email: string,
    password: string
) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        include: {
            role: {
                include: {
                    modulePermissions: {
                        include: {
                            module: true,
                        },
                    },
                },
            },
            branches: true,
        },
    });

    if (!user) {
        return null;
    }

    const valid = await bcrypt.compare(
        password,
        user.password
    );

    if (!valid) {
        return null;
    }

    return user;
}