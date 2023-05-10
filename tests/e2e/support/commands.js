import stores from "../../../src/modules/integrations/constants/storeFields.json";

Cypress.Commands.add("getByData", (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add("integrationStepsToImport", () => {
  cy.getByData("add-platform-integration").click();
  cy.getByData("get-started-btn").click();
  cy.getByData("select-dropdown").click();
  cy.getByData(`option-shopify`).click();
  cy.getByData("select-platform-btn").click();
  cy.get("#store-name-field").type("Test button", { force: true });
  cy.get("#store-url-field").type("https://www.samplestore", {
    force: true,
  });
  cy.getByData("continue-btn").click();
  for (const storeField of stores[`Shopify`]) {
    if (storeField.isUrl) {
      cy.get(`#${storeField.fieldName}`).type("http://test.store.com", {
        force: true,
      });
      continue;
    }
    cy.get(`#${storeField.fieldName}`).type("Test", { force: true });
  }
  cy.getByData("integrate-btn").click();
  cy.wait("@createStores").then(() => {
    cy.url().should("include", "/setup/4/success");
  });
});
