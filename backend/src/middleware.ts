import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware (req:Request, res:Response, next:NextFunction) {
    // @ts-ignore
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token,"asdf");
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

        const decoded = jwt.verify(token,"asdferf");
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