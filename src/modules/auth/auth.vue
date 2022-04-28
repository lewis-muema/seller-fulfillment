<template>
  <div class="auth-container">
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
          <img
            src="https://images.sendyit.com/fulfilment/seller/sendy_logo.png"
            class="auth-sendy-logo"
            alt="logo"
          />
          <p class="">
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
          <v-card class="mx-auto mt-5" width="80%">
            <div class="dropdown language-dropdown">
              <button
                class="btn dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                English
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><a class="dropdown-item" href="#">French</a></li>
              </ul>
            </div>
            <router-view></router-view>
          </v-card>
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
  background: #f7f9fc;
  width: 100%;
  margin: auto;
  position: relative;
  height: 300px;
}
.auth-container::after {
  content: "";
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: inherit;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  transform-origin: top right;
  transform: skewY(-11deg);
}
.auth-sendy-logo {
  width: 70px;
  margin: 30px !important;
}
</style>
