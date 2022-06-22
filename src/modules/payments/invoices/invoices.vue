<template>
  <div class="container-border invoices-top-margin">
    <invoice-list />
  </div>
</template>

<script>
import invoiceList from "./components/invoiceList.vue";
import { mapMutations } from "vuex";

export default {
  components: { invoiceList },
  data() {
    return {};
  },
  mounted() {
    this.setComponent(this.$t("common.invoices"));
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
  },
};
</script>

<style>
.invoices-top-margin {
  margin-top: 70px;
}
</style>
