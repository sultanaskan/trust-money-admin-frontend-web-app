const initMap = {
    dashboard: initDashboard
};

function runInit(routeName) {
    if (initMap[routeName]) initMap[routeName]();
}

// ==================
// auth
// ==================



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