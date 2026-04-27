

async function loginUser(data) {
    try {
        const res = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await res.json();

        // API যদি non-200 দেয়, handle
        if (!res.ok) {
            return { success: false, message: result.message || "Login failed" };
        }

        return result; // { success, token, user ... } (API অনুযায়ী)
    } catch (err) {
        return { success: false, message: "Network error" };
    }
}