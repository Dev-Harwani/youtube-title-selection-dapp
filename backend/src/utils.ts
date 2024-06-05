import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getNextTask(userId: number) {
    const remainingTasks = await prisma.task.findFirst({
        select: {
            title: true,
            options:true,
            id:true,
            amount:true
        },
        where: {
            done: false,
            submissions: {
                none: {
                    workerId: userId
                }
            }
        }
        
    });

    return remainingTasks;
}