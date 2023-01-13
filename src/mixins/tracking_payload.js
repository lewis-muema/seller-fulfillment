import { mapGetters } from "vuex";

const trackingPayloadMixin = {
  computed: {
    ...mapGetters([
      "getOrderStatuses",
      "getOrderTrackingData",
      "getEdittedDocuments",
      "getFinalDocumentsToEdit",
    ]),
    podPayload() {
      const costsToCollect = [];
      if (
        (this.deliveryFeeCollection === "fee" ||
          this.deliveryFeeCollection === "nofee") &&
        this.paymentOnDeliveryFlag
      ) {
        costsToCollect.push({
          cost_type: "SALE_OF_GOOD",
        });
      }
      if (this.deliveryFeeCollection === "fee") {
        costsToCollect.push({
          cost_type: "DELIVERY_FEE",
          cost_amount: this.deliveryFeeAmount,
          currency: this.getBusinessDetails.currency,
        });
      }
      return costsToCollect;
    },
    destinationPayload() {
      const order = this.getOrderTrackingData.order;
      const payload = {
        name: this.customerName ? this.customerName : order.destination.name,
        phone_number: this.phone ? this.phone : order.destination.phone_number,
        secondary_phone_number: this.secPhone
          ? this.secPhone
          : order.destination.secondary_phone_number,
        delivery_location: {
          description: this.location
            ? this.location
            : order.destination.delivery_location.description,
          longitude: this.locationData?.geometry
            ? this.locationData?.geometry.location.lng()
            : order.destination.delivery_location.longitude,
          latitude: this.locationData?.geometry
            ? this.locationData?.geometry.location.lat()
            : order.destination.delivery_location.latitude,
        },
        house_location: this.apartmentName
          ? this.apartmentName
          : order.destination.house_location,
        delivery_instructions: this.instructions
          ? this.instructions
          : order.destination.delivery_instructions,
      };
      return payload;
    },
    mapEdittedDocuments() {
      return this.getFinalDocumentsToEdit;
    },
    documentsPayload() {
      const documents = [];
      this.mapEdittedDocuments.forEach((row) => {
        documents.push({
          document_type: row.document_type.toUpperCase(),
          document_url: row.document_url,
          document_description: row.document_description,
        });
      });
      return documents;
    },
    meansOfPaymentsPayload() {
      const meansOfPayment =
        this.getOrderTrackingData.order.fulfilment_cost_means_of_payment;
      const payload = {
        means_of_payment_type: meansOfPayment.means_of_payment_type,
        means_of_payment_identifier: meansOfPayment.means_of_payment_id,
        participant_type: meansOfPayment.participant_type,
        participant_id: meansOfPayment.participant_id,
        meta_data: meansOfPayment.meta_data,
      };
      return payload;
    },
    deliveryOptionPayload() {
      const deliveryoption = this.deliverySpeedOptions[this.deliveryOption];
      const payload = {
        transport_provider: deliveryoption.transport_provider,
        speed_pricing_type: deliveryoption.speed_pricing_type,
        speed_pricing_uuid: deliveryoption.speed_pricing_uuid,
        proposed_scheduled_date: this.deliveryDate.valueOf(),
      };
      return payload;
    },
    submitDeliveryPayload() {
      const payload = {
        means_of_payment: this.meansOfPaymentsPayload,
        destination: this.destinationPayload,
        sale_of_goods_policy: {
          costs_to_collect: this.podPayload,
        },
        documents: this.documentsPayload,
        destination_speed_policy: this.deliveryOptionPayload,
      };
      return payload;
    },
    calculateSpeedPayload() {
      const deliveries = [];
      deliveries.push({
        destination: this.destinationPayload,
        local_order_uuid: 1191169820,
        documents: [],
      });
      const payload = {
        means_of_payment: this.meansOfPaymentsPayload,
        deliveries: deliveries,
        pickups: [],
      };
      return payload;
    },
  },
};
export default trackingPayloadMixin;
