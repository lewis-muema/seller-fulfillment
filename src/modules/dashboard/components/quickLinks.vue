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
          {{ link.name }}
        </div>
      </span>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quickLinks: [
        {
          icon: "mdi-truck",
          name: this.$t("common.deliverToCustomer"),
          path: "/inventory/send-inventory/customer/select-products",
        },
        {
          icon: "mdi-home-city",
          name: this.$t("common.sendInventoryToSendy"),
          path: "/inventory/send-inventory/sendy/select-products",
        },
        {
          icon: "mdi-plus-thick",
          name: this.$t("common.addProducts"),
          path: "/inventory/add-product",
        },
      ],
    };
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
</style>
