<template>
  <div class="platform-container">
    <v-card class="platform-container__card">
      <headerComponent />
      <div class="integrations-card">
        <div class="top-action-bar">
          <h5>{{ $t("merchant.platformInUse") }}</h5>
        </div>
        <div>
          <selectComponent
            :availableStores="availableStores"
            class="dropdown"
            @update="updateStore"
          />

          <v-btn
            class="sendy-btn-default"
            @click="
              $router.push({
                name: 'SetupStep2',
                params: { storePlatform: platform.details.name },
              })
            "
            data-test="select-platform-btn"
          >
            {{ $t("merchant.continue") }}
          </v-btn>
          <!-- <div class="integration-actions">
              <span class="integration-actions__text">{{
                $t("merchant.missingPlatform")
              }}</span>
              <a class="integration-actions__link" @click="redirect()">
                {{ $t("merchant.letsKnow") }}
              </a>
            </div> -->
        </div>
      </div>
    </v-card>
  </div>
</template>
<script>
import stores from "@/modules/integrations/constants/storeFields.json";
import headerComponent from "@/modules/integrations/components/header.vue";
import selectComponent from "@/modules/integrations/components/selectComponent.vue";

import Platform from "@/modules/integrations/models/Platform";
import { provide } from "vue";

export default {
  setup() {
    const platform = new Platform();

    provide("platform", platform);

    return {
      platform,
    };
  },
  components: { headerComponent, selectComponent },
  computed: {
    availableStores() {
      return Object.keys(stores).sort((a, b) => {
        return a - b;
      });
    },
  },
  data() {
    return {
      documentationLink: "https://fulfillment-api.sendyit.com/documentation",
    };
  },
  methods: {
    redirect() {
      window.open(this.documentationLink);
    },
  },
};
</script>
<style lang="scss" scoped>
.platform-container {
  height: 100%;

  &__card {
    height: 100vh;
  }
}
.integration-actions {
  margin-top: 32px;

  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.005em;
    color: #000000;
    display: block;
  }

  &__link {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.005em;
    text-decoration-line: underline;
    color: #324ba8;
    cursor: pointer;
  }
}
</style>
<style scoped>
.dropdown {
  margin-bottom: 24px;
}
.integrations-card {
  margin: auto;
  width: 40%;
  padding: 25px;
  margin-top: 65px;
}
.ma-2 {
  float: right;
  margin-top: -40px !important;
}
.integration-text {
  color: #606266;
  margin: 10px, 3px, 20px;
  margin-top: 20px;
  margin-left: 20px;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 26px;
  line-height: 32px;
  letter-spacing: -0.01em;
}

.top-action-bar {
  margin-bottom: 20px;
}
.back-btn {
  box-shadow: none !important;
}
.sendy-btn-default {
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
  color: #ffffff !important;
  border: 1px solid #324ba8 !important;
  background-color: #324ba8 !important;
  width: 100%;
}
.sendy-btn-text {
  text-transform: inherit;
  color: #324ba8 !important;
  text-decoration: underline !important;
}
</style>
