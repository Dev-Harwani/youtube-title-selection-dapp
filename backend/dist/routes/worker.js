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
const connection_1 = __importDefault(require("../connection"));
const middleware_1 = require("../middleware");
const config_1 = require("../config");
const utils_1 = require("../utils");
const inputs_1 = require("../inputs");
const TOTAL_SUBMISSIONS = 100;
const router = (0, express_1.Router)();
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = "0xasdfasdf"; //harcoded for now. will fetch it from user's wallet
    try {
        const existingUser = yield connection_1.default.worker.findFirst({
            where: {
                address: address
            }
        });
        if (!existingUser) {
            const user = yield connection_1.default.worker.create({
                data: {
                    address: address,
                    balance: 0
                }
            });
            const token = jsonwebtoken_1.default.sign({ workerId: user.id }, config_1.WORKER_JWT_SECRET);
            res.status(200).json({
                token: token
            });
        }
        const token = jsonwebtoken_1.default.sign({ workerId: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id }, config_1.WORKER_JWT_SECRET);
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
    const workerId = req.workerId;
    const nextTask = yield (0, utils_1.getNextTask)(Number(workerId));
    if (!nextTask) {
        res.json({
            message: "no tasks remaining"
        });
    }
    else {
        res.json({
            task: nextTask
        });
    }
}));
router.post("/submission", middleware_1.workerAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const workerId = req.workerId;
    const body = req.body;
    const parsedData = inputs_1.submissionInputs.safeParse(body);
    if (parsedData.success) {
        const task = yield (0, utils_1.getNextTask)(Number(workerId));
        if (!task || task.id !== Number(parsedData.data.taskId)) {
            res.status(411).json({
                message: "incorrect task id"
            });
        }
        const amount = (Number(task === null || task === void 0 ? void 0 : task.amount) / TOTAL_SUBMISSIONS).toString();
        const submission = yield connection_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const submission = yield connection_1.default.submission.create({
                data: {
                    workerId: workerId,
                    optionId: Number(parsedData.data.option),
                    taskId: Number(parsedData.data.taskId),
                    amount
                }
            });
            yield connection_1.default.worker.update({
                data: {
                    balance: {
                        increment: Number(amount)
                    }
                },
                where: {
                    id: workerId
                }
            });
            return submission;
        }));
        const nextTask = yield (0, utils_1.getNextTask)(Number(workerId));
        res.json({
            nextTask,
            amount
        });
    }
    else {
        res.status(411).json({
            message: "provide correct inputs"
        });
    }
}));
exports.default = router;
