// HTML loader
async function loadHTML(path) {
    const res = await fetch(path);
    return await res.text();
}

// main render
async function render() {
    const app = document.getElementById("app");
    const token = localStorage.getItem("token");
    const mode = token ? "admin" : "auth";
    const route = routes[mode];
    // layout load
    app.innerHTML = await loadHTML(route.layout);
    // admin হলে sidebar + topbar load
    if (mode === "admin") {
        await loadAdminComponents(route);
        renderSidebar();
    }

    let fragment = location.hash.replace("#", "") || route.default;
    loadFragment(mode, fragment);
}



// admin components
async function loadAdminComponents(route) {
    Object.entries(route.components).forEach(async ([key, value]) => {
        document.getElementById(key).innerHTML = await loadHTML(value);
    })
}
function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    const fragments = routes.admin.fragments;
    sidebar.innerHTML = "";
    Object.entries(fragments).forEach(([key, value]) => {
        const btn = document.createElement("button");
        btn.innerHTML = `${value.icon} ${value.title}`;
        btn.onclick = () => {
            location.hash = key;
        };
        console.log(btn)
        sidebar.appendChild(btn);
    });
}
// page loader
async function loadFragment(mode, fragment) {
    const route = routes[mode];
    const content = document.getElementById("content");
    if (!route.fragments[fragment]) {
        content.innerHTML = "<h2>Not Found</h2>";
        return;
    }
    content.innerHTML = await loadHTML(route.fragments[fragment].path);
    runInit(fragment);
}

// start
document.addEventListener("DOMContentLoaded", render);
window.addEventListener("hashchange", render);