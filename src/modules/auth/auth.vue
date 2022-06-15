<template>
  <div class="auth-container">
    <div class="auth-background" />
    <v-container class="auth-container-inner">
      <v-row
        no-gutters
        style="flex-wrap: nowrap"
        class="desktop-signup-content"
      >
        <v-col
          cols="12"
          md="6"
          style="min-width: 100px"
          class="flex-grow-0 flex-shrink-1"
        >
          <img
            src="https://images.sendyit.com/fulfilment/seller/sendy_logo.png"
            class="auth-sendy-logo"
            alt="logo"
          />
          <carousel :items-to-show="1" :autoplay="2000">
            <slide
              v-for="slide in slides"
              :key="slide.title"
              class="slider mt-3"
            >
              <i class="mdi mdi-format-quote-close desktop-auth-icon"></i>
              <div class="slider-content">{{ slide.content }}</div>
              <br />
              <div class="d-flex">
                <v-avatar>
                  <img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                    alt="John"
                  />
                </v-avatar>
                <div class="testimonal-container">
                  <div class="testimonial-name">{{ slide.name }}</div>
                  <div>{{ slide.businessName }}</div>
                </div>
              </div>
            </slide>
            <template #addons>
              <pagination />
            </template>
          </carousel>
        </v-col>
        <v-col
          cols="12"
          md="6"
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
                {{ $t("auth.english") }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a class="dropdown-item" href="#">{{ $t("auth.french") }}</a>
                </li>
              </ul>
            </div>
            <!-- <div class="edit-product-weight-right">
              <v-select
                class="edit-product-weight-field"
                :items="languages"
                v-model="language"
                outlined
              ></v-select>
            </div> -->
            <router-view></router-view>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";
export default {
  components: {
    Carousel,
    Slide,
    Pagination,
  },
  data: () => ({
    languages: ["English", "French"],
    language: "English",
    region: "",
    slides: [
      {
        content:
          "Sendy is such a game changer for my business, it takes away the stress of delivery. My life has never been this easy. I recommend this solution to anyone running an online store.",
        name: "Jane Mully",
        businessName: "Business owner, Smart Collections",
        profilePhoto: "",
      },
      {
        content:
          "Sendy is such a game changer for my business, it takes away the stress of delivery. My life has never been this easy. I recommend this solution to anyone running an online store.",
        name: "Jane Mully",
        businessName: "Business owner, Smart Collections",
        profilePhoto: "",
      },
    ],
  }),
};
</script>

<style scoped>
.auth-container {
  width: 100%;
  margin: auto;
  background-image: url(https://images.sendyit.com/fulfilment/seller/background.png);
  background-size: 100%;
  display: flex;
  align-items: flex-start;
  height: 100vh;
  padding-top: 50px;
}
.auth-sendy-logo {
  width: 90px;
}
.slider {
  flex-direction: column !important;
}
.slider-content {
  text-align: left !important;
  font-size: 18px;
}
.carousel {
  margin-top: 10%;
}
.testimonal-container {
  text-align: left !important;
  padding-left: 20px;
}
.carousel__slide {
  align-items: flex-start !important;
}
.desktop-auth-icon {
  background: #d3ddf6;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #324ba8;
  margin: 0px 10px 20px 0px;
  font-size: 35px;
}
.carousel__pagination-button {
  border-radius: 50% !important;
  color: #fff !important;
}
.testimonial-name {
  color: #606266;
  font-size: 15px;
}
.carousel__pagination {
  justify-content: left !important;
}
ol,
ul {
  padding: 0px !important;
}
</style>
