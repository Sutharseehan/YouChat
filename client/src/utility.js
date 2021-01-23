export async function apiCall(url, payload) {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(payload)
    }).then(t => t.json())
}