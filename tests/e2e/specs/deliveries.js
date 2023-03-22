import { expect } from "chai";

const timeout = 30000;
describe("Consignment modules", () => {
  it("can load consignment deliveries unless show deliveries not found", () => {
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
  it("can compute consignment statistics of orders e.g completed, in transit", () => {
    cy.wait("@consignmentStatistics", { timeout }).then((consignmentStat) => {
      expect(consignmentStat.response.statusCode).to.equal(200);
      if (Object.keys(consignmentStat.response.body.data).length) {
        let pendingCount = (
          parseInt(
            consignmentStat.response.body.data.grouped_by_status_count
              .ORDER_RECEIVED
          ) +
          parseInt(
            consignmentStat.response.body.data.grouped_by_status_count
              .ORDER_IN_PROCESSING
          )
        ).toString();

        let inTransitCount =
          consignmentStat.response.body.data.grouped_by_status_count.ORDER_IN_TRANSIT.toString();

        let failedCount =
          consignmentStat.response.body.data.grouped_by_status_count.ORDER_FAILED.toString();

        let completedCount =
          consignmentStat.response.body.data.grouped_by_status_count.ORDER_COMPLETED.toString();

        let canceledCount =
          consignmentStat.response.body.data.grouped_by_status_count.ORDER_CANCELED.toString();
        cy.get(".pending-badge").contains(pendingCount);
        cy.get(".inTransit-badge").contains(inTransitCount);
        cy.get(".failed-badge").contains(failedCount);
        cy.get(".completed-badge").contains(completedCount);
        cy.get(".cancelled-badge").contains(canceledCount);
      }
    });
  });
  it("can search for an order on the search bar", () => {
    cy.get(".v-field__input").type("Dorcas");
  });
  it("can export different consignment deliveries", () => {
    cy.get(".consignment-export-button")
      .click()
      .get(".click-to-export-button")
      .click();
    cy.wait("@export", { timeout }).then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });
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
