import express, {Request, Response} from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import itineraryRoutes from "./routes/itineraryRoutes.js"
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({limit: '1mb'}));

app.use(clerkMiddleware());

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "TravelIt Backend is Live With DB!",
        status: "Active",
        style: "Cyber-Brutalist",
    })
})

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/itinerary", itineraryRoutes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        if(process.env.NODE_ENV !== "production") {
            app.listen(PORT, () => {
                console.log(`Server running on http://localhost:${PORT}`)
            })
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to start server:", error.message);
        }
        process.exit(1);
    }
}

startServer();

export default app;