<template>
  <div class="container">
    <div class="congratulations-container">
      <div class="congratulations-container__logo">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 0C8.96 0 0 8.96 0 20C0 31.04 8.96 40 20 40C31.04 40 40 31.04 40 20C40 8.96 31.04 0 20 0ZM20 22C18.9 22 18 21.1 18 20V12C18 10.9 18.9 10 20 10C21.1 10 22 10.9 22 12V20C22 21.1 21.1 22 20 22ZM22 30H18V26H22V30Z"
            fill="#9B101C"
          />
        </svg>
      </div>
      <div
        class="congratulations-container__heading congratulations-container__section"
        data-test="congratulations"
      >
        {{ $t("merchant.we_could_not_fully_connect_to_your_store") }}
      </div>
      <div class="congratulations-container__text" v-if="message">
        {{ message }}
      </div>
      <div class="congratulations-container__text">
        {{ $t("merchant.we") }} {{ message ? "also" : "" }}
        {{ $t("merchant.require_you_to_enable_some_store_permissions_msg") }}
      </div>
      <div class="congratulations-container__help-section">
        <span class="congratulations-container__help-section-text">{{
          $t("merchant.learn_about_woocommerce_store_permissions")
        }}</span>
        <svg
          width="19"
          height="18"
          viewBox="0 0 19 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 16H3.5C2.95 16 2.5 15.55 2.5 15V3C2.5 2.45 2.95 2 3.5 2H8.5C9.05 2 9.5 1.55 9.5 1C9.5 0.45 9.05 0 8.5 0H2.5C1.96957 0 1.46086 0.210714 1.08579 0.585786C0.710714 0.960859 0.5 1.46957 0.5 2V16C0.5 17.1 1.4 18 2.5 18H16.5C17.6 18 18.5 17.1 18.5 16V10C18.5 9.45 18.05 9 17.5 9C16.95 9 16.5 9.45 16.5 10V15C16.5 15.55 16.05 16 15.5 16ZM11.5 1C11.5 1.55 11.95 2 12.5 2H15.09L5.96 11.13C5.77302 11.317 5.66798 11.5706 5.66798 11.835C5.66798 12.0994 5.77302 12.353 5.96 12.54C6.14698 12.727 6.40057 12.832 6.665 12.832C6.92943 12.832 7.18302 12.727 7.37 12.54L16.5 3.41V6C16.5 6.55 16.95 7 17.5 7C18.05 7 18.5 6.55 18.5 6V1C18.5 0.45 18.05 0 17.5 0H12.5C11.95 0 11.5 0.45 11.5 1Z"
            fill="#324BA8"
          />
        </svg>
      </div>
      <hr class="hr-line" />
      <div class="congratulations-container__bottom">
        <button
          class="congratulations-container__btn"
          data-test="import-products"
        >
          <svg
            width="14"
            height="18"
            viewBox="0 0 14 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.28576 10.9023C1.1691 7.81895 3.4191 4.24395 6.9941 4.24395V5.73562C6.9941 6.11062 7.4441 6.29395 7.70243 6.02729L10.0274 3.70229C10.1941 3.53562 10.1941 3.27729 10.0274 3.11062L7.70243 0.785618C7.64368 0.728033 7.56921 0.689125 7.48838 0.673799C7.40756 0.658473 7.32401 0.667415 7.24826 0.699497C7.17251 0.731579 7.10795 0.785366 7.06272 0.854079C7.01749 0.922792 6.99361 1.00336 6.9941 1.08562V2.57729C2.1941 2.57729 -0.830904 7.39395 0.760763 11.569C0.960763 12.094 1.66076 12.219 2.06076 11.819L2.12743 11.7523C2.3441 11.5356 2.3941 11.2023 2.28576 10.9023ZM11.6941 7.59395C12.8358 10.794 10.4691 14.244 6.9941 14.244V12.7523C6.9941 12.3773 6.5441 12.194 6.28576 12.4606L3.96076 14.7856C3.7941 14.9523 3.7941 15.2106 3.96076 15.3773L6.28576 17.7023C6.344 17.7594 6.41772 17.7981 6.49777 17.8137C6.57783 17.8293 6.6607 17.8211 6.73612 17.7901C6.81153 17.759 6.87618 17.7065 6.92204 17.639C6.9679 17.5716 6.99295 17.4922 6.9941 17.4106V15.9106C11.7941 15.9106 14.8191 11.094 13.2274 6.91895C13.0274 6.39395 12.3274 6.26895 11.9274 6.66895L11.8691 6.72728C11.6441 6.95228 11.5941 7.28562 11.6941 7.59395Z"
              fill="white"
            />
          </svg>
          {{ $t("merchant.check_permissions") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ConnectionError",
  props: {
    message: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.congratulations-container {
  &__section {
    margin-bottom: 24px;
  }

  &__help-section {
    display: flex;
  }

  &__bottom {
    text-align: right !important;
  }

  &__help-section-text {
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 24px;
    color: #324ba8;
    margin-right: 11px;
  }

  &__btn {
    display: flex;
    align-items: center;
    flex-direction: row;
  }
}
</style>
