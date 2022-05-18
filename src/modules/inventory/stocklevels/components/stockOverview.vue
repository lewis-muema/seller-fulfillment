<template>
  <div class="">
    <div class="product-details-content mb-3">
      <p class="product-header">Description</p>
      <p>Legit butter</p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">The weight or capacity of the product</p>
      <p>500ml</p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">Inventory Summary</p>
      <p>Total stock available: 56</p>
    </div>
    <v-table>
      <table-header :header="tableHeaders" />
      <tbody>
        <tr v-for="stock in stockSummary" :key="stock.id">
          <td>{{ stock.fulfillmentCenter }}</td>
          <td>{{ stock.available }}</td>
          <td>{{ stock.committed }}</td>
          <td>{{ stock.incoming }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script>
import tableHeader from "@/modules/inventory/tables/tableHeader";
export default {
  components: { tableHeader },
  data() {
    return {
      tableHeaders: [
        "Fulfillment Center",
        "Available",
        "Committed",
        "Incoming",
      ],
      stockSummary: [
        {
          fulfillmentCenter: "Marsabit Plaza",
          available: "23",
          committed: "3",
          incoming: "0",
        },
        {
          fulfillmentCenter: "Ngong FC",
          available: "23",
          committed: "3",
          incoming: "0",
        },
        {
          fulfillmentCenter: "Nigeria MainLand FC",
          available: "23",
          committed: "3",
          incoming: "0",
        },
      ],
    };
  },
};
</script>

<style scoped></style>
