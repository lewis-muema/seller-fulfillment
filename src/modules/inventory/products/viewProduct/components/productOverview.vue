<template>
  <div class="">
    <div class="mb-3">
      <span>
        <img src="" alt="img" />
        Shea Butter
      </span>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">Description</p>
      <p>Legit butter</p>
    </div>
    <div class="product-details-content mb-3">
      <p class="product-header">Price</p>
      <p>400</p>
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
      ],
    };
  },
};
</script>

<style>
.product-details-content > p {
  margin: 0;
  line-height: 2;
}
.product-details-container {
  margin-left: 70px;
}
.product-details-header {
  padding: 30px 0px 0px 30px;
}
.actions-dropdown {
  position: absolute !important;
  right: 0 !important;
  margin-right: 80px !important;
}
.product-header {
  color: #606266;
  font-size: 13px;
}
</style>
