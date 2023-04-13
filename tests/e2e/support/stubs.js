import signIn from "../fixtures/signIn.json";
import signUp from "../fixtures/signUp.json";
import countries from "../fixtures/countries.json";
import industries from "../fixtures/industries.json";
import otp from "../fixtures/OTP.json";
import completeSignup from "../fixtures/completeSignup.json";
import statistics from "../fixtures/statistics.json";
import deliveriesLimit from "../fixtures/deliveriesLimit.json";
import loginToken from "../fixtures/loginToken.json";
import constants from "../fixtures/constants.json";
import cancellationReasons from "../fixtures/cancellationReasons.json";
import trackingConsignment from "../fixtures/trackingConsignment.json";
import trackingDeliveries from "../fixtures/trackingDeliveries.json";
import editableFields from "../fixtures/editableFields.json";
import singleDelivery from "../fixtures/singleDelivery.json";
import editableFieldsDeliveries from "../fixtures/editableFieldDeliveries.json";
import trackingDeliveriesSummary from "../fixtures/trackingDeliveriesSummary.json";
import trackingSummary from "../fixtures/trackingSummary.json";
import updateConsignmentOrder from "../fixtures/updateConsignmentOrder.json";
import updateDeliveryOrder from "../fixtures/updateDeliveryOrder.json";
import achievements from "../fixtures/achievements.json";
import business from "../fixtures/business.json";
import pointToPointStatistics from "../fixtures/pointToPointStatistics.json";
// import exportTasks from "../fixtures/exportTasks.json";
import consignmentStatistics from "../fixtures/consignmentStatistics.json";
import deliveries from "../fixtures/deliveries.json";
import onDemandDeliveries from "../fixtures/onDemandDeliveries.json";
import trackingOnDemand from "../fixtures/trackingOnDemand.json";
import consignments from "../fixtures/consignments.json";
import exportTasks from "../fixtures/exportTasks.json";
import deliveriesStatistics from "../fixtures/deliveriesStatistics.json";
import languages from "../fixtures/languages.json";
import notifications from "../fixtures/notifications.json";
import payments from "../fixtures/paymentRequired.json";
import pointToPoint from "../fixtures/pointToPoint.json";
import productStatistics from "../fixtures/productStatistics.json";
import statisticsLimit from "../fixtures/statisticsLimit.json";
import wallets from "../fixtures/wallets.json";
import transactions from "../fixtures/transactions.json";
import userDetails from "../fixtures/userDetails.json";
import userAlt from "../fixtures/userAlt.json";
import lineItems from "../fixtures/lineItems.json";
import productsList from "../fixtures/productsList.json";
import settings from "../fixtures/settings.json";
import algoliaProduct from "../fixtures/algoliaProduct.json";
import outOfStockProducts from "../fixtures/outOfStockProducts.json";
import singleProduct from "../fixtures/singleProduct.json";
import productListStatistics from "../fixtures/productListStatistics.json";
import updateProduct from "../fixtures/updateProduct.json";

import "cypress-localstorage-commands";
Cypress.Commands.add("authStubs", () => {
  cy.intercept("POST", `${constants.FULFILMENT_SERVER}seller/business/signin`, {
    statusCode: 200,
    body: signIn,
  }).as("sign-in");
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}seller/business/signin/confirm`,
    {
      statusCode: 200,
      body: otp,
    }
  ).as("sign-in-OTP");

  cy.intercept("POST", `${constants.FULFILMENT_SERVER}seller/business/signup`, {
    statusCode: 200,
    body: signUp,
  }).as("signup");
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}seller/business/signup/confirm`,
    {
      statusCode: 200,
      body: otp,
    }
  ).as("sign-up-OTP");
  cy.intercept(
    "PUT",
    `${constants.FULFILMENT_SERVER}seller/business/signup/update`,
    {
      statusCode: 200,
      body: completeSignup,
    }
  ).as("complete-signup");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/business/signup/countries`,
    {
      statusCode: 200,
      body: countries,
    }
  ).as("countries");
  cy.intercept("GET", `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/user`, {
    statusCode: 200,
    body: userDetails,
  }).as("userDetails");
  cy.intercept("GET", `${constants.FULFILMENT_SERVER}seller/*/user`, {
    statusCode: 200,
    body: userAlt,
  }).as("user");
});
Cypress.Commands.add("dashboardStubs", () => {
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/onboarding/achievements`,
    {
      statusCode: 200,
      body: achievements,
    }
  ).as("achievements");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/point-to-point`,
    {
      statusCode: 200,
      body: pointToPoint,
    }
  ).as("pointToPoint");
  cy.intercept("GET", `${constants.FULFILMENT_SERVER}seller/*/industries`, {
    statusCode: 200,
    body: industries,
  }).as("industries");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/business`,
    {
      statusCode: 200,
      body: business,
    }
  ).as("business");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/consignments/statistics`,
    {
      statusCode: 200,
      body: consignmentStatistics,
    }
  ).as("consignmentStatistics");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/consignments/statistics?lower_limit_date=*&upper_limit_date=*`,
    {
      statusCode: 200,
      body: consignmentStatistics,
    }
  ).as("consignmentStatisticsLimit");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries?`,
    {
      statusCode: 200,
      body: deliveries,
    }
  ).as("deliveries");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries/D-TOANU-02850`,
    {
      statusCode: 200,
      body: singleDelivery,
    }
  ).as("singleDelivery");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries?max=5`,
    {
      statusCode: 200,
      body: deliveriesLimit,
    }
  ).as("deliveriesLimit");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/point-to-point?`,
    {
      statusCode: 200,
      body: onDemandDeliveries,
    }
  ).as("onDemandDeliveries");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/point-to-point/P2P-YZIBU-09912`,
    {
      statusCode: 200,
      body: trackingOnDemand,
    }
  ).as("trackingOnDemand");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/consignments?`,
    {
      statusCode: 200,
      body: consignments,
    }
  ).as("consignments");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries/statistics`,
    {
      statusCode: 200,
      body: deliveriesStatistics,
    }
  ).as("deliveriesStatistics");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/business/signup/languages`,
    {
      statusCode: 200,
      body: languages,
    }
  ).as("languages");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/notifications`,
    {
      statusCode: 200,
      body: notifications,
    }
  ).as("notifications");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/*/billingcycles/paymentrequired`,
    {
      statusCode: 200,
      body: payments,
    }
  ).as("payments");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/products/statistics`,
    {
      statusCode: 200,
      body: productStatistics,
    }
  ).as("productStatistics");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries/statistics?lower_limit_date=*&upper_limit_date=*`,
    {
      statusCode: 200,
      body: statisticsLimit,
    }
  ).as("statisticsLimit");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/transactions/statistics?transaction_type=UPCOMING_EARNING_FROM_SALE_OF_GOOD
