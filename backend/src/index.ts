import express, {Request, Response} from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db";

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "TravelIt Backend is Live With DB!",
        status: "Active",
        style: "Cyber-Brutalist",
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})