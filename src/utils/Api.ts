import { BASE_URL } from "./../../config";
import { Storage } from "./storage"; // Adjust the import path as necessary
import auth0 from "./auth";
import axios from "axios";

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(
  async (config) => {
    console.log(JSON.stringify(config));
    return config;
  },
  (error) => {
    console.error("Error while setting up axios request interceptor,", error);
  }
);

instance.interceptors.response.use(
  (response) => response, // Return the response directly on success
  async (error) => {
    console.log("err", error?.message);
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as already tried
      const authDataString = await Storage.getItem("authData");
      const authData = JSON.parse(authDataString || "{}");
      if (authData && authData.refreshToken) {
        try {
          // Attempt to refresh the token
          const newCredentials = await auth0.auth.refreshToken({
            refreshToken: authData.refreshToken,
            scope: "openid profile email offline_access",
          });
          const updatedAuthData = {
            ...authData,
            ...newCredentials,
          };
          // Update local storage with new credentials
          await Storage.setItem("authData", JSON.stringify(updatedAuthData));
          // Optionally, update Redux store with new credentials
          // useDispatch()(setAuthData(newCredentials)); // Note: useDispatch cannot be used outside of a component
          // Update the original request with the new access token
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${updatedAuthData.idToken}`;
          setToken(updatedAuthData.idToken);
          // Retry the original request with the new token
          return axios(originalRequest);
        } catch (refreshError) {
          // Handle failed refresh here (e.g., redirect to login)
          console.error("Token refresh failed:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }
    // Return any error which is not due to authorization to the caller
    return Promise.reject(error);
  }
);

export function setToken(token: string) {
  instance.defaults.headers.common["Authorization"] = "Bearer " + token;
}

export default instance;
