<template>
  <div>
    <div class="userPermisssions-container">
      <div class="userPermisssions-top-bar">
        <span class="userPermisssions-page-name">{{
          $t("settings.setUserPermissionsFor", { name: getUser.first_name })
        }}</span>
      </div>
      <div>
        <p class="userPermisssions-title">{{ $t("settings.whichModules") }}</p>
        <div class="userPermisssions-checkbox-container">
          <p class="mb-2">{{ $t("settings.inventory") }}</p>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_ACCESS_PRODUCTS_MODULE"
              @click="
                permissions.CAN_ACCESS_PRODUCTS_MODULE =
                  !permissions.CAN_ACCESS_PRODUCTS_MODULE
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_ACCESS_PRODUCTS_MODULE')
              "
            />
            <span class="userPermisssions-label">{{
              $t("deliveries.viewProducts")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_CREATE_PRODUCTS"
              @click="
                permissions.CAN_CREATE_PRODUCTS =
                  !permissions.CAN_CREATE_PRODUCTS
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_CREATE_PRODUCTS')
              "
            />
            <span class="userPermisssions-label">{{
              $t("common.addProducts")
            }}</span>
          </div>
        </div>
        <div class="userPermisssions-checkbox-container">
          <p class="mb-2">{{ $t("settings.deliveries") }}</p>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_CREATE_CONSIGNMENTS"
              @click="
                permissions.CAN_CREATE_CONSIGNMENTS =
                  !permissions.CAN_CREATE_CONSIGNMENTS
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_CREATE_CONSIGNMENTS')
              "
            />
            <span class="userPermisssions-label">{{
              $t("common.sendInventoryToSendy")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_ACCESS_CONSIGNMENTS_MODULE"
              @click="
                permissions.CAN_ACCESS_CONSIGNMENTS_MODULE =
                  !permissions.CAN_ACCESS_CONSIGNMENTS_MODULE
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_ACCESS_CONSIGNMENTS_MODULE')
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.viewAndTrackDeliveriesToSendy")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_CREATE_DELIVERIES"
              @click="
                permissions.CAN_CREATE_DELIVERIES =
                  !permissions.CAN_CREATE_DELIVERIES
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_CREATE_DELIVERIES')
              "
            />
            <span class="userPermisssions-label">{{
              $t("common.sendDeliveryToCustomer")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_ACCESS_DELIVERIES_MODULE"
              @click="
                permissions.CAN_ACCESS_DELIVERIES_MODULE =
                  !permissions.CAN_ACCESS_DELIVERIES_MODULE
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_ACCESS_DELIVERIES_MODULE')
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.viewAndTrackDeliveriesToCustomers")
            }}</span>
          </div>
        </div>
        <div class="userPermisssions-checkbox-container">
          <p class="mb-2">{{ $t("settings.payments") }}</p>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_ACCESS_BILLING_MODULE"
              @click="
                permissions.CAN_ACCESS_BILLING_MODULE =
                  !permissions.CAN_ACCESS_BILLING_MODULE
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_ACCESS_BILLING_MODULE')
              "
            />
            <span class="userPermisssions-label">{{
              $t("common.billings")
            }}</span>
          </div>
        </div>
        <div class="userPermisssions-checkbox-container">
          <p class="mb-2">{{ $t("settings.settings") }}</p>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_ACCESS_PAYMENT_OPTIONS_MODULE"
              @click="
                permissions.CAN_ACCESS_PAYMENT_OPTIONS_MODULE =
                  !permissions.CAN_ACCESS_PAYMENT_OPTIONS_MODULE
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_ACCESS_PAYMENT_OPTIONS_MODULE')
              "
            />
            <span class="userPermisssions-label">{{
              $t("common.paymentOptions")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_ACCESS_MANAGE_USERS_MODULE"
              @click="
                permissions.CAN_ACCESS_MANAGE_USERS_MODULE =
                  !permissions.CAN_ACCESS_MANAGE_USERS_MODULE
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_ACCESS_MANAGE_USERS_MODULE')
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.manageUsers")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_ACCESS_USER_ACTION_LOG"
              @click="
                permissions.CAN_ACCESS_USER_ACTION_LOG =
                  !permissions.CAN_ACCESS_USER_ACTION_LOG
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_ACCESS_USER_ACTION_LOG')
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.viewActivityLog")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_EDIT_BUSINESS_PROFILE"
              @click="
                permissions.CAN_EDIT_BUSINESS_PROFILE =
                  !permissions.CAN_EDIT_BUSINESS_PROFILE
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_EDIT_BUSINESS_PROFILE')
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.manageBusinessProfile")
            }}</span>
          </div>
        </div>
        <div class="userPermisssions-checkbox-container">
          <p class="mb-2">{{ $t("common.notifications") }}</p>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_PRODUCTS"
              @click="
                permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_PRODUCTS =
                  !permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_PRODUCTS
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty(
                  'CAN_RECEIVE_NOTIFICATIONS_FOR_PRODUCTS'
                )
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.receiveNotificationsForInventoryUpdates")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_CONSIGNMENTS"
              @click="
                permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_CONSIGNMENTS =
                  !permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_CONSIGNMENTS
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty(
                  'CAN_RECEIVE_NOTIFICATIONS_FOR_CONSIGNMENTS'
                )
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.receiveNotificationsForDeliveriesToSendy")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_DELIVERIES"
              @click="
                permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_DELIVERIES =
                  !permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_DELIVERIES
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty(
                  'CAN_RECEIVE_NOTIFICATIONS_FOR_DELIVERIES'
                )
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.receiveNotificationsForDeliveriesToYourCustomers")
            }}</span>
          </div>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_PAYMENTS"
              @click="
                permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_PAYMENTS =
                  !permissions.CAN_RECEIVE_NOTIFICATIONS_FOR_PAYMENTS
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty(
                  'CAN_RECEIVE_NOTIFICATIONS_FOR_PAYMENTS'
                )
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.receiveNotificationsForPayments")
            }}</span>
          </div>
        </div>
        <div class="userPermisssions-checkbox-container">
          <p class="mb-2">{{ $t("common.Exports") }}</p>
          <div class="d-flex">
            <input
              type="checkbox"
              class="userPermisssions-checkbox"
              :checked="permissions.CAN_EXPORT_SELLER_DATA"
              @click="
                permissions.CAN_EXPORT_SELLER_DATA =
                  !permissions.CAN_EXPORT_SELLER_DATA
              "
              :disabled="
                buttonLoading ||
                !permissions.hasOwnProperty('CAN_EXPORT_SELLER_DATA')
              "
            />
            <span class="userPermisssions-label">{{
              $t("settings.canExportSellerData")
            }}</span>
          </div>
        </div>
        <v-btn
          class="userPermisssions-save"
          @click="submitPermissions()"
          v-loading="buttonLoading"
        >
          {{ $t("settings.setPermissions") }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      buttonLoading: false,
      permissions: {},
    };
  },
  mounted() {
    this.setComponent("settings.modifyPermissions");
    this.fetchUser();
  },
  computed: {
    ...mapGetters(["getStorageUserDetails", "getUser"]),
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setUser",
      "setOverlayStatus",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPut"]),
    fetchUser() {
      this.setLoader({
        type: "userDetails",
        value: "loading-text",
      });
      this.buttonLoading = true;
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.$route.params.user_id}`,
      }).then((response) => {
        this.setLoader({
          type: "userDetails",
          value: "",
        });
        this.buttonLoading = false;
        if (response.status === 200) {
          this.setUser(response.data.data.user);
          this.permissions = this.permissionMapping();
        }
      });
    },
    permissionMapping() {
      const mappings = {};
      this.getUser.user_access_permissions.forEach((row) => {
        mappings[row.permission_id] = row.permission_granted;
      });
      return mappings;
    },
    submitPermissions() {
      const permissions = [];
      Object.keys(this.permissions).forEach((row) => {
        if (this.permissions[row]) {
          permissions.push({
            permission_id: row,
          });
        }
      });
      this.buttonLoading = true;
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.$route.params.user_id}/amendpermissions`,
        values: { user_access_permissions: permissions },
      }).then((response) => {
        this.buttonLoading = false;
        if (response.status === 200) {
          if (
            this.$router.options.history.state.back.includes(
              "/settings/add-user"
            )
          ) {
            ElNotification({
              title: this.$t("settings.userHasBeenAdded"),
              message: this.$t(
                "settings.anEmailHasBeenSentToTheUserWithInstructionsOnHowToLogin"
              ),
              type: "success",
            });
            this.$router.push("/settings/manage-users");
          } else {
            ElNotification({
              title: this.$t("settings.permissionsSetSuccessfully", {
                name: this.getUser.first_name,
              }),
              message: "",
              type: "success",
            });
            this.$router.go(-1);
          }
        } else {
          ElNotification({
            title: this.$t("settings.failedToSetPermissions"),
            message: "",
            type: "error",
          });
        }
      });
    },
  },
};
</script>

