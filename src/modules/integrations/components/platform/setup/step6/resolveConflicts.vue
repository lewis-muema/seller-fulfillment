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
        <v-col class="text__heading" data-test="conflicts-count">
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
            data-test="resolve"
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
            :data-test="`conflict-selector-${index}`"
          >
            <el-option
              v-for="(product, index) in conflict.matchingProduct"
              :key="index"
              :label="product.name"
              :value="product.id"
              :data-test="`conflict-solution-${index}`"
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
          <img
            v-if="!conflict.selectedProductId"
            src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/empty-filled-circle.svg"
          />
          <img
            v-else
            src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/check-circle-filled.svg"
          />
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
