<template>
  <div>
    <v-navigation-drawer v-model="drawer" permanent>
      <v-list-item class="desktop-logo-container">
        <img
          src="https://images.sendyit.com/fulfilment/seller/sendy_logo.png"
          class="desktop-sendy-logo"
          alt="logo"
        />
      </v-list-item>
      <v-list density="compact" nav class="desktop-sidebar-items">
        <v-list-item
          prepend-icon="mdi-home-outline"
          :title="$t('common.home')"
          :value="'common.home'"
          class="desktop-sidebar-icons"
          @click="$router.push('/')"
          :active="route === 'common.dashboard'"
        ></v-list-item>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="checkProps(props, 'inventory')"
              prepend-icon="mdi-warehouse"
              :title="$t('common.inventory')"
              class="desktop-sidebar-icons"
              id="inventory"
            ></v-list-item>
          </template>
          <v-list-item
            v-if="!getAccessDenied.includes('/inventory/products')"
            :title="$t('common.products')"
            class="desktop-sidebar-sub-menu"
            @click="$router.push('/inventory/products')"
            :active="
              [
                'common.products',
                'common.viewProduct',
                'common.editProduct',
                'common.addProduct',
              ].includes(route)
            "
            :append-icon="
              [
                'common.products',
                'common.viewProduct',
                'common.editProduct',
                'common.addProduct',
              ].includes(route)
                ? 'mdi-circle-small'
                : ''
            "
          ></v-list-item>
          <v-list-item
            v-if="!getAccessDenied.includes('/inventory/stock-levels')"
            :title="$t('common.stocks')"
            @click="$router.push('/inventory/stock-levels')"
            class="desktop-sidebar-sub-menu"
            :active="route === 'common.stocks'"
            :append-icon="route === 'common.stocks' ? 'mdi-circle-small' : ''"
          ></v-list-item>
          <v-list-item
            v-if="!getAccessDenied.includes('/inventory/send-inventory')"
            :title="$t('common.sendInventory')"
            @click="$router.push('/inventory/send-inventory')"
            class="desktop-sidebar-sub-menu"
            :active="
              [
                'common.sendInventory',
                'common.sendInventoryToSendy',
                'common.sendDeliveryToCustomer',
              ].includes(route)
            "
            :append-icon="
              [
                'common.sendInventory',
                'common.sendInventoryToSendy',
                'common.sendDeliveryToCustomer',
              ].includes(route)
                ? 'mdi-circle-small'
                : ''
            "
          ></v-list-item>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="checkProps(props, 'deliveries')"
              prepend-icon="mdi-truck-outline"
              :title="$t('common.trackDeliveries')"
              :value="'common.trackDeliveries'"
              class="desktop-sidebar-icons"
              id="deliveries"
            ></v-list-item>
          </template>
          <v-list-item
            v-if="!getAccessDenied.includes('/deliveries/customer')"
            :title="$t('common.toCustomers')"
            @click="$router.push('/deliveries/customer')"
            class="desktop-sidebar-sub-menu"
            :active="
              [
                'common.deliveriesToCustomers',
                'deliveries.trackDeliveryToCustomer',
              ].includes(route)
            "
            :append-icon="
              [
                'common.deliveriesToCustomers',
                'deliveries.trackDeliveryToCustomer',
              ].includes(route)
                ? 'mdi-circle-small'
                : ''
            "
          ></v-list-item>
          <v-list-item
            v-if="!getAccessDenied.includes('/deliveries/sendy')"
            :title="$t('common.toSendy')"
            @click="$router.push('/deliveries/sendy')"
            class="desktop-sidebar-sub-menu"
            :active="
              [
                'common.deliveriesToSendy',
                'deliveries.trackDeliveryToSendy',
              ].includes(route)
            "
            :append-icon="
              [
                'common.deliveriesToSendy',
                'deliveries.trackDeliveryToSendy',
              ].includes(route)
                ? 'mdi-circle-small'
                : ''
            "
          ></v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="checkProps(props, 'payments')"
              prepend-icon="mdi-cash-multiple"
              :title="$t('common.payments')"
              :value="'common.payments'"
              class="desktop-sidebar-icons"
              id="payments"
            ></v-list-item>
          </template>
          <v-list-item
            v-if="!getAccessDenied.includes('/payments/billings')"
            :title="$t('common.billings')"
            @click="$router.push('/payments/billings')"
            class="desktop-sidebar-sub-menu"
            :active="route === 'common.billings'"
            :append-icon="route === 'common.billings' ? 'mdi-circle-small' : ''"
          ></v-list-item>
          <!-- <v-list-item
            :title="$t('common.invoices')"
            @click="$router.push('/payments/invoices')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('common.invoices')"
            :append-icon="
              route === $t('common.invoices') ? 'mdi-circle-small' : ''
            "
          ></v-list-item> -->
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="checkProps(props, 'settings')"
              prepend-icon="mdi-account-circle-outline"
              :title="$t('common.settings')"
              :value="'common.settings'"
              class="desktop-sidebar-icons"
              id="settings"
            ></v-list-item>
          </template>
          <v-list-item
            v-if="!getAccessDenied.includes('/settings/profile/personal-info')"
            :title="$t('common.profile')"
            @click="$router.push('/settings/profile/personal-info')"
            class="desktop-sidebar-sub-menu"
            :active="route === 'common.profile'"
            :append-icon="route === 'common.profile' ? 'mdi-circle-small' : ''"
          ></v-list-item>
          <v-list-item
            v-if="!getAccessDenied.includes('/settings/payment-options')"
            :title="$t('common.paymentOptions')"
            @click="$router.push('/settings/payment-options')"
            class="desktop-sidebar-sub-menu"
            :active="route === 'common.paymentOptions'"
            :append-icon="
              route === 'common.paymentOptions' ? 'mdi-circle-small' : ''
            "
          ></v-list-item>
          <v-list-item
            v-if="!getAccessDenied.includes('/settings/manage-users')"
            :title="$t('settings.manageUsers')"
            @click="$router.push('/settings/manage-users')"
            class="desktop-sidebar-sub-menu"
            :active="
              [
                'common.manageUsers',
                'settings.addAUser',
                'settings.editUser',
                'settings.modifyPermissions',
                'settings.confirmUserInformation',
              ].includes(route)
            "
            :append-icon="
              [
                'common.manageUsers',
                'settings.addAUser',
                'settings.editUser',
                'settings.modifyPermissions',
                'settings.confirmUserInformation',
              ].includes(route)
                ? 'mdi-circle-small'
                : ''
            "
          ></v-list-item>
          <v-list-item
            v-if="
              !getAccessDenied.includes('/settings/notification-preferences')
            "
            :title="$t('common.manageNotifications')"
            @click="$router.push('/settings/notification-preferences')"
            class="desktop-sidebar-sub-menu"
            :active="route === 'common.manageNotificationsPreferences'"
            :append-icon="
              route === 'common.manageNotificationsPreferences'
                ? 'mdi-circle-small'
                : ''
            "
          ></v-list-item>
          <v-list-item
            v-if="!getAccessDenied.includes('/settings/integrations')"
            :title="$t('common.integrations')"
            @click="$router.push('/settings/integrations')"
            class="desktop-sidebar-sub-menu"
            :active="route === 'common.integrations'"
            :append-icon="
              route === 'common.integrations' ? 'mdi-circle-small' : ''
            "
          ></v-list-item>
          <v-list-item
            v-if="!getAccessDenied.includes('/settings/activity-log')"
            :title="$t('common.activityLog')"
            @click="$router.push('/settings/activity-log')"
            class="desktop-sidebar-sub-menu"
            :active="route === 'common.activityLog'"
            :append-icon="
              route === 'common.activityLog' ? 'mdi-circle-small' : ''
            "
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      drawer: true,
      routeActive: false,
    };
  },
  computed: {
    route() {
      return this.getComponent;
    },
    ...mapGetters(["getComponent", "getAccessDenied"]),
  },
  watch: {
    $route(to, from) {
      this.routeActive =
        from.path === "/" || from.path.split("/")[1] === to.path.split("/")[1]
          ? false
          : true;
    },
  },
  mounted() {},
  methods: {
    expand(props, category) {
      this.$nextTick(function () {
        const params = this.$route.path.split("/");
        if (props.appendIcon === "$expand" && params[1] === category) {
          document.getElementById(`${params[1]}`).click();
        }
      });
    },
    collapse(props, category) {
      if (this.routeActive && this.$route.path !== "/payment-option-page") {
        const params = this.$route.path.split("/");
        if (props.appendIcon === "$collapse" && params[1] !== category) {
          document.getElementById(`${category}`).click();
          setTimeout(() => {
            this.routeActive = false;
          }, 100);
        }
      } else {
        this.routeActive = false;
      }
    },
    checkProps(props, category) {
      this.expand(props, category);
      this.collapse(props, category);
      return props;
    },
  },
};
</script>

<style>
.desktop-sidebar-icons:hover .v-list-item-avatar--start {
  color: #0049b7;
}
.desktop-sidebar-icons:hover .v-list-item-title {
  color: #0049b7;
}
.desktop-sidebar-icons {
  min-height: 50px !important;
}
.desktop-sidebar-sub-menu:hover .v-list-item-title {
  color: #0049b7;
}
.desktop-sidebar-sub-menu {
  margin-left: -55px !important;
}
.v-list-item--active,
.mdi-circle-small {
  color: #0049b7;
}
.mdi-circle-small {
  font-size: 40px;
}
.desktop-sidebar-items {
  margin-top: 20px;
  box-shadow: none !important;
}
.desktop-sendy-logo {
  width: 90px;
}
.desktop-logo-container {
  height: 80px;
}
.v-navigation-drawer--start {
  border-inline-end-width: inherit !important;
  box-shadow: 0.5px 0px 0px rgb(0 0 0 / 15%) !important;
}
</style>
