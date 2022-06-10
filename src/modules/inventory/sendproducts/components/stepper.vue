<template>
  <div>
    <v-row>
      <v-col cols="6" class="mx-auto mt-4 mb-3">
        <el-steps :active="active" finish-status="success">
          <el-step title="Select Products"></el-step>
          <el-step title="Add Quantity"></el-step>
          <el-step title="Checkout"></el-step>
        </el-steps>
      </v-col>
    </v-row>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
};
</script>

<style scoped></style>
