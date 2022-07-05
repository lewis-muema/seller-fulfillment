<template>
  <div class="invite-container">
    <div>
      <img
        src="https://images.sendyit.com/fulfilment/seller/sendy_logo.png"
        alt="logo"
        class="invite-logo"
      />
    </div>
    <div class="invite-fields-container">
      <v-select
        class="invite-lang-field"
        :items="getLanguages"
        v-model="defaultLanguage"
        outlined
      ></v-select>
      <p class="invite-title">
        {{ $t("external.Join", { business }) }}
      </p>
      <label for="name" class="invite-label">
        {{ $t("external.name") }}
      </label>
      <v-text-field
        class="invite-field"
        id="name"
        v-model="name"
        :label="$t('external.nameOfBusiness')"
        variant="outlined"
        clearable
        clear-icon="mdi-close"
      ></v-text-field>
      <label for="email-address" class="invite-label">
        {{ $t("external.emailAddress") }}
      </label>
      <v-text-field
        class="invite-field"
        id="email-address"
        v-model="emailAddress"
        variant="outlined"
        clearable
        clear-icon="mdi-close"
      ></v-text-field>
      <label for="phone-number" class="invite-label">
        {{ $t("external.phoneNumber") }}
      </label>
      <vue-tel-input
        v-bind="getSendyPhoneProps"
        class="invite-phone"
        id="phone-number"
        v-model="phone"
        mode="international"
      ></vue-tel-input>
      <v-btn class="invite-save">
        {{ $t("external.setUpAccount") }}
      </v-btn>
      <div class="invite-google-auth">
        <p>{{ $t("external.or") }}</p>
        <googleAuth />
      </div>
    </div>
  </div>
</template>

<script>
import googleAuth from "../common/googleAuth.vue";
import { mapMutations, mapGetters } from "vuex";

export default {
  components: {
    googleAuth,
  },
  watch: {
    defaultLanguage(val) {
      this.setDefaultLanguage(val);
    },
  },
  data() {
    return {
      active: "invite",
      lang: false,
      defaultLanguage: "en",
      business: "Smart collections",
      name: "",
      emailAddress: "",
      phone: "",
    };
  },
  computed: {
    ...mapGetters(["getDefaultLanguage", "getLanguages", "getSendyPhoneProps"]),
  },
  mounted() {
    this.defaultLanguage = this.getDefaultLanguage;
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setDefaultLanguage"]),
  },
};
</script>

<style>
.invite-logo {
  height: 60px;
  margin-left: 60px;
}
.invite-container {
  margin-top: 40px;
}
.invite-fields-container {
  width: 30%;
  margin: auto;
  padding: 25px 70px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
}
.invite-navigation-bar {
  width: 50%;
  margin-left: auto;
}
.invite-body {
  border-left: 1px solid #c0c4cc;
}
.invite-navigation-bar-item {
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-radius: 5px;
  cursor: pointer;
}
.invite-field {
  zoom: 90%;
}
.invite-phone {
  height: 50px;
  margin-bottom: 15px;
}
.invite-save {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
.invite-active-nav {
  border: 1px solid #dcdfe6;
  border-right: 5px solid #324ba8;
}
.invite-lang-field {
  width: inherit;
  margin-left: auto;
}
.invite-lang-field .v-input__control {
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  --v-input-padding-top: 10px;
}
.invite-lang-field .v-input__control .v-field .v-field__field {
  min-height: 35px;
  padding: 5px;
}
.invite-title {
  font-size: 25px;
  font-weight: 500;
  line-height: 25px;
  letter-spacing: -0.5px;
  margin-bottom: 40px;
}
.invite-google-auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
