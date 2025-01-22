import axios from "axios";
import { api_url } from "@/config/config";

export const axiosInstance = axios.create({
  baseURL: api_url,
});
