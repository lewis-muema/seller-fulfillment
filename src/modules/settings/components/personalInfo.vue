<template>
  <div class="personalInfo-container">
    <label for="first-name" class="personalInfo-label">
      {{ $t("settings.firstName") }}
    </label>
    <v-text-field
      class="personalInfo-field"
      id="first-name"
      v-model="firstName"
      variant="outlined"
      clearable
      clear-icon="mdi-cancel"
    ></v-text-field>
    <label for="last-name" class="personalInfo-label">
      {{ $t("settings.lastName") }}
    </label>
    <v-text-field
      class="personalInfo-field"
      id="last-name"
      v-model="lastName"
      variant="outlined"
      clearable
      clear-icon="mdi-cancel"
    ></v-text-field>
    <label for="email-address" class="personalInfo-label">
      {{ $t("settings.emailAddress") }}
    </label>
    <v-text-field
      class="personalInfo-field"
      id="email-address"
      v-model="emailAddress"
      variant="outlined"
      disabled
      clearable
      clear-icon="mdi-cancel"
    ></v-text-field>
    <label for="phone-number" class="personalInfo-label">
      {{ $t("settings.yourPhoneNumber") }}
    </label>
    <vue-tel-input
      class="personalInfo-phone"
      id="phone-number"
      v-model="phone"
      mode="international"
    ></vue-tel-input>
    <v-btn class="personalInfo-save">
      {{ $t("settings.saveChanges") }}
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: "James",
      lastName: "Doe",
      emailAddress: "Jamesjoe@gmail.com",
      phone: "+254709779779",
    };
  },
};
</script>

<style>
.personalInfo-container {
  width: 50%;
  padding: 10px 60px;
}
.personalInfo-label {
  font-size: 14px;
  font-weight: 500;
}
.personalInfo-field {
  zoom: 90%;
}
.personalInfo-phone {
  height: 50px;
}
.personalInfo-save {
  width: 100%;
  margin-top: 20px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
</style>
