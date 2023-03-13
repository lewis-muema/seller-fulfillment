describe("point to point deliveries", () => {
  it.only("can list all point to point deliveries", () => {
    cy.setToken();
    cy.crossDockingStubs();
    cy.dashboardStubs();
    cy.authStubs();
    cy.visit("deliveries/direct-deliveries");
    cy.fixture("pointToPoint").then((delivery) => {
      if (delivery.data.orders.length) {
        cy.getByData("point-to-point-list-container").should("be.visible");
      } else {
        cy.getByData("no-point-point-deliveries").should("be.visible");
      }
    });
  });
  it.only("can view one point to point deliveries", () => {
    cy.setToken();
    cy.crossDockingStubs();
    cy.dashboardStubs();
    cy.authStubs();
    cy.visit("deliveries/direct-deliveries");
    cy.fixture("pointToPoint").then((delivery) => {
      if (delivery.data.orders.length) {
        cy.getByData("point-to-point-list-container").should("be.visible");
      } else {
        cy.getByData("no-point-point-deliveries").should("be.visible");
      }
    });
  });
});
