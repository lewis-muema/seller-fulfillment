<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
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
        ></v-list-item>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-warehouse"
              :title="$t('inventory')"
              :value="$t('inventory')"
              class="desktop-sidebar-icons"
            ></v-list-item>
          </template>
          <v-list-item
            :title="$t('products')"
            :value="$t('products')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
          <v-list-item
            :title="$t('stocks')"
            :value="$t('stocks')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
          <v-list-item
            :title="$t('sendInventory')"
            :value="$t('sendInventory')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-truck-outline"
              :title="$t('deliveries')"
              :value="$t('deliveries')"
              class="desktop-sidebar-icons"
            ></v-list-item>
          </template>
          <v-list-item
            :title="$t('toCustomers')"
            :value="$t('toCustomers')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
          <v-list-item
            :title="$t('toFulfilmentCentre')"
            :value="$t('toFulfilmentCentre')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-cash-multiple"
              :title="$t('payments')"
              :value="$t('payments')"
              class="desktop-sidebar-icons"
            ></v-list-item>
          </template>
          <v-list-item
            :title="$t('statements')"
            :value="$t('statements')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
          <v-list-item
            :title="$t('invoices')"
            :value="$t('invoices')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-account-circle-outline"
              :title="$t('settings')"
              :value="$t('settings')"
              class="desktop-sidebar-icons"
            ></v-list-item>
          </template>
          <v-list-item
            :title="$t('profile')"
            :value="$t('profile')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
          <v-list-item
            :title="$t('paymentOptions')"
            :value="$t('paymentOptions')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
          <v-list-item
            :title="$t('manageUsers')"
            :value="$t('manageUsers')"
            class="desktop-sidebar-sub-menu"
          ></v-list-item>
        </v-list-group>

        <v-list-item
          prepend-icon="mdi-face-agent"
          :title="$t('help')"
          :value="$t('help')"
          class="desktop-sidebar-icons"
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
};
</script>

<style>
.desktop-sidebar-icons:hover .v-list-item-avatar--start {
  color: #0049b7;
}
.desktop-sidebar-icons:hover .v-list-item-title {
  color: #0049b7;
}
.desktop-sidebar-sub-menu:hover .v-list-item-title {
  color: #0049b7;
}
.desktop-sidebar-sub-menu {
  margin-left: -55px !important;
}
.v-list-item--active {
  color: #0049b7;
}
.desktop-sidebar-items {
  font-family: "DM Sans", sans-serif;
}
.desktop-sendy-logo {
  width: 90px;
}
.desktop-logo-container {
  height: 80px;
}
</style>
