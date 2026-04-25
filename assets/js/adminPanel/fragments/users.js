// ================= CONFIG =================
const USER_API = {
    getAll: `${BASE_URL}/user`,
    getOne: (id) => `${BASE_URL}/user/${id}`,
    update: (id) => `${BASE_URL}/user/${id}`
};

// ================= DOM =================
const USER_DOM = {
    tbody: document.getElementById("userTableBody"),
    form: document.getElementById("updateUserForm"),
    submitBtn: document.getElementById("submitUserUpdate"),

    inputs: {
        id: document.getElementById("userId"),
        firstName: document.getElementById("firstName"),
        lastName: document.getElementById("lastName"),
        email: document.getElementById("email"),
        phone: document.getElementById("phone"),
        role: document.getElementById("role"),
        status: document.getElementById("status")
    }
};

// ================= STATE =================
let userState = {
    users: []
};

// ================= UI =================
function renderUsers(data) {
    USER_DOM.tbody.innerHTML = "";

    data.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td>${user.countryName}</td>
            <td>
                <button class="edit-btn" data-id="${user.id}">Edit</button>
            </td>
        `;

        USER_DOM.tbody.appendChild(row);
    });
}

function showUpdateForm(user) {

    USER_DOM.form.style.display = "block";

    USER_DOM.inputs.id.value = user.data.id;
    USER_DOM.inputs.firstName.value = user.data.firstName;
    USER_DOM.inputs.lastName.value = user.data.lastName;
    USER_DOM.inputs.email.value = user.data.email;
    USER_DOM.inputs.phone.value = user.data.phone;
    USER_DOM.inputs.role.value = user.data.role;
    USER_DOM.inputs.status.value = user.data.status;
}

function hideUpdateForm() {
    USER_DOM.form.style.display = "none";
}

// ================= API =================
async function fetchUsers() {
    try {
        const res = await fetch(USER_API.getAll);
        const json = await res.json();

        userState.users = json.data;
        renderUsers(json.data);

    } catch (err) {
        console.error("Fetch users failed:", err);
    }
}

async function getUserById(id) {
    try {
        const res = await fetch(USER_API.getOne(id));
        const user = await res.json();

        showUpdateForm(user);

    } catch (err) {
        console.error(err);
    }
}

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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await res.json();
        console.log(result);

        hideUpdateForm();
        fetchUsers();

    } catch (err) {
        console.error(err);
    }
}

// ================= EVENTS =================
function bindUserEvents() {
    USER_DOM.tbody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;

        if (e.target.classList.contains("edit-btn")) {
            getUserById(id);
        }
    });

    USER_DOM.submitBtn.addEventListener("click", updateUser);

    document.getElementById("cancelUserUpdate").addEventListener("click", hideUpdateForm);
}

// ================= INIT =================
function initUserPage() {
    bindUserEvents();
    fetchUsers();
}

initUserPage();