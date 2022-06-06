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
    userRow() {
      return this.$store.getters.getUsers[this.index];
    },
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.manageUsers"));
    this.$store.commit("setLoader", "");
  },
  methods: {
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
