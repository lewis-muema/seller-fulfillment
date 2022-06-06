<template>
  <invoice-list />
</template>

<script>
import invoiceList from "./components/invoiceList.vue";
export default {
  components: { invoiceList },
  data() {
    return {};
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.invoices"));
    setTimeout(() => {
      this.$store.commit("setLoader", "");
    }, 3000);
  },
};
</script>

<style></style>
