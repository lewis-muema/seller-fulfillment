<template>
  <div>
    <v-card variant="outlined" class="product-summary-card">
      <div class="p-3">
        <span class="product-summary-title">Summary</span>
        <span class="product-summary-edit"
          ><v-icon class="pr-3"> mdi mdi-pencil</v-icon>Edit</span
        >
      </div>
      <v-list v-for="(summary, index) in productSummary" :key="index">
        <v-list-item>
          <v-list-item-avatar>
            <span class="pr-3">
              <v-icon> mdi mdi-window-close </v-icon>
              img
            </span>
          </v-list-item-avatar>
          <v-list-item-header>
            <v-list-item-title class="desktop-dashboard-link-title">{{
              summary.name
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ summary.quantity }}</v-list-item-subtitle>
            <p class="product-summary-amount">{{ summary.amount }}</p>
          </v-list-item-header>
        </v-list-item>
        <v-divider></v-divider>
      </v-list>
      <div>
        <p class="pl-2">18 items added</p>
        <total-amount />
      </div>
    </v-card>
  </div>
</template>

<script>
import totalAmount from "@/modules/inventory/sendproducts/components/totalAmount";
export default {
  components: { totalAmount },
  data() {
    return {
      productSummary: [
        {
          name: "ShearButter",
          quantity: "400ml",
          amount: "KES 450",
        },
        {
          name: "ShearButter",
          quantity: "400ml",
          amount: "KES 450",
        },
        {
          name: "ShearButter",
          quantity: "400ml",
          amount: "KES 450",
        },
      ],
    };
  },
};
</script>

<style>
.product-summary-card {
  border-color: #e2e7ed;
}
.product-summary-amount {
  font-size: 12px;
}
hr {
  margin: 0 !important;
}
.product-summary-edit {
  float: right;
  color: #324ba8;
}
.product-summary-edit .mdi {
  font-size: 14px;
}
.product-summary-title {
  font-size: 19px;
}
</style>
