import { createRouter, createWebHistory } from "vue-router";
import auth from "../modules/auth/auth.vue";
import signIn from "../modules/auth/signin.vue";
import signUp from "../modules/auth/signup.vue";
import OTP from "../modules/auth/OTP.vue";
import Dashboard from "../modules/dashboard/dashboard.vue";
import Customers from "../modules/deliveries/customers/customers.vue";
import Tracking from "../modules/deliveries/tracking/tracking.vue";
import Sendy from "../modules/deliveries/sendy/sendy.vue";
import Statements from "../modules/payments/statements/statements.vue";
import Invoices from "../modules/payments/invoices/invoices.vue";
import ManageUsers from "../modules/settings/manageUsers/manageUsers.vue";
import PaymentOptions from "../modules/settings/paymentOptions/paymentOptions.vue";
import Profile from "../modules/settings/profile/profile.vue";
import viewInvoice from "../modules/payments/invoices/components/viewInvoice.vue";
import addUser from "../modules/settings/manageUsers/components/addUser.vue";
import userPermissions from "../modules/settings/manageUsers/components/userPermissions.vue";
import invite from "../modules/external/invite.vue";
import editUser from "../modules/settings/manageUsers/components/editUser.vue";
import activityLog from "../modules/settings/activityLog/activityLog.vue";
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
    path: "/deliveries/tracking",
    name: "Tracking",
    component: Tracking,
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
    path: "/payments/view-invoice",
    name: "View Invoice",
    component: viewInvoice,
  },
  {
    path: "/settings/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/settings/add-user",
    name: "Add User",
    component: addUser,
  },
  {
    path: "/settings/edit-user",
    name: "Edit User",
    component: editUser,
  },
  {
    path: "/settings/user-permissions",
    name: "User Permissions",
    component: userPermissions,
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
    path: "/settings/activity-log",
    name: "Activity Log",
    component: activityLog,
  },
  {
    path: "/external/invite",
    name: "Invite",
    component: invite,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
