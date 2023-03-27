<template>
  <div class="wrapper">
    <button class="select__button" @click="toggleOptions">
      <img
        :src="`https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/${selectedStore.toLowerCase()}.svg`"
        class="option__icon"
        v-if="selectedStore"
      />
      <span
        class="select__button--text"
        :class="selectedStore ? 'select__button--text--selected' : ''"
        data-test="select-dropdown"
        >{{ selectedStore ? selectedStore : "Select your platform" }}</span
      >
      <i
        class="dropdown-icon"
        :class="`mdi ${
          optionsVisible ? 'mdi-chevron-up' : 'mdi-chevron-down'
        } ${!selectedStore ? 'dropdown-icon--margin' : ''}`"
      />
    </button>
    <ul class="options" v-if="optionsVisible">
      <li
        v-for="store in availableStores"
        :key="store"
        class="option"
        @click="selectOption(store)"
        :data-test="`option-${store.toLowerCase()}`"
      >
        <img
          :src="`https://s3.eu-west-1.amazonaws.com/images.sendyit.com/fulfilment/seller/merchant/${store.toLowerCase()}.svg`"
          class="option__icon"
        />
        <span class="option__text">{{ store }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "SelectComponent",
  watch: {
    selectedStore: {
      handler: function (value) {
        this.$emit("update", value);
      },
    },
  },
  props: {
    availableStores: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedStore: null,
      optionsVisible: false,
    };
  },
  methods: {
    toggleOptions() {
      if (!this.optionsVisible) {
        this.optionsVisible = true;
      } else {
        this.optionsVisible = false;
      }
    },
    selectOption(selectedStore) {
      this.selectedStore = selectedStore;
      this.optionsVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
}
.dropdown-icon {
  width: 24px;
  height: 24px;

  &--margin {
    margin-left: 50px;
  }
}
.select {
  &__button {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 8px !important;
    width: 100%;
    height: 56px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 16px 8px;
    gap: 8px;
    background: #ffffff;
    border: 1px solid #c0c4cc;
    border-radius: 6px;
    flex: none;
    order: 1;
    align-self: stretch;
    flex-grow: 0;
    // justify-content: space-between;

    &--text {
      font-family: "DM Sans";
      font-style: normal;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
      color: #909399;
      width: 432px;
      text-align: left;

      &--selected {
        color: #303133;
      }
    }
  }
}

.options {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 16px 0 16px;
  position: absolute;
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e7ed;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  z-index: 1000;
  .option {
    list-style: none;
    border-radius: 6px;
    flex: none;
    order: 2;
    align-self: stretch;
    flex-grow: 0;
    display: flex;
    align-content: center;
    align-items: center;

    &:hover {
      cursor: pointer;
    }

    &__icon {
      display: flex;
      width: 24px;
      height: 24px;
    }

    &__text {
      display: flex;
      font-family: "DM Sans";
      font-style: normal;
      padding: 12px;
      font-weight: 400;
      font-size: 18px;
      line-height: 24px;
      width: 432px;
      display: flex;
      align-items: center;
      color: #303133;
    }
  }
}
</style>
