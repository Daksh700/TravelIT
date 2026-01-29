const HOTEL_BUDGET_RATIO = 0.35; // 35% of total trip budget
const SOFT_BUFFER = 1.2; // allow 20% flexibility

const calculateHotelScore = (hotel: any, maxPrice: number) => {
  const price =
    hotel.property?.priceBreakdown?.grossPrice?.value ?? maxPrice;

  const rating = hotel.property?.reviewScore ?? 0;
  const reviews = hotel.property?.reviewCount ?? 0;
  const preferred = hotel.property?.isPreferred ? 1 : 0;

  return (
    rating * 2 +
    Math.log(reviews + 1) +
    preferred * 1.5 -
    price / maxPrice
  );
};

export const getHotels = async (
  destination: string,
  checkIn: string,      
  checkOut: string,     
  budget: number,
  travelers: number,
  currency: string
) => {
  try {
    const destinationResponse = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(
        destination
      )}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": process.env.X_RAPID_API_KEY!,
          "x-rapidapi-host": process.env.X_RAPID_API_HOST!,
        },
      }
    );

    if (!destinationResponse.ok) {
      throw new Error("Failed to fetch hotel destination");
    }

    const destData = (await destinationResponse.json()) as any;

    if (!destData?.data?.length) {
      throw new Error("No destination results found");
    }

    const cityResults = destData.data.filter(
      (item: any) => item.dest_type === "city"
    );

    const matchedCity =
        cityResults.find((c:any) =>
            c.name?.toLowerCase() === destination.toLowerCase()
        ) || cityResults[0];
        
    const destId = matchedCity.dest_id;

    const nights =
      Math.max(
        Math.ceil(
          (new Date(checkOut).getTime() -
            new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        ),
        1
      );

    const hotelBudgetTotal = Math.floor(budget * HOTEL_BUDGET_RATIO);
    const maxPricePerNight = Math.floor(hotelBudgetTotal / nights);

    const adultsPerRoom = 2;
    const roomQty = Math.ceil(travelers / adultsPerRoom);

    const hotelsResponse = await fetch(
      `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${destId}&search_type=CITY&arrival_date=${checkIn}&departure_date=${checkOut}&adults=${travelers}&room_qty=${roomQty}&page_number=1&currency_code=${currency}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-key": process.env.X_RAPID_API_KEY!,
          "x-rapidapi-host": process.env.X_RAPID_API_HOST!,
        },
      }
    );

    if (!hotelsResponse.ok) {
      throw new Error("Failed to fetch hotels");
    }

    const hotelsData = (await hotelsResponse.json()) as any;

    const rankedHotels =
      hotelsData.data?.hotels
        ?.map((h: any) => ({
          ...h,
          score: calculateHotelScore(h, maxPricePerNight),
        }))
        .sort((a: any, b: any) => b.score - a.score) || [];

    const bestHotel =
      rankedHotels.find(
        (h: any) =>
          h.property?.priceBreakdown?.grossPrice?.value <=
          maxPricePerNight * SOFT_BUFFER
      ) ||
      rankedHotels[0] ||
      null;

    return {
      destination: matchedCity.label,
      destId,
      checkIn,
      checkOut,
      nights,
      hotelBudgetTotal,
      maxPricePerNight,
      bestHotel,
      hotels: rankedHotels,
    };
  } catch (error) {
    console.error("Hotel Service Error:", error);
    throw error;
  }
};