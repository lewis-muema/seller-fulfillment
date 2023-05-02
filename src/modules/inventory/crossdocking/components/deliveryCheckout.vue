<template>
  <div>
    <v-card variant="outlined" class="send-inventory-checkout-card">
      <div
        class="enter-quantity-container desktop-header-title d-flex pt-3 cross-docking-checkout-back-arrow"
      >
        <i
          class="mdi mdi-arrow-left"
          aria-hidden="true"
          @click="this.$router.go(-1)"
        ></i>
      </div>
      <div v-for="index in indeces" :key="index">
        <el-collapse v-model="getDestinations[index - 1].expanded" accordion>
          <el-collapse-item
            :title="`${$t('inventory.orderInfo')} ${
              indeces > 1 ? `(${index})` : ''
            }`"
            class="payment-collection-title"
            :class="
              getDestinations.length <= 1 && getDestinations[index - 1].expanded
                ? 'delivery-info-collapse'
                : ''
            "
            :name="1"
          >
            <div class="autofill-container" v-if="LPOAutofillFlag()">
              <div class="autofill-container-inner">
                <div class="mr-auto">
                  <div class="mb-1">
                    {{ $t("inventory.autofillOrderInformation") }}
                  </div>
                  <div class="autofill-bottom-text">
                    {{ $t("inventory.saveTimeByUploadingTheLPO") }}
                  </div>
                </div>
                <div>
                  <button
                    class="btn btn-primary btn-long autofill-upload-button"
                    v-loading="buttonLoader"
                    :disabled="buttonLoader"
                    @click="openAutofillPopup(index - 1)"
                  >
                    {{ $t("inventory.uploadLPO") }}
                  </button>
                </div>
              </div>
              <div v-if="getLPOUploadError" class="autofill-error">
                <div>
                  <i
                    class="mdi mdi-alert-outline autofill-error-icon"
                    aria-hidden="true"
                  ></i>
                </div>
                <div>{{ getLPOUploadError }}</div>
              </div>
            </div>
            <div
              class="mb-4 row cross-docking-checkout-row cross-docking-checkout-product-row"
            >
              <div class="col-1 cross-docking-checkout-product-icon">
                <i class="mdi mdi-shape cross-docking-checkout-icons"></i>
              </div>
              <div
                class="col-11 cross-docking-checkout-product-underline"
                @click="addProducts(index - 1)"
              >
                <div
                  class="cross-docking-checkout-text-grey-no-underline cross-docking-checkout-products-label"
                  v-if="
                    getDestinations[index - 1] &&
                    getDestinations[index - 1].products
                  "
                >
                  <div class="cross-docking-checkout-products-label-upper">
                    <span>{{ $t("deliveries.products") }}</span>
                    <span class="cross-docking-checkout-chevrons"
                      ><span class="cross-docking-checkout-chevrons-text">{{
                        $t("inventory.change")
                      }}</span
                      ><i class="mdi mdi-chevron-right"></i
                    ></span>
                  </div>
                  <div
                    class="mb-3 cross-docking-checkout-product-label-lower crossdocking-items-line-height"
                  >
                    {{
                      getDestinations[index - 1].products.length > 1
                        ? $t("inventory.otherProducts", {
                            Name: getDestinations[index - 1].products[0]
                              .product_name,
                            Count:
                              getDestinations[index - 1].products.length - 1,
                          })
                        : getDestinations[index - 1].products[0].product_name
                    }}
                  </div>
                </div>
                <div class="cross-docking-checkout-text-no-underline" v-else>
                  <span>{{ $t("inventory.selectProductsToSend") }}</span>
                  <span class="cross-docking-checkout-chevrons"
                    ><i class="mdi mdi-chevron-right"></i
                  ></span>
                </div>
              </div>
            </div>
            <div
              class="row autofill-review-prompt"
              v-if="
                getDestinations[index - 1]?.autofillReviewStatus &&
                getDestinations[index - 1]?.products &&
                getDestinations[index - 1]?.autofillProductStatus
              "
            >
              <div class="col-1"></div>
              <div class="col-11">
                <span class="pr-2">
                  <i class="mdi mdi-information-outline"></i>
                </span>
                <span>
                  {{ $t("inventory.kindlyReviewTheProductsAndQuantities") }}
                </span>
              </div>
            </div>
            <div
              v-if="
                showErrors &&
                !(
                  getDestinations[index - 1] &&
                  getDestinations[index - 1].products
                )
              "
              class="row error-msg withdraw-transaction-error mb-3 field-required-error"
            >
              <div class="col-1"></div>
              <div class="col-11">
                {{ $t("inventory.thisFieldIsRequired") }}
              </div>
            </div>
            <div
              :class="
                !(
                  getDestinations[index - 1] &&
                  getDestinations[index - 1].delivery_info
                )
                  ? 'mb-4 row cross-docking-checkout-row'
                  : 'mb-4 row cross-docking-checkout-roww'
              "
            >
              <div class="col-1">
                <i
                  class="mdi mdi-map-marker-outline cross-docking-checkout-icons"
                ></i>
              </div>
              <div
                class="col-11 cross-docking-checkout-text"
                @click="addDeliveryInfo(index)"
                v-if="
                  !(
                    getDestinations[index - 1] &&
                    getDestinations[index - 1].delivery_info
                  )
                "
              >
                <span>{{ $t("inventory.addDeliveryInfo") }}</span>
                <span class="cross-docking-checkout-chevrons"
                  ><i class="mdi mdi-chevron-right"></i
                ></span>
              </div>
              <div
                class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
                v-else
              >
                <div>
                  <p>{{ $t("deliveries.deliveryInfo") }}</p>
                  <div class="delivery-details-text">
                    <p>
                      {{ getDestinations[index - 1].delivery_info.location }}
                    </p>
                    <p>
                      {{
                        getDestinations[index - 1].delivery_info.apartmentName
                      }}
                    </p>
                    <p>
                      {{
                        getDestinations[index - 1].delivery_info.instructions
                      }}
                    </p>
                  </div>
                </div>
                <span
                  class="cross-docking-checkout-chevrons"
                  @click="addDeliveryInfo(index)"
                >
                  <span class="cross-docking-checkout-chevrons-text">{{
                    $t("inventory.change")
                  }}</span>
                  <i class="mdi mdi-chevron-right"></i>
                </span>
              </div>
            </div>
            <div
              class="row autofill-review-prompt"
              v-if="
                getDestinations[index - 1]?.autofillReviewStatus &&
                (!getDestinations[index - 1]?.delivery_info?.location ||
                  !getDestinations[index - 1]?.delivery_info?.place)
              "
            >
              <div class="col-1"></div>
              <div class="col-11">
                <span class="pr-2">
                  <i class="mdi mdi-information-outline"></i>
                </span>
                <span>
                  {{
                    $t("inventory.kindlyReviewTheDeliveryInfo", {
                      Fields: "'Location'",
                    })
                  }}
                </span>
              </div>
            </div>
            <div
              v-if="
                showErrors &&
                !(
                  getDestinations[index - 1] &&
                  getDestinations[index - 1].delivery_info
                )
              "
              class="row error-msg withdraw-transaction-error mb-3 field-required-error"
            >
              <div class="col-1"></div>
              <div class="col-11">
                {{ $t("inventory.thisFieldIsRequired") }}
              </div>
            </div>
            <div
              :class="
                !(
                  getDestinations[index - 1] &&
                  getDestinations[index - 1].recipient
                )
                  ? 'mb-4 row cross-docking-checkout-row'
                  : 'mb-4 row cross-docking-checkout-roww'
              "
            >
              <div class="col-1">
                <i
                  class="mdi mdi-account-outline cross-docking-checkout-icons"
                ></i>
              </div>
              <div
                class="col-11 cross-docking-checkout-text"
                @click="addRecepientInfo(index)"
                v-if="
                  !(
                    getDestinations[index - 1] &&
                    getDestinations[index - 1].recipient
                  )
                "
              >
                <span>{{ $t("inventory.addRecipientInfo") }}</span>
                <span class="cross-docking-checkout-chevrons"
                  ><i class="mdi mdi-chevron-right"></i
                ></span>
              </div>
              <div
                class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
                v-else
              >
                <div>
                  <p>{{ $t("inventory.recipientInfo") }}</p>
                  <div class="delivery-details-text">
                    <p>
                      {{ getDestinations[index - 1].recipient.customer_name }}
                    </p>
                    <p>{{ getDestinations[index - 1].recipient.phone }}</p>
                  </div>
                </div>
                <span
                  class="cross-docking-checkout-chevrons"
                  @click="addRecepientInfo(index)"
                >
                  <span class="cross-docking-checkout-chevrons-text">{{
                    $t("inventory.change")
                  }}</span>
                  <i class="mdi mdi-chevron-right"></i>
                </span>
              </div>
            </div>
            <div
              class="row autofill-review-prompt"
              v-if="
                getDestinations[index - 1]?.autofillReviewStatus &&
                getMissingAutofillFields(getDestinations[index - 1]?.recipient)
              "
            >
              <div class="col-1"></div>
              <div class="col-11">
                <span class="pr-2">
                  <i class="mdi mdi-information-outline"></i>
                </span>
                <span>
                  {{
                    $t("inventory.kindlyReviewTheRecipientInfo", {
                      Fields: getMissingAutofillFields(
                        getDestinations[index - 1]?.recipient
                      ),
                    })
                  }}
                </span>
              </div>
            </div>
            <div
              v-if="
                showErrors &&
                !(
                  getDestinations[index - 1] &&
                  getDestinations[index - 1].recipient
                )
              "
              class="row error-msg withdraw-transaction-error mb-3 field-required-error"
            >
              <div class="col-1"></div>
              <div class="col-11">
                {{ $t("inventory.thisFieldIsRequired") }}
              </div>
            </div>
            <div
              :class="
                !(
                  getDestinations[index - 1] && getDestinations[index - 1].speed
                )
                  ? 'mb-4 row cross-docking-checkout-row'
                  : 'mb-4 row cross-docking-checkout-roww'
              "
              v-if="speedPolicyFlag"
            >
              <div class="col-1">
                <i
                  class="mdi mdi-truck-outline cross-docking-checkout-icons"
                ></i>
              </div>
              <div
                class="col-11 cross-docking-checkout-text"
                v-if="
                  !(
                    getDestinations[index - 1] &&
                    getDestinations[index - 1].speed
                  )
                "
                @click="addDeliveryOption(index)"
              >
                <span>{{ $t("inventory.selectTheDeliveryOption") }}</span>
                <span class="cross-docking-checkout-chevrons"
                  ><i class="mdi mdi-chevron-right"></i
                ></span>
              </div>
              <div
                class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
                v-else
              >
                <div>
                  <p>{{ $t("inventory.deliveryOption") }}</p>
                  <div class="delivery-details-text">
                    <p>
                      <span class="cross-docking-checkout-delivery-option-top">
                        {{
                          getDestinations[index - 1].speed
                            .speed_pricing_description
                        }}
                      </span>
                    </p>
                    <p>
                      <span
                        class="cross-docking-checkout-delivery-option-bottom"
                      >
                        {{
                          getDestinations[index - 1].speed
                            .speed_pricing_type === "SENDY_SCHEDULED"
                            ? formatDate(
                                getDestinations[index - 1].speed
                                  .speed_pricing_scheduled_date
                              )
                            : formatDate(
                                getDestinations[index - 1].speed
                                  .speed_pricing_upper_limit_date
                              )
                        }}
                      </span>
                    </p>
                  </div>
                </div>
                <span
                  class="cross-docking-checkout-chevrons"
                  @click="addDeliveryOption(index)"
                >
                  <span class="cross-docking-checkout-chevrons-text">{{
                    $t("inventory.change")
                  }}</span>
                  <i class="mdi mdi-chevron-right"></i>
                </span>
              </div>
            </div>
            <div
              v-if="
                showErrors &&
                !(
                  (getDestinations[index - 1] &&
                    getDestinations[index - 1].speed &&
                    speedPolicyFlag) ||
                  !speedPolicyFlag
                )
              "
              class="row error-msg withdraw-transaction-error mb-3 field-required-error"
            >
              <div class="col-1"></div>
              <div class="col-11">
                {{ $t("inventory.thisFieldIsRequired") }}
              </div>
            </div>
            <div
              class="mb-4 row cross-docking-checkout-row cross-docking-checkout-text-override"
            >
              <div class="col-1">
                <i class="mdi mdi-cog-outline cross-docking-checkout-icons"></i>
              </div>
              <div
                class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
              >
                <div>
                  <p class="mb-2">{{ $t("inventory.preferences") }}</p>
                  <p class="cross-docking-checkout-text-subtitle">
                    {{ $t("inventory.setPreferencesForPayment") }}
                  </p>
                </div>
                <span
                  class="cross-docking-checkout-chevrons"
                  @click="
                    getDestinations[index - 1].preferences =
                      !getDestinations[index - 1].preferences
                  "
                >
                  <span class="cross-docking-checkout-chevrons-text">{{
                    $t("inventory.view")
                  }}</span>
                  <i
                    class="mdi mdi-chevron-up"
                    v-if="getDestinations[index - 1].preferences"
                  ></i>
                  <i class="mdi mdi-chevron-down" v-else></i>
                </span>
              </div>
            </div>
            <div v-if="getDestinations[index - 1].preferences">
              <div class="row">
                <div class="col-1"></div>
                <div class="mb-10 col-11" v-if="paymentOnDeliveryFlag">
                  <p
                    class="select-payment-collection-error"
                    v-if="selectPaymentCollection"
                  >
                    <i class="mdi mdi-alert mr-3"></i>
                    <span class="select-payment-collection-error-text">{{
                      $t("inventory.pleaseSelectTheOptionThatApplies")
                    }}</span>
                  </p>
                  <p class="cross-docking-checkout-text-subtitle">
                    {{ $t("inventory.doYouWantPaymentForThisDelivery") }}
                  </p>
                  <div
                    :class="
                      paymentOnDeliveryDisabledStatus(index - 1)
                        ? 'disabled-POD-row'
                        : ''
                    "
                  >
                    <div
                      class="payment-collection-select"
                      @click="addPaymentCollection(index)"
                    >
                      <p
                        class="mr-auto payment-collection-select-text weight-override crossdocking-text-blue"
                        v-if="
                          (getDestinations[index - 1] &&
                            getDestinations[index - 1].POD &&
                            getDestinations[index - 1].POD
                              .amountToBeCollected === '') ||
                          !getDestinations[index - 1].POD
                        "
                      >
                        {{ $t("inventory.select") }}
                      </p>
                      <p
                        class="mr-auto payment-collection-select-text weight-override"
                        v-else-if="
                          getDestinations[index - 1] &&
                          getDestinations[index - 1].POD &&
                          getDestinations[index - 1].POD.amountToBeCollected ===
                            'none'
                        "
                      >
                        {{ $t("inventory.noDontCollectPayment") }}
                      </p>
                      <p
                        class="mr-auto payment-collection-select-text"
                        v-else-if="
                          getDestinations[index - 1] &&
                          getDestinations[index - 1].POD &&
                          getDestinations[index - 1].POD.amountToBeCollected ===
                            'nofee'
                        "
                      >
                        <span class="weight-override">
                          {{
                            $t("inventory.collect", {
                              Amount: `${
                                deliveryPricing
                                  ? deliveryPricing.currency
                                  : getBusinessDetails.currency
                              } ${
                                deliveryPricing
                                  ? deliveryPricing.total_product_value
                                  : 0
                              }`,
                            })
                          }}
                        </span>
                        <br />
                        <span>{{ $t("inventory.priceOfProducts") }}</span>
                      </p>
                      <p
                        class="mr-auto payment-collection-select-text"
                        v-else-if="
                          getDestinations[index - 1] &&
                          getDestinations[index - 1].POD &&
                          getDestinations[index - 1].POD.amountToBeCollected ===
                            'fee'
                        "
                      >
                        <span class="weight-override">
                          {{
                            $t("inventory.collect", {
                              Amount: `${
                                getFulfillmentFees.pricing.pricing_deliveries[
                                  index - 1
                                ].currency
                              } ${
                                parseInt(
                                  getFulfillmentFees.pricing.pricing_deliveries[
                                    index - 1
                                  ].total_product_value
                                ) +
                                parseInt(
                                  getDestinations[index - 1].POD.deliveryFee
                                    ? getDestinations[index - 1].POD.deliveryFee
                                    : 0
                                )
                              }`,
                            })
                          }}
                        </span>
                        <br />
                        <span>{{
                          $t("inventory.priceOfProducts&DeliveryFee")
                        }}</span>
                      </p>
                      <v-icon
                        class="payment-method-icon payment-collection-select-text"
                        >mdi-chevron-right</v-icon
                      >
                    </div>
                    <div
                      v-if="paymentOnDeliveryDisabledStatus(index - 1)"
                      class="autofill-error"
                    >
                      <div>
                        <i
                          class="mdi mdi-alert-outline autofill-error-icon"
                          aria-hidden="true"
                        ></i>
                      </div>
                      <div>{{ $t("inventory.outsideGeofence") }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row" v-if="crossDockingFlag">
                <div class="col-1"></div>
                <div class="mb-10 col-11">
                  <p class="cross-docking-checkout-text-subtitle">
                    {{
                      $t(
                        "inventory.doYouHaveDocumentsThatAccompanyYourDelivery"
                      )
                    }}
                  </p>
                  <div>
                    <div
                      v-if="
                        getDestinations[index - 1] &&
                        getDestinations[index - 1].documents
                      "
                    >
                      <div
                        v-for="(docs, x) in getDestinations[index - 1]
                          .documents"
                        :key="x"
                        class="crossdocking-documents-list"
                      >
                        <div class="crossdocking-documents-list-inner">
                          <i class="mdi mdi-text-box-outline"></i>
                          <span class="ml-3">{{
                            docs.title ? docs.title : docs.type
                          }}</span>
                          <v-menu v-model="menus[x]">
                            <template v-slot:activator="{ props }">
                              <i
                                class="mdi mdi-dots-vertical payment-method-icon"
                                v-bind="props"
                              ></i>
                            </template>
                            <v-list>
                              <v-list-item
                                v-for="(option, i) in options"
                                :key="i"
                              >
                                <v-list-item-title
                                  @click="execute(option.action, index, x)"
                                  >{{ option.title }}</v-list-item-title
                                >
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                      </div>
                    </div>
                    <div
                      class="payment-collection-select"
                      @click="addDeliveryDocuments(index)"
                    >
                      <p
                        class="mr-auto payment-collection-select-text weight-override crossdocking-text-blue"
                      >
                        {{ $t("inventory.addDocument") }}
                      </p>
                      <v-icon
                        class="payment-method-icon payment-collection-select-text"
                        >mdi-chevron-right</v-icon
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-1"></div>
                <div
                  class="mb-10 col-11 cross-docking-checkout-product-underline"
                >
                  <p class="cross-docking-checkout-text-subtitle">
                    {{ $t("inventory.doYouHaveAReferenceNumber") }}
                  </p>
                  <div>
                    <v-text-field
                      :label="$t('inventory.enterReferenceNumber')"
                      variant="outlined"
                      v-model="referenceNumbers[index - 1]"
                      @input="addReferenceNumber(index - 1, $event)"
                      clearable
                      clear-icon="mdi-close"
                      density="compact"
                    ></v-text-field>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="row crossdocking-expansion-panel-remove-border"
              v-if="indeces > 1"
            >
              <div class="cross-docking-checkout-remove-button">
                <div
                  class="d-flex crossdocking-expansion-panel-remove"
                  @click="removeLocation(index - 1)"
                >
                  <i class="mdi mdi-close"></i>
                  <span class="ml-1">{{ $t("inventory.remove") }}</span>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div
        class="cross-docking-checkout-add-location"
        @click="addLocation()"
        v-if="multidestination"
      >
        <i class="mdi mdi-plus cross-docking-checkout-add-location-plus"></i>
        {{ $t("inventory.addAnotherDeliveryLocation") }}
      </div>
      <div class="mt-5 mb-4" v-if="pickUpRequired">
        <p class="payment-collection-title mb-1">
          {{ $t("inventory.pickUpInfo") }}
        </p>
        <p class="payment-collection-title mb-3 pickup-let-us-know">
          ({{ $t("inventory.pleaseLetUsKnow") }})
        </p>
        <div class="row" v-if="FCdropoffStatus">
          <div class="col-1">
            <i class="mdi mdi-store-outline cross-docking-checkout-icons"></i>
          </div>
          <div class="col-11">
            <div>
              <span class="cross-docking-pickup-title">
                {{ $t("inventory.howDoYouWantTheUnavailableItemsToBePicked") }}
              </span>
            </div>
            <div
              class="cross-docking-checkout-text-grey"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'pickItems',
                })
              "
            >
              <span>{{
                getPickUpOptions.type
                  ? $t(getPickUpOptions.text)
                  : $t("inventory.select")
              }}</span>
              <span class="cross-docking-checkout-chevrons"
                ><i class="mdi mdi-chevron-right"></i
              ></span>
            </div>
          </div>
        </div>
        <div class="row mt-4" v-if="getPickUpOptions.type === 'driver'">
          <div class="col-1">
            <i class="mdi mdi-account-outline cross-docking-checkout-icons"></i>
          </div>
          <div class="col-11">
            <div
              class="cross-docking-checkout-text pb-3"
              v-if="
                !(
                  getPickUpInfoCD.location ||
                  getPickUpInfoCD.phone ||
                  getPickUpInfoCD.instructions
                )
              "
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'pickUpInfoCrossDock',
                })
              "
            >
              <span>{{ $t("inventory.addPickUpInfo") }}</span>
              <span class="cross-docking-checkout-chevrons"
                ><i class="mdi mdi-chevron-right"></i
              ></span>
            </div>
            <div
              class="cross-docking-checkout-text-grey cross-docking-checkout-text-override"
              v-else
            >
              <div>
                <p>{{ $t("inventory.pickUpInfo") }}</p>
                <div class="crossdocking-items-line-height">
                  <p>{{ getPickUpInfoCD.location }}</p>
                  <p>{{ getPickUpInfoCD.phone }}</p>
                  <p>{{ getPickUpInfoCD.instructions }}</p>
                </div>
              </div>
              <span
                class="cross-docking-checkout-chevrons"
                @click="
                  setOverlayStatus({
                    overlay: true,
                    popup: 'pickUpInfoCrossDock',
                  })
                "
              >
                <span class="cross-docking-checkout-chevrons-text">{{
                  $t("inventory.change")
                }}</span>
                <i class="mdi mdi-chevron-right"></i>
              </span>
            </div>
          </div>
        </div>
        <div
          v-if="
            showErrors &&
            pickUpRequired &&
            !(getPickUpInfoCD.location && getPickUpInfoCD.phone)
          "
          class="row error-msg withdraw-transaction-error mb-3 field-required-error pt-4"
        >
          <div class="col-1"></div>
          <div class="col-11">{{ $t("inventory.thisFieldIsRequired") }}</div>
        </div>
        <div
          class="mb-4 mt-4 row cross-docking-checkout-row cross-docking-checkout-text-override"
          v-if="getPickUpOptions.type === 'driver' && speedPolicyFlag"
        >
          <div class="col-1">
            <i class="mdi mdi-clock-outline cross-docking-checkout-icons"></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
          >
            <div class="crossdocking-documents-list-inner">
              <p class="mb-2 d-flex">
                <span>
                  {{ $t("inventory.pickUpDate") }}
                </span>
                <span
                  class="cross-docking-checkout-chevrons"
                  @click="addPickupOption(index)"
                  v-if="getPickUpInfoCD && getPickUpInfoCD.pickupSpeed"
                >
                  <span class="cross-docking-checkout-chevrons-text">{{
                    $t("inventory.change")
                  }}</span>
                  <i class="mdi mdi-chevron-right"></i>
                </span>
              </p>
              <div
                class="cross-docking-checkout-text"
                v-if="!(getPickUpInfoCD && getPickUpInfoCD.pickupSpeed)"
                @click="addPickupOption(index)"
              >
                <span>{{ $t("inventory.selectAPickUpOption") }}</span>
                <span class="cross-docking-checkout-chevrons"
                  ><i class="mdi mdi-chevron-right"></i
                ></span>
              </div>
              <div
                class="cross-docking-checkout-text-grey cross-docking-checkout-text-override"
                v-else
              >
                <div>
                  <div class="delivery-details-text">
                    <p>
                      <span class="cross-docking-checkout-delivery-option-top">
                        {{
                          getPickUpInfoCD.pickupSpeed.speed_pricing_description
                        }}
                      </span>
                    </p>
                    <p>
                      <span
                        class="cross-docking-checkout-delivery-option-bottom"
                      >
                        {{
                          getPickUpInfoCD.pickupSpeed.speed_pricing_type ===
                          "SENDY_SCHEDULED"
                            ? formatDate(
                                getPickUpInfoCD.pickupSpeed
                                  .speed_pricing_scheduled_date
                              )
                            : formatDate(
                                getPickUpInfoCD.pickupSpeed
                                  .speed_pricing_upper_limit_date
                              )
                        }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-if="
                  showErrors &&
                  !(
                    (getPickUpInfoCD &&
                      getPickUpInfoCD.pickupSpeed &&
                      speedPolicyFlag) ||
                    !speedPolicyFlag
                  )
                "
                class="error-msg withdraw-transaction-error mb-3 field-required-error pt-4"
              >
                <div class="">
                  {{ $t("inventory.thisFieldIsRequired") }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="mb-4 mt-4 row cross-docking-checkout-row cross-docking-checkout-text-override"
          v-if="getPickUpOptions.type === 'self'"
        >
          <div class="col-1">
            <i class="mdi mdi-warehouse cross-docking-checkout-icons"></i>
          </div>
          <div
            class="col-11 cross-docking-checkout-text-grey cross-docking-checkout-text-override"
          >
            <div>
              <p class="mb-2">
                {{ $t("inventory.selectTheSendyPickUpStationToTakeTheItems") }}
              </p>
              <p>
                {{
                  getPickUpStation.name
                    ? getPickUpStation.name
                    : $t("inventory.select")
                }}
              </p>
            </div>
            <span
              class="cross-docking-checkout-chevrons"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'stations',
                })
              "
            >
              <span class="cross-docking-checkout-chevrons-text">{{
                $t("inventory.change")
              }}</span>
              <i class="mdi mdi-chevron-right"></i>
            </span>
          </div>
        </div>
      </div>
      <hr class="mt-3" />
      <div class="mt-3">
        <p class="payment-collection-label">
          {{ $t("inventory.paymentOfFulfillmentFees") }}
        </p>
        <p class="payment-collection-fees-text" v-if="cycleDate">
          {{
            $t("inventory.weWillChargeYourWallet", {
              Date: cycleDate,
            })
          }}
        </p>
      </div>
      <div v-if="paymentEnabled">
        <div
          class="payment-method-default"
          v-for="(method, i) in defaultPaymentMethod"
          :key="i"
        >
          <img
            class="mr-2"
            :src="`https://sendy-web-apps-assets.s3.eu-west-1.amazonaws.com/payment-method-icons/${method.pay_method_name.toLowerCase()}.svg`"
            alt=""
          />
          <span class="ml-3">{{ formatPaymentMethod(method) }}</span>
          <span
            class="payment-default-right payment-default-trigger"
            @click="selectPaymentMethod"
          >
            <v-icon class="payment-method-icon">mdi-chevron-right</v-icon></span
          >
        </div>
        <div
          class="payment-method-default"
          v-if="defaultPaymentMethod.length === 0"
        >
          <span class="payment-default-left">{{
            $t("payments.noDefaultPaymentMethodSelected")
          }}</span>
          <span
            class="payment-default-right payment-default-trigger"
            @click="selectPaymentMethod"
            >{{ $t("inventory.change") }}
            <v-icon class="payment-method-icon">mdi-chevron-right</v-icon></span
          >
        </div>
      </div>
      <div class="d-grid gap-2 col-12 mx-auto pt-3 mb-3">
        <button
          class="btn btn-primary mt-2 btn-long submit-order-btn"
          @click="createDelivery()"
          v-loading="buttonLoader"
          :disabled="buttonLoader"
        >
          {{ $t("inventory.submitOrder") }}
        </button>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import { ElNotification } from "element-plus";
