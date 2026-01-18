import { getFlightDestinations } from "../services/flightService";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";


export const getFlights = asyncHandler(async (req: Request, res: Response) => {
    const origin = (req.query.origin as string) || "DEL";
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 20000;

    if(!origin) {
        throw new ApiError(400, "Origin airport code is required");
    }

    const flights = await getFlightDestinations(origin, maxPrice);

    return res.status(200).json(
        new ApiResponse(200, flights, "Flights fetched successfully")
    )
})