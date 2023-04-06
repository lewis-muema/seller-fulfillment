<template>
  <div>
    <div class="dashboard-wallet-container">
      <v-card class="dashboard-wallet-card" variant="outlined">
        <v-list-item two-line @click="$router.push('/payments/wallet')">
          <v-list-item-avatar>
            <img
              src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/Vector+(Stroke).png"
              class="dashboard-wallet-icon"
              alt=""
            />
          </v-list-item-avatar>
          <v-list-item-header>
            <v-list-item-title>
              {{ $t("dashboard.accountBalance") }}</v-list-item-title
            >
            <v-list-item-subtitle>
              <span class="mr-1 desktop-quick-links-balance">{{
                getWallets[0]?.currency
                  ? getWallets[0].currency
                  : getBusinessDetails.currency
              }}</span>
              <span
                class="desktop-quick-links-balance dashboard-wallet-balance"
                >{{
                  getWallets[0]?.wallet_balance
                    ? getWallets[0].wallet_balance
                    : 0
                }}</span
              >
            </v-list-item-subtitle>
          </v-list-item-header>
          <i class="mdi mdi-chevron-right wallet-balance-arrow-icon"></i>
        </v-list-item>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  mounted() {
    this.getUserWallets();
  },
  computed: {
    ...mapGetters([
      "getWallets",
      "getStorageUserDetails",
      "getBusinessDetails",
    ]),
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
.dashboard-wallet-icon {
  height: 30px;
  width: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #324ba8;
  margin: 0px 10px 0px 0px;
}
.wallet-balance-arrow-icon {
  font-size: 20px;
}
</style>
