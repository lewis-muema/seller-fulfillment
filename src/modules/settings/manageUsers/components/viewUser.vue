<template>
  <div>
    <div
      class="view-users-details-panel-banner"
      v-if="getUser.invitation_status === 'INVITATION_PENDING_ACCEPTANCE'"
    >
      <i
        class="mdi mdi-alert-circle-outline view-users-details-panel-banner-icon"
      ></i>
      <div>
        <p class="view-users-details-panel-banner-description">
          <span :class="getLoader">
            {{
              $t("settings.anEmailToAcceptInvitation", {
                email: getUser.email,
              })
            }}
          </span>
        </p>
        <p
          class="view-users-details-panel-banner-link"
          @click="resendEmail(getUser)"
        >
          {{ $t("settings.userDidn’tReceiveEmail") }}
        </p>
      </div>
    </div>
    <div class="view-users-details-panel">
      <div class="view-users-details-panel-top">
        <span class="view-users-details-back" @click="$router.go(-1)">
          <i class="mdi mdi-arrow-left"></i>
        </span>
        <span>
          {{ $t("settings.back") }}
        </span>
        <span class="view-users-details-actions">
          <v-menu
            transition="slide-y-transition"
            anchor="bottom center"
            v-model="shown"
            v-if="!getLoader && getUser.user_role !== 'ROLE_OWNER'"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                class="view-users-details-actions-btn elevation-0"
                v-bind="props"
                append-icon="mdi-chevron-down"
                variant="outlined"
              >
                {{ $t("settings.actions") }}
              </v-btn>
            </template>
            <v-list class="users-actions-popup">
              <v-list-item v-for="(action, i) in actions(getUser)" :key="i">
                <v-list-item-title @click="triggerAction(action, getUser)">
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
          <p class="view-users-details-row-description">
            <span :class="getLoader">
              {{ getUser.first_name }} {{ getUser.last_name }}
            </span>
          </p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">
            {{ $t("settings.phoneNumber") }}
          </p>
          <p class="view-users-details-row-description">
            <span :class="getLoader">
              {{ getUser.phone_number }}
            </span>
          </p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">
            {{ $t("settings.emailAddress") }}
          </p>
          <p class="view-users-details-row-description">
            <span :class="getLoader">
              {{ getUser.email }}
            </span>
          </p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">
            {{ $t("settings.userRole") }}
          </p>
          <p class="view-users-details-row-description">
            <span :class="getLoader">
              {{ roleName(getUser.user_role) }}
            </span>
          </p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">{{ $t("settings.status") }}</p>
          <p class="view-users-details-row-description">
            <span :class="`users-${status(getUser.active_status)}-status`">
              {{
                getUser.active_status
                  ? statusName(getUser.active_status)
                  : $t("deliveries.active")
              }}</span
            >
          </p>
        </div>
        <div class="view-users-details-row" v-if="getUser.invitation_status">
          <p class="view-users-details-title">
            {{ $t("settings.inviteStatus") }}
          </p>
          <p class="view-users-details-row-description">
            <span :class="`users-${status(getUser.invitation_status)}-status`">
              {{
                getUser.invitation_status
                  ? statusName(getUser.invitation_status)
                  : $t("deliveries.pending")
              }}</span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { ElNotification } from "element-plus";

export default {
  computed: {
    ...mapGetters([
      "getLoader",
      "getUser",
      "getUserActions",
      "getStorageUserDetails",
      "getActiveUser",
    ]),
  },
  data() {
    return {
      resend: false,
      shown: false,
    };
  },
  mounted() {
    this.setComponent("common.manageUsers");
    this.fetchUser();
  },
  watch: {
    "$store.state.userAction": function userAction(val) {
      if (val) {
        this[val]();
        this.setOverlayStatus({
          overlay: false,
          popup: val,
        });
      }
    },
  },
  methods: {
    ...mapMutations([
      "setUser",
      "setLoader",
      "setComponent",
      "setOverlayStatus",
      "setActiveUser",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPut"]),
    toggle(val) {
      this.$emit("viewUser", val);
    },
    triggerAction(action, user) {
      if (action.link) {
        this.$router.push(`${action.link}/${user.user_id}`);
      } else {
        this[action.trigger](user);
      }
    },
    actions(user) {
      const actions = [];
      const index = user.active_status === "ACTIVATED" ? 1 : 2;
      const resend =
        user.invitation_status === "INVITATION_PENDING_ACCEPTANCE" ? "" : 3;
      this.getUserActions.forEach((row, i) => {
        if (index !== i && resend !== i) {
          actions.push(row);
        }
      });
      return actions;
    },
    fetchUser() {
      this.setLoader("loading-text");
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.$route.params.user_id}`,
      }).then((response) => {
        this.setLoader("");
        if (response.status === 200) {
          this.setUser(response.data.data.user);
        }
      });
    },
    deactivateUser(user) {
      this.setActiveUser(user);
      this.activeUser = user;
      this.shown = false;
      this.setOverlayStatus({
        overlay: true,
        popup: "deactivate",
      });
    },
    activateUser(user) {
      this.setActiveUser(user);
      this.activeUser = user;
      this.shown = false;
      this.setOverlayStatus({
        overlay: true,
        popup: "activate",
      });
    },
    activate() {
      this.setLoader("loading-text");
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.getActiveUser.user_id}/activate`,
      }).then((response) => {
        if (response.status === 200) {
          this.fetchUser();
          ElNotification({
            title: this.$t("settings.userActivateSuccessfully"),
            message: "",
            type: "success",
          });
        } else {
          ElNotification({
            title: this.$t("settings.failedToActivateUser"),
            message: "",
            type: "success",
          });
        }
      });
    },
    deactivate() {
      this.setLoader("loading-text");
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.getActiveUser.user_id}/deactivate`,
      }).then((response) => {
        if (response.status === 200) {
          this.fetchUser();
          ElNotification({
            title: this.$t("settings.userDeactivateSuccessfully"),
            message: "",
            type: "success",
          });
        } else {
          ElNotification({
            title: this.$t("settings.failedToDeactivateUser"),
            message: "",
            type: "success",
          });
        }
      });
    },
    resendEmail(user) {
      this.setActiveUser(user);
      this.shown = false;
      this.setOverlayStatus({
        overlay: true,
        popup: "invite",
      });
    },
    status(activeStatus) {
      return activeStatus ? activeStatus : "ACTIVATED";
    },
    statusName(status) {
      status = status === "ACTIVATED" ? "ACTIVE" : status;
      status = status.replaceAll("_", " ");
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    },
    roleName(role) {
      role = role.split("_");
      return role[1];
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
.users-INVITATION_PENDING_ACCEPTANCE-status {
  background: #fbdf9a;
  padding: 2px 20px;
  border-radius: 10px;
  color: #7f3b02;
}
.users-INVITATION_ACCEPTED-status {
  background: #b8f5a8;
  padding: 2px 20px;
  border-radius: 10px;
  color: #064a23;
}
</style>
