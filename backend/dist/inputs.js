"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionInputs = exports.taskInputs = void 0;
const zod_1 = __importDefault(require("zod"));
exports.taskInputs = zod_1.default.object({
    options: zod_1.default.array(zod_1.default.object({
        video_title: zod_1.default.string() // example: ["option1", "option2", "option3", "option4", "option5"]
    })),
    title: zod_1.default.string(), // example: which of the following titles will most likely catch your eye?
    signature: zod_1.default.string()
});
exports.submissionInputs = zod_1.default.object({
    option: zod_1.default.string(),
    taskId: zod_1.default.string()
});
