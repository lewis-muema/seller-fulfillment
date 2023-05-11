<template>
  <div class="d-flex">
    <v-card
      class="desktop-quick-links-tabs"
      variant="outlined"
      v-for="(link, i) in filteredQuickLinks"
      :key="i"
      @click="$router.push(link.path)"
    >
      <span class="quick-links-tabs-items">
        <img
          v-if="link.new"
          :src="`https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/new.png`"
          alt=""
          class="quick-links-tabs-image quick-links-tabs-new-badge"
        />
        <img
          :src="`https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/${link.icon}`"
          alt=""
          class="quick-links-tabs-image"
        />
        <div class="router quick-links-tabs-text">
          {{ $t(link.name) }}
        </div>
      </span>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      quickLinks: [
        {
          icon: "delivery.png",
          name: "dashboard.deliverToCustomer",
          path: "/inventory/create-delivery",
          new: false,
        },
        {
          icon: "storage.png",
          name: "dashboard.sendForStorage",
          path: "/inventory/add-pickup-products",
          new: false,
        },
        {
          icon: "on-demand.png",
          name: "dashboard.hireAVehicle",
          path: "/direct/create-delivery",
          new: true,
        },
        {
          icon: "hire-vehicle.png",
          name: "dashboard.addProducts",
          path: "/inventory/add-product",
          new: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["getBusinessDetails"]),
    directFulfillmentFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.direct_fulfilment_enabled
        : false;
    },
    filteredQuickLinks() {
      const links = [];
      this.quickLinks.forEach((link) => {
        if (
          (this.directFulfillmentFlag &&
            link.name === "dashboard.deliverOnDemand") ||
          link.name !== "dashboard.deliverOnDemand"
        ) {
          links.push(link);
        }
      });
      return links;
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
.desktop-quick-links-tabs {
  border: none;
  height: 95px;
  width: 180px;
  margin-right: auto;
  margin-bottom: 20px;
  background: #ddf0ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.quick-links-tabs-items {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.quick-links-tabs-image {
  width: 35px;
}
.quick-links-tabs-text {
  font-size: 13px;
  font-weight: 500;
  margin: 3px;
}
.quick-links-tabs-new-badge {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
