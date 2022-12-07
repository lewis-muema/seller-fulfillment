<template>
  <div>
    <div class="integrations-container">
      <v-container>
        <v-row no-gutters>
          <v-col :key="n" cols="12" sm="6">
            <v-sheet class="ma-2 pa-2">
              <div
                class="d-flex justify-space-around align-center bg-grey-lighten-4"
              >
                <div class="ma-4">
                  <v-img
                    class="bg-white"
                    width="400"
                    :aspect-ratio="1"
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                    cover
                  ></v-img>
                </div>
              </div>
            </v-sheet>
          </v-col>
          <v-col :key="n" cols="12" sm="6">
            <v-sheet class="ma-2 pa-2">
              <h4>{{ $t("merchant.connectStore") }}</h4>
              <div>
                <p class="integrations-text">
                  {{ $t("merchant.clickToStart") }}
                </p>
                <div class="integrations-actions-inner">
                  <v-btn class="sendy-btn-text" variant="text">
                    {{ $t("merchant.requirements") }}
                  </v-btn>
                  <v-btn
                    class="sendy-btn-default"
                    @click="
                      $router.push('/settings/integrations/store-platform')
                    "
                  >
                    {{ $t("merchant.getStarted") }}
                  </v-btn>
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style>
.integrations-container {
  margin: 40px;
}
.integrations-actions-inner {
  display: grid;
  grid-auto-flow: column;
}
.integrations-text {
  margin-top: 30px;
  margin-bottom: 160px;
}
.sendy-btn-text {
  text-transform: capitalize;
  text-decoration: underline;
  justify-content: left;
  color: #324ba8 !important;
  margin: 8px 25px;
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
}
.sendy-btn-default {
  margin: 8px 25px;
  text-transform: inherit;
  font-size: 14px;
  letter-spacing: 0px;
  color: #ffffff !important;
  border: 1px solid #324ba8 !important;
  background-color: #324ba8 !important;
}
</style>
