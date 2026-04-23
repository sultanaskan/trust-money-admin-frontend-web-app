const BASE_URL = "https://trustmoneyapi.wellcometoserbia.com/api"



const routes = {
  auth: {
    layout: "layouts/auth/authLayout.html",
    default: "login",
    meta: {
      title: "Admin Aauthentication",
      logo: "/asets/images/logo.png"
    },
    fragments: {
      login: {
        path: "layouts/auth/fragments/login.html",
        title: "Admin Login",
        icon: "Icon"
      },
      register: {
        path: "layouts/auth/fragments/register.html",
        title: "Admin registration"
      }
    }
  },
  admin: {
    layout: "layouts/adminPanel/adminPanelLayout.html",
    default: "dashboard",
    meta: {
      title: "Admin Panel",
      logo: "/asets/images/logo.png"
    },
    fragments: {
      dashboard: {
        path: "layouts/adminPanel/fragments/dashboard.html",
        title: "Dashboard",
        icon: "📊",
      },
      currency: {
        path: "layouts/adminPanel/fragments/currency.html",
        title: "Currency Management",
        icon: "🪙"
      },
      package: {
        path: "layouts/adminPanel/fragments/package.html",
        title: "Package Management",
        icon: "📦"
      },
      users: {
        path: "layouts/adminPanel/fragments/users.html",
        title: "Users Management",
        icon: "👥"
      },
      transaction: {
        path: "layouts/adminPanel/fragments/transaction.html",
        title: "Transaction Management",
        icon: "💸",
      },
      paymentmethod: {
        path: "layouts/adminPanel/fragments/paymentmethod.html",
        title: "Payment Method Management",
        icon: "🏦"
      },
      document: {
        path: "layouts/adminPanel/fragments/document.html",
        title: "Document Management",
        icon: "📄",

      }

    },
    components: {
      topbar: "layouts/adminPanel/components/topbar.html",
      footer: "layouts/adminPanel/components/footer.html"
    }
  }
};
