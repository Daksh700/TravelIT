export const generateItinerary = async(
    token: string,
    source: string,
    destination: string,
    budgetTier: string,
    budget: number,
    currency: string,
    duration: number,
    travelers: number,
    ageGroup: string,
    safeMode: boolean,
    tripStartDate: string,
    tripEndDate: string,
    checkInDate: string,
    checkOutDate: string,
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
                travelers,
                ageGroup,
                safeMode,
                tripStartDate,
                tripEndDate,
                checkInDate,
                checkOutDate,
                interests
            })
        });

        const data = await response.json();
        
        console.log("Data Received from Backend", data.data);
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
    tripStartDate: string,
    tripEndDate: string,
    budgetTier: string,
    budget: number,
    currency: string,
    tripTitle: string,
    tripDescription: string,
    tripDetails: object[],
    travelers: number,
    ageGroup: string,
    safeMode: boolean,
    hotel: object | null,
    flight: object | null,
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
                tripStartDate,
                tripEndDate,
                budgetTier,
                budget,
                currency,
                tripTitle,
                tripDescription,
                travelers,
                ageGroup,
                safeMode,
                tripDetails: tripDetails.map((day: any) => ({
                    ...day,
                    activities: day.activities.map((act: any) => {
                        let locationStr = '';
                        if (typeof act.location === 'string') {
                            locationStr = act.location;
                        } else if (act.location && typeof act.location === 'object') {
                            locationStr = act.location.formattedAddress || act.location.name || act.location.address || `${act.activity} Location`;
                        } else {
                            locationStr = `${act.activity} Location`;
                        }
                        return {
                            time: act.time,
                            activity: act.activity,
                            location: locationStr,
                            description: act.description,
                            estimatedCost: typeof act.estimatedCost === 'number' ? act.estimatedCost : parseFloat(act.estimatedCost) || 0,
                            coordinates: act.coordinates || null,
                        };
                    })
                })),
                hotel,
                flight,
                status,
                interests,
            })
        });
        const data = await response.json();
        if(!response.ok) {
            console.error("Full error response:", data);
            const errorMsg = Array.isArray(data.errors) 
                ? data.errors.join(", ") 
                : data.message || "Something went wrong";
            throw new Error(errorMsg);
        }
        console.log("Data Received from Backend");
        return data.data;
    } catch (error) {
        console.error("API Error: ", error);
        return null;
    }
}

export const modifyItinerary = async (
    token: string,
    itineraryId: string,
    modificationType: "weather" | "delay" | "ai_edit",
    delayHours?: number,
    dayNumber?: number,
    userPrompt?: string
) => {
    try {
        console.log("Connecting to Backend");
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/modify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                itineraryId,
                modificationType,
                delayHours,
                dayNumber,
                userPrompt
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }
        console.log("Data Received from Backend");
        return data.data; 
    } catch (error) {
        console.error("API Error: ", error);
        return null;
    }
};

export const updateItineraryDetails = async(
    token: string,
    itineraryId: string,
    tripDetails: any[]
) => {
    try {
        console.log("Connecting to Backend");
        
        const cleanTripDetails = tripDetails.map((day: any) => ({
            day: day.day,
            theme: day.theme || '',
            activities: day.activities.map((act: any) => {
                let locationStr = '';
                if (typeof act.location === 'string') {
                    locationStr = act.location;
                } else if (act.location && typeof act.location === 'object') {
                    locationStr = act.location.formattedAddress || act.location.name || act.location.address || '';
                } else {
                    locationStr = act.location || '';
                }
                
                const activity: any = {
                    time: act.time || '',
                    activity: act.activity || '',
                    location: locationStr,
                    description: act.description || '',
                    estimatedCost: typeof act.estimatedCost === 'number' ? act.estimatedCost : 0,
                    coordinates: act.coordinates || null,
                };
                
                if (act.verified !== null && act.verified !== undefined) {
                    activity.verified = act.verified;
                }
                if (act.closedToday !== null && act.closedToday !== undefined) {
                    activity.closedToday = act.closedToday;
                }
                if (act.seasonalWarning !== null && act.seasonalWarning !== undefined) {
                    activity.seasonalWarning = act.seasonalWarning;
                }
                
                return activity;
            })
        }));

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/details`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                itineraryId,
                tripDetails: cleanTripDetails
            })
        })
        
        if(!response.ok) {
            const data = await response.json();
            console.error("Error response:", data);
            throw new Error(data.message || "Something went wrong");
        }
        
        const data = await response.json();
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

export const updateTripStatus = async(
    token: string,
    id: string,
    status: string
) => {
    try {
        console.log("Connecting to Backend");
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/status/${id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                status
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

export const optimizeRoute = async (
    token: string,
    activities: any[],
    dayStartTime?: string
) => {
    try {
        console.log("Connecting to Backend for Route Optimization");
        
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/optimize-route`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                activities,
                dayStartTime
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Error response from optimizer:", data);
            throw new Error(data.message || "Failed to optimize route");
        }
        
        console.log("Optimization Data Received from Backend", data.data);
        return data.data;
    } catch (error) {
        console.error("API Error during optimization: ", error);
        return null;
    }
}

export const deleteTrip = async(
    token: string,
    id: string
) => {
    try {
        console.log("Connecting to Backend");
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/itinerary/${id}`, {
            method: 'DELETE',
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