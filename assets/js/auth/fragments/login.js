


async function loginUser(data) {
    console.log(data)
    try {
        const res = await fetch(`${BASE_URL}/user/login`, {
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


function initLogin() {
    const btn = document.getElementById("loginBtn");
    const errorBox = document.getElementById("loginError");

    btn.addEventListener("click", async () => {
        errorBox.innerText = "";

        const data = {
            email: document.getElementById("loginEmail").value,
            password: document.getElementById("loginPassword").value
        };

        // 🔍 Validate
        const error = validateLogin(data);
        if (error) {
            errorBox.innerText = error;
            return;
        }

        // 🔄 Loading state
        btn.innerText = "Logging in...";
        btn.disabled = true;

        // 🌐 API call
        const res = await loginUser(data);

        // 🔁 Reset button
        btn.innerText = "Login";
        btn.disabled = false;
        console.log(res.success);
        if (res.token) {
            // 🔐 token save
            localStorage.setItem("token", res.token);
            localStorage.setItem("uid", res.user.id)
            window.location.hash = "dashboard";
            render()
        } else {
            errorBox.innerText = res.message;

        }
    });
}





initLogin();