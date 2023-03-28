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
  getConsignments: (state) => state.consignments,
  getDeliveryInfo: (state) => state.deliveryInfo,
  getRecepientInfo: (state) => state.recepientInfo,
  getOnDemandDeliveries: (state) => state.onDemandDeliveries,
  getEdittedDocuments: (state) => state.edittedDocuments,
  getFinalDocumentsToEdit: (state) => state.finalDocumentsToEdit,
  getEditedDocuments: (state) => state.editedDocuments,
  getPickupInfo: (state) => state.pickupInfo,
  getGeofenceData: (state) => state.geofenceData,
  getProducts: (state) => state.products,
  getOverlay: (state) => state.overlay,
  getStatements: (state) => state.statements,
  getInvoices: (state) => state.invoices,
  getInvoiceContent: (state) => state.invoiceContent,
  getTotalDue: (state) => state.totalDue,
  getTransationHistory: (state) => state.transationHistory,
  getUsers: (state) => state.users,
  getLanguages: (state) => state.languages,
  getEditValue: (state) => state.editValue,
  getDefaultLanguage: (state) => state.defaultLanguage,
  getDownloadActions: (state) => state.downloadActions,
  getDeliveryActions: (state) => state.deliveryActions,
  getActivityLog: (state) => state.activityLog,
  getActivityLogs: (state) => state.activityLogs,
  getProductsToSubmit: (state) => state.productsToSubmit,
  getUserChanged: (state) => state.userChanged,
  getMappedSelectedProducts: (state) => state.mappedSelectedProducts,
  getRangeChanged: (state) => state.rangeChanged,
  getBusinessUsers: (state) => state.businessUsers,
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
  getDirectDeliveriesTrackingData: (state) =>
    state.directDeliveriesTrackingData,
  getTimelineIcons: (state) => state.timelineIcons,
  getDeliveryAttempts: (state) => state.deliveryAttempts,
  getProduct: (state) => state.product,
  getAddProductStatus: (state) => state.addProductStatus,
  getFulfillmentFees: (state) => state.fulfillmentFees,
  getBusinessDetails: (state) => state.businessDetails,
  getUserDetails: (state) => state.userDetails,
  getNotifications: (state) => state.notifications,
  getParent: (state) => state.parent,
  getPaymnetMethods: (state) => state.paymnetMethods,
  getStorageUserDetails: (state) =>
    state.bizDetails
      ? state.bizDetails
      : state.storageUserDetails
      ? JSON.parse(state.storageUserDetails)
      : {},
  getBillingCycles: (state) => state.billingCycles,
  getCancellationReasons: (state) => state.cancellationReasons,
  getEditableFields: (state) => state.editableFields,
  getLineItems: (state) => state.lineItems,
  getInvoice: (state) => state.invoice,
  getEditedPriceIndex: (state) => state.editedPriceIndex,
  getPromoCode: (state) => state.promoCode,
  getActivePayment: (state) => state.activePayment,
  getCycleLineItems: (state) => state.cycleLineItems,
  getAchievements: (state) => state.achievements,
  getStockStatistics: (state) => state.stockStatistics,
  getPointToPointStatistics: (state) => state.pointToPointStatistics,
  getDeliveriesStatistics: (state) => state.deliveriesStatistics,
  getConsignmentStatistics: (state) => state.consignmentStatistics,
  getDeliveriesStatisticsToday: (state) => state.deliveriesStatisticsToday,
  getConsignmentStatisticsToday: (state) => state.consignmentStatisticsToday,
  getSettings: (state) => state.settings,
  getCheckoutDetails: (state) => state.checkoutDetails,
  getCountries: (state) => state.countries,
  getMapOptions: (state) => state.mapOptions,
  getEventLabels: (state) => state.eventLabels,
  getAllProductCount: (state) => state.allProductCount,
  getArchivedProductCount: (state) => state.archivedProductCount,
  getDefaultCountryCode: (state) => state.defaultCountryCode,
  getDefaultCountryName: (state) => state.defaultCountryName,
  getTabStatuses: (state) => state.tabStatuses,
  getTerms: (state) => state.terms,
  getUserActions: (state) => state.userActions,
  getUser: (state) => state.user,
  getNotificationPreferences: (state) => state.notificationPreferences,
  getUserAccessPermissions: (state) => state.userAccessPermissions,
  getAccessDenied: (state) => state.accessDenied,
  getUserAction: (state) => state.userAction,
  getActiveUser: (state) => state.activeUser,
  getExportDataType: (state) => state.exportDataType,
  getPaymentCollectionStatus: (state) => state.paymentCollectionStatus,
  getWallets: (state) => state.wallets,
  getTransactions: (state) => state.transactions,
  getBillingCycle: (state) => state.billingCycle,
  getSignMapping: (state) => state.signMapping,
  getStatisticsStats: (state) => state.statisticsStats,
  getActiveTransaction: (state) => state.activeTransaction,
  getTransactionTypes: (state) => state.transactionTypes,
  getWithDrawalMethods: (state) => state.withDrawalMethods,
  getWithDrawalAmount: (state) => state.withDrawalAmount,
  getPagination: (state) => state.pagination,
  getSearchedProducts: (state) => state.searchedProducts,
  getDestinations: (state) => state.destinations,
  getDestinationIndex: (state) => state.destinationIndex,
  getDocumentURL: (state) => state.documentURL,
  getPickUpOptions: (state) => state.pickUpOptions,
  getPickUpInfoCD: (state) => state.pickUpInfoCD,
  getStations: (state) => state.stations,
  getPickUpStation: (state) => state.pickUpStation,
  getPickUpSpeed: (state) => state.pickUpSpeed,
  getDeliverySpeed: (state) => state.deliverySpeed,
  getMismatchedDates: (state) => state.mismatchedDates,
  getConsignmentReturn: (state) => state.consignmentReturn,
  getConsignmentReturnSpeed: (state) => state.consignmentReturnSpeed,
  getAutofillDetails: (state) => state.autofillDetails,
  getAutoFillVariants: (state) => state.autoFillVariants,
  getAutofillReviewStatus: (state) => state.autofillReviewStatus,
  getLPOUploadError: (state) => state.LPOUploadError,
  getAutofillProductStatus: (state) => state.autofillProductStatus,
  getMarkers: (state) => state.markers,
  getPolyline: (state) => state.polyline,
  getMapStatus: (state) => state.mapStatus,
  getLocationSuggestions: (state) => state.locationSuggestions,
  getPricing: (state) => state.pricing,
  getDirectOrderStep: (state) => state.directOrderStep,
  getSelectedVehicleType: (state) => state.selectedVehicleType,
  getDirectOrderDetails: (state) => state.directOrderDetails,
  getDirectOrderDetailsStep: (state) => state.directOrderDetailsStep,
  getDirectOrderPartner: (state) => state.directOrderPartner,
  getDirectOrderNumber: (state) => state.directOrderNumber,
  getmapReady: (state) => state.mapReady,
};
