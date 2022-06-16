<template>
  <div class="changeLanguage-container">
    <label for="languages" class="changeLanguage-label">
      {{ $t("settings.changePreferredLanguage") }}
    </label>
    <v-select
      class="changeLanguage-field"
      id="languages"
      :items="getLanguages"
      v-model="defaultLanguage"
      outlined
    ></v-select>
    <v-btn class="changeLanguage-save">
      {{ $t("settings.saveChanges") }}
    </v-btn>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  watch: {
    defaultLanguage(val) {
      this.setDefaultLanguage(val);
    },
  },
  computed: {
    ...mapGetters(["getLanguages", "getDefaultLanguage"]),
  },
  data() {
    return {
      defaultLanguage: "English",
    };
  },
  mounted() {
    this.defaultLanguage = this.getDefaultLanguage;
  },
  methods: {
    ...mapMutations(["setComponent", "setLoader", "setDefaultLanguage"]),
  },
};
</script>

<style>
.changeLanguage-container {
  width: 50%;
  padding: 10px 60px;
}
.changeLanguage-label {
  font-size: 14px;
  font-weight: 500;
}
.changeLanguage-save {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 40px;
  height: 50px !important;
  background: #324ba8;
  color: white !important;
  text-transform: inherit;
  letter-spacing: 0px;
  font-size: 16px;
}
.changeLanguage-field .v-input__control {
  border: 1px solid #c5c5c5;
  border-radius: 5px;
  background: white;
  --v-input-padding-top: 10px;
}
</style>
