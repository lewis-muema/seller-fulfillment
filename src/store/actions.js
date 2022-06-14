import axios from "axios";

export default {
  requestAxiosPost(_, payload) {
    const config = {
      headers: {
        "Content-Type": "application/json",
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
  async signupUser({ dispatch, commit }, payload) {
    try {
      const res = await dispatch("requestAxiosPost", payload);
      commit("setUserData", res.data);
      return res.data;
    } catch (error) {
      return error.response;
    }
  },
};
