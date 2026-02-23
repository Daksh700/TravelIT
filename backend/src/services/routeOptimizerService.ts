import { minutesToTimeStr, timeStringToMin } from "../utils/timeUtils.js";

export interface PlaceInput {
    id: string,
    name: string,
    lat: number,
    lng: number,
    openTime: string,
    closeTime: string,
    durationMins: number 
}

export interface OptimizedPlace extends PlaceInput {
    arrivalTime: string,
    departureTime: string,
    waitingTime: number,
}

export interface RouteResult {
    optimizedPlaces: OptimizedPlace[],
    totalTravelTimeMins: number,
    totalWaitingTimeMins: number,
    isValid: boolean
}

export type DistanceMatrix = Record<string, Record<string, number>>;


export const getTravelTimeMins = (placeA: PlaceInput, placeB: PlaceInput, matrix: DistanceMatrix): number => {
   if(placeA.id === placeB.id) {
    return 0;
   }

   return matrix[placeA.id][placeB.id] || 30;
}

export const generatePerm = <T>(arr: T[]): T[][] => {
    const result = [];

    if(arr.length === 1) {
        return [ arr ];
    }

    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];

        const remaining = arr.slice(0, i).concat(arr.slice(i + 1));

        const remainingPerm = generatePerm(remaining);

        for (let perm of remainingPerm) {
            result.push([current].concat(perm))
        }
    }

    return result;
}

export const evaluateRoute = (route: PlaceInput[], dayStartTimeStr: string, matrix: DistanceMatrix): RouteResult => {
    let currentTimeMins = timeStringToMin(dayStartTimeStr);
    let totalTravelMins = 0;
    let totalWaitMins = 0;
    let isValid = true;

    const optimizedRoute: OptimizedPlace[] = [];

    const hasKeyword = (name: string, keywords: string[]) => {
        const lowerName = name.toLowerCase();
        return keywords.some(k => lowerName.includes(k));
    };

    for (let i = 0; i < route.length; i++) {
        const place = route[i];

        const isBreakfast = hasKeyword(place.name, ["breakfast", "morning"]);
        const isLunch = hasKeyword(place.name, ["lunch"]);
        const isDinner = hasKeyword(place.name, ["dinner", "supper"]);
        const isReturn = hasKeyword(place.name, ["return", "accommodation", "hotel"]);

        if (isBreakfast && currentTimeMins > 720) {
            isValid = false;
            break;
        }

        if (isLunch && (currentTimeMins < 660 || currentTimeMins > 960)) {
           isValid = false;
            break;
        }

        if (isDinner && currentTimeMins < 1020) {
           isValid = false; 
           break;
        }

        if (isReturn && i !== route.length - 1) {
            isValid = false; 
            break;
        }

        const openTimeMins = timeStringToMin(place.openTime);
        const closeTimeMins = timeStringToMin(place.closeTime);

        let travelMins = 0;

        if (i > 0) {
            const prevPlace = route[i - 1];
            travelMins = getTravelTimeMins(prevPlace, place, matrix);
        }

        currentTimeMins += travelMins;
        totalTravelMins += travelMins;

        const arrivalTimeMins = currentTimeMins;

        let waitMins = 0;

        if (arrivalTimeMins < openTimeMins) {
            waitMins = openTimeMins - arrivalTimeMins;
            currentTimeMins = openTimeMins;
        }

        totalWaitMins += waitMins;

        const departureTimeMins = currentTimeMins + place.durationMins;

        if (departureTimeMins > closeTimeMins) {
            isValid = false;
            break;
        }

        optimizedRoute.push({
            ...place,
            arrivalTime: minutesToTimeStr(arrivalTimeMins),
            departureTime: minutesToTimeStr(departureTimeMins),
            waitingTime: waitMins
        });

        currentTimeMins = departureTimeMins;
    }

    return {
        optimizedPlaces: optimizedRoute,
        totalTravelTimeMins: totalTravelMins,
        totalWaitingTimeMins: totalWaitMins,
        isValid
    }
}

export const optimizeItinerary = (places: PlaceInput[], dayStartTimeStr: string, matrix: DistanceMatrix): RouteResult | null => {
    const allPossibleRoutes = generatePerm(places);

    let bestRoute: RouteResult | null = null;
    let minCost = Infinity;

    for (const route of allPossibleRoutes) {
        const result = evaluateRoute(route, dayStartTimeStr, matrix);

        if(result.isValid) {
            const currentCost = result.totalTravelTimeMins + result.totalWaitingTimeMins;

            if(currentCost < minCost) {
                minCost = currentCost;
                bestRoute = result;
            }
        }
    }

    return bestRoute;
}

export const fetchDistanceMatrix = async (places: PlaceInput[]): Promise<DistanceMatrix> => {
    const matrix: DistanceMatrix = {};
    
    const origins = places.map(p => `${p.lat},${p.lng}`).join('|');
    const destinations = origins; 

    const apiKey = process.env.GOOGLE_PLACES_API_KEY; 
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json() as any;

        places.forEach(p => { matrix[p.id] = {}; });

        if (data.status === "OK") {
            data.rows.forEach((row: any, i: number) => {
                const originId = places[i].id;
                
                row.elements.forEach((element: any, j: number) => {
                    const destId = places[j].id;
                    
                    if (element.status === "OK") {
                        const mins = Math.round(element.duration.value / 60);
                        matrix[originId][destId] = mins;
                    } else {
                        matrix[originId][destId] = 30; 
                    }
                });
            });
        }
        
        return matrix;
    } catch (error) {
        console.error("Distance Matrix API Fetch Error:", error);
        places.forEach(p1 => {
            places.forEach(p2 => {
                matrix[p1.id][p2.id] = 30;
            });
        });
        return matrix;
    }
}