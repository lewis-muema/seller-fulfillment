<template>
  <div class="auth-container">
    <img
      src="https://images.sendyit.com/fulfilment/seller/sendy_logo.png"
      class="auth-sendy-logo"
      alt="logo"
    />
    <v-container>
      <v-row
        no-gutters
        style="flex-wrap: nowrap"
        class="desktop-signup-content"
      >
        <v-col
          cols="12"
          sm="6"
          style="min-width: 100px"
          class="flex-grow-0 flex-shrink-1"
        >
          <p class="mt-5">
            Sendy is such a game changer for my business, it <br />
            takes away the stress of delivery. My life has <br />
            never been this easy. I recommend this solution <br />
            to anyone running an online store.
          </p>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          style="min-width: 100px"
          class="flex-grow-0 flex-shrink-1"
        >
          <router-view></router-view>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.auth-container {
  background-image: url("@/assets/Rectangle.png");
  background-repeat: no-repeat;
  max-width: 100% !important;
  object-fit: contain;
}
.auth-sendy-logo {
  width: 70px;
  margin: 30px !important;
}
</style>
