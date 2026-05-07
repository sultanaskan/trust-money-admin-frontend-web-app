// ================= CONFIG =================
const API = {
    getAll: `${BASE_URL}/currency`,
    getOne: (id) => `${BASE_URL}/currency/${id}`,
    create: `${BASE_URL}/currency`,
    update: (id) => `${BASE_URL}/currency/${id}`, // PUT Method
    delete: (id) => `${BASE_URL}/currency/${id}`
};

// ================= DOM CACHE =================
const DOM = {
    tbody: document.getElementById("currencyTableBody"),
    addBtn: document.getElementById("addCurrencyBtn"),
    formSection: document.getElementById("addCurrencyForm"),
    submitBtn: document.getElementById("submitCurrency"),
    formTitle: document.getElementById("formTitle"),
    editId: document.getElementById("editCurrencyId"),

    inputs: {
        flag: document.getElementById("flagInput"),
        country: document.getElementById("countryInput"),
        currency: document.getElementById("currencyInput"),
        rate: document.getElementById("rateInput")
    }
};

// ================= STATE =================
let isEditMode = false;

// ================= UI FUNCTIONS =================
function resetForm() {
    isEditMode = false;
    DOM.editId.value = "";
    DOM.inputs.country.value = "";
    DOM.inputs.currency.value = "";
    DOM.inputs.rate.value = "";
    DOM.inputs.flag.value = "";
    DOM.formTitle.innerText = "➕ Add New Currency";
    DOM.formSection.style.display = "none";
    DOM.addBtn.innerText = "➕ Add New Currency";
    document.getElementById("currentFlagText").style.display = "none";
}

function showEditForm(data) {
    isEditMode = true;
    DOM.formSection.style.display = "block";
    DOM.formTitle.innerText = "✏️ Update Currency";
    DOM.addBtn.innerText = "Cancel Edit";
    
    DOM.editId.value = data.id;
    DOM.inputs.country.value = data.countryName;
    DOM.inputs.currency.value = data.currencyName;
    DOM.inputs.rate.value = data.rateInUsd;
    
    document.getElementById("currentFlagText").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderTable(data) {
    DOM.tbody.innerHTML = "";
    data.forEach(item => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #eee";
        row.innerHTML = `
            <td style="padding:12px;"><img src="${item.flagUrl}" width="40" style="border-radius:4px;"></td>
            <td style="padding:12px;">${item.countryName}</td>
            <td style="padding:12px;">${item.currencyName}</td>
            <td style="padding:12px;">$1 = ${Number(item.rateInUsd).toFixed(4)} ${item.currencyName}</td>
            <td style="padding:12px;">
                <button class="update-btn" data-id="${item.id}" style="background:#007bff; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:5px;">Edit</button>
                <button class="delete-btn" data-id="${item.id}" style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
            </td>
        `;
        DOM.tbody.appendChild(row);
    });
}

// ================= API CALLS =================
async function fetchCurrencies() {
    try {
        const res = await fetch(API.getAll);
        const data = await res.json();
        renderTable(data);
    } catch (err) { console.error("Fetch failed:", err); }
}

async function saveCurrency() {
    const id = DOM.editId.value;
    const formData = new FormData();
    
    // ফাইল সিলেক্ট করলে অ্যাড করবেন, না করলে পুরানোটাই থাকবে (ব্যাকএন্ড লজিক অনুযায়ী)
    if (DOM.inputs.flag.files[0]) {
        formData.append("flagIcon", DOM.inputs.flag.files[0]);
    }
    formData.append("countryName", DOM.inputs.country.value);
    formData.append("currencyName", DOM.inputs.currency.value);
    formData.append("rateInUsd", DOM.inputs.rate.value);

    const url = isEditMode ? API.update(id) : API.create;
    const method = isEditMode ? "PUT" : "POST";

    DOM.submitBtn.innerText = "Processing...";

    try {
        const res = await fetch(url, {
            method: method,
            body: formData
        });
        if (res.ok) {
            alert(isEditMode ? "Updated successfully!" : "Created successfully!");
            resetForm();
            fetchCurrencies();
        }
    } catch (err) { console.error("Save failed:", err); }
    DOM.submitBtn.innerText = "✅ Save Currency";
}

async function deleteCurrency(id) {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
        const res = await fetch(API.delete(id), { method: "DELETE" });
        if (res.ok) fetchCurrencies();
    } catch (err) { console.error("Delete failed:", err); }
}

async function getCurrencyToEdit(id) {
    try {
        const res = await fetch(API.getOne(id));
        const data = await res.json();
        showEditForm(data);
    } catch (err) { console.error(err); }
}

// ================= EVENTS =================
function bindEvents() {
    DOM.addBtn.addEventListener("click", () => {
        if (DOM.formSection.style.display === "none") {
            DOM.formSection.style.display = "block";
            DOM.addBtn.innerText = "❌ Cancel";
        } else {
            resetForm();
        }
    });

    DOM.submitBtn.addEventListener("click", saveCurrency);
    document.getElementById("cancelCurrency").addEventListener("click", resetForm);

    DOM.tbody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("delete-btn")) deleteCurrency(id);
        if (e.target.classList.contains("update-btn")) getCurrencyToEdit(id);
    });
}

// ================= INIT =================
function initCurrencyPage() {
    bindEvents();
    fetchCurrencies();
}

initCurrencyPage();