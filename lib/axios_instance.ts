import axios from "axios";
import { api_url } from "@/config/config";

export const axiosInstance = axios.create({
  baseURL: api_url,
  timeout: 0, // 30 seconds timeout
});

axiosInstance.interceptors.response.use(undefined, async (error) => {
  const { config, response } = error;

  if (response?.status === 524 && !config._retry) {
    config._retry = true;
    return axiosInstance(config);
  }

  return Promise.reject(error);
});
