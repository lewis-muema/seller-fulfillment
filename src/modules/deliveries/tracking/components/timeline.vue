<template>
  <div class="timline-container">
    <p class="timeline-title">
      {{ $t("deliveries.timeline") }}
    </p>
    <div>
      <el-timeline>
        <el-timeline-item
          class="el-timeline-item-desktop"
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :class="activity.iconClass"
        >
          <span
            :class="
              activity.active
                ? 'active-timeline-text'
                : activity.event_code === 'event.delivery.failed'
                ? 'failed-delivery-timeline-text'
                : activity.title === 18 && !activity.active
                ? 'inactive-timeline-text'
                : ''
            "
          >
            <span :class="getLoader">
              {{
                formatEventName(
                  $t(`${getOrderEvents[activity.title]}`, {
                    Date: activity.date,
                  })
                )
              }}
            </span>
          </span>
          <div v-if="activity.showDriver" class="timeline-rider">
            <div class="timeline-rider-thumbnail-container">
              <i class="el-icon-user timeline-rider-thumbnail"></i>
            </div>
            <div v-if="rider">
              <p class="timeline-rider-details">{{ rider.name }}</p>
              <p class="timeline-rider-details">{{ rider.vendor_type }}</p>
              <p class="timeline-rider-details">
                {{ rider.vehicle_identifier }}
              </p>
              <p class="timeline-rider-details">{{ rider.phone_number }}</p>
            </div>
          </div>
          <div
            v-if="activity.event_code === 'event.delivery.failed'"
            class="timeline-delivery-attempts"
            @click="
              setOverlayStatus({
                overlay: true,
                popup: 'attempts',
              })
            "
          >
            <span :class="getLoader">
              2 {{ $t("deliveries.attempts") }}
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
import statusMixin from "../../../../mixins/status_mixin";
import { mapMutations, mapGetters } from "vuex";

export default {
  mixins: [statusMixin],
  data() {
    return {
      activities: [],
      events: [],
      rider: {},
      timeline: [],
      activeEvent: "",
      activeIndex: 0,
      overlay: false,
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
    ]),
  },
  mounted() {
    this.sortTimelineEvents();
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setOverlayStatus"]),
    formatEventName(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    },
    sortTimelineEvents() {
      const timeline = this.getData.data.event_time_line;
      const activeEvent = timeline[timeline.length - 1].event_code;
      this.activeIndex = this.getOrderStatuses.findIndex(
        (evt) => evt === activeEvent
      );
      this.activities = this.filteredEventTimelineV2();
      this.rider = this.getData.data.partner_contact_information;
    },
    failedRescheduledStatus() {
      const rescheduled = this.getData.data.event_time_line.filter((event) =>
        this.getStatus([13, 14, 15]).includes(event.event_code)
      );
      const failed = this.getData.data.event_time_line.filter((event) =>
        this.getStatus([12]).includes(event.event_code)
      );
      return rescheduled.length > 0 && failed.length > 0;
    },
    filteredEventTimelineV2() {
      const events = [];
      const timelines = this.failedRescheduledStatus()
        ? this.getRescheduledOrderTimelines
        : this.getOrderTimelines;
      timelines.forEach((row, index) => {
        if (this.activeIndex === index) {
          row.steps.forEach((step, i) => {
            const evts = this.getData.data.event_time_line.filter(
              (timeline) => timeline.event_code === this.getOrderStatuses[step]
            );
            const evtDate =
              evts.length > 0 ? evts[evts.length - 1].event_date : "";
            events.push({
              event_code: this.getOrderStatuses[step],
              index,
              active: row.colors[i] === "#324ba8",
              title: row.titles[i],
              color: row.colors[i],
              icon: row.icons[i],
              iconClass: row.iconClass[i],
              date: this.formatEventDate(row.dates[i], evtDate),
              showDriver: row.showDriver[i],
              showReschedule: row.showReschedule[i],
            });
          });
        }
      });
      return events;
    },
    formatEventDate(date, timeline) {
      if (date.status) {
        if (date.type === "timeline") {
          return moment(timeline).format(date.format);
        }
        if (date.type === "scheduled") {
          return moment(this.getData.data.scheduled_delivery_date).format(
            date.format
          );
        }
        if (date.type === "completed") {
          return moment(this.getData.data.order_completion_date).format(
            date.format
          );
        }
        if (date.type === "today") {
          return this.$t("timeline.today");
        }
      }
      return "";
    },
    formatDate(date) {
      return moment(date).format("ddd, MMM Do");
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
.active-timeline-text {
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
.inactive-timeline-text {
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
