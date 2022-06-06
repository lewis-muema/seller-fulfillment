import { createStore } from "vuex";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default createStore({
  namespaced: true,
  state() {
    return {
      mobile: false,
      component: "",
      external: ["/auth/sign-in", "/auth/sign-up", "/auth/otp", "/auth"],
      dashboardSelectedTab: "To your Customers",
      inventorySelectedTab: "All",
      stockSelectedTab: "Overview",
      selectedProducts: [],
      sendProductsRoute: "",
      productLists: {
        message: "product.list.success",
        data: {
          products: [
            {
              business_id: "B_ASD123",
              product_id: "P_ASD1234",
              product_name: "Shea Butter",
              product_description: "Smooth shear butter",
              sales_channel_collections: [
                {
                  collection_id: "string",
                  collection_name: "string",
                },
              ],

              available: "23",
              committed: "23",
              incoming: "4",
              product_currency: "KES",
              product_price: 450,
            },
            {
              business_id: "B_ASD123",
              product_id: "P_ASD1234",
              product_name: "Leather Bags",
              product_description: "Good quality Leather Bags",
              sales_channel_collections: [
                {
                  collection_id: "string",
                  collection_name: "string",
                },
              ],

              available: "0",
              committed: "0",
              incoming: "0",
              product_currency: "KES",
              product_price: 450,
            },
            {
              business_id: "B_ASD123",
              product_id: "P_ASD1234",
              product_name: "Ceramic Cup",
              product_description: "Hand made ceramic cups",
              product_variants: [
                {
                  business_id: "B_ASD123",
                  product_id: "P_ASD123",
                  product_variant_id: "PV_ASD123",
                  product_variant_description: "Fortified Cup",
                  product_variant_currency: "KES",
                  product_variant_unit_price: 400,
                  product_variant_quantity: 30,
                  product_variant_quantity_type: "ml",
                  product_variant_image_link:
                    "https://m.media-amazon.com/images/SLawerR.jpg",
                  product_variant_expiry_date: 123456789,
                  product_variant_stock_levels: {
                    available: 3,
                    quantity_in_inventory: 1,
                    quantity_in_sales_orders: 0,
                  },
                },
                {
                  business_id: "B_ASD123",
                  product_id: "P_ASD123",
                  product_variant_id: "PV_ASD123",
                  product_variant_description: "Fortified Cup",
                  product_variant_currency: "KES",
                  product_variant_unit_price: 400,
                  product_variant_quantity: 130,
                  product_variant_quantity_type: "ml",
                  product_variant_image_link:
                    "https://m.media-amazon.com/images/SLawerR.jpg",
                  product_variant_expiry_date: 123456789,
                  product_variant_stock_levels: {
                    available: 3,
                    quantity_in_inventory: 0,
                    quantity_in_sales_orders: 0,
                  },
                },
              ],
              sales_channel_collections: [
                {
                  collection_id: "string",
                  collection_name: "string",
                },
              ],
              available: "23",
              committed: "25",
              incoming: "7",
              product_currency: "KES",
              product_price: 450,
            },
          ],
        },
      },
    };
  },
  actions,
  getters,
  mutations,
});
