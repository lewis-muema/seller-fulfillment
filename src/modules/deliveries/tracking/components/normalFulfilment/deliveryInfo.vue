<template>
  <div>
    <div class="delivery-info-container" v-if="getParent === 'sendy'">
      <div class="delivery-info-title-top">
        <span :class="getLoader.orderTracking">
          {{ $t("deliveries.pickupInfo") }}
        </span>
        <span
          v-if="!showEditIcon"
          :class="getLoader.orderTracking"
          @click="
            setOverlayStatus({
              overlay: true,
              popup: cantEditDeliveryRecipientInfo ? 'noEdits' : 'pickupInfo',
              popText: this.pickups,
            })
          "
        >
          <span class="delivery-info-edit" :class="getLoader.orderTracking">
            <i class="mdi mdi-pencil mdi-pencil-edit-pickup-info"></i>
            {{ $t("deliveries.edit") }}
          </span>
        </span>
      </div>
      <p class="delivery-info-label">
        <span :class="getLoader.orderTracking">
          {{ $t("deliveries.pickUpLocation") }}
        </span>
      </p>
      <p class="delivery-info-data">
        <span :class="getLoader.orderTracking" class="pickup-info-desc">
          {{
            getOrderTrackingData.order.destination.delivery_location.description
          }}
        </span>
      </p>
      <p class="delivery-info-label">
        <span :class="getLoader.orderTracking">
          {{ $t("deliveries.pickUpInstructions") }}
        </span>
      </p>
      <p class="delivery-info-data">
        <span :class="getLoader.orderTracking" class="pickup-info-instructions">
          {{
            getOrderTrackingData.order.destination.delivery_instructions
              ? getOrderTrackingData.order.destination.delivery_instructions
              : "N/A"
          }}
        </span>
      </p>
      <p class="delivery-info-label">
        <span :class="getLoader.orderTracking">
          {{ $t("deliveries.phoneNumber") }}
        </span>
      </p>
      <p class="delivery-info-data">
        <span :class="getLoader.orderTracking" class="pickup-info-phone-number">
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
    </div>
    <div class="delivery-info-container" v-else>
      <div class="delivery-info-title-top">
        <span :class="getLoader.orderTracking">
          {{ $t("deliveries.deliveryInfo") }}
        </span>
      </div>
      <p class="delivery-info-label delivery-info-title mb-2">
        <span :class="getLoader.orderTracking">
          {{ $t("deliveries.deliveryInfo") }}
        </span>
      </p>
      <p class="delivery-info-data">
        <span>
          <i class="mdi mdi-map-marker-outline delivery-info-marker"></i>
        </span>
        <span :class="getLoader.orderTracking" class="delivery-info-desc">
          {{
            getOrderTrackingData.order.destination.delivery_location.description
          }}
        </span>
      </p>
      <p class="delivery-info-data">
        <span
          :class="getLoader.orderTracking"
          class="delivery-house-location delivery-info-location"
        >
          {{ getOrderTrackingData.order.destination.house_location }}
        </span>
      </p>
      <p class="delivery-info-data">
        <span>
          <i class="mdi mdi-text delivery-info-marker"></i>
        </span>
        <span
          :class="getLoader.orderTracking"
          class="delivery-info-instruction"
        >
          {{
            getOrderTrackingData.order.destination.delivery_instructions
              ? getOrderTrackingData.order.destination.delivery_instructions
              : $t("inventory.noInstructionsAdded")
          }}
        </span>
      </p>
      <p class="delivery-info-label edit-delivery">
        <span
          :class="getLoader.orderTracking"
          class="mdi-pencil-edit-delivery-info"
          @click="
            setOverlayStatus({
              overlay: true,
              popup: cantEditDeliveryRecipientInfo ? 'noEdits' : 'deliveryInfo',
              popText: this.deliveryInfo,
            })
          "
          v-if="!showEditIcon"
        >
          {{ $t("inventory.editDeliveryInfo") }}
        </span>
      </p>
      <p class="delivery-info-label delivery-info-title mb-2">
        <span :class="getLoader.orderTracking">
          {{ $t("inventory.recipientInfo") }}
        </span>
      </p>
      <p class="delivery-info-data mb-2">
        <span>
          <i class="mdi mdi-account-outline delivery-info-marker"></i>
        </span>
        <span
          :class="getLoader.orderTracking"
          class="delivery-info-recipient-name"
        >
          {{ getOrderTrackingData.order.destination.name }}
        </span>
      </p>
      <p class="delivery-info-data mb-2">
        <span>
          <i class="mdi mdi-phone-outline delivery-info-marker"></i>
        </span>
        <span
          :class="getLoader.orderTracking"
          class="delivery-info-recipient-number"
        >
          {{ getOrderTrackingData.order.destination.phone_number }}
        </span>
      </p>
      <p class="delivery-info-label edit-delivery">
        <span
          :class="getLoader.orderTracking"
          @click="
            setOverlayStatus({
              overlay: true,
              popup: cantEditDeliveryRecipientInfo
                ? 'noEdits'
                : 'recepientInfo',
              popText: this.recipientInfo,
            })
          "
          v-if="!showEditIcon"
        >
          {{ $t("inventory.editRecipientInfo") }}
        </span>
      </p>
      <div v-if="view">
        <p class="delivery-info-label delivery-info-title mb-2">
          <span
            :class="getLoader.orderTracking"
            class="delivery-info-delivery-date"
          >
            {{ $t("inventory.deliveryDate") }}
          </span>
        </p>
        <p class="delivery-info-data mb-2">
          <span>
            <i class="mdi mdi-clock-outline delivery-info-marker"></i>
          </span>
          <span :class="getLoader.orderTracking">
            {{
              getOrderTrackingData.order.completed_date
                ? formatLongDate(getOrderTrackingData.order.completed_date)
                : formatLongDate(getOrderTrackingData.order.scheduled_date)
            }}
          </span>
        </p>
        <p class="delivery-info-label edit-delivery"></p>
        <div v-if="crossDockingFlag">
          <p class="delivery-info-label delivery-info-title mb-2">
            <span :class="getLoader.orderTracking">
              {{ $t("inventory.documentsYouveUploaded") }}
            </span>
          </p>
          <p class="delivery-info-data mb-2">
            <span>
              <i class="mdi mdi-text-box-outline delivery-info-marker"></i>
            </span>
            <span :class="getLoader.orderTracking">
              {{
                getOrderTrackingData.order.documents &&
                getOrderTrackingData.order.documents.length > 1
                  ? $t("inventory.otherDocuments", {
                      Doc: docName(getOrderTrackingData.order.documents[0]),
                      Count: getOrderTrackingData.order.documents.length - 1,
                    })
                  : getOrderTrackingData.order.documents &&
                    getOrderTrackingData.order.documents.length === 1
                  ? docName(getOrderTrackingData.order.documents[0])
                  : $t("inventory.noDocuments")
              }}
            </span>
          </p>
          <p class="delivery-info-label edit-delivery">
            <span
              :class="getLoader.orderTracking"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: cantEditDocumentsInfo
                    ? 'noEdits'
                    : 'addRemoveDocument',
                  popText: this.documentsInfo,
                })
              "
              v-if="!showEditIcon"
            >
              {{ $t("deliveries.manageDocuments") }}
            </span>
          </p>
        </div>
        <div v-if="getParent === 'customer'" class="delivery-info-label mt-4">
          <p :class="getLoader.orderTracking" class="delivery-info-title mb-2">
            {{ $t("inventory.paymentCollection") }}
            <i
              class="mdi mdi-alert-circle-outline"
              v-if="getOrderTrackingData.order.sale_of_goods_invoice"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: 'paymentBreakdown',
                })
              "
            ></i>
          </p>
        </div>
        <div>
          <div v-if="getOrderTrackingData.order.sale_of_goods_invoice">
            <p v-if="getParent === 'customer'" class="delivery-info-data">
              <span :class="getLoader.orderTracking">
                {{ $t("inventory.amountToBeCollected") }}
              </span>
              <span
                class="delivery-info-data-float"
                :class="getLoader.orderTracking"
              >
                {{
                  `${getOrderTrackingData.order.invoice_summary.currency} ${
                    parseInt(
                      getOrderTrackingData.order.invoice_summary.total_cost
                    ) + parseInt(deliveryFee)
                  }`
                }}</span
              >
            </p>
            <p
              v-if="
                invoiceStatus === 'INVOICE_WAITING_PAYMENT' &&
                getParent === 'customer' &&
                getLoader.orderTracking === ''
              "
            >
              <span :class="`payment-${invoiceStatus}-status`">
                {{ $t("deliveries.pending") }}
              </span>
            </p>
            <p
              v-if="
                invoiceStatus === 'INVOICE_COMPLETELY_PAID' &&
                getParent === 'customer' &&
                getLoader.orderTracking === ''
              "
            >
              <span :class="`payment-${invoiceStatus}-status`">
                {{ $t("deliveries.completed") }}
              </span>
            </p>
          </div>
          <div v-else>
            <p v-if="getParent === 'customer'" class="delivery-info-data">
              <span :class="getLoader.orderTracking">
                {{ $t("inventory.noPaymentToBeCollected") }}
              </span>
            </p>
          </div>
          <p
            class="delivery-info-label edit-delivery"
            v-if="paymentOnDeliveryFlag"
          >
            <span
              :class="getLoader.orderTracking"
              @click="
                setOverlayStatus({
                  overlay: true,
                  popup: cantEditPod ? 'noEdits' : 'editpaymentCollection',
                  popText: this.pod,
                })
              "
              v-if="!showEditIcon"
            >
              {{ $t("deliveries.editPOD") }}
            </span>
          </p>
        </div>
      </div>
      <p class="view-delivery-desc">
        <span :class="getLoader.orderTracking">{{
          $t("inventory.viewDelivery")
        }}</span>
      </p>
      <div @click="view = !view">
        <span v-if="!view" class="d-flex">
          <span class="delivery-info-view-toggle">
            {{ $t("inventory.viewMore") }}
          </span>
          <i class="mdi mdi-chevron-down delivery-info-view-icon"></i>
        </span>
        <span v-else class="d-flex">
          <span class="delivery-info-view-toggle">
            {{ $t("inventory.viewLess") }}
          </span>
          <i class="mdi mdi-chevron-up delivery-info-view-icon"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      overlay: false,
      editInfo: false,
      view: true,
      pickups: this.$t("deliveries.cantEditPickups"),
      deliveryInfo: this.$t("deliveries.cantEditDelivery"),
      recipientInfo: this.$t("deliveries.cantEditRecipient"),
      documentsInfo: this.$t("deliveries.cantEditDocs"),
      pod: this.$t("deliveries.cantEditPod"),
    };
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getDeliveryInfo",
      "getPickupInfo",
      "getOrderTrackingData",
      "getBusinessDetails",
      "getParent",
      "getOrderTimelines",
    ]),
    cantEditDeliveryRecipientInfo() {
      const orderInTransit =
        this.getOrderTrackingData.order.order_status === "ORDER_IN_TRANSIT";
      if (this.getParent === "sendy") {
        return (
          orderInTransit &&
          this.getOrderTrackingData.order.order_event_status !==
            "event.pickup.partner.assigned" &&
          this.getOrderTrackingData.order.order_event_status !==
            "event.pickup.partner.enroute.to.pickup.location"
        );
      } else {
        const orderCompleted =
          this.getOrderTrackingData.order.order_status === "ORDER_COMPLETED";
        const buyerEnroute =
          this.getOrderTrackingData.order.order_event_status !==
          "event.delivery.partner.enroute.to.buyer.location";
        return (orderInTransit && buyerEnroute) || orderCompleted;
      }
    },
    showEditIcon() {
      return (
        this.getOrderTrackingData.order.order_status === "ORDER_COMPLETED" ||
        this.getOrderTrackingData.order.order_status === "ORDER_CANCELED" ||
        this.getOrderTrackingData.order.order_status === "ORDER_FAILED"
      );
    },
    invoiceStatus() {
      return this.getOrderTrackingData.order.sale_of_goods_invoice
        ? this.getOrderTrackingData.order.sale_of_goods_invoice.invoice_status
        : "";
    },
    deliveryFee() {
      let fee = 0;
      this.getOrderTrackingData.order?.sale_of_goods_invoice?.invoice_adjustments_subtotals?.forEach(
        (row) => {
          if (row.adjustment_type === "DELIVERY_FEE") {
            fee = row.adjustment_subtotal;
          }
        }
      );
      return fee;
    },
    cantEditDocumentsInfo() {
      return this.getOrderTrackingData.order.order_status !== "ORDER_RECEIVED";
    },
    cantEditPod() {
      return (
        this.getOrderTrackingData.order?.sale_of_goods_invoice
          ?.invoice_status === "INVOICE_COMPLETELY_PAID" ||
        this.getOrderTrackingData.order.order_status === "ORDER_COMPLETED"
      );
    },
    paymentOnDeliveryFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.payments_on_delivery_enabled
        : false;
    },
    crossDockingFlag() {
      return this.getBusinessDetails.settings
        ? this.getBusinessDetails.settings.cross_docking_enabled
        : false;
    },
  },
  mounted() {},
  methods: {
    ...mapMutations([
      "setComponent",
      "setLoader",
      "setTab",
      "setOverlayStatus",
      "setParent",
      "setEditValue",
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
    formatLongDate(date) {
      return moment(date).format("ddd, Do MMM YYYY");
    },
    docName(document) {
      return document.document_type === "OTHER"
        ? document.document_description
        : document.document_type.replace(/_/g, " ");
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

.delivery-info-title-top {
  font-size: 18px;
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
  display: flex;
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

.delivery-info-data-float {
  float: right;
  margin-left: auto;
}

.payment-INVOICE_WAITING_PAYMENT-status {
  background: #fbdf9a;
  padding: 2px 20px;
  border-radius: 10px;
  color: #7f3b02;
}

.payment-INVOICE_COMPLETELY_PAID-status {
  background: #b8f5a8;
  padding: 2px 20px;
  border-radius: 10px;
  color: #064a23;
}

.delivery-info-marker {
  font-size: 20px;
  margin-right: 10px;
  color: #909399;
}

.delivery-house-location {
  margin-left: 30px;
}

.edit-delivery {
  color: #324ba8;
  font-weight: 500;
  cursor: pointer;
  padding-bottom: 15px;
  border-bottom: 1px solid #e2e7ed;
  margin-bottom: 15px !important;
}

.delivery-info-title {
  font-size: 16px;
}

.delivery-info-view-toggle {
  color: #324ba8;
  font-size: 16px;
  cursor: pointer;
}

.delivery-info-view-icon {
  color: #324ba8;
  font-size: 25px;
  cursor: pointer;
}
.view-delivery-desc {
  color: #606266;
}
</style>
