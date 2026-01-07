import express, {Request, Response} from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes"
import itineraryRoutes from "./routes/itineraryRoutes"
import { errorHandler } from "./middlewares/errorMiddleware";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing middleware first
app.use(cors());
app.use(express.json());

// Then authentication middleware
app.use(clerkMiddleware());

// Routes
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "TravelIt Backend is Live With DB!",
        status: "Active",
        style: "Cyber-Brutalist",
    })
})

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/itinerary", itineraryRoutes);

// Error handler last
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

// export for vercel 
export default app;