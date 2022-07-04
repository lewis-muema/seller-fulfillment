<template>
  <div>
    <users @viewUser="viewUser" v-if="!viewUsers" />
    <view-user :userRow="userRow" @viewUser="toggleUser" v-else />
    <user-added />
  </div>
</template>

<script>
import viewUser from "./components/viewUser.vue";
import users from "./components/users.vue";
import userAdded from "./components/userAdded.vue";
import { mapMutations, mapGetters } from "vuex";

export default {
  components: { viewUser, users, userAdded },
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
    this.setLoader("");
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
    viewUser(index) {
      this.index = index;
      this.viewUsers = true;
    },
    toggleUser(val) {
      this.viewUsers = val;
    },
  },
};
</script>

<style></style>
