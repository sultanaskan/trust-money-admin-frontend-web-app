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
        providerName: document.getElementById("providerName"),
        bankLogo: document.getElementById("bankLogo"),
        accountNumber: document.getElementById("accountNumber"),
        accountType: document.getElementById("accountType"),
        paymentGuide: document.getElementById("paymentGuide"),
        status: document.getElementById("status")
    }
};

let payments = [];

/* ================= UI RENDER ================= */
function renderPayments(data) {
    PAYMENT_DOM.tbody.innerHTML = "";

    if (!data || data.length === 0) {
        PAYMENT_DOM.tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No payment methods found.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #f1f1f1";

        row.innerHTML = `
            <td style="padding: 12px;">
                <img src="${item.bankLogoUrl}" alt="logo" style="width: 45px; height: 45px; object-fit: contain; background: #f9f9f9; padding: 5px; border-radius: 8px; border: 1px solid #eee;">
            </td>
            <td><strong>${item.providerName}</strong></td>
            <td><span style="text-transform: capitalize; font-size: 0.9em;">${item.methodType}</span></td>
            <td>
                <span style="font-family: monospace; font-weight: bold;">${item.accountNumber}</span><br>
                <small style="color: #666; text-transform: uppercase;">${item.accountType}</small>
            </td>
            <td>
                <span style="padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; background: ${item.status === 'active' ? '#e6ffed' : '#ffeef0'}; color: ${item.status === 'active' ? '#28a745' : '#dc3545'};">
                    ${item.status.toUpperCase()}
                </span>
            </td>
            <td>
                <button class="update-btn" data-id="${item.id}" style="padding: 5px 10px; cursor:pointer; background:#f0f7ff; border:1px solid #cfe2ff; border-radius:4px; color:#0056b3;">Edit</button>
                <button class="delete-btn" data-id="${item.id}" style="padding: 5px 10px; cursor:pointer; background:#fff5f5; border:1px solid #ffd8d8; border-radius:4px; color:#c53030;">Delete</button>
            </td>
        `;
        PAYMENT_DOM.tbody.appendChild(row);
    });
}

/* ================= FETCH DATA ================= */
async function fetchPayments() {
    try {
        const res = await fetch(PAYMENT_API.getAll);
        const json = await res.json();
        payments = json.data || [];
        renderPayments(payments);
    } catch (err) {
        console.error("Fetch failed:", err);
    }
}

