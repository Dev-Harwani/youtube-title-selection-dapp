"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const util_1 = __importDefault(require("../util"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = "0xasdfasdf"; //harcoded for now. will fetch it from user's wallet
    try {
        const existingUser = yield util_1.default.worker.findFirst({
            where: {
                address: address
            }
        });
        if (!existingUser) {
            const user = yield util_1.default.worker.create({
                data: {
                    address: address,
                    balance: "0"
                }
            });
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, "asdf");
            res.status(200).json({
                token: token
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id }, "asdf");
        res.status(200).json({
            token: token
        });
    }
    catch (error) {
        console.log(error);
    }
}));
router.get("/nextTask", middleware_1.workerAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const workerId = req.userId;
    const remainingTasks = yield util_1.default.task.findMany({
        where: {
            done: false,
            submissions: {
                none: {
                    workerId: workerId
                }
            }
        },
        select: {
            options: true
        }
    });
    if (!remainingTasks) {
        res.json({
            message: "no tasks remaining"
        });
    }
    else {
        res.json({
            tasks: remainingTasks
        });
    }
}));
exports.default = router;
