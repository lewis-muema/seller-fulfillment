<template>
  <div>
    <div v-if="!viewUsers">
      <div class="manageUsers-top-bar">
        <v-btn
          class="manageUsers-add-button"
          @click="$router.push('/settings/add-user')"
        >
          {{ $t("settings.addUser") }}
        </v-btn>
      </div>
      <div class="manageUsers-bottom-bar">
        <div class="manageUsers-search-bar">
          <v-text-field
            color="#324BA8"
            class="manageUsers-search-field"
            prepend-inner-icon="mdi-magnify"
            :label="$t('settings.searchUser')"
            variant="outlined"
            :placeholder="$t('settings.searchUser')"
          ></v-text-field>
        </div>
        <div class="users-table">
          <v-table>
            <thead>
              <tr>
                <th class="text-left users-name-head">
                  <span :class="$store.getters.getLoader">{{
                    $t("settings.name")
                  }}</span>
                </th>
                <th class="text-left">
                  <span :class="$store.getters.getLoader">{{
                    $t("settings.phoneNumber")
                  }}</span>
                </th>
                <th class="text-left">
                  <span :class="$store.getters.getLoader">{{
                    $t("settings.emailAddress")
                  }}</span>
                </th>
                <th class="text-left">
                  <span :class="$store.getters.getLoader">{{
                    $t("settings.status")
                  }}</span>
                </th>
                <th class="text-left">
                  <span :class="$store.getters.getLoader">{{
                    $t("settings.actions")
                  }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="users-table-column"
                v-for="(user, i) in $store.getters.getUsers"
                :key="i"
                @click="viewUser(i)"
              >
                <td class="users-name-row users-name-head">
                  <span :class="$store.getters.getLoader">{{ user.name }}</span>
                </td>
                <td class="users-number-row">
                  <span :class="$store.getters.getLoader">
                    {{ user.phoneNumber }}
                  </span>
                </td>
                <td class="users-email-row">
                  <span :class="$store.getters.getLoader">
                    {{ user.emailAddress }}
                  </span>
                </td>
                <td class="users-status-row">
                  <span
                    v-if="$store.getters.getLoader"
                    :class="$store.getters.getLoader"
                  >
                    {{ user.status }}
                  </span>
                  <span v-else :class="`users-${user.status}-status`">
                    {{ user.status }}</span
                  >
                </td>
                <td class="users-action-row">
                  <v-menu
                    transition="slide-y-transition"
                    anchor="bottom center"
                  >
                    <template v-slot:activator="{ props }">
                      <i class="mdi mdi-dots-horizontal" v-bind="props"></i>
                    </template>
                    <v-list class="users-actions-popup">
                      <v-list-item v-for="(action, i) in user.actions" :key="i">
                        <v-list-item-title @click="$router.push(action.link)">
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
      </div>
    </div>
    <div class="viewUsers-details-panel" v-else>
      <div class="viewUsers-details-panel-top">
        <span class="viewUsers-details-back" @click="viewUsers = false">
          <i class="mdi mdi-arrow-left"></i>
        </span>
        <span @click="log()">
          {{ $t("settings.back") }}
        </span>
        <span class="viewUsers-details-actions">
          <v-menu transition="slide-y-transition" anchor="bottom center">
            <template v-slot:activator="{ props }">
              <v-btn
                class="viewUsers-details-actions-btn"
                v-bind="props"
                append-icon="mdi-chevron-down"
              >
                {{ $t("settings.actions") }}
              </v-btn>
            </template>
            <v-list class="users-actions-popup">
              <v-list-item v-for="(action, i) in userRow.actions" :key="i">
                <v-list-item-title @click="$router.push(action.link)">
                  {{ $t(action.label) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
      </div>
      <div>
        <div class="viewUsers-details-row">
          <p class="viewUsers-details-title">{{ $t("settings.name") }}</p>
          <p class="viewUsers-details-row-description">{{ userRow.name }}</p>
        </div>
        <div class="viewUsers-details-row">
          <p class="viewUsers-details-title">
            {{ $t("settings.phoneNumber") }}
          </p>
          <p class="viewUsers-details-row-description">
            {{ userRow.phoneNumber }}
          </p>
        </div>
        <div class="viewUsers-details-row">
          <p class="viewUsers-details-title">
            {{ $t("settings.emailAddress") }}
          </p>
          <p class="viewUsers-details-row-description">
            {{ userRow.emailAddress }}
          </p>
        </div>
        <div class="viewUsers-details-row">
          <p class="viewUsers-details-title">{{ $t("settings.status") }}</p>
          <p class="viewUsers-details-row-description">
            <span :class="`users-${userRow.status}-status`">
              {{ userRow.status }}</span
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      actionsToggle: false,
      index: 0,
      viewUsers: false,
    };
  },
  computed: {
    userRow() {
      return this.$store.getters.getUsers[this.index];
    },
  },
  mounted() {
    this.$store.commit("setComponent", this.$t("common.manageUsers"));
    this.$store.commit("setLoader", "");
  },
  methods: {
    viewUser(index) {
      this.index = index;
      this.viewUsers = true;
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
.users-Active-status {
  background: #b8f5a8;
  padding: 2px 20px;
  border-radius: 10px;
  color: #064a23;
}
.viewUsers-details-panel {
  width: 500px;
  margin: auto;
  border: 1px solid #e2e7ed;
  padding: 30px;
  border-radius: 5px;
  margin-top: 60px;
}
.viewUsers-details-actions {
  margin-left: auto;
}
.viewUsers-details-actions-btn {
  text-transform: inherit;
  letter-spacing: 0px;
  color: #606266 !important;
}
.viewUsers-details-panel-top {
  display: flex;
  align-items: center;
  height: 50px;
  font-size: 18px;
}
.viewUsers-details-back {
  margin-right: 13px;
  cursor: pointer;
  font-size: 26px;
}
.viewUsers-details-row {
  margin-top: 20px;
  margin-bottom: 20px;
}
.viewUsers-details-title {
  color: #606266;
  margin-bottom: 10px;
}
</style>
