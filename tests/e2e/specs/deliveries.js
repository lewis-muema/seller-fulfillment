import { expect } from "chai";

const timeout = 30000;
describe("Consignment modules", () => {
  it("can load consignment deliveries unless show deliveries not found", () => {
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
    cy.wait("@exportTasks", { timeout }).then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
  });
  it("can show `send inventory to sendy` button and redirect to a different page on click", () => {
    cy.get(".customers-deliver-btn")
      .contains("Send Inventory to Sendy")
      .click()
      .url()
      .should("include", "inventory/add-pickup-products");
  });
  it("can show details of one order when `track order` link is clicked e.g delivery,recipient info, products", () => {
    cy.wait("@consignments", { timeout }).then((consignment) => {
      expect(consignment.response.statusCode).to.equal(200);
      if (consignment.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".consignment-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${consignment.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingConsignment", { timeout }).then(
          (trackConsignment) => {
            expect(trackConsignment.response.statusCode).to.equal(200);
            cy.get(".pickup-info-desc").contains(
              trackConsignment.response.body.data.order.destination
                .delivery_location.description
            );
            cy.get(".pickup-info-instructions").contains(
              trackConsignment.response.body.data.order.destination
                .delivery_instructions
            );
            cy.get(".pickup-info-phone-number").contains(
              trackConsignment.response.body.data.order.destination.phone_number
            );
          }
        );
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it("can display linked orders for cross-docked orders ", () => {
    cy.wait("@consignments", { timeout }).then((consignment) => {
      expect(consignment.response.statusCode).to.equal(200);
      if (consignment.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".consignment-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${consignment.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingConsignment", { timeout }).then(
          (trackConsignment) => {
            expect(trackConsignment.response.statusCode).to.equal(200);
            if (
              trackConsignment.response.body.data.order
                .cross_dock_linked_orders[0].order_type === "DELIVERY"
            ) {
              cy.get(".tracking-crossdocked-pickup-banner").should(
                "be.visible"
              );
            } else {
              cy.get(".tracking-crossdocked-pickup-banner").should(
                "not.be.visible"
              );
            }
          }
        );
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it("can display order number of one particular order ", () => {
    cy.wait("@consignments", { timeout }).then((consignment) => {
      expect(consignment.response.statusCode).to.equal(200);
      if (consignment.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".consignment-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${consignment.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingConsignment", { timeout }).then(
          (trackConsignment) => {
            expect(trackConsignment.response.statusCode).to.equal(200);
            cy.get(".tracking-pickup-order-id").contains(
              trackConsignment.response.body.data.order.order_id
            );
          }
        );
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it("can edit an order when its still on transit and disable editting when an order has been completed", () => {
    //capture non editable fields later
    cy.wait("@consignments", { timeout }).then((consignment) => {
      expect(consignment.response.statusCode).to.equal(200);
      if (consignment.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".consignment-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${consignment.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingConsignment", { timeout }).then(
          (trackConsignment) => {
            expect(trackConsignment.response.statusCode).to.equal(200);
            cy.get(".mdi-pencil-edit-pickup-info")
              .click()
              .get(".destination-pickup-instructions")
              .type("leave at the door")
              .get(".submit-pickup-button")
              .click();
            cy.wait("@updateConsignmentOrder", { timeout }).then((order) => {
              expect(order.response.statusCode).to.equal(200);
            });
          }
        );
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it("can reschedule an order to a later date ", () => {
    cy.setToken();
    cy.dashboardStubs();
    cy.crossDockingStubs();
    cy.paymentStubs();
    cy.authStubs();
    cy.deliveriesStubs();
    cy.visit("deliveries/sendy");
  });
  it("can cancel orders when its still on transit and disable cancelling when an order has been completed ", () => {});
});
describe("deliveries modules", () => {});
describe("on demand modules", () => {});
