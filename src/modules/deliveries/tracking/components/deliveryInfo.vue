<template>
  <div class="delivery-info-container">
    <p class="delivery-info-title">
      <span :class="getLoader.orderTracking">
        {{
          getParent === "sendy"
            ? $t("deliveries.pickupInfo")
            : $t("deliveries.deliveryInfo")
        }}
      </span>
      <span
        class="delivery-info-edit"
        @click="overlayStatus(true)"
        :class="getLoader.orderTracking"
        v-if="getOrderTrackingData.order.order_status === 'ORDER_RECEIVED'"
      >
        <i class="mdi mdi-pencil"></i>
        {{ $t("deliveries.edit") }}
      </span>
      <span
        :class="getLoader.orderTracking"
        @click="
          setOverlayStatus({
            overlay: true,
            popup: 'noEdits',
          })
        "
        v-else
      >
        <span class="delivery-info-edit" :class="getLoader.orderTracking">
          <i class="mdi mdi-pencil"></i>
          {{ $t("deliveries.edit") }}
        </span>
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="getLoader.orderTracking">
        {{
          getParent === "sendy"
            ? $t("deliveries.pickUpLocation")
            : $t("deliveries.nameOfCustomer")
        }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="getLoader.orderTracking">
        {{
          getParent === "sendy"
            ? getOrderTrackingData.order.destination.delivery_location
                .description
            : getOrderTrackingData.order.destination.name
        }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="getLoader.orderTracking">
        {{
          getParent === "sendy"
            ? $t("deliveries.pickUpInstructions")
            : $t("deliveries.deliveryLocation")
        }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="getLoader.orderTracking">
        {{
          getParent === "sendy"
            ? getOrderTrackingData.order.destination.delivery_instructions
              ? getOrderTrackingData.order.destination.delivery_instructions
              : "N/A"
            : getOrderTrackingData.order.destination.delivery_location
                .description
        }}
      </span>
    </p>
    <p class="delivery-info-label">
      <span :class="getLoader.orderTracking">
        {{ $t("deliveries.phoneNumber") }}
      </span>
    </p>
    <p class="delivery-info-data">
      <span :class="getLoader.orderTracking">
        {{ getOrderTrackingData.order.destination.phone_number }}
      </span>
    </p>
    <p
      v-if="getOrderTrackingData.order.destination.secondary_phone_number"
      class="delivery-info-label"
    >
      <span :class="getLoader.orderTracking">
        {{ $t("deliveries.secondaryPhoneNumber") }}
      </span>
    </p>
    <p
      v-if="getOrderTrackingData.order.destination.secondary_phone_number"
      class="delivery-info-data"
    >
      <span :class="getLoader.orderTracking">
        {{ getOrderTrackingData.order.destination.secondary_phone_number }}
      </span>
    </p>
    <p v-if="getParent === 'customer'" class="delivery-info-label">
      <span :class="getLoader.orderTracking">
        {{ $t("deliveries.instructions") }}
      </span>
    </p>
    <p v-if="getParent === 'customer'" class="delivery-info-data">
      <span :class="getLoader.orderTracking">
        {{
          getOrderTrackingData.order.destination.delivery_instructions
            ? getOrderTrackingData.order.destination.delivery_instructions
            : "N/A"
        }}
      </span>
    </p>
    <p v-if="getParent === 'customer'" class="delivery-info-label">
      <span :class="getLoader.orderTracking">
        {{ $t("deliveries.paymentMethod") }}
      </span>
    </p>
    <p v-if="getParent === 'customer'" class="delivery-info-data">
      <span :class="getLoader.orderTracking">
        {{
          getOrderTrackingData.order.fulfilment_cost_means_of_payment
            .means_of_payment_type
        }}
      </span>
    </p>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      overlay: false,
      editInfo: false,
    };
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getDeliveryInfo",
      "getPickupInfo",
      "getOrderTrackingData",
      "getParent",
    ]),
  },
  mounted() {},
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setOverlayStatus",
      "setParent",
    ]),
    overlayStatus(overlay) {
      if (this.getParent === "sendy") {
        this.setOverlayStatus({
          overlay,
          popup: "pickupInfo",
        });
      } else {
        this.setOverlayStatus({
          overlay,
          popup: "deliveryInfo",
        });
      }
    },
  },
};
</script>

<style>
.delivery-info-container {
  border: 1px solid #e2e7ed;
  margin-left: 70px;
  padding: 35px;
  border-radius: 10px;
  width: 70%;
  margin-bottom: 25px;
  line-height: 25px;
  font-size: 14px;
  background: white;
}
.delivery-info-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
}
.delivery-info-label {
  color: #606266;
  margin-bottom: 0px;
}
.delivery-info-data {
  color: #303133;
  margin-bottom: 10px;
}
.delivery-info-edit {
  float: right;
  font-size: 14px;
  cursor: pointer;
  font-weight: 300;
  color: #324ba8;
}
.edit-info-label {
  font-size: 14px;
  font-weight: 500;
}
.edit-info-instructions {
  border: 1px solid #c0c4cc;
  border-radius: 5px;
  margin-top: 2px;
  padding: 10px;
  margin-bottom: 30px;
}
.edit-info-add-phone {
  color: #324ba8;
  font-size: 14px;
  margin: 10px 0px;
  cursor: pointer;
  font-weight: 500;
}
.edit-info-submit-button {
  margin-top: 40px;
  text-transform: capitalize;
  letter-spacing: 0px;
  color: white !important;
  background: #324ba8;
  width: -webkit-fill-available;
}
</style>
