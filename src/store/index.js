import { createStore } from "vuex";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default createStore({
  namespaced: true,
  state() {
    return {
      mobile: false,
      component: "",
      external: ["/auth/sign-in", "/auth/sign-up", "/auth/otp", "/auth"],
    };
  },
  actions,
  getters,
  mutations,
});
