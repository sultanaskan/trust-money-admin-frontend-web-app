//const BASE_URL = "https://trustmoneyapi.wellcometoserbia.com/api"
const BASE_URL = "http://localhost:5000/api"


const routes = {
  auth: {
    layout: {
      html: "layouts/auth/authLayout.html",
      css: "assets/css/auth/authLayout.css",
      js: "assets/js/auth/authLayout.js"
    },
    default: "login",
    meta: {
      title: "Admin Aauthentication",
      logo: "/assets/images/logo.png"
    },
    fragments: {
      login: {
        html: "layouts/auth/fragments/login.html",
        title: "Admin Login",
        icon: "Icon",
        css: "assets/css/auth/fragments/login.css",
        js: "assets/js/auth/fragments/login.js"

      },
      register: {
        html: "layouts/auth/fragments/register.html",
        title: "Admin registration",
        css: "assets/css/auth/fragments/register.css",
        js: "assets/js/auth/fragments/register.js"

      }
    }
  },
  admin: {
    layout: {
      html: "layouts/adminPanel/adminPanelLayout.html",
      css: "assets/css/adminPanel/adminPanelLayout.css",
      js: "assets/js/adminPanel/adminPanelLayout.js"
    },
    default: "dashboard",
    meta: {
      title: "Admin Panel",
      logo: "/asets/images/logo.png"
    },
    fragments: {
      dashboard: {
        html: "layouts/adminPanel/fragments/dashboard.html",
        css: "assets/css/adminPanel/fragemnts/dashboard.css",
        js: "assets/js/adminPanel/fragments/dashboard.js",
        title: "Dashboard",
        icon: "📊",
      },
      currency: {
        html: "layouts/adminPanel/fragments/currency.html",
        css: "assets/css/adminPanel/fragments/currency.css",
        js: "assets/js/adminPanel/fragments/currency.js",
        title: "Currency Management",
        icon: "🪙"
      },
      package: {
        html: "layouts/adminPanel/fragments/package.html",
        css: "assets/css/adminPanel/fragments/package.css",
        js: "assets/js/adminPanel/fragments/package.js",
        title: "Package Management",
        icon: "📦"
      },
      users: {
        html: "layouts/adminPanel/fragments/users.html",
        css: "assets/css/adminPanel/fragments/users.css",
        js: "assets/js/adminPanel/fragments/users.js",
        title: "Users Management",
        icon: "👥"
      },
      transaction: {
        html: "layouts/adminPanel/fragments/transaction.html",
        css: "assets/css/adminPanel/fragments/transaction.css",
        js: "assets/js/adminPanel/fragments/transaction.js",
        title: "Transaction Management",
        icon: "💸",
      },
      paymentmethod: {
        html: "layouts/adminPanel/fragments/paymentmethod.html",
        css: "assets/css/adminPanel/fragments/paymentmethod.css",
        js: "assets/js/adminPanel/fragments/paymentmethod.js",
        title: "Payment Method Management",
        icon: "🏦"
      },
      document: {
        html: "layouts/adminPanel/fragments/document.html",
        css: "assets/css/adminPanel/fragments/document.css",
        js: "assets/js/adminPanel/fragments/document.js",
        title: "Document Management",
        icon: "📄",

      }

    },
    components: {
      topbar: {
        html: "layouts/adminPanel/components/topbar.html",
        css: "assets/css/adminPanel/components/topbar.css",
        js: "assets/js/adminPanel/components/topbar.js"
      },
      footer: {
        html: "layouts/adminPanel/components/footer.html",
        css: "assets/css/adminPanel/components/footer.css",
        js: "assets/js/adminPanel/components/footer.js"
      }
    }
  }
};
