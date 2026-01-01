import {z} from "zod"

export const updateUserSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    username: z.string().min(1).optional(),
    avatar: z.url("Avatar must be a valid URL").optional()
})