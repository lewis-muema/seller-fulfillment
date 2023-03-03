import { isValidUrl } from "@/utils/text-validation";
import { expect } from "chai";

describe("isValidUrl", () => {
  it("Should able to detect valid urls", () => {
    expect(isValidUrl("https://www.google.com")).to.be.true;
    expect(isValidUrl("http://www.google.com")).to.be.true;
    expect(isValidUrl("http://ww-adfw.google.com")).to.be.true;
    expect(isValidUrl("https://ww-adfw.google.com/12324/121221")).to.be.true;
    expect(isValidUrl("http://ww-adfw.google.com/12324/")).to.be.true;
  });

  it("Should able to detect invalid urls", () => {
    expect(isValidUrl("www.google.com/1341")).to.not.be.true;
    expect(isValidUrl("www.google.com")).to.not.be.true;
    expect(isValidUrl("www.google")).to.not.be.true;
    expect(isValidUrl("http://www.google")).to.not.be.true;
    expect(isValidUrl("google.com")).to.not.be.true;
    expect(isValidUrl("go-ogle.com")).to.not.be.true;
  });
});
