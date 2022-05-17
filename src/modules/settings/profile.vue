<template>
  <div class="profile-container">
    <div class="profile-navigation-bar">
      <div
        @click="active = 'personalInfo'"
        :class="active === 'personalInfo' ? 'profile-active-nav' : ''"
        class="profile-navigation-bar-item"
      >
        {{ $t("settings.personalInfo") }}
      </div>
      <div
        @click="active = 'businessProfile'"
        :class="active === 'businessProfile' ? 'profile-active-nav' : ''"
        class="profile-navigation-bar-item"
      >
        {{ $t("settings.businessProfile") }}
      </div>
      <div
        @click="active = 'changeLanguage'"
        :class="active === 'changeLanguage' ? 'profile-active-nav' : ''"
        class="profile-navigation-bar-item"
      >
        {{ $t("settings.changeLanguage") }}
      </div>
    </div>
    <div class="profile-body">
      <personalInfo v-if="active === 'personalInfo'" />
      <businessProfile v-if="active === 'businessProfile'" />
      <changeLanguage v-if="active === 'changeLanguage'" />
    </div>
  </div>
</template>

<script>
import personalInfo from "./components/personalInfo.vue";
import businessProfile from "./components/businessProfile.vue";
import changeLanguage from "./components/changeLanguage.vue";

export default {
  components: { personalInfo, businessProfile, changeLanguage },
  data() {
    return {
      active: "personalInfo",
    };
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.profile"));
  },
};
</script>

<style>
.profile-container {
  display: grid;
  grid-template-columns: 30% 70%;
  margin-top: 50px;
}
.profile-navigation-bar {
  width: 50%;
  margin-left: auto;
}
.profile-body {
  border-left: 1px solid #c0c4cc;
}
.profile-navigation-bar-item {
  height: 60px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  border-radius: 5px;
  cursor: pointer;
}
.profile-active-nav {
  border: 1px solid #dcdfe6;
  border-right: 5px solid #324ba8;
}
</style>
