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

  const sync = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        productsLoading.value = true;
        await store.dispatch("syncPlatformProducts", {
          salesChannelId: salesChannelId.value,
        });
        resolve();
      } catch (e) {
        ElNotification({
          title: "Error fetching inventory",
          message: `${e}`,
          type: "error",
        });
        reject(e);
      } finally {
        productsLoading.value = false;
      }
    });
  };

  const finishSync = (payload) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        await store.dispatch("finishSyncingPlatformProducts", payload);
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
  };
};

export default useProducts;
