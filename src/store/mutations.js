export default {
  setMobile(state, val) {
    state.mobile = val;
  },
  setComponent(state, val) {
    state.component = val;
  },
  setExternal(state, val) {
    state.external = val;
  },
  setTab(state, val) {
    state.tab = val;
  },
  setLoader(state, val) {
    state.loader[val.type] = val.value;
  },
  setData(state, val) {
    state.data = val;
  },
  setDeliveries(state, val) {
    state.deliveries = val;
  },
  setConsignments(state, val) {
    state.consignments = val;
  },
  setOnDemandDeliveries(state, val) {
    state.onDemandDeliveries = val;
  },
  setDeliveryInfo(state, val) {
    state.deliveryInfo = val;
  },
  setRecepientInfo(state, val) {
    state.recepientInfo = val;
  },
  setPickupInfo(state, val) {
    state.pickupInfo = val;
  },
  setProducts(state, val) {
    state.products = val;
  },
  setOverlay(state, val) {
    state.overlay = val;
  },
  setStatements(state, val) {
    state.statements = val;
  },
  setInvoices(state, val) {
    state.invoices = val;
  },
  setInvoiceContent(state, val) {
    state.invoiceContent = val;
  },
  setTotalDue(state, val) {
    state.totalDue = val;
  },
  setTransationHistory(state, val) {
    state.transationHistory = val;
  },
  setUsers(state, val) {
    state.users = val;
  },
  setLanguages(state, val) {
    state.languages = val;
  },
  setDefaultLanguage(state, val) {
    state.defaultLanguage = val;
  },
  setGeofenceData(state, val) {
    state.geofenceData = val;
  },
  setDownloadActions(state, val) {
    state.downloadActions = val;
  },
  setDeliveryActions(state, val) {
    state.deliveryActions = val;
  },
  setProductsToSubmit(state, val) {
    state.productsToSubmit = val;
  },
  setMappedSelectedProducts(state, val) {
    state.mappedSelectedProducts = val;
  },
  setActivityLog(state, val) {
    state.activityLog = val;
  },
  setUserChanged(state, val) {
    state.userChanged = val;
  },
  setRangeChanged(state, val) {
    state.rangeChanged = val;
  },
  setBusinessUsers(state, val) {
    state.businessUsers = val;
  },
  setDashboardSelectedTab(state, val) {
    state.dashboardSelectedTab = val;
  },
  setInventorySelectedTab(state, val) {
    state.inventorySelectedTab = val;
  },
  setProductLists(state, val) {
    state.productLists = val;
  },
  setStockSelectedTab(state, val) {
    state.stockSelectedTab = val;
  },
  setSelectedProducts(state, val) {
    state.selectedProducts = val;
  },
  setSendProductsRoute(state, val) {
    state.sendProductsRoute = val;
  },
  setProductStep(state, val) {
    state.productStep = val;
  },
  setUserData(state, val) {
    state.userData = val;
  },
  setConfirmedUser(state, val) {
    state.confirmedUser = val;
  },
  setBusinessUserDetails(state, val) {
    state.businessUserDetails = val;
  },
  setGoogleUserData(state, val) {
    state.googleUserData = val;
  },
  setGoogleConfirmData(state, val) {
    state.googleConfirmData = val;
  },
  setIndustries(state, val) {
    state.industries = val;
  },
  setOverlayStatus(state, val) {
    state.overlayStatus = val;
  },
  setSendyPhoneProps(state, val) {
    state.sendyPhoneProps = val;
  },
  setVueTelInputProps(state, val) {
    state.vueTelInputProps = val;
  },
  setCancellationReasons(state, val) {
    state.cancellationReasons = val;
  },
  setEditableFields(state, val) {
    state.editableFields = val;
  },
  setErrors(state, val) {
    state.errors = val;
  },
  setLoginData(state, val) {
    state.loginData = val;
  },
  setOTPRedirectUrl(state, val) {
    state.OTPRedirectUrl = val;
  },
  setAccessToken(state, val) {
    state.accessToken = val;
  },
  setRefreshToken(state, val) {
    state.refreshToken = val;
  },
  setsignUpwithGoogle(state, val) {
    state.signUpwithGoogle = val;
  },
  setSession(state, val) {
    state.session = val;
  },
  setTabStatus(state, val) {
    state.tabStatus = val;
  },
  setOrderTrackingData(state, val) {
    state.orderTrackingData = val;
  },
  setDirectDeliveriesTrackingData(state, val) {
    state.directDeliveriesTrackingData = val;
  },
  setTimelineIcons(state, val) {
    state.timelineIcons = val;
  },
  setOrderTimelines(state, val) {
    state.orderTimelines = val;
  },
  setDeliveryAttempts(state, val) {
    state.deliveryAttempts = val;
  },
  setProduct(state, val) {
    state.product = val;
  },
  setAddProductStatus(state, val) {
    state.addProductStatus = val;
  },
  setFulfillmentFees(state, val) {
    state.fulfillmentFees = val;
  },
  setBusinessDetails(state, val) {
    state.businessDetails = val;
  },
  setUserDetails(state, val) {
    state.userDetails = val;
  },
  setNotifications(state, val) {
    state.notifications = val;
  },
  setEditValue(state, val) {
    state.editValue = val;
  },
  setParent(state, val) {
    state.parent = val;
  },
  setPaymentMethods(state, val) {
    state.paymnetMethods = val;
  },
  setStorageUserDetails(state, val) {
    state.storageUserDetails = val;
  },
  setBizDetails(state, val) {
    state.bizDetails = val;
  },
  setBillingCycles(state, val) {
    state.billingCycles = val;
  },
  setlineItems(state, val) {
    state.lineItems = val;
  },
  setInvoice(state, val) {
    state.invoice = val;
  },
  setEditedPriceIndex(state, val) {
    state.editedPriceIndex = val;
  },
  setPromoCode(state, val) {
    state.promoCode = val;
  },
  setActivePayment(state, val) {
    state.activePayment = val;
  },
  setCycleLineItems(state, val) {
    state.cycleLineItems = val;
  },
  setAchievements(state, val) {
    state.achievements = val;
  },
  setStockStatistics(state, val) {
    state.stockStatistics = val;
  },
  setDeliveriesStatistics(state, val) {
    state.deliveriesStatistics = val;
  },
  setPointToPointStatistics(state, val) {
    state.pointToPointStatistics = val;
  },
  setConsignmentStatistics(state, val) {
    state.consignmentStatistics = val;
  },
  setDeliveriesStatisticsToday(state, val) {
    state.deliveriesStatisticsToday = val;
  },
  setConsignmentStatisticsToday(state, val) {
    state.consignmentStatisticsToday = val;
  },
  setSettings(state, val) {
    state.settings = val;
  },
  setCheckoutDetails(state, val) {
    state.checkoutDetails = val;
  },
  setCountries(state, val) {
    state.countries = val;
  },
  setMapOptions(state, val) {
    state.mapOptions = val;
  },
  setEventLabels(state, val) {
    state.eventLabels = val;
  },
  setAllProductCount(state, val) {
    state.allProductCount = val;
  },
  setArchivedProductCount(state, val) {
    state.archivedProductCount = val;
  },
  setDefaultCountryCode(state, val) {
    state.defaultCountryCode = val;
  },
  setDefaultCountryName(state, val) {
    state.defaultCountryName = val;
  },
  setTabStatuses(state, val) {
    state.tabStatuses = val;
  },
  setTerms(state, val) {
    state.terms = val;
  },
  setUserActions(state, val) {
    state.userActions = val;
  },
  setUser(state, val) {
    state.user = val;
  },
  setNotificationPreferences(state, val) {
    state.notificationPreferences = val;
  },
  setUserAccessPermissions(state, val) {
    state.userAccessPermissions = val;
  },
  setAccessDenied(state, val) {
    state.accessDenied = val;
  },
  setUserAction(state, val) {
    state.userAction = val;
  },
  setActiveUser(state, val) {
    state.activeUser = val;
  },
  setUpdatedData(state, val) {
    state.updatedData = val;
  },
  setExportDataType(state, val) {
    state.exportDataType = val;
  },
  setPaymentCollectionStatus(state, val) {
    state.paymentCollectionStatus = val;
  },
  setWallets(state, val) {
    state.wallets = val;
  },
  setTransactions(state, val) {
    state.transactions = val;
  },
  setBillingCycle(state, val) {
    state.billingCycle = val;
  },
  setSignMapping(state, val) {
    state.signMapping = val;
  },
  setStatisticsStats(state, val) {
    state.statisticsStats = val;
  },
  setActiveTransaction(state, val) {
    state.activeTransaction = val;
  },
  setTransactionTypes(state, val) {
    state.transactionTypes = val;
  },
  setWithDrawalMethods(state, val) {
    state.withDrawalMethods = val;
  },
  setWithDrawalAmount(state, val) {
    state.withDrawalAmount = val;
  },
  setPagination(state, val) {
    state.pagination = val;
  },
  setSearchedProducts(state, val) {
    state.searchedProducts = val;
  },
  setDestinations(state, val) {
    state.destinations = val;
  },
  setDestinationIndex(state, val) {
    state.destinationIndex = val;
  },
  setDocumentURL(state, val) {
    state.documentURL = val;
  },
  setPickUpOptions(state, val) {
    state.pickUpOptions = val;
  },
  setPickUpInfoCD(state, val) {
    state.pickUpInfoCD = val;
  },
  setStations(state, val) {
    state.stations = val;
  },
  setPickUpStation(state, val) {
    state.pickUpStation = val;
  },
  setDeliverySpeed(state, val) {
    state.deliverySpeed = val;
  },
  setPickUpSpeed(state, val) {
    state.pickUpSpeed = val;
  },
  setMismatchedDates(state, val) {
    state.mismatchedDates = val;
  },
  setEdittedDocuments(state, val) {
    state.edittedDocuments = val;
  },
  setEditedDocuments(state, val) {
    state.editedDocuments = val;
  },
  setFinalDocumentsToEdit(state, val) {
    state.finalDocumentsToEdit = val;
  },
  setConsignmentReturn(state, val) {
    state.consignmentReturn = val;
  },
  setConsignmentReturnSpeed(state, val) {
    state.consignmentReturnSpeed = val;
  },
  setAutofillDetails(state, val) {
    state.autofillDetails = val;
  },
  setAutoFillVariants(state, val) {
    state.autoFillVariants = val;
  },
  setAutofillReviewStatus(state, val) {
    state.autofillReviewStatus = val;
  },
  setLPOUploadError(state, val) {
    state.LPOUploadError = val;
  },
  setAutofillProductStatus(state, val) {
    state.autofillProductStatus = val;
  },
  setMarkers(state, val) {
    state.markers = val;
  },
  setPolyline(state, val) {
    state.polyline = val;
  },
  setMapStatus(state, val) {
    state.mapStatus = val;
  },
  setLocationSuggestions(state, val) {
    state.locationSuggestions = val;
  },
  setPricing(state, val) {
    state.pricing = val;
  },
  setDirectOrderStep(state, val) {
    state.directOrderStep = val;
  },
  setSelectedVehicleType(state, val) {
    state.selectedVehicleType = val;
  },
  setDirectOrderDetails(state, val) {
    state.directOrderDetails = val;
  },
  setDirectOrderDetailsStep(state, val) {
    state.directOrderDetailsStep = val;
  },
  setDirectOrderPartner(state, val) {
    state.directOrderPartner = val;
  },
  setDirectOrderNumber(state, val) {
    state.directOrderNumber = val;
  },
  setMapReady(state, val) {
    state.mapReady = val;
  },
  setRiders(state, val) {
    state.riders = val;
  },
  setBanner(state, val) {
    state.banner = val;
  },
  setPaymentRedirectURL(state, val) {
    state.paymentRedirectURL = val;
  },
};
