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
          {{ $t("settings.firstName") }}
        </label>
        <v-text-field
          class="edit-user-field"
          id="name"
          :label="$t('settings.enterName')"
          v-model="firstName"
          variant="outlined"
          clearable
          clear-icon="mdi-close"
          :disabled="buttonLoader"
        ></v-text-field>
        <label for="name" class="edit-user-label">
          {{ $t("settings.lastName") }}
        </label>
        <v-text-field
          class="edit-user-field"
          id="name"
          :label="$t('settings.enterName')"
          v-model="lastName"
          variant="outlined"
          clearable
          clear-icon="mdi-close"
          :disabled="buttonLoader"
        ></v-text-field>
        <label for="phone" class="edit-user-label">
          {{ $t("settings.phoneNumber") }}
        </label>
        <vue-tel-input
          class="edit-user-field personalInfo-phone mb-4"
          id="phone"
          :label="$t('settings.phoneNumber')"
          v-bind="getSendyPhoneProps"
          v-model="phone"
          disabled
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
          clearable
          clear-icon="mdi-close"
          disabled
        ></v-text-field>
        <label for="user-role" class="edit-user-label">
          {{ $t("settings.userRole") }}
        </label>
        <el-select
          class="mb-6 business-details-industry"
          id="user-role"
          v-model="defaultRole"
          disabled
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
          class="edit-user-save"
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
import eventsMixin from "@/mixins/events_mixin";

export default {
  mixin: [eventsMixin],
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
  beforeMount() {
    if (localStorage.country) {
      const props = this.getSendyPhoneProps;
      props.defaultCountry = localStorage.country.toLowerCase();
      this.setSendyPhoneProps(props);
    }
  },
  mounted() {
    this.setComponent("settings.editUser");
    this.fetchUser();
  },
  computed: {
    ...mapGetters(["getStorageUserDetails", "getSendyPhoneProps", "getUser"]),
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setUser",
      "setSendyPhoneProps",
    ]),
    ...mapActions(["requestAxiosPut", "requestAxiosGet"]),
    fetchUser() {
      this.setLoader({
        type: "userDetails",
        value: "loading-text",
      });
      this.buttonLoader = true;
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.$route.params.user_id}`,
      }).then((response) => {
        this.setLoader({
          type: "userDetails",
          value: "",
        });
        this.buttonLoader = false;
        if (response.status === 200) {
          this.setUser(response.data.data.user);
          this.userMapping();
        }
      });
    },
    userMapping() {
      this.firstName = this.getUser.first_name;
      this.lastName = this.getUser.last_name;
      this.emailAddress = this.getUser.email;
      this.defaultRole = this.getUser.user_role;
      this.phone = this.getUser.phone_number;
    },
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
        this.requestAxiosPut({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.$route.params.user_id}`,
          values: payload,
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            ElNotification({
              title: this.$t("settings.userEditedSuccessfully"),
              message: "",
              type: "success",
            });
            this.$router.go(-1);
            this.sendSegmentEvents({
              event: "Edit_multiuser",
              data: {
                userId: this.getStorageUserDetails.business_id,
                first_name: this.firstName,
                last_name: this.lastName,
                user_role: this.defaultRole,
                phone_number: this.phone,
                email: this.emailAddress,
                clientType: "web",
                device: "desktop",
              },
            });
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
.edit-user-container {
  width: 35%;
  margin: 60px auto;
  padding: 3% 5%;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  background: white;
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
</style>
