export async function loginUser(username, password) {
    const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/token`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify(`grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`)
    });
 
    const data = await response.json();
    if (!response.ok) {
        return;
    }
    return data;
}