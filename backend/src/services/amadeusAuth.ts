let cachedToken: string | null = null;
let expiresAt: number | null = null;

type AmadeusTokenResponse = {
  access_token: string;
  expires_in: number;
};

export const getAmadeusAccessToken = async () => {
    try {
        if (cachedToken && expiresAt && Date.now() < expiresAt) {
            return cachedToken;
        } else {
            const body = new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.AMADEUS_API_KEY!,
                client_secret: process.env.AMADEUS_API_SECRET!
            });
            const response = await fetch(`https://test.api.amadeus.com/v1/security/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body.toString(),
            });

            if (!response.ok) {
                throw new Error("Failed to get Amadeus access token");
            }

            const data = (await response.json()) as AmadeusTokenResponse;

            cachedToken = data.access_token;
            expiresAt = Date.now() + (data.expires_in - 60) * 1000;

            return cachedToken;
        }
    } catch (error) {
        console.log("Amadeus access token error", error)
    }
}