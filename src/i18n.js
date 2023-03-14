import { createI18n } from "vue-i18n";
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

changeLanguage();

export default i18n;
