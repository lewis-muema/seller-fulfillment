<template>
  <div class="import-products-container">
    <v-row>
      <v-col cols="6">
        <v-card variant="outlined" class="desktop-import-card">
          <div class="d-flex desktop-header-title mb-2">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.back()"
            ></i>

            <v-card-title class="text-center"
              >{{ $t("inventory.importProducts") }}
            </v-card-title>
          </div>
          <div class="d-flex progress-bar-container" v-if="progressBar">
            <v-icon class="mdi-file mt-3">mdi mdi-file</v-icon>
            <div>
              {{ $t("inventory.productList") }}
              <v-progress-linear
                class="import-products-progess-bar"
                :model-value="100"
                color="#324ba8"
                rounded
                height="10"
              ></v-progress-linear>
            </div>
          </div>
          <div v-else>
            <p>
              {{ $t("inventory.toUploadProducts") }}
              <a href="" class="download-template-text">{{
                $t("inventory.downloadTemplate")
              }}</a
              >{{ $t("inventory.addDetails") }}
            </p>
            <div class="drag-files-box">
              <p>
                {{ $t("inventory.dragFiles") }}
                <span class="click-browse"
                  ><a href="">{{ $t("inventory.clickBrowse") }}</a></span
                >
                {{ $t("inventory.toUpload") }}
              </p>
              <p class="csv">{{ $t("inventory.csv") }}</p>
            </div>
          </div>
          <button
            type="submit"
            :class="
              progressBar
                ? 'btn btn-primary upload-file-button-progress'
                : 'btn btn-primary upload-file-button'
            "
            @click="uploadFile"
          >
            {{ $t("inventory.upload") }}
          </button>
        </v-card>
      </v-col>
      <v-col cols="5">
        <import-product-tips />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import importProductTips from "./importProductTips";
import { mapMutations } from "vuex";

export default {
  components: { importProductTips },
  data() {
    return {
      progressBar: false,
      knowledge: 33,
    };
  },
  mounted() {
    this.setComponent("common.import");
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
    uploadFile() {
      this.progressBar = true;
    },
  },
};
</script>

<style>
.desktop-import-card {
  border-color: #e2e7ed;
  height: 100%;
  margin: 50px 0px 0px 50px;
  padding: 10px 50px 0px 50px;
}
.drag-files-box {
  height: 250px !important;
  width: auto;
  border: 1px dashed grey;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.upload-file-button {
  width: 30%;
  margin: 30px 50px;
  float: right;
}
.upload-file-button-progress {
  width: 30%;
  margin: 30% 50px 30px 0px;
  float: right;
}
.csv {
  color: #909399;
}
.mdi-file {
  color: #324ba8;
}
.click-browse > a {
  color: #324ba8 !important;
  text-decoration: none;
}
.download-template-text {
  color: #324ba8 !important;
  font-weight: 400;
}
.progress-bar-container {
  margin-top: 30% !important;
}
.import-products-progess-bar {
  width: 50vh !important;
}
</style>
