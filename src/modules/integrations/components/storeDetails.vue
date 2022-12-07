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
        <h5>{{ $t("merchant.storeDetails") }}</h5>
        <div v-if="platform === 'Shopify'">
          <v-form ref="form" v-model="valid" lazy-validation>
            <div>
              <v-text-field
                v-model="storeName"
                :counter="10"
                :label="$t('merchant.storeName')"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="shopUrl"
                :counter="10"
                :label="$t('merchant.storeUrl')"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="APIKey"
                :label="$t('merchant.APIKey')"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="APIPassword"
                :label="$t('merchant.APIPassword')"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="secret"
                :label="$t('merchant.sharedSecret')"
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
                  @click="connect"
                >
                  {{ $t("merchant.connect") }}
                </v-btn>
              </template>

              <v-card class="connect-store">
                <span class="dialog-title"> {{ $t("merchant.adding") }}</span>
                <div class="connect-progress">
                  <v-progress-circular
                    :width="3"
                    color="indigo-darken-2"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <span class="">{{ $t("merchant.waiting") }}</span>
              </v-card>
            </v-dialog>
          </div>
        </div>
        <div v-else class="integrations-actions">
          <v-form ref="form" v-model="valid" lazy-validation>
            <div>
              <h6>
                {{ $t("merchant.downloadBridge") }}
              </h6>
              <v-text-field
                v-model="storeName"
                :counter="10"
                :label="$t('merchant.storeName')"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="storeUrl"
                :counter="10"
                :label="$t('merchant.storeUrl')"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="storeKey"
                :label="$t('merchant.storeKey')"
                required
                density="compact"
              ></v-text-field>

              <v-text-field
                v-model="bridgeUrl"
                :label="$t('merchant.bridgeUrl')"
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
                  @click="connect"
                >
                  {{ $t("merchant.connect") }}
                </v-btn>
              </template>

              <v-card class="connect-store">
                <span class="dialog-title"> {{ $t("merchant.adding") }}</span>
                <div class="connect-progress">
                  <v-progress-circular
                    :width="3"
                    color="indigo-darken-2"
                    indeterminate
                  ></v-progress-circular>
                </div>
                <span class="">{{ $t("merchant.waiting") }}</span>
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
    bridgeUrl: "",
    storeUrl: "",
    select: null,
    checkbox: false,
    dialog: false,
    platform: "",
  }),
  mounted() {
    this.platform = this.$route.params.platform;
  },
  computed: {},
  methods: {
    connect() {},
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
