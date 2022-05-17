<template>
  <thead>
    <tr>
      <th v-for="(header, index) in header" :key="index">
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

<style scoped></style>
