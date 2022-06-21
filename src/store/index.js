import { createStore } from "vuex";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import { shallowRef } from "vue";
import { Check, Minus } from "@element-plus/icons-vue";

export default createStore({
  namespaced: true,
  state() {
    return {
      mobile: false,
      component: "",
      languages: [
        {
          name: "English",
          tag: "en",
        },
        {
          name: "French",
          tag: "fr",
        },
      ],
      parent: "",
      defaultLanguage: "English",
      external: [
        "/auth/",
        "/auth/sign-in",
        "/auth/sign-up",
        "/auth/otp",
        "/auth/complete-signup",
        "/external/invite",
      ],
      userData: {},
      confirmedUser: {},
      businessUserDetails: {},
      googleUserData: {},
      industries: {},
      errors: {},
      loginData: {},
      googleConfirmData: {},
      session: {},
      signUpwithGoogle: false,
      OTPRedirectUrl: "",
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: "",
      productStep: 0,
      tabStatus: "",
      addProductStatus: false,
      downloadActions: [
        {
          label: "Excel",
        },
        {
          label: "PDF",
        },
      ],
      orderTrackingData: {
        order: {
          order_id: "C-JQM-0000",
          erp_document_number: "FF-00000000",
          order_status: "ORDER_COMPLETED",
          rejection_status: null,
          created_date: 1644567439000,
          updated_date: 1647870724000,
          order_event_status:
            "event.pickup.partner.submitted.items.at.hub.confirmed.via.code",
          business_id: "B-XGS-1542",
          scheduled_date: 1644567439000,
          completed_date: null,
          confirmation_pin: "0000",
          products: [
            {
              product_id: "P-KXG-0000",
              product_variant_id: "PV-JMU-0000",
              product_variant_image_link:
                "https://images.sendyit.com/fulfilment/seller/shirts.png",
              product_variant_description: "Item",
              line_item_id: "VLI-YCZ-0000",
              quantity: 1,
              rejected_quantity: 0,
              received_quantity: 1,
              unit_price: 50,
              currency: "KES",
            },
          ],
          destination: {
            name: "User",
            phone_number: "+2547000000000",
            delivery_location: {
              description: "Somewhere",
              longitude: 0.000001,
              latitude: -0.000001,
              region: null,
            },
            house_location: "Not set",
            delivery_instructions: "",
          },
          invoice_summary: {
            invoice_id: "IV-NFZ-0000",
            total_cost: 0,
            fulfillment_fee: 0,
            applied_rate: 0,
            currency: "KES",
            means_of_payment: {
              means_of_payment_type: "MPESA",
              means_of_payment_id: null,
              participant_type: "SELLER",
              participant_id: "B-XGS-0000",
              meta_data: {},
            },
          },
          failed_attempt_count: 0,
          rated: false,
          sales_channel_id: null,
          delegated_means_of_payment_collection: [],
          fulfilment_cost_means_of_payment: {
            means_of_payment_type: "MPESA",
            means_of_payment_id: null,
            participant_type: "SELLER",
            participant_id: "B-XGS-0000",
            meta_data: {},
          },
          sale_of_goods_means_of_payment: null,
          sale_of_goods_means_of_remuneration: null,
          sale_of_goods_invoice: null,
          sale_of_goods_payments: null,
          handshake_policy: null,
          rejection_policy: null,
        },
      },
      sendyPhoneProps: {
        mode: "international",
        defaultCountry: "ke",
        preferredCountries: ["ke", "ug", "tz"],
      },
      vueTelInputProps: {
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: "Enter phone number",
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        autocomplete: "off",
        name: "telephone",
        maxLen: 25,
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
      },
      deliveryActions: [
        {
          label: "deliveries.getDeliveryCode",
          trigger: false,
          popup: "code",
          show: true,
        },
        {
          label: "deliveries.rescheduleOrder",
          trigger: false,
          popup: "reschedule",
          show: true,
        },
        {
          label: "deliveries.cancelOrder",
          trigger: false,
          popup: "cancel",
          show: true,
        },
      ],
      overlayStatus: {
        overlay: false,
        popup: "",
      },
      tab: "All",
      loader: "loading-text",
      overlay: false,
      activityLog: [
        {
          date: "Thur, 1st May 2022   17:06",
          user: "James Doe",
          action: "Changed the price of Shea butter from KES 500 to KES350",
        },
        {
          date: "Thur, 1st May 2022   15:06",
          user: "Mary Monroe",
          action: "Added a new product called Mango Butter",
        },
        {
          date: "Thur, 1st May 2022   13:06",
          user: "James Doe",
          action: "Changed the price of Shea butter from KES 500 to KES350",
        },
        {
          date: "Thur, 1st May 2022   12:06",
          user: "James Doe",
          action: "Sent a delivery of Shea Butter to Moses Doe",
        },
        {
          date: "Thur, 1st May 2022   11:06",
          user: "James Doe",
          action: "Changed the price of Shea butter from KES 500 to KES350",
        },
        {
          date: "Thur, 1st May 2022   10:06",
          user: "James Doe",
          action: "Changed the price of Shea butter from KES 500 to KES350",
        },
        {
          date: "Thur, 1st May 2022   09:06",
          user: "James Doe",
          action: "Changed the price of Shea butter from KES 500 to KES350",
        },
      ],
      users: [
        {
          name: "James Doe",
          phoneNumber: "+2547000000000",
          emailAddress: "James@smartcollections.com",
          status: "Active",
          actions: [
            {
              label: "settings.editUser",
              link: "/settings/edit-user/",
              trigger: "",
            },
            {
              label: "settings.deactivateUser",
              link: "/settings/deactivate-user/",
              trigger: "",
            },
            {
              label: "settings.resendEmail",
              link: "",
              trigger: "resend",
            },
            {
              label: "settings.modifyPermissions",
              link: "/settings/user-permissions",
              trigger: "",
            },
          ],
        },
        {
          name: "Jane Doe",
          phoneNumber: "+2547000000000",
          emailAddress: "James1@smartcollections.com",
          status: "Active",
          actions: [
            {
              label: "settings.editUser",
              link: "/settings/edit-user/",
            },
            {
              label: "settings.deactivateUser",
              link: "/settings/deactivate-user/",
            },
            {
              label: "settings.modifyPermissions",
              link: "/settings/user-permissions",
            },
          ],
        },
        {
          name: "Martin Doe",
          phoneNumber: "+2547000000000",
          emailAddress: "James2@smartcollections.com",
          status: "Active",
          actions: [
            {
              label: "settings.editUser",
              link: "/settings/edit-user/",
            },
            {
              label: "settings.deactivateUser",
              link: "/settings/deactivate-user/",
            },
            {
              label: "settings.modifyPermissions",
              link: "/settings/user-permissions",
            },
          ],
        },
        {
          name: "Cuz Doe",
          phoneNumber: "+2547000000000",
          emailAddress: "James3@smartcollections.com",
          status: "Active",
          actions: [
            {
              label: "settings.editUser",
              link: "/settings/edit-user/",
            },
            {
              label: "settings.deactivateUser",
              link: "/settings/deactivate-user/",
            },
            {
              label: "settings.modifyPermissions",
              link: "/settings/user-permissions",
            },
          ],
        },
        {
          name: "Shyla Doe",
          phoneNumber: "+2547000000000",
          emailAddress: "James4@smartcollections.com",
          status: "Active",
          actions: [
            {
              label: "settings.editUser",
              link: "/settings/edit-user/",
            },
            {
              label: "settings.deactivateUser",
              link: "/settings/deactivate-user/",
            },
            {
              label: "settings.modifyPermissions",
              link: "/settings/user-permissions",
            },
          ],
        },
      ],
      invoices: [
        {
          number: "XXXXXXXXX",
          deliveries: "3",
          amount: "KES 340",
          status: "Pending",
          dateSent: "7/7/2022 11:12 AM",
          action: "View",
          link: "/payments/view-invoice",
        },
        {
          number: "XXXXXXXXX",
          deliveries: "3",
          amount: "KES 340",
          status: "Pending",
          dateSent: "7/7/2022 11:12 AM",
          action: "View",
          link: "/payments/view-invoice",
        },
        {
          number: "XXXXXXXXX",
          deliveries: "3",
          amount: "KES 340",
          status: "Pending",
          dateSent: "7/7/2022 11:12 AM",
          action: "View",
          link: "/payments/view-invoice",
        },
        {
          number: "XXXXXXXXX",
          deliveries: "3",
          amount: "KES 340",
          status: "Pending",
          dateSent: "7/7/2022 11:12 AM",
          action: "View",
          link: "/payments/view-invoice",
        },
        {
          number: "XXXXXXXXX",
          deliveries: "3",
          amount: "KES 340",
          status: "Pending",
          dateSent: "7/7/2022 11:12 AM",
          action: "View",
          link: "/payments/view-invoice",
        },
      ],
      invoiceContent: [
        {
          customerInfo: {
            customer: "Delivery to James",
            location: "Windsor Heights",
          },
          products: "Shea Butter & 3 other items",
          dateCompleted: "3/1/2022",
          costOfProducts: "KES 400",
          fulfilmentPrice: "KES 54",
        },
        {
          customerInfo: {
            customer: "Delivery to James",
            location: "Umoja momasa apartments",
          },
          products: "Shea Butter & 3 other items",
          dateCompleted: "3/1/2022",
          costOfProducts: "KES 400",
          fulfilmentPrice: "KES 54",
        },
      ],
      transationHistory: [
        {
          details: {
            icon: "mdi-cash-multiple",
            description: "Payment for 2 orders",
          },
          paymentDetails: "Paid via Mpesa.",
          code: "Transaction code; 00000000",
          datePaid: "7/7/2022 11:12 AM",
          amountPaid: "KES 340",
        },
      ],
      totalDue: "KES 54",
      statements: [
        {
          date: "Friday, 19th Jan 2022",
          amount: "",
          items: [
            {
              icon: "mdi-truck-outline",
              description: "Delivery to James",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Pending payment",
              class: "pending",
              price: "- KES 340",
            },
            {
              icon: "mdi-truck-outline",
              description: "Delivery to James",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Pending payment",
              class: "pending",
              price: "- KES 300",
            },
            {
              icon: "mdi-warehouse",
              description: "Delivery to fulfillment centre",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Pending payment",
              class: "pending",
              price: "- KES 0",
            },
          ],
        },
        {
          date: "Thursday, 18th Jan 2022",
          amount: "Kes 1,200",
          items: [
            {
              icon: "mdi-cash-multiple",
              description: "Payment for 2 orders",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "+ KES 760",
            },
            {
              icon: "mdi-truck-outline",
              description: "Delivery to James",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "- KES 300",
            },
            {
              icon: "mdi-warehouse",
              description: "Delivery to fulfillment centre",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "- KES 460",
            },
          ],
        },
        {
          date: "Monday, 15th Jan 2022",
          amount: "Kes 1,200",
          items: [
            {
              icon: "mdi-cash-multiple",
              description: "Payment for 2 orders",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "+ KES 340",
            },
            {
              icon: "mdi-truck-outline",
              description: "Delivery to James",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "- KES 300",
            },
          ],
        },
        {
          date: "Monday, 15th Jan 2022",
          amount: "Kes 1,200",
          items: [
            {
              icon: "mdi-cash-multiple",
              description: "Payment for 2 orders",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "+ KES 340",
            },
            {
              icon: "mdi-truck-outline",
              description: "Delivery to James",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "- KES 300",
            },
          ],
        },
        {
          date: "Monday, 15th Jan 2022",
          amount: "Kes 1,200",
          items: [
            {
              icon: "mdi-cash-multiple",
              description: "Payment for 2 orders",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "+ KES 340",
            },
            {
              icon: "mdi-truck-outline",
              description: "Delivery to James",
              items: "Shea Butter & 3 other items",
              date: "7/7/2022 11:12 AM",
              status: "Paid",
              class: "paid",
              price: "- KES 300",
            },
          ],
        },
      ],
      deliveryInfo: {
        name: "James Doe",
        location: "Windsor Heights",
        phoneNumber: "+2547000000000",
        instructions: "Leave the package at the door",
        payment: "Mpesa",
      },
      pickupInfo: {
        location: "Windsor Heights",
        phoneNumber: "+2547000000000",
        instructions: "Come to Windsor",
      },
      products: {
        name: "Shea Butter and 2 other items",
      },
      deliveries: [
        {
          order_id: "D-AIZ-0000",
          erp_document_number: "SORD000000",
          order_status: "ORDER_COMPLETED",
          rejection_status: null,
          created_date: 1644570481000,
          updated_date: 1644570629000,
          order_event_status:
            "event.delivery.partner.submitted.items.to.buyer.confirmed.via.code",
          business_id: "B-XGS-0000",
          scheduled_date: 1644652800000,
          completed_date: 1644570629000,
          confirmation_pin: "0000",
          products: [
            {
              product_id: "P-KXG-0000",
              product_variant_id: "PV-JMU-0000",
              product_variant_image_link:
                "https://images.sendyit.com/fulfilment/seller/shirts.png",
              product_variant_description: "Item",
              line_item_id: "VLI-LBS-0336",
              quantity: 1,
              rejected_quantity: 0,
              received_quantity: 1,
              unit_price: 50,
              currency: "KES",
            },
            {
              product_id: "P-KXG-0000",
              product_variant_id: "PV-JMU-0000",
              product_variant_image_link:
                "https://images.sendyit.com/fulfilment/seller/shirts.png",
              product_variant_description: "Item",
              line_item_id: "VLI-LBS-0000",
              quantity: 1,
              rejected_quantity: 0,
              received_quantity: 1,
              unit_price: 50,
              currency: "KES",
            },
          ],
          destination: {
            name: "Some User",
            phone_number: "+2547000000000",
            delivery_location: {
              description: "Somewhere",
              longitude: 0.000001,
              latitude: 0.000001,
              region: null,
            },
            house_location: "Not set",
            delivery_instructions: "",
          },
          invoice_summary: {
            invoice_id: "IV-USN-0000",
            total_cost: 0,
            fulfillment_fee: 0,
            applied_rate: 0,
            currency: "KES",
            means_of_payment: {
              means_of_payment_type: "CARD",
              means_of_payment_id: "XXXX-XXXX-XXXX-XXXX",
              participant_type: "SELLER",
              participant_id: "B-XGS-0000",
              meta_data: {},
            },
          },
          failed_attempt_count: 0,
          rated: false,
          sales_channel_id: null,
          delegated_means_of_payment_collection: [],
          fulfilment_cost_means_of_payment: {
            means_of_payment_type: "CARD",
            means_of_payment_id: "XXXX-XXXX-XXXX-XXXX",
            participant_type: "SELLER",
            participant_id: "B-XGS-0000",
            meta_data: {},
          },
          sale_of_goods_means_of_payment: null,
          sale_of_goods_means_of_remuneration: null,
          sale_of_goods_invoice: null,
          sale_of_goods_payments: [],
          handshake_policy: null,
          rejection_policy: null,
        },
        {
          order_id: "D-AIZ-0000",
          erp_document_number: "SORD000000",
          order_status: "ORDER_COMPLETED",
          rejection_status: null,
          created_date: 1644570481000,
          updated_date: 1644570629000,
          order_event_status:
            "event.delivery.partner.submitted.items.to.buyer.confirmed.via.code",
          business_id: "B-XGS-0000",
          scheduled_date: 1644652800000,
          completed_date: 1644570629000,
          confirmation_pin: "0000",
          products: [
            {
              product_id: "P-KXG-0000",
              product_variant_id: "PV-JMU-0000",
              product_variant_image_link:
                "https://images.sendyit.com/fulfilment/seller/shirts.png",
              product_variant_description: "Item",
              line_item_id: "VLI-LBS-0336",
              quantity: 1,
              rejected_quantity: 0,
              received_quantity: 1,
              unit_price: 50,
              currency: "KES",
            },
            {
              product_id: "P-KXG-0000",
              product_variant_id: "PV-JMU-0000",
              product_variant_image_link:
                "https://images.sendyit.com/fulfilment/seller/shirts.png",
              product_variant_description: "Item",
              line_item_id: "VLI-LBS-0000",
              quantity: 1,
              rejected_quantity: 0,
              received_quantity: 1,
              unit_price: 50,
              currency: "KES",
            },
          ],
          destination: {
            name: "Some User",
            phone_number: "+2547000000000",
            delivery_location: {
              description: "Somewhere",
              longitude: 0.000001,
              latitude: 0.000001,
              region: null,
            },
            house_location: "Not set",
            delivery_instructions: "",
          },
          invoice_summary: {
            invoice_id: "IV-USN-0000",
            total_cost: 0,
            fulfillment_fee: 0,
            applied_rate: 0,
            currency: "KES",
            means_of_payment: {
              means_of_payment_type: "CARD",
              means_of_payment_id: "XXXX-XXXX-XXXX-XXXX",
              participant_type: "SELLER",
              participant_id: "B-XGS-0000",
              meta_data: {},
            },
          },
          failed_attempt_count: 0,
          rated: false,
          sales_channel_id: null,
          delegated_means_of_payment_collection: [],
          fulfilment_cost_means_of_payment: {
            means_of_payment_type: "CARD",
            means_of_payment_id: "XXXX-XXXX-XXXX-XXXX",
            participant_type: "SELLER",
            participant_id: "B-XGS-0000",
            meta_data: {},
          },
          sale_of_goods_means_of_payment: null,
          sale_of_goods_means_of_remuneration: null,
          sale_of_goods_invoice: null,
          sale_of_goods_payments: [],
          handshake_policy: null,
          rejection_policy: null,
        },
      ],
      data: {
        message: "order.retrieve.success",
        data: {
          seller_name: "Some seller",
          order_id: "D-YYK-0000",
          country: "KENYA",
          language: "en",
          consolidated: false,
          order_event_status: "event.delivery.rescheduled.by.sendy",
          order_status: "ORDER_RESCHEDULED",
          order_completion_date: null,
          scheduled_delivery_date: 1651219200000,
          estimated_delivery_date: null,
          confirmation_pin: "0000",
          partner_contact_information: null,
          products: [
            {
              product_name: "Black timberland boots.",
              product_variant_description: "Black timberland boots",
              product_unit_price: 0,
              product_unit_currency: "KES",
              product_image_link:
                "https://s3.eu-west-1.amazonaws.com/sendy-partner-docs/fulfillment_products/B-KBC-5255_1642591764683_image_picker_A5C1AB9A-1D18-4065-BEE7-9ECF2EC6E421-26512-00000DD592078E05.jpg",
              product_unit_count: 2,
            },
            {
              product_name: "Black timberland boots.",
              product_variant_description: "Option 1",
              product_unit_price: 0,
              product_unit_currency: "KES",
              product_image_link:
                "https://s3.eu-west-1.amazonaws.com/sendy-partner-docs/fulfillment_products/B-KBC-5255_1641298024354_image_picker_A053E6C5-E503-4F55-8E35-8CBB8B09B883-25267-00000979B6694B6E.jpg",
              product_unit_count: 2,
            },
          ],
          event_time_line: [
            {
              event_code: "event.delivery.partner.arrived.at.buyer.location",
              event_date: 1636697106000,
              event_notes: null,
            },
            {
              event_code:
                "event.delivery.partner.submitted.items.to.buyer.confirmed.via.code",
              event_date: 1636697176000,
              event_notes: null,
            },
            {
              event_code: "event.delivery.order.canceled.by.seller",
              event_date: 1636697281000,
              event_notes: null,
            },
            {
              event_code: "event.delivery.failed",
              event_date: 1636698283000,
              event_notes: null,
            },
            {
              event_code: "event.delivery.rescheduled.by.buyer",
              event_date: 1642749240000,
              event_notes: null,
            },
          ],
          destination: {
            name: "Some seller",
            phone_number: "+254700000000",
            delivery_location: {
              description: "Some where",
              longitude: 0.000000001,
              latitude: 0.000001,
              region: null,
            },
            house_location: "Not set",
            delivery_instructions: "",
          },
          rated: false,
        },
        errors: [],
      },
      timelineIcons: {
        PAST: {
          icon: shallowRef(Check),
          color: "#EE7D00",
          iconClass: "el-icon-check",
        },
        PRESENT: {
          icon: shallowRef(Minus),
          color: "#EE7D00",
          iconClass: "el-icon-minus",
        },
        FUTURE: {
          hollow: true,
        },
      },
      deliveryAttempts: [
        {
          attempt_index: 1,
          attempt_date: 1654494226000,
          failure_reason: "Damaged Goods",
        },
      ],
      orderTimelines: [
        {
          event_date: 1647870724000,
          event_code: "EVENT_PICKUP_ORDER_CREATED",
          translated_event_code: "Order placed on Friday, Feb 11th",
          notes: "",
          event_tense: "FUTURE",
          metadata: {},
        },
        {
          event_date: 1647870724000,
          event_code: "EVENT_PICKUP_WAITING_FOR_PARTNER",
          translated_event_code: "We are finding a driver for your order",
          notes: "",
          event_tense: "FUTURE",
          metadata: {},
        },
        {
          event_date: 1647870724000,
          event_code: "EVENT_PICKUP_PARTNER_ARRIVED_AT_PICKUP_LOCATION",
          translated_event_code:
            "Your driver has arrived at your pick up location",
          notes: "",
          event_tense: "FUTURE",
          metadata: {
            shipping_agent: null,
          },
        },
        {
          event_date: 1647870724000,
          event_code:
            "EVENT_PICKUP_PARTNER_SUBMITTED_ITEMS_AT_HUB_CONFIRMED_VIA_CODE",
          translated_event_code:
            "Your driver has dropped your products at the Fulfillment Centre",
          notes: null,
          event_tense: "FUTURE",
          metadata: {},
        },
      ],
      dashboardSelectedTab: "To your Customers",
      inventorySelectedTab: "All",
      stockSelectedTab: "Overview",
      selectedProducts: [],
      sendProductsRoute: "",
      product: {
        product_id: "P-KXG-0000",
        objectID: "P-KXG-0000",
        product_name: "Item",
        product_description: "Item variant",
        product_main_color: null,
        product_archived: false,
        business_id: "B-XGS-0000",
        product_collection: {
          collection_id: "PC-KST-8857",
          collection_name: null,
        },
        sales_channel_collections: null,
        product_variants: [
          {
            product_variant_id: "PV-JMU-7623",
            business_id: "B-XGS-0000",
            product_id: "P-KXG-0000",
            product_variant_description: "Item",
            product_variant_currency: "KES",
            product_variant_unit_price: 0,
            product_variant_image_link:
              "https://images.sendyit.com/fulfilment/seller/shirts.png",
            product_variant_expiry_date: null,
            product_variant_quantity: 0,
            product_variant_quantity_type: "GRAM",
            product_variant_stock_levels: {
              available: 0,
              quantity_in_inventory: 0,
              quantity_in_sales_orders: 1,
              quantity_held_in_fulfilment_requests: 0,
              last_updated_date: 1655449379000,
            },
            product_variant_archived: false,
          },
        ],
      },
      productLists: [
        {
          product_id: "P-KXG-0000",
          objectID: "P-KXG-0000",
          product_name: "Item",
          product_description: "Item variant",
          product_main_color: null,
          product_archived: false,
          business_id: "B-XGS-0000",
          product_collection: {
            collection_id: "PC-KST-0000",
            collection_name: null,
          },
          sales_channel_collections: null,
          product_variants: [
            {
              product_variant_id: "PV-JMU-0000",
              business_id: "B-XGS-0000",
              product_id: "P-KXG-0000",
              product_variant_description: "Item",
              product_variant_currency: "KES",
              product_variant_unit_price: 0,
              product_variant_image_link:
                "https://images.sendyit.com/fulfilment/seller/shirts.png",
              product_variant_expiry_date: null,
              product_variant_quantity: 0,
              product_variant_quantity_type: "GRAM",
              product_variant_stock_levels: {
                available: 0,
                quantity_in_inventory: 0,
                quantity_in_sales_orders: 1,
                quantity_held_in_fulfilment_requests: 0,
                last_updated_date: 1655391003000,
              },
              product_variant_archived: false,
            },
          ],
        },
        {
          product_id: "P-KXG-0000",
          objectID: "P-KXG-0000",
          product_name: "Item",
          product_description: "Item variant",
          product_main_color: null,
          product_archived: false,
          business_id: "B-XGS-0000",
          product_collection: {
            collection_id: "PC-KST-0000",
            collection_name: null,
          },
          sales_channel_collections: null,
          product_variants: [
            {
              product_variant_id: "PV-JMU-0000",
              business_id: "B-XGS-0000",
              product_id: "P-KXG-0000",
              product_variant_description: "Item",
              product_variant_currency: "KES",
              product_variant_unit_price: 0,
              product_variant_image_link:
                "https://images.sendyit.com/fulfilment/seller/shirts.png",
              product_variant_expiry_date: null,
              product_variant_quantity: 0,
              product_variant_quantity_type: "GRAM",
              product_variant_stock_levels: {
                available: 0,
                quantity_in_inventory: 0,
                quantity_in_sales_orders: 1,
                quantity_held_in_fulfilment_requests: 0,
                last_updated_date: 1655391003000,
              },
              product_variant_archived: false,
            },
          ],
        },
      ],
      fulfillmentFees: {
        total_product_value: 0,
        pre_adjustments_calculated_fee: 0,
        calculated_fee: 0,
        rate: 0,
        currency: "KES",
        order_type: "DELIVERY",
        promotion_session_id: "b368d75c-8538-4017-a531-d189347a70ca",
        promotion_adjustments: [
          {
            adjustment_type: "COST_OF_FULFILMENT",
            adjustment_description: "KES 0.0 - KES 300.0",
            adjustment_subtitle: "12.0% service fee",
            adjustment_value: 36,
          },
          {
            adjustment_type: "COST_OF_FULFILMENT",
            adjustment_description: "KES 300.0 - KES 500.0",
            adjustment_subtitle: "7.0% service fee",
            adjustment_value: 14,
          },
        ],
        promotion_notifications: [],
      },
      userDetails: {
        email: "user@gmail.com",
        first_name: "User",
        last_name: "Name",
        phone_number: "+25470000000",
        user_id: "U-LSH-0000",
      },
      storageUserDetails: JSON.parse(localStorage.userDetails).data,
      businessDetails: {
        business_id: "B-XGS-0000",
        business_name: "Some Business",
        business_industry: {
          name: "Appliances",
          industry_id: "IN-LUM-0000",
          country: "KENYA",
          fulfillment_rate: 0,
        },
        business_tax_identification_number: null,
        business_default_address: null,
        business_instagram_page: null,
        business_website: null,
        business_facebook_page: null,
        terms_of_service_accepted: true,
        country: "KENYA",
        country_code: "KE",
        company_code: "FFKE",
        currency: "KES",
        language: "en",
        settings: {
          payments_enabled: true,
          payment_methods: [
            {
              paymentType: "MPESA",
              payment_method: "MPESA",
              sendy_payment_method_id: 1,
            },
            {
              paymentType: "CARD",
              payment_method: "CARD",
              sendy_payment_method_id: 2,
            },
          ],
        },
      },
      notifications: [],
      paymnetMethods: [
        {
          id: 744,
          user_id: "B-XGS-0000",
          pay_method_id: 2,
          pay_method_details: "",
          pay_detail_id: "XXXXXXXXXXXXXXXX",
          pay_method_name: "Card",
          default: 1,
          psp: "VISA",
          category: "Credit or Debit Card",
          status: 1,
          stk_limit: 0,
          daily_limit: 0,
          transaction_limit: 1000000,
          minimum_limit: 10,
        },
        {
          id: 0,
          user_id: "B-XGS-0000",
          pay_method_id: 1,
          pay_method_details: null,
          pay_detail_id: "XXXXXXXXXXXXXXXX",
          pay_method_name: "M-PESA",
          default: 0,
          psp: null,
          category: "Mobile Money",
          status: 1,
          stk_limit: 150000,
          daily_limit: 300000,
          transaction_limit: 150000,
          minimum_limit: 1,
        },
      ],
    };
  },
  actions,
  getters,
  mutations,
});
