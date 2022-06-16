<template>
  <div>
    <div class="userPermisssions-container">
      <div class="userPermisssions-top-bar">
        <i
          @click="$router.go(-1)"
          class="mdi mdi-arrow-left userPermisssions-back"
        ></i>
        <span>{{ $t("settings.userPermissions") }}</span>
      </div>
      <div>
        <p class="userPermisssions-title">{{ $t("settings.whichModules") }}</p>
        <div class="userPermisssions-checkbox-container">
          <p>{{ $t("settings.inventory") }}</p>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="products"
            :label="$t('settings.products')"
            :value="$t('settings.products')"
            color="#324BA8"
          ></v-checkbox>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="stockLevels"
            :label="$t('settings.stockLevels')"
            :value="$t('settings.stockLevels')"
            color="#324BA8"
          ></v-checkbox>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="sendInventory"
            :label="$t('settings.sendInventory')"
            :value="$t('settings.sendInventory')"
            color="#324BA8"
          ></v-checkbox>
        </div>
        <div class="userPermisssions-checkbox-container">
          <p>{{ $t("settings.deliveries") }}</p>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="toTheCustomer"
            :label="$t('settings.toTheCustomer')"
            :value="$t('settings.toTheCustomer')"
            color="#324BA8"
          ></v-checkbox>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="toTheFulfillmentCentre"
            :label="$t('settings.toTheFulfillmentCentre')"
            :value="$t('settings.toTheFulfillmentCentre')"
            color="#324BA8"
          ></v-checkbox>
        </div>
        <div class="userPermisssions-checkbox-container">
          <p>{{ $t("settings.payments") }}</p>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="statement"
            :label="$t('settings.statement')"
            :value="$t('settings.statement')"
            color="#324BA8"
          ></v-checkbox>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="invoice"
            :label="$t('settings.invoice')"
            :value="$t('settings.invoice')"
            color="#324BA8"
          ></v-checkbox>
        </div>
        <div class="userPermisssions-checkbox-container">
          <p>{{ $t("settings.settings") }}</p>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="paymentOptions"
            :label="$t('settings.paymentOptions')"
            :value="$t('settings.paymentOptions')"
            color="#324BA8"
          ></v-checkbox>
          <v-checkbox
            class="userPermisssions-checkbox"
            v-model="manageUsers"
            :label="$t('settings.manageUsers')"
            :value="$t('settings.manageUsers')"
            color="#324BA8"
          ></v-checkbox>
          <v-btn class="userPermisssions-save">
            {{ $t("settings.editPermissions") }}
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      products: "",
      stockLevels: "",
      sendInventory: "",
      toTheCustomer: "",
      toTheFulfillmentCentre: "",
      statement: "",
      invoice: "",
      paymentOptions: "",
      manageUsers: "",
    };
  },
  mounted() {
    this.setComponent(this.$t("settings.addAUser"));
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
  },
};
</script>

<style>
.userPermisssions-container {
  width: 35%;
  margin: 60px auto;
  padding: 3% 5%;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  background: white;
}
.userPermisssions-label {
  font-size: 14px;
  font-weight: 500;
}
.userPermisssions-field {
  zoom: 90%;
}
.userPermisssions-phone {
  height: 50px;
}
.userPermisssions-select .v-input__control {
  border: 1px solid #c5c5c5;
  border-radius: 5px;
}
.userPermisssions-save {
  width: 100%;
  margin-top: 20px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
.userPermisssions-top-bar {
  height: 40px;
  align-items: center;
  display: flex;
  margin-bottom: 10px;
}
.userPermisssions-back {
  font-size: 25px;
  cursor: pointer;
  margin-right: 10px;
}
.userPermisssions-checkbox {
  height: 45px;
}
.v-selection-control .v-label {
  color: #303133;
  font-size: 14px;
}
.userPermisssions-title {
  font-size: 14px;
}
.userPermisssions-checkbox-container {
  font-size: 16px;
  margin: 20px 0px;
}
</style>
