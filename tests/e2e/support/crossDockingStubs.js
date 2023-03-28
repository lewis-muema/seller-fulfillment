import constants from "../fixtures/constants.json";
import achievements from "../fixtures/achievements.json";
import paymentMethods from "../fixtures/paymentMethods.json";
import user from "../fixtures/user.json";
import billingCycles from "../fixtures/billingCycles.json";
import calculateSpeed from "../fixtures/calculateSpeed.json";
import businessAlt from "../fixtures/businessAlt.json";
import languages from "../fixtures/languages.json";
import notifications from "../fixtures/notifications.json";
import fcm from "../fixtures/fcm.json";
import localStorageDetails from "../fixtures/localStorageDetails.json";
import products from "../fixtures/products.json";
import product from "../fixtures/product_P-LZI-075.json";
import fee from "../fixtures/fee.json";
import geofence from "../fixtures/geofence.json";

import "cypress-localstorage-commands";
Cypress.Commands.add("crossDockingStubs", () => {
  cy.intercept("PUT", `${constants.FULFILMENT_SERVER}seller/*/user/fcm`, {
    statusCode: 200,
    body: fcm,
  }).as("fcm");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/onboarding/achievements`,
    {
      statusCode: 200,
      body: achievements,
    }
  ).as("achievements");
  cy.intercept("POST", `${constants.PAYMENT_GATEWAY}payment_methods`, {
    statusCode: 200,
    body: paymentMethods,
  }).as("paymentMethods");
  cy.intercept("GET", `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/user`, {
    statusCode: 200,
    body: user,
  }).as("userDetails");
  cy.intercept("GET", `${constants.FULFILMENT_SERVER}seller/*/billingcycles`, {
    statusCode: 200,
    body: billingCycles,
  }).as("billingCycles");
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
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/notifications`,
    {
      statusCode: 200,
      body: notifications,
    }
  ).as("notifications");
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}seller/*/crossdocked-delivery/calculate-speed`,
    {
      statusCode: 200,
      body: calculateSpeed,
    }
  ).as("calculateSpeed");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/business`,
    {
      statusCode: 200,
      body: businessAlt,
    }
  ).as("business");
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/location/geofence`,
    {
      statusCode: 200,
      body: geofence,
    }
  ).as("geofence");
});
Cypress.Commands.add("crossDockingProductsStubs", () => {
  cy.intercept(
    "PUT",
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/user/fcm`,
    {
      statusCode: 200,
      body: fcm,
    }
  ).as("fcm");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/products?max=6&offset=0`,
    {
      statusCode: 200,
      body: products,
    }
  ).as("products");
  cy.intercept(
    "GET",
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/products/P-LZI-075`,
    {
      statusCode: 200,
      body: product,
    }
  ).as("product");
});
Cypress.Commands.add("crossDockingFeeStubs", () => {
  cy.intercept(
    "PUT",
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/user/fcm`,
    {
      statusCode: 200,
      body: fcm,
    }
  ).as("fcm");
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}seller/B-AEB-9648/crossdocked-delivery/calculate-fee`,
    {
      statusCode: 200,
      body: fee,
    }
  ).as("fee");
});

Cypress.Commands.add("setTokens", () => {
  cy.setLocalStorage(
    "userDetails",
    JSON.stringify(localStorageDetails.userDetails)
  );
  cy.setLocalStorage("language", localStorageDetails.language);
  cy.setLocalStorage("accessToken", localStorageDetails.accessToken);
  cy.setLocalStorage("user", JSON.stringify(localStorageDetails.user));
  cy.setLocalStorage("sellerTimeLocale", localStorageDetails.sellerTimeLocale);
  cy.setLocalStorage("refreshToken", localStorageDetails.refreshToken);
  cy.setLocalStorage("tokenCreated", localStorageDetails.tokenCreated);
  cy.setLocalStorage("country", localStorageDetails.country);
  cy.setLocalStorage(
    "local_order_uuid",
    JSON.stringify(localStorageDetails.local_order_uuid)
  );
});
