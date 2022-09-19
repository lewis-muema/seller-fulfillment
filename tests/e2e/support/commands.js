Cypress.Commands.add("getByData", (selector) => {
  return cy.get(`[data-test=${selector}]`);
});
Cypress.Commands.add("login", function () {
  cy.visit("/auth/sign-in"); // Load the app in order `cy.window` to work
  cy.window().then((window) => {
    // .then() to make cypress wait until window is available
    cy.wrap(window.store).as("store"); // alias the store (can be accessed like this.store)
    cy.request({
      method: "POST",
      url: "https://authtest.sendyit.com/fulfilment/v1/seller/business/signin",
      body: {
        email: "dorcas@sendyit.com",
      },
    }).then((res) => {
      // You can access store here
      console.log(res);
    });
  });
});
