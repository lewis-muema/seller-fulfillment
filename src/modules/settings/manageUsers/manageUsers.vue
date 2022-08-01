<template>
  <div>
    <users />
  </div>
</template>

<script>
import users from "./components/users.vue";
import { mapMutations, mapGetters } from "vuex";

export default {
  components: { users },
  data() {
    return {
      actionsToggle: false,
      index: 0,
      viewUsers: false,
    };
  },
  computed: {
    ...mapGetters(["getUsers"]),
    userRow() {
      return this.getUsers[this.index];
    },
  },
  mounted() {
    this.setComponent("common.manageUsers");
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
    toggleUser(val) {
      this.viewUsers = val;
    },
  },
};
</script>

<style></style>
