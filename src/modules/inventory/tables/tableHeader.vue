<template>
  <thead>
    <tr>
      <th v-for="(header, index) in header" :key="index" class="table-headers">
        {{ header.title ? $t(header.title) : "" }}
        <el-tooltip
          v-if="header.description"
          class="box-item"
          effect="light"
          :content="$t(header.description)"
          placement="top"
        >
          <i
            v-if="header.description"
            class="mdi mdi-information-outline product-info"
          ></i>
        </el-tooltip>
      </th>
    </tr>
  </thead>
</template>

<script>
export default {
  props: ["header"],
};
</script>

<style>
.table-headers {
  font-size: 15px !important;
  font-weight: 400;
}
.product-info {
  color: #324ba8;
  cursor: pointer;
}
</style>
