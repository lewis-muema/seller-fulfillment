<template>
  <div>
    <div v-if="!prompt" class="statements-top-bar-container">
      <div>
        <p class="statements-top-bar-description">
          <span>
            <i class="mdi mdi-cash-multiple statements-top-bar-cash-icon"></i>
          </span>
          <span :class="getLoader">
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
    <div class="container-border">
      <statement-list />
    </div>
  </div>
</template>

<script>
import makePayment from "./components/makePayment.vue";
import statementList from "./components/statementList.vue";
import { mapMutations, mapGetters } from "vuex";

export default {
  components: { makePayment, statementList },
  computed: {
    ...mapGetters(["getLoader"]),
  },
  data() {
    return {
      orders: "3",
      amount: "KES 750",
      billingCycle: "Daily",
      prompt: true,
    };
  },
  mounted() {
    this.setComponent(this.$t("common.statements"));
    setTimeout(() => {
      this.setLoader("");
      document.querySelector(".v-expansion-panel-title").click();
    }, 1000);
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
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
