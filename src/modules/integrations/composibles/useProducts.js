import { computed } from "vue";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";

const useProducts = () => {
  const store = useStore();
  // const productsLoaded = ref(false);

  const finishSyncPayload = computed(
    () => store.getters.getPlatformSyncPayload
  );

  const storeIntegrations = computed(() => store);

  const sync = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const salesChannelId = localStorage.getItem("platformSalesChannelId");
      try {
        await store.dispatch("syncPlatformProducts", {
          salesChannelId,
        });
        // productsLoaded.value = true;
        resolve();
      } catch (e) {
        ElNotification({
          title: "Error fetching inventory",
          message: `${e}`,
          type: "error",
        });
        // productsLoaded.value = false;
        reject(e);
      }
    });
  };

  const finishSync = () => {
    console.log("finishSyncPayload", finishSyncPayload);
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        await store.dispatch("finishSyncingPlatformProducts", {
          app: process.env.MERCHANT_GATEWAY,
          endpoint: "api2cart/products/finish-sync",
          values: JSON.stringify(finishSyncPayload.value),
        });
        resolve();
      } catch (e) {
        ElNotification({
          title: "Error finishing sync",
          message: `${e}`,
          type: "error",
        });
        reject(e);
      }
    });
  };

  return {
    storeIntegrations,
    sync,
    finishSync,
    getPlatformProductsLoaded: computed(
      () => store.getters.getPlatformProductsLoaded
    ),
    getPlatformSyncStatus: computed(() => store.getters.getPlatformSyncStatus),
    getPlatformSyncProducts: computed(
      () => store.getters.getPlatformSyncProducts
    ),
    getPlatformSyncPartialMatchingProducts: computed(
      () => store.getters.getPlatformSyncPartialMatchingProducts
    ),
    getPlatformSyncMatchingProducts: computed(
      () => store.getters.getPlatformSyncMatchingProducts
    ),
    getPlatformSyncNewProducts: computed(
      () => store.getters.getPlatformSyncNewProducts
    ),
    getPlatformSyncPayload: computed(
      () => store.getters.getPlatformSyncPayload
    ),
    conflictsResolved: computed(() => store.getters.getConflictsResolvedStatus),
  };
};

export default useProducts;
