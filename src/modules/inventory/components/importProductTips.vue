<template>
  <div>
    <v-card variant="outlined" class="import-product-tips-card">
      <h5>Tips</h5>
      <ul>
        <li>
          <a href="" class="download-csv-link">Download our CSV template</a>
        </li>
        <li>Fill in the fields</li>
        <li>For images column, paste the url link to the product</li>
        <li>Save and upload the file</li>
        Learn more about
        <a href="" class="upload-products-text">uploading products</a>
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
