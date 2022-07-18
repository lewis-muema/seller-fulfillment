<template>
  <div>
    <div class="access-denied-container">
      <img
        class="access-denied-img"
        src="https://images.sendyit.com/fulfilment/seller/access_denied.png"
        alt=""
      />
      <p class="access-denied-title">{{ $t("common.accessDenied") }}</p>
      <p class="access-denied-description">
        {{ $t("common.thePageYoureTryingToAccess") }}
      </p>
      <button class="access-denied-button" @click="$router.push('/')">
        {{ $t("common.goBack") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  mounted() {
    this.setComponent("common.accessDenied");
  },
  methods: {
    ...mapMutations(["setComponent"]),
  },
};
</script>

<style>
.access-denied-img {
  width: 120px;
}
.access-denied-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;
  border: 1px solid #e2e7ed;
  background: white;
  margin: 5% 25%;
}
.access-denied-title {
  font-weight: 600;
  margin-top: 20px;
  font-size: 20px;
}
.access-denied-description {
  width: 400px;
  text-align: center;
  color: #606266;
  font-size: 18px;
}
.access-denied-button {
  width: 250px;
  height: 60px;
  border-radius: 5px;
  background: #d3ddf6;
  color: #324ba8;
  font-weight: 500;
  margin-top: 10px;
}
</style>
