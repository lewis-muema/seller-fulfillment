<template>
  <div>
    <preferences />
  </div>
</template>

<script>
import preferences from "./components/preferences.vue";
import { mapMutations } from "vuex";
export default {
  components: { preferences },
  mounted() {
    this.setComponent("common.manageNotificationsPreferences");
  },
  methods: {
    ...mapMutations(["setComponent"]),
  },
};
</script>

<style></style>
