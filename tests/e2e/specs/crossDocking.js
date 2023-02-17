// import { expect } from "chai";
const timeout = 30000;

describe("Crossdocking", () => {
  it.only("Loads the page and fetches information", () => {
    cy.setTokens();
    cy.crossDockingStubs();
    cy.visit("/inventory/create-delivery");
    cy.get(".header-shortcuts-button").contains("Lewis Muema");
    cy.get(".payment-method-default").contains("M-PESA");
    cy.get(".promo-code-left-section").eq(0).contains("KES 0");
    cy.get(".cross-docking-checkout-chevrons-text").contains("View").click();
    cy.get(".payment-collection-select").contains("Don’t collect payment");
  });
  it.only("Adds products to the order", () => {
    cy.get(".cross-docking-checkout-text-no-underline", { timeout })
      .contains("Select products to send")
      .click();
    cy.crossDockingProductsStubs();
    cy.get(".product-select-column")
      .contains("Black Board Chalk", { timeout })
      .parent()
      .parent()
      .parent()
      .find(".el-input__inner")
      .type(1);
    cy.get(".product-select-column")
      .contains("Black Board Chalk", { timeout })
      .parent()
      .parent()
      .parent()
      .find(".el-input-number__increase")
      .click();
    cy.get(".product-select-column")
      .contains("Black Board Chalk", { timeout })
      .parent()
      .parent()
      .parent()
      .find(".el-input-number__increase")
      .click();
    cy.get(".items-selected-container").contains("Continue with").click();
    cy.crossDockingStubs();
    cy.crossDockingFeeStubs();
    cy.wait("@product", { timeout }).then(() => {
      cy.get(".items-selected-container").contains("Continue with").click();
    });
    cy.wait("@fee", { timeout }).then(() => {
      cy.get(".promo-code-row")
        .contains("Fulfillment fees")
        .parent()
        .parent()
        .contains("KES 8");
    });
  });
  it.only("Checks if all forms have been filled and throws error if some are missing", () => {
    cy.get(".submit-order-btn", { timeout }).contains("Submit Order").click();
    cy.get(".field-required-error").contains("This field is required");
  });
  it.only("Fills in delivery info", () => {
    cy.get(".cross-docking-checkout-text", { timeout })
      .contains("Add delivery info")
      .click();
    cy.get(".businessProfile-address").type("nairobi");
    cy.get(".view-products-close").click();
  });
  it.only("Fills in recipient info", () => {
    cy.get(".cross-docking-checkout-text", { timeout })
      .contains("Add recipient info")
      .click();
    cy.get(".recepient-info-label").eq(0).click();
    cy.get(".edit-info-label").eq(0).contains("Name of the recipient");
    cy.get(".edit-info-label").eq(1).contains("Phone number");
    cy.get(".view-products-close").click();
  });
  it.only("Check if delivery options have been fetched", () => {
    cy.get(".cross-docking-checkout-text", { timeout })
      .contains("Select the delivery option")
      .click();
    cy.get(".delivery-option-notice-message").contains(
      "To view delivery options, select the products to send and fill in the delivery info"
    );
    cy.get(".timeline-failed-attempt-close").click();
  });
  it.only("Adds extra destination", () => {
    cy.get(".cross-docking-checkout-add-location", { timeout }).click();
    cy.crossDockingStubs();
    cy.crossDockingFeeStubs();
    cy.get(".el-collapse-item__header").should("have.length", 2);
  });
});
