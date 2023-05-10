import axios from "axios";

const usePlatform = () => {
  const savePlatform = (payload) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.MERCHANT_GATEWAY}api2cart/stores`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.accessToken
              ? localStorage.accessToken
              : "",
            "fulfilment-token": localStorage.accessToken,
          },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((e) => {
          if (e.isAxiosError) {
            reject(e.response.data);
          }
          reject(e);
        });
    });
  };

  return {
    savePlatform,
  };
};

export default usePlatform;
