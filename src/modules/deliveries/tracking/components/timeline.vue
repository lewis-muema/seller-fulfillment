<template>
  <div class="timline-container">
    <p class="timeline-title">
      {{ $t("deliveries.timeline") }}
    </p>
    <div>
      <el-timeline>
        <el-timeline-item
          class="el-timeline-item-desktop"
          v-for="(activity, index) in getOrderTimelines"
          :key="index"
          :icon="
            activity.event_code === 'EVENT_DELIVERY_FAILED'
              ? closeIcon
              : getTimelineIcons[activity.event_tense].icon
          "
          :type="activity.type"
          :color="
            activity.event_code === 'EVENT_DELIVERY_FAILED'
              ? '#9b101c'
              : getTimelineIcons[activity.event_tense].color
          "
          :size="activity.size"
          :hollow="getTimelineIcons[activity.event_tense].hollow"
          :class="getTimelineIcons[activity.event_tense].iconClass"
        >
          <span
            :class="
              activity.event_code === 'EVENT_DELIVERY_FAILED'
                ? 'failed-delivery-timeline-text'
                : `${activity.event_tense}-timeline-text`
            "
          >
            <span :class="getLoader.orderTimeline">
              {{ formatStatus(activity.translated_event_code, activity) }}
            </span>
          </span>
          <div
            v-if="
              getDeliveryAttempts.length > 0 &&
              activity.event_code === 'EVENT_DELIVERY_FAILED'
            "
            class="timeline-delivery-attempts"
            @click="
              setOverlayStatus({
                overlay: true,
                popup: 'attempts',
              })
            "
          >
            <span :class="getLoader.orderTimeline">
              {{ getDeliveryAttempts.length }} {{ $t("deliveries.attempts") }}
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { shallowRef } from "vue";
import statusMixin from "../../../../mixins/status_mixin";
import { mapMutations, mapGetters, mapActions } from "vuex";
import { Close } from "@element-plus/icons-vue";
import eventLabels from "../../../../mixins/event_labels";
import placeholder from "../../../../mixins/placeholders";

export default {
  mixins: [statusMixin, eventLabels, placeholder],
  data() {
    return {
      activities: [],
      events: [],
      rider: {},
      timeline: [],
      activeEvent: "",
      activeIndex: 0,
      overlay: false,
      closeIcon: shallowRef(Close),
    };
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getOrderEvents",
      "getData",
      "getOrderStatuses",
      "getRescheduledOrderTimelines",
      "getOrderTimelines",
      "getTimelineIcons",
      "getDeliveryAttempts",
      "getStorageUserDetails",
    ]),
  },
  watch: {
    "$store.state.orderTrackingData": function orderTrackingData() {
      this.fetchOrder();
    },
  },
  mounted() {
    this.setOrderTimelines(this.placeholderOrderTimelines);
  },
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setOverlayStatus",
      "setOrderTimelines",
      "setDeliveryAttempts",
      "setParent",
    ]),
    ...mapActions(["requestAxiosGet"]),
    formatEventName(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    fetchOrder() {
      this.setLoader({
        type: "orderTimeline",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/tracking/summary/${this.$route.params.order_id}`,
      }).then((response) => {
        this.setLoader({
          type: "orderTimeline",
          value: "",
        });
        if (response.status === 200) {
          this.setOrderTimelines(response.data.data.events);
          const events = response.data.data.events;
          if (
            events[events.length - 1].event_code === "EVENT_DELIVERY_FAILED"
          ) {
            this.fetchAttempts();
          }
          if (this.getOrderTimelines[0].event_code.includes("EVENT_DELIVERY")) {
            this.setParent("customer");
          } else if (
            this.getOrderTimelines[0].event_code.includes("EVENT_PICKUP")
          ) {
            this.setParent("sendy");
          }
        }
      });
    },
    fetchAttempts() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `/seller/${this.getStorageUserDetails.business_id}/failed-attempts/${this.$route.params.order_id}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setDeliveryAttempts(response.data.data["failed-attempts"]);
        }
      });
    },
    formatDate(date) {
      return moment(date).format("ddd, MMM Do");
    },
    formatStatus(status, item) {
      if (status) {
        const newStatus = status.split(".").slice(1).join(".");
        if (newStatus) {
          return this.showEventLabels(newStatus, item);
        }
        return status;
      }
    },
  },
};
</script>

