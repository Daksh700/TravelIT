
export const verifyPlace = async(placeName: string, city?: string) => {
    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if(!apiKey) throw new Error("Google API is missing");

        const searchQuery = encodeURIComponent(`${placeName} ${city ?? ""}`);
        const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${apiKey}`;

        const searchRes = await fetch(textSearchUrl);
        const searchData = await searchRes.json() as any;

        if(!searchData.results || searchData.results.length === 0) {
            return {
                name: placeName,
                verified: false,
                reason: "Not found in Google Places",
            };
        }

        const place = searchData.results[0];
        const placeId = place.place_id;

        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,opening_hours,website,price_level,rating&key=${apiKey}`;

        const detailRes = await fetch(detailsUrl);
        const detailData = await detailRes.json() as any;

        const details = detailData.result || {};

        let closedToday = false;
        let openingHoursText: string | null = null;
        
        if(details.opening_hours?.weekday_text) {
            const weekdayIndex = new Date().getDay();
            openingHoursText = details.opening_hours.weekday_text[weekdayIndex];
            closedToday = !!openingHoursText?.toLowerCase().includes("closed");
        }

        const month = new Date().getMonth();
        const lower = placeName.toLowerCase();
        let seasonalWarning: string | null = null;

        const winterWords = ["snow", "ski", "slope", "ice"];
        const summerWords = ["beach", "surf", "snorkel", "boat", "island"];
        const rainWords   = ["waterfall", "river", "trek", "hike"];

        const match = (arr: string[]) => arr.some(w => lower.includes(w));

        if(match(winterWords) && (month >= 3 && month <=8)) {
            seasonalWarning = "May be closed outside winter season";
        }

        if(match(summerWords) && (month <= 1 || month >= 10)) {
            seasonalWarning = "Weather not be ideal in winter months";
        }

        if(match(rainWords) && (month >= 5 && month <= 8)) {
            seasonalWarning = "Rain/monsoon conditions may affect access";
        }

        return {
            verified: true,
            reason: null,
            formattedAddress: details.formatted_address || null,
            rating: details.rating ?? null,
            priceLevel: details.price_level ?? null,
            website: details.website ?? null,
            openingHours: openingHoursText ?? null,
            closedToday: closedToday ?? false,
            seasonalWarning: seasonalWarning ?? null,
        }
        
    } catch (error) {
        console.error("Google verify error", error);
        return {
            verified: false,
            reason: "Not found in Google Places",
            formattedAddress: null,
            rating: null,
            priceLevel: null,
            website: null,
            openingHours: null,
            closedToday: false,
            seasonalWarning: null
        }
    }
}