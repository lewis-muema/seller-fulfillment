<template>
  <div class="import-container">
    <v-card class="import-card">
      <v-row>
        <v-col cols="1">
          <div class="top-action-bar">
            <v-btn class="back-btn" dark @click="goToPreviousStep()">
              <v-icon large dark left> mdi-arrow-left </v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col class="text__heading">
          {{ $t("merchant.link") }}
          {{ unresolvedConflicts }}
          {{ $t("merchant.products") }}
        </v-col>
        <v-col class="cell-align__right">
          <span class="text__warning" v-if="unresolvedConflicts > 0">
            {{ unresolvedConflicts }}
            {{ $t("merchant.products_need_matching") }}
          </span>
        </v-col>
        <v-col class="cell-align__right" cols="2">
          <button
            class="button__select"
            @click="resolveConflicts()"
            :disabled="unresolvedConflicts > 0"
          >
            {{ $t("merchant.save_changes") }}
          </button>
        </v-col>
      </v-row>
      <hr class="divider" />
      <v-row>
        <v-col offset="1" class="text__sub-heading">
          {{ $t("merchant.from_shopify_store") }}
        </v-col>
        <v-col class="text__sub-heading"
          >{{ $t("merchant.import_products_to_sendy") }}
        </v-col>
      </v-row>
      <hr class="divider" />
      <v-row v-for="(conflict, index) in syncedProducts" :key="index">
        <v-col cols="1">
          {{ index + 1 }}
        </v-col>
        <v-col>
          {{ conflict.baseProduct.productName }}
        </v-col>
        <v-col>
          <el-select
            v-model="conflict.selectedProductId"
            :placeholder="$t('merchant.select_similar_products')"
            class="select-option__text"
          >
            <el-option
              v-for="(product, index) in conflict.matchingProduct"
              :key="index"
              :label="product.name"
              :value="product.id"
            >
              <span>{{ product.name }}</span>
            </el-option>
            <hr />
            <el-option :label="$t('merchant.add_as_a_new_product')" value="0">
              <span>{{ $t("merchant.add_as_a_new_product") }}</span>
            </el-option>
          </el-select>
        </v-col>
        <v-col cols="1">
          <svg
            v-if="!conflict.selectedProductId"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18Z"
              fill="#E2E7ED"
            />
          </svg>
          <svg
            v-else
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM7.29 14.29L3.7 10.7C3.60742 10.6074 3.53398 10.4975 3.48387 10.3765C3.43377 10.2556 3.40798 10.1259 3.40798 9.995C3.40798 9.86407 3.43377 9.73442 3.48387 9.61346C3.53398 9.49249 3.60742 9.38258 3.7 9.29C3.79258 9.19742 3.90249 9.12398 4.02346 9.07387C4.14442 9.02377 4.27407 8.99798 4.405 8.99798C4.53593 8.99798 4.66558 9.02377 4.78654 9.07387C4.90751 9.12398 5.01742 9.19742 5.11 9.29L8 12.17L14.88 5.29C15.067 5.10302 15.3206 4.99798 15.585 4.99798C15.8494 4.99798 16.103 5.10302 16.29 5.29C16.477 5.47698 16.582 5.73057 16.582 5.995C16.582 6.25943 16.477 6.51302 16.29 6.7L8.7 14.29C8.60749 14.3827 8.4976 14.4563 8.37662 14.5064C8.25565 14.5566 8.12597 14.5824 7.995 14.5824C7.86403 14.5824 7.73435 14.5566 7.61338 14.5064C7.4924 14.4563 7.38251 14.3827 7.29 14.29Z"
              fill="#20BE47"
            />
          </svg>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "StepSix",
  inject: ["nextStep", "lastStep"],
  watch: {
    getPlatformSyncPartialMatchingProducts: {
      handler: function (value) {
        this.syncedProducts = value;
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      syncedProducts: [],
      payload: {
        currency: "KES", // required
        createAllProducts: false,
        products: [],
        newProducts: [],
        matchingProducts: [],
      },
    };
  },
  methods: {
    ...mapActions(["setFinishSyncPayload", "setResolvedConflicts"]),
    back() {
      this.lastStep();
    },
    goToPreviousStep() {
      this.$router.push({ name: "SetupStep6" });
    },
    resolveConflicts() {
      for (const conflict of this.syncedProducts) {
        if (conflict.selectedProductId !== 0) {
          this.payload.products.push({
            api2CartProduct: conflict.selectedProductId,
            fulfilmentProduct: {
              productId: conflict.baseProduct.productId,
              productVariationId:
                conflict.baseProduct.productVariants[0].productVariantId,
            },
            createFulfilmentProduct: false,
          });
        } else {
          this.payload.products.push({
            api2CartProduct: conflict.matchingProduct.id,
            createFulfilmentProduct: true,
          });
        }
      }

      this.payload.newProducts = this.getPlatformSyncNewProducts;
      this.payload.matchingProducts = this.getPlatformSyncMatchingProducts;

      this.setFinishSyncPayload(this.payload);
      this.setResolvedConflicts(true);
      this.$router.push({ name: "SetupStep6" });
    },
  },
  computed: {
    ...mapGetters([
      "getPlatformSyncPartialMatchingProducts",
      "getPlatformSyncMatchingProducts",
      "getPlatformSyncNewProducts",
      "getPlatformSyncPartialMatchingProducts",
    ]),
    numberOfConflicts() {
      return this.syncedProducts.length;
    },
    unresolvedConflicts() {
      return this.syncedProducts.filter((products) => {
        return !products.selectedProductId;
      }).length;
    },
  },
};
</script>

<style lang="scss" scoped>
.import-container {
  height: auto;
}
.import-card {
  height: auto;
}

.text {
  &__heading {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    letter-spacing: -0.005em;
    color: #303133;
  }

  &__sub-heading {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.005em;
    color: #303133;
  }

  &__warning {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    text-align: right;
    letter-spacing: 0.01em;
    color: #9b101c;
  }
}

.button {
  &__select {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    gap: 10px;
    width: 151px;
    height: 46px;
    background: #324ba8;
    border-radius: 6px;
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #ffffff;

    &:disabled {
      background: #e2e7ed;
      color: #ffffff;
    }
  }
}

.cell-align {
  &__left {
    text-align: left;
  }
  &__right {
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }
}

.divider {
  border: 1px solid #e2e7ed;
}

.import-card {
  width: 100%;
}

.select-option {
  &__text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    /* or 138% */
    display: flex;
    align-items: center;
    /* Neutral - Grays/gray70 */
    color: #909399;
  }
}
</style>
