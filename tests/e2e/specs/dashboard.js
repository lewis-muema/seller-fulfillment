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
        //recheck this tests
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
  it("Can compute deliveries statistics, (completed pickups, completed orders,failed attempts)", () => {
    cy.fixture("deliveriesStatistics").then((stat) => {
      if (Object.keys(stat).length) {
        cy.get(".dashboard-side-card-status")
          .eq(0)
          .contains("Completed pickups");
        cy.get(".dashboard-side-card-status")
          .eq(1)
          .contains("Completed orders");
        cy.get(".dashboard-side-card-status").eq(2).contains("Failed Attempts");

        cy.get(".dashboard-side-card-count")
          .eq(0)
          .contains(stat.data.grouped_by_status_count.ORDER_COMPLETED);
        cy.get(".dashboard-side-card-count")
          .eq(1)
          .contains(stat.data.grouped_by_status_count.ORDER_COMPLETED);
        cy.get(".dashboard-side-card-count")
          .eq(2)
          .contains(stat.data.grouped_by_status_count.ORDER_FAILED);
      }
    });
  });
  it("Can compute deliveries stock levels, (low stock levels,items out of stock)", () => {
    cy.fixture("productStatistics").then((productStatistic) => {
      if (Object.keys(productStatistic).length) {
        cy.get(".dashboard-side-card-status").eq(3).contains("Low stock items");
        cy.get(".dashboard-side-card-status")
          .eq(4)
          .contains("Items out of Stock");
        cy.get(".dashboard-side-card-count")
          .eq(3)
          .contains(
            productStatistic.data.grouped_by_stock_level_count
              .low_stock_products
          );
        cy.get(".dashboard-side-card-count")
          .eq(4)
          .contains(
            productStatistic.data.grouped_by_stock_level_count
              .out_of_stock_products
          );
      }
    });
  });
  it.only("Can see sellers account balance", () => {
    cy.fixture("wallets").then((wallet) => {
      if (wallet.data.wallets.length) {
        cy.get(".dashboard-wallet-balance").should("not.be.null");
      }
    });
  });
  it.only("Can show call to action buttons (deliver to customer, send for storage, deliver on demand and add products)", () => {
    cy.get(".desktop-quick-links-tabs")
      .eq(0)
      .get(".quick-links-tabs-text")
      .contains("Deliver to Customer");
    cy.get(".desktop-quick-links-tabs")
      .eq(1)
      .get(".quick-links-tabs-text")
      .contains("Send for storage");
    // cy.get(".desktop-quick-links-tabs")
    //   .eq(2)
    //   .get(".quick-links-tabs-text")
    //   .contains("Deliver on demand");
    cy.get(".desktop-quick-links-tabs")
      .eq(2)
      .get(".quick-links-tabs-text")
      .contains("Add Products");
  });
  it.only("redirect `deliver to customer` action button to a different page when their no active payment unless show the make payment banner", () => {
    cy.fixture("paymentRequired").then((payment) => {
      if (payment.message === "billing.cycle.list.success") {
        cy.get(".make-payment-container").should("be.visible");
      } else {
        cy.get(".desktop-quick-links-tabs").eq(0).click();
        cy.url().should("include", `/inventory/create-delivery`);
      }
    });
  });
  it("Can show quick links", () => {});
});
