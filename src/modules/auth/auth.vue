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
          <div class="carousel-container">
            <div class="carousel-top">
              <div v-for="(slide, i) in slides" :key="slide.title">
                <div v-if="i === activeSlide" class="carousel-top-parent">
                  <div class="carousel-inner">
                    <i class="mdi mdi-format-quote-close desktop-auth-icon"></i>
                    <div class="slider-content">{{ $t(slide.content) }}</div>
                    <br />
                    <div class="d-flex">
                      <v-avatar class="testimonial-img-container">
                        <img
                          class="testimonial-img"
                          v-if="slide.profilePhoto"
                          :src="slide.profilePhoto"
                          alt="John"
                        />
                      </v-avatar>
                      <div class="testimonal-container">
                        <div class="testimonial-name">{{ $t(slide.name) }}</div>
                        <div>
                          {{ $t(slide.position) }}, {{ $t(slide.businessName) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="d-flex">
              <div v-for="(slide, i) in slides" :key="slide.title">
                <div
                  class="paginator"
                  :class="i === activeSlide ? 'paginator-active' : ''"
                  @click="activeSlide = i"
                ></div>
              </div>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          style="min-width: 100px"
          class="flex-grow-0 flex-shrink-1"
        >
          <v-card class="mx-auto mt-5" width="80%">
            <el-select
              class="sign-in-language-select"
              id="industry"
              v-model="defaultLanguage"
              @change="changeLanguage()"
            >
              <el-option
                v-for="lang in getLanguages"
                :key="lang.value"
                :label="lang.title"
                :value="lang.value"
              >
              </el-option>
            </el-select>
            <router-view></router-view>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import "vue3-carousel/dist/carousel.css";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {},
  data: () => ({
    languages: ["English", "French"],
    language: "English",
    defaultLanguage: "en",
    region: "",
    slides: [],
    activeSlide: 0,
  }),
  computed: {
    ...mapGetters(["getLanguages", "getDefaultLanguage"]),
  },
  mounted() {
    this.slides = [
      {
        name: "auth.priscillaNjenga",
        content: "auth.withinTheFirstMonth",
        position: "auth.CEORoyalBrekkersLtd",
        businessName: "auth.mohawk",
        profilePhoto:
          "https://images.sendyit.com/fulfilment/seller/MohawkKombucha.jpg",
      },
      {
        name: "auth.FelixAsenji",
        content: "auth.ourSalesIncreased",
        position: "auth.CEOKenyaPapayaProducts",
        businessName: "auth.deinaProducts",
        profilePhoto:
          "https://images.sendyit.com/fulfilment/seller/DeinaProducts.jpg",
      },
      {
        name: "auth.AliceMaina",
        content: "auth.weAreNowAbleToDeliver",
        position: "auth.digitalSalesRepStorymojaPublishers",
        businessName: "auth.storymojaPublishers",
        profilePhoto:
          "https://images.sendyit.com/fulfilment/seller/StorymojaPublishers.jpg",
      },
      {
        name: "auth.lonahJoyce",
        content: "auth.growthIsEverything",
        position: "auth.CEOBinti",
        businessName: "auth.bintiSanitaryPads",
        profilePhoto: "https://images.sendyit.com/fulfilment/seller/Binti.jpg",
      },
    ];
    this.changeSlides();
    this.defaultLanguage = this.getDefaultLanguage;
  },
  methods: {
    ...mapMutations(["setLanguages", "setDefaultLanguage"]),
    changeLanguage() {
      this.setDefaultLanguage(this.defaultLanguage);
    },
    changeSlides() {
      setInterval(() => {
        this.activeSlide =
          this.activeSlide < this.slides.length - 1
            ? (this.activeSlide += 1)
            : 0;
      }, 7000);
    },
  },
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
  overflow: scroll !important;
}
.auth-sendy-logo {
  width: 90px;
}
.slider {
  flex-direction: column !important;
}
.slider-content {
  text-align: left !important;
  font-size: 19px;
  margin-bottom: 5px;
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
.sign-in-language-select {
  width: 100px;
  margin-left: auto;
  margin-right: 55px;
  margin-top: 40px;
}
.testimonial-img-container {
  width: 60px !important;
  height: 60px !important;
}
.testimonial-img {
  width: 100%;
}
.carousel__pagination-button {
  background-color: #d1ddf8 !important;
}
.carousel__pagination-button--active {
  background-color: #324ba8 !important;
}
.paginator {
  width: 10px;
  height: 10px;
  border: 2px solid #324ba8;
  border-radius: 10px;
  margin: 5px;
  cursor: pointer;
}
.paginator-active {
  background: #324ba8;
}
.carousel-container {
  height: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.carousel-top {
  height: 300px;
  position: relative;
}
.carousel-top-parent {
  position: relative;
  width: 500px;
  overflow: hidden;
  height: 300px;
}
.carousel-inner {
  position: absolute;
  right: -500px;
  height: 300px;
  -webkit-animation: slide 0.5s forwards;
  animation: slide 0.5s forwards;
}
@-webkit-keyframes slide {
  100% {
    right: 0;
  }
}
@keyframes slide {
  100% {
    right: 0;
  }
}
</style>
