<template>
  <div>
    <p>Ongoing deliveries</p>
    <el-tabs class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane v-for="tab in tabs" :key="tab.label" :label="tab.label">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabs: [
        {
          label: "To your Customers",
          icon: "",
        },
        {
          label: "To Sendy",
          icon: "",
        },
      ],
      deliveries: [
        {
          customerInfo: {
            name: "James Doe",
            location: "Windsor heights",
          },
          progress: {
            label: "Package is on the way",
            step: 0,
          },
          action: "Track order",
        },
      ],
    };
  },
  methods: {
    handleClick(tab) {
      console.log(tab);
    },
  },
};
</script>

<style scoped></style>
