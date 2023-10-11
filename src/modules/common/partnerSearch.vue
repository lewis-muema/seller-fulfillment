<template>
  <v-menu
    transition="slide-y-transition"
    anchor="bottom center"
    v-model="searchToggle"
    class="partner-search"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        color="#324BA8"
        v-bind="props"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="partner-search-container"
        variant="outlined"
        v-model="getDirectOrderDetails.searchParam"
        @click:clear="clearItems()"
        @update:modelValue="
          searchPartnerTrigger(getDirectOrderDetails.searchParam)
        "
      ></v-text-field>
      <div
        v-if="
          !getDirectOrderPartner?.agent_id &&
          getDirectOrderDetails.searchParam &&
          !loadingStatus
        "
        class="partner-search-message"
      >
        <i
          class="mdi mdi-close partner-search-pair-close"
          @click="clearItems()"
        ></i>
        {{ $t(pairingError) }}
      </div>
      <div
        v-if="
          getDirectOrderPartner?.agent_id &&
          getDirectOrderDetails.searchParam &&
          !loadingStatus
        "
        class="partner-search-pair-message"
      >
        <i
          class="mdi mdi-close partner-search-pair-close"
          @click="clearItems()"
        ></i>
        <div>
          {{ $t("deliveries.yourOrderWillBePairedWith") }}
        </div>
        <div>
          <div>{{ getDirectOrderPartner?.agent_name }}</div>
          <div>
            {{ obfuscateNumber(getDirectOrderPartner?.agent_phone_number) }}
          </div>
          <div>{{ getDirectOrderPartner?.vehicle_identifier }}</div>
        </div>
      </div>
      <div
        class="partner-search-pair-loading"
        v-if="loadingStatus && getDirectOrderDetails.searchParam"
      >
        {{ $t("deliveries.weAreSearchingForTheDriverDetails") }}
        <div v-loading="true" class="partner-search-pair-loading-icon"></div>
      </div>
    </template>
  </v-menu>
</template>

<script>
import _ from "lodash";
import algoliaSearch from "../../mixins/algolia_search";
import eventsMixin from "../../mixins/events_mixin";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  props: ["type"],
  mixins: [algoliaSearch, eventsMixin],
  data: () => ({
    deliveries: [],
    searchItems: [],
    range: "",
    searchToggle: false,
    loadingStatus: false,
    pairingError: "deliveries.vehicleIsNotRegistered",
  }),
  computed: {
    ...mapGetters([
      "getStorageUserDetails",
      "getProductLists",
      "getSearchedProducts",
      "getSelectedVehicleType",
      "getDirectOrderPartner",
      "getDirectOrderDetails",
    ]),
  },
  watch: {
    searchToggle(val) {
      if (val) {
        this.searchToggle =
          this.searchItems.length > 0 &&
          this.getDirectOrderDetails.searchParam !== "";
      }
    },
  },
  methods: {
    ...mapMutations([
      "setProductLists",
      "setSearchedProducts",
      "setDirectOrderPartner",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPost"]),
    initiatePartnerSearch(val) {
      this.requestAxiosGet({
        app: process.env.SOLR_RIDER_SEARCH,
        endpoint: `select?q=(rider_name:*${val}*+OR+email:*${val}*+OR+phone_no:*${val}*)&wt=json&indent=true&row=10&sort=rider_id%20desc`,
      }).then((response) => {
        this.searchResults(response.data.response.docs);
      });
    },
    obfuscateNumber(number) {
      return `${number.slice(0, 7)}XXXXXX`;
    },
    searchPartnerTrigger(val) {
      this.loadingStatus = true;
      this.searchParterPhonePlate(val);
    },
    searchParterPhonePlate: _.debounce(function (val) {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/point-to-point/shipping-agent/search?q=${val}&vehicle_type=${this.getSelectedVehicleType?.vehicle_type}`,
      }).then((response) => {
        this.loadingStatus = false;
        if (response.status === 200) {
          if (
            this.getSelectedVehicleType?.vehicle_type ===
            response.data.data.shipping_agent.vehicle_type
          ) {
            this.setDirectOrderPartner(response.data.data.shipping_agent);
          } else {
            this.pairingError =
              "deliveries.thisDriverCantBeAssignedToYourOrder";
            this.setDirectOrderPartner({});
          }
        } else {
          this.pairingError = "deliveries.vehicleIsNotRegistered";
          this.setDirectOrderPartner({});
        }
      });
    }, 1000),
    searchResults(results) {
      this.searchToggle = true;
      const partners = [];
      results.forEach((result) => {
        if (
          this.getSelectedVehicleType.vehicle_type_image_url.includes(
            `/${result.vendor_type}.`
          )
        ) {
          partners.push(result);
        }
      });
      this.searchItems = partners;
      this.searchToggle = partners.length > 0;
    },
    clearItems() {
      this.getDirectOrderDetails.searchParam = "";
      this.setDirectOrderPartner({});
      this.searchToggle = false;
      this.searchItems = [];
    },
    selectPartner(item) {
      this.setDirectOrderPartner(item);
      this.clearItems();
    },
  },
};
</script>

<style>
.search-item-flex {
  display: flex;
}
.partner-search-container {
  height: 40px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.partner-search .v-overlay__content {
  max-height: 350px !important;
  overflow-y: scroll;
}
.partner-search-message {
  margin-top: 30px;
  width: 100%;
  background: #ffe4cc;
  padding: 20px;
  border-radius: 5px;
  font-size: 14px;
}
.partner-search-pair-message {
  margin-top: 30px;
  padding: 15px;
  font-size: 14px;
  background: #ddf0ff;
  border-radius: 5px;
}
.partner-search-pair-loading {
  height: 55px;
  border-radius: 5px;
  margin-top: 30px;
  background: #ddf0ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.partner-search-pair-loading-icon {
  margin-top: -30px;
  zoom: 65%;
  margin-left: 15px;
}
.partner-search-pair-close {
  position: absolute;
  right: 15px;
  margin-top: -5px;
  cursor: pointer;
}
</style>
