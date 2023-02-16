/* eslint-disable no-unused-vars */
import axios from "axios";
import jwt_decode from "jwt-decode";
import router from "../router";
import { ElNotification } from "element-plus";
import moment, { duration } from "moment";

let errorRefreshStatus = true;

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
  requestAxiosPostMerchant({ dispatch }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.accessToken ? localStorage.accessToken : "",
        "Fulfilment-Token": localStorage.accessToken
          ? localStorage.accessToken
          : "",
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

    const { params } = payload;

    const values = {
      params,
      headers: config.headers,
    };
    for (const value in values) {
      if (values[value] === null || values[value] === undefined) {
        delete values[value];
      }
    }
    return new Promise((resolve, reject) => {
      axios
        .get(`${payload.app}${payload.endpoint}`, values)
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

  handleErrors({ dispatch, commit }, error) {
    commit("setLoader", "loading-text");
    dispatch("setErrorAction", error.response.data?.errors);

    if (error.response.status === 403 && errorRefreshStatus) {
      dispatch("refreshToken", error);
      errorRefreshStatus = false;
    }
    if (error.response.status === 502) {
      console.log(error);
    }
    if (
      error.response.status === 404 &&
      error.response.config.url.includes("token")
    ) {
      router.push("/auth/sign-in");
    }
    if (
      error.response.status === 404 &&
      ["business.notfound", "user.notfound"].includes(
        error.response.data.errors[0].message
      )
    ) {
      router.push("/auth/sign-in");
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
        errors["value"] = el.value ? el.value : "";
      });
      commit("setErrors", errors);
    }
  },

  async refreshToken({ dispatch }) {
    let refreshStatus = false;
    if (localStorage.tokenCreated && localStorage.tokenDuration) {
      const duration = parseInt(
        new Date().valueOf() - localStorage.tokenCreated
      );
      refreshStatus =
        duration <
        moment.duration(localStorage.tokenDuration, "days").asMilliseconds();
    }
    const payload = {
      app: process.env.AUTH,
      endpoint: "token",
      values: {
        refresh_token: localStorage.refreshToken,
        access_token: localStorage.accessToken,
      },
    };
    try {
      const res = await dispatch("requestAxiosPost", payload);
      if (res.status === 200 && refreshStatus) {
        localStorage.accessToken = res.data;
        localStorage.tokenCreated = new Date().valueOf();
        router.go(0);
      } else {
        router.push("/auth/sign-in");
      }
    } catch (error) {
      const err = error;
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
  async listCountries({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosGet", payload);
      commit("setCountries", res.data.data.countries);
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async activityLogs({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosGet", payload);
      commit("setActivityLog", res.data.data.user_action_logs);
      commit("setBusinessUsers", res.data.data.users);
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
  async updateOrderTrackingData({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPatch", payload);
      return res;
    } catch (error) {
      return error.response;
    }
  },
  async connectStore({ dispatch }, payload) {
    try {
      const res = await dispatch("requestAxiosPostMerchant", payload);
      return res;
    } catch (error) {
      return error.response;
    }
  },
};
