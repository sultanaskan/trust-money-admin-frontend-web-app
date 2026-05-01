// ================= CONFIG =================
const BANNER_API = {
    getAll: `${BASE_URL}/banner`,
    create: `${BASE_URL}/banner`,
    delete: (id) => `${BASE_URL}/banner/${id}`
};

// ================= DOM CACHE =================
const BANNER_DOM = {
    tbody: document.getElementById("bannerTableBody"),
    addBtn: document.getElementById("addBannerBtn"),
    formRow: document.getElementById("addBannerForm"),
    submitBtn: document.getElementById("submitBanner"),
    cancelBtn: document.getElementById("cancelBanner"),

    inputs: {
        image: document.getElementById("bannerImageInput"),
        title: document.getElementById("bannerTitleInput")
    }
};

// ================= STATE =================
let bannerState = {
    banners: []
};

// ================= UI FUNCTIONS =================
function toggleBannerForm() {
    const isHidden = BANNER_DOM.formRow.style.display === "none";
    BANNER_DOM.formRow.style.display = isHidden ? "block" : "none";
    BANNER_DOM.addBtn.innerText = isHidden ? "❌ Cancel Adding" : "➕ Add New Banner";
}

function renderBannerTable(data) {
    BANNER_DOM.tbody.innerHTML = "";

    if (data.length === 0) {
        BANNER_DOM.tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No banners found.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><img src="${item.bannerUrl}" alt="banner" style="width: 120px; height: 60px; object-fit: cover; border-radius: 4px;"></td>
            <td><strong>${item.title || 'Untitled'}</strong></td>
            <td>
                <span class="status-badge ${item.isActive ? 'active' : 'inactive'}" 
                      style="color: ${item.isActive ? 'green' : 'red'}; font-weight: bold;">
                    ${item.isActive ? '● Active' : '● Inactive'}
                </span>
            </td>
            <td><small>${new Date(item.createdAt).toLocaleDateString()}</small></td>
            <td>
                <button class="delete-btn" data-id="${item.id}" style="background:#ff4d4d; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">
                    🗑️ Delete
                </button>
            </td>
        `;

        BANNER_DOM.tbody.appendChild(row);
    });
}

// ================= API CALLS =================

// ১. গেট অল ব্যানার
async function fetchBanners() {
    try {
        const res = await fetch(BANNER_API.getAll);
        const result = await res.json();
        if (result.success) {
            bannerState.banners = result.data;
            renderBannerTable(result.data);
        }
    } catch (err) {
        console.error("Fetch Banners Failed:", err);
    }
}

// ২. ব্যানার আপলোড (POST)
async function createBanner() {
    const file = BANNER_DOM.inputs.image.files[0];
    const title = BANNER_DOM.inputs.title.value;

    if (!file) {
        alert("Please select an image file first!");
        return;
    }

    BANNER_DOM.submitBtn.innerText = "Uploading...";
    BANNER_DOM.submitBtn.disabled = true;

    const formData = new FormData();
    formData.append("bannerImage", file);
    formData.append("title", title);

    try {
        const res = await fetch(BANNER_API.create, {
            method: "POST",
            body: formData
        });

        const result = await res.json();
        if (result.success) {
            alert("Banner uploaded successfully!");
            // ফর্ম ক্লিয়ার এবং রিফ্রেশ
            BANNER_DOM.inputs.image.value = "";
            BANNER_DOM.inputs.title.value = "";
            toggleBannerForm();
            fetchBanners();
        } else {
            alert("Error: " + result.message);
        }
    } catch (err) {
        console.error("Upload failed:", err);
        alert("Server error during upload!");
    } finally {
        BANNER_DOM.submitBtn.innerText = "✅ Upload Banner";
        BANNER_DOM.submitBtn.disabled = false;
    }
}

// ৩. ব্যানার ডিলিট (DELETE)
async function deleteBanner(id) {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
        const res = await fetch(BANNER_API.delete(id), {
            method: "DELETE"
        });
        const result = await res.json();

        if (result.success) {
            fetchBanners(); // রিফ্রেশ লিস্ট
        }
    } catch (err) {
        console.error("Delete failed:", err);
    }
}

// ================= EVENTS =================
function bindBannerEvents() {
    BANNER_DOM.addBtn.addEventListener("click", toggleBannerForm);
    BANNER_DOM.cancelBtn.addEventListener("click", toggleBannerForm);
    BANNER_DOM.submitBtn.addEventListener("click", createBanner);

    // টেবিল একশন (Event Delegation)
    BANNER_DOM.tbody.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = e.target.dataset.id;
            deleteBanner(id);
        }
    });
}

// ================= INIT =================
function initBannerPage() {
    bindBannerEvents();
    fetchBanners();
}

initBannerPage();