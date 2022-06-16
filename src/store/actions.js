/* eslint-disable no-unused-vars */
import axios from "axios";

export default {
  requestAxiosPost({ commit }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.token ? JSON.parse(localStorage.token) : "",
      },
    };
    return new Promise((resolve) => {
      axios
        .post(`${payload.app}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
          return false;
        });
    });
  },
  requestAxiosGet({ commit }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.token ? JSON.parse(localStorage.token) : "",
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
  requestAxiosPut({ commit }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.token ? JSON.parse(localStorage.token) : "",
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
  requestAxiosPatch({ commit }, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.token ? JSON.parse(localStorage.token) : "",
      },
    };
    return new Promise((resolve, reject) => {
      axios
        .patch(`${payload.app}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
          return false;
        });
    });
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
