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
};
