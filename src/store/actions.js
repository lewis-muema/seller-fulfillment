/* eslint-disable no-unused-vars */
import axios from "axios";
import jwt_decode from "jwt-decode";
import router from "../router";
import { ElNotification } from "element-plus";

export default {
  async initializeAuth({ commit }) {
    const token = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token !== null && token !== "") {
      const userData = jwt_decode(token);
      commit("setSession", userData);
    }
    commit("setAccessToken", token);
    commit("setRefreshToken", refreshToken);
  },

  requestAxiosPost({ dispatch }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.accessToken ? localStorage.accessToken : "",
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .post(`${payload.app}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          dispatch("handleErrors", error);
          resolve(error);
          return false;
        });
    });
  },
  requestAxiosGet({ dispatch }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.accessToken ? localStorage.accessToken : "",
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${payload.app}${payload.endpoint}`, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          dispatch("handleErrors", error);
          resolve(error);
          return false;
        });
    });
  },
  requestAxiosPut({ dispatch }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.accessToken ? localStorage.accessToken : "",
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .put(`${payload.app}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          dispatch("handleErrors", error);
          resolve(error);
          return false;
        });
    });
  },

  requestAxiosPatch({ dispatch }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.accessToken ? localStorage.accessToken : "",
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .patch(`${payload.app}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          dispatch("handleErrors", error);
          resolve(error);
          return false;
        });
    });
  },

  handleErrors({ dispatch }, error) {
    dispatch("setErrorAction", error.response.data.errors);
    if (error.response.status === 403) {
      router.push("/auth/sign-in");
      router.go(0);
    }
    if (
      error.response.status === 500 &&
      router.currentRoute.value.path ===
        "/inventory/send-inventory/customer/checkout"
    ) {
      router.push("/inventory/send-inventory/customer/select-products");
    }
    if (error.response.status === 502) {
      console.log(error);
    }
  },

  async custom_headers({ state }, fileUpload) {
    const authToken = state.accessToken
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
    if (payload) {
      payload.forEach((el) => {
        errors["message"] = el.message;
      });
      commit("setErrors", errors);
    }
  },

  async signupUser({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      commit("setUserData", res.data.data);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  async loginUser({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      commit("setLoginData", res.data.data);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  async attemptLogin({ dispatch }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      return res;
    } catch (error) {
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
