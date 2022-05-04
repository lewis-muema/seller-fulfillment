<template>
  <div>
    <v-container>
      <span class="">
        <h5>Welcome Irene</h5>
        <p>Complete the steps below to fulfilling your first order</p>
      </span>
      <v-row>
        <v-col cols="9" class="desktop-dashboard-content">
          <v-card
            tile
            variant="outlined"
            class="mt-3 mx-auto"
            v-for="(content, i) in dashboardContent"
            :key="i"
          >
            <div class="desktop-dashboard-list">
              <v-list density="compact">
                <v-list-item>
                  <div class="d-flex">
                    <v-icon class="desktop-content-icon">
                      {{ content.icon }}</v-icon
                    >
                    <v-list-item-title>
                      <div class="desktop-content-title">
                        {{ content.title }}
                      </div>
                      <div>
                        {{ content.text }}
                      </div>
                      <button
                        type="submit"
                        class="btn btn-primary desktop-content-button"
                      >
                        {{ content.button }}
                      </button>
                    </v-list-item-title>
                  </div>
                </v-list-item>
              </v-list>
            </div>
          </v-card>
        </v-col>
        <v-col cols="3" class="desktop-dashboard-content mt-3">
          <v-card variant="outlined">
            <v-list>
              <p>Get more out of Sendy fulfillment</p>
              <v-list-item v-for="(link, i) in dashboardLinks" :key="i">
                <div class="d-flex">
                  <v-icon class="dashboard-links-icon">{{ link.icon }}</v-icon>
                  <v-list-item-title>
                    <div class="desktop-dashboard-link-title">
                      {{ link.title }}
                    </div>
                    <div class="desktop-dashboard-link-name">
                      {{ link.name }}
                    </div>
                    <v-divider></v-divider>
                  </v-list-item-title>
                </div>
              </v-list-item>
            </v-list>
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
      dashboardContent: [
        {
          title: "Account Created",
          text: "",
          button: "",
          icon: "mdi-check-circle",
        },
        {
          title: "Add your Products",
          text: "Add or import the list of products that you will be fulfilling",
          button: "Add Products",
          icon: "mdi-check-circle",
        },
        {
          title: "Send us your inventory",
          text: "Send us the products that you want us to deliver to your customers",
          button: "Send inventory",
          icon: "mdi-check-circle",
        },
        {
          title: "Deliver to Customer",
          text: "Send a delivery to your customer",
          button: "Deliver to a customer",
          icon: "mdi-check-circle",
        },
      ],
      dashboardLinks: [
        {
          title: "Need help?",
          name: `Book a time with one of our fulfillment Specialist`,
          icon: "mdi-face-agent",
        },
        {
          title: "Watch tutorial",
          name: "Learn how to send us your inventory",
          icon: "mdi-face-agent",
        },
        {
          title: "Meet us in person",
          name: "Attend one of our upcoming events",
          icon: "mdi-face-agent",
        },
      ],
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.getStarted"));
  },
};
</script>

<style>
.desktop-dashboard-content .v-card {
  border-color: #e2e7ed;
}
.desktop-content-button {
  line-height: 18px !important;
  font-size: 14px !important;
  margin: 15px 0px;
}
.desktop-content-icon {
  color: #116f28;
  margin: 0px 10px 0px 0px;
}
.dashboard-links-icon {
  background: #d3ddf6;
  height: 30px;
  width: 30px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #324ba8;
  margin: 0px 10px 0px 0px;
}
.desktop-dashboard-list {
  padding: 8px 0px !important;
}
.desktop-dashboard-link-title {
  color: #324ba8;
  font-weight: 500;
}
.desktop-dashboard-link-name {
  overflow-wrap: break-word !important;
  overflow: hidden !important;
}
</style>
