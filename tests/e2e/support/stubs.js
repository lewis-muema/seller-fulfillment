import signIn from "../fixtures/signIn.json";
import signUp from "../fixtures/signUp.json";
import countries from "../fixtures/countries.json";
import industries from "../fixtures/industries.json";
import otp from "../fixtures/OTP.json";
import completeSignup from "../fixtures/completeSignup.json";
import statistics from "../fixtures/statistics.json";
import loginToken from "../fixtures/loginToken.json";
import constants from "../fixtures/constants.json";
import achievements from "../fixtures/achievements.json";
import business from "../fixtures/business.json";
// import exportTasks from "../fixtures/exportTasks.json";
import consignmentStatistics from "../fixtures/consignmentStatistics.json";
import deliveries from "../fixtures/deliveries.json";
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
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/deliveries?max=5`,
    {
      statusCode: 200,
      body: deliveries,
    }
  ).as("deliveries");
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
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/exporttasks`,
    {
      statusCode: 200,
      body: exportTasks,
    }
  ).as("exportTasks");
});

Cypress.Commands.add("setTokens", () => {
  cy.setLocalStorage("accessToken", JSON.stringify(loginToken.access_token));
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
