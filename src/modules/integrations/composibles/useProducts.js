import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { ElNotification } from "element-plus";

const useProducts = () => {
  const store = useStore();
  const productsLoading = ref(false);
  const productsLoaded = ref(false);
  //to-do: redirect user to previous step if the sales channel is not available
  const salesChannelId = computed(
    () => store.state.integrations.activeIntegrations.platform.id
  );

  const finishSyncPayload = computed(
    () => store.state.integrations.platform.finishSyncPayload
  );

  const sync = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      productsLoading.value = true;
      try {
        await store.dispatch("syncPlatformProducts", {
          salesChannelId: salesChannelId.value,
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
      } finally {
        productsLoading.value = false;
      }
    });
  };

  const finishSync = (payload = null) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        //to-do: ccleanup
        await store.dispatch(
          "finishSyncingPlatformProducts",
          payload || finishSyncPayload.value
        );
        resolve();
      } catch (e) {
        ElNotification({
          title: "Error fetching inventory",
          message: `${e}`,
          type: "error",
        });
        reject(e);
      }
    });
  };

  onMounted(async () => {
    await sync();
  });

  return {
    sync,
    finishSync,
    productsLoaded,
    productsLoading,
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
  };
};

export default useProducts;
