const isLocal =
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const BASE_URL = isLocal
  ? "http://localhost:5000/api"
  : "https://trustmoneyapi.wellcometoserbia.com/api";



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
        icon: `<i class="fa-solid fa-coins"></i>`
      },
      package: {
        html: "layouts/adminPanel/fragments/package.html",
        css: "assets/css/adminPanel/fragments/package.css",
        js: "assets/js/adminPanel/fragments/package.js",
        title: "Package Management",
        icon: `<i class="fa-solid fa-box"></i>`
      },
      users: {
        html: "layouts/adminPanel/fragments/users.html",
        css: "assets/css/adminPanel/fragments/users.css",
        js: "assets/js/adminPanel/fragments/users.js",
        title: "Users Management",
        icon: '<i class="fa-solid fa-users"></i>'
      },
      transaction: {
        html: "layouts/adminPanel/fragments/transaction.html",
        css: "assets/css/adminPanel/fragments/transaction.css",
        js: "assets/js/adminPanel/fragments/transaction.js",
        title: "Transaction Management",
        icon: '<i class="fa-solid fa-money-bill-transfer"></i>'
      },
      paymentmethod: {
        html: "layouts/adminPanel/fragments/paymentmethod.html",
        css: "assets/css/adminPanel/fragments/paymentmethod.css",
        js: "assets/js/adminPanel/fragments/paymentmethod.js",
        title: "Payment Method Management",
        icon: `<i class="fa-solid fa-building-columns"></i>`
      },
      document: {
        html: "layouts/adminPanel/fragments/document.html",
        css: "assets/css/adminPanel/fragments/document.css",
        js: "assets/js/adminPanel/fragments/document.js",
        title: "Document Management",
        icon: `<i class="fa-solid fa-file-lines"></i>`

      },
      money_request: {
        html: "layouts/adminPanel/fragments/money_request.html",
        css: "assets/css/adminPanel/fragments/money_request.css",
        js: "assets/js/adminPanel/fragments/money_request.js",
        title: "Money Request Management",
        icon: `<i class="fa-solid fa-money-bills"></i>`
      },
      verification_fragment: {
        html: "layouts/adminPanel/fragments/verification_fragment.html",
        css: "assets/css/adminPanel/fragments/verification_fragment.css",
        js: "assets/js/adminPanel/fragments/verification_fragment.js",
        title: "Money Request Management",
        icon: `<i class="fa-solid fa-money-bills"></i>`
      },
      banner: {
        html: "layouts/adminPanel/fragments/banner.html",
        css: "assets/css/adminPanel/fragments/banner.css",
        js: "assets/js/adminPanel/fragments/banner.js",
        title: "Banner Management",
        icon: `<i class="fa-solid fa-money-bills"></i>`
      },
      notification: {
        html: "layouts/adminPanel/fragments/notification.html",
        css: "assets/css/adminPanel/fragments/notification.css",
        js: "assets/js/adminPanel/fragments/notification.js",
        title: "Notification Management",
        icon: `<i class="fa-solid fa-money-bills"></i>`
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
