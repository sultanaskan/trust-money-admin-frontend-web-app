// ================= CONFIG =================
const USER_API = {
    getAll: `${BASE_URL}/user`, //
    getOne: (id) => `${BASE_URL}/user/${id}`, //
    update: (id) => `${BASE_URL}/user/${id}`, //
    // Wallet
    getWallet: (userId) => `${BASE_URL}/wallet/${userId}`, //
    addMoney: `${BASE_URL}/wallet/add-money`, //
    withdraw: `${BASE_URL}/wallet/withdraw` //
};

const CURRENCY_API = `${BASE_URL}/currency`; //

// ================= DOM =================
const USER_DOM = {
    tbody: document.getElementById("userTableBody"),
    form: document.getElementById("updateUserForm"),
    submitBtn: document.getElementById("submitUserUpdate"),
    walletModal: document.getElementById("walletModal"),

    inputs: {
        id: document.getElementById("userId"),
        firstName: document.getElementById("firstName"),
        lastName: document.getElementById("lastName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        role: document.getElementById("role"),
        status: document.getElementById("status")
    },
    wallet: {
        userId: document.getElementById("walletUserId"),
        amount: document.getElementById("walletAmount"),
        note: document.getElementById("walletNote"),
        title: document.getElementById("walletActionTitle"),
        confirmBtn: document.getElementById("confirmWalletAction")
    }
};

// ================= STATE =================
let userState = {
    users: [],
    currencies: {} // lookup table: { currencyId: "Country Name" }
};
let walletActionType = "add";

// ================= API CALLS =================

// ১. কারেন্সি থেকে দেশের নাম লোড করা
async function fetchCurrencies() {
    try {
        const res = await fetch(CURRENCY_API);
        const json = await res.json();
        // Assuming response is an array of currency objects
        if (Array.isArray(json)) {
            json.forEach(curr => {
                userState.currencies[curr.id] = curr.countryName;
            });
        }
    } catch (err) {
        console.error("Currency load failed:", err);
    }
}

// ২. সিঙ্গেল ইউজারের ওয়ালেট ব্যালেন্স চেক করা
async function fetchUserBalance(userId) {
    try {
        const res = await fetch(USER_API.getWallet(userId));
        const json = await res.json();
        // আপনার এপিআই রেসপন্স অনুযায়ী ডাটা ফিল্ড চেক করুন
        return json.balance || json.data?.balance || "0.00";
    } catch (err) {
        return "0.00";
    }
}

// ৩. টেবিল রেন্ডার করা
async function renderUsers(users) {
    USER_DOM.tbody.innerHTML = "<tr><td colspan='5' style='text-align:center;'>Syncing users and balances...</td></tr>";

    let html = "";
    for (const user of users) {
        const balance = await fetchUserBalance(user.id);
        const countryName = userState.currencies[user.currencyId] || "Unknown"; // ID থেকে নাম বের করা

        html += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding:12px;">
                    <strong>${user.firstName} ${user.lastName}</strong><br>
                    <small style="color:gray;">${user.email}</small>
                </td>
                <td style="padding:12px;">${countryName}</td>
                <td style="padding:12px;">
                    <small>${user.role.toUpperCase()}</small><br>
                    <span style="font-size:11px; padding:2px 6px; border-radius:10px; background:#e9ecef;">${user.status}</span>
                </td>
                <td style="padding:12px; font-weight:bold; color:#28a745;">
                    $ ${balance}
                </td>
                <td style="padding:12px;">
                    <button onclick="getUserById(${user.id})" style="padding:4px 8px; cursor:pointer; background:#f0f0f0; border:1px solid #ccc;">Edit</button>
                    <button onclick="openWalletModal(${user.id}, 'add')" style="padding:4px 8px; cursor:pointer; background:#d4edda; border:1px solid #c3e6cb; color:#155724;">➕ Add</button>
                    <button onclick="openWalletModal(${user.id}, 'withdraw')" style="padding:4px 8px; cursor:pointer; background:#f8d7da; border:1px solid #f5c6cb; color:#721c24;">➖ Out</button>
                </td>
            </tr>
        `;
    }
    USER_DOM.tbody.innerHTML = html;
}

// ৪. ইউজারের তথ্য আপডেট করা
async function updateUser() {
    const id = USER_DOM.inputs.id.value;
    const payload = {
        firstName: USER_DOM.inputs.firstName.value,
        lastName: USER_DOM.inputs.lastName.value,
        email: USER_DOM.inputs.email.value,
        phone: USER_DOM.inputs.phone.value,
        role: USER_DOM.inputs.role.value,
        status: USER_DOM.inputs.status.value,
        password: "newsecurepassword123"
    };

    try {
        const res = await fetch(USER_API.update(id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success) {
            alert("User updated successfully");
            USER_DOM.form.style.display = "none";
            initUserPage();
        }
    } catch (err) { alert("Update failed"); }
}

// ৫. টাকা অ্যাড বা উইথড্র প্রসেস করা
async function processWalletAction() {
    const id = USER_DOM.wallet.userId.value;
    const amount = parseFloat(USER_DOM.wallet.amount.value);
    const note = USER_DOM.wallet.note.value;

    if (!amount || amount <= 0) return alert("Enter valid amount");

    const endpoint = (walletActionType === "add") ? USER_API.addMoney : USER_API.withdraw;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: parseInt(id), amount: amount, description: note })
        });
        const result = await res.json();
        alert(result.message || "Transaction Successful");
        USER_DOM.walletModal.style.display = "none";
        initUserPage(); // টেবিল রিফ্রেশ
    } catch (err) { alert("Transaction failed"); }
}

// ================= HELPERS & EVENTS =================

function openWalletModal(userId, type) {
    walletActionType = type;
    USER_DOM.wallet.userId.value = userId;
    USER_DOM.wallet.amount.value = "";
    USER_DOM.wallet.note.value = "";
    USER_DOM.wallet.title.innerText = (type === 'add') ? "💰 Add Money to User" : "💸 Withdraw Money";
    USER_DOM.walletModal.style.display = "block";
}

async function getUserById(id) {
    try {
        const res = await fetch(USER_API.getOne(id));
        const json = await res.json();
        if (json.success) {
            const user = json.data;
            USER_DOM.form.style.display = "block";
            USER_DOM.inputs.id.value = user.id;
            USER_DOM.inputs.firstName.value = user.firstName;
            USER_DOM.inputs.lastName.value = user.lastName;
            USER_DOM.inputs.email.value = user.email;
            USER_DOM.inputs.phone.value = user.phone;
            USER_DOM.inputs.role.value = user.role;
            USER_DOM.inputs.status.value = user.status;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (err) { console.error(err); }
}

function bindUserEvents() {
    USER_DOM.submitBtn.onclick = updateUser;
    document.getElementById("cancelUserUpdate").onclick = () => USER_DOM.form.style.display = "none";
    USER_DOM.wallet.confirmBtn.onclick = processWalletAction;
}

async function initUserPage() {
    bindUserEvents();
    await fetchCurrencies(); // প্রথমে কারেন্সি লিস্ট এনে নামগুলো মেমোরিতে রাখা
    const res = await fetch(USER_API.getAll); // ইউজার লিস্ট আনা
    const json = await res.json();
    if (json.success) renderUsers(json.data);
}

// পেজ লোড শুরু
initUserPage();