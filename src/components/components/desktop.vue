<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-card>
      <v-layout>
        <v-navigation-drawer
          v-model="drawer"
          :rail="rail"
          permanent
          @click="rail = false"
        >
          <v-list-item
            prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
            title="John Leider"
          >
            <template v-slot:append>
              <v-btn
                variant="text"
                icon="mdi-chevron-left"
                @click.stop="rail = !rail"
              ></v-btn>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-list density="compact" nav>
            <v-list-item
              prepend-icon="mdi-home-city"
              title="Home"
              value="home"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-account"
              title="My Account"
              value="account"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-account-group-outline"
              title="Users"
              value="users"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-apps"
              :title="$t('dashboard')"
              :value="$t('dashboard')"
            ></v-list-item>
          </v-list>
        </v-navigation-drawer>
        <v-main style="height: 100vh" class="text-right">
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
        </v-main>
      </v-layout>
    </v-card>
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
.side-panel-left {
  height: 100%;
}
.nav-open {
  width: 200px !important;
}
.nav-closed {
  width: 80px !important;
}
</style>
