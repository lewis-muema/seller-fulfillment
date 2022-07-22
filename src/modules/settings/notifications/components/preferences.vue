<template>
  <div>
    <div class="nofifications-container">
      <v-expansion-panels
        class="notification-expansion-panels"
        v-if="filteredFields(inventory).length"
      >
        <v-expansion-panel class="product-select-exp-panel">
          <v-expansion-panel-title class="notifications-preferences-title">
            <div class="notifications-preferences-left">
              <div class="notifications-preferences-title-top">
                {{ $t("settings.inventoryNotifications") }}
              </div>
              <div class="notifications-preferences-title-bottom">
                {{ $t("settings.notificationsAssociatedWithInventory") }}
              </div>
            </div>
            <div class="notifications-preferences-view">
              {{ $t("inventory.view") }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="product-select-panel-text">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left notifications-table-header first-col">
                    {{ $t("settings.activity") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.mobilePush") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.SMS") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.email") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="deliveries-table-column"
                  v-for="(row, i) in filteredFields(inventory)"
                  :key="i"
                >
                  <td class="deliveries-product-row">
                    {{ row.item }}
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].FCM"
                      @change="savePreference(row.id, 'FCM')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].SMS"
                      @change="savePreference(row.id, 'SMS')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].EMAIL"
                      @change="savePreference(row.id, 'EMAIL')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels
        class="notification-expansion-panels"
        v-if="filteredFields(consignment).length"
      >
        <v-expansion-panel class="product-select-exp-panel">
          <v-expansion-panel-title class="notifications-preferences-title">
            <div class="notifications-preferences-left">
              <div class="notifications-preferences-title-top">
                {{ $t("settings.deliveryToSendyNotifications") }}
              </div>
              <div class="notifications-preferences-title-bottom">
                {{
                  $t("settings.NotificationsAssociatedWithDeliveriesToSendy")
                }}
              </div>
            </div>
            <div class="notifications-preferences-view">
              {{ $t("inventory.view") }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="product-select-panel-text">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left notifications-table-header first-col">
                    {{ $t("settings.activity") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.mobilePush") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.SMS") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.email") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="deliveries-table-column"
                  v-for="(row, i) in filteredFields(consignment)"
                  :key="i"
                >
                  <td class="deliveries-product-row">
                    {{ row.item }}
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].FCM"
                      @change="savePreference(row.id, 'FCM')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].SMS"
                      @change="savePreference(row.id, 'SMS')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].EMAIL"
                      @change="savePreference(row.id, 'EMAIL')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels
        class="notification-expansion-panels"
        v-if="filteredFields(delivery).length"
      >
        <v-expansion-panel class="product-select-exp-panel">
          <v-expansion-panel-title class="notifications-preferences-title">
            <div class="notifications-preferences-left">
              <div class="notifications-preferences-title-top">
                {{ $t("settings.deliveryToYourCustomersNotifications") }}
              </div>
              <div class="notifications-preferences-title-bottom">
                {{
                  $t(
                    "settings.notificationsAssociatedWithDeliveriesToYourCustomers"
                  )
                }}
              </div>
            </div>
            <div class="notifications-preferences-view">
              {{ $t("inventory.view") }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="product-select-panel-text">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left notifications-table-header first-col">
                    {{ $t("settings.activity") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.mobilePush") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.SMS") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.email") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="deliveries-table-column"
                  v-for="(row, i) in filteredFields(delivery)"
                  :key="i"
                >
                  <td class="deliveries-product-row">
                    {{ row.item }}
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].FCM"
                      @change="savePreference(row.id, 'FCM')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].SMS"
                      @change="savePreference(row.id, 'SMS')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].EMAIL"
                      @change="savePreference(row.id, 'EMAIL')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-expansion-panels
        class="notification-expansion-panels"
        v-if="filteredFields(payment).length"
      >
        <v-expansion-panel class="product-select-exp-panel">
          <v-expansion-panel-title class="notifications-preferences-title">
            <div class="notifications-preferences-left">
              <div class="notifications-preferences-title-top">
                {{ $t("settings.paymentNotifications") }}
              </div>
              <div class="notifications-preferences-title-bottom">
                {{
                  $t(
                    "settings.notificationsAboutReminderForPaymentsAndInvoices"
                  )
                }}
              </div>
            </div>
            <div class="notifications-preferences-view">
              {{ $t("inventory.view") }}
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text class="product-select-panel-text">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left notifications-table-header first-col">
                    {{ $t("settings.activity") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.mobilePush") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.SMS") }}
                  </th>
                  <th class="text-left notifications-table-header next-col">
                    {{ $t("settings.email") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="deliveries-table-column"
                  v-for="(row, i) in filteredFields(payment)"
                  :key="i"
                >
                  <td class="deliveries-product-row">
                    {{ row.item }}
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].FCM"
                      @change="savePreference(row.id, 'FCM')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].SMS"
                      @change="savePreference(row.id, 'SMS')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                  <td class="deliveries-product-row">
                    <v-switch
                      v-model="preferences[row.id].EMAIL"
                      @change="savePreference(row.id, 'EMAIL')"
                      label=""
                      color="indigo-darken-3"
                      hide-details
                      v-if="preferences[row.id]"
                      :disabled="loading"
                    ></v-switch>
                    <v-switch v-else disabled hide-details></v-switch>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      mobilePush: false,
      SMS: false,
      email: false,
      inventory: [
        {
          item: this.$t("settings.inventoryRunningLow"),
          id: "",
        },
        {
          item: this.$t("settings.inventoryAcceptedAtTheFulfillmentCentre"),
          id: "",
        },
        {
          item: this.$t("settings.inventoryIsUpdatedAfterFailedDelivery"),
          id: "",
        },
      ],
      consignment: [
        {
          item: this.$t("settings.whenARiderIsAssignedToPickMyInventory"),
          id: "",
        },
        {
          item: this.$t("settings.whenRiderArrivesToPickInventory"),
          id: "EVENT_PICKUP_PARTNER_ARRIVED_AT_PICKUP_LOCATION",
        },
        {
          item: this.$t("settings.whenPickUpFails"),
          id: "EVENT_PICKUP_FAILED",
        },
        {
          item: this.$t(
            "settings.whenRiderReachesTheFulfillmentCentreToDropOffItems"
          ),
          id: "EVENT_PICKUP_PARTNER_SUBMITTED_ITEMS_AT_HUB_CONFIRMED_VIA_CODE",
        },
        {
          item: this.$t(
            "settings.whenInventoryIsDeliveredToTheFulfilmentCenter"
          ),
          id: "EVENT_PICKUP_HUB_ITEMS_RECEIVED_AT_HUB",
        },
      ],
      delivery: [
        {
          item: this.$t("settings.whenRiderIsAllocatedToTheDelivery"),
          id: "",
        },
        {
          item: this.$t("settings.whenRiderArrivesAtMyCustomersLocation"),
          id: "EVENT_DELIVERY_PARTNER_SUBMITTED_ITEMS_TO_BUYER_CONFIRMED_VIA_CODE",
        },
        {
          item: this.$t(
            "settings.whenDeliveryFailsBecauseCustomerIsUnavailableUnreachable"
          ),
          id: "EVENT_DELIVERY_FAILED",
        },
        {
          item: this.$t("settings.whenDeliveryAttemptsHaveBeenExceeded"),
          id: "",
        },
        {
          item: this.$t("settings.whenDeliveryHasBeenCompleted"),
          id: "EVENT_DELIVERY_PARTNER_SUBMITTED_ITEMS_TO_BUYER_CONFIRMED_VIA_CODE",
        },
      ],
      payment: [
        {
          item: this.$t("settings.whenAnInvoiceIsRaised"),
          id: "",
        },
        {
          item: this.$t("settings.reminderOfAPendingPayment"),
          id: "",
        },
        {
          item: this.$t("settings.whenPaymentIsSuccessful"),
          id: "PAYMENT_UPDATES",
        },
      ],
      preferences: {},
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getStorageUserDetails", "getNotificationPreferences"]),
  },
  mounted() {
    this.preferences = this.preferenceMapping();
    this.fetchNotificationPreferences();
  },
  methods: {
    ...mapActions(["requestAxiosGet", "requestAxiosPut"]),
    ...mapMutations(["setNotificationPreferences"]),
    fetchNotificationPreferences() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/user/notificationchannel`,
      }).then((response) => {
        if (response.status === 200) {
          this.setNotificationPreferences(
            response.data.data.business_notification_types
          );
          this.preferences = this.preferenceMapping();
        }
      });
    },
    filteredFields(field) {
      const fields = [];
      field.forEach((row) => {
        if (row.id) {
          fields.push(row);
        }
      });
      return fields;
    },
    preferenceMapping() {
      const mappings = {};
      this.getNotificationPreferences.forEach((row) => {
        mappings[row.notification_type_id] = this.commMapping(row);
      });
      return mappings;
    },
    commMapping(mapping) {
      const meansOfCommunication = {};
      mapping.notification_type_means_of_communication.forEach((comm) => {
        meansOfCommunication[comm.means_of_communication_type] = comm.enabled;
      });
      return meansOfCommunication;
    },
    savePreference(preference, val) {
      const preferences = this.getNotificationPreferences;
      preferences.forEach((row) => {
        if (row.notification_type_id === preference) {
          row.notification_type_means_of_communication.forEach((type) => {
            if (type.means_of_communication_type === val) {
              type.enabled = this.preferences[preference][val];
            }
          });
        }
      });
      this.loading = true;
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/user/notificationchannel`,
        values: { business_notification_types: preferences },
      }).then((response) => {
        this.loading = false;
        if (response.status === 200) {
          this.setNotificationPreferences(
            response.data.data.business_notification_types
          );
          this.preferences = this.preferenceMapping();
          ElNotification({
            title: this.$t("settings.notificationPreferencesSetSuccessfully"),
            message: "",
            type: "success",
          });
        } else {
          ElNotification({
            title: this.$t("settings.FailedToSaveNotificationPreferences"),
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
.nofifications-container {
  margin: 40px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
}
.notification-expansion-panels {
  margin: 2% 3%;
  width: 94%;
  border: 1px solid #e2e7ed;
  padding: 5px;
  border-radius: 5px;
}
.notifications-preferences-view {
  margin-left: auto !important;
  margin: 10px;
  font-weight: 500;
}
.notifications-preferences-title,
.v-expansion-panel-title__icon {
  margin-inline-start: unset !important;
}
.notifications-preferences-left {
  margin: 20px 10px;
}
.notifications-preferences-title-top {
  text-align: left;
  margin-bottom: 20px;
  font-weight: 500;
  color: #303133;
  font-size: 18px;
}
.notifications-preferences-title-bottom {
  text-align: left;
  color: #303133;
  font-size: 14px;
}
.first-col {
  width: 63%;
}
.next-col {
  width: 10%;
}
</style>
