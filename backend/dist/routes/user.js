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
const util_1 = __importDefault(require("../util"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("../middleware");
const inputs_1 = require("../inputs");
const router = (0, express_1.Router)();
router.get("/task", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.query.taskId;
    //@ts-ignore
    const userId = req.userId;
    const details = yield util_1.default.task.findFirst({
        where: {
            id: Number(taskId),
            userId: userId,
        },
        include: {
            options: true
        }
    });
    if (!details) {
        res.status(404).json({
            message: "you dont have access to this task."
        });
    }
    const responses = yield util_1.default.submission.findMany({
        where: {
            taskId: Number(taskId)
        },
        include: {
            option: true
        }
    });
    const result = {};
    details === null || details === void 0 ? void 0 : details.options.forEach(option => {
        result[option.id] = {
            count: 0,
            option: {
                video_title: option.video_title
            }
        };
    });
    responses.forEach(r => {
        result[r.optionId].count++;
    });
    return res.json({
        result
    });
}));
router.post("/task", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.userId;
    const body = req.body;
    const parsedData = inputs_1.taskInputs.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "data validation failed. Put correct data with correct datatypes"
        });
    }
    const resp = yield util_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield tx.task.create({
            data: {
                userId: userId,
                title: parsedData.data.title,
                paymentSignature: parsedData.data.signature,
                amount: "1",
            }
        });
        yield tx.option.createMany({
            data: parsedData.data.options.map(option => ({
                video_title: option.video_title,
                taskId: response.id
            }))
        });
        return response;
    }));
    return res.status(200).json({
        responseId: resp.id
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = "0xe57FC3a21E15931b5F4A84f86f06fEB87c56b7e8"; // currently hardcoded. Will have to get this from user in future.
    const existingUser = yield util_1.default.user.findFirst({
        where: {
            address: address
        }
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({ userId: existingUser.id }, "asdf", { expiresIn: '1h' });
        return res.status(200).json({
            token: token
        });
    }
    else {
        const user = yield util_1.default.user.create({
            data: {
                address: address
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, "asdf", { expiresIn: '1h' });
        return res.status(200).json({
            token: token
        });
    }
}));
exports.default = router;
