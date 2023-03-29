import integrations from "../fixtures/integrations.json";
Cypress.Commands.add("integrationStubs", () => {
  cy.intercept("GET", "**/v1/internal/users?enabled=true", {
    statusCode: 200,
    body: integrations.availableIntegrations,
  }).as("getAvailableIntegrations");

  cy.intercept("POST", "**/api2cart/stores/opt-out", {
    statusCode: 200,
  }).as("deleteIntegration");

  cy.intercept("DELETE", "**/v1/internal/api/token", { statusCode: 200 }).as(
    "deleteApiToken"
  );
});
