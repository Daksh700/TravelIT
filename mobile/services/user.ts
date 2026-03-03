export const syncUser = async(token: string) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/sync`, {
            method: 'POST',
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

export const getUser = async(token: string) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/me`, {
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
    } catch (error: unknown) {
        console.error("API Error: ", error);
        return null;
    }
}

export const updateUserProfile = async(
    token: string,
    firstName?: string,
    lastName?: string,
    username?: string,
    avatar?: string,
) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                avatar
            })
        })

        const data = await response.json();
 
        if(!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        console.log("Data Received from Backend");

        return data.data;
    } catch (error: unknown) {
        console.error("API Error: ", error);
        return null;
    }
}

export const getBookmarks = async (token: string) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/bookmarks`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            }
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        console.log("Data Received from Backend");

        return data.data;
    } catch (error: unknown) {
        console.error("API Error: ", error);
        return null;
    }
}

export const toggleBookmark = async (token: string, place: any) => {
    try {
        console.log("Connecting to Backend");

        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/bookmarks/toggle`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify(place)
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        console.log("Data Received from Backend");

        return data.data; 
    } catch (error: unknown) {
        console.error("API Error: ", error);
        return null;
    }
}