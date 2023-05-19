/* eslint-disable no-unused-vars */
import axios from "axios";
import { ElNotification } from "element-plus";
import router from "@/router/index.js";

const integrationsModule = {
  state: () => ({
    integrations: {
      activeIntegrations: {
        platform: {},
        apiKey: {},
      },
      platform: {
        productsLoaded: false,
        conflictsResolved: false,
        finishSyncPayload: {
          currency: "KES", // required
          createAllProducts: false,
          products: [],
          newProducts: [],
          matchingProducts: [],
        },
        syncedProducts: {
          partialMatchingProducts: [],
          matchingProducts: [],
          newProducts: [],
          syncStatus: 0,
        },
      },
    },
  }),
  getters: {
    getIntegrations: (state) => state.integrations.activeIntegrations,
    getPlatformSyncStatus: (state) =>
      state.integrations.platform.syncedProducts.syncStatus,
    getPlatformSyncProducts: (state) =>
      state.integrations.platform.syncedProducts,
    getPlatformSyncPartialMatchingProducts: (state) =>
      state.integrations.platform.syncedProducts.partialMatchingProducts || [],
    getPlatformSyncMatchingProducts: (state) =>
      state.integrations.platform.syncedProducts.matchingProducts || [],
    getPlatformSyncNewProducts: (state) =>
      state.integrations.platform.syncedProducts.newProducts || [],
    getPlatformSyncPayload: (state) =>
      state.integrations.platform.finishSyncPayload,
    getConflictsResolvedStatus: (state) =>
      state.integrations.platform.conflictsResolved,
    getPlatformProductsLoaded: (state) =>
      state.integrations.platform.productsLoaded,
  },
  actions: {
    async connectStore({ dispatch, commit }, payload) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.accessToken
              ? localStorage.accessToken
              : "",
            "fulfilment-token": localStorage.accessToken,
          },
        };

        const { data, status } = await axios.post(
          `${payload.app}${payload.endpoint}`,
          payload.values,
          config
        );
        return { data, status };
      } catch (error) {
        return error.response;
      }
    },
    async getIntegrations({ dispatch, commit }, payload) {
      try {
        const { params } = payload;
        const values = {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.accessToken
              ? localStorage.accessToken
              : "",
          },
          params,
        };

        const response = await axios.get(
          `${payload.app}${payload.endpoint}`,
          values
        );
        return response;
      } catch (error) {
        return error.response;
      }
    },
    async generateApiKey({ dispatch, commit }, payload) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.accessToken
              ? localStorage.accessToken
              : "",
          },
        };

        const { status, data } = await axios.post(
          `${payload.app}${payload.endpoint}`,
          payload.values,
          config
        );
        return { data: data.data, status };
      } catch (error) {
        return error.response;
      }
    },
    async revokeApiKey({ dispatch, commit }, payload) {
      try {
        const values = {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.accessToken
              ? localStorage.accessToken
              : "",
          },
        };

        const response = await axios.delete(
          `${payload.app}${payload.endpoint}`,
          values
        );
        return response;
      } catch (error) {
        return error.response;
      }
    },
    async removePlatformIntegration({ dispatch, commit }, payload) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.accessToken
              ? localStorage.accessToken
              : "",
            "Fulfilment-Token": localStorage.accessToken
              ? localStorage.accessToken
              : "",
          },
        };

        const response = await axios.post(
          `${payload.app}${payload.endpoint}`,
          payload.values,
          config
        );
        return response;
      } catch (error) {
        return error.response;
      }
    },
    syncPlatformProducts({ dispatch }, payload) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const {
            salesChannelId = null,
            currency = "KES",
            app,
            endpoint,
          } = payload;
          if (!salesChannelId) {
            throw new Error("No sales channel Id provided");
          }
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.accessToken
                ? localStorage.accessToken
                : "",
              "fulfilment-token": localStorage.accessToken
                ? localStorage.accessToken
                : "",
              "sales-channel-id": salesChannelId,
            },
            params: {
              currency,
            },
          };

          const { data } = await axios.get(`${app}${endpoint}`, config);

          // to-do: add this in tests
          if (data.data.syncStatus === 0) {
            ElNotification({
              message: data.data.message,
              type: "success",
            });
            router.push({ name: "SetupStep7" });
          }

          await dispatch("setProductsLoaded", true);
          await dispatch("syncProducts", data.data.products);
          await dispatch("setSyncStatus", data.data.syncStatus);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    setProductsLoaded({ commit }, payload) {
      commit("setProductsLoaded", payload);
    },
    syncProducts({ commit }, payload) {
      commit("setSyncedPlatformProducts", payload);
    },
    setSyncStatus({ commit }, payload) {
      commit("setSyncStatus", payload);
    },
    setIntegrations({ commit }, payload) {
      commit("setIntegrations", payload);
    },
    setFinishSyncPayload({ commit }, payload) {
      commit("setFinishSyncPayload", payload);
    },
    setResolvedConflicts({ commit }, payload) {
      commit("setResolvedConflicts", payload);
    },
    async finishSyncingPlatformProducts({ dispatch, commit }, payload) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.accessToken
                ? localStorage.accessToken
                : "",
              "fulfilment-token": localStorage.accessToken
                ? localStorage.accessToken
                : "",
              "sales-channel-id": localStorage.getItem(
                "platformSalesChannelId"
              ),
            },
          };

          const { data, status } = await axios.post(
            `${payload.app}${payload.endpoint}`,
            payload.values,
            config
          );

          if (status === 200) {
            resolve();
            return { data: data.data, status };
          } else {
            throw data;
          }
        } catch (error) {
          reject(error.response);
        }
      });
    },
    async retryCreatingWebhooks({ dispatch, commit }, payload) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.accessToken
                ? localStorage.accessToken
                : "",
              "fulfilment-token": localStorage.accessToken
                ? localStorage.accessToken
                : "",
              "sales-channel-id": localStorage.getItem(
                "platformSalesChannelId"
              ),
            },
          };

          const { data, status } = await axios.post(
            `${payload.app}${payload.endpoint}`,
            {
              salesChannelId: localStorage.getItem("platformSalesChannelId"),
            },
            config
          );

          if (status === 200) {
            resolve({ data, status });
          } else {
            throw data;
          }
        } catch (error) {
          reject(error.response);
        }
      });
    },
  },
  mutations: {
    setSyncedPlatformProducts(state, val) {
      state.integrations.platform.syncedProducts = {
        ...state.integrations.platform.syncedProducts,
        ...val,
      };
    },
    setIntegrations(state, val) {
      state.integrations.activeIntegrations = { ...val };
    },
    setSyncStatus(state, val) {
      state.integrations.platform.syncedProducts.syncStatus = val;
    },
    setFinishSyncPayload(state, val) {
      state.integrations.platform.finishSyncPayload = val;
    },
    setResolvedConflicts(state, val) {
      state.integrations.platform.conflictsResolved = val;
    },
    setProductsLoaded(state, val) {
      state.integrations.platform.productsLoaded = val;
    },
  },
};

export default integrationsModule;
