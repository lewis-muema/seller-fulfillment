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
          searchParterPhonePlate(getDirectOrderDetails.searchParam)
        "
      ></v-text-field>
      <div
        v-if="
          !getDirectOrderPartner?.agent_id && getDirectOrderDetails.searchParam
        "
        class="partner-search-message"
      >
        {{ $t("deliveries.vehicleIsNotRegistered") }}
      </div>
      <div
        v-if="
          getDirectOrderPartner?.agent_id && getDirectOrderDetails.searchParam
        "
        class="partner-search-pair-message"
      >
        <div>
          {{ $t("deliveries.yourOrderWillBePairedWith") }}
        </div>
        <div>
          <div>{{ getDirectOrderPartner?.agent_name }}</div>
          <div>{{ getDirectOrderPartner?.agent_phone_number }}</div>
          <div>{{ getDirectOrderPartner?.vehicle_identifier }}</div>
        </div>
      </div>
    </template>
    <v-list class="header-list-popup">
      <v-list-item v-for="(item, i) in searchItems" :key="i">
        <v-list-item-title @click="selectPartner(item)">
          <div class="search-item-flex">
            <div class="search-items-image-container">
              <img
                class="search-items-image"
                :src="`https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/vendor_types/${item.vendor_type}.png`"
                alt="product-image"
              />
            </div>
            <div>
              <div class="search-item-row">
                <div class="search-item-name">{{ item.rider_name }}</div>
                <div class="search-item-description">
                  {{ item.phone_no }}
                </div>
                <div class="search-item-description">
                  {{ item.email }}
                </div>
              </div>
            </div>
          </div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
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
    searchParterPhonePlate: _.debounce(function (val) {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/point-to-point/shipping-agent/search?q=${val}`,
      }).then((response) => {
        if (response.status === 200) {
          this.setDirectOrderPartner(response.data.data.shipping_agent);
        } else {
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
.search-items-image-container {
  height: 60px;
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e2e2e2;
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
}
.search-items-image {
  height: 100%;
}
.search-item-description {
  width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #818487;
  font-size: 12px;
}
.search-item-name {
  font-size: 14px;
}
.search-algolia .v-overlay__content {
  position: sticky !important;
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
  background: #ddf0ff;
  padding: 20px;
  border-radius: 5px;
  font-size: 14px;
}
.partner-search-pair-message {
  margin-top: 30px;
  padding: 15px;
  font-size: 14px;
  background: #ffe4cc;
  border-radius: 5px;
}
</style>
