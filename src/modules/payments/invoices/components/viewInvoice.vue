<template>
  <div>
    <div class="invoices-no">
      <i
        class="mdi mdi-arrow-left invoices-arrow-back"
        @click="$router.go(-1)"
      ></i>
      <p class="invoices-title">
        <span :class="$store.getters.getLoader">
          {{ $t("payments.invoice") }} {{ invoice }}
        </span>
      </p>
      <span
        v-if="!$store.getters.getLoader"
        :class="`invoices-${status}-status`"
      >
        {{ status }}
      </span>
      <v-btn class="invoices-download-btn">
        {{ $t("settings.downloadInvoice") }}
      </v-btn>
    </div>
    <invoice-details />
    <invoince-content />
    <transation-history />
  </div>
</template>

<script>
import invoiceDetails from "./inVoiceDetails.vue";
import invoinceContent from "./invoiceContent.vue";
import transationHistory from "./transactionHistory.vue";

export default {
  components: {
    invoiceDetails,
    invoinceContent,
    transationHistory,
  },
  data() {
    return {
      invoice: 9459494,
      status: "Paid",
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("payments.viewInvoice"));
    setTimeout(() => {
      this.$store.commit("setLoader", "");
    }, 3000);
  },
};
</script>

<style>
.invoices-no {
  display: flex;
  margin: 50px 30px;
}
.invoices-arrow-back {
  margin-right: 20px;
  cursor: pointer;
  font-size: 16px;
  color: #909399;
}
.invoices-Pending-status {
  background: #fbdf9a;
  padding: 0px 20px;
  border-radius: 10px;
  color: #7f3b02;
  font-size: 14px;
  margin-left: 20px;
  height: 20px;
}
.invoices-Paid-status {
  background: #b8f5a8;
  padding: 0px 20px;
  border-radius: 10px;
  color: #064a23;
  font-size: 14px;
  margin-left: 20px;
  height: 20px;
}
.invoices-download-btn {
  margin-left: auto;
  height: 40px !important;
  background: white;
  color: #324ba8 !important;
  border: 1px solid #324ba8 !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
</style>
