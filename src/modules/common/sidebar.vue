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
          :title="$t('home')"
          :value="$t('home')"
          class="desktop-sidebar-icons"
          @click="$router.push('/')"
          :active="route === $t('dashboard')"
        ></v-list-item>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="checkProps(props, 'inventory')"
              prepend-icon="mdi-warehouse"
              :title="$t('inventory')"
              class="desktop-sidebar-icons"
              id="inventory"
            ></v-list-item>
          </template>
          <v-list-item
            :title="$t('products')"
            class="desktop-sidebar-sub-menu"
            @click="$router.push('/inventory/products')"
            :active="route === $t('products')"
            :append-icon="route === $t('products') ? 'mdi-circle-small' : ''"
          ></v-list-item>
          <v-list-item
            :title="$t('stocks')"
            @click="$router.push('/inventory/stock-levels')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('stocks')"
            :append-icon="route === $t('stocks') ? 'mdi-circle-small' : ''"
          ></v-list-item>
          <v-list-item
            :title="$t('sendInventory')"
            @click="$router.push('/inventory/send-inventory')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('sendInventory')"
            :append-icon="
              route === $t('sendInventory') ? 'mdi-circle-small' : ''
            "
          ></v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="checkProps(props, 'deliveries')"
              prepend-icon="mdi-truck-outline"
              :title="$t('deliveries')"
              :value="$t('deliveries')"
              class="desktop-sidebar-icons"
              id="deliveries"
            ></v-list-item>
          </template>
          <v-list-item
            :title="$t('toCustomers')"
            @click="$router.push('/deliveries/customer')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('deliveriesToCustomers')"
            :append-icon="
              route === $t('deliveriesToCustomers') ? 'mdi-circle-small' : ''
            "
          ></v-list-item>
          <v-list-item
            :title="$t('toSendy')"
            @click="$router.push('/deliveries/sendy')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('deliveriesToSendy')"
            :append-icon="
              route === $t('deliveriesToSendy') ? 'mdi-circle-small' : ''
            "
          ></v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="checkProps(props, 'payments')"
              prepend-icon="mdi-cash-multiple"
              :title="$t('payments')"
              :value="$t('payments')"
              class="desktop-sidebar-icons"
              id="payments"
            ></v-list-item>
          </template>
          <v-list-item
            :title="$t('statements')"
            @click="$router.push('/payments/statements')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('statements')"
            :append-icon="route === $t('statements') ? 'mdi-circle-small' : ''"
          ></v-list-item>
          <v-list-item
            :title="$t('invoices')"
            @click="$router.push('/payments/invoices')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('invoices')"
            :append-icon="route === $t('invoices') ? 'mdi-circle-small' : ''"
          ></v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="checkProps(props, 'settings')"
              prepend-icon="mdi-account-circle-outline"
              :title="$t('settings')"
              :value="$t('settings')"
              class="desktop-sidebar-icons"
              id="settings"
            ></v-list-item>
          </template>
          <v-list-item
            :title="$t('profile')"
            @click="$router.push('/settings/profile')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('profile')"
            :append-icon="route === $t('profile') ? 'mdi-circle-small' : ''"
          ></v-list-item>
          <v-list-item
            :title="$t('paymentOptions')"
            @click="$router.push('/settings/payment-options')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('paymentOptions')"
            :append-icon="
              route === $t('paymentOptions') ? 'mdi-circle-small' : ''
            "
          ></v-list-item>
          <v-list-item
            :title="$t('manageUsers')"
            @click="$router.push('/settings/manage-users')"
            class="desktop-sidebar-sub-menu"
            :active="route === $t('manageUsers')"
            :append-icon="route === $t('manageUsers') ? 'mdi-circle-small' : ''"
          ></v-list-item>
        </v-list-group>

        <v-list-item
          prepend-icon="mdi-face-agent"
          :title="$t('help')"
          @click="$router.push('/help')"
          class="desktop-sidebar-icons"
          :active="route === $t('help')"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
    };
  },
  computed: {
    route() {
      return this.$store.getters.getComponent;
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
    checkProps(props, category) {
      this.expand(props, category);
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
