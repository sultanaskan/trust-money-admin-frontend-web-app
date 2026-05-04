// ================= CONFIG =================
const DASHBOARD_API = {
    getSummary: `${BASE_URL}/summary`
};

// ================= DOM CACHE =================
const DASH_DOM = {
    // Stats
    totalUsers: document.getElementById("statTotalUsers"),
    activeUsers: document.getElementById("statActiveUsers"),
    agents: document.getElementById("statAgents"),
    balance: document.getElementById("statSystemBalance"),
    revenue: document.getElementById("statRevenue"),
    deposits: document.getElementById("statTotalDeposits"),
    withdrawals: document.getElementById("statTotalWithdrawals"),
    pendingReq: document.getElementById("statPendingCount"),
    approvedVol: document.getElementById("statApprovedVolume"),

    // Table & Button
    activityTable: document.getElementById("recentActivityTable"),
    refreshBtn: document.getElementById("refreshDashboard")
};

// ================= API FUNCTIONS =================

async function fetchDashboardData() {
    try {
        DASH_DOM.refreshBtn.innerText = "Loading...";

        const response = await fetch(DASHBOARD_API.getSummary);
        const result = await response.json();

        if (result.success) {
            updateDashboardUI(result.summary);
            renderRecentActivity(result.recentActivity);
        }
    } catch (error) {
        console.error("Dashboard API Error:", error);
    } finally {
        DASH_DOM.refreshBtn.innerText = "🔄 Refresh Data";
    }
}

// ================= UI UPDATERS =================

function updateDashboardUI(summary) {
    // Users Update
    DASH_DOM.totalUsers.innerText = summary.users.total;
    DASH_DOM.activeUsers.innerText = summary.users.active;
    DASH_DOM.agents.innerText = summary.users.agents;

    // Finance Update
    DASH_DOM.balance.innerText = formatCurrency(summary.finance.totalSystemBalance);
    DASH_DOM.revenue.innerText = formatCurrency(summary.finance.revenue);
    DASH_DOM.deposits.innerText = formatCurrency(summary.finance.totalDeposits);
    DASH_DOM.withdrawals.innerText = formatCurrency(summary.finance.totalWithdrawals);

    // Requests Update
    DASH_DOM.pendingReq.innerText = summary.requests.pendingCount;
    DASH_DOM.approvedVol.innerText = formatCurrency(summary.requests.approvedVolume);
}

function renderRecentActivity(activities) {
    DASH_DOM.activityTable.innerHTML = "";

    if (!activities || activities.length === 0) {
        DASH_DOM.activityTable.innerHTML = `<tr><td colspan="6" style="text-align:center;">No recent activity found.</td></tr>`;
        return;
    }

    activities.forEach(item => {
        const row = document.createElement("tr");

        // Status Styling
        const statusColor = item.status === 'success' ? '#28a745' : '#ffc107';

        row.innerHTML = `
            <td>
                <strong>${item.User.firstName} ${item.User.lastName}</strong><br>
                <small style="color: #666;">${item.User.email}</small>
            </td>
            <td><span class="badge" style="text-transform: capitalize;">${item.type}</span></td>
            <td><strong>${formatCurrency(item.amount)}</strong></td>
            <td style="max-width: 250px;">
                <small>TrxID: ${item.transactionId || 'N/A'}</small><br>
                <small style="color: #888;">${item.description}</small>
            </td>
            <td>
                <span style="color: ${statusColor}; font-weight: bold; font-size: 13px;">
                    ● ${item.status.toUpperCase()}
                </span>
            </td>
            <td><small>${new Date(item.createdAt).toLocaleString()}</small></td>
        `;
        DASH_DOM.activityTable.appendChild(row);
    });
}

// ================= UTILS =================

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

// ================= INIT =================

function initDashboard() {
    DASH_DOM.refreshBtn.addEventListener("click", fetchDashboardData);
    fetchDashboardData(); // Initial Load
}

// ইনপুট স্ক্রিপ্ট লোড হলে রান করবে
initDashboard();