export const exploreLocation = async(
    token: string,
    query: string
) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/explore`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                query
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

export const getTrendingDestinations = async(token: string) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/trending-destinations`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Failed to fetch trending destinations");
        }

        console.log("Data Received from Backend");

        return data.data;
    } catch (error) {
        console.error("Trending API Error: ", error);
        return null;
    }
}