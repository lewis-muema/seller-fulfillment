<template>
  <div>
    <div class="view-users-details-panel-banner">
      <i
        class="mdi mdi-alert-circle-outline view-users-details-panel-banner-icon"
      ></i>
      <div>
        <p class="view-users-details-panel-banner-description">
          {{
            $t("settings.anEmailToAcceptInvitation", {
              email: userRow.emailAddress,
            })
          }}
        </p>
        <p class="view-users-details-panel-banner-link" @click="resend = true">
          {{ $t("settings.userDidn’tReceiveEmail") }}
        </p>
      </div>
    </div>
    <div class="view-users-details-panel">
      <div class="view-users-details-panel-top">
        <span class="view-users-details-back" @click="toggle(false)">
          <i class="mdi mdi-arrow-left"></i>
        </span>
        <span @click="log()">
          {{ $t("settings.back") }}
        </span>
        <span class="view-users-details-actions">
          <v-menu transition="slide-y-transition" anchor="bottom center">
            <template v-slot:activator="{ props }">
              <v-btn
                class="view-users-details-actions-btn"
                v-bind="props"
                append-icon="mdi-chevron-down"
              >
                {{ $t("settings.actions") }}
              </v-btn>
            </template>
            <v-list class="users-actions-popup">
              <v-list-item v-for="(action, i) in userRow.actions" :key="i">
                <v-list-item-title @click="triggerAction(action)">
                  {{ $t(action.label) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </div>
      <div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">{{ $t("settings.name") }}</p>
          <p class="view-users-details-row-description">{{ userRow.name }}</p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">
            {{ $t("settings.phoneNumber") }}
          </p>
          <p class="view-users-details-row-description">
            {{ userRow.phoneNumber }}
          </p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">
            {{ $t("settings.emailAddress") }}
          </p>
          <p class="view-users-details-row-description">
            {{ userRow.emailAddress }}
          </p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">{{ $t("settings.status") }}</p>
          <p class="view-users-details-row-description">
            <span :class="`users-${userRow.status}-status`">
              {{ userRow.status }}</span
            >
          </p>
        </div>
      </div>
    </div>
    <v-overlay v-model="resend" class="align-center justify-center">
      <div>
        <div class="resend-invite-container">
          <div class="resend-invite-section">
            <div class="resend-invite-close">
              <i
                @click="resend = false"
                class="mdi mdi-close resend-invite-close-icon"
              ></i>
            </div>
          </div>
          <div class="resend-invite-section-bottom">
            <i class="mdi mdi-check-circle-outline resend-invite-check"></i>
            <p class="resend-invite-title">
              {{ $t("settings.areYouSureYouWantToResend") }}
            </p>
            <p class="resend-invite-description">
              <span>{{ userRow.emailAddress }}</span>
              <span class="products-edit" :class="getLoader">
                <i class="mdi mdi-pencil"></i>
                {{ $t("settings.edit") }}
              </span>
            </p>
            <v-btn class="edit-user-save" @click="resend = false">
              {{ $t("settings.yesResendInvite") }}
            </v-btn>
          </div>
        </div>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    userRow: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["getLoader"]),
  },
  data() {
    return {
      resend: false,
    };
  },
  methods: {
    toggle(val) {
      this.$emit("viewUser", val);
    },
    triggerAction(action) {
      if (action.link) {
        this.$router.push(action.link);
      } else {
        this[action.trigger] = true;
      }
    },
  },
};
</script>

<style>
.view-users-details-panel {
  width: 500px;
  margin: auto;
  border: 1px solid #e2e7ed;
  padding: 30px;
  border-radius: 5px;
  margin-top: 60px;
  background: white;
}
.view-users-details-actions {
  margin-left: auto;
}
.view-users-details-actions-btn {
  text-transform: inherit;
  letter-spacing: 0px;
  color: #606266 !important;
}
.view-users-details-panel-top {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 18px;
}
.view-users-details-back {
  margin-right: 13px;
  cursor: pointer;
  font-size: 26px;
}
.view-users-details-row {
  margin-top: 20px;
  margin-bottom: 20px;
}
.view-users-details-title {
  color: #606266;
  margin-bottom: 10px;
}
.view-users-details-panel-banner {
  display: flex;
  width: 500px;
  margin: auto;
  padding: 15px;
  border: 2px solid #9b101c;
  border-radius: 5px;
  background: white;
}
.view-users-details-panel-banner-icon {
  font-size: 30px;
  color: #9b101c;
  margin-right: 10px;
}
.view-users-details-panel-banner-description {
  font-size: 14px;
  margin-bottom: 5px;
  margin-top: 10px;
}
.view-users-details-panel-banner-link {
  font-size: 14px;
  cursor: pointer;
  color: #324ba8;
  margin-bottom: 10px;
}
.resend-invite-container {
  background: white;
  display: flex;
  flex-direction: column;
  padding: 40px;
  width: 450px;
  border-radius: 5px;
  font-family: "DM Sans";
}
.resend-invite-section {
  display: flex;
}
.resend-invite-label {
  font-size: 16px;
  width: 60%;
  font-weight: 500;
}
.resend-invite-close-icon {
  font-size: 20px;
  margin-left: auto;
  cursor: pointer;
}
.resend-invite-row-top {
  display: flex;
  padding-bottom: 15px;
  border-bottom: 0.6px solid #c0c4cc78;
  margin-bottom: 15px;
}
.resend-invite-row-top-name {
  margin-bottom: 0px;
}
.resend-invite-row-top-variant {
  color: #606266;
}
.resend-invite-row-top-left {
  margin-left: 20px;
}
.resend-invite-row-top-right {
  font-weight: 500;
  font-size: 16px;
  margin-left: auto;
}
.resend-invite-row-bottom {
  color: #606266;
  margin-bottom: 20px;
}
.resend-invite-img {
  width: 40px;
}
.resend-invite-close {
  width: 100%;
  display: flex;
  align-items: flex-end;
}
.resend-invite-check {
  font-size: 60px;
  color: #116f28;
  margin-bottom: 20px;
}
.resend-invite-section-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.resend-invite-title {
  color: #303133;
  font-weight: 500;
  text-align: center;
}
.resend-invite-description {
  color: #303133;
  font-size: 14px;
  width: 75%;
  text-align: center;
}
</style>
