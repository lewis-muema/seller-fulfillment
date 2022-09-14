describe("Signin Page", () => {
  beforeEach(() => {
    cy.visit("/auth/sign-in");
  });
  it("Card contains the correct text", () => {
    cy.get('[data-textId="signin-card-title"]').contains("Welcome Back");
  });
  it("Allows a user to signin with a valid email address", () => {
    cy.getByData("signin-email-input").type("dorcas@sendyit.com");
    cy.getByData("signin-submit-button").click();
    cy.wait(2000);
    cy.location().should(function (location) {
      expect(location.pathname).to.eq("/auth/otp");
    });
  });
  it.only("Does not allow invalid email address", () => {
    cy.getByData("signin-email-input").type("test");
    cy.getByData("signin-submit-button").click();
    cy.wait(2000);
    cy.getByData("signin-error-message").should("exist");
  });
});
