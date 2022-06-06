<template>
  <v-overlay v-model="userAdded" class="align-center justify-center">
    <div class="user-added-container">
      <div class="user-added-section">
        <div class="user-added-close">
          <i
            @click="userAdded = false"
            class="mdi mdi-close user-added-close-icon"
          ></i>
        </div>
      </div>
      <div class="user-added-section-bottom">
        <i class="mdi mdi-check-circle-outline user-added-check"></i>
        <p class="user-added-title">
          {{ $t("settings.userAddedSuccessfully") }}
        </p>
        <p class="user-added-description">
          {{ $t("settings.addedSuccessfully", { name: "George Mulei" }) }}
        </p>
        <v-btn class="edit-user-save" @click="userAdded = false">
          {{ $t("settings.okay") }}
        </v-btn>
      </div>
    </div>
  </v-overlay>
</template>

<script>
export default {
  data() {
    return {
      userAdded: true,
    };
  },
};
</script>

<style>
.user-added-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 450px;
  border-radius: 5px;
  font-family: "DM Sans";
}
.user-added-section {
  display: flex;
}
.user-added-label {
  font-size: 16px;
  width: 60%;
  font-weight: 500;
}
.user-added-close-icon {
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.user-added-row-top {
  display: flex;
  padding-bottom: 15px;
  border-bottom: 0.6px solid #c0c4cc78;
  margin-bottom: 15px;
}
.user-added-row-top-name {
  margin-bottom: 0px;
}
.user-added-row-top-variant {
  color: #606266;
}
.user-added-row-top-left {
  margin-left: 20px;
}
.user-added-row-top-right {
  font-weight: 500;
  font-size: 16px;
  margin-left: auto;
}
.user-added-row-bottom {
  color: #606266;
  margin-bottom: 20px;
}
.user-added-img {
  width: 40px;
}
.user-added-close {
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.user-added-check {
  font-size: 60px;
  color: #116f28;
  margin-bottom: 20px;
}
.user-added-section-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-added-title {
  color: #303133;
  font-weight: 500;
}
.user-added-description {
  color: #303133;
  font-size: 14px;
  width: 75%;
  text-align: center;
}
</style>
