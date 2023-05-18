import { getTimeAgo } from "@/utils/time";
import { ref, computed } from "vue";
import { useStore } from "vuex";

const useIntegrations = () => {
  const loadingIntegrations = ref(false);
  const integrations = computed(() => {
    return store.getters.getIntegrations;
  });

  const activeIntegrations = computed(function () {
    return {
      platform: integrations.value.platform
        ? Object.keys(integrations.value.platform).length !== 0
        : false,
      api: integrations.value.apiKey
        ? Object.keys(integrations.value.apiKey).length !== 0
        : false,
    };
  });

  const store = useStore();

  const fetchIntegrations = async () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      loadingIntegrations.value = true;
      try {
        const payload = {
          app: process.env.FULFILMENT_API,
          endpoint: "v1/internal/users",
          params: {
            enabled: true,
          },
        };

        const { status, data } = await store.dispatch(
          "getIntegrations",
          payload
        );

        if (status === 200) {
          for (const salesChannel of data.salesChannels) {
            switch (salesChannel.channel_id) {
              // API2Cart
              case 2:
                integrations.value.platform = {
                  name: salesChannel.name,
                  dateAdded: getTimeAgo(new Date(salesChannel.created_at)),
                  channelId: salesChannel.channel_id,
                  id: salesChannel.id,
                  url: salesChannel.salesChannelProperties.url,
                  addedBy: salesChannel.salesChannelProperties.addedBy,
                  ...salesChannel,
                };
                localStorage.setItem("platformSalesChannelId", salesChannel.id);
                break;
              case 3:
                // API Integration
                integrations.value.apiKey = {
                  name: salesChannel.name,
                  dateAdded: getTimeAgo(new Date(salesChannel.created_at)),
                  channelId: salesChannel.channel_id,
                  id: salesChannel.id,
                  ...salesChannel,
                };
                break;
            }
          }
        }
        await store.dispatch("setIntegrations", integrations.value);
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        loadingIntegrations.value = false;
      }
    });
  };

  return {
    activeIntegrations,
    fetchIntegrations,
    loadingIntegrations,
    integrations,
  };
};

export default useIntegrations;
