import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { WORKER_JWT_SECRET } from "./config";

export function authMiddleware (req:Request, res:Response, next:NextFunction) {
    // @ts-ignore
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token,JWT_SECRET);
        //@ts-ignore
        if(decoded.userId){
            //@ts-ignore
            req.userId = decoded.userId;
            return next();
        }
        else{
            return res.status(404).json({
                message: "authorization header not found"
            })
        }
    }
    
}

export function workerAuthMiddleware (req:Request, res:Response, next:NextFunction) {
    // @ts-ignore
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token,WORKER_JWT_SECRET);
        //@ts-ignore
        if(decoded.userId){
            //@ts-ignore
            req.userId = decoded.userId;
            return next();
        }
        else{
            return res.status(404).json({
                message: "authorization header not found"
            })
        }
    }
    
}