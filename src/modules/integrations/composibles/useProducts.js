import { computed, ref } from "vue";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";

const useProducts = () => {
  const store = useStore();
  const productsLoaded = ref(false);
  //to-do: redirect user to previous step if the sales channel is not available
  // const salesChannelId = computed(
  //   () => store.state.integrations.activeIntegrations.platform.id
  // );

  const finishSyncPayload = computed(
    () => store.state.integrations.platform.finishSyncPayload
  );

  const sync = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const salesChannelId = localStorage.getItem("platformSalesChannelId");
      try {
        await store.dispatch("syncPlatformProducts", {
          salesChannelId,
        });
        productsLoaded.value = true;
        resolve();
      } catch (e) {
        ElNotification({
          title: "Error fetching inventory",
          message: `${e}`,
          type: "error",
        });
        productsLoaded.value = false;
        reject(e);
      }
    });
  };

  const finishSync = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        await store.dispatch(
          "finishSyncingPlatformProducts",
          JSON.stringify(finishSyncPayload.value)
        );
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
