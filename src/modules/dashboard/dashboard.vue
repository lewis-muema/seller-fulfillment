<template>
  <div>
    <span>
      <h5>Welcome Irene</h5>
      <p>Complete the steps below to fulfilling your first order</p>
    </span>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" class="desktop-dashboard-content">
          <v-card tile variant="outlined" class="mt-3 mx-auto">
            <div class="">
              <v-list density="compact">
                <v-list-item>
                  <v-list-item-avatar start>
                    <v-icon icon="mdi-face-agent"></v-icon>
                  </v-list-item-avatar>
                  <v-list-item-header>Account Created</v-list-item-header>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-2" outlined tile>
            <v-card-title> Get more out of Sendy fulfilment</v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkbox: true,
      dashboard: [
        {
          title: "Account Created",
          text: "",
          button: "",
        },
        {
          title: "Add your Products",
          text: "Add or import the list of products that you will be fulfilling",
          button: "Add Products",
        },
        {
          title: "Send us your inventory",
          text: "Send us the products that you want us to deliver to your customers",
          button: "Send inventory",
        },
        {
          title: "Deliver to Customer",
          text: "Send a delivery to your customer",
          button: "Deliver to a customer",
        },
      ],
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.dashboard"));
  },
};
</script>

<style>
.desktop-dashboard-content .v-card {
  border-color: #e2e7ed;
}
</style>
