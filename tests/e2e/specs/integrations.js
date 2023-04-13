import integrations from "../fixtures/integrations.json";
import stores from "../../../src/modules/integrations/constants/storeFields.json";

const { salesChannels } = JSON.parse(
  JSON.stringify(integrations.availableIntegrations)
);

describe("Integrations Page", () => {
  beforeEach(() => {
    cy.setToken();
    cy.crossDockingStubs();
    cy.dashboardStubs();
    cy.authStubs();
    cy.paymentStubs();
    cy.integrationStubs();
    cy.visit("/settings/integrations");
  });

  it("should be able to render the integrations page", () => {
    cy.get(".header-section-left").should("contain", "Integrations");
    cy.getByData("heading-platform").should("contain", "Connected Store");
    cy.getByData("heading-api-keys").should("contain", "API Keys");
  });

  it("should be able to show integrations", () => {
    salesChannels.forEach((salesChannel) => {
      cy.getByData(`integration-${salesChannel.channel_id}`).should(
        "contain",
        `${salesChannel.name}`
      );
    });
  });

  it("should be able to remove an Platfrom", () => {
    cy.getByData("remove-channel-2").click();
    cy.wait("@deleteIntegration").then(() => {
      cy.get("#notification_1").should(
        "contain",
        "Successful removing integration"
      );
    });
    cy.wait("@getAvailableIntegrations");
  });

  it("should be able to revoke an API key", () => {
    cy.getByData("remove-channel-3").click();
    cy.wait("@deleteApiToken").then(() => {
      cy.get("#notification_1").should(
        "contain",
        "Successful removing API key"
      );
    });
    cy.wait("@getAvailableIntegrations");
  });
});

describe("Integration Process", () => {
  beforeEach(() => {
    cy.setToken();
    cy.crossDockingStubs();
    cy.dashboardStubs();
    cy.authStubs();
    cy.paymentStubs();
    cy.intercept("GET", "/v1/internal/users", {
      statusCode: 404,
    }).as("noIntegrations");
    cy.intercept("**/v1/internal/api/token", {
      statusCode: 200,
      body: integrations.generateToken,
    }).as("createApiKey");
    cy.visit("/settings/integrations");
  });

  it("should display buttons to integrate if they're no integrations", () => {
    cy.intercept("GET", "/v1/internal/users", {
      statusCode: 404,
    }).as("noIntegrations");
    cy.getByData("no-store-integration").should(
      "contain",
      "No store integration found"
    );
    cy.getByData("no-api-integration").should("contain", "No API Keys found");
  });

  // To-Do: Make it work when using the Electron runner
  describe("API Key", () => {
    it("should be able to generate an API key", () => {
      cy.getByData("generate-api-key-btn").click();
      cy.getByData("api-description-textbox").type("Sample API Key");
      cy.getByData("create-api-key-button").click({ force: true });
      // cy.getByData("loading-icon").should("be.visible");
      cy.getByData("api-key").should(
        "contain",
        integrations.generateToken.data.token
      );
    });
  });

  describe("Add store integration", () => {
    beforeEach(() => {
      cy.intercept("POST", "**/api2cart/stores", {
        statusCode: 200,
        body: integrations.createStore,
      }).as("createStores");
    });

    for (const store of Object.keys(stores)) {
      it(`should be able to integrate ${store} store`, () => {
        cy.getByData("add-platform-integration").click();
        cy.getByData("get-started-btn").click();
        cy.getByData("select-dropdown").click();
        cy.getByData(`option-${store.toLowerCase()}`).click();
        cy.getByData("select-platform-btn").click();
        cy.get("#store-name-field").type("Test button", { force: true });
        cy.get("#store-url-field").type("https://www.samplestore", {
          force: true,
        });
        cy.getByData("continue-btn").click();
        for (const storeField of stores[`${store}`]) {
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
          cy.getByData("congratulations").should("contain", "Congratulations");
        });
      });
    }

    it(`should be able to return to integrations page after clicking exit`, () => {
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
        cy.getByData("congratulations").should("contain", "Congratulations");
        cy.getByData("close-thank-you").click();
        cy.url().should("include", "/settings/integrations");
      });
    });

    it(`should remove empty fields from the payload`, () => {
      cy.getByData("add-platform-integration").click();
      cy.getByData("get-started-btn").click();
      cy.getByData("select-dropdown").click();
      cy.getByData(`option-woocommerce`).click();
      cy.getByData("select-platform-btn").click();
      cy.get("#store-name-field").type("Test button", { force: true });
      cy.get("#store-url-field").type("https://www.samplestore", {
        force: true,
      });
      cy.getByData("continue-btn").click();
      cy.get("#bridgeUrl").type("http://test.store.com", {
        force: true,
      });
      cy.get("#storeKey").type("8245989248924517899284128940", {
        force: true,
      });
      cy.getByData("integrate-btn").click();
      cy.wait("@createStores").then((intercept) => {
        expect(intercept.request.body).to.not.have.property("storeRoot");
      });
    });
  });
});
