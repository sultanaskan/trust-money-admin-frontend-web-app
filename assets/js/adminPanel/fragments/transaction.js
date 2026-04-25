// ================= CONFIG =================
const TXN_API = {
    getAll: `${BASE_URL}/transactions`, // 🔥 ADD THIS
    getByUser: (id) => `${BASE_URL}/transactions/user/${id}`,
    getByStatus: (status) => `${BASE_URL}/transactions/status/${status}`,
    create: `${BASE_URL}/transactions`,
    updateStatus: (id) => `${BASE_URL}/transactions/${id}/status`
};

// ================= DOM =================
const TXN_DOM = {
    tbody: document.getElementById("txnTableBody"),

    addBtn: document.getElementById("addTxnBtn"),
    form: document.getElementById("txnForm"),
    submitBtn: document.getElementById("submitTxn"),
    cancelBtn: document.getElementById("cancelTxn"),

    filterUser: document.getElementById("filterUserId"),
    filterStatus: document.getElementById("filterStatus"),
    applyFilter: document.getElementById("applyFilter"),
    resetFilter: document.getElementById("resetFilter"),

    inputs: {
        userId: document.getElementById("txnUserId"),
        type: document.getElementById("txnType"),
        amount: document.getElementById("txnAmount"),
        desc: document.getElementById("txnDesc")
    }
};

// ================= STATE =================
let txnState = {
    transactions: [],
    currentView: "all" // all | user | status
};

// ================= UI =================
function toggleTxnForm(show = true) {
    TXN_DOM.form.style.display = show ? "block" : "none";
}

function renderTransactions(data) {
    TXN_DOM.tbody.innerHTML = "";

    if (!data || data.length === 0) {
        TXN_DOM.tbody.innerHTML = `<tr><td colspan="8">No transactions found</td></tr>`;
        return;
    }

    data.forEach(txn => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${txn.transactionId || txn.id}</td>
            <td>${txn.userId}</td>
            <td>${txn.type}</td>
            <td>${Number(txn.amount).toFixed(2)}</td>
            <td>${txn.status}</td>
            <td>${txn.description || "-"}</td>
            <td>${new Date(txn.createdAt).toLocaleString()}</td>
            <td>
                <button class="approve-btn" data-id="${txn.id}">Approve</button>
                <button class="reject-btn" data-id="${txn.id}">Reject</button>
            </td>
        `;

        TXN_DOM.tbody.appendChild(row);
    });
}
async function fetchAllTransactions() {
    try {
        const res = await fetch(TXN_API.getAll);
        if (!res.ok) throw new Error(res.status);

        const data = await res.json();

        txnState.transactions = data;
        txnState.currentView = "all";

        renderTransactions(data);
    } catch (err) {
        console.error("Fetch all failed:", err);
    }
}

async function fetchByUser(id) {
    try {
        const res = await fetch(TXN_API.getByUser(id));
        const data = await res.json();

        txnState.transactions = data;
        txnState.currentView = "user";

        renderTransactions(data);
    } catch (err) {
        console.error(err);
    }
}



// ================= API =================
async function createTransaction() {
    const payload = {
        userId: TXN_DOM.inputs.userId.value,
        type: TXN_DOM.inputs.type.value,
        amount: TXN_DOM.inputs.amount.value,
        description: TXN_DOM.inputs.desc.value,
        status: "pending"
    };

    try {
        await fetch(TXN_API.create, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        toggleTxnForm(false);

        fetchAllTransactions(); // 🔥 refresh

    } catch (err) {
        console.error(err);
    }
}

async function updateStatus(id, status) {
    try {
        await fetch(TXN_API.updateStatus(id), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ status })
        });

        // 🔥 refresh based on current view
        if (txnState.currentView === "user") {
            fetchByUser(TXN_DOM.filterUser.value);
        } else if (txnState.currentView === "status") {
            fetchByStatus(TXN_DOM.filterStatus.value);
        } else {
            fetchAllTransactions();
        }

    } catch (err) {
        console.error(err);
    }
}

async function fetchAllTransactions() {
    try {
        const res = await fetch(TXN_API.getAll);
        if (!res.ok) throw new Error(res.status);

        const data = await res.json();

        txnState.transactions = data;
        txnState.currentView = "all";

        renderTransactions(data);
    } catch (err) {
        console.error("Fetch all failed:", err);
    }
}

async function fetchByUser(id) {
    try {
        const res = await fetch(TXN_API.getByUser(id));
        const data = await res.json();

        txnState.transactions = data;
        txnState.currentView = "user";

        renderTransactions(data);
    } catch (err) {
        console.error(err);
    }
}

async function fetchByStatus(status) {
    try {
        const res = await fetch(TXN_API.getByStatus(status));
        const data = await res.json();

        txnState.transactions = data;
        txnState.currentView = "status";

        renderTransactions(data);
    } catch (err) {
        console.error(err);
    }
}


// ================= EVENTS =================
function bindTxnEvents() {

    TXN_DOM.addBtn.addEventListener("click", () => toggleTxnForm(true));
    TXN_DOM.cancelBtn.addEventListener("click", () => toggleTxnForm(false));

    TXN_DOM.submitBtn.addEventListener("click", createTransaction);

    // 🔥 FILTER
    TXN_DOM.applyFilter.addEventListener("click", () => {
        const userId = TXN_DOM.filterUser.value.trim();
        const status = TXN_DOM.filterStatus.value;

        if (userId) {
            fetchByUser(userId);
        } else if (status) {
            fetchByStatus(status);
        } else {
            fetchAllTransactions();
        }
    });

    // 🔥 RESET
    TXN_DOM.resetFilter.addEventListener("click", () => {
        TXN_DOM.filterUser.value = "";
        TXN_DOM.filterStatus.value = "";

        fetchAllTransactions(); // 🔥 IMPORTANT FIX
    });

    // 🔥 ACTIONS
    TXN_DOM.tbody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains("approve-btn")) {
            updateStatus(id, "success");
        }

        if (e.target.classList.contains("reject-btn")) {
            updateStatus(id, "failed");
        }
    });
}

// ================= INIT =================
function initTransactionPage() {
    bindTxnEvents();
    fetchAllTransactions(); // 🔥 LOAD ALL BY DEFAULT
}

initTransactionPage();