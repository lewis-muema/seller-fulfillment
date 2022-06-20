export default {
  getMobile: (state) => state.mobile,
  getComponent: (state) => state.component,
  getExternal: (state) => state.external,
  getTab: (state) => state.tab,
  getLoader: (state) => state.loader,
  getOrderTimelines: (state) => state.orderTimelines,
  getRescheduledOrderTimelines: (state) => state.rescheduledOrderTimelines,
  getOrderEvents: (state) => state.orderEvents,
  getData: (state) => state.data,
  getOrderStatuses: (state) => state.orderStatuses,
  getDeliveries: (state) => state.deliveries,
  getDeliveryInfo: (state) => state.deliveryInfo,
  getPickupInfo: (state) => state.pickupInfo,
  getProducts: (state) => state.products,
  getOverlay: (state) => state.overlay,
  getStatements: (state) => state.statements,
  getInvoices: (state) => state.invoices,
  getInvoiceContent: (state) => state.invoiceContent,
  getTotalDue: (state) => state.totalDue,
  getTransationHistory: (state) => state.transationHistory,
  getUsers: (state) => state.users,
  getLanguages: (state) => state.languages,
  getDefaultLanguage: (state) => state.defaultLanguage,
  getDownloadActions: (state) => state.downloadActions,
  getDeliveryActions: (state) => state.deliveryActions,
  getActivityLog: (state) => state.activityLog,
  getDashboardSelectedTab: (state) => state.dashboardSelectedTab,
  getInventorySelectedTab: (state) => state.inventorySelectedTab,
  getStockSelectedTab: (state) => state.stockSelectedTab,
  getProductLists: (state) => state.productLists,
  getSelectedProducts: (state) => state.selectedProducts,
  getSendProductsRoute: (state) => state.sendProductsRoute,
  getProductStep: (state) => state.productStep,
  getUserData: (state) => state.userData,
  getGoogleUserData: (state) => state.googleUserData,
  getIndustries: (state) => state.industries,
  getOverlayStatus: (state) => state.overlayStatus,
  getSendyPhoneProps: (state) => state.sendyPhoneProps,
  getVueTelInputProps: (state) => state.vueTelInputProps,
  getErrors: (state) => state.errors,
  getLoginData: (state) => state.loginData,
  getOTPRedirectUrl: (state) => state.OTPRedirectUrl,
  getsignUpwithGoogle: (state) => state.signUpwithGoogle,
  getSession: (state) => state.session,
  isAuthenticated: (state) => state.accessToken !== null,
  getTabStatus: (state) => state.tabStatus,
  getOrderTrackingData: (state) => state.orderTrackingData,
  getTimelineIcons: (state) => state.timelineIcons,
  getDeliveryAttempts: (state) => state.deliveryAttempts,
};
