<template>
  <div>
    <addStore />
  </div>
</template>

<script>
import addStore from "./components/addStore.vue";
import { mapMutations } from "vuex";

export default {
  components: { addStore },
  data() {
    return {};
  },
  mounted() {
    this.setComponent("common.integrations");
  },
  methods: {
    ...mapMutations(["setComponent"]),
  },
};
</script>

<style></style>
