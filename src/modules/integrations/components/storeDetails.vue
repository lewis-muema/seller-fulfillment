<template>
  <div>
    <div class="integrations-container">
      <div>
        <div class="top-action-bar">
          <v-btn class="back-btn" dark @click="$router.go(-1)">
            <v-icon large dark left> mdi-arrow-left </v-icon>
          </v-btn>
        </div>
        <div class="store-platform">
          <v-icon icon="mdi-access-point" size="x-large"></v-icon
          ><span class="store-platform-name">{{ platform }}</span>
        </div>
        <h5>Online Store Details</h5>
        <div v-if="platform === 'Shopify'">
          <v-form ref="form" v-model="valid" lazy-validation>
            <div>
              <v-text-field
                v-model="storeName"
                :counter="10"
                :rules="nameRules"
                label="Store Name"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="shopUrl"
                :counter="10"
                :rules="urlRules"
                label="Shop URL"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="APIKey"
                :rules="keyRules"
                label="API Key"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="APIPassword"
                :rules="passwordRules"
                label="API Password"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="secret"
                :rules="secretRules"
                label="Shared Secret"
                required
                density="compact"
              ></v-text-field>
            </div>
            <div></div>
          </v-form>
          <div class="text-center">
            <v-dialog v-model="dialog">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="sendy-btn-default mr-4"
                  v-bind="props"
                  @click="validate"
                >
                  Connect
                </v-btn>
              </template>

              <v-card class="connect-store">
                <span class="dialog-title"> Adding your store </span>
                <div class="connect-progress">
                  <v-progress-circular
                    :width="3"
                    color="indigo-darken-2"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <span class="">This will take a moment...</span>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <div v-else class="integrations-actions">
          <v-form ref="form" v-model="valid" lazy-validation>
            <div>
              <h6>
                Please download and upload a bridge file to the root of your
                store first
              </h6>
              <v-text-field
                v-model="storeName"
                :counter="10"
                :rules="nameRules"
                label="Store Name"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="storeUrl"
                :counter="10"
                :rules="urlRules"
                label="Store URL"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="storeKey"
                :rules="keyRules"
                label="Store Key"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="bridgeUrl"
                :rules="bridgeUrlRules"
                label="Bridge URL"
                required
                density="compact"
              ></v-text-field>
            </div>
            <div></div>
          </v-form>
          <div class="text-center">
            <v-dialog v-model="dialog">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="sendy-btn-default mr-4"
                  v-bind="props"
                  @click="validate"
                >
                  Connect
                </v-btn>
              </template>

              <v-card class="connect-store">
                <span class="dialog-title"> Adding your store </span>
                <div class="connect-progress">
                  <v-progress-circular
                    :width="3"
                    color="indigo-darken-2"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <span class="">This will take a moment...</span>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    storeName: "",
    APIKey: "",
    APIPassword: "",
    secret: "",
    shopUrl: "",
    nameRules: [
      (v) => !!v || "Store name is required",
      (v) =>
        (v && v.length <= 10) || "Store name must be less than 10 characters",
    ],
    bridgeUrl: "",
    storeUrl: "",
    keyRules: [(v) => !!v || "API Key is required"],
    secretRules: [(v) => !!v || "Shared secret is required"],
    urlRules: [(v) => !!v || "Shop url is required"],
    bridgeUrlRules: [(v) => !!v || "Bridge url is required"],
    passwordRules: [(v) => !!v || "API Password is required"],
    select: null,
    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
    checkbox: false,
    dialog: false,
    platform: "",
  }),
  mounted() {
    this.platform = this.$route.params.platform;
  },
  computed: {},
  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();

      if (valid) alert("Form is valid");
    },
    reset() {
      this.$refs.form.reset();
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
  },
};
</script>
<style scoped>
.integrations-container {
  width: 50%;
  margin: 100px auto;
}
.sendy-btn-default {
  float: right;
  width: 200px;
}
.top-action-bar {
  margin-bottom: 20px;
}
.back-btn {
  box-shadow: none !important;
}
.store-platform {
  margin-bottom: 20px;
}
.store-platform-name {
  margin-left: 10px;
  font-weight: 500;
}
.connect-store {
  min-width: 400px;
  min-height: 170px;
  font-weight: 500;
  margin: 10px;
  text-align: center !important;
}
.connect-progress {
  display: block;
  margin: 20px;
}
.dialog-title {
  font-size: 25px;
}
</style>
