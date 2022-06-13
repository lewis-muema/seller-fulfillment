<template>
  <div>
    <v-card
      variant="outlined"
      class="desktop-dashboard-upper-card pa-5"
      height="600"
    >
      <dashboard-tabs
        :customerCount="deliveriesToCustomer.length"
        :sendyCount="deliveriesToSendy.length"
        v-if="dashboardTabs === 'To your Customers'"
      >
        <deliveries :deliveries="deliveries" :selectedTab="dashboardTabs" />
      </dashboard-tabs>
      <dashboard-tabs
        :customerCount="deliveriesToCustomer.length"
        :sendyCount="deliveriesToSendy.length"
        v-else
      >
        <deliveries :deliveries="deliveries" :selectedTab="dashboardTabs"
      /></dashboard-tabs>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import dashboardTabs from "@/modules/dashboard/components/dashboardTabs";
import deliveries from "@/modules/dashboard/components/deliveries";
export default {
  components: { dashboardTabs, deliveries },
  data() {
    return {
      deliveriesToCustomer: [
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "Package is on the way",
          step: 100,
          color: "#324ba8",
          action: "Track Order",
        },
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "Package is on the way",
          color: "#324ba8",
          step: 70,
          action: "Track Order",
        },
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "We will attempt delivery Tomorrow",
          color: "#9b101c",
          step: 100,
          action: "Track Order",
        },
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "We are processing your order",
          color: "#324ba8",
          step: 20,
          action: "Track Order",
        },
        {
          customerName: "John Doe",
          customerDeliveryLocation: "Windsor Heights, Kiambu ro...",
          progress: "Package has been delivered",
          color: "#324ba8",
          step: 100,
          action: "Track Order",
        },
      ],
      deliveriesToSendy: [
        {
          productName: "Shear butter & 3",
          progress: "Package is on the way",
          step: 100,
          color: "#324ba8",
          action: "Track Order",
        },
        {
          productName: "Shear butter & 3",
          progress: "Package is on the way",
          step: 100,
          color: "#324ba8",
          action: "Track Order",
        },
        {
          productName: "Shear butter & 3",
          progress: "We will attempt delivery Tomorrow",
          color: "#9b101c",
          step: 100,
          action: "Track Order",
        },
        {
          productName: "Shear butter & 3",
          progress: "We are processing your order",
          color: "#324ba8",
          step: 20,
          action: "Track Order",
        },
        {
          productName: "Shear butter & 3",
          progress: "Package has been delivered",
          color: "#324ba8",
          step: 100,
          action: "Track Order",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getDashboardSelectedTab"]),
    dashboardTabs() {
      return this.getDashboardSelectedTab;
    },
    deliveries() {
      let result =
        this.dashboardTabs === "To your Customers"
          ? this.deliveriesToCustomer
          : this.deliveriesToSendy;
      return result;
    },
  },
};
</script>

<style scoped></style>
