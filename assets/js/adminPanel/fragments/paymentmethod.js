/* ================= CONFIG ================= */
const PAYMENT_API = {
    getAll: `${BASE_URL}/payment`,
    create: `${BASE_URL}/payment`,
    getOne: (id) => `${BASE_URL}/payment/${id}`,
    update: (id) => `${BASE_URL}/payment/${id}`,
    delete: (id) => `${BASE_URL}/payment/${id}`
};

/* ================= DOM ================= */
const PAYMENT_DOM = {
    tbody: document.getElementById("paymentTableBody"),
    form: document.getElementById("paymentForm"),

    addBtn: document.getElementById("addPaymentBtn"),
    submitBtn: document.getElementById("submitPayment"),
    cancelBtn: document.getElementById("cancelPayment"),

    inputs: {
        methodType: document.getElementById("methodType"),
        methodName: document.getElementById("methodName"),
        accountNumber: document.getElementById("accountNumber"),
        accountType: document.getElementById("accountType"),
        paymentGuide: document.getElementById("paymentGuide"),
        status: document.getElementById("status")
    }
};

/* ================= STATE ================= */
let payments = [];

/* ================= UI ================= */
function renderPayments(data) {
    PAYMENT_DOM.tbody.innerHTML = "";

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.methodName}</td>
            <td>${item.methodType}</td>
            <td>${item.accountNumber}</td>
            <td>${item.status}</td>
            <td><button class="update-btn" data-id="${item.id}">Update</button></td>
            <td><button class="delete-btn" data-id="${item.id}">Delete</button></td>
        `;

        PAYMENT_DOM.tbody.appendChild(row);
    });
}

/* ================= FETCH ================= */
async function fetchPayments() {
    try {
        const res = await fetch(PAYMENT_API.getAll);
        const json = await res.json();

        payments = json.data || json;
        renderPayments(payments);

    } catch (err) {
        console.error("Fetch payments failed:", err);
    }
}

/* ================= CREATE ================= */
async function createPayment() {

    const payload = {
        methodType: PAYMENT_DOM.inputs.methodType.value,
        methodName: PAYMENT_DOM.inputs.methodName.value,
        accountNumber: PAYMENT_DOM.inputs.accountNumber.value,
        accountType: PAYMENT_DOM.inputs.accountType.value,
        paymentGuide: PAYMENT_DOM.inputs.paymentGuide.value,
        status: PAYMENT_DOM.inputs.status.value
    };

    try {
        await fetch(PAYMENT_API.create, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        resetForm();
        fetchPayments();

    } catch (err) {
        console.error(err);
    }
}

/* ================= DELETE ================= */
async function deletePayment(id) {
    try {
        await fetch(PAYMENT_API.delete(id), {
            method: "DELETE"
        });

        fetchPayments();

    } catch (err) {
        console.error(err);
    }
}

/* ================= UPDATE (BASIC HOOK) ================= */
function openUpdatePayment(id) {
    const item = payments.find(p => p.id == id);
    if (!item) return;

    PAYMENT_DOM.form.style.display = "block";

    PAYMENT_DOM.inputs.methodType.value = item.methodType;
    PAYMENT_DOM.inputs.methodName.value = item.methodName;
    PAYMENT_DOM.inputs.accountNumber.value = item.accountNumber;
    PAYMENT_DOM.inputs.accountType.value = item.accountType;
    PAYMENT_DOM.inputs.paymentGuide.value = item.paymentGuide;
    PAYMENT_DOM.inputs.status.value = item.status;

    PAYMENT_DOM.submitBtn.dataset.mode = "update";
    PAYMENT_DOM.submitBtn.dataset.id = id;
}

/* ================= RESET ================= */
function resetForm() {
    PAYMENT_DOM.form.style.display = "none";

    Object.values(PAYMENT_DOM.inputs).forEach(input => {
        input.value = "";
    });

    PAYMENT_DOM.submitBtn.dataset.mode = "create";
    PAYMENT_DOM.submitBtn.dataset.id = "";
}

/* ================= EVENTS ================= */
function bindPaymentEvents() {

    PAYMENT_DOM.addBtn.addEventListener("click", () => {
        PAYMENT_DOM.form.style.display = "block";
    });

    PAYMENT_DOM.cancelBtn.addEventListener("click", resetForm);

    PAYMENT_DOM.submitBtn.addEventListener("click", async () => {
        const mode = PAYMENT_DOM.submitBtn.dataset.mode;

        if (mode === "update") {
            await fetch(PAYMENT_API.update(PAYMENT_DOM.submitBtn.dataset.id), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    methodType: PAYMENT_DOM.inputs.methodType.value,
                    methodName: PAYMENT_DOM.inputs.methodName.value,
                    accountNumber: PAYMENT_DOM.inputs.accountNumber.value,
                    accountType: PAYMENT_DOM.inputs.accountType.value,
                    paymentGuide: PAYMENT_DOM.inputs.paymentGuide.value,
                    status: PAYMENT_DOM.inputs.status.value
                })
            });

            resetForm();
            fetchPayments();

        } else {
            await createPayment();
        }
    });

    PAYMENT_DOM.tbody.addEventListener("click", (e) => {

        const btn = e.target.closest("button");
        if (!btn) return;

        const id = btn.dataset.id;

        if (btn.classList.contains("delete-btn")) {
            deletePayment(id);
        }

        if (btn.classList.contains("update-btn")) {
            openUpdatePayment(id);
        }
    });
}

/* ================= INIT ================= */
function initPaymentPage() {
    bindPaymentEvents();
    fetchPayments();
}

initPaymentPage();