<template>
  <div class="profile-container">
    <div class="profile-navigation-bar">
      <div
        @click="$router.push('/settings/profile/personal-info')"
        :class="
          $route.params.page === 'personal-info' ? 'profile-active-nav' : ''
        "
        class="profile-navigation-bar-item"
      >
        {{ $t("settings.personalInfo") }}
      </div>
      <div
        @click="$router.push('/settings/profile/business-profile')"
        :class="
          $route.params.page === 'business-profile' ? 'profile-active-nav' : ''
        "
        class="profile-navigation-bar-item"
      >
        {{ $t("settings.businessProfile") }}
      </div>
      <div
        @click="$router.push('/settings/profile/change-language')"
        :class="
          $route.params.page === 'change-language' ? 'profile-active-nav' : ''
        "
        class="profile-navigation-bar-item"
      >
        {{ $t("settings.changeLanguage") }}
      </div>
    </div>
    <div class="profile-body">
      <personalInfo v-if="$route.params.page === 'personal-info'" />
      <businessProfile v-if="$route.params.page === 'business-profile'" />
      <changeLanguage v-if="$route.params.page === 'change-language'" />
    </div>
  </div>
</template>

<script>
import personalInfo from "./components/personalInfo.vue";
import businessProfile from "./components/businessProfile.vue";
import changeLanguage from "./components/changeLanguage.vue";
import { mapMutations } from "vuex";

export default {
  components: { personalInfo, businessProfile, changeLanguage },
  data() {
    return {};
  },
  mounted() {
    this.setComponent("common.profile");
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
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
  background: #dcdfe6;
}
</style>
