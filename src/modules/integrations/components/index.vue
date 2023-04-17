<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { provide } from "vue";

export default {
  setup() {
    provide("getUserDetails", JSON.parse(localStorage.getItem("userDetails")));
  },
  mounted() {
    this.setComponent("common.integrations");
  },
  methods: {
    ...mapMutations(["setComponent"]),
  },
};
</script>

<style lang="scss" scoped></style>
