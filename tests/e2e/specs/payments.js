// describe("Transactions module", () => {
//   it.only("loads the date range components", () => {
//     cy.setToken();
//     cy.crossDockingStubs();
//     cy.dashboardStubs();
//     cy.authStubs();
//     cy.paymentStubs();
//     cy.visit("/payments/transactions");
//     cy.get(".el-date-editor--daterange").should("be.visible");
//   });
//   it.only("Loads the transaction page and fetches information else shows the warning description of no transactions available", () => {
//     cy.fixture("transactions").then((transaction) => {
//       if (transaction.data.transactions.length) {
//         cy.get(".transactions-top-recent-list-container")
//           .find(".transactions-top-recent-list")
//           .should("be.visible");
//       } else {
//         cy.get(".deliveries-empty").should("be.visible");
//       }
//     });
//   });
//   it.only("Show make payment card popup when the active cycle is true", () => {
//     cy.fixture("paymentRequired").then((payment) => {
//       if (payment.message === "billing.cycle.list.success") {
//         cy.get(".statements-payment-banner").should("be.visible");
//       } else {
//         cy.get(".statements-payment-banner").should("not.exist");
//       }
//     });
//   });
//   it.only("Show pending payment collections count when a payment hasn't been made", () => {
//     cy.fixture("statistics").then((stat) => {
//       if (stat.message === "transactions.list.success") {
//         cy.get(".statistics-pending-badge").eq(17);
//       } else {
//         cy.get(".statistics-pending-badge").eq(0);
//       }
//     });
//   });
//   it.only("navigate to a different page when a transaction is clicked else shows the warning description of no transactions available", () => {
//     cy.fixture("transactions").then((transaction) => {
//       if (transaction.data.transactions.length) {
//         cy.get(".transactions-top-recent-list-container")
//           .find(".transactions-top-recent-list")
//           .eq(0)
//           .click();
//         cy.url().should("include", "/payments/transaction-details");
//       } else {
//         cy.get(".deliveries-empty").should("be.visible");
//       }
//     });
//   });
// });
// describe("Wallets module", () => {
//   it.only("the wallet balance should have a value", () => {
//     cy.setToken();
//     cy.crossDockingStubs();
//     cy.dashboardStubs();
//     cy.authStubs();
//     cy.paymentStubs();
//     cy.visit("/payments/wallet");
//     cy.get(".transactions-top-amount").should("not.be.null");
//   });
//   it.only("Loads the wallet page and fetches information else shows the warning description of no transactions available", () => {
//     cy.fixture("transactions").then((transaction) => {
//       if (transaction.data.transactions.length) {
//         cy.get(".transactions-top-recent-list-container")
//           .find(".transactions-top-recent-list")
//           .should("be.visible");
//       } else {
//         cy.get(".deliveries-empty").should("be.visible");
//       }
//     });
//   });
//   it.only("Show the makepayment popup when the active cycle is true", () => {
//     cy.setToken();
//     cy.crossDockingStubs();
//     cy.dashboardStubs();
//     cy.paymentStubs();
//     cy.visit("/payments/wallet");
//     cy.fixture("paymentRequired").then((payment) => {
//       if (payment.message === "billing.cycle.list.success") {
//         cy.get(".statements-payment-banner").should("be.visible");
//       } else {
//         cy.get(".statements-payment-banner").should("not.exist");
//       }
//     });
//   });
//   it.only("Show pending payment collections count when a payment hasn't been made", () => {
//     cy.fixture("statistics").then((stat) => {
//       if (stat.message === "transactions.list.success") {
//         cy.get(".statistics-pending-badge").eq(17);
//       } else {
//         cy.get(".statistics-pending-badge").eq(0);
//       }
//     });
//   });
//   it.only("Shows navigate to a different page when a transaction is clicked else shows the warning description of no transactions available", () => {
//     cy.fixture("transactions").then((transaction) => {
//       if (transaction.data.transactions.length) {
//         cy.get(".transactions-top-recent-list-container")
//           .find(".transactions-top-recent-list")
//           .eq(0)
//           .click();
//         cy.url().should("include", "/payments/transaction-details");
//       } else {
//         cy.get(".deliveries-empty").should("be.visible");
//       }
//     });
//   });
// });
