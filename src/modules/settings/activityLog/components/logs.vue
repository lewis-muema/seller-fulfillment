<template>
  <div class="activity-log-container">
    <div class="activity-log-container-top">
      <el-select v-model="user" class="m-2" placeholder="All users">
        <el-option
          v-for="(user, i) in $store.getters.getUsers"
          :key="i"
          :label="user.name"
          :value="user.emailAddress"
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
              <span :class="$store.getters.getLoader">{{
                $t("settings.date")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("settings.user")
              }}</span>
            </th>
            <th class="text-left">
              <span :class="$store.getters.getLoader">{{
                $t("settings.action")
              }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="activity-log-column"
            v-for="(log, i) in $store.getters.getActivityLog"
            :key="i"
            @click="viewUser(i)"
          >
            <td class="users-name-row users-name-head">
              <span :class="$store.getters.getLoader">{{ log.date }}</span>
            </td>
            <td class="users-number-row">
              <span :class="$store.getters.getLoader">
                {{ log.user }}
              </span>
            </td>
            <td class="users-email-row">
              <span :class="$store.getters.getLoader">
                {{ log.action }}
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: "",
      range: "",
    };
  },
  mounted() {
    this.$store.commit("setLoader", "");
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
</style>
