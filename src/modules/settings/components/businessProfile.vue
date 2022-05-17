<template>
  <div class="businessProfile-container">
    <label for="business-name" class="businessProfile-label">
      {{ $t("settings.businessName") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="business-name"
      v-model="businessName"
      variant="outlined"
      clearable
      clear-icon="mdi-cancel"
    ></v-text-field>
    <label for="industry" class="businessProfile-label">
      {{ $t("settings.industry") }}
    </label>
    <v-select
      class="businessProfile-select"
      id="industry"
      :items="industry"
      v-model="industryItem"
      outlined
    ></v-select>
    <label for="TIN" class="businessProfile-label">
      {{ $t("settings.taxIdentificationNumber") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="TIN"
      v-model="TIN"
      :label="$t('settings.enterTaxIdentificationNumber')"
      variant="outlined"
      clearable
      clear-icon="mdi-cancel"
    ></v-text-field>
    <label for="physical-address" class="businessProfile-label">
      {{ $t("settings.defaultPhysicalAddress") }}
    </label>
    <GMapAutocomplete
      id="physical-address"
      class="businessProfile-address"
      :placeholder="$t('settings.searchLocation')"
      @place_changed="setPlace"
    >
    </GMapAutocomplete>
    <p>{{ $t("settings.businessSocialProfile") }}</p>
    <label for="instagram" class="businessProfile-label">
      {{ $t("settings.instagram") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="instagram"
      v-model="instagram"
      :label="$t('settings.enterInstagramUrl')"
      variant="outlined"
      clearable
      clear-icon="mdi-cancel"
    ></v-text-field>
    <label for="facebookPage" class="businessProfile-label">
      {{ $t("settings.facebookPage") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="facebookPage"
      v-model="facebookPage"
      :label="$t('settings.enterFacebookPageUrl')"
      variant="outlined"
      clearable
      clear-icon="mdi-cancel"
    ></v-text-field>
    <label for="website" class="businessProfile-label">
      {{ $t("settings.website") }}
    </label>
    <v-text-field
      class="businessProfile-field"
      id="website"
      v-model="website"
      :label="$t('settings.enterWebsiteLink')"
      variant="outlined"
      clearable
      clear-icon="mdi-cancel"
    ></v-text-field>
    <v-btn class="businessProfile-save">
      {{ $t("settings.saveChanges") }}
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      businessName: "Smart collections",
      TIN: "A5839493N",
      phone: "+254709779779",
      industry: ["telecommunications", "transport", "entertainment", "beauty"],
      industryItem: "telecommunications",
      instagram: "",
      facebookPage: "",
      website: "",
    };
  },
  methods: {
    setPlace(place) {
      console.log(place);
    },
  },
};
</script>

<style>
.businessProfile-container {
  width: 50%;
  padding: 10px 60px;
}
.businessProfile-label {
  font-size: 14px;
  font-weight: 500;
}
.businessProfile-field {
  zoom: 90%;
}
.businessProfile-phone {
  height: 50px;
}
.businessProfile-save {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
.businessProfile-select .v-input__control {
  border: 1px solid #c5c5c5;
  border-radius: 5px;
  --v-input-padding-top: 10px;
}
.businessProfile-address {
  width: 100%;
  border: 1px solid #c5c5c5;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 30px;
}
</style>
