import { Router } from 'express';
import prisma from '../util';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware';
import z from 'zod';
import { taskInputs } from '../inputs';
import { JWT_SECRET } from '../config';

const router = Router();


router.get("/task", authMiddleware, async(req,res) => {
    const taskId = req.query.taskId;
    //@ts-ignore
    const userId = req.userId;

    const details = await prisma.task.findFirst({
        where: {
            id: Number(taskId),
            userId: userId,
        },
        include: {
            options:true
        }
    })

    if(!details){
        res.status(404).json({
            message: "you dont have access to this task."
        })
    }
    

    const responses = await prisma.submission.findMany({
        where: {
            taskId: Number(taskId)
        },
        include: {
            option: true
        }
    })

    const result: Record<string,{
        count: number,
        option: {
            video_title: string
        }
    }> = {};

    details?.options.forEach(option => {
        result[option.id] = {
            count: 0,
            option: {
                video_title: option.video_title
            }
        }
    })
    
    responses.forEach(r => {
        result[r.optionId].count++;
    })
return res.json({
    result
})
})

router.post("/task",authMiddleware, async (req,res) => {
    // @ts-ignore
    const userId = req.userId;
    const body = req.body;

    const parsedData = taskInputs.safeParse(body);
    if (!parsedData.success){
        return res.status(411).json({
            message: "data validation failed. Put correct data with correct datatypes"
        })
    } 

    const resp = await prisma.$transaction(async (tx) => {
        const response = await tx.task.create({
            data: {
                userId: userId,
                title: parsedData.data.title,
                paymentSignature: parsedData.data.signature ,
                amount: "1",

            }
        });
        await tx.option.createMany({
            
            data: parsedData.data.options.map( option => ({
                video_title: option.video_title,
                taskId: response.id   
            })) 
        })
        return response;
    })

    return res.status(200).json({
        responseId: resp.id
    })
    
})

router.post("/signin", async(req,res) => {
    const address = "0xe57FC3a21E15931b5F4A84f86f06fEB87c56b7e8" // currently hardcoded. Will have to get this from user in future.
    const existingUser = await prisma.user.findFirst({
        where: {
            address: address
        }
    })

    if (existingUser){
        const token = jwt.sign({userId: existingUser.id}, JWT_SECRET)
        return res.status(200).json({
            token: token
        })
    }

    else {
       const user = await prisma.user.create({
            data: {
                address:address
            }
        })
        const token = jwt.sign({userId: user.id}, "asdf", {expiresIn:'1h'});
        return res.status(200).json({
            token: token
        })
    }
});

export default router;