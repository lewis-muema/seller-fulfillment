<template>
  <div class="invoices-details-container">
    <div>
      <p>
        <span :class="getLoader.invoices">
          {{ $t("payments.billedFrom") }}
        </span>
      </p>
      <p v-for="(item, i) in billedFrom" :key="i">
        <span :class="getLoader.invoices">
          {{ item }}
        </span>
      </p>
    </div>
    <div>
      <p>
        <span :class="getLoader.invoices">
          {{ $t("payments.billedTo") }}
        </span>
      </p>
      <p v-for="(item, i) in billedTo" :key="i">
        <span :class="getLoader.invoices">
          {{ item }}
        </span>
      </p>
    </div>
    <div>
      <p>
        <span :class="getLoader.invoices">
          {{ $t("payments.invoiceDetails") }}
        </span>
      </p>
      <p>
        <span :class="getLoader.invoices">
          {{ $t("payments.invoiceNumber") }}: {{ invoiceDetails.invoiceNumber }}
        </span>
      </p>
      <p>
        <span :class="getLoader.invoices">
          {{ $t("payments.dateSent") }}: {{ invoiceDetails.dateSent }}
        </span>
      </p>
      <p>
        <span :class="getLoader.invoices">
          {{ $t("payments.dueDate") }}: {{ invoiceDetails.dueDate }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getLoader"]),
  },
  data() {
    return {
      billedFrom: [
        "Sendy Kenya Marketplace limited",
        "Marsabit Plaza",
        "P.O. BOX 10441",
        "00100 Nairobi",
      ],
      billedTo: ["Smart Collections", "Kikuyu Road"],
      invoiceDetails: {
        invoiceNumber: 9459494,
        dateSent: "3/1/2022",
        dueDate: "6/1/2022",
      },
    };
  },
};
</script>

<style>
.invoices-details-container {
  display: grid;
  grid-template-columns: auto auto auto;
  margin: 30px;
  padding: 35px;
  font-size: 14px;
  line-height: 25px;
  border: 1px solid #e2e7ed;
  border-radius: 10px;
  background: white;
}
</style>
