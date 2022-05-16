<template>
  <div class="import-products-container">
    <v-col cols="6" class="mx-auto">
      <v-card variant="outlined" class="desktop-import-card">
        <div class="d-flex desktop-header-title mt-2 mb-2">
          <router-link to="auth/sign-up">
            <i class="mdi mdi-arrow-left" aria-hidden="true"></i
          ></router-link>

          <v-card-title class="text-center">Import Products </v-card-title>
        </div>
        <div class="" v-if="progressBar">
          <el-progress :percentage="100" :stroke-width="12" color="#324BA8" />
        </div>
        <div v-else>
          <p>Download our CSV template and add your product details</p>
          <div class="drag-files-box">
            <p>
              Drag file here or
              <span class="click-browse">click browse</span> to upload
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
  </div>
</template>

<script>
export default {
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
      console.log("clicked");
      this.progressBar = true;
    },
  },
};
</script>

<style>
.desktop-import-card {
  border-color: #e2e7ed;
  height: 100%;
  margin-top: 50px;
  padding-left: 50px;
}
.drag-files-box {
  height: 300px !important;
  width: auto;
  margin-right: 50px;
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
.el-progress {
  margin-top: 30%;
}
</style>
