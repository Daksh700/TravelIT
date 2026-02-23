import mongoose, { Schema, Document } from "mongoose";

interface IActivity {
    time: string;
    activity: string;
    location: string;
    description: string;
    estimatedCost: number;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

interface IDayPlan {
    day: number;
    theme: string;
    activities: IActivity[];
}

interface IHotelSnapshot {
    hotelId: number;
    name: string;
    city: string;
    address: string;

    arrivalDate: Date;
    departureDate: Date;

    pricePerNight: number | null;
    totalPrice: number | null;
    currency: string;

    rating: number | null;
    reviewCount: number;

    photos: string[];
}

interface IFlightSnapshot {
    airline: string;
    logo: string | null;
    price: number;
    currency: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    stops: number;
}

export interface IItinerary extends Document {
    userId: mongoose.Types.ObjectId;
    source: string;
    destination: string;
    sourceMeta: {
        city: string;
        autoDetected: boolean;
    };
    duration: number;
    tripStartDate: Date;
    tripEndDate: Date;
    budgetTier: "low" | "medium" | "high";
    budget: number;
    currency: string;
    interests?: string[];
    travelers: number;
    ageGroup: "family" | "young" | "adults" | "seniors";
    safeMode: boolean;
    tripTitle: string;
    tripDescription: string;
    tripDetails: IDayPlan[];

    hotel?: IHotelSnapshot | null;
    flight?: IFlightSnapshot | null

    status: "draft" | "active" | "completed";
    createdAt: Date;
    updatedAt: Date;
}

const ItinerarySchema = new Schema<IItinerary>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        source: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        sourceMeta: {
            city: { type: String },
            autoDetected: { type: Boolean, default: false },
        },
        duration: {
            type: Number,
            required: true,
        },
        tripStartDate: { 
            type: Date,
            required: true, 
        },
        tripEndDate: { 
            type: Date,
            required: true 
        },
        budgetTier: {
            type: String,
            enum: ["low", "medium", "high"],
            required: true,
        },
        budget: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "USD",
        },
        interests: {
            type: [String],
            default: [],
        },
        travelers: {
            type: Number,
            default: 1,
            min: 1,
        },
        ageGroup: {
            type: String,
            enum: ["family", "young", "adults", "seniors"],
            default: "adults",
        },
        safeMode: {
            type: Boolean,
            default: false,
        },
        tripTitle: {
            type: String,
            required: true,
        },
        tripDescription: {
            type: String,
            required: true,
        },
        tripDetails: [
            {
                day: { type: Number, required: true },
                theme: { type: String },
                activities: [
                    {
                        time: { type: String },
                        activity: { type: String },
                        location: { type: String },
                        description: { type: String },
                        estimatedCost: { type: Number },
                        coordinates: {
                            lat: { type: Number, default: null },
                            lng: { type: Number, default: null },
                        },

                        verified: { type: Boolean, default: false },
                        reason: { type: String, default: null },
                        openingHours: { type: String, default: null },
                        closedToday: { type: Boolean, default: false },
                        seasonalWarning: { type: String, default: null },
                        rating: { type: Number, default: null },
                        priceLevel: { type: Number, default: null },
                        website: { type: String, default: null },
                        formattedAddress: { type: String, default: null },
                    },
                ],
            },
        ],

        hotel: {
            hotelId: { type: Number },
            name: { type: String },
            city: { type: String },
            address: { type: String },

            arrivalDate: { type: Date },
            departureDate: { type: Date },

            pricePerNight: { type: Number },
            totalPrice: { type: Number },
            currency: { type: String },

            rating: { type: Number },
            reviewCount: { type: Number },

            photos: { type: [String], default: [] },
        },

        flight: {
            airline: { type: String },
            logo: { type: String },
            price: { type: Number },
            currency: { type: String },
            departureTime: { type: String },
            arrivalTime: { type: String },
            duration: { type: String },
            stops: { type: Number },
        },
        
        status: {
            type: String,
            enum: ["draft", "active", "completed"],
            default: "draft",
        },
    },
    { timestamps: true }
);

export const Itinerary = mongoose.model<IItinerary>("Itinerary", ItinerarySchema);