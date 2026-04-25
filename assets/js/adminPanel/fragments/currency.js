// ================= CONFIG =================
const API = {
    getAll: `${BASE_URL}/currency/get-currency-rates`,
    create: `${BASE_URL}/currency/set-currency-rate`,
    delete: (id) => `${BASE_URL}/currency/delete-currency-rate/${id}`
};

// ================= DOM CACHE =================
const DOM = {
    tbody: document.getElementById("currencyTableBody"),
    addBtn: document.getElementById("addCurrencyBtn"),
    formRow: document.getElementById("addCurrencyForm"),
    submitBtn: document.getElementById("submitCurrency"),

    inputs: {
        flag: document.getElementById("flagInput"),
        country: document.getElementById("countryInput"),
        currency: document.getElementById("currencyInput"),
        rate: document.getElementById("rateInput")
    }
};

// ================= STATE =================
let state = {
    currencies: []
};

// ================= UI =================
function toggleAddForm() {
    const isHidden = DOM.formRow.style.display === "none";

    DOM.formRow.style.display = isHidden ? "table-row" : "none";
    DOM.addBtn.innerText = isHidden
        ? "Cancel Adding New Currency"
        : "Add a new Currency +";
}

function renderTable(data) {
    DOM.tbody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
      <td><img src="${BASE_URL.replace('/api', "") + item.flagUrl}" width="50"></td>
      <td>${item.countryName}</td>
      <td>${item.currencyName}</td>
      <td>$1=${Number(item.rateInUsd).toFixed(2)} ${item.currencyName}</td>
      <td><button class="update-btn" data-id="${item.id}">Update</button></td>
      <td><button class="delete-btn" data-id="${item.id}">Delete</button></td>
    `;

        DOM.tbody.appendChild(row);
    });
}

// ================= API =================
async function fetchCurrencies() {
    try {
        const res = await fetch(API.getAll);
        if (!res.ok) throw new Error(res.status);

        const data = await res.json();
        state.currencies = data;

        renderTable(data);
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

async function createCurrency() {
    DOM.submitBtn.innerText = "Processing...";

    const formData = new FormData();
    formData.append("flagIcon", DOM.inputs.flag.files[0]);
    formData.append("countryName", DOM.inputs.country.value);
    formData.append("currencyName", DOM.inputs.currency.value);
    formData.append("rateInUsd", DOM.inputs.rate.value);

    try {
        const res = await fetch(API.create, {
            method: "POST",
            body: formData
        });

        const result = await res.json();
        console.log(result);

        fetchCurrencies(); // refresh
    } catch (err) {
        console.error(err);
    }

    DOM.submitBtn.innerText = "Submit";
}

async function deleteCurrency(id) {
    try {
        const res = await fetch(API.delete(id), {
            method: "DELETE"
        });

        if (!res.ok) throw new Error(res.status);

        fetchCurrencies();
    } catch (err) {
        console.error("Delete failed:", err);
    }
}

// ================= EVENTS =================
function bindEvents() {
    // toggle form
    DOM.addBtn.addEventListener("click", toggleAddForm);

    // submit
    DOM.submitBtn.addEventListener("click", createCurrency);

    // table actions (event delegation)
    DOM.tbody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains("delete-btn")) {
            deleteCurrency(id);
        }

        if (e.target.classList.contains("update-btn")) {
            console.log("Update:", id);
        }
    });
}

// ================= INIT =================
function initCurrencyPage() {
    bindEvents();
    fetchCurrencies();
}

initCurrencyPage();