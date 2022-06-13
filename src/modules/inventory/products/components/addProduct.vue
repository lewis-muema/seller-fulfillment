<template>
  <div>
    <v-row>
      <v-col cols="8" class="mx-auto">
        <v-card variant="outlined" class="p-details">
          <div class="d-flex desktop-header-title mb-2">
            <i
              class="mdi mdi-arrow-left"
              aria-hidden="true"
              @click="$router.back()"
            ></i>
            <v-card-title class="text-center">
              {{ $t("inventory.addProducts") }}
            </v-card-title>
          </div>
          <productInputs action="addProduct" />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import productInputs from "../components/productInputs.vue";
export default {
  components: { productInputs },
  data() {
    return {};
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.addProduct"));
  },
  methods: {},
};
</script>

<style></style>
