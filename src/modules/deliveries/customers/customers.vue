<template>
  <div>
    <Tabs />
    <Deliveries />
  </div>
</template>

<script>
import Tabs from "./components/tabs.vue";
import Deliveries from "./components/deliveries.vue";
import { mapMutations, mapGetters } from "vuex";
import eventsMixin from "../../../mixins/events_mixin";

export default {
  components: { Tabs, Deliveries },
  mixins: [eventsMixin],
  data: () => ({}),
  computed: {
    ...mapGetters(["getStorageUserDetails"]),
  },
  mounted() {
    this.setComponent("common.deliveriesToCustomers");
    this.sendSegmentEvents({
      event: "See on going Deliveries",
      data: {
        userId: this.getStorageUserDetails.business_id,
        email: this.getStorageUserDetails.email,
        clientType: "web",
        device: "desktop",
      },
    });
  },
  methods: {
    ...mapMutations(["setComponent"]),
  },
};
</script>

<style></style>