<style>
.userPermisssions-container {
  width: 40%;
  margin: 60px auto;
  padding: 3% 5%;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  background: white;
}
.userPermisssions-label {
  font-size: 15px;
}
.userPermisssions-field {
  zoom: 90%;
}
.userPermisssions-phone {
  height: 50px;
}
.userPermisssions-select .v-input__control {
  border: 1px solid #c5c5c5;
  border-radius: 5px;
}
.userPermisssions-save {
  width: 100%;
  margin-top: 20px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
.userPermisssions-top-bar {
  height: 40px;
  align-items: center;
  display: flex;
  margin-bottom: 10px;
}
.userPermisssions-back {
  font-size: 25px;
  cursor: pointer;
  margin-right: 10px;
}
.userPermisssions-checkbox {
  accent-color: #324ba8;
  margin-right: 17px;
  height: 40px;
  width: 18px !important;
}
.userPermisssions-label {
  display: flex;
  align-items: center;
  color: #303133;
}
.v-selection-control .v-label {
  color: #303133;
  font-size: 14px;
}
.userPermisssions-title {
  font-size: 15px;
}
.userPermisssions-checkbox-container {
  font-size: 16px;
  margin: 20px 0px;
}
.userPermisssions-page-name {
  font-size: 20px;
}
</style>
