import dotenv from "dotenv"

dotenv.config();

export const aj = (async () => {
    const { default: arcjet, tokenBucket, shield, detectBot } = await import("@arcjet/node");
    return arcjet({
        key: process.env.ARCJET_KEY!,
        characteristics: ["ip.src"],
        rules: [
            shield({mode: "LIVE"}),

            detectBot({
                mode: "LIVE",
                allow: [
                    "CATEGORY:SEARCH_ENGINE"
                ]
            }),

            tokenBucket({
                mode: "LIVE",
                refillRate: 10,
                interval: 60,
                capacity: 10,
            }),
        ],
    });
})();
