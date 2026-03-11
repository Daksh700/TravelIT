export const createOrder = async (token: string) => {
    console.log("Connecting to Backend");

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    });

    const data = await response.json();

    if(!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    console.log("Data Received from Backend");

    return data.data; 
};

export const verifyPayment = async (token: string, order_id: string) => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/payment/verify-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order_id })
    });
    const data = await response.json();
    if(!response.ok) throw new Error(data.message);
    return data;
};