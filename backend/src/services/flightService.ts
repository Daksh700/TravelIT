const FLIGHT_BUFFER = 1.2; // Allow 20% price buffer for "best" calculation

const calculateFlightScore = (flight: any) => {
  const price = flight.price.units;
  const duration = flight.totalDurationMinutes; 

  return price + (duration * 0.5); 
};

export const getFlightLocation = async (query: string) => {
  try {
    const response = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": process.env.X_RAPID_API_KEY!,
          "x-rapidapi-host": process.env.X_RAPID_API_HOST!,
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch flight destination");

    const data = (await response.json()) as any;

    const match = data.data?.find((d: any) => d.type === "AIRPORT") || data.data?.[0];

    if (!match) throw new Error(`No airport found for ${query}`);

    return match.id;
  } catch (error) {
    console.error("Flight Location Error:", error);
    return null;
  }
};

export const getFlights = async (
  originCity: string,
  destinationCity: string,
  departDate: string, 
  returnDate: string, 
  travelers: number,
  currency: string
) => {
  try {
    const fromId = await getFlightLocation(originCity);
    const toId = await getFlightLocation(destinationCity);

    if (!fromId || !toId) {
      throw new Error("Invalid Origin or Destination City for flights");
    }

    const url = `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?fromId=${fromId}&toId=${toId}&departDate=${departDate}&returnDate=${returnDate}&pageNo=1&adults=${travelers}&sort=BEST&cabinClass=ECONOMY&currency_code=${currency}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-rapidapi-key": process.env.X_RAPID_API_KEY!,
        "x-rapidapi-host": process.env.X_RAPID_API_HOST!,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch flights");
    }

    const data = (await response.json()) as any;
    const flightOffers = data.data?.flightOffers || [];

    const cleanedFlights = flightOffers.map((offer: any) => {
      const outboundSegment = offer.segments[0];
      const returnSegment = offer.segments[1]; 

      const airlineData = outboundSegment.legs[0]?.carriersData[0];
      
      const outboundDuration = (outboundSegment.totalTime || 0) / 60;
      const returnDuration = (returnSegment?.totalTime || 0) / 60;
      const totalDurationMinutes = outboundDuration + returnDuration;

      const hours = Math.floor(outboundDuration / 60);
      const minutes = Math.floor(outboundDuration % 60);
      const durationLabel = `${hours}h ${minutes}m`;

      return {
        token: offer.token,
        price: offer.priceBreakdown.total.units, 
        currency: offer.priceBreakdown.total.currencyCode,
        
        airline: airlineData?.name || "Unknown Airline",
        logo: airlineData?.logo || null,
        
        departureTime: outboundSegment.departureTime,
        arrivalTime: outboundSegment.arrivalTime,
        
        returnDepartureTime: returnSegment?.departureTime || null,
        returnArrivalTime: returnSegment?.arrivalTime || null,

        durationLabel: durationLabel,
        totalDurationMinutes: totalDurationMinutes,
        
        stops: outboundSegment.legs[0]?.flightStops?.length || 0,
      };
    });

    const sortedFlights = cleanedFlights.sort((a: any, b: any) => {
      const scoreA = calculateFlightScore(a);
      const scoreB = calculateFlightScore(b);
      return scoreA - scoreB;
    });

    const bestFlight = sortedFlights[0] || null;

    return {
      origin: originCity,
      destination: destinationCity,
      count: sortedFlights.length,
      bestFlight,
      flights: sortedFlights.slice(0, 10), 
    };

  } catch (error) {
    console.error("Flight Service Error:", error);
    return null; 
  }
};