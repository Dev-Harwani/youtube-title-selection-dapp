"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const config_2 = require("./config");
function authMiddleware(req, res, next) {
    // @ts-ignore
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        //@ts-ignore
        if (decoded.userId) {
            //@ts-ignore
            req.userId = decoded.userId;
            return next();
        }
        else {
            return res.status(404).json({
                message: "authorization header not found"
            });
        }
    }
}
exports.authMiddleware = authMiddleware;
function workerAuthMiddleware(req, res, next) {
    // @ts-ignore
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_2.WORKER_JWT_SECRET);
        //@ts-ignore
        if (decoded.workerId) {
            //@ts-ignore
            req.workerId = decoded.workerId;
            return next();
        }
        else {
            return res.status(404).json({
                message: "authorization header not found"
            });
        }
    }
}
exports.workerAuthMiddleware = workerAuthMiddleware;
