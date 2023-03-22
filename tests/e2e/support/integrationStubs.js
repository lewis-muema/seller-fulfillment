import integrations from "../fixtures/integrations.json";
Cypress.Commands.add("integrationStubs", () => {
  cy.intercept(
    "GET",
    "https://fulfillment-api-test.sendyit.com/v1/internal/users",
    {
      statusCode: 200,
      body: integrations.availableIntegrations,
    }
  ).as("getAvailableIntegrations");
});
