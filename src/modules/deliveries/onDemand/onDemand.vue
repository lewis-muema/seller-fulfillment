<template>
  <div><deliveries />x</div>
</template>

<script>
import Deliveries from "./components/deliveries.vue";
import { mapMutations, mapGetters } from "vuex";
import eventsMixin from "../../../mixins/events_mixin";

export default {
  components: { Deliveries },
  mixins: [eventsMixin],
  data: () => ({}),
  computed: {
    ...mapGetters(["getStorageUserDetails"]),
  },
  mounted() {
    this.setComponent("common.onDemandDeliveries");
    this.sendSegmentEvents({
      event: "onDemandDeliveries",
      data: {
        userId: this.getStorageUserDetails.business_id,
        clientType: "web",
        device: "desktop",
      },
    });
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
  },
};
</script>

<style></style>
