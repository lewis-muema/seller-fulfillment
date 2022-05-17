<template>
  <div>
    <div class="addUser-container">
      <div class="addUser-top-bar">
        <i @click="$router.go(-1)" class="mdi mdi-arrow-left addUser-back"></i>
        <span>{{ $t("settings.addAUser") }}</span>
      </div>
      <div>
        <label for="name" class="addUser-label">
          {{ $t("settings.name") }}
        </label>
        <v-text-field
          class="addUser-field"
          id="name"
          :label="$t('settings.enterName')"
          v-model="name"
          variant="outlined"
          clearable
          clear-icon="mdi-cancel"
        ></v-text-field>
        <label for="email-address" class="addUser-label">
          {{ $t("settings.emailAddress") }}
        </label>
        <v-text-field
          class="addUser-field"
          id="email-address"
          :label="$t('settings.emailAddress')"
          v-model="emailAddress"
          variant="outlined"
          clearable
          clear-icon="mdi-cancel"
        ></v-text-field>
        <label for="user-role" class="addUser-label">
          {{ $t("settings.userRole") }}
        </label>
        <v-select
          class="addUser-select"
          id="user-role"
          label="Select"
          :items="roles"
          v-model="defaultRole"
          outlined
        ></v-select>
        <v-btn class="addUser-save">
          {{ $t("settings.saveChanges") }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      emailAddress: "",
      defaultRole: "",
      roles: [this.$t("settings.admin"), this.$t("settings.user")],
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("settings.addAUser"));
  },
};
</script>

<style>
.addUser-container {
  width: 35%;
  margin: 60px auto;
  padding: 3% 5%;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
}
.addUser-label {
  font-size: 14px;
  font-weight: 500;
}
.addUser-field {
  zoom: 90%;
}
.addUser-phone {
  height: 50px;
}
.addUser-select .v-input__control {
  border: 1px solid #c5c5c5;
  border-radius: 5px;
}
.addUser-save {
  width: 100%;
  margin-top: 20px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
.addUser-top-bar {
  height: 40px;
  align-items: center;
  display: flex;
  margin-bottom: 10px;
}
.addUser-back {
  font-size: 25px;
  cursor: pointer;
  margin-right: 10px;
}
</style>
