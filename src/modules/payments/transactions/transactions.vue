<template>
  <div>
    <make-payment class="statements-payment-banner wallet-banner-override" />
    <div class="row">
      <tranactionsList class="col-7" />
      <transcationActions class="col-4" />
    </div>
  </div>
</template>

<script>
import tranactionsList from "./components/transactionsList.vue";
import transcationActions from "./components/transactionActions.vue";
import makePayment from "../statements/components/makePayment.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  components: {
    tranactionsList,
    makePayment,
    transcationActions,
  },
  mounted() {
    this.setComponent("payments.transactions");
  },
  methods: {
    ...mapActions(["requestAxiosGet"]),
    ...mapMutations(["setComponent"]),
  },
};
</script>

<style></style>
