import { getAmadeusAccessToken } from "./amadeusAuth";

type FlightDestination = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
};

export const getFlightDestinations = async(origin = "DEL", maxPrice = 20000): Promise<FlightDestination[]> => {
    try {
        const accessToken = await getAmadeusAccessToken();

        if(!accessToken) {
            throw new Error("Amadeus Access Token is missing");
        }

        const response = await fetch(`https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${origin}&maxPrice=${maxPrice}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })

        if(!response.ok) {
            throw new Error("Failed to fetch flight destinations");
        }

        const data = await response.json() as any;

        return (data.data || []).map((item: any) => ({
            origin: item.origin,
            destination: item.destination,
            departureDate: item.departureDate,
            returnDate: item.returnDate,
            price: Number(item.price?.total),
        }));
    } catch (error) {
        console.error("Flight Service Error:", error);
        return [];
    }
}