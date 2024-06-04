import { Router } from 'express';
import jwt from 'jsonwebtoken'
import prisma from '../util';
import { workerAuthMiddleware } from '../middleware';

const router = Router();

router.post("/signin", async(req,res) => {
    const address = "0xasdfasdf"  //harcoded for now. will fetch it from user's wallet
    try {
        const existingUser = await prisma.worker.findFirst({
            where: {
                address: address
            }
        })
        if(!existingUser){
            const user = await prisma.worker.create({
                data: {
                    address: address,
                    balance: "0"
                }
            })

            const token = jwt.sign({userId: user.id}, "asdf");
        res.status(200).json({
            token: token
        })
        }
        const token = jwt.sign({userId: existingUser?.id}, "asdf");
        res.status(200).json({
            token: token
        })
    
    } catch (error) {
        console.log(error);
    }
    

});

router.get("/nextTask",workerAuthMiddleware, async(req,res) => {
    // @ts-ignore
    const workerId = req.userId
    const remainingTasks = await prisma.task.findMany({
        where: {
            done: false,
            submissions: {
                none: {
                    workerId: workerId
                }
            }
        },
        select: {
            options:true
        }
    });
    if (!remainingTasks){
        res.json({
            message: "no tasks remaining"
        })
    }
    else{
        res.json({
            tasks: remainingTasks
        })
    }
})

export default router;