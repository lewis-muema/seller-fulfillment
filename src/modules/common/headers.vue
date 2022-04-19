<template>
  <div class="header-container">
    <div class="header-section-left">Placeholder</div>
    <div class="header-section-right">
      <div></div>
      <div>
        <v-menu transition="slide-y-transition" bottom right v-model="menu">
          <template v-slot:activator="{ props }">
            <v-btn dark v-bind="props"> {{ lang }} </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(langs, i) in languages" :key="i">
              <v-list-item-title @click="showLangs(langs)">{{
                langs.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div>
        <v-menu transition="slide-y-transition" bottom right v-model="menu">
          <template v-slot:activator="{ props }">
            <v-btn dark v-bind="props"> {{ lang }} </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(langs, i) in languages" :key="i">
              <v-list-item-title @click="showLangs(langs)">{{
                langs.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div>
        <v-menu transition="slide-y-transition" bottom right v-model="menu">
          <template v-slot:activator="{ props }">
            <v-btn dark v-bind="props"> {{ lang }} </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(langs, i) in languages" :key="i">
              <v-list-item-title @click="showLangs(langs)">{{
                langs.title
              }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
      drawer: true,
      languages: [
        {
          title: "English",
          locale: "en",
        },
        {
          title: "French",
          locale: "fr",
        },
      ],
      lang: "English",
      rail: false,
    };
  },
  methods: {
    showLangs(lang) {
      this.lang = lang.title;
      this.menu = false;
      window.dispatchEvent(
        new CustomEvent("language-changed", { detail: lang.locale })
      );
    },
  },
};
</script>

<style>
.header-container {
  display: grid;
  grid-template-columns: auto auto;
}
.header-section-right {
  display: grid;
  grid-template-columns: 30% 20% 20% 30%;
}
</style>