import eventsMixin from "../../../../mixins/events_mixin";
import placeholder from "../../../../mixins/placeholders";
import moment from "moment";

export default {
  mixins: [eventsMixin, placeholder],
  data() {
    return {
      amount: 566,
      currency: "KES",
      addPhoneStatus: false,
      name: "",
      location: "",
      place: {},
      instructions: "",
      phone: "",
      secPhone: "",
      buttonLoader: false,
      selectPaymentCollection: false,
      menus: [],
      options: [
        {
          title: this.$t("inventory.viewDocument"),
          action: "viewDocument",
        },
        {
          title: this.$t("inventory.remove"),
          action: "removeDocument",
        },
      ],
      referenceNumbers: [],
      showErrors: false,
      multidestination: true,
      FCdropoffStatus: false,
    };
  },
  watch: {
    $route(from, to) {
      if (to.path.includes("checkout")) {
        this.setCheckoutDetails({
          name: this.name,
          location: this.location,
          place: this.place,
          instructions: this.instructions,
          phone: this.phone,
          secPhone: this.secPhone,
          addPhoneStatus: this.addPhoneStatus,
        });
      }
    },
    "$store.state.destinations": {
      handler() {
        this.getPricing();
      },
      deep: true,
    },
    "$store.state.pickUpInfoCD": {
      handler() {
        this.getPricing();
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters([
      "getSendyPhoneProps",
      "getFulfillmentFees",
      "getSelectedProducts",
      "getBusinessDetails",
      "getUserDetails",
      "getPaymnetMethods",
      "getLoader",
      "getStorageUserDetails",
      "getAchievements",
      "getCheckoutDetails",
      "getMapOptions",
      "getPaymentCollectionStatus",
      "getActivePayment",
      "getBillingCycles",
      "getDestinations",
      "getDestinationIndex",
      "getDeliveryInfo",
      "getRecepientInfo",
      "getPickUpOptions",
      "getPickUpInfoCD",
      "getPickUpStation",
      "getPickUpSpeed",
      "getDeliverySpeed",
      "getMismatchedDates",
      "getAutofillDetails",
      "getLPOUploadError",
    ]),
    indeces() {
      return this.getDestinations.length;
    },
    pickUpRequired() {
      let status = false;
      this.getDestinations.forEach((row) => {
        if (row.products) {
          row.products.forEach((product) => {
            const availableStock = product.selectedOption
              ? product.selectedOption.product_variant_stock_levels.available
              : product.product_variants[0].product_variant_stock_levels
                  .available;
            if (availableStock < this.productQuantities(product)) {
              status = true;
            }
          });
        }
      });
      return status;
    },
    onboardingStatus() {
      if (Object.values(this.getAchievements).includes(false)) {
        return true;
      }
      return false;
    },
    paymentOnDeliveryFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.payments_on_delivery_enabled
        : false;
    },
    cycleDate() {
      const date =
        this.getBillingCycles.length && this.getBillingCycles[0].active > 0
          ? this.getBillingCycles[0].billing_cycle_end_date
          : "";
      return date
        ? moment(date).format("dddd, Do MMM")
        : this.$t("inventory.YourNextBillingCycle");
    },
    crossDockingFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.cross_docking_enabled
        : false;
    },
    speedPolicyFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.attach_speed_policy_enabled
        : false;
    },
    defaultPaymentMethod() {
      const method = [];
      this.getPaymnetMethods.forEach((row) => {
        if (row.default === 1) {
          method.push(row);
        }
      });
      return method;
    },
    paymentEnabled() {
      if (
        this.getBusinessDetails.settings &&
        this.getBusinessDetails.settings.payments_enabled
      ) {
        return true;
      }
      return false;
    },
    meansOfPayment() {
      let paymentMethod = "";
      switch (this.defaultPaymentMethod[0].pay_method_name) {
        case "M-PESA":
          paymentMethod = this.defaultPaymentMethod[0].pay_method_name
            .toUpperCase()
            .replace("-", "");
          break;
        case "Card":
          paymentMethod =
            this.defaultPaymentMethod[0].pay_method_name.toUpperCase();
          break;
        case "Virtual Accounts":
          paymentMethod = (
            this.defaultPaymentMethod[0].pay_method_name.substring(0, 7) +
            "_" +
            this.defaultPaymentMethod[0].pay_method_name.substring(
              8,
              this.defaultPaymentMethod[0].pay_method_name.length
            )
          ).toUpperCase();
          break;
        default:
          paymentMethod = "";
          break;
      }
      return paymentMethod;
    },
    checkoutPayload() {
      const payload = {
        means_of_payment: this.defaultPaymentMethod[0]
          ? this.meansOfPaymentPayload
          : {},
        pickups: this.pickUpPayload,
        deliveries: this.deliveriesPayload,
      };
      return payload;
    },
    deliveryPricing() {
      return this.getFulfillmentFees.pricing.pricing_deliveries[
        this.getDestinationIndex
      ];
    },
    deliverySpeeds() {
      return this.getDeliverySpeed.length
        ? this.getDeliverySpeed[0].proposed_speeds
        : [];
    },
    meansOfPaymentPayload() {
      return {
        means_of_payment_type: this.getBusinessDetails.settings
          ?.payments_enabled
          ? this.meansOfPayment
          : "CARD",
        means_of_payment_identifier: this.getBusinessDetails.settings
          ?.payments_enabled
          ? this.defaultPaymentMethod[0].pay_method_details
          : "",
        participant_type: "SELLER",
        participant_id: this.getBusinessDetails.settings?.payments_enabled
          ? this.defaultPaymentMethod[0].user_id
          : "",
      };
    },
    pickUpPayload() {
      return [
        {
          local_order_uuid: this.generateUUID("pickup"),
          seller_order_reference_id: "",
          promotion_session_id: "",
          destination: {
            name: this.getBusinessDetails.business_name,
            phone_number: this.getPickUpInfoCD.phone
              ? this.getPickUpInfoCD.phone
              : "",
            secondary_phone_number: this.getPickUpInfoCD.secondary_phone_number
              ? this.getPickUpInfoCD.secondary_phone_number
              : "",
            delivery_location:
              this.getPickUpInfoCD.place && this.getPickUpInfoCD.location
                ? {
                    description: this.getPickUpInfoCD?.location,
                    longitude:
                      this.getPickUpInfoCD?.place?.geometry?.location?.lng(),
                    latitude:
                      this.getPickUpInfoCD?.place?.geometry?.location?.lat(),
                  }
                : null,
            house_location: "",
            delivery_instructions: this.getPickUpInfoCD.instructions
              ? this.getPickUpInfoCD.instructions
              : "",
          },
          destination_policy: "DROP_AT_HUB",
          destination_speed_policy: this.speedPolicyFlag
            ? {
                transport_provider: this.getPickUpInfoCD.pickupSpeed
                  ? this.getPickUpInfoCD.pickupSpeed.transport_provider
                  : "SENDY",
                speed_pricing_type: this.getPickUpInfoCD.pickupSpeed
                  ? this.getPickUpInfoCD.pickupSpeed.speed_pricing_type
                  : "SENDY_EXPRESS",
                speed_pricing_uuid: this.getPickUpInfoCD.pickupSpeed
                  ? this.getPickUpInfoCD.pickupSpeed.speed_pricing_uuid
                  : "string",
                proposed_scheduled_date:
                  this.getPickUpInfoCD.pickupSpeed &&
                  this.getPickUpInfoCD.pickupSpeed.speed_pricing_type ===
                    "SENDY_SCHEDULED"
                    ? moment(
                        this.getPickUpInfoCD.pickupSpeed
                          .speed_pricing_scheduled_date
                      ).valueOf()
                    : 0,
              }
            : null,
        },
      ];
    },
    deliveriesPayload() {
      const deliveries = [];
      this.getDestinations.forEach((destination, i) => {
        const products = [];
        const documents = [];
        const destinationProducts = destination.products
          ? destination.products
          : [];
        destinationProducts.forEach((row) => {
          products.push({
            product_id: row.product_id,
            product_variant_id: row.selectedOption
              ? row.selectedOption.product_variant_id
              : row.product_variants[0].product_variant_id,
            quantity: row.quantity,
            currency: row.selectedOption
              ? row.selectedOption.product_variant_currency
              : row.product_variants[0].product_variant_currency,
            unit_price: row.selectedOption
              ? row.selectedOption.product_variant_unit_price
              : row.product_variants[0].product_variant_unit_price,
          });
        });
        const destinationDocuments = destination.documents
          ? destination.documents
          : [];
        destinationDocuments.forEach((row) => {
          documents.push({
            document_type: row.type.toUpperCase().replace(/\s/g, "_"),
            document_url: row.url,
            document_description: row.title,
          });
        });
        const delivery = {
          local_order_uuid: this.generateUUID(`destination_${i}`),
          seller_order_reference_id: destination.reference_number,
          promotion_session_id: "",
          products,
          destination: {
            name: destination.recipient
              ? destination.recipient.customer_name
              : "",
            buyer_type: destination.recipient
              ? destination.recipient.recipient_type.toUpperCase()
              : null,
            phone_number: destination.recipient
              ? destination.recipient.phone
              : "",
            secondary_phone_number: destination.recipient
              ? destination.recipient.secondary_phone_number
              : "",
            delivery_location: destination.delivery_info
              ? {
                  description: destination?.delivery_info?.location,
                  longitude:
                    destination?.delivery_info?.place?.geometry?.location?.lng(),
                  latitude:
                    destination?.delivery_info?.place?.geometry?.location?.lat(),
                }
              : null,
            house_location: destination.delivery_info
              ? destination.delivery_info.apartmentName
              : "",
            delivery_instructions: destination.delivery_info
              ? destination.delivery_info.instructions
              : "",
          },
          destination_policy: "DELIVER_TO_BUYER",
          destination_speed_policy: this.speedPolicyFlag
            ? {
                transport_provider: destination.speed
                  ? destination.speed.transport_provider
                  : "SENDY",
                speed_pricing_type: destination.speed
                  ? destination.speed.speed_pricing_type
                  : "SENDY_EXPRESS",
                speed_pricing_uuid: destination.speed
                  ? destination.speed.speed_pricing_uuid
                  : "string",
                proposed_scheduled_date:
                  destination.speed &&
                  destination.speed.speed_pricing_type === "SENDY_SCHEDULED"
                    ? moment(
                        destination.speed.speed_pricing_scheduled_date
                      ).valueOf()
                    : 0,
              }
            : null,
          documents,
        };
        if (
          destination.POD &&
          (destination.POD.amountToBeCollected === "fee" ||
            destination.POD.amountToBeCollected === "nofee") &&
          this.paymentOnDeliveryFlag
        ) {
          delivery.sale_of_goods_policy = {
            costs_to_collect: [
              {
                cost_type: "SALE_OF_GOOD",
              },
            ],
          };
          if (destination.POD.amountToBeCollected === "fee") {
            delivery.sale_of_goods_policy.costs_to_collect.push({
              cost_type: "DELIVERY_FEE",
              cost_amount: destination.POD.deliveryFee
                ? destination.POD.deliveryFee
                : 0,
              currency: this.getBusinessDetails.currency,
            });
          }
        }
        deliveries.push(delivery);
      });
      return deliveries;
    },
  },
  beforeMount() {
    if (localStorage.country) {
      const props = this.getSendyPhoneProps;
      props.defaultCountry = localStorage.country.toLowerCase();
      this.setSendyPhoneProps(props);
    }
  },
  mounted() {
    this.getDefaultPaymentMethod();
    this.activeBillingCycle();
    this.setEditValue(false);
    this.setPaymentCollectionStatus({
      status: "",
      amountToBeCollected: "",
      deliveryFee: "",
    });
    this.getPricing();
    this.getDestinations.forEach((row, i) => {
      this.referenceNumbers[i] = row.reference_number;
    });
    this.name = this.getCheckoutDetails.name;
    this.location = this.getCheckoutDetails.location;
    this.place = this.getCheckoutDetails.place;
    this.instructions = this.getCheckoutDetails.instructions;
    this.phone = this.getCheckoutDetails.phone;
    this.secPhone = this.getCheckoutDetails.secPhone;
    this.addPhoneStatus = this.getCheckoutDetails.addPhoneStatus;
  },
  methods: {
    ...mapMutations([
      "setProductStep",
      "setPaymentMethods",
      "setCheckoutDetails",
      "setSendyPhoneProps",
      "setSelectedProducts",
      "setOverlayStatus",
      "setPaymentCollectionStatus",
      "setActivePayment",
      "setBillingCycles",
      "setDestinations",
      "setDestinationIndex",
      "setDocumentURL",
      "setSelectedProducts",
      "setFulfillmentFees",
      "setLoader",
      "setPickUpInfoCD",
      "setPickUpOptions",
      "setPickUpSpeed",
      "setDeliverySpeed",
      "setMismatchedDates",
      "setEditValue",
      "setGeofenceData",
      "setAutofillDetails",
    ]),
    ...mapActions(["requestAxiosPost", "requestAxiosGet"]),
    addProducts(index) {
      this.setDestinationIndex(index);
      if (this.getDestinations[index].products) {
        this.setSelectedProducts(this.getDestinations[index].products);
        this.$router.push("/inventory/add-delivery-quantities");
      } else {
        this.setSelectedProducts([]);
        this.$router.push("/inventory/add-delivery-products");
      }
    },
    openAutofillPopup(index) {
      this.setDestinationIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "uploadLPO",
      });
    },
    LPOAutofillFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.lpo_autofill_enabled
        : false;
    },
    getMissingAutofillFields(fields) {
      return `${!fields?.recipient_type ? "'Recipient type'" : ""}${
        !fields?.customer_name ? "'Customer name'" : ""
      }${
        !fields?.phone || !/^\+([0-9 ]+)$/i.test(fields?.phone)
          ? "'Phone number'"
          : ""
      }`;
    },
    productQuantities(reference) {
      let stock = 0;
      this.getDestinations.forEach((row) => {
        if (row.products) {
          row.products.forEach((product) => {
            if (product.selectedOption && reference.selectedOption) {
              if (
                product.selectedOption.product_id ===
                  reference.selectedOption.product_id &&
                product.selectedOption.product_variant_id ===
                  reference.selectedOption.product_variant_id
              ) {
                stock = stock + product.quantity;
              }
            } else if (!product.selectedOption && !reference.selectedOption) {
              if (
                product.product_variants[0].product_id ===
                  reference.product_variants[0].product_id &&
                product.product_variants[0].product_variant_id ===
                  reference.product_variants[0].product_variant_id
              ) {
                stock = stock + product.quantity;
              }
            }
          });
        }
      });
      return stock;
    },
    formatDate(date) {
      return moment(date).format("ddd, Do MMM");
    },
    changeIndex(index) {
      this.setDestinationIndex(index - 1);
    },
    addReferenceNumber(index, event) {
      const destinations = this.getDestinations;
      if (destinations[index]) {
        destinations[index].reference_number = event.target.value;
      } else {
        destinations.splice(index, 0, {
          reference_number: event.target.value,
        });
      }
    },
    addLocation() {
      const destinations = this.getDestinations;
      destinations[destinations.length - 1].expanded = 0;
      destinations.push({
        expanded: 1,
        preferences: false,
        POD: {
          amountToBeCollected: "none",
        },
      });
      this.setDestinations(destinations);
    },
    removeLocation(index) {
      this.setDestinationIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "removeDestination",
      });
    },
    execute(action, index, x) {
      this.menus[x] = false;
      if (action === "viewDocument") {
        this.setDocumentURL(this.getDestinations[index - 1].documents[x].url);
        this.setOverlayStatus({
          overlay: true,
          popup: "viewDocument",
        });
      } else {
        const documents = this.getDestinations[index - 1].documents;
        const destinations = this.getDestinations;
        documents.splice(x, 1);
        destinations[index - 1].documents = documents;
        this.setDestinations(destinations);
      }
    },
    addProductStep(val) {
      this.setProductStep(val);
    },
    addDeliveryInfo(index) {
      this.changeIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "deliveryInfoCrossdock",
      });
    },
    addRecepientInfo(index) {
      this.changeIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "recepientInfoCrossdock",
      });
    },
    addDeliveryOption(index) {
      this.changeIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "deliveryOptionCrossdock",
      });
      this.mismatchedDates();
      if (
        this.getMismatchedDates &&
        this.getDestinations[index - 1].products &&
        this.getDestinations[index - 1].delivery_info
      ) {
        if (this.getPickUpInfoCD.pickupSpeed) {
          this.addPickupOption();
        } else {
          this.setOverlayStatus({
            overlay: true,
            popup: "deliveryOptionCrossdock",
          });
        }
      } else if (
        !this.getDestinations[index - 1].products ||
        !this.getDestinations[index - 1].delivery_info
      ) {
        this.setOverlayStatus({
          overlay: true,
          popup: "deliveryOptionNotice",
        });
      }
    },
    mismatchedDates() {
      const index = this.getDestinationIndex;
      this.setMismatchedDates(
        this.pickUpRequired &&
          ((this.getPickUpInfoCD.pickupSpeed &&
            this.getDestinations[index].speed &&
            this.getDestinations[index].speed.speed_pricing_upper_limit_date <=
              this.getPickUpInfoCD.pickupSpeed
                .speed_pricing_upper_limit_date) ||
            (!this.getPickUpInfoCD.pickupSpeed &&
              !this.getDestinations[index].speed))
      );
    },
    addPickupOption() {
      this.setOverlayStatus({
        overlay: true,
        popup: "pickupOptionCrossdock",
      });
      this.mismatchedDates();
    },
    addPaymentCollection(index) {
      this.changeIndex(index);
      this.setPaymentCollectionStatus({
        amountToBeCollected:
          this.getDestinations[index - 1].POD.amountToBeCollected,
        status: this.getDestinations[index - 1].POD.status,
        deliveryFee: this.getDestinations[index - 1].POD.deliveryFee,
      });
      this.setOverlayStatus({
        overlay: true,
        popup: "paymentCollection",
      });
    },
    addDeliveryDocuments(index) {
      this.changeIndex(index);
      this.setOverlayStatus({
        overlay: true,
        popup: "deliveryDocuments",
      });
    },
    setLocation(val) {
      this.place = val;
      this.location = document.querySelector("#location").value;
    },
    paymentOnDeliveryDisabledStatus(index) {
      const destination = this.getDestinations[index];
      if (
        destination.speed &&
        destination.speed?.transport_provider !== "SENDY" &&
        destination.POD.amountToBeCollected !== "none"
      ) {
        destination.POD.amountToBeCollected = "none";
      }
      return (
        destination.speed && destination.speed?.transport_provider !== "SENDY"
      );
    },
    formatPaymentMethod(method) {
      if (method.pay_method_id === 20) {
        return "Pay by Bank";
      }
      return method.pay_method_details
        ? method.pay_method_details
        : method.pay_method_name;
    },
    getDefaultPaymentMethod() {
      this.requestAxiosPost({
        app: process.env.AUTH,
        endpoint: "payment-gateway/payment_methods",
        values: {
          country_code: this.getBusinessDetails.country_code
            ? this.getBusinessDetails.country_code
            : localStorage.country,
          entity_id: "6",
          user_id: this.getBusinessDetails.business_id
            ? this.getBusinessDetails.business_id
            : JSON.parse(localStorage.userDetails).business_id,
          pay_direction: "PAY_IN",
        },
      }).then((response) => {
        if (response.data) {
          this.setPaymentMethods(response.data.saved_payment_methods);
        }
      });
    },
    activeBillingCycle() {
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/billingcycles`,
      }).then((response) => {
        if (response.status === 200) {
          this.setBillingCycles(response.data.data.billing_cycles);
        }
      });
    },
    getPricing() {
      this.getSpeed();
      const destinations = this.getDestinations;
      if (
        destinations?.length &&
        destinations[this.getDestinationIndex]?.products
      ) {
        this.setLoader({
          type: "calculateFee",
          value: "loading-text",
        });
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/crossdocked-delivery/calculate-fee`,
          values: this.checkoutPayload,
        }).then((response) => {
          this.setLoader({
            type: "calculateFee",
            value: "",
          });
          if (response.status === 200) {
            this.setFulfillmentFees(response.data.data);
          }
        });
      }
    },
    getSpeed() {
      this.setLoader({
        type: "speed",
        value: "loading-text",
      });
      this.requestAxiosPost({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/crossdocked-delivery/calculate-speed`,
        values: this.checkoutPayload,
      }).then((response) => {
        this.setLoader({
          type: "speed",
          value: "",
        });
        if (response.status === 200) {
          this.setPickUpSpeed(response.data.data.pickups);
          this.setDeliverySpeed(response.data.data.deliveries);
          this.speedValidation(response.data.data);
          this.preselectDestinationSpeed(response.data.data.deliveries);
          this.preselectPickupSpeed(response.data.data.pickups);
        }
      });
    },
    preselectPickupSpeed(speeds) {
      const nextDay = speeds[0]?.proposed_speeds.filter((speed) => {
        return speed.speed_pricing_type === "SENDY_NEXT_DAY";
      });
      const pickUpInfoCD = this.getPickUpInfoCD;
      if (
        !pickUpInfoCD?.pickupSpeed &&
        pickUpInfoCD.place &&
        nextDay.length &&
        this.speedPolicyFlag
      ) {
        pickUpInfoCD.pickupSpeed = nextDay[0];
      }
    },
    preselectDestinationSpeed(speeds) {
      const nextDay = speeds[this.getDestinationIndex]?.proposed_speeds.filter(
        (speed) => {
          return speed.speed_pricing_type === "SENDY_NEXT_DAY";
        }
      );
      const destination = this.getDestinations[this.getDestinationIndex];
      if (
        !destination?.speed &&
        destination?.delivery_info &&
        destination?.products &&
        nextDay.length &&
        this.speedPolicyFlag
      ) {
        destination.speed = nextDay[0];
      }
    },
    speedValidation(speeds) {
      if (this.getPickUpInfoCD.pickupSpeed) {
        const pickUpValidationList = speeds.pickups[0]?.proposed_speeds.filter(
          (speed) => {
            return (
              speed.speed_pricing_type ===
                this.getPickUpInfoCD.pickupSpeed.speed_pricing_type &&
              speed.speed_pricing_uuid ===
                this.getPickUpInfoCD.pickupSpeed.speed_pricing_uuid
            );
          }
        );
        if (pickUpValidationList.length === 0) {
          const pickupInfo = this.getPickUpInfoCD;
          delete pickupInfo.pickupSpeed;
          this.setPickUpInfoCD(pickupInfo);
        }
      }
      const destination = this.getDestinations[this.getDestinationIndex];
      if (destination?.speed) {
        const destinationValidationList = speeds.deliveries[
          this.getDestinationIndex
        ].proposed_speeds.filter((speed) => {
          return (
            speed.speed_pricing_type === destination.speed.speed_pricing_type &&
            speed.speed_pricing_uuid === destination.speed.speed_pricing_uuid
          );
        });
        if (destinationValidationList.length === 0) {
          const destinations = this.getDestinations;
          delete destinations[this.getDestinationIndex].speed;
          this.setDestinations(destinations);
        }
      }
    },
    generateUUID(name) {
      if (!localStorage.local_order_uuid) {
        localStorage.local_order_uuid = JSON.stringify({});
      }
      if (
        localStorage.local_order_uuid &&
        !JSON.parse(localStorage.local_order_uuid)[name]
      ) {
        const uuid = JSON.parse(localStorage.local_order_uuid);
        uuid[name] = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
          /[018]/g,
          (c) =>
            (
              c ^
              (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
            ).toString(16)
        );
        localStorage.local_order_uuid = JSON.stringify(uuid);
      }
      return JSON.parse(localStorage.local_order_uuid)[name];
    },
    createDelivery() {
      let fieldsPresent = [];
      let submitStatus = false;
      this.getDestinations.forEach((row) => {
        if (
          row.products &&
          row.products.length &&
          row.delivery_info &&
          row?.delivery_info?.location &&
          row?.delivery_info?.place &&
          row.recipient &&
          row?.recipient?.phone &&
          /^\+([0-9 ]+)$/i.test(row?.recipient?.phone) &&
          ((row.speed && this.speedPolicyFlag) || !this.speedPolicyFlag) &&
          (!this.pickUpRequired ||
            (this.pickUpRequired &&
              this.getPickUpInfoCD.location &&
              this.getPickUpInfoCD.phone &&
              ((this.getPickUpInfoCD.pickupSpeed && this.speedPolicyFlag) ||
                !this.speedPolicyFlag)))
        ) {
          fieldsPresent.push(true);
        } else {
          fieldsPresent.push(false);
        }
      });
      submitStatus = fieldsPresent.includes(false) ? false : true;
      if (submitStatus) {
        this.buttonLoader = true;
        this.requestAxiosPost({
          app: process.env.FULFILMENT_SERVER,
          endpoint: `seller/${this.getStorageUserDetails.business_id}/crossdocked-delivery`,
          values: this.checkoutPayload,
        }).then((response) => {
          this.buttonLoader = false;
          if (response.status === 200) {
            ElNotification({
              title: this.$t("inventory.deliveryCreatedSuccessfully"),
              message: "",
              type: "success",
            });
            localStorage.removeItem("local_order_uuid");
            this.setFulfillmentFees(this.placeHolderFees);
            this.sendSegmentEvents({
              event: "Request_Delivery_to_Buyer",
              data: {
                userId: this.getStorageUserDetails.business_id,
                deliveries: this.checkoutPayload.deliveries,
                device: "desktop",
              },
            });
            window.gtag("event", "purchase", {
              transaction_id: response.data.data.order_id,
              items: [
                {
                  currency: this.getBusinessDetails.currency,
                  price:
                    this.getFulfillmentFees.pricing.pricing_subtotals
                      .fulfilment_fee,
                  quantity: 1,
                },
              ],
            });
            this.setSelectedProducts([]);
            this.setDestinations([
              {
                expanded: 1,
                preferences: false,
                POD: {
                  amountToBeCollected: "none",
                },
              },
            ]);
            this.setPickUpInfoCD({});
            this.setGeofenceData([]);
            this.setPickUpOptions({
              type: "driver",
              text: "inventory.sendDriverToPickTheItems",
              info: "",
              date: "",
              FC: "",
            });
            this.resetInput();
            if (this.onboardingStatus) {
              this.$router.push("/");
            } else if (response.data.data.deliveries.length === 1) {
              this.$router.push(
                `/deliveries/tracking/${response.data.data.deliveries[0].order_id}`
              );
            } else if (response.data.data.deliveries.length > 1) {
              this.$router.push(`/deliveries/customer`);
            }
          } else {
            ElNotification({
              title: this.$t("inventory.deliveryCreationFailed"),
              message: "",
              type: "error",
            });
          }
        });
      } else {
        this.showErrors = true;
      }
    },
    showNotification() {
      this.getDestinations.forEach((row, i) => {
        const index = `${i + 1}${this.numberSuffix(i + 1)}`;
        if (!(row.products && row.products.length)) {
          this.showErrorNotification(
            this.$t("inventory.addProductsError", { index }),
            200
          );
        }
        if (!row.delivery_info) {
          this.showErrorNotification(
            this.$t("inventory.addDeliveryInfoError", { index }),
            300
          );
        }
        if (!row.recipient) {
          this.showErrorNotification(
            this.$t("inventory.addRecipientInfoError", { index }),
            400
          );
        }
      });
      if (
        this.pickUpRequired &&
        !(this.getPickUpInfoCD.location && this.getPickUpInfoCD.phone)
      ) {
        this.showErrorNotification(
          this.$t("inventory.addPickUpInfoError"),
          100
        );
      }
    },
    numberSuffix(n) {
      return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
    },
    showErrorNotification(message, timeout) {
      setTimeout(() => {
        ElNotification({
          title: this.$t("deliveries.insufficientInformation"),
          message,
          type: "warning",
          duration: 15000,
        });
      }, timeout);
    },
    resetInput() {
      this.name = "";
      this.location = "";
      this.place = "";
      this.instructions = "";
      this.phone = "";
      this.secPhone = "";
      this.addPhoneStatus = "";
      this.setPaymentCollectionStatus({
        status: "",
        amountToBeCollected: "",
        deliveryFee: "",
      });
    },
    selectPaymentMethod() {
      const buPayload = {
        user_id: this.getBusinessDetails.business_id,
        entity_id: 6,
        currency: this.getBusinessDetails.currency,
        country_code: this.getBusinessDetails.country_code,
        amount: "",
        success_callback_url: "",
        fail_callback_url: "",
        txref: "",
        bulk: false,
        paybill_no: "",
        email: this.getUserDetails.email,
        authToken: localStorage.accessToken,
        firstname: this.getUserDetails.first_name,
        lastname: this.getUserDetails.last_name,
        payment_options: "",
        company_code: this.getBusinessDetails.company_code,
        locale: this.getBusinessDetails.language,
      };

      this.$paymentInit(buPayload, "choose-payment");
    },
  },
};
</script>

<style>
.payment-method,
.payment-method-icon {
  color: #303133;
}
.payment-method-icon {
  float: right;
}
.payment-method-default {
  height: 60px;
  border-radius: 5px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  color: #324ba8;
  font-weight: 600;
}
.payment-default-right {
  margin-left: auto;
  font-size: 14px;
}
.payment-default-left {
  font-size: 14px;
}
.payment-default-trigger {
  cursor: pointer;
}
.checkout-phone {
  margin-top: -10px;
}
.checkout-input {
  height: 50px;
}
.payment-collection-label {
  font-size: 15px;
  font-weight: 500;
}
.payment-collection-title {
  color: #606266;
  margin-bottom: 10px;
  font-size: 20px;
}
.payment-collection-select {
  display: flex;
  width: 100%;
  cursor: pointer;
  border-bottom: 1px solid #dcdfe6;
  padding-top: 15px;
}
.payment-collection-select-text {
  color: #606266;
  font-size: 14px;
}
.weight-override {
  font-weight: 500;
}
.payment-collection-fees-text {
  font-size: 15px;
}
.select-payment-collection-error-text {
  font-size: 14px;
}
.select-payment-collection-error {
  color: #b72f25;
  display: flex;
  align-items: center;
  font-weight: 500;
}
.cross-docking-checkout-icons {
  font-size: 25px;
  color: #909399;
}
.cross-docking-checkout-row {
  align-items: center;
}
.cross-docking-checkout-roww {
  display: flex;
}
.cross-docking-checkout-chevrons {
  font-size: 20px;
  margin-left: auto;
  display: flex;
  align-items: center;
}
.cross-docking-checkout-text {
  cursor: pointer;
  color: #324ba8;
  font-size: 17px;
  font-weight: 500;
  border-bottom: 1px solid #dcdfe6;
  height: 60px;
  display: flex;
  align-items: center;
}
.cross-docking-checkout-text-no-underline {
  cursor: pointer;
  color: #324ba8;
  font-size: 17px;
  font-weight: 500;
  height: 60px;
  display: flex;
  align-items: center;
}
.cross-docking-checkout-text-grey {
  cursor: pointer;
  color: #606266;
  font-size: 17px;
  font-weight: 500;
  border-bottom: 1px solid #dcdfe6;
  height: 60px;
  display: flex;
  align-items: center;
}
.cross-docking-checkout-text-grey-no-underline {
  cursor: pointer;
  color: #606266;
  font-size: 17px;
  font-weight: 500;
  height: 60px;
  display: flex;
  align-items: center;
}
.cross-docking-checkout-chevrons-text {
  font-size: 14px;
}
.cross-docking-checkout-text-override {
  height: max-content !important;
  align-items: flex-start !important;
}
.delivery-details-text > p {
  line-height: 20px !important;
  font-weight: 400 !important;
  margin-bottom: 10px;
}
.cross-docking-checkout-text-subtitle {
  font-size: 15px;
  font-weight: 100;
}
.cross-docking-checkout-add-location {
  background: #f7f9fc;
  padding: 20px 25px;
  cursor: pointer;
}
.cross-docking-checkout-add-location-plus {
  color: #909399;
  font-size: 20px;
  margin-right: 20px;
}
.cross-docking-checkout-products-label {
  flex-direction: column;
  align-items: flex-start !important;
  height: max-content;
}
.cross-docking-checkout-products-label-upper {
  display: flex;
  width: 100%;
  margin-top: 5px;
}
.cross-docking-checkout-product-underline {
  border-bottom: 1px solid #dcdfe6;
}
.cross-docking-checkout-product-label-lower {
  text-transform: capitalize;
}
.crossdocking-text-blue {
  color: #324ba8;
}
.crossdocking-documents-list {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  color: #606266;
  font-weight: 100;
  font-size: 19px;
  margin-bottom: 10px;
}
.crossdocking-documents-list-inner {
  width: 100%;
}
.cross-docking-pickup-title {
  font-size: 17px;
  color: #303133;
}
.field-required-error {
  margin-top: -15px !important;
  font-size: 16px;
}
.crossdocking-items-line-height {
  line-height: 20px !important;
  font-weight: 400 !important;
}
.crossdocking-expansion-panel {
  padding: 5px;
  border-radius: 5px;
}
.crossdocking-expansion-panel
  .v-expansion-panel
  .v-expansion-panel-title
  .v-expansion-panel-title__overlay {
  background-color: white !important;
}
.crossdocking-expansion-panel
  .v-expansion-panel
  .v-expansion-panel-text
  .v-expansion-panel-text__wrapper {
  border-bottom: none !important;
}
.crossdocking-expansion-panel-remove {
  cursor: pointer;
  color: #9b101c;
  font-size: 19px;
  margin-left: -20px;
}
.el-collapse-item__header {
  font-size: 20px !important;
  color: #303133 !important;
  margin: 15px 0px !important;
  height: 70px !important;
  margin-bottom: 0px !important;
}
.el-collapse.el-collapse {
  border: none !important;
}
.cross-docking-checkout-delivery-option-top {
  font-weight: 400 !important;
  margin-bottom: 20px;
}
.cross-docking-checkout-delivery-option-bottom {
  margin-bottom: 20px;
}
.delivery-info-collapse div .el-collapse-item__header {
  pointer-events: none;
}
.delivery-info-collapse div .el-collapse-item__header .el-collapse-item__arrow {
  display: none;
}
.cross-docking-checkout-remove-button {
  width: max-content !important;
  margin-left: auto;
}
.cross-docking-checkout-back-arrow {
  margin-bottom: -20px;
}
.cross-docking-checkout-product-row {
  align-items: flex-start !important;
}
.cross-docking-checkout-product-icon {
  margin-top: 10px !important;
}
.pickup-let-us-know {
  font-size: 14px !important;
}
.disabled-POD-row {
  pointer-events: none;
  background: #a1a0a017;
  padding: 0px 10px;
  margin-left: -10px;
}
.autofill-container {
  width: 100%;
  border: 1px solid #c0c4cc;
  align-items: center;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 15px 25px;
}
.autofill-bottom-text {
  font-size: 15px;
  color: #909399;
}
.autofill-upload-button {
  color: #314ba8 !important;
  border: 1px solid #314ba8;
  background: white !important;
  font-weight: 500 !important;
}
.autofill-review-prompt {
  color: #7f3b02;
  font-size: 15px;
  font-weight: 500;
  margin-top: -15px !important;
  margin-bottom: 10px !important;
}
.autofill-container-inner {
  display: flex;
}
.autofill-error {
  margin-top: 10px;
  color: #9b101c;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.autofill-error-icon {
  font-size: 20px;
  margin: 10px;
}
</style>
