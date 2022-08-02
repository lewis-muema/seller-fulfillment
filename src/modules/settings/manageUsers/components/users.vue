<template>
  <div>
    <div class="manageUsers-top-bar">
      <v-btn
        class="manageUsers-add-button"
        @click="$router.push('/settings/add-user')"
      >
        {{ $t("settings.addNewUser") }}
      </v-btn>
    </div>
    <div class="manageUsers-bottom-bar">
      <div class="manageUsers-search-bar">
        <v-text-field
          color="#324BA8"
          class="manageUsers-search-field"
          v-model="params"
          prepend-inner-icon="mdi-magnify"
          :label="$t('settings.searchUser')"
          variant="outlined"
          :placeholder="$t('settings.searchUser')"
          clearable
          clear-icon="mdi-close"
        ></v-text-field>
      </div>
      <div class="users-table" :class="noResults ? 'hidden-ui' : ''">
        <v-table>
          <thead>
            <tr>
              <th class="text-left users-name-head">
                <span :class="getLoader.users">{{ $t("settings.name") }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader.users">{{
                  $t("settings.phoneNumber")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader.users">{{
                  $t("settings.emailAddress")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader.users">{{
                  $t("settings.status")
                }}</span>
              </th>
              <th class="text-left">
                <span :class="getLoader.users">{{
                  $t("settings.actions")
                }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              :id="`users ${sanitizeId(user.first_name)} ${sanitizeId(
                user.last_name
              )} ${sanitizeId(user.phone_number)} ${sanitizeId(user.email)}`"
              class="users-table-column"
              v-for="(user, i) in getUsers"
              :key="i"
              @click="viewUser(user)"
              :class="getLoader.users ? 'inactive-col' : ''"
            >
              <td class="users-name-row users-name-head">
                <span :class="getLoader.users"
                  >{{ user.first_name }} {{ user.last_name }}</span
                >
              </td>
              <td class="users-number-row">
                <span :class="getLoader.users">
                  {{ user.phone_number }}
                </span>
              </td>
              <td class="users-email-row">
                <span :class="getLoader.users">
                  {{ user.email }}
                </span>
              </td>
              <td class="users-status-row">
                <span v-if="getLoader.users" :class="getLoader.users">
                  {{ user.active_status }}
                </span>
                <span
                  v-else
                  :class="`users-${status(user.active_status)}-status`"
                >
                  {{
                    user.active_status
                      ? statusName(user.active_status)
                      : $t("deliveries.active")
                  }}</span
                >
              </td>
              <td class="users-action-row">
                <v-menu
                  transition="slide-y-transition"
                  anchor="bottom center"
                  v-if="!getLoader.users"
                >
                  <template v-slot:activator="{ props }">
                    <i class="mdi mdi-dots-horizontal" v-bind="props"></i>
                  </template>
                  <v-list class="users-actions-popup">
                    <v-list-item
                      v-for="(action, i) in actions(user)"
                      :key="i"
                      :class="
                        user.user_role === 'ROLE_OWNER' &&
                        action.link !== '/settings/view-user'
                          ? 'disabled-action-row'
                          : ''
                      "
                    >
                      <v-list-item-title @click="triggerAction(action, user)">
                        {{ $t(action.label) }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <div :class="noResults ? '' : 'hidden-ui'">
        <div class="no-products-card-container">
          <span class="no-deliveries-icon-halo">
            <i class="mdi mdi-magnify no-products-icon"></i>
          </span>
          <div class="no-deliveries-description">
            {{ $t("settings.sorryWeCouldntFindAnyMatches") }}
          </div>
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
      "getUsers",
      "getStorageUserDetails",
      "getUserActions",
      "getActiveUser",
    ]),
  },
  mounted() {
    this.fetchUsers();
  },
  data() {
    return {
      params: "",
      activeUser: "",
      noResults: false,
    };
  },
  watch: {
    params(val) {
      this.fiterUsers(val);
    },
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
      "setLoader",
      "setUsers",
      "setOverlayStatus",
      "setActiveUser",
    ]),
    ...mapActions(["requestAxiosGet", "requestAxiosPut"]),
    viewUser(user) {
      this.$router.push(`/settings/view-user/${user.user_id}`);
    },
    triggerAction(action, user) {
      if (action.link) {
        this.$router.push(`${action.link}/${user.user_id}`);
      } else {
        this[action.trigger](user);
      }
    },
    sanitizeId(id) {
      return id.replaceAll(" ", "");
    },
    fiterUsers(param) {
      const users = document.querySelectorAll(".users-table-column");
      const hidden = [];
      users.forEach((row, i) => {
        if (row.id.toLowerCase().includes(param.toLowerCase())) {
          row.style.display = "";
          hidden.splice(i, 1);
        } else {
          row.style.display = "none";
          hidden.push("user");
        }
      });
      this.noResults = hidden.length === users.length;
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
    fetchUsers() {
      this.setLoader({
        type: "users",
        value: "loading-text",
      });
      this.requestAxiosGet({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users`,
      }).then((response) => {
        this.setLoader({
          type: "users",
          value: "",
        });
        if (response.status === 200) {
          this.setUsers(response.data.data.users);
        }
      });
    },
    deactivateUser(user) {
      this.setActiveUser(user);
      this.setOverlayStatus({
        overlay: true,
        popup: "deactivate",
      });
    },
    activateUser(user) {
      this.setActiveUser(user);
      this.setOverlayStatus({
        overlay: true,
        popup: "activate",
      });
    },
    activate() {
      this.setLoader({
        type: "users",
        value: "loading-text",
      });
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.getActiveUser.user_id}/activate`,
      }).then((response) => {
        if (response.status === 200) {
          this.fetchUsers();
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
      this.setLoader({
        type: "users",
        value: "loading-text",
      });
      this.requestAxiosPut({
        app: process.env.FULFILMENT_SERVER,
        endpoint: `seller/${this.getStorageUserDetails.business_id}/admin/users/${this.getActiveUser.user_id}/deactivate`,
      }).then((response) => {
        if (response.status === 200) {
          this.fetchUsers();
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
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    },
  },
};
</script>

<style>
.manageUsers-add-button {
  height: 40px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 14px;
}
.manageUsers-top-bar {
  margin: 60px 40px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0px;
}
.manageUsers-search-bar {
  margin: 30px;
}
.manageUsers-search-field {
  width: 25%;
  zoom: 90%;
}
.users-table-column {
  height: 60px;
  cursor: pointer;
}
.manageUsers-bottom-bar {
  margin: 30px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  background: white;
}
.users-name-head {
  padding-left: 60px !important;
}
.users-pending-status {
  background: #fbdf9a;
  padding: 2px 20px;
  border-radius: 10px;
  color: #7f3b02;
}
.users-DEACTIVATED-status {
  background: #eb8892;
  padding: 2px 20px;
  border-radius: 10px;
  color: #61040c;
}
.users-ACTIVATED-status {
  background: #b8f5a8;
  padding: 2px 20px;
  border-radius: 10px;
  color: #064a23;
}
.inactive-col {
  pointer-events: none;
}
.users-action-row {
  color: #c0c4cc;
  font-size: 35px !important;
}
.disabled-action-row {
  pointer-events: none;
  background: #80808033;
}
.hidden-ui {
  display: none;
}
</style>
