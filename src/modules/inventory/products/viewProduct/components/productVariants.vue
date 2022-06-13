<template>
  <div class="text-center">
    <v-dialog v-model="show">
      <v-card class="popup-card p-5">
        <span>
          <v-list-item lines="two">
            <v-list-item-header>
              <v-list-item-title>{{ name }}</v-list-item-title>
              <v-list-item-subtitle> {{ quantity }}} </v-list-item-subtitle>
            </v-list-item-header>
          </v-list-item>
        </span>
        <v-table>
          <thead>
            <tr>
              <th>{{ $t("inventory.fulfillmentCenter") }}</th>
              <th>{{ $t("inventory.available") }}</th>
              <th>{{ $t("inventory.committed") }}</th>
              <th>{{ $t("inventory.Incoming") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Baba Ndogo FC</td>
              <td>0</td>
              <td>1</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Westlands FC</td>
              <td>0</td>
              <td>1</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Another FC</td>
              <td>0</td>
              <td>1</td>
              <td>2</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ["visible", "available", "committed", "incoming", "productName"],
  data() {
    return {
      name: "Shear Butter",
      quantity: "250ml",
      dialog: false,
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
};
</script>

<style scoped></style>