<style>
.timeline-title {
  margin-bottom: 20px;
}
.timline-container {
  border: 1px solid #e2e7ed;
  margin-left: 70px;
  padding: 20px;
  border-radius: 10px;
  background: white;
}
.el-timeline-item-desktop {
  padding-right: 40%;
}
.block {
  text-align: left;
  margin-left: 50px;
}
.timeline-failed-attempt-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
}
.timeline-failed-attempt-section {
  margin-bottom: 20px;
  display: flex;
  z-index: 100;
}
.timeline-failed-attempt-label {
  font-size: 15px;
  width: 60%;
}
.timeline-failed-attempt-close {
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.timeline-failed-attempt-row-top {
  display: flex;
  color: #9b101c;
}
.timeline-failed-attempt-row-top-left {
  font-weight: 500;
}
.timeline-failed-attempt-row-top-right {
  font-weight: 300;
  font-size: 12px;
  margin-left: auto;
}
.timeline-failed-attempt-row-bottom {
  color: #606266;
  margin-bottom: 20px;
}
.timeline-events-mobile {
  margin: 25px 0px;
}
.timeline-desktop {
  margin-right: 60%;
  margin-left: 80px;
}
.timeline-mobile {
  margin: 10px 20px;
  color: #606266;
  text-transform: uppercase;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 1.5px;
  text-align: left;
}
.timeline-rider {
  display: flex;
  padding: 20px;
  padding: 20px 0px 0px 0px;
}
.timeline-rider-thumbnail-container {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.timeline-rider-thumbnail {
  width: 70px;
  height: 70px;
  border: 2px solid #303133;
  border-radius: 50px;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.timeline-rider-details {
  margin: 5px 0px;
  margin-bottom: 5px !important;
  width: 200px;
}
.trigger-button {
  margin-left: 20px;
}
.past-timeline-text {
  color: #303133;
}
.present-timeline-text {
  color: #324ba8;
  font-weight: 700;
}
.failed-delivery-timeline-text {
  color: #9b101c;
}
.el-icon-minus .el-timeline-item__node--normal .el-timeline-item__icon {
  background: #324ba8;
  color: #324ba8 !important;
  box-shadow: 0 0 0 0 #324ba8;
  border-radius: 20px;
  animation: pulse-blue 2s infinite;
}
.el-icon-remove .el-timeline-item__node--normal .el-timeline-item__icon {
  background: #9b101c;
  color: #9b101c !important;
  box-shadow: 0 0 0 0 #9b101c;
  border-radius: 20px;
  animation: pulse-red 2s infinite;
}
.mobile-confirmation-pin {
  color: #324ba8;
  font-weight: 700;
}
.mobile-confirmation-pin-container {
  background: #f5f5f5;
  width: max-content;
  height: 35px;
  margin-left: 50px;
  margin-top: -20px;
  padding: 7px 10px 7px 10px;
}
.mobile-confirmation-pin-img {
  margin-top: 2px;
}
.mobile-confirmation-pin-text {
  padding-left: 10px;
}
.timeline-reschedule {
  width: 100%;
  background: #d3ddf6 !important;
  border-color: #d3ddf6 !important;
  color: #324ba8 !important;
  font-weight: 700;
}
.timeline-delivery-attempts {
  color: #9b101c;
  cursor: pointer;
  font-weight: 500;
}
.timeline-reschedule-date {
  font-weight: 600;
  font-size: 15px;
  margin-right: 5px;
}
.future-timeline-text {
  color: #909399;
}
@keyframes pulse-blue {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 #324ba8;
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
}
@keyframes pulse-red {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 #9b101c;
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 0);
  }
}
</style>
