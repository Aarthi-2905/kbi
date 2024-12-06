// Get token from localStorage
const getToken = () => localStorage.getItem('token');

//Uploading files
export async function uploadFile(formData){
    const token = getToken();
    const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/files/upload`, {
        method: 'POST',
        headers : {
            Authorization: "Bearer " + token,
        },
        body : formData
    });
    if (!response.ok) {
        throw new Error('File upload failed');
    }

    const data = await response.json();
    return data;
}

//Asking response for user prompt.
export async function userPrompt(inputText){
    const token = getToken();
    const response = await fetch(`${process.env.VITE_HOST}:${process.env.VITE_PORT}/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ "query": inputText }),
    });
    console.log(response);

    if (!response.ok) {
        throw new Error('Text submission failed');
    }

    const data = await response.json();
    return data;
}