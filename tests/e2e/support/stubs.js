import signIn from "../fixtures/signIn.json";
import signUp from "../fixtures/signUp.json";
import countries from "../fixtures/countries.json";
import dateLimits from "../fixtures/dateLimits.json";
import industries from "../fixtures/industries.json";
import otp from "../fixtures/OTP.json";
import completeSignup from "../fixtures/completeSignup.json";
import loginToken from "../fixtures/loginToken.json";
import constants from "../fixtures/constants.json";
import achievements from "../fixtures/achievements.json";
import business from "../fixtures/business.json";
import consignmentStatistics from "../fixtures/consignmentStatistics.json";
import deliveries from "../fixtures/deliveries.json";
import deliveriesStatistics from "../fixtures/deliveriesStatistics.json";
import languages from "../fixtures/languages.json";
import notifications from "../fixtures/notifications.json";
import payments from "../fixtures/paymentRequired.json";
import productStatistics from "../fixtures/productStatistics.json";
import statisticsLimit from "../fixtures/statisticsLimit.json";
import wallets from "../fixtures/wallets.json";
import userDetails from "../fixtures/userDetails.json";

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
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/industries`,
    {
      statusCode: 200,
      body: industries,
    }
  ).as("industries");
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
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/billingcycles/paymentrequired`,
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
    `${constants.FULFILMENT_SERVER}seller/B-VSW-5971/wallets`,
    {
      statusCode: 200,
      body: wallets,
    }
  ).as("wallet");
});
Cypress.Commands.add("setTokens", () => {
  cy.setLocalStorage("accessToken", JSON.stringify(loginToken.access_token));
});