/* ================= SUBMIT DATA (CREATE/UPDATE) ================= */
async function handlePaymentSubmit() {
    const mode = PAYMENT_DOM.submitBtn.dataset.mode;
    const id = PAYMENT_DOM.submitBtn.dataset.id;

    // Validation
    if (!PAYMENT_DOM.inputs.methodType.value || !PAYMENT_DOM.inputs.providerName.value || !PAYMENT_DOM.inputs.accountNumber.value) {
        alert("Please fill in all required fields!");
        return;
    }

    const formData = new FormData();
    formData.append("methodType", PAYMENT_DOM.inputs.methodType.value);
    formData.append("providerName", PAYMENT_DOM.inputs.providerName.value);
    formData.append("accountNumber", PAYMENT_DOM.inputs.accountNumber.value);
    formData.append("accountType", PAYMENT_DOM.inputs.accountType.value);
    formData.append("paymentGuide", PAYMENT_DOM.inputs.paymentGuide.value);
    formData.append("status", PAYMENT_DOM.inputs.status.value);

    // ফাইল হ্যান্ডলিং (মডেল অনুযায়ী bankLogoUrl এর জন্য ফাইল মাস্ট যদি নতুন হয়)
    if (PAYMENT_DOM.inputs.bankLogo.files[0]) {
        formData.append("File", PAYMENT_DOM.inputs.bankLogo.files[0]);
    } else if (mode === "create") {
        alert("Please select a provider logo!");
        return;
    }

    try {
        PAYMENT_DOM.submitBtn.innerText = "Processing...";
        PAYMENT_DOM.submitBtn.disabled = true;

        const url = mode === "update" ? PAYMENT_API.update(id) : PAYMENT_API.create;
        const method = mode === "update" ? "PUT" : "POST";

        // --- FormData লুপ চালিয়ে ডেটা চেক ---
        console.log("--- FormData Contents ---", window.location, BASE_URL);
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: [File] Name: ${value.name}, Size: ${value.size} bytes`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }
        console.log("-------------------------");

        const res = await fetch(url, {
            method: method,
            body: formData
        });

        const result = await res.json();

        if (res.ok && result.success) {
            alert(mode === "update" ? "Updated Successfully" : "Created Successfully");
            resetForm();
            fetchPayments();
        } else {
            alert("Error: " + (result.message || "Something went wrong"));
        }
    } catch (err) {
        console.error("Submit failed:", err);
        alert("Server error! Please check console.");
    } finally {
        PAYMENT_DOM.submitBtn.innerText = "✅ Submit";
        PAYMENT_DOM.submitBtn.disabled = false;
    }
}

/* ================= DELETE ================= */
async function deletePayment(id) {
    if (!confirm("Are you sure you want to delete this payment method?")) return;
    try {
        const res = await fetch(PAYMENT_API.delete(id), { method: "DELETE" });
        if (res.ok) fetchPayments();
    } catch (err) {
        console.error(err);
    }
}

/* ================= OPEN UPDATE FORM ================= */
function openUpdatePayment(id) {
    const item = payments.find(p => p.id == id);
    if (!item) return;

    document.getElementById("formTitle").innerText = "📝 Update Payment Method";
    PAYMENT_DOM.form.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });

    PAYMENT_DOM.inputs.methodType.value = item.methodType;
    PAYMENT_DOM.inputs.providerName.value = item.providerName;
    PAYMENT_DOM.inputs.accountNumber.value = item.accountNumber;
    PAYMENT_DOM.inputs.accountType.value = item.accountType;
    PAYMENT_DOM.inputs.paymentGuide.value = item.paymentGuide;
    PAYMENT_DOM.inputs.status.value = item.status;

    PAYMENT_DOM.submitBtn.dataset.mode = "update";
    PAYMENT_DOM.submitBtn.dataset.id = id;
}

/* ================= RESET FORM ================= */
function resetForm() {
    PAYMENT_DOM.form.style.display = "none";
    document.getElementById("formTitle").innerText = "➕ Create Payment Method";

    PAYMENT_DOM.inputs.methodType.value = "";
    PAYMENT_DOM.inputs.providerName.value = "";
    PAYMENT_DOM.inputs.bankLogo.value = "";
    PAYMENT_DOM.inputs.accountNumber.value = "";
    PAYMENT_DOM.inputs.accountType.value = "personal";
    PAYMENT_DOM.inputs.paymentGuide.value = "";
    PAYMENT_DOM.inputs.status.value = "active";

    PAYMENT_DOM.submitBtn.dataset.mode = "create";
    PAYMENT_DOM.submitBtn.dataset.id = "";
}

/* ================= EVENT BINDING ================= */
function bindPaymentEvents() {
    PAYMENT_DOM.addBtn.addEventListener("click", () => {
        resetForm();
        PAYMENT_DOM.form.style.display = "block";
    });

    PAYMENT_DOM.cancelBtn.addEventListener("click", resetForm);
    PAYMENT_DOM.submitBtn.addEventListener("click", handlePaymentSubmit);

    PAYMENT_DOM.tbody.addEventListener("click", (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const id = btn.dataset.id;

        if (btn.classList.contains("delete-btn")) deletePayment(id);
        if (btn.classList.contains("update-btn")) openUpdatePayment(id);
    });
}

function initPaymentPage() {
    bindPaymentEvents();
    fetchPayments();
}

initPaymentPage();