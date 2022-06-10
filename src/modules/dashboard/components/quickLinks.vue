<template>
  <div>
    <div style="color: #303133">Quick Links</div>
    <v-card
      class="mt-3 desktop-quick-links-card q"
      variant="outlined"
      v-for="(link, i) in quickLinks"
      :key="i"
    >
      <span class="d-flex quick-links">
        <v-icon class="desktop-quick-links-icon">{{ link.icon }}</v-icon>
        <router-link :to="{ name: `${link.path}` }" class="router">{{
          link.name
        }}</router-link>
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
          name: "Deliver to a customer",
          path: "To Customers",
        },
        {
          icon: "mdi-home-city",
          name: "Send inventory to Sendy",
          path: "To Sendy",
        },
        {
          icon: "mdi-plus-thick",
          name: "Add Products",
          path: "AddProducts",
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
}
</style>
