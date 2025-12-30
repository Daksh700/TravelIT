import {z} from "zod"

export const updateUserSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().optional(),
    username: z.string().optional(),
    avatar: z.url("Avatar must be a valid URL").optional()
})