<template>
  <div class="timline-container">
    <p class="timeline-title">
      {{ $t("deliveries.timeline") }}
    </p>
    <div>
      <el-timeline>
        <el-timeline-item
          class="el-timeline-item-desktop"
          v-for="(activity, index) in orderTimelines"
          :key="index"
        >
          {{ activity.event_code }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderTimelines: [
        {
          event_date: 1647870724000,
          event_code: "EVENT_PICKUP_ORDER_CREATED",
          translated_event_code: "summarised.event.pickup.order.created",
          notes: "",
          event_tense: "FUTURE",
          metadata: {},
        },
        {
          event_date: 1647870724000,
          event_code: "EVENT_PICKUP_WAITING_FOR_PARTNER",
          translated_event_code: "summarised.event.pickup.waiting.for.partner",
          notes: "",
          event_tense: "FUTURE",
          metadata: {},
        },
        {
          event_date: 1647870724000,
          event_code: "EVENT_PICKUP_PARTNER_ARRIVED_AT_PICKUP_LOCATION",
          translated_event_code:
            "summarised.event.pickup.partner.arrived.at.pickup.location",
          notes: "",
          event_tense: "FUTURE",
          metadata: {
            shipping_agent: null,
          },
        },
        {
          event_date: 1647870724000,
          event_code:
            "EVENT_PICKUP_PARTNER_SUBMITTED_ITEMS_AT_HUB_CONFIRMED_VIA_CODE",
          translated_event_code:
            "summarised.event.pickup.partner.submitted.items.at.hub.confirmed.via.code",
          notes: null,
          event_tense: "FUTURE",
          metadata: {},
        },
      ],
    };
  },
};
</script>
