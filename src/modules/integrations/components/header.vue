<template>
  <div class="header">
    <span
      ><h5 class="header__title">
        {{ $t("merchant.connectStore") }}
      </h5>
    </span>
    <span>
      <button @click="closePage()" data-test="header-close-btn">
        <img
          src="https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/close-button.svg"
        />
      </button>
    </span>
  </div>
</template>

<script>
import eventsMixin from "@/mixins/events_mixin";
import { inject } from "vue";

export default {
  data() {
    return {
      getUserDetails: inject("getUserDetails"),
    };
  },
  mixins: [eventsMixin],
  methods: {
    closePage() {
      this.sendSegmentEvents({
        event: "[merchant] Closed platform integration",
        data: {
          userId: this.getUserDetails.user_id,
        },
      });
      this.$router.go({ path: "/settings/integrations" });
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin: 16px 16px 0 16px;
  display: flex;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;
  align-items: center;

  &__title {
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 24px;
    letter-spacing: -0.005em;
    color: #606266;
  }

  &__btn {
    background: #606266;
    height: 13px;
    width: 13px;
  }
}
</style>
