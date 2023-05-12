<template>
  <div>
    <div class="pricing-tiers-title">
      {{ $t("deliveries.whatIsTheSize") }}
    </div>
    <div class="pricing-tiers-container">
      <div
        v-for="(tier, i) in tierNames()"
        :key="i"
        class="pricing-tiers-header-tab"
        :class="activeTier === i ? 'active-tier' : 'inactive-tier'"
        @click="activeTier = i"
      >
        <div class="">
          <img
            :src="`https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/${tier.toLowerCase()}.png`"
            class="pricing-tiers-header-image"
            alt=""
          />
        </div>
        <div class="pricing-tiers-header-text">
          {{ tier }}
        </div>
      </div>
    </div>
    <div
      v-for="(tierItem, x) in tierItems()"
      :key="x"
      class="pricing-tier-vendors"
      :class="
        activeVehicle?.pricing_uuid === tierItem?.pricing_uuid
          ? 'pricing-tier-active-vendors'
          : ''
      "
      @click="selectVehicleType(tierItem)"
    >
      <div>
        <img
          :src="tierItem.vehicle_type_image_url"
          alt=""
          class="pricing-tier-vendors-image"
        />
      </div>
      <div class="pricing-tier-vendors-name">
        <div class="">
          {{ tierItem.vehicle_type.replaceAll("_", " ").toLowerCase() }}
        </div>
        <div class="pricing-tier-vendors-weight">
          {{
            $t("deliveries.carriesUpTo", {
              Weight: `${
                tierItem.vehicle_type_maximum_weight
              } ${tierItem.vehicle_type_maximum_weight_unit_of_measure.toLowerCase()}s`,
            })
          }}
        </div>
      </div>
      <div class="pricing-tier-vendors-amount">
        {{ tierItem.currency }} {{ tierItem.total_cost }}
      </div>
    </div>
    <button
      class="btn desktop-select-continue-button pricing-tier-continue-btn"
      @click="continueToVehicleType()"
      :disabled="!vehicleSelectStatus"
      :class="vehicleSelectStatus ? 'btn-primary' : 'disabled-continue'"
    >
      {{ $t("deliveries.continueToPickupInformation") }}
    </button>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      activeTier: 0,
      vehicleSelectStatus: false,
      activeVehicle: {},
    };
  },
  computed: {
    ...mapGetters(["getPricing"]),
  },
  methods: {
    ...mapMutations(["setSelectedVehicleType", "setDirectOrderStep"]),
    tierNames() {
      return Object.keys(this.getPricing);
    },
    tierItems() {
      return Object.values(this.getPricing)[this.activeTier];
    },
    selectVehicleType(vehicle) {
      this.activeVehicle = vehicle;
      this.vehicleSelectStatus = true;
    },
    continueToVehicleType() {
      this.setSelectedVehicleType(this.activeVehicle);
      this.setDirectOrderStep(2);
    },
  },
};
</script>

<style>
.pricing-tiers-container {
  width: 100%;
  overflow-x: hidden;
  display: flex;
}
.pricing-tiers-header-image {
  width: 25px;
}
.pricing-tiers-header-tab {
  display: flex;
  align-items: center;
  height: 45px;
  width: -webkit-fill-available;
  justify-content: center;
  cursor: pointer;
}
.pricing-tiers-header-text {
  font-size: 14px;
  margin-left: 10px;
}
.active-tier {
  border-bottom: 2px solid #ed7800;
}
.inactive-tier {
  border-bottom: 1px solid grey;
}
.pricing-tiers-title {
  margin-bottom: 15px;
  text-align: center;
}
.pricing-tier-vendors {
  display: flex;
  border-bottom: 1px solid #e9e9e9;
  align-items: center;
  cursor: pointer;
  margin-top: 10px;
}
.pricing-tier-vendors-image {
  width: 50px;
  margin: 15px;
  margin-left: 25px;
}
.pricing-tier-vendors-name {
  margin-right: auto;
  text-transform: capitalize;
  cursor: pointer;
}
.pricing-tier-vendors-amount {
  margin-right: 25px;
  text-transform: capitalize;
  font-size: 15px;
  width: 100px;
  text-align: right;
}
.pricing-tier-vendors-weight {
  font-size: 11px;
  color: #606266;
  white-space: nowrap;
}
.pricing-tier-active-vendors {
  background: #dcdfe6;
  border-radius: 5px;
}
.pricing-tier-continue-btn {
  margin-top: 50px;
}
</style>
