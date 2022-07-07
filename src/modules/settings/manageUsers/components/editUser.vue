<template>
  <div>
    <div class="edit-user-container">
      <div class="edit-user-top-bar">
        <i
          @click="$router.go(-1)"
          class="mdi mdi-arrow-left edit-user-back"
        ></i>
        <span>{{ $t("settings.editUser") }}</span>
      </div>
      <div>
        <label for="name" class="edit-user-label">
          {{ $t("settings.name") }}
        </label>
        <v-text-field
          class="edit-user-field"
          id="name"
          :label="$t('settings.enterName')"
          v-model="name"
          variant="outlined"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
        <label for="phone" class="edit-user-label">
          {{ $t("settings.phoneNumber") }}
        </label>
        <vue-tel-input
          v-bind="getSendyPhoneProps"
          class="edit-user-field-phone"
          id="phone"
          v-model="phone"
          mode="international"
        ></vue-tel-input>
        <label for="email-address" class="edit-user-label">
          {{ $t("settings.emailAddress") }}
        </label>
        <v-text-field
          class="edit-user-field"
          id="email-address"
          :label="$t('settings.emailAddress')"
          v-model="emailAddress"
          variant="outlined"
          disabled
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
        <v-btn class="edit-user-save">
          {{ $t("deliveries.submit") }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      name: "",
      emailAddress: "",
      defaultRole: "",
      roles: [this.$t("settings.admin"), this.$t("settings.user")],
      phone: "",
    };
  },
  computed: {
    ...mapGetters(["getSendyPhoneProps"]),
  },
  mounted() {
    this.setComponent("settings.addAUser");
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
  },
};
</script>

<style>
.edit-user-container {
  width: 35%;
  margin: 60px auto;
  padding: 3% 5%;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
}
.edit-user-label {
  font-size: 14px;
  font-weight: 500;
}
.edit-user-field {
  zoom: 90%;
}
.edit-user-phone {
  height: 50px;
}
.edit-user-select .v-input__control {
  border: 1px solid #c5c5c5;
  border-radius: 5px;
}
.edit-user-save {
  width: 100%;
  margin-top: 20px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
.edit-user-top-bar {
  height: 40px;
  align-items: center;
  display: flex;
  margin-bottom: 10px;
}
.edit-user-back {
  font-size: 25px;
  cursor: pointer;
  margin-right: 10px;
}
.edit-user-field-phone {
  height: 50px;
  margin-bottom: 40px;
}
</style>
