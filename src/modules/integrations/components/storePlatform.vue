<template>
  <div>
    <div class="integrations-container">
      <div v-if="platformSet" class="top-action-bar">
        <v-btn class="back-btn" dark @click="$router.go(-1)">
          <v-icon large dark left> mdi-arrow-left </v-icon>
        </v-btn>
      </div>
      <h5>What platform do you use?</h5>
      <div>
        <v-select
          label="Select platform"
          density="compact"
          v-model="platform"
          @update:modelValue="onPlatformSet"
          :items="['Woocommerce', 'Shopify', 'Magento', 'Open Cart']"
        ></v-select>
      </div>
      <div v-if="platformSet">
        <h6>Is your platform missing?</h6>
        <div class="integrations-actions-inner">
          <v-btn class="sendy-btn-text" variant="text">
            Integrate my online store manually
          </v-btn>
          <v-btn
            class="sendy-btn-default"
            @click="
              $router.push({
                name: 'Store Details',
                params: { platform: platform },
              })
            "
          >
            Continue
          </v-btn>
        </div>
        <div class="integrations-actions">
          <h6>Useful links</h6>
          <v-btn class="sendy-btn-text" variant="text">
            Learn about integrating with Sendy API
          </v-btn>
          <v-btn class="sendy-btn-text" variant="text">
            Go to Sendy API documentation
          </v-btn>
        </div>
        <div>
          <h6>Is your platform missing?</h6>
          <v-btn class="sendy-btn-text" variant="text">
            Let us know about it
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      platform: "",
      platformSet: false,
    };
  },
  methods: {
    onPlatformSet() {
      this.platformSet = true;
    },
  },
};
</script>
<style scoped>
.integrations-container {
  width: 50%;
  margin: 100px auto;
}
.integrations-actions {
  margin-top: 100px;
  margin-bottom: 50px;
}
.top-action-bar {
  margin-bottom: 20px;
}
.back-btn {
  box-shadow: none !important;
}
</style>
