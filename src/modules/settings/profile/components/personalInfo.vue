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
      :disabled="buttonLoader"
      clearable
      clear-icon="mdi-close"
    ></v-text-field>
    <label for="last-name" class="personalInfo-label">
      {{ $t("settings.lastName") }}
    </label>
    <v-text-field
      class="personalInfo-field"
      id="last-name"
      v-model="lastName"
      variant="outlined"
      :disabled="buttonLoader"
      clearable
      clear-icon="mdi-close"
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
      clear-icon="mdi-close"
    ></v-text-field>
    <label for="phone-number" class="personalInfo-label">
      {{ $t("settings.yourPhoneNumber") }}
    </label>
    <vue-tel-input
      class="personalInfo-phone"
      id="phone-number"
      v-model="phone"
      :disabled="buttonLoader"
      mode="international"
    ></vue-tel-input>
    <v-btn
      class="personalInfo-save"
      v-loading="buttonLoader"
      @click="updateUserDetails()"
    >
      {{ $t("settings.saveChanges") }}
    </v-btn>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      emailAddress: "",
      phone: "",
      buttonLoader: false,
    };
  },
  computed: {
    ...mapGetters(["getUserDetails", "getStorageUserDetails"]),
  },
  mounted() {
    this.getUsersDetails();
  },
  methods: {
    ...mapMutations(["setUserDetails"]),
    ...mapActions(["requestAxiosGet", "requestAxiosPut"]),
    getUsersDetails() {
      this.buttonLoader = true;
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/user`,
      }).then((response) => {
        if (response.status === 200) {
          this.buttonLoader = false;
          this.setUserDetails(response.data.data.user);
          this.setUsersDetails();
        }
      });
    },
    setUsersDetails() {
      this.firstName = this.getUserDetails.first_name;
      this.lastName = this.getUserDetails.last_name;
      this.emailAddress = this.getUserDetails.email;
      this.phone = this.getUserDetails.phone_number;
    },
    updateUserDetails() {
      if (this.firstName && this.lastName && this.phone && this.emailAddress) {
        this.buttonLoader = true;
        this.requestAxiosPut({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/user`,
          values: {
            user_id: this.getUserDetails.user_id,
            first_name: this.firstName,
            last_name: this.lastName,
            phone_number: this.phone,
            email: this.emailAddress,
            tax_identification_number: "",
          },
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            this.setUserDetails(response.data.data.user);
            this.setUsersDetails();
            ElNotification({
              title: this.$t("settings.userDetailsUpdatedSuccessfully"),
              message: "",
              type: "success",
            });
          } else {
            ElNotification({
              title: this.$t("settings.userDetailsUpdateFailed"),
              message: "",
              type: "error",
            });
          }
        });
      } else {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message: this.$t("deliveries.fillInAllFields"),
          type: "warning",
        });
      }
    },
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
.personalInfo-field .v-input__control {
  background: white;
}
.personalInfo-phone {
  height: 50px;
  background: white;
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
