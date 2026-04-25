const initMap = {
    login: initLogin,
    register: initRegister,
    dashboard: initDashboard
};

function runInit(routeName) {
    if (initMap[routeName]) initMap[routeName]();
}

// ==================
// auth
// ==================


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

// ==================
// admin
// ==================
function initDashboard() {
    console.log("Dashboard loaded");
}





function initAuthTabs(onChange) {
    const tabs = document.querySelectorAll(".tab-btn");
    const content = document.getElementById("content");

    tabs.forEach(tab => {
        tab.addEventListener("click", async () => {
            const fragment = tab.dataset.fragment;
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const token = localStorage.getItem("token");
            let mode;
            token ? mode = "admin" : mode = "auth";
            const res = await fetch(routes[mode].fragments[fragment]);
            const html = await res.text();
            content.innerHTML = html;
            if (onChange) {
                onChange(fragment);
            }
        })

    })
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
            render()
        } else {
            errorBox.innerText = res.message;

        }
    });
}

function logout() {
    localStorage.removeItem("token");
    location.hash = "login";
    render()
}
function initSidebarToggle() {
    const menuBtn = document.getElementById("menuBtn");
    const sidebar = document.getElementById("sidebar");
    if (!menuBtn) return;

    // open sidebar
    menuBtn.addEventListener("click", () => {
        if (window.getComputedStyle(sidebar).display === "none") {
            sidebar.style.display = "block";
        } else {
            sidebar.style.display = "none";
        }

    });
}