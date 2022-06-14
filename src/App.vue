<template>
  <v-app>
    <v-main>
      <Canvas />
    </v-main>
  </v-app>
</template>

<script>
import Canvas from "./components/canvas.vue";
export default {
  name: "App",
  components: { Canvas },
  data: () => ({
    //
  }),
};
</script>

<style>
#app {
  font-family: "DM Sans";
}
.v-btn--variant-contained {
  box-shadow: 0px 0px 2px 0px rgb(0 0 0 / 20%),
    0px 0px 10px 0px rgb(0 0 0 / 14%), 0px 0px 10px 0px rgb(0 0 0 / 12%) !important;
}
.v-list {
  font-family: "DM sans";
  box-shadow: 0px 0px 2px 0px rgb(0 0 0 / 20%),
    0px 0px 10px 0px rgb(0 0 0 / 14%), 0px 0px 10px 0px rgb(0 0 0 / 12%);
}
.v-list-item-title {
  font-size: 14px !important;
  cursor: pointer;
}
.v-main__wrap {
  background: #fcfdff;
}
.container-border {
  border: 1px solid #e2e7ed;
  margin-left: 30px;
  margin-right: 40px;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px 0px;
  background: white;
}
</style>
