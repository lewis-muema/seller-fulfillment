<template>
  <div>
    <div v-if="!prompt" class="statements-top-bar-container">
      <div>
        <p class="statements-top-bar-description">
          <span>
            <i class="mdi mdi-cash-multiple statements-top-bar-cash-icon"></i>
          </span>
          <span :class="$store.getters.getLoader">
            <b>{{ amount }}</b> {{ $t("payments.youWillBeCharged") }}
          </span>
        </p>
      </div>
      <div />
      <div>
        <span> {{ $t("payments.billingCycle") }}: {{ billingCycle }} </span>
      </div>
    </div>
    <make-payment v-else />
    <statement-list />
  </div>
</template>

<script>
import makePayment from "./components/makePayment.vue";
import statementList from "./components/statementList.vue";

export default {
  components: { makePayment, statementList },
  data() {
    return {
      orders: "3",
      amount: "KES 750",
      billingCycle: "Daily",
      prompt: true,
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.statements"));
    setTimeout(() => {
      this.$store.commit("setLoader", "");
      document.querySelector(".v-expansion-panel-title").click();
    }, 3000);
  },
};
</script>

<style>
.statements-top-bar-container {
  display: grid;
  grid-template-columns: 70% 15% 15%;
  margin: 50px 30px;
}
.statements-top-bar-description {
  font-size: 16px;
}
.statements-info-bar-container {
  display: grid;
  grid-template-columns: 15% 15% 5% 65%;
}
</style>
