function getRegisterData() {
    return {
        countryName: document.getElementById("countryName").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        role: document.getElementById("role").value,
        status: document.getElementById("status").value,
        password: document.getElementById("password").value,
        dateOfBirth: document.getElementById("dateOfBirth").value
    };
}


async function registerUser(data) {
    try {
        const res = await fetch(`${BASE_URL}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        return await res.json();
    } catch (err) {
        return { success: false, message: "Network error" };
    }
}


function initRegister() {
    document.getElementById("registerBtn").addEventListener("click", async () => {
        const data = getRegisterData();
        const error = validateRegister(data);
        if (error) {
            alert(error);
            return;
        }

        // 🔥 API call
        const res = await registerUser(data);

        if (res.success) {
            alert("Registration successful");
            location.hash = "#login";
        } else {
            alert(res.message || "Something went wrong");
        }
    });
}


initRegister();
