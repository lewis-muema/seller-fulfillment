import { createStore } from "vuex";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default createStore({
  namespaced: true,
  state() {
    return {
      mobile: false,
    };
  },
  actions,
  getters,
  mutations,
});
