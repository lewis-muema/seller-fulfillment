import { expect } from "chai";
const timeout = 30000;

describe("Product pages", () => {
  it.only("Loads the products list", () => {
    cy.setToken();
    cy.dashboardStubs();
    cy.crossDockingStubs();
    cy.authStubs();
    cy.paymentStubs();
    cy.deliveriesStubs();
    cy.productStubs();
    cy.visit("/inventory/products");
    cy.wait("@productsList", { timeout }).then(() => {
      cy.get(".v-list-item-title span").eq(0).contains("Ceramic Plate");
      cy.get(".v-list-item-title span").eq(1).contains("Black Board Chalk");
      cy.get(".v-list-item-title span").eq(2).contains("Univerval");
      cy.get(".v-list-item-title span").eq(3).contains("IPhone 11 Pro");
      cy.get(".v-list-item-title span").eq(4).contains("Nail Cutter");
    });
  });
  it.only("Searches for a product in the search bar", () => {
    cy.productStubs();
    cy.get(".products-search")
      .find(".v-field__input")
      .type("C", { force: true });
    cy.wait("@algoliaProduct", { timeout }).then(() => {
      cy.get(".search-algolia .search-item-name")
        .eq(0)
        .contains("Ceramic Plate", { timeout });
      cy.get(".products-search")
        .find(".mdi-close-circle")
        .click({ force: true });
    });
  });
  it.only("Displays out of stock products", () => {
    cy.productStubs();
    cy.get(".desktop-product-tab-section")
      .contains("Out of Stock", { timeout })
      .click();
    cy.fixture("productListStatistics", { timeout }).then(() => {
      cy.get(".desktop-product-tab-section .v-badge__content")
        .eq(2)
        .contains("75");
    });
  });
  it.only("Loads products details for a single product", () => {
    cy.productStubs();
    cy.get(".view-product-link span").eq(0).click();
    cy.get(".product-details-content p span")
      .eq(0)
      .contains("Hand made ceramic cups");
    cy.get(".product-details-content p span")
      .eq(1)
      .contains("Total stock available: 0");
  });
  it.only("Edits a single product", () => {
    cy.productStubs();
    cy.get(".product-options-container .product-option-content")
      .eq(0)
      .contains("Edit")
      .click();
    cy.get(".v-field__input").eq(0).type("1111111");
    cy.get("#update-price").clear().type(10);
    cy.get(".col-8 .form-control").clear().type(50);
    cy.get(".btn-long").contains("Save Changes").click();
    cy.fixture("updateProduct").then((product) => {
      expect(
        product.data.product.product_variants[0].universal_product_code
      ).to.equal("1111111");
    });
    cy.wait("@singleProduct", { timeout }).then(() => {
      cy.get(".product-option-content", { timeout }).contains("Archive");
    });
  });
  it.only("Archives a single product", () => {
    cy.archiveStubs();
    cy.get(".product-option-content", { timeout }).contains("Archive").click();
    cy.wait("@archiveProduct", { timeout }).then(() => {
      cy.wait("@archivedProduct", { timeout }).then(() => {
        cy.get(".archived-badge").contains("Archived");
      });
    });
  });
  it.only("Unarchives a single product", () => {
    cy.productStubs();
    cy.get(".product-option-content", { timeout })
      .contains("Unarchive")
      .click();
    cy.wait("@unarchiveProduct").then(() => {
      cy.wait("@singleProduct").then(() => {
        cy.get(".product-option-content").contains("Archive");
      });
    });
  });
  it.only("Adds a product option", () => {
    cy.productStubs();
    cy.get(".product-option-content").contains("Add product options").click();
    cy.get("body")
      .find(".options-products-container")
      .then(($el) => {
        if ($el.length) {
          cy.get(".options-products-container .form-control")
            .eq(0)
            .type("Paper Cup");
          cy.get(".options-products-container .v-field__input")
            .eq(0)
            .type("12", { force: true });
          cy.get(".options-products-container .v-field__input")
            .eq(1)
            .type("2222222", { force: true });
          cy.get(".options-products-container .form-control").eq(1).type(30);
          cy.get(".options-products-container .view-products-close").click();
          cy.get(".btn-long").contains("Save Changes").click();
          cy.wait("@singleProduct", { timeout }).then(() => {
            cy.get(".v-table .v-list-item-title span", { timeout })
              .eq(1)
              .contains("Paper Cup");
          });
        }
      });
  });
  it.only("Adds a product without the image and shows warning", () => {
    cy.setToken();
    cy.dashboardStubs();
    cy.crossDockingStubs();
    cy.authStubs();
    cy.paymentStubs();
    cy.deliveriesStubs();
    cy.productStubs();
    cy.visit("/inventory/add-product");
    cy.get(".v-card .form-control").eq(0).type("Back pack");
    cy.get(".v-field__input").eq(0).type("3333333");
    cy.get("#update-price").clear().type(100);
    cy.get(".col-8 .form-control").clear().type(450);
    cy.get(".btn-long").contains("Save Changes").click();
    cy.get("body")
      .find(".el-notification")
      .then(($el) => {
        if ($el.length) {
          cy.get(
            ".el-notification .el-notification__group .el-notification__title",
            {
              timeout,
            }
          ).contains("Insufficient Information");
          cy.get(
            ".el-notification .el-notification__group .el-notification__content p",
            {
              timeout,
            }
          ).contains(
            "Please fill in all fields and make sure product image is uploaded"
          );
        }
      });
  });
});
