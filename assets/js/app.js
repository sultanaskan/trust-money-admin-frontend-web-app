// HTML loader
async function loadCode(path) {
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
    app.innerHTML = await loadCode(route.layout.html);
    // admin হলে sidebar + topbar load
    if (mode === "admin") {
        await loadAdminComponents(route);
        renderSidebar();
        initSidebarToggle();
    }
    let fragment = location.hash.replace("#", "") || route.default;
    await loadFragment(mode, fragment);

    runInit(fragment);
}



// admin components loader
async function loadAdminComponents(route) {
    // for...of লুপ await-কে সম্মান করে
    for (const [key, value] of Object.entries(route.components)) {
        const element = document.getElementById(key);
        if (element) {
            element.innerHTML = await loadCode(value.html);
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = value.css;
            document.head.appendChild(link)

            const script = document.createElement("script");
            script.src = value.js;
            document.body.appendChild(script)
        }
    }
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
        sidebar.appendChild(btn);
    });
}
// page loader
async function loadFragment(mode, fragment) {
    const frag = routes[mode]?.fragments[fragment];
    const content = document.getElementById("content");
    if (!frag) {
        content.innerHTML = "<h2>Not Found</h2>";
        return;
    }
    content.innerHTML = await loadCode(frag.html);

    // CSS
    const link = document.createElement("link");
    link.href = frag.css;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // JS
    const script = document.createElement("script");
    script.src = frag.js;
    script.defer = true;
    document.body.appendChild(script);

}

// start
document.addEventListener("DOMContentLoaded", render);
window.addEventListener("hashchange", render);