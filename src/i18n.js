import { createI18n } from "vue-i18n";
import axios from "axios";
import moment from "moment";

function loadLocaleMessages() {
  const locales = require.context(
    "../locales/locales/",
    true,
    /[A-Za-z0-9-_,\s]+\.js$/i
  );
  const messages = {};

  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
});

function changeLanguage() {
  window.addEventListener("language-changed", (event) => {
    i18n.locale = event.detail;
    moment.locale(event.detail);
  });
}

// eslint-disable-next-line no-unused-vars
function ipLookUp() {
  const { EXTREME_IP_KEY } = process.env;
  axios(`https://extreme-ip-lookup.com/json/?key=${EXTREME_IP_KEY}`)
    .then((response) => {
      window.dispatchEvent(
        new CustomEvent("country-fetched", { detail: response.data })
      );
      const francoPhoneCountries = ["FR", "CI"].includes(
        response.data.countryCode
      );
      let lang;
      let locale;
      if (francoPhoneCountries) {
        this.$i18n.locale = "fr";
        lang = `fr-${response.data.countryCode}`;
        locale = "fr";
      } else if (response.data.countryCode === "NG") {
        this.$i18n.locale = "en-ng";
        lang = `en-${response.data.countryCode}`;
        locale = "en-ng";
      } else {
        this.$i18n.locale = "en";
        lang = "en-US,en;q=0.9";
        locale = "en";
      }
      localStorage.setItem("buyerTimeLocale", locale);
      localStorage.setItem("buyerLanguage", lang);
      localStorage.setItem("buyerCountryCode", response.data.countryCode);
    })
    .catch((error) => error);
}

changeLanguage();

export default i18n;
