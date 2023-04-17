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
                class="integration-image bg-white"
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
                      @click="$router.push({ name: 'SetupStep1' })"
                      data-test="get-started-btn"
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
  </div>
</template>
<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    dialog: false,
  }),
  mounted() {
    this.dialog = this.showDialog;
  },
  watch: {
    showDialog() {
      if (this.showDialog) this.dialog = true;
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
  padding: 16px;
  gap: 4px;
  width: 1024px;
  min-height: 526px;
  background: #ffffff;
  border-radius: 6px;
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
.integration-image {
  width: 573px;
  height: 394px;
}
</style>
