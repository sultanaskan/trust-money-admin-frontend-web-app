/* ================= CONFIG ================= */
const DOC_API = {
    getAll: `${BASE_URL}/doc`,
    create: `${BASE_URL}/doc`,
    update: (id) => `${BASE_URL}/doc/${id}`,
    delete: (id) => `${BASE_URL}/doc/${id}`
};

/* ================= DOM ================= */
const DOC_DOM = {
    tbody: document.getElementById("docTableBody"),
    form: document.getElementById("docForm"),

    inputs: {
        file: document.getElementById("docFile"),
        title: document.getElementById("docTitle"),
        type: document.getElementById("docType"),
        desc: document.getElementById("docDesc")
    },

    addBtn: document.getElementById("addDocBtn"),
    submitBtn: document.getElementById("submitDoc"),
    cancelBtn: document.getElementById("cancelDoc")
};

/* ================= STATE ================= */
let docs = [];

/* ================= RENDER ================= */
function renderDocs(data) {
    DOC_DOM.tbody.innerHTML = "";

    data.forEach(doc => {

        const fileUrl = doc.fileUrl?.startsWith("http")
            ? doc.fileUrl
            : BASE_URL.replace("/api", "/") + doc.fileUrl;
        console.log("File URL: ", fileUrl)

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${doc.title}</td>
            <td>${doc.docType}</td>
            <td>${doc.description}</td>
            <td>
                <a href="${fileUrl}" target="_blank" rel="noopener noreferrer">
                    View
                </a>
            </td>
            <td><button class="update-btn" data-id="${doc.id}">Update</button></td>
            <td><button class="delete-btn" data-id="${doc.id}">Delete</button></td>
        `;

        DOC_DOM.tbody.appendChild(row);
    });
}

/* ================= FETCH ================= */
async function fetchDocs() {
    try {
        const res = await fetch(DOC_API.getAll);
        const data = await res.json();

        docs = data;
        renderDocs(data);

    } catch (err) {
        console.error("Fetch docs failed:", err);
    }
}

/* ================= CREATE ================= */
async function createDoc() {
    const formData = new FormData();

    formData.append("docFile", DOC_DOM.inputs.file.files[0]);
    formData.append("title", DOC_DOM.inputs.title.value);
    formData.append("docType", DOC_DOM.inputs.type.value);
    formData.append("description", DOC_DOM.inputs.desc.value);

    try {
        await fetch(DOC_API.create, {
            method: "POST",
            body: formData
        });

        resetForm();
        fetchDocs();

    } catch (err) {
        console.error(err);
    }
}

/* ================= UPDATE ================= */
async function updateDoc(id) {
    const formData = new FormData();

    if (DOC_DOM.inputs.file.files[0]) {
        formData.append("docFile", DOC_DOM.inputs.file.files[0]);
    }

    formData.append("title", DOC_DOM.inputs.title.value);
    formData.append("docType", DOC_DOM.inputs.type.value);
    formData.append("description", DOC_DOM.inputs.desc.value);

    try {
        await fetch(DOC_API.update(id), {
            method: "PUT",
            body: formData
        });

        resetForm();
        fetchDocs();

    } catch (err) {
        console.error(err);
    }
}

/* ================= DELETE ================= */
async function deleteDoc(id) {
    try {
        await fetch(DOC_API.delete(id), {
            method: "DELETE"
        });

        fetchDocs();

    } catch (err) {
        console.error(err);
    }
}

/* ================= PREFILL UPDATE ================= */
function openUpdateDoc(id) {
    const doc = docs.find(d => d.id == id);
    if (!doc) return;

    DOC_DOM.form.style.display = "block";

    DOC_DOM.inputs.title.value = doc.title;
    DOC_DOM.inputs.type.value = doc.docType;
    DOC_DOM.inputs.desc.value = doc.description;

    DOC_DOM.submitBtn.dataset.mode = "update";
    DOC_DOM.submitBtn.dataset.id = id;
}

/* ================= RESET FORM ================= */
function resetForm() {
    DOC_DOM.form.style.display = "none";

    DOC_DOM.inputs.file.value = "";
    DOC_DOM.inputs.title.value = "";
    DOC_DOM.inputs.type.value = "";
    DOC_DOM.inputs.desc.value = "";

    DOC_DOM.submitBtn.dataset.mode = "create";
    DOC_DOM.submitBtn.dataset.id = "";
}

/* ================= EVENTS ================= */
function bindDocEvents() {

    DOC_DOM.addBtn.addEventListener("click", () => {
        DOC_DOM.form.style.display = "block";
    });

    DOC_DOM.cancelBtn.addEventListener("click", resetForm);

    DOC_DOM.submitBtn.addEventListener("click", async () => {
        const mode = DOC_DOM.submitBtn.dataset.mode;

        if (mode === "update") {
            await updateDoc(DOC_DOM.submitBtn.dataset.id);
        } else {
            await createDoc();
        }
    });

    /* EVENT DELEGATION (FIXED) */
    DOC_DOM.tbody.addEventListener("click", (e) => {

        const btn = e.target.closest("button");
        if (!btn) return;

        const id = btn.dataset.id;

        if (btn.classList.contains("delete-btn")) {
            deleteDoc(id);
        }

        if (btn.classList.contains("update-btn")) {
            openUpdateDoc(id);
        }
    });
}

/* ================= INIT ================= */
function initDocs() {
    bindDocEvents();
    fetchDocs();
}

initDocs();