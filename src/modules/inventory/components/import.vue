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

            <v-card-title class="text-center">Import Product </v-card-title>
          </div>
          <div class="d-flex progress-bar-container" v-if="progressBar">
            <v-icon class="mdi-file mt-3">mdi mdi-file</v-icon>
            <div>
              Product list
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
              To upload your products,
              <a href="" class="download-template-text">download our template</a
              >, add your details and upload the file.
            </p>
            <div class="drag-files-box">
              <p>
                Drag file here or
                <span class="click-browse"><a href="">click browse</a></span> to
                upload
              </p>
              <p class="csv">.csv, xls and .xlsx accepted</p>
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
            Upload
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
import importProductTips from "@/modules/inventory/components/importProductTips";
export default {
  components: { importProductTips },
  data() {
    return {
      progressBar: false,
      knowledge: 33,
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.import"));
  },
  methods: {
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
