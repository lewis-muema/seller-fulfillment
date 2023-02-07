import signIn from "../fixtures/signIn.json";
import otp from "../fixtures/OTP.json";
import loginToken from "../fixtures/loginToken.json";
import constants from "../fixtures/constants.json";
import "cypress-localstorage-commands";
Cypress.Commands.add("authStubs", () => {
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}/seller/business/signin`,
    {
      statusCode: 200,
      body: signIn,
    }
  ).as("generate");
  cy.intercept(
    "POST",
    `${constants.FULFILMENT_SERVER}seller/business/signin/confirm`,
    {
      statusCode: 200,
      body: otp,
    }
  ).as("sign-in");
});
Cypress.Commands.add("setTokens", () => {
  cy.setLocalStorage("accessToken", JSON.stringify(loginToken.access_token));
});
