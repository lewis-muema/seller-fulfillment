<template>
  <div>
    <div style="color: #303133">{{ $t("dashboard.quickLinks") }}</div>
    <v-card
      class="mt-3 desktop-quick-links-card q"
      variant="outlined"
      v-for="(link, i) in quickLinks"
      :key="i"
    >
      <span class="d-flex quick-links">
        <v-icon class="desktop-quick-links-icon">{{ link.icon }}</v-icon>
        <div class="router" @click="$router.push(link.path)">
          {{ $t(link.name) }}
        </div>
      </span>
    </v-card>
    <div class="dashboard-wallet-container">
      <p class="dashboard-wallet-title">{{ $t("payments.wallet") }}</p>
      <v-card class="mt-3 dashboard-wallet-card" variant="outlined">
        <v-list-item two-line @click="$router.push('/payments/wallet')">
          <v-list-item-avatar>
            <v-icon class="mr-5 desktop-quick-links-icon">mdi-wallet</v-icon>
          </v-list-item-avatar>
          <v-list-item-header>
            <v-list-item-title>
              {{ $t("dashboard.availableBalance") }}</v-list-item-title
            >
            <v-list-item-subtitle>
              <span class="mr-1 desktop-quick-links-balance">{{
                this.getWallets[0].currency
              }}</span>
              <span class="desktop-quick-links-balance">{{
                this.getWallets[0].wallet_balance
              }}</span>
            </v-list-item-subtitle>
          </v-list-item-header>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      quickLinks: [
        {
          icon: "mdi-truck",
          name: "common.sendDeliveryToCustomer",
          path: "/inventory/create-delivery",
        },
        {
          icon: "mdi-home-city",
          name: "common.sendInventoryToSendy",
          path: "/inventory/add-pickup-products",
        },
        {
          icon: "mdi-plus-thick",
          name: "common.addProducts",
          path: "/inventory/add-product",
        },
      ],
    };
  },
  mounted() {
    this.getUserWallets();
  },
  computed: {
    ...mapGetters(["getWallets", "getStorageUserDetails"]),
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations(["setWallets"]),
    getUserWallets() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/wallets`,
      }).then((response) => {
        if (response.status === 200) {
          this.setWallets(response.data.data.wallets);
        } else {
          this.setWallets([]);
        }
      });
    },
  },
};
</script>

<style>
.desktop-quick-links-card {
  border-color: #e2e7ed;
  height: 48px;
  background: white;
}
.desktop-quick-links-icon {
  height: 16px;
  width: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #324ba8;
  margin: 0px 10px 0px 0px;
}
.quick-links {
  margin: 12px 30px;
}
.quick-links .router {
  margin-top: -2px;
  text-decoration: none;
  color: #324ba8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}
.dashboard-wallet-title {
  margin-top: 1rem;
}
.desktop-quick-links-balance {
  font-size: 15px;
  font-weight: 400;
}
.dashboard-wallet-card {
  border-color: #e2e7ed;
  background: white;
  padding: 5px;
}
</style>