`,
    {
      statusCode: 200,
      body: statistics,
    }
  ).as("statisticsLimit");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/wallets`,
    {
      statusCode: 200,
      body: wallets,
    }
  ).as("wallet");
  Cypress.Commands.add("setTokens", () => {
    cy.setLocalStorage("accessToken", JSON.stringify(loginToken.access_token));
  });
});
Cypress.Commands.add("paymentStubs", () => {
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/transactions`,
    {
      statusCode: 200,
      body: transactions,
    }
  ).as("transactions");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/*/billingcycles/*/lineitems`,
    {
      statusCode: 200,
      body: lineItems,
    }
  ).as("transactions");
});
Cypress.Commands.add("deliveriesStubs", () => {
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/exporttasks`,
    {
      statusCode: 200,
      body: exportTasks,
    }
  ).as("exportTasks");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/cancellation-reasons`,
    {
      statusCode: 200,
      body: cancellationReasons,
    }
  ).as("cancellationReasons");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/consignments/*/editablefields`,
    {
      statusCode: 200,
      body: editableFields,
    }
  ).as("editableFields");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries/*/editablefields`,
    {
      statusCode: 200,
      body: editableFieldsDeliveries,
    }
  ).as("editableFieldsDeliveries");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/consignments/C-HEGTE-05134`,
    {
      statusCode: 200,
      body: trackingConsignment,
    }
  ).as("trackingConsignment");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries/D-TOANU-02850`,
    {
      statusCode: 200,
      body: trackingDeliveries,
    }
  ).as("trackingDelivery");

  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/point-to-point/statistics`,
    {
      statusCode: 200,
      body: pointToPointStatistics,
    }
  ).as("pointToPointStatistics");

  cy.intercept(
    "PATCH",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/consignments/C-HEGTE-05134`,
    {
      statusCode: 200,
      body: updateConsignmentOrder,
    }
  ).as("updateConsignmentOrder");
  cy.intercept(
    "PATCH",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries/D-TOANU-02850`,
    {
      statusCode: 200,
      body: updateDeliveryOrder,
    }
  ).as("updateDeliveryOrder");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/tracking/summary/C-HEGTE-05134`,
    {
      statusCode: 200,
      body: trackingSummary,
    }
  ).as("trackingSummary");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/tracking/summary/D-TOANU-02850`,
    {
      statusCode: 200,
      body: trackingDeliveriesSummary,
    }
  ).as("trackingDeliveriesSummary");
});
Cypress.Commands.add("productStubs", () => {
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/*/products?max=5&offset=0`,
    {
      statusCode: 200,
      body: productsList,
    }
  ).as("productsList");
  cy.intercept("GET", `${constants.FULFILMENT_SERVER}seller/*/settings`, {
    statusCode: 200,
    body: settings,
  }).as("settings");
  cy.intercept(
    "POST",
    `https://ygzo0b7nvs-dsn.algolia.net/1/indexes/staging_fulfillment/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.13.1)%3B%20Browser`,
    {
      statusCode: 200,
      body: algoliaProduct,
    }
  ).as("algoliaProduct");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/*/products/outofstock?max=5&offset=0`,
    {
      statusCode: 200,
      body: outOfStockProducts,
    }
  ).as("outOfStockProducts");
  cy.intercept("GET", `${constants.FULFILMENT_SERVER}seller/*/products/*`, {
    statusCode: 200,
    body: singleProduct,
  }).as("singleProduct");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/*/products/statistics`,
    {
      statusCode: 200,
      body: productListStatistics,
    }
  ).as("productListStatistics");
  cy.intercept("PUT", `${constants.FULFILMENT_SERVER}seller/*/products/*`, {
    statusCode: 200,
    body: updateProduct,
  }).as("updateProduct");
});
Cypress.Commands.add("setToken", () => {
  cy.setLocalStorage("userDetails", JSON.stringify(userDetails.userDetails));
  cy.setLocalStorage("language", userDetails.language);
  cy.setLocalStorage("accessToken", userDetails.accessToken);
  cy.setLocalStorage("user", JSON.stringify(userDetails.user));
  cy.setLocalStorage("sellerTimeLocale", userDetails.sellerTimeLocale);
  cy.setLocalStorage("refreshToken", userDetails.refreshToken);
  cy.setLocalStorage("tokenCreated", userDetails.tokenCreated);
  cy.setLocalStorage("country", userDetails.country);
  cy.setLocalStorage(
    "local_order_uuid",
    JSON.stringify(userDetails.local_order_uuid)
  );
});
