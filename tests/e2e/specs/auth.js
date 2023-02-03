describe("Signin Page", () => {
  beforeEach(() => {
    cy.visit("/auth/sign-in");
  });
  it("Signin Card contains the correct text", () => {
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
  it("Does not allow invalid email address", () => {
    cy.getByData("signin-email-input").type("test");
    cy.getByData("signin-submit-button").click();
    cy.wait(2000);
    cy.getByData("signin-error-message").should("exist");
  });
});
describe("SignupPage", () => {
  beforeEach(() => {
    cy.visit("/auth/sign-up");
  });
  it("Signup Card contains the correct text", () => {
    cy.get('[data-textId="signup-card-title"]').contains(
      "Sign up for Sendy Fulfillment"
    );
  });
  it.only("Allows a user to signup with correct parameters", () => {
    const userData = {
      businessName: "Test Business",
      businessEmail: "dorcas@sendyit.com",
      country: "KENYA",
    };
    cy.getByData("signup-business-name").type(userData.businessName);
    cy.getByData("signup-business-email").type(userData.businessEmail);
    cy.getByData("signup-country").click();
    cy.getByData("signup-country-option").each(($ele) => {
      if ($ele.text() == "KENYA") {
        cy.wrap($ele).click();
      }
    });
    cy.getByData("signup-submit-button").click();
    cy.wait(2000);
    cy.location().should(function (location) {
      expect(location.pathname).to.eq("/auth/otp");
    });
  });
});
