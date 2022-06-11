<template>
  <div>
    <v-card variant="outlined" class="import-product-tips-card">
      <h5>{{ $t("inventory.tips") }}</h5>
      <ul>
        <li>
          <a href="" class="download-csv-link">{{
            $t("inventory.downloadCSV")
          }}</a>
        </li>
        <li>{{ $t("inventory.fillFields") }}</li>
        <li>{{ $t("inventory.pasteUrl") }}</li>
        <li>{{ $t("inventory.saveFile") }}</li>
        {{
          $t("inventory.learnMore")
        }}
        <a href="" class="upload-products-text">
          {{ $t("inventory.uploadProducts") }}</a
        >
      </ul>
    </v-card>
  </div>
</template>

<script>
export default {};
</script>

<style>
.import-product-tips-card {
  border-color: #e2e7ed;
  height: 100%;
  margin: 50px 0px 0px 50px;
  padding: 20px 10px;
  background-color: #f0f3f7;
}
li {
  line-height: 2rem;
}
.download-csv-link {
  color: #324ba8 !important;
  text-decoration: none;
}
.upload-products-text {
  color: #324ba8 !important;
}
</style>
