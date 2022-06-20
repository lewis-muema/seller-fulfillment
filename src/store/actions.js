import axios from "axios";
import jwt_decode from "jwt-decode";

export default {
  async initAuth({ commit }) {
    const token = localStorage.getItem("accessToken");
    console.log("token", token);
    const refreshToken = localStorage.getItem("refreshToken");

    if (token !== null && token !== "") {
      const userData = jwt_decode(token);
      commit("setSession", userData);
    }
    commit("setAccessToken", token);
    commit("setRefreshToken", refreshToken);
  },

  async requestAxiosPost({ dispatch }, payload) {
    const { fileUpload } = payload;

    const config = await dispatch("custom_headers", fileUpload);
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
  async requestAxiosPut({ dispatch }, payload) {
    const { fileUpload } = payload;

    const config = await dispatch("custom_headers", fileUpload);
    return new Promise((resolve, reject) => {
      axios
        .put(`${payload.app}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error.response);
          return false;
        });
    });
  },
  async custom_headers({ state }, fileUpload) {
    const authToken = !state.accessToken
      ? localStorage.getItem("accessToken")
      : state.accessToken;

    const param = {
      headers: {
        "Content-Type": fileUpload ? "multipart/form-data" : "application/json",
        Accept: "application/json",
        Authorization: authToken,
      },
    };

    return param;
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
  async attemptLogin({ dispatch }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      return res;
    } catch (error) {
      await dispatch("setErrorAction", error.data.errors);
      return error.response;
    }
  },
  async confirmUser({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
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
