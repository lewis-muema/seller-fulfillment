<template>
  <div>
    <v-dialog v-model="dialog" :retain-focus="false">
      <div>
        <v-card class="integration-card">
          <v-btn
            class="ma-2"
            variant="text"
            icon="mdi-close"
            size="small"
            @click="$emit('clicked', false)"
          ></v-btn>
          <v-row>
            <v-col :key="n" cols="12" sm="6">
              <v-img
                class="bg-white"
                :aspect-ratio="1"
                src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/image.png"
              ></v-img>
            </v-col>
            <v-col :key="n" cols="12" sm="6">
              <div class="integrations-content">
                <div>
                  <h4>{{ $t("merchant.connectStore") }}</h4>
                  <p>
                    {{ $t("merchant.clickToStart") }}
                  </p>
                  <div class="integrations-actions-inner">
                    <v-btn
                      class="sendy-btn-default"
                      @click="storePlatformDialog = true"
                    >
                      {{ $t("merchant.getStarted") }}
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-dialog>
    <storePlatform
      v-if="storePlatformDialog"
      :displayDialog="storePlatformDialog"
      @selected="onSelectChild"
    />
  </div>
</template>
<script>
import storePlatform from "./storePlatform.vue";

export default {
  components: { storePlatform },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
    storePlatformDialog: false,
  }),
  mounted() {
    this.dialog = this.showDialog;
  },
  watch: {
    showDialog() {
      if (this.showDialog) this.dialog = true;
    },
  },
  methods: {
    onSelectChild() {
      this.storePlatformDialog = false;
    },
  },
};
</script>
<style scoped>
.ma-2 {
  float: right;
  margin-top: -15px !important;
  margin-right: -15px !important;
}
.integration-card {
  width: 850px;
  min-height: 400px;
  padding: 25px;
}
.integrations-actions-inner {
  display: grid;
  grid-auto-flow: column;
}
.integrations-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.sendy-btn-default {
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
  color: #ffffff !important;
  border: 1px solid #324ba8 !important;
  background-color: #324ba8 !important;
  width: 50%;
}
</style>
