describe("Signin Page", () => {
  beforeEach(() => {
    cy.visit("/auth/sign-in");
  });
  it("Card contains the correct text", () => {
    cy.get('[data-textId="signin-card-title"]').contains("Welcome Back");
  });
  it.only("Allows a user to signin", () => {
    cy.getByData("signin-email-input").type("dorcas@sendyit.com");
    cy.getByData("signin-submit-button").click();
  });
});
