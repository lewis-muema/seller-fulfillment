import { createRouter, createWebHistory } from "vue-router";
import auth from "../modules/auth/auth.vue";
import signIn from "../modules/auth/signin.vue";
import signUp from "../modules/auth/signup.vue";
import OTP from "../modules/auth/OTP.vue";
import Dashboard from "../modules/dashboard/dashboard.vue";
import Onboarding from "../modules/dashboard/components/onboarding";
import AddProduct from "../modules/common/addProduct.vue";
import Products from "../modules/inventory/products/products";
import EditProduct from "../modules/inventory/products/components/editProduct";
import ViewProduct from "../modules/inventory/products/viewProduct/viewProduct";
import Import from "../modules/inventory/components/import";
import StockLevels from "../modules/inventory/stocklevels/stockLevels.vue";
import Stepper from "../modules/inventory/sendproducts/components/stepper";
import ProductsSelect from "../modules/inventory/sendproducts/components/productsSelect";
import AddQuantity from "../modules/inventory/sendproducts/components/addQuantity";
import Checkout from "../modules/inventory/sendproducts/components/checkout";
import SendProducts from "../modules/inventory/sendproducts/sendProducts.vue";
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
    path: "/inventory/add-product",
    name: "AddProducts",
    component: AddProduct,
  },
  {
    path: "/inventory/edit-product",
    name: "EditProduct",
    component: EditProduct,
  },
  {
    path: "/inventory/import-products",
    name: "Import",
    component: Import,
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
    path: "/inventory/view-product",
    name: "View Product",
    component: ViewProduct,
  },
  {
    path: "/inventory/send-inventory/step",
    name: "Stepper",
    component: Stepper,
    children: [
      {
        path: "products-customer",
        name: "ProductsToCustomer",
        component: ProductsSelect,
      },
      {
        path: "products-sendy",
        name: "ProductsToSendy",
        component: ProductsSelect,
      },
      {
        path: "add-quantity",
        name: "Add Quantity",
        component: AddQuantity,
      },
      {
        path: "checkout",
        name: "Checkout",
        component: Checkout,
      },
    ],
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
