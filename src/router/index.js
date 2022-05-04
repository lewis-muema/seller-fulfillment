import { createRouter, createWebHistory } from "vue-router";
import auth from "../modules/auth/auth.vue";
import signIn from "../modules/auth/signin.vue";
import signUp from "../modules/auth/signup.vue";
import OTP from "../modules/auth/OTP.vue";
import Dashboard from "../modules/dashboard/dashboard.vue";
import Onboarding from "../modules/dashboard/components/onboarding";
import Products from "../modules/inventory/products.vue";
import StockLevels from "../modules/inventory/stockLevels.vue";
import SendProducts from "../modules/inventory/sendProducts.vue";
import Customers from "../modules/deliveries/customers.vue";
import Sendy from "../modules/deliveries/sendy.vue";
import Statements from "../modules/payments/statements.vue";
import Invoices from "../modules/payments/invoices.vue";
import ManageUsers from "../modules/settings/manageUsers.vue";
import PaymentOptions from "../modules/settings/paymentOptions.vue";
import Profile from "../modules/settings/profile.vue";
import Help from "../modules/help/help.vue";

const routes = [
  {
    path: "/auth/",
    name: "Auth",
    component: auth,
    children: [
      {
        path: "sign-in",
        name: "SignIn",
        component: signIn,
      },
      {
        path: "sign-up",
        name: "SignUP",
        component: signUp,
      },
      {
        path: "otp",
        name: "OTP",
        component: OTP,
      },
    ],
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
  },
  {
    path: "/onboarding",
    name: "Onboarding",
    component: Onboarding,
  },
  {
    path: "/inventory/products",
    name: "Products",
    component: Products,
  },
  {
    path: "/inventory/stock-levels",
    name: "Stock Levels",
    component: StockLevels,
  },
  {
    path: "/inventory/send-inventory",
    name: "Send Inventory",
    component: SendProducts,
  },
  {
    path: "/deliveries/customer",
    name: "To Customers",
    component: Customers,
  },
  {
    path: "/deliveries/sendy",
    name: "To Sendy",
    component: Sendy,
  },
  {
    path: "/payments/statements",
    name: "Statements",
    component: Statements,
  },
  {
    path: "/payments/invoices",
    name: "Invoices",
    component: Invoices,
  },
  {
    path: "/settings/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/settings/payment-options",
    name: "Payment Options",
    component: PaymentOptions,
  },
  {
    path: "/settings/manage-users",
    name: "Manage Users",
    component: ManageUsers,
  },
  {
    path: "/help",
    name: "Help",
    component: Help,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
