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
  it("can cancel an order to a later date ", () => {
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
            cy.get(".tracking-option-content").eq(1).click();
            cy.get(".dont-cancel-text").click();
            cy.get("cancel-options-contain").should("not.be.visible");
          }
        );
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
});
describe("deliveries modules", () => {
  it("can load  deliveries unless show deliveries not found", () => {
    cy.setToken();
    cy.dashboardStubs();
    cy.crossDockingStubs();
    cy.paymentStubs();
    cy.authStubs();
    cy.deliveriesStubs();
    cy.visit("deliveries/customer");
    cy.wait("@deliveries", { timeout }).then((delivery) => {
      expect(delivery.response.statusCode).to.equal(200);
      if (delivery.response.body.data.orders.length) {
        cy.get(".deliveries-to-customers-container").should("be.visible");
      } else {
        cy.get(".no-deliveries-to-customers-container").should("be.visible");
      }
    });
  });
  it("can compute consignment statistics of orders e.g completed, in transit", () => {
    cy.wait("@deliveriesStatistics", { timeout }).then((deliveryStat) => {
      expect(deliveryStat.response.statusCode).to.equal(200);
      if (Object.keys(deliveryStat.response.body.data).length) {
        let pendingCount = (
          parseInt(
            deliveryStat.response.body.data.grouped_by_status_count
              .ORDER_RECEIVED
          ) +
          parseInt(
            deliveryStat.response.body.data.grouped_by_status_count
              .ORDER_IN_PROCESSING
          )
        ).toString();

        let inTransitCount =
          deliveryStat.response.body.data.grouped_by_status_count.ORDER_IN_TRANSIT.toString();

        let failedCount =
          deliveryStat.response.body.data.grouped_by_status_count.ORDER_FAILED.toString();

        let completedCount =
          deliveryStat.response.body.data.grouped_by_status_count.ORDER_COMPLETED.toString();

        let canceledCount =
          deliveryStat.response.body.data.grouped_by_status_count.ORDER_CANCELED.toString();
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
  it("can show `Deliver to customer` button and redirect to a different page on click", () => {
    cy.get(".customers-deliver-btn")
      .contains("Deliver to a customer")
      .click()
      .url()
      .should("include", "inventory/create-delivery");
  });
  it("can show details of one order when `track order` link is clicked e.g delivery,recipient info, products", () => {
    cy.wait("@deliveries", { timeout }).then((delivery) => {
      expect(delivery.response.statusCode).to.equal(200);
      if (delivery.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".delivery-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${delivery.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingDelivery", { timeout }).then((trackDelivery) => {
          expect(trackDelivery.response.statusCode).to.equal(200);
          cy.get(".delivery-info-desc").contains(
            trackDelivery.response.body.data.order.destination.delivery_location
              .description
          );
          cy.get(".delivery-house-location").contains(
            trackDelivery.response.body.data.order.destination.house_location
          );
          cy.get(".delivery-info-instruction").contains(
            trackDelivery.response.body.data.order.destination
              .delivery_instructions
          );
          cy.get(".delivery-info-recipient-name").contains(
            trackDelivery.response.body.data.order.destination.name
          );
          cy.get(".delivery-info-recipient-number").contains(
            trackDelivery.response.body.data.order.destination.phone_number
          );
        });
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it("can display linked orders for cross-docked orders ", () => {
    cy.wait("@deliveries", { timeout }).then((delivery) => {
      expect(delivery.response.statusCode).to.equal(200);
      if (delivery.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".delivery-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${delivery.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingDelivery", { timeout }).then((trackDelivery) => {
          expect(trackDelivery.response.statusCode).to.equal(200);
          if (
            trackDelivery.response.body.data.order.cross_dock_linked_orders[0]
              .order_type === "PICKUP"
          ) {
            cy.get(".tracking-crossdocked-pickup-banner").should("be.visible");
          } else {
            cy.get(".tracking-crossdocked-pickup-banner").should(
              "not.be.visible"
            );
          }
        });
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it("can display order number of one particular order ", () => {
    cy.wait("@deliveries", { timeout }).then((delivery) => {
      expect(delivery.response.statusCode).to.equal(200);
      if (delivery.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".delivery-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${delivery.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingDelivery", { timeout }).then((trackDelivery) => {
          expect(trackDelivery.response.statusCode).to.equal(200);
          cy.get(".tracking-pickup-order-id").contains(
            trackDelivery.response.body.data.order.order_id
          );
        });
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it("can edit an order when its still on transit and disable editting when an order has been completed", () => {
    //capture non editable fields later
    cy.wait("@deliveries", { timeout }).then((delivery) => {
      expect(delivery.response.statusCode).to.equal(200);
      if (delivery.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".delivery-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${delivery.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingDelivery", { timeout }).then((trackDelivery) => {
          expect(trackDelivery.response.statusCode).to.equal(200);
          cy.get(".mdi-pencil-edit-delivery-info")
            .click()
            .get(".destination-delivery-instructions")
            .type("leave at the door")
            .get(".submit-delivery-button")
            .click();
          cy.wait("@updateDeliveryOrder", { timeout }).then((order) => {
            expect(order.response.statusCode).to.equal(200);
          });
        });
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
  it.only("can cancel an order to a later date ", () => {
    cy.wait("@deliveries", { timeout }).then((delivery) => {
      expect(delivery.response.statusCode).to.equal(200);
      if (delivery.response.body.data.orders.length) {
        cy.get(".deliveries-table-column")
          .eq(0)
          .find(".delivery-order-id-component")
          .click();
        cy.url().should(
          "include",
          `deliveries/tracking/${delivery.response.body.data.orders[0].order_id}`
        );
        cy.wait("@trackingDelivery", { timeout }).then((trackDelivery) => {
          expect(trackDelivery.response.statusCode).to.equal(200);
          cy.get(".tracking-option-content").eq(2).click();
          cy.get(".dont-cancel-text").click();
          cy.get("cancel-options-contain").should("not.be.visible");
        });
      } else {
        cy.get(".no-deliveries-to-sendy-container").should("be.visible");
      }
    });
  });
});
describe("on demand modules", () => {});
