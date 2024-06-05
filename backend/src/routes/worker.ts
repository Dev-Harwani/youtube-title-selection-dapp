import { Router } from 'express';
import jwt from 'jsonwebtoken'
import prisma from '../connection';
import { workerAuthMiddleware } from '../middleware';
import { WORKER_JWT_SECRET } from '../config';
import { getNextTask } from '../utils';
import { submissionInputs } from '../inputs';

const TOTAL_SUBMISSIONS = 100;
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
                    address: address
                }
            })

            const token = jwt.sign({workerId: user.id}, WORKER_JWT_SECRET);
        res.status(200).json({
            token: token
        })
        }
        const token = jwt.sign({workerId: existingUser?.id}, WORKER_JWT_SECRET);
        res.status(200).json({
            token: token
        })
    
    } catch (error) {
        console.log(error);
    }
    

});

router.get("/nextTask",workerAuthMiddleware, async(req,res) => {
    // @ts-ignore
    const workerId = req.workerId
    const nextTask = await getNextTask(Number(workerId));
    if (!nextTask){
        res.json({
            message: "no tasks remaining"
        })
    }
    else{
        res.json({
            task: nextTask
        })
    }
})

router.post("/submission", workerAuthMiddleware, async(req,res) => {
    // @ts-ignore
    const workerId = req.workerId;
    const body = req.body;
    
    const parsedData = submissionInputs.safeParse(body);
    if(parsedData.success){
        const task = await getNextTask(Number(workerId));

        if(!task || task.id !== Number(parsedData.data.taskId)){
            res.status(411).json({
                message: "incorrect task id"
            })
        }

        const amount = (Number(task?.amount) / TOTAL_SUBMISSIONS).toString()
        
        const submission = await prisma.$transaction(async tx => {
            
            const submission = await tx.submission.create({
                data: {
                    workerId: workerId,
                    optionId: Number(parsedData.data.option),
                    taskId: Number(parsedData.data.taskId),
                    amount
                }
            })
            
            await tx.worker.update({
                data: {
                    pending_amount: {
                        increment: Number(amount)
                    }
                },
                where: {
                    id: workerId
                }
            })
            return submission;
        })
        
        
        
    const nextTask = await getNextTask(Number(workerId));
    res.json({
        nextTask,
        amount      
    })
    }
    else{
        res.status(411).json({
            message:"provide correct inputs"
        })
    }
    

})

router.get("/balance", workerAuthMiddleware, async(req,res) => {

    //@ts-ignore
    const workerId = req.workerId;
    const balance = await prisma.worker.findFirst({
        where: {
            id: workerId
        },
        select: {
            pending_amount:true,
            locked_amount: true
        }
    })
    return res.status(200).json({
        balance: balance
    })
})

router.post("/payouts", workerAuthMiddleware, async(req,res) => {
    //@ts-ignore
    const workerId = req.workerId;

    const worker = await prisma.worker.findFirst({
        where: {
            id: Number(workerId)
        }
    })
    
    const address = worker?.address; 
    // logic to create txnId
    const txnId = "0xasdfasdf"
})


export default router;