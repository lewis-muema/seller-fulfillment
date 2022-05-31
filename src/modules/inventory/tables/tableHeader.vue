<template>
  <thead>
    <tr>
      <th v-for="(header, index) in header" :key="index" class="table-headers">
        {{ header }}
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: ["header"],
};
</script>

<style scoped>
.table-headers {
  font-size: 15px !important;
  font-weight: 400;
}
</style>
