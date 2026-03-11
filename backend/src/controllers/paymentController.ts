import { Request, Response } from "express";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/User.js";
import { sendPushNotification } from "../utils/sendNotification.js";

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX, 
    process.env.CASHFREE_APP_ID as string,
    process.env.CASHFREE_SECRET_KEY as string
);

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) throw new ApiError(401, "Unauthorized");

    const amount = 499; 

    try {
        const request = {
            order_amount: amount,
            order_currency: "INR",
            customer_details: {
                customer_id: user._id.toString(),
                customer_name: user.firstName ? `${user.firstName} ${user.lastName}` : "TravelIt User",
                customer_email: user.email,
                customer_phone: "9999999999", 
            },
            order_meta: {
                return_url: "travelit://payment-success?order_id={order_id}" 
            }
        };

        const response = await cashfree.PGCreateOrder(request);

        return res.status(200).json(
            new ApiResponse(200, response.data, "Cashfree Order created successfully")
        );

    } catch (error: any) {
        console.error("Cashfree Create Order Error:", error.response?.data || error.message);
        throw new ApiError(500, "Error creating Cashfree order");
    }
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const { order_id } = req.body;
    const user = req.user;

    if (!user) throw new ApiError(401, "Unauthorized");
    if (!order_id) throw new ApiError(400, "Order ID is required");

    try {
        const response = await cashfree.PGFetchOrder(order_id);

        if (response.data.order_status === "PAID") {
            const updatedUser = await User.findByIdAndUpdate(user._id, {
                isPro: true,
                proActivatedAt: new Date()
            }, { new: true });

            if (updatedUser?.pushToken) {
                await sendPushNotification(
                    updatedUser.pushToken, 
                    "Welcome to TravelIt Pro! 👑", 
                    "Your payment was successful. Enjoy unlimited AI generation & premium features!"
                );
            }

            return res.status(200).json(
                new ApiResponse(200, { isPro: true }, "Payment verified successfully. Welcome to Pro!")
            );
        } else {
            throw new ApiError(400, `Payment status is ${response.data.order_status}`);
        }

    } catch (error: any) {
        console.error("Cashfree Verify Error:", error.response?.data || error.message);
        throw new ApiError(500, "Error verifying payment");
    }
});