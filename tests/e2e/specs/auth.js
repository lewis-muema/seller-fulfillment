import { expect } from "chai";

describe("Auth pages", () => {
  it("Signin Card contains the correct text", () => {
    cy.get('[data-textId="signin-card-title"]').contains("Welcome Back");
  });
  it.only("Allows a user to signin and input a correct otp", () => {
    cy.visit("/auth/sign-in");
    cy.authStubs();
    cy.dashboardStubs();
    cy.getByData("signin-email-input").type("dorcas@sendyit.com");
    cy.getByData("signin-submit-button").click();
    cy.wait("@generate").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
      cy.url().should("include", "/auth/otp");
    });
    cy.get(".otp-input").eq(0).type("1");
    cy.get(".otp-input").eq(1).type("2");
    cy.get(".otp-input").eq(2).type("3");
    cy.get(".otp-input").eq(3).type("4");
    cy.getByData("signin-with-otp").click();
    cy.wait("@sign-in").then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
    cy.wait("@userDetails");
    cy.setTokens();
    // cy.wait("@achievements");
    // cy.wait("@business");
    // cy.wait("@consignmentStatistics");
    // cy.wait("@deliveries");
    // cy.wait("@deliveriesStatistics");
    // cy.wait("@languages");
    // cy.wait("@notifications");
    // cy.wait("@payments");
    // cy.wait("@productStatistics");
    // cy.wait("@statisticsLimit");
    // cy.wait("@wallet");
    // cy.visit("/");
    cy.url().should("include", "/");
  });
  it("Does not allow invalid email address", () => {
    cy.getByData("signin-email-input").type("test");
    cy.getByData("signin-submit-button").click();
    cy.wait(2000);
    cy.getByData("signin-error-message").should("exist");
  });
  it("Signup Card contains the correct text", () => {
    cy.get('[data-textId="signup-card-title"]').contains(
      "Sign up for Sendy Fulfillment"
    );
  });
  it("Allows a user to signup with correct otp", () => {
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
