import { expect } from "chai";

describe("Dashboard screens", () => {
  it.only("show the welcome screen after a successful signup/login", () => {
    cy.setToken();
    cy.dashboardStubs();
    cy.crossDockingStubs();
    cy.authStubs();
    cy.paymentStubs();
    cy.visit("/");
    cy.fixture("userDetails").then((user) => {
      if (Object.keys(user).length) {
        cy.get(".dashboard-welcome-message").contains(user.user.first_name);
      }
    });
  });
  it.only("Can see the sidebar on the dashboard screen,  ", () => {
    //cy.get(".dashboard-welcome-message").contains(user.user.first_name);
  });
  it.only("Can Load five deliveries each, to sendy and to customers unless show a prompt to make their first deliveries", () => {
    cy.fixture("deliveries").then((delivery) => {
      if (delivery.data.orders.length) {
        cy.get(".deliveries-container-inner").should("be.visible");
      } else {
        cy.get(".deliveries-empty").should("be.visible");
      }
    });
  });
  it("Can navigate to a different page when track order is clicked", () => {
    cy.fixture("deliveries").then((delivery) => {
      if (delivery.data.orders.length) {
        cy.get(".dashboard-deliveries-row-container")
          .eq(0)
          .find(".dashboard-track-order")
          .click();
        cy.log(".dashboard-track-order", delivery.order);
        cy.url().should(
          "include",
          `deliveries/tracking/${delivery.data.orders.order_id}`
        );
      } else {
        cy.get(".deliveries-empty").should("be.visible");
      }
    });
  });
  it("Can compute sellers statistics, (completed pickups, completed orders,failed attempts,low stock and items out of stock)", () => {
    // cy.fixture("deliveriesStatistics").then((user) => {
    //   if (Object.keys(user).length) {
    //     cy.get(".dashboard-welcome-message").contains(user.user.first_name);
    //   }
    // });
    cy.wait("@deliveriesStatistics").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      cy.setTokens();
    });
  });
  it("Can see sellers account balance", () => {
    cy.fixture("userDetails").then((user) => {
      if (Object.keys(user).length) {
        cy.get(".dashboard-welcome-message").contains(user.user.first_name);
      }
    });
  });
  it("Can show call to action buttons (deliver to customer, send for storage, deliver on demand and add products)", () => {});
  it("Can show quick links", () => {});
});
