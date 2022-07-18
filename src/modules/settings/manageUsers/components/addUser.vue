<template>
  <div>
    <div class="addUser-container">
      <div class="addUser-top-bar">
        <i @click="$router.go(-1)" class="mdi mdi-arrow-left addUser-back"></i>
        <span>{{ $t("settings.addAUser") }}</span>
      </div>
      <div>
        <label for="name" class="addUser-label">
          {{ $t("settings.firstName") }}
        </label>
        <v-text-field
          class="addUser-field"
          id="name"
          :label="$t('settings.enterName')"
          v-model="firstName"
          variant="outlined"
          clearable
          clear-icon="mdi-close"
          :disabled="buttonLoader"
        ></v-text-field>
        <label for="name" class="addUser-label">
          {{ $t("settings.lastName") }}
        </label>
        <v-text-field
          class="addUser-field"
          id="name"
          :label="$t('settings.enterName')"
          v-model="lastName"
          variant="outlined"
          clearable
          clear-icon="mdi-close"
          :disabled="buttonLoader"
        ></v-text-field>
        <label for="phone" class="addUser-label">
          {{ $t("settings.phoneNumber") }}
        </label>
        <vue-tel-input
          class="addUser-field personalInfo-phone mb-4"
          id="phone"
          :label="$t('settings.phoneNumber')"
          v-bind="getSendyPhoneProps"
          v-model="phone"
          :disabled="buttonLoader"
        ></vue-tel-input>
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
          clear-icon="mdi-close"
          :disabled="buttonLoader"
        ></v-text-field>
        <label for="user-role" class="addUser-label">
          {{ $t("settings.userRole") }}
        </label>
        <el-select
          class="mb-6 business-details-industry"
          id="user-role"
          v-model="defaultRole"
          :disabled="buttonLoader"
        >
          <el-option
            v-for="role in roles"
            :key="role.value"
            :label="role.label"
            :value="role.value"
          >
          </el-option>
        </el-select>
        <v-btn
          class="addUser-save"
          @click="submitUser()"
          v-loading="buttonLoader"
        >
          {{ $t("settings.saveChanges") }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      firstName: "",
      lastName: "",
      emailAddress: "",
      defaultRole: "",
      phone: "",
      buttonLoader: false,
      roles: [
        {
          label: this.$t("settings.admin"),
          value: "ROLE_ADMIN",
        },
        {
          label: this.$t("settings.user"),
          value: "ROLE_ASSISTANT",
        },
      ],
    };
  },
  mounted() {
    this.setComponent("settings.addAUser");
  },
  computed: {
    ...mapGetters(["getStorageUserDetails", "getSendyPhoneProps"]),
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
    ...mapActions(["requestAxiosPost"]),
    submitUser() {
      if (
        this.firstName &&
        this.lastName &&
        this.defaultRole &&
        this.emailAddress &&
        this.phone
      ) {
        const payload = {
          first_name: this.firstName,
          last_name: this.lastName,
          user_role: this.defaultRole,
          phone_number: this.phone,
          email: this.emailAddress,
        };
        this.buttonLoader = true;
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `/seller/${this.getStorageUserDetails.business_id}/admin/users`,
          values: payload,
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            this.$router.push(
              `/settings/user-permissions/${response.data.data.user.user_id}`
            );
          } else {
            ElNotification({
              title: response.response.data.errors[0].message.replaceAll(
                ".",
                " "
              ),
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
.addUser-container {
  width: 35%;
  margin: 60px auto;
  padding: 3% 5%;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  background: white;
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
