import z from "zod";

export const taskInputs = z.object({
    options: z.array(z.object({
        video_title: z.string() // example: ["option1", "option2", "option3", "option4", "option5"]
    })),
    title: z.string(),           // example: which of the following titles will most likely catch your eye?
    signature: z.string()
})

export const submissionInputs = z.object({
    option: z.string(),
    taskId: z.string()
})