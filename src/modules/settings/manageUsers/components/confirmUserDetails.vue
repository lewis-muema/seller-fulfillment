<template>
  <div>
    <div class="view-users-details-panel">
      <div class="view-users-details-panel-top">
        <span class="view-users-details-back" @click="$router.go(-1)">
          <i class="mdi mdi-arrow-left"></i>
        </span>
        <span>
          {{ $t("settings.confirmUserInformation") }}
        </span>
      </div>
      <div class="confirm-user-details-top">
        <span
          class="delivery-info-edit confirm-user-details-edit"
          @click="$router.push(`/settings/edit-user/${getUser.user_id}`)"
        >
          <i class="mdi mdi-pencil"></i>
          {{ $t("deliveries.edit") }}
        </span>
        <div class="view-users-details-row">
          <p class="view-users-details-title">{{ $t("settings.firstName") }}</p>
          <p class="view-users-details-row-description">
            <span :class="getLoader.userDetails">
              {{ getUser.first_name }}
            </span>
          </p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">{{ $t("settings.lastName") }}</p>
          <p class="view-users-details-row-description">
            <span :class="getLoader.userDetails">
              {{ getUser.last_name }}
            </span>
          </p>
        </div>
        <div class="view-users-details-row">
          <p class="view-users-details-title">
            {{ $t("settings.emailAddress") }}
          </p>
          <p class="view-users-details-row-description">
            <span :class="getLoader.userDetails">
              {{ getUser.email }}
            </span>
          </p>
        </div>
      </div>
      <div class="confirm-user-details-bottom">
        <div class="view-users-details-title mt-3">
          {{ $t("settings.modulesThatTheUserCanAccess") }}
        </div>
        <div
          class="confirm-user-details-view-permissions"
          @click="$router.push(`/settings/user-permissions/${getUser.user_id}`)"
        >
          {{ $t("settings.viewPermissions") }}
        </div>
      </div>
      <v-btn
        class="edit-info-submit-button confirm-user-details-btn"
        @click="addUser()"
      >
        {{ $t("settings.addUser") }}
      </v-btn>
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
    ]),
  },
  data() {
    return {
      resend: false,
      shown: false,
    };
  },
  mounted() {
    this.setComponent("settings.confirmUserInformation");
    this.fetchUser();
  },
  methods: {
    ...mapMutations([
      "setUser",
      "setLoader",
      "setComponent",
      "setOverlayStatus",
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
      this.setLoader({
        type: "userDetails",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.$route.params.user_id}`,
      }).then((response) => {
        this.setLoader({
          type: "userDetails",
          value: "",
        });
        if (response.status === 200) {
          this.setUser(response.data.data.user);
        }
      });
    },
    addUser() {
      ElNotification({
        title: this.$t("settings.userCreatedSuccessfully"),
        message: "",
        type: "success",
      });
      this.setOverlayStatus({
        overlay: true,
        popup: "user",
      });
      this.$router.push("/settings/manage-users");
    },
    status(activeStatus) {
      return activeStatus ? activeStatus : "pending";
    },
    statusName(status) {
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
.confirm-user-details-top {
  border: 1px solid #e2e7ed;
  padding: 10px 30px;
  border-radius: 5px;
  margin: 10px 0px;
}
.confirm-user-details-edit {
  margin-top: 20px;
}
.confirm-user-details-bottom {
  border: 1px solid #e2e7ed;
  padding: 10px 30px;
  border-radius: 5px;
  margin-top: 30px;
}
.confirm-user-details-btn {
  margin-top: 20px !important;
  height: 50px !important;
}
.confirm-user-details-view-permissions {
  color: #314ba8;
  cursor: pointer;
  margin-bottom: 10px;
}
</style>
