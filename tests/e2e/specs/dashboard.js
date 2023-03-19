describe("Dashboard screens", () => {
  it.only("Can show the welcome screen after a successful signup/login", () => {
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
  it("Can see the sidebar on the dashboard screen,  ", () => {});
  it("Can Load five deliveries each, to sendy and to customers unless show a prompt to make their first deliveries", () => {});
  it("Can compute sellers statistics, (completed pickups, completed orders,failed attempts,low stock and items out of stock)", () => {});
  it("Can see sellers account balance", () => {});
  it("Can show call to action buttons (deliver to customer, send for storage, deliver on demand and add products)", () => {});
  it("Can show quick links", () => {});
});
