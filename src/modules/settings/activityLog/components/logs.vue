<template>
  <div class="activity-log-container">
    <div class="activity-log-container-top">
      <el-select
        v-model="user"
        class="m-2"
        :placeholder="$t('settings.allUsers')"
        @change="filterUsers($event)"
      >
        <el-option
          v-for="(user, i) in getBusinessUsers"
          :key="i"
          :label="`${user.firstName} ${user.lastName}`"
          :value="user.userId"
        />
      </el-select>
      <div class="activity-log-container-top-right">
        <label for="range" class="deliveries-date-label">
          {{ $t("settings.filterByDateRange") }}
        </label>
        <el-date-picker
          class="deliveries-date-picker"
          id="range"
          v-model="range"
          type="daterange"
          :start-placeholder="$t('deliveries.startDate')"
          :end-placeholder="$t('deliveries.endDate')"
        />
      </div>
    </div>
    <div class="activity-log">
      <v-table>
        <thead>
          <tr>
            <th class="text-left users-name-head">
              <span :class="getLoader.logs">{{ $t("settings.date") }}</span>
            </th>
            <th class="text-left">
              <span :class="getLoader.logs">{{ $t("settings.user") }}</span>
            </th>
            <th class="text-left">
              <span :class="getLoader.logs">{{ $t("settings.action") }}</span>
            </th>
          </tr>
        </thead>
        <tbody v-if="retrieveActivityLogs ? retrieveActivityLogs.length : []">
          <tr
            class="activity-log-column"
            v-for="(log, i) in retrieveActivityLogs"
            :key="i"
            @click="viewUser(i)"
          >
            <td class="users-name-row users-name-head">
              <span :class="getLoader.logs">{{
                formatDate(log.created_date)
              }}</span>
            </td>
            <td class="users-number-row">
              <span :class="getLoader.logs">
                {{ log.user_name }}
              </span>
            </td>
            <td class="users-email-row">
              <span :class="getLoader.logs">
                {{ formatActivityLogs(log.user_action_type, log) }}
              </span>
            </td>
          </tr>
        </tbody>
        <div v-else>
          <div class="no-products-card-container">
            <span class="no-deliveries-icon-halo">
              <i class="mdi mdi-history no-activities-icon"></i>
            </span>
            <div class="no-products-description no-activities-desc">
              {{ $t("settings.sorryActivitiesFound") }}
            </div>
            <div class="no-deliveries-description">
              {{ $t("settings.adjustDeliveryDate") }}
            </div>
          </div>
        </div>
      </v-table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import moment from "moment";
import mappedActivityLogs from "../../../../mixins/activityLogs";

export default {
  mixins: [mappedActivityLogs],
  data() {
    return {
      user: "",
      range: "",
    };
  },
  computed: {
    ...mapGetters([
      "getLoader",
      "getUsers",
      "getActivityLog",
      "getBusinessUsers",
      "getStorageUserDetails",
    ]),
    retrieveActivityLogs() {
      return this.getActivityLog;
    },
  },
  watch: {
    range(val) {
      this.$emit("range", val);
    },
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setTab"]),
    ...mapActions(["activityLogs"]),
    formatDate(date) {
      return `${moment(date).format("dddd, Do MMM")} ${moment(date).format(
        "h:mm"
      )}`;
    },
    formatActivityLogs(name, activity) {
      return this.showActivityLogs(name, activity);
    },
    filterUsers(val) {
      this.$emit("user", val);
    },
  },
};
</script>

<style>
.activity-log-container {
  margin-left: 30px;
  margin-top: 50px;
  width: 95%;
  padding-top: 20px;
  border: 1px solid #e2e7ed;
  border-radius: 5px;
  background: white;
  height: auto;
}
.activity-log-container-top {
  height: 90px;
  display: flex;
  align-items: flex-end;
  padding-left: 50px;
}
.activity-log-container-top-right {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  margin-left: 40px;
}
.activity-log-container-top .el-select .select-trigger .el-input {
  height: 50px;
}
.el-input__inner::placeholder,
.el-range-input::placeholder {
  color: black !important;
  font-size: 16px;
}
.activity-log-column {
  height: 70px;
}
.activity-log {
  margin-top: 20px;
}
.no-activities-desc {
  color: #606266 !important;
  font-weight: 500 !important;
}
.no-activities-icon {
  font-size: 50px !important;
  color: #909399 !important;
}
.log-product-name {
  color: #324ba8;
}
</style>
