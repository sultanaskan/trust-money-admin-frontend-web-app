// ================= CONFIG =================
const PACKAGE_API = {
    getAll: `${BASE_URL}/package`,
    getOne: (id) => `${BASE_URL}/package/${id}`,
    create: `${BASE_URL}/package`,
    update: (id) => `${BASE_URL}/package/${id}`,
    delete: (id) => `${BASE_URL}/package/${id}`
};

// ================= DOM =================
const PACKAGE_DOM = {
    tbody: document.getElementById("packageTableBody"),
    addBtn: document.getElementById("addPackageBtn"),
    form: document.getElementById("packageForm"),
    submitBtn: document.getElementById("submitPackage"),

    inputs: {
        id: document.getElementById("packageId"),
        name: document.getElementById("packageName"),
        price: document.getElementById("price"),
        validity: document.getElementById("validityDays"),
        features: document.getElementById("features")
    }
};

// ================= STATE =================
let packageState = {
    packages: [],
    editMode: false
};

// ================= UI =================
function togglePackageForm() {
    const isHidden = PACKAGE_DOM.form.style.display === "none";

    PACKAGE_DOM.form.style.display = isHidden ? "block" : "none";
    document.getElementById("formTitle").innerText = isHidden
        ? "➕ Add New Package"
        : "✏️ Edit Package";
}

function renderPackages(data) {
    PACKAGE_DOM.tbody.innerHTML = "";

    data.forEach(pkg => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${pkg.packageName}</td>
            <td>$${Number(pkg.price).toFixed(2)}</td>
            <td>${pkg.validityDays} days</td>
            <td>${pkg.features}</td>
            <td><button class="edit-btn" data-id="${pkg.id}">Edit</button></td>
            <td><button class="delete-btn" data-id="${pkg.id}">Delete</button></td>
        `;

        PACKAGE_DOM.tbody.appendChild(row);
    });
}

function fillForm(pkg) {
    PACKAGE_DOM.form.style.display = "block";
    packageState.editMode = true;

    PACKAGE_DOM.inputs.id.value = pkg.id;
    PACKAGE_DOM.inputs.name.value = pkg.packageName;
    PACKAGE_DOM.inputs.price.value = pkg.price;
    PACKAGE_DOM.inputs.validity.value = pkg.validityDays;
    PACKAGE_DOM.inputs.features.value = pkg.features;

    document.getElementById("formTitle").innerText = "✏️ Edit Package";
}

function resetForm() {
    packageState.editMode = false;
    PACKAGE_DOM.form.style.display = "none";

    Object.values(PACKAGE_DOM.inputs).forEach(input => input.value = "");
}

// ================= API =================
async function fetchPackages() {
    try {
        const res = await fetch(PACKAGE_API.getAll);
        const data = await res.json();

        packageState.packages = data;
        renderPackages(data);

    } catch (err) {
        console.error(err);
    }
}

async function createPackage() {
    const payload = {
        packageName: PACKAGE_DOM.inputs.name.value,
        price: Number(PACKAGE_DOM.inputs.price.value),
        validityDays: Number(PACKAGE_DOM.inputs.validity.value),
        features: PACKAGE_DOM.inputs.features.value
    };

    await fetch(PACKAGE_API.create, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    fetchPackages();
    resetForm();
}

async function updatePackage() {
    const id = PACKAGE_DOM.inputs.id.value;

    const payload = {
        packageName: PACKAGE_DOM.inputs.name.value,
        price: Number(PACKAGE_DOM.inputs.price.value),
        validityDays: Number(PACKAGE_DOM.inputs.validity.value),
        features: PACKAGE_DOM.inputs.features.value
    };

    await fetch(PACKAGE_API.update(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    fetchPackages();
    resetForm();
}

async function deletePackage(id) {
    await fetch(PACKAGE_API.delete(id), {
        method: "DELETE"
    });

    fetchPackages();
}

// ================= EVENTS =================
function bindPackageEvents() {
    PACKAGE_DOM.addBtn.addEventListener("click", togglePackageForm);

    PACKAGE_DOM.submitBtn.addEventListener("click", () => {
        if (packageState.editMode) {
            updatePackage();
        } else {
            createPackage();
        }
    });

    document.getElementById("cancelPackage").addEventListener("click", resetForm);

    PACKAGE_DOM.tbody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains("delete-btn")) {
            deletePackage(id);
        }

        if (e.target.classList.contains("edit-btn")) {
            const pkg = packageState.packages.find(p => p.id == id);
            fillForm(pkg);
        }
    });
}

// ================= INIT =================
function initPackagePage() {
    bindPackageEvents();
    fetchPackages();
}

initPackagePage();