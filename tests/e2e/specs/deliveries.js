import { expect } from "chai";

const timeout = 30000;
describe("Consignment modules", () => {
  it.only("can load consignment deliveries unless show deliveries not found", () => {
    cy.setToken();
    cy.dashboardStubs();
    cy.crossDockingStubs();
    cy.authStubs();
    cy.paymentStubs();
    cy.visit("deliveries/sendy");
    cy.wait("@consignments", { timeout }).then((consignment) => {
      expect(consignment.response.statusCode).to.equal(200);
      if (consignment.response.body.data.orders.length) {
        cy.get(".deliveries-to-sendy-container").should("be.visible");
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it("can compute consignment statistics of orders e.g completed, in transit", () => {});
  it("can search for an order on the search bar", () => {});
  it("can export different consignment deliveries", () => {});
  it("can show `send inventory to sendy` button", () => {});
  it("can show details of one order when `track order` link is clicked e.g delivery,recipient info, products", () => {});
  it("can display linked orders for cross-docked orders ", () => {});
  it("can display order number of one particular order ", () => {});
  it("can edit an order when its still on transit and disable editting when an order has been completed", () => {});
  it("can reschedule an order to a later date ", () => {});
  it("can cancel orders when its still on transit and disable cancelling when an order has been completed ", () => {});
});
describe("deliveries modules", () => {});
describe("on demand modules", () => {});
