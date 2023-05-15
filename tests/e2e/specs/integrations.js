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
    cy.intercept(
      {
        method: "GET",
        pathname: "**/v1/internal/users?enabled=true",
        times: 1,
      },
      {
        statusCode: 404,
      }
    ).as("noIntegrations");
    cy.intercept("**/v1/internal/api/token", {
      statusCode: 200,
      body: integrations.generateToken,
    }).as("createApiKey");
    cy.visit("/settings/integrations");
  });

  it("should display buttons to integrate if they're no integrations", () => {
    cy.getByData("no-store-integration").should(
      "contain",
      "No store integration found"
    );
    cy.getByData("no-api-integration").should("contain", "No API Keys found");
  });

  // describe("API Key", () => {
  //   it("should be able to generate an API key", () => {
  //     cy.wait("@noIntegrations");
  //     cy.getByData("generate-api-key-btn").click({ force: true }).debug();
  //     cy.getByData("api-description-textbox").type("Sample API Key");
  //     cy.getByData("create-api-key-button").click({ force: true });
  //     // cy.getByData("loading-icon").should("be.visible");
  //     cy.getByData("api-key").should(
  //       "contain",
  //       integrations.generateToken.data.token
  //     );
  //     cy.getByData("copy-key-btn").click();
  //     navigator.clipboard.readText().then((clipText) => {
  //       expect(clipText).to.be(integrations.generateToken.data.token);
  //       cy.getByData("key-copied-txt").should("contain", "API Key copied");
  //     });
  //   });
  // });

  describe("Add store integration", () => {
    beforeEach(() => {
      cy.intercept("POST", "**/api2cart/stores", {
        statusCode: 201,
        body: integrations.createStore,
      }).as("createStores");
      cy.inventorySyncStubs();
    });

    for (const store of Object.keys(stores)) {
      it(`should be able to integrate ${store} store(Without importing) until step 3)`, () => {
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
          cy.url().should("include", "/setup/4/success");
        });
      });
    }

    it(`should be able to finish all steps of the onboarding(All steps)`, () => {
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

    describe("Product Sync", () => {
      beforeEach(() => {
        cy.intercept("POST", "**/api2cart/products/finish-sync", {
          statusCode: 200,
        }).as("finishSync");
        cy.intercept("GET", "**/v1/internal/users?enabled=true", {
          statusCode: 200,
          body: integrations.availableIntegrations,
        }).as("getSalesChannelInfo");
      });

      it(`Should be able to sync store with conflicting products`, () => {
        cy.intercept("GET", "**/api2cart/products/sync?currency=KES", {
          statusCode: 200,
          body: integrations.conflictingProductsInventory,
        }).as("getProductSyncItems");

        cy.integrationStepsToImport().then(() => {
          cy.getByData("newProductsCount").should("be.visible");
          cy.getByData("matchingProductsCount").should("be.visible");
          cy.getByData("partialProductsCount").should("be.visible");
          cy.getByData("continue").should("be.disabled");
          cy.getByData("resolve-conflicts").click();
          cy.url().should("include", "conflicts");
          cy.getByData("resolve").should("be.disabled");
          cy.getByData("conflict-selector-0").click();
          cy.getByData("conflict-solution-0").click({
            multiple: true,
            force: true,
          });
          //
          cy.getByData("conflicts-count").should("be.visible");
          cy.getByData("resolve").click();
          cy.url().should("include", "/setup/6");
          cy.getByData("resolve-conflicts").should("not.exist");
          cy.getByData("edit_conflicts").click();
          cy.getByData("resolve").click();
          cy.getByData("continue").click();
          cy.wait("@finishSync").then((interception) => {
            cy.fixture("integrations").then((integrations) => {
              integrations.conflictingProductsPayload;
              assert.deepEqual(
                interception.request.body,
                integrations.conflictingProductsPayload
              );
            });
          });
          // .its("request.headers")
          // .should(
          //   "have.property",
          //   "sales-channel-id",
          //   "18675699-8fe9-4d14-8704-4d555681447e"
          // );
          cy.url().should("include", "/setup/7");
          cy.getByData("importing-products").should(
            "contain",
            "We're importing your products"
          );
          cy.getByData("close-btn").click();
          cy.url().should("include", "/settings/integrations/index");
        });
      });

      it(`Should be able to sync store with new products`, () => {
        cy.intercept("GET", "**/api2cart/products/sync?currency=KES", {
          statusCode: 200,
          body: integrations.newProductsInventory,
          times: 1,
        }).as("getProductSyncItems");

        cy.integrationStepsToImport().then(() => {
          cy.wait("@getProductSyncItems");
          cy.getByData("newProductsCount").should("be.visible");
          cy.getByData("matchingProductsCount").should("not.exist");
          cy.getByData("partialProductsCount").should("not.exist");
          cy.getByData("continue").click();
          cy.url().should("include", "/setup/7");
          cy.getByData("importing-products").should(
            "contain",
            "We're importing your products"
          );
          cy.wait("@finishSync")
            .then((interception) => {
              assert.deepEqual(interception.request.body, {
                currency: "KES", // required
                createAllProducts: true, // required
                syncStatus: 1,
              });
            })
            .its("request.headers")
            .should(
              "have.property",
              "sales-channel-id",
              "18675699-8fe9-4d14-8704-4d555681447e"
            );
          cy.getByData("close-btn").click();
          cy.url().should("include", "/settings/integrations/index");
        });
      });

      it(`Should be able to sync store with new and matching products`, () => {
        cy.intercept("GET", "**/api2cart/products/sync?currency=KES", {
          statusCode: 200,
          body: integrations.matchingProductsInventory,
        }).as("getProductSyncItems");

        cy.integrationStepsToImport().then(() => {
          cy.getByData("newProductsCount").should("be.visible");
          cy.getByData("matchingProductsCount").should("be.visible");
          cy.getByData("partialProductsCount").should("not.exist");
          cy.getByData("continue").click();
          cy.url().should("include", "/setup/7");
          cy.getByData("importing-products").should(
            "contain",
            "We're importing your products"
          );
          cy.wait("@finishSync").then((interception) => {
            cy.fixture("integrations").then((integrations) => {
              assert.deepEqual(interception.request.body, {
                currency: "KES", // required
                createAllProducts: false, // required
                syncStatus: 3,
                matchingProducts:
                  integrations.matchingProductsInventory.data.products
                    .matchingProducts,
                newProducts:
                  integrations.matchingProductsInventory.data.products
                    .newProducts,
              });
            });
          });
          cy.getByData("close-btn").click();
          cy.url().should("include", "/settings/integrations/index");
        });
      });
    });

    // To-do: add test for fields validation

    // it(`should return to homepage after clicking close button`, () => {
    //   cy.getByData("add-platform-integration").click();
    //   cy.getByData("get-started-btn").click();
    //   cy.getByData("select-dropdown").click();
    //   cy.getByData(`option-shopify`).click();
    //   cy.getByData("select-platform-btn").click();
    //   cy.getByData("header-close-btn")
    //     .click({ multiple: true, force: true })
    //     .then(() => {
    //       cy.url().should("include", "/settings/integrations");
    //     });
    // });
  });

  describe("Navigation guards - Platform Integration", () => {
    it("should navigate to step 1 if user goes directly to step 2", () => {
      cy.visit("/settings/integrations/platform/setup/2");
      cy.url().should("include", "setup/1");
    });

    it("should navigate to step 1 if user goes directly to step 3", () => {
      cy.visit("/settings/integrations/platform/setup/3");
      cy.url().should("include", "setup/1");
    });
  });
});
