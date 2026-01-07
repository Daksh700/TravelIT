export const generateItinerary = async(
    token: string,
    source: string,
    destination: string,
    budgetTier: string,
    budget: number,
    currency: string,
    duration: number,
    interests?: string[]
) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                source,
                destination,
                budgetTier,
                budget,
                currency,
                duration,
                interests
            })
        })

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        console.log("Data Received from Backend");

        return data.data;
    } catch (error) {
        console.error("API Error: ", error);
        return null;
    }
}

export const saveItinerary = async(
    token: string,
    source: string,
    destination: string,
    sourceMeta: object,
    duration: number,
    budgetTier: string,
    budget: number,
    currency: string,
    tripTitle: string,
    tripDescription: string,
    tripDetails: object[],
    status?: string,
    interests?: string[]
) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                source,
                destination,
                sourceMeta,
                duration,
                budgetTier,
                budget,
                currency,
                tripTitle,
                tripDescription,
                tripDetails,
                status,
                interests,
            })
        })

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        console.log("Data Received from Backend");

        return data.data;
    } catch (error) {
        console.error("API Error: ", error);
        return null;
    }
}

export const getUserItineraries = async(token: string) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        console.log("Data Received from Backend");

        return data.data;
    } catch (error) {
        console.error("API Error: ", error);
        return null;
    }
}