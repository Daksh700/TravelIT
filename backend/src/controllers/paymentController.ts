import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new ApiError(401, "Unauthorized");

    const amount = 499; 

    const options = {
        amount: amount * 100, 
        currency: "INR",
        receipt: `receipt_order_${user._id}`,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
        throw new ApiError(500, "Error creating Razorpay order");
    }

    return res.status(200).json(
        new ApiResponse(200, order, "Order created successfully")
    );
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const user = req.user;

    if (!user) throw new ApiError(401, "Unauthorized");

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        await User.findByIdAndUpdate(user._id, {
            isPro: true,
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            proActivatedAt: new Date()
        });

        return res.status(200).json(
            new ApiResponse(200, { isPro: true }, "Payment verified successfully. Welcome to Pro!")
        );
    } else {
        throw new ApiError(400, "Invalid payment signature");
    }
});