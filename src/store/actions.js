import axios from "axios";

export default {
  requestAxiosPost(_, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .post(`${payload.app}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response);
          return false;
        });
    });
  },
  requestAxiosGet(_, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return new Promise((resolve) => {
      axios
        .get(`${payload.app}${payload.endpoint}`, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
          return false;
        });
    });
  },
  requestAxiosPut(_, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return new Promise((resolve) => {
      axios
        .put(`${payload.app}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
          return false;
        });
    });
  },
  setErrorAction({ commit }, payload) {
    let errors = {};
    payload.forEach((el) => {
      errors["message"] = el.message;
    });
    commit("setErrors", errors);
  },

  async signupUser({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      commit("setUserData", res.data.data);
      return res;
    } catch (error) {
      await dispatch("setErrorAction", error.data.errors);
      return error.response;
    }
  },
  async loginUser({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      commit("setLoginData", res.data.data);
      return res;
    } catch (error) {
      await dispatch("setErrorAction", error.data.errors);
      return error.response;
    }
  },
  async attemptLogin({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      commit("setSession", res.data.data);
      return res;
    } catch (error) {
      await dispatch("setErrorAction", error.data.errors);
      return error.response;
    }
  },
  async confirmUser({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      console.log("confirm user", res);
      commit("setConfirmedUser", res.data);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  async businessUserDetails({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPut", payload);
      commit("setBusinessUserDetails", res.data);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  async industries({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosGet", payload);
      commit("setIndustries", res.data.data);
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
};
