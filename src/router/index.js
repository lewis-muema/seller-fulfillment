import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import Auth from "../modules/auth/auth.vue";
import SignIn from "../modules/auth/signin.vue";
import SignUp from "../modules/auth/signup.vue";
import OTP from "../modules/auth/OTP.vue";
import CompleteSignup from "../modules/auth/completeSignup";
import Dashboard from "../modules/dashboard/dashboard.vue";
import Customers from "../modules/deliveries/customers/customers.vue";
import Tracking from "../modules/deliveries/tracking/tracking.vue";
import Sendy from "../modules/deliveries/sendy/sendy.vue";
import Transactions from "../modules/payments/transactions/transactions.vue";
import Wallet from "../modules/payments/wallet/wallet.vue";
import DeliveriesPendingPayment from "../modules/payments/wallet/components/deliveriesPendingPayment.vue";
import PendingPaymentCollections from "../modules/payments/wallet/components/pendingPaymentCollections.vue";
import TransactionDetails from "../modules/payments/wallet/components/transactionDetails.vue";
import Withdraw from "../modules/payments/wallet/components/withdraw.vue";
import ManageUsers from "../modules/settings/manageUsers/manageUsers.vue";
import notifications from "../modules/settings/notifications/notifications.vue";
import viewUser from "../modules/settings/manageUsers/components/viewUser.vue";
import confirmUserDetails from "../modules/settings/manageUsers/components/confirmUserDetails.vue";
import PaymentOptions from "../modules/settings/paymentOptions/paymentOptions.vue";
import Profile from "../modules/settings/profile/profile.vue";
import viewInvoice from "../modules/payments/invoices/components/viewInvoice.vue";
import addUser from "../modules/settings/manageUsers/components/addUser.vue";
import userPermissions from "../modules/settings/manageUsers/components/userPermissions.vue";
import invite from "../modules/external/invite.vue";
import editUser from "../modules/settings/manageUsers/components/editUser.vue";
import editOrder from "../modules/deliveries/tracking/components/editOrder.vue";
import activityLog from "../modules/settings/activityLog/activityLog.vue";
import Onboarding from "../modules/dashboard/components/onboarding";
import AddProduct from "../modules/inventory/products/components/addProduct.vue";
import Products from "../modules/inventory/products/products";
import EditProduct from "../modules/inventory/products/components/editProduct";
import ViewProduct from "../modules/inventory/products/viewProduct/viewProduct";
import Import from "../modules/inventory/products/components/import";
import StockLevels from "../modules/inventory/stocklevels/stockLevels.vue";
import SendProducts from "../modules/inventory/sendproducts/sendProducts.vue";
import CreateDelivery from "../modules/inventory/crossdocking/checkout.vue";
import AddDeliveryProducts from "../modules/inventory/crossdocking/components/productSelect.vue";
import AddDeliveryQuantities from "../modules/inventory/crossdocking/components/addQuantity.vue";
import paymentSummary from "../modules/payments/statements/components/paymentSummary.vue";

// merchant services integrations
import integrations from "../modules/integrations/integrations.vue";
import platform from "../modules/integrations/components/storePlatform.vue";
import storeDetails from "../modules/integrations/components/storeDetails.vue";

const routes = [
  {
    path: "/auth/",
    name: "Auth",
    component: Auth,
    children: [
      {
        path: "sign-in",
        name: "SignIn",
        component: SignIn,
      },
      {
        path: "sign-up",
        name: "SignUP",
        component: SignUp,
      },
      {
        path: "otp",
        name: "OTP",
        component: OTP,
      },
      {
        path: "complete-signup",
        name: "CompleteSignup",
        component: CompleteSignup,
      },
    ],
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/onboarding",
    name: "Onboarding",
    component: Onboarding,
    meta: {
      requiresAuth: true,
    },
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
    path: "/inventory/stock-levels/:tab?",
    name: "Stock Levels",
    component: StockLevels,
  },
  {
    path: "/inventory/view-product/:product?",
    name: "View Product",
    component: ViewProduct,
  },
  {
    path: "/inventory/send-inventory/:path?/:page?",
    name: "Send Inventory",
    component: SendProducts,
  },
  {
    path: "/inventory/create-delivery",
    name: "Create Delivery",
    component: CreateDelivery,
  },
  {
    path: "/inventory/add-delivery-products",
    name: "Add Delivery Products",
    component: AddDeliveryProducts,
  },
  {
    path: "/inventory/add-delivery-quantities",
    name: "Add Delivery Quantities",
    component: AddDeliveryQuantities,
  },
  {
    path: "/deliveries/customer/:tab?/:date?",
    name: "To Customers",
    component: Customers,
  },
  {
    path: "/deliveries/sendy/:tab?/:date?",
    name: "To Sendy",
    component: Sendy,
  },
  {
    path: "/deliveries/tracking/:order_id",
    name: "Tracking",
    component: Tracking,
  },
  {
    path: "/deliveries/edit-order/",
    name: "EditOrder",
    component: editOrder,
  },
  {
    path: "/payments/transactions",
    name: "Transactions",
    component: Transactions,
  },
  {
    path: "/payments/wallet",
    name: "Wallet",
    component: Wallet,
  },
  {
    path: "/payments/deliveries-pending-payment/:cycle_id",
    name: "Deliveries pending payment",
    component: DeliveriesPendingPayment,
  },
  {
    path: "/payments/pending-payment-collections",
    name: "Pending payment collections",
    component: PendingPaymentCollections,
  },
  {
    path: "/payments/transaction-details",
    name: "Transaction details",
    component: TransactionDetails,
  },
  {
    path: "/payments/withdraw",
    name: "Withdraw",
    component: Withdraw,
  },
  {
    path: "/payments/view-invoice/:invoice_id?",
    name: "View Invoice",
    component: viewInvoice,
  },
  {
    path: "/payments/payment-summary/:cycle_id?",
    name: "Payment Summary",
    component: paymentSummary,
  },
  {
    path: "/settings/profile/:page?",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/settings/add-user",
    name: "Add User",
    component: addUser,
  },
  {
    path: "/settings/edit-user/:user_id?",
    name: "Edit User",
    component: editUser,
  },
  {
    path: "/settings/user-permissions/:user_id?",
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
    path: "/settings/confirm-user-details/:user_id?",
    name: "Confirm User Details",
    component: confirmUserDetails,
  },
  {
    path: "/settings/view-user/:user_id?",
    name: "View User",
    component: viewUser,
  },
  {
    path: "/settings/notification-preferences",
    name: "Notifications",
    component: notifications,
  },
  {
    path: "/settings/integrations",
    name: "Integrations",
    component: integrations,
  },
  {
    path: "/settings/integrations/store-platform",
    name: "Platform",
    component: platform,
  },
  {
    path: "/settings/integrations/store-details",
    name: "Store Details",
    component: storeDetails,
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

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    store.dispatch("initializeAuth");
    if (!store.getters.isAuthenticated) {
      next("/auth/sign-in");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
