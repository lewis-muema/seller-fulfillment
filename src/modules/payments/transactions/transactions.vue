<template>
  <div>
    <tranactionsList />
  </div>
</template>

<script>
import tranactionsList from "./components/transactionsList.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  components: {
    tranactionsList,
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
