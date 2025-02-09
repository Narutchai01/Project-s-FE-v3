import axios from "axios";
import { api_url } from "@/config/config";

export const axiosInstance = axios.create({
  baseURL: api_url !== undefined ? api_url : "http://localhost:8080/api",
});
