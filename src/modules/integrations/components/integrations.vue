<template>
  <div class="integrations-container">
    <v-card
      class="integrations-card mx-auto"
      max-width="1000 1   1§  1ES B"
      variant="outlined"
    >
      <v-card-item>
        <div class="integration-text mb-1">Connected store</div>
        <v-divider></v-divider>
        <div class="integration-content">
          <div class="text-caption">No store integration found</div>
          <v-card-actions>
            <v-btn
              prepend-icon="mdi-sync"
              class="integration-button"
              variant="outlined"
              @click="addStoreDialog = true"
            >
              Connect your online store
            </v-btn>
          </v-card-actions>
          <div class="text-caption">
            Learn more about connecting your store
            <v-icon start icon="mdi-arrow-right" size="small"></v-icon>
          </div>
        </div>
      </v-card-item>
      <!-- <v-card-item>
        <div class="integration-card-inner">
          <div class="integration-text mb-1">API Keys</div>
          <v-divider></v-divider>
          <div class="integration-content">
            <div class="text-caption">No API Keys found</div>
            <v-card-actions>
              <v-btn
                prepend-icon="mdi-plus"
                class="integration-button"
                variant="outlined"
              >
                Create new API Key
              </v-btn>
            </v-card-actions>
            <div class="text-caption">
              Learn more about Sendy Fulfillment API
              <v-icon start icon="mdi-arrow-right" size="small"></v-icon>
            </div>
          </div>
        </div>
      </v-card-item> -->
    </v-card>
    <addStore
      v-if="addStoreDialog"
      :showDialog="addStoreDialog"
      @clicked="onClickChild"
    />
  </div>
</template>
<script>
import addStore from "./addStore.vue";

export default {
  components: { addStore },
  data: () => ({
    addStoreDialog: false,
  }),
  methods: {
    onClickChild() {
      this.addStoreDialog = false;
    },
  },
};
</script>
<style scoped>
.integrations-container {
  width: 85%;
  margin: 50px auto;
}
.integrations-card {
  padding: 20px !important;
  border-color: #e2e7ed;
}
.integration-card-inner {
  margin-top: 60px !important;
}
.integration-content {
  text-align: center;
  margin: 30px;
}
.v-card-actions {
  display: block !important;
}
.integration-text {
  text-transform: inherit !important;
  font-size: 16px !important;
  color: #606266;
  line-height: 24px;
  font-weight: 700;
}
.integration-button {
  border-color: #324ba8;
  text-transform: inherit;
  color: #324ba8;
  font-size: 12px;
  line-height: 18px;
}
.integration-button-dark {
  background-color: #324ba8;
  color: #ffffff !important;
}
.block-add-integration {
  text-align: right;
  margin-top: -36px;
  margin-bottom: 5px;
}
</style>
